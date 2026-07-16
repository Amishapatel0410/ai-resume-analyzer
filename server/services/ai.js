const { GoogleGenerativeAI } = require('@google/generative-ai');
const { parseResumeText } = require('./parser');

/**
 * Perform resume analysis using Gemini AI or Local Fallback
 * @param {string} rawText - Raw text extracted from resume
 * @param {object} parsedInfo - Already parsed metadata from local heuristic parser
 * @returns {Promise<object>} - Score, ATS analysis, strengths, weaknesses, suggestions
 */
const analyzeResume = async (rawText, parsedInfo) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim().length > 0) {
    try {
      console.log('Initiating Gemini AI Resume Analysis...');
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
        You are an expert recruiter and ATS (Applicant Tracking System) optimizer.
        Analyze the following raw resume text and provide a professional assessment.
        
        Resume Content:
        """
        ${rawText}
        """

        You MUST respond in JSON format matching the following structure:
        {
          "resumeScore": 85, // Integer between 0 and 100 representing overall quality
          "atsScore": 80,    // Integer between 0 and 100 representing ATS readability & keyword matching
          "strengths": ["list item 1", "list item 2"],
          "weaknesses": ["list item 1", "list item 2"],
          "suggestedImprovements": ["list item 1", "list item 2"],
          "summarizedProfile": "A short, professional summary paragraph of the candidate (2-3 sentences)",
          "extractedInfo": {
            "name": "Candidate Name", // Extract or guess name if possible
            "email": "email@example.com",
            "phone": "123-456-7890",
            "skills": ["Skill 1", "Skill 2"], // Extract technical and soft skills
            "experience": ["Company A - Job Title (Date)", "Company B - Job Title (Date)"], // List key experiences
            "education": ["University - Degree (Date)"], // List education
            "projects": ["Project A - Description"] // List projects
          }
        }

        Be objective, professional, and detailed. Ensure all fields in the JSON response are populated. Do not include markdown code block formatting like \`\`\`json. Return only the raw JSON.
      `;

      // Use system-enforced JSON response format if supported
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = result.response.text();
      console.log('Gemini Analysis Completed successfully.');
      const parsedAnalysis = JSON.parse(responseText);
      
      // Ensure skills and arrays are present and normalized
      if (!parsedAnalysis.extractedInfo) parsedAnalysis.extractedInfo = parsedInfo;
      if (!parsedAnalysis.extractedInfo.skills || parsedAnalysis.extractedInfo.skills.length === 0) {
        parsedAnalysis.extractedInfo.skills = parsedInfo.skills;
      }
      return parsedAnalysis;

    } catch (error) {
      console.error('Gemini AI error, falling back to local analysis:', error.message);
      // Fallback if API fails mid-request
      return getLocalAnalysisFallback(rawText, parsedInfo);
    }
  } else {
    console.log('No GEMINI_API_KEY configured. Running local fallback analysis.');
    return getLocalAnalysisFallback(rawText, parsedInfo);
  }
};

/**
 * Local Fallback Analyzer based on heuristics
 * @param {string} rawText 
 * @param {object} parsedInfo 
 * @returns {object}
 */
