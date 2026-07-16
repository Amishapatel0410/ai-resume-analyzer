const express = require('express');
const router = express.Router();

const Job = require('../models/Job');
const Resume = require('../models/Resume');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// ==============================
// Helper function to normalize skills
// ==============================
const normalizeSkill = (skill) => {
  return skill
    .toLowerCase()
    .replace(/[.\-\s]/g, '') // node.js -> nodejs, react-native -> reactnative
    .trim();
};

// ==============================
// Skill Matching Logic
// ==============================
const calculateMatch = (candidateSkills, jobRequirements) => {
  if (!jobRequirements || jobRequirements.length === 0) {
    return {
      percentage: 100,
      matched: [],
      missing: []
    };
  }

  const normalizedCandidate = candidateSkills.map(normalizeSkill);

  const matched = [];
  const missing = [];

  jobRequirements.forEach((req) => {
    const normalizedReq = normalizeSkill(req);

    const isMatched = normalizedCandidate.some(
      (cand) =>
        cand === normalizedReq ||
        cand.includes(normalizedReq) ||
        normalizedReq.includes(cand)
    );

    if (isMatched) {
      matched.push(req);
    } else {
      missing.push(req);
    }
  });

  const percentage = Math.round(
    (matched.length / jobRequirements.length) * 100
  );

  return {
    percentage,
    matched,
    missing
  };
};

// =====================================================
// @desc    Get all jobs (with optional search)
// @route   GET /api/jobs
// @access  Public
// =====================================================
router.get('/', async (req, res) => {
  try {
    const { query } = req.query;

    let filter = {};

    if (query) {
      filter = {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { company: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          {
            requirements: {
              $in: [new RegExp(query, 'i')]
            }
          }
        ]
      };
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// =====================================================
// @desc    Get recommended jobs
// @route   GET /api/jobs/match
// @access  Candidate
// =====================================================
router.get(
  '/match',
  protect,
  authorize('candidate'),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      const resume = await Resume.findOne({
        user: req.user._id
      }).sort({ createdAt: -1 });

      let candidateSkills = [...(user.skills || [])];

      if (
        resume &&
        resume.extractedInfo &&
        resume.extractedInfo.skills
      ) {
        resume.extractedInfo.skills.forEach((skill) => {
          if (!candidateSkills.includes(skill)) {
            candidateSkills.push(skill);
          }
        });
      }

      const jobs = await Job.find({}).lean();

      const matchedJobs = jobs.map((job) => {
        const { percentage, matched, missing } = calculateMatch(
          candidateSkills,
          job.requirements
        );

        return {
          ...job,
          matchPercentage: percentage,
          matchedSkills: matched,
          missingSkills: missing
        };
      });

      matchedJobs.sort(
        (a, b) => b.matchPercentage - a.matchPercentage
      );

      res.json({
        success: true,
        count: matchedJobs.length,
        data: matchedJobs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

// =====================================================
// @desc    Post a new job
// @route   POST /api/jobs/post
// @access  Employer
// =====================================================
router.post(
  '/post',
  protect,
  authorize('employer'),
  async (req, res) => {
    try {
      const {
        title,
        company,
        location,
        type,
        description,
        requirements,
        salary
      } = req.body;

      if (
        !title ||
        !company ||
        !description ||
        !requirements
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Please provide title, company, description, and requirements'
        });
      }

      let reqsArray = requirements;

      if (typeof requirements === 'string') {
        reqsArray = requirements
          .split(',')
          .map((r) => r.trim())
          .filter((r) => r.length > 0);
      }

      const job = await Job.create({
        title,
        company,
        location: location || 'Remote',
        type: type || 'Full-time',
        description,
        requirements: reqsArray,
        salary: salary || 'Not Specified',
        postedBy: req.user._id
      });

      res.status(201).json({
        success: true,
        message: 'Job posted successfully',
        data: job
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

// =====================================================
// @desc    Get employer job postings
// @route   GET /api/jobs/my-postings
// @access  Employer
// =====================================================
router.get(
  '/my-postings',
  protect,
  authorize('employer'),
  async (req, res) => {
    try {
      const jobs = await Job.find({
        postedBy: req.user._id
      }).sort({ createdAt: -1 });

      res.json({
        success: true,
        count: jobs.length,
        data: jobs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

// =====================================================
// @desc    Apply to a job
// @route   POST /api/jobs/:id/apply
// @access  Candidate
// =====================================================
router.post(
  '/:id/apply',
  protect,
  authorize('candidate'),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      const alreadyApplied = job.applicants.some(
        (app) =>
          app.user.toString() === req.user._id.toString()
      );

      if (alreadyApplied) {
        return res.status(400).json({
          success: false,
          message: 'You have already applied to this job'
        });
      }

      const resume = await Resume.findOne({
        user: req.user._id
      }).sort({ createdAt: -1 });

      if (!resume) {
        return res.status(400).json({
          success: false,
          message:
            'Please upload a resume first before applying to jobs'
        });
      }

      const user = await User.findById(req.user._id);

      let candidateSkills = [...(user.skills || [])];

      if (
        resume.extractedInfo &&
        resume.extractedInfo.skills
      ) {
        resume.extractedInfo.skills.forEach((skill) => {
          if (!candidateSkills.includes(skill)) {
            candidateSkills.push(skill);
          }
        });
      }

      const { percentage } = calculateMatch(
        candidateSkills,
        job.requirements
      );

      job.applicants.push({
        user: req.user._id,
        resume: resume._id,
        matchPercentage: percentage
      });

      await job.save();

      res.json({
        success: true,
        message: 'Applied successfully',
        matchPercentage: percentage
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

// =====================================================
// @desc    Get applicants of a job
// @route   GET /api/jobs/:id/applicants
// @access  Employer
// =====================================================
router.get(
  '/:id/applicants',
  protect,
  authorize('employer'),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id)
        .populate('applicants.user', 'name email skills')
        .populate(
  'applicants.resume',
  'fileName filePath aiAnalysis extractedInfo'
);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      if (
        job.postedBy.toString() !==
        req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message:
            'Not authorized to view applicants for this job'
        });
      }

      const applicants = [...job.applicants].sort(
        (a, b) => b.matchPercentage - a.matchPercentage
      );

      res.json({
        success: true,
        data: {
          title: job.title,
          company: job.company,
          applicants
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

module.exports = router;
