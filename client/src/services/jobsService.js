import api from "./api";

// ==============================
// Employer
// ==============================

// Post a new job
export const postJob = async (jobData) => {
  const response = await api.post("/jobs/post", jobData);
  return response.data;
};

// Get all jobs posted by logged-in employer
export const getMyJobs = async () => {
  const response = await api.get("/jobs/my-postings");
  return response.data;
};

// Get applicants for a specific job
export const getApplicants = async (id) => {
  const response = await api.get(`/jobs/${id}/applicants`);
  return response.data;
};

// ==============================
// Candidate
// ==============================

// Get AI matched jobs
export const getMatchedJobs = async () => {
  const response = await api.get("/jobs/match");
  return response.data;
};

// Apply for a job
export const applyJob = async (id) => {
  const response = await api.post(`/jobs/${id}/apply`);
  return response.data;
};

// Get all public jobs (optional)
export const getAllJobs = async () => {
  const response = await api.get("/jobs");
  return response.data;
};