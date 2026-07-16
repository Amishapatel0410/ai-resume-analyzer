import { useEffect, useState } from "react";
import {
  getMatchedJobs,
  applyJob,
} from "../services/jobsService";

import JobCard from "../components/JobCard";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await getMatchedJobs();
      setJobs(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (id) => {
    try {
      const response = await applyJob(id);

      alert(
        response.message +
          "\nMatch: " +
          response.matchPercentage +
          "%"
      );

      loadJobs();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Application Failed"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex justify-center items-center text-white text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">

      <h1 className="text-4xl text-white font-bold mb-8">
        AI Recommended Jobs
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        {jobs.length === 0 ? (
          <h2 className="text-white">
            No Jobs Found
          </h2>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onApply={handleApply}
            />
          ))
        )}

      </div>

    </div>
  );
}

export default Jobs;