const getLocalAnalysisFallback = (rawText, parsedInfo) => {
  const textLower = rawText.toLowerCase();

  // 1. Calculate Resume Score
  let resumeScore = 45; // base score
  
  // Skill count addition
  const skillCount = parsedInfo.skills.length;
  resumeScore += Math.min(skillCount * 2.5, 25); // max 25 points

  // Contact info
  if (parsedInfo.email) resumeScore += 5;
  if (parsedInfo.phone) resumeScore += 5;

  // History completeness
  if (parsedInfo.education && parsedInfo.education.length > 0) resumeScore += 10;
  if (parsedInfo.experience && parsedInfo.experience.length > 0) resumeScore += 10;

  // Formatting (checking total text length)
  if (rawText.length > 800) resumeScore += 10;

  // Clamp resume score to 95 max for fallback
  resumeScore = Math.min(Math.round(resumeScore), 95);

  // 2. Calculate ATS Score
  let atsScore = 40; // base score

  // ATS prefers sections
  const hasSkillsSec = textLower.includes('skill');
  const hasEduSec = textLower.includes('education') || textLower.includes('academic');
  const hasExpSec = textLower.includes('experience') || textLower.includes('work') || textLower.includes('employment');
  const hasProjSec = textLower.includes('project') || textLower.includes('portfolio');

  if (hasSkillsSec) atsScore += 10;
  if (hasEduSec) atsScore += 10;
  if (hasExpSec) atsScore += 10;
  if (hasProjSec) atsScore += 10;

  // Contact info matches
  if (parsedInfo.email && parsedInfo.phone) atsScore += 10;

  // Keyword richness
  if (skillCount >= 8) atsScore += 10;

  atsScore = Math.min(Math.round(atsScore), 95);

  // 3. Generate suggestions based on findings
  const strengths = [];
  const weaknesses = [];
  const suggestedImprovements = [];

  // Evaluate strengths
  if (skillCount >= 8) {
    strengths.push('Excellent keyword density with a solid list of technical skills.');
  } else if (skillCount > 3) {
    strengths.push('Contains core professional skills needed for tech positions.');
  } else {
    strengths.push('Basic skills section identified.');
  }

  if (parsedInfo.email && parsedInfo.phone) {
    strengths.push('Contact information is clearly visible and easy to parse.');
  }

  if (hasExpSec && parsedInfo.experience.length > 2) {
    strengths.push('Demonstrates a strong trajectory of professional work history.');
  } else {
    strengths.push('Standard sections are clearly defined.');
  }

  // Evaluate weaknesses
  if (skillCount < 6) {
    weaknesses.push('Limited keyword diversity; missing relevant secondary technologies.');
    suggestedImprovements.push('Add more skills that reflect your tools, frameworks, and methodologies.');
  }

  if (!hasProjSec) {
    weaknesses.push('No dedicated projects section detected. It is crucial to display practical application.');
    suggestedImprovements.push('Create a "Projects" section detailing 2-3 recent technical items with GitHub/demo links.');
  }

  // Generic formatting checks
  const containsActionVerbs = ['managed', 'designed', 'built', 'led', 'created', 'implemented', 'optimized'].some(verb => textLower.includes(verb));
  if (!containsActionVerbs) {
    weaknesses.push('Lack of strong action verbs in work experience descriptions.');
    suggestedImprovements.push('Begin each experience bullet point with strong action verbs (e.g. Optimized, Created, Spearheaded).');
  }

  const containsMetrics = /\d+%/g.test(rawText) || /\$\d+/g.test(rawText) || /increased/i.test(rawText);
  if (!containsMetrics) {
    weaknesses.push('Experience descriptions lack quantifiable achievements or metrics.');
    suggestedImprovements.push('Quantify your contributions (e.g., "improved loading times by 30%", "managed 5-person team").');
  }

  if (!parsedInfo.email) {
    weaknesses.push('Could not isolate an email address in the header.');
    suggestedImprovements.push('Ensure your email address is listed prominently at the top of your resume.');
  }

  // Fill in default suggestions if arrays are sparse
  if (suggestedImprovements.length === 0) {
    suggestedImprovements.push('Consider tailoring resume keywords exactly to matching job descriptions.');
    suggestedImprovements.push('Keep resume structure in a clean single-column format to improve parsing accuracy.');
  }

  // Create profile summary
  let summarizedProfile = '';
  if (parsedInfo.skills.length > 0 && parsedInfo.experience.length > 0) {
    summarizedProfile = `A professional with expertise in ${parsedInfo.skills.slice(0, 3).join(', ')}. Demonstrated experience in roles such as ${parsedInfo.experience.slice(0, 2).map(e => e.split('-')[0].trim()).join(' and ')}.`;
  } else {
    summarizedProfile = `A motivated professional focusing on building careers in technology, utilizing analytical skills and structured project experience to contribute to team initiatives.`;
  }

  return {
    resumeScore,
    atsScore,
    strengths: strengths.slice(0, 3),
    weaknesses: weaknesses.slice(0, 3),
    suggestedImprovements: suggestedImprovements.slice(0, 3),
    summarizedProfile,
    extractedInfo: parsedInfo
  };
};

module.exports = {
  analyzeResume
};
