const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Resume = require('../models/Resume');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { extractText, parseResumeText } = require('../services/parser');
const { analyzeResume } = require('../services/ai');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
  }
});

// Multer File Filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (
    file.mimetype === 'application/pdf' || 
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    allowedExtensions.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOCX formats are supported.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// @desc    Upload & Analyze Resume
// @route   POST /api/resumes/upload
// @access  Private (Candidate only)
router.post('/upload', protect, authorize('candidate'), upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a resume file' });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    console.log(`Processing file: ${req.file.filename}`);

    // 1. Extract text from document
    let text = '';
    try {
      text = await extractText(filePath, mimeType);
    } catch (parseError) {
      console.error(parseError);
      // Clean up uploaded file if extraction fails
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({ success: false, message: `Failed to extract text: ${parseError.message}` });
    }

    if (!text || text.trim().length === 0) {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(400).json({ success: false, message: 'Extracted text is empty. The resume might be scanned/image-only.' });
    }

    // 2. Perform local heuristic parsing
    const parsedInfo = parseResumeText(text);

    // 3. Perform AI analysis (Gemini or Local Fallback)
    const analysis = await analyzeResume(text, parsedInfo);

    // 4. Save to Database
    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`, // relative path for static hosting if needed
      rawText: text,
      extractedInfo: analysis.extractedInfo || parsedInfo,
      aiAnalysis: {
        resumeScore: analysis.resumeScore || 0,
        atsScore: analysis.atsScore || 0,
        strengths: analysis.strengths || [],
        weaknesses: analysis.weaknesses || [],
        suggestedImprovements: analysis.suggestedImprovements || [],
        summarizedProfile: analysis.summarizedProfile || ''
      }
    });

    // 5. Update user's profile skills with parsed skills
    const user = await User.findById(req.user._id);
    if (user && resume.extractedInfo.skills && resume.extractedInfo.skills.length > 0) {
      // Merge unique skills
      const existingSkillsSet = new Set(user.skills.map(s => s.toLowerCase()));
      resume.extractedInfo.skills.forEach(skill => {
        if (!existingSkillsSet.has(skill.toLowerCase())) {
          user.skills.push(skill);
        }
      });
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: 'Resume uploaded and analyzed successfully',
      data: resume
    });

  } catch (error) {
    console.error('Error uploading/analyzing resume:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get current user's latest resume analysis
// @route   GET /api/resumes/my-resume
// @access  Private (Candidate only)
router.get('/my-resume', protect, authorize('candidate'), async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });
    
    if (!resume) {
      return res.status(200).json({ success: true, data: null, message: 'No resume uploaded yet' });
    }

    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Delete user resume
// @route   DELETE /api/resumes/my-resume
// @access  Private (Candidate only)
router.delete('/my-resume', protect, authorize('candidate'), async (req, res) => {
  try {
    const resume = await Resume.findOne({ user: req.user._id }).sort({ createdAt: -1 });

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Try to delete physical file
    const absoluteFilePath = path.join(__dirname, '..', resume.filePath);
    if (fs.existsSync(absoluteFilePath)) {
      fs.unlinkSync(absoluteFilePath);
    } else {
      // Try using filePath directly in case path config is absolute
      if (fs.existsSync(resume.filePath)) {
        fs.unlinkSync(resume.filePath);
      }
    }

    await Resume.findByIdAndDelete(resume._id);

    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    View / Download Resume
// @route   GET /api/resumes/:id
// @access  Private (Employer only)
router.get("/:id", protect, authorize("employer"), async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const absolutePath = path.join(__dirname, "..", resume.filePath);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({
        success: false,
        message: "Resume file not found",
      });
    }

    res.download(absolutePath, resume.fileName);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// @desc    View / Download Resume
// @route   GET /api/resumes/:id
// @access  Private (Employer only)
router.get("/:id", protect, authorize("employer"), async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    // Absolute path of uploaded file
    const filePath = path.join(__dirname, "..", resume.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Resume file not found",
      });
    }

    // Open/Download file
    res.download(filePath, resume.fileName);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
