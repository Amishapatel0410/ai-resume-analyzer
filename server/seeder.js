const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Job = require('./models/Job');

dotenv.config();

const sampleJobs = [
  {
    title: 'Frontend Developer',
    company: 'VibeTech Solutions',
    location: 'Remote',
    type: 'Full-time',
    description: 'We are seeking a talented Frontend Developer experienced in building modern, responsive user interfaces. You will work closely with design and product teams to translate layouts into pixel-perfect, highly performant React applications.',
    requirements: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind CSS', 'Git', 'Webpack'],
    salary: '$80,000 - $110,000'
  },
  {
    title: 'Backend Node.js Engineer',
    company: 'CloudSync Analytics',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'Join our infrastructure team to design, build, and optimize microservices. You will construct RESTful APIs, manage databases, and implement secure token-based user authentication workflows.',
    requirements: ['Node.js', 'Express.js', 'MongoDB', 'SQL', 'REST API', 'JWT', 'Docker', 'Git'],
    salary: '$100,000 - $130,000'
  },
  {
    title: 'Full-Stack Developer',
    company: 'Alpha Launch Labs',
    location: 'Remote',
    type: 'Full-time',
    description: 'We are looking for a versatile Full-Stack Developer to work across our entire application stack. You will participate in feature design, database structuring, state management pipelines, and AWS integrations.',
    requirements: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'AWS', 'Docker', 'CI/CD', 'Git'],
    salary: '$95,000 - $125,000'
  },
  {
    title: 'Machine Learning / AI Engineer',
    company: 'Cognitive Minds Corp',
    location: 'Austin, TX',
    type: 'Full-time',
    description: 'Help us build the future of intelligence. You will develop predictive models, clean and process unstructured datasets, and deploy machine learning APIs that serve millions of transactions daily.',
    requirements: ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'SQL', 'Pandas', 'NumPy'],
    salary: '$120,000 - $160,000'
  },
  {
    title: 'DevOps / Cloud Specialist',
    company: 'ScaleOps Systems',
    location: 'Remote',
    type: 'Contract',
    description: 'We need an experienced Cloud Engineer to containerize services and maintain secure deployment environments. You will set up automated monitoring, manage VPC configurations, and write infrastructure-as-code.',
    requirements: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Terraform', 'Linux', 'Git'],
    salary: '$70 - $95 / hour'
  },
  {
    title: 'Data Analyst & Visualization Expert',
    company: 'MetroRetail Insights',
    location: 'Chicago, IL',
    type: 'Full-time',
    description: 'Utilize numerical skills to convert telemetry data into business insights. You will compile reports, build executive dashboards, and query relational databases for ad-hoc requests.',
    requirements: ['SQL', 'Python', 'Pandas', 'NumPy', 'Data Analysis', 'Tableau', 'Excel'],
    salary: '$70,000 - $90,000'
  },
  {
    title: 'Software Engineer Intern',
    company: 'CodeCraft Academics',
    location: 'Remote',
    type: 'Internship',
    description: 'Kickstart your software engineering career. You will pair-program with senior mentors, learn agile delivery mechanics, and contribute real features to active repositories.',
    requirements: ['JavaScript', 'HTML', 'CSS', 'React', 'Git', 'Agile'],
    salary: '$25 - $35 / hour'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Delete existing jobs and the seed employer
    await Job.deleteMany();
    console.log('Existing jobs deleted.');

    // Look for or create our seed employer
    let employer = await User.findOne({ email: 'employer@platform.com' });
    
    if (!employer) {
      console.log('Creating seed employer account...');
      employer = await User.create({
        name: 'Seed Employer',
        email: 'employer@platform.com',
        password: 'password123', // Will be hashed by user save middleware
        role: 'employer'
      });
      console.log('Employer account created.');
    }

    // Attach employer user id to each job
    const jobsToInsert = sampleJobs.map(job => ({
      ...job,
      postedBy: employer._id
    }));

    await Job.insertMany(jobsToInsert);
    console.log(`Successfully seeded ${jobsToInsert.length} jobs into the database!`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
