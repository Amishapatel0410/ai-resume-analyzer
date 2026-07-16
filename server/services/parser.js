const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

// Dictionary of common industry skills for parsing fallback
const SKILLS_DICTIONARY = [
  // Languages
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'go', 'golang', 'rust', 'sql', 'html', 'css', 'sass', 'r', 'matlab', 'scala',
  // Frontend
  'react', 'angular', 'vue', 'next.js', 'nextjs', 'nuxt', 'svelte', 'jquery', 'bootstrap', 'tailwind', 'tailwindcss', 'redux', 'webpack', 'vite',
  // Backend
  'node.js', 'nodejs', 'express', 'express.js', 'django', 'flask', 'spring boot', 'laravel', 'asp.net', 'fastapi', 'nest.js', 'nestjs',
  // Databases
  'mongodb', 'postgresql', 'postgres', 'mysql', 'sqlite', 'redis', 'mariadb', 'oracle', 'firebase', 'cassandra', 'dynamodb',
  // DevOps & Cloud
  'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'jenkins', 'git', 'github', 'gitlab', 'ci/cd', 'cicd', 'terraform', 'ansible', 'linux', 'nginx',
  // Testing & Project Management
  'jest', 'cypress', 'selenium', 'mocha', 'chai', 'jira', 'confluence', 'trello', 'agile', 'scrum', 'kanban',
  // AI & Data Science
  'machine learning', 'deep learning', 'nlp', 'natural language processing', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'data analysis', 'ai', 'artificial intelligence',
  // Concepts & Architecture
  'rest api', 'graphql', 'grpc', 'microservices', 'mvc', 'oop', 'serverless', 'jwt', 'oauth'
];

/**
 * Extracts raw text from PDF or DOCX file
 * @param {string} filePath 
 * @param {string} mimeType 
 * @returns {Promise<string>}
 */
const extractText = async (filePath, mimeType) => {
  const dataBuffer = fs.readFileSync(filePath);
  
  if (mimeType === 'application/pdf' || filePath.endsWith('.pdf')) {
    const data = await pdfParse(dataBuffer);
    return data.text;
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
    filePath.endsWith('.docx')
  ) {
    const data = await mammoth.extractRawText({ buffer: dataBuffer });
    return data.value;
  } else {
    throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
  }
};

/**
 * Parses raw resume text to extract key information using heuristics
 * @param {string} text 
 * @returns {object}
 */
const parseResumeText = (text) => {
  const textLower = text.toLowerCase();
  
  // 1. Extract Email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = text.match(emailRegex) || [];
  const email = emails[0] || '';

  // 2. Extract Phone
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
  const phones = text.match(phoneRegex) || [];
  const phone = phones[0] || '';

  // 3. Extract Name (Heuristic: Look at first few lines, filter out headers/email/phone)
  let name = '';
  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i];
    // Skip if it contains email, numbers (likely phone), or common labels
    if (
      line.includes('@') || 
      /\d{4,}/.test(line) || 
      /curriculum/i.test(line) || 
      /resume/i.test(line) || 
      /cv/i.test(line) ||
      line.toLowerCase().startsWith('phone') ||
      line.toLowerCase().startsWith('email')
    ) {
      continue;
    }
    // Simple heuristic: Name is usually short capitalized words
    if (line.split(/\s+/).length <= 4) {
      name = line;
      break;
    }
  }

  // 4. Extract Skills using Dictionary Matching
  const skills = [];
  SKILLS_DICTIONARY.forEach(skill => {
    // Escape regex characters
    const escapedSkill = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    // Word boundary match
    // Note: handle special characters like .js or c++ specifically
    let regexStr = `\\b${escapedSkill}\\b`;
    if (skill.endsWith('.js')) {
      regexStr = `\\b${escapedSkill.slice(0, -3)}\\.js\\b`;
    } else if (skill.includes('+')) {
      regexStr = `${escapedSkill.replace(/\+/g, '\\+')}`;
    } else if (skill.includes('#')) {
      regexStr = `${escapedSkill.replace(/#/g, '\\#')}`;
    }
    
    const regex = new RegExp(regexStr, 'i');
    if (regex.test(textLower)) {
      // Return formatted skill
      let displaySkill = skill;
      if (skill === 'nodejs') displaySkill = 'Node.js';
      else if (skill === 'nextjs') displaySkill = 'Next.js';
      else if (skill === 'nestjs') displaySkill = 'Nest.js';
      else if (skill === 'expressjs') displaySkill = 'Express.js';
      else if (skill === 'typescript') displaySkill = 'TypeScript';
      else if (skill === 'javascript') displaySkill = 'JavaScript';
      else if (skill === 'mongodb') displaySkill = 'MongoDB';
      else if (skill === 'postgresql') displaySkill = 'PostgreSQL';
      else if (skill === 'github') displaySkill = 'GitHub';
      else if (skill === 'gitlab') displaySkill = 'GitLab';
      else if (skill === 'cicd') displaySkill = 'CI/CD';
      else {
        // Capitalize first letters
        displaySkill = skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
      
      if (!skills.includes(displaySkill)) {
        skills.push(displaySkill);
      }
    }
  });

  // 5. Extract Education Sections
  const education = [];
  const eduKeywords = ['education', 'degree', 'university', 'college', 'school', 'bachelor', 'master', 'phd', 'b.s', 'm.s', 'b.tech', 'm.tech'];
  lines.forEach((line) => {
    const containsKeyword = eduKeywords.some(keyword => line.toLowerCase().includes(keyword));
    if (containsKeyword && line.length < 100) {
      education.push(line);
    }
  });

  // 6. Extract Experience / History Lines
  const experience = [];
  const expKeywords = ['experience', 'work', 'history', 'job', 'developer', 'engineer', 'analyst', 'manager', 'intern', 'consultant'];
  lines.forEach((line) => {
    const containsKeyword = expKeywords.some(keyword => line.toLowerCase().includes(keyword));
    if (containsKeyword && line.length < 150 && !eduKeywords.some(k => line.toLowerCase().includes(k)) && !line.includes('@')) {
      // filter out section headings
      const len = line.trim().split(/\s+/).length;
      if (len > 3 && len < 20) {
        experience.push(line);
      }
    }
  });

  // 7. Extract Project Headings / Lines
  const projects = [];
  const projKeywords = ['project', 'portfolio', 'application', 'developed', 'built', 'github.com/'];
  lines.forEach((line) => {
    const containsKeyword = projKeywords.some(keyword => line.toLowerCase().includes(keyword));
    if (containsKeyword && line.length < 150 && !eduKeywords.some(k => line.toLowerCase().includes(k)) && !line.includes('@')) {
      const len = line.trim().split(/\s+/).length;
      if (len > 3 && len < 20) {
        projects.push(line);
      }
    }
  });

  return {
    name: name || 'Applicant Name',
    email,
    phone,
    skills,
    experience: experience.slice(0, 5),
    education: education.slice(0, 3),
    projects: projects.slice(0, 5)
  };
};

module.exports = {
  extractText,
  parseResumeText
};
