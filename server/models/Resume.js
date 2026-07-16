const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  rawText: {
    type: String,
    required: true
  },
  extractedInfo: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    skills: { type: [String], default: [] },
    experience: { type: [String], default: [] },
    education: { type: [String], default: [] },
    projects: { type: [String], default: [] }
  },
  aiAnalysis: {
    resumeScore: { type: Number, default: 0 },
    atsScore: { type: Number, default: 0 },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    suggestedImprovements: { type: [String], default: [] },
    summarizedProfile: { type: String, default: '' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', ResumeSchema);
