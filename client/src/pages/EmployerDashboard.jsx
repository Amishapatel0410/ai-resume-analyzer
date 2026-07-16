import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyJobs } from "../services/jobsService";

function EmployerDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const response = await getMyJobs();
      setJobs(response.data);
    } catch (error) {
      console.log(error);
      alert(
        error.response?.data?.message ||
          "Failed to load jobs."
      );
    } finally {
      setLoading(false);
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

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold text-white">
          Employer Dashboard
        </h1>

        <button
          onClick={() => navigate("/post-job")}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl"
        >
          + Post New Job
        </button>

      </div>

      {jobs.length === 0 ? (
        <div className="bg-slate-900 rounded-xl p-8 text-center">

          <h2 className="text-2xl text-white font-bold">
            No Jobs Posted Yet
          </h2>

          <p className="text-gray-400 mt-3">
            Click on "Post New Job" to create your first job.
          </p>

        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">

          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-slate-900 rounded-xl p-6 shadow-lg"
            >

              <h2 className="text-2xl font-bold text-white">
                {job.title}
              </h2>

              <p className="text-gray-400 mt-1">
                {job.company}
              </p>

              <div className="mt-5 space-y-2 text-gray-300">

                <p>📍 {job.location}</p>

                <p>💼 {job.type}</p>

                <p>💰 {job.salary}</p>

              </div>

              <div className="mt-5">

                <h3 className="text-white font-semibold mb-2">
                  Required Skills
                </h3>

                <div className="flex flex-wrap gap-2">

                  {job.requirements?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-600 px-3 py-1 rounded-full text-white text-sm"
                    >
                      {skill}
                    </span>
                  ))}

                </div>

              </div>

              <div className="mt-6 flex justify-between items-center">

                <p className="text-green-400 font-bold">
                  Applicants: {job.applicants?.length || 0}
                </p>

                <button
                  onClick={() =>
                    navigate(`/applicants/${job._id}`)
                  }
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
                >
                  View Applicants
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default EmployerDashboard;