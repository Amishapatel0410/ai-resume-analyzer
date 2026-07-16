import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getApplicants } from "../services/jobsService";

const API_URL = "http://localhost:5000";

function Applicants() {
  const { id } = useParams();

  const [job, setJob] = useState({});
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const response = await getApplicants(id);

      // Backend returns:
      // {
      //   success: true,
      //   data: {
      //      title,
      //      company,
      //      applicants:[]
      //   }
      // }

      setJob(response.data);
      setApplicants(response.data.applicants);
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Failed to load applicants"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">

      <h1 className="text-4xl font-bold text-white">
        {job.title}
      </h1>

      <p className="text-gray-400 mb-8">
        {job.company}
      </p>

      {applicants.length === 0 ? (
        <div className="bg-slate-900 p-6 rounded-xl text-white">
          No Applicants Yet
        </div>
      ) : (
        <div className="space-y-6">

          {applicants.map((applicant) => (

            <div
              key={applicant._id}
              className="bg-slate-900 rounded-xl p-6"
            >

              <div className="flex justify-between items-center">

                <div>

                  <h2 className="text-2xl font-bold text-white">
                    {applicant.user?.name}
                  </h2>

                  <p className="text-gray-400">
                    {applicant.user?.email}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-green-400 text-3xl font-bold">
                    {applicant.matchPercentage}%
                  </p>

                  <p className="text-gray-400">
                    Match
                  </p>

                </div>

              </div>

              <div className="mt-5">

                <h3 className="text-white font-semibold mb-2">
                  Skills
                </h3>

                <div className="flex flex-wrap gap-2">

                  {applicant.user?.skills?.length ? (
                    applicant.user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-600 px-3 py-1 rounded-full text-sm text-white"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">
                      No Skills
                    </span>
                  )}

                </div>

              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">

                <div className="bg-slate-800 rounded-lg p-4">

                  <p className="text-gray-400">
                    ATS Score
                  </p>

                  <h2 className="text-green-400 text-2xl font-bold">
                    {applicant.resume?.aiAnalysis?.atsScore ?? "N/A"}
                  </h2>

                </div>

                <div className="bg-slate-800 rounded-lg p-4">

                  <p className="text-gray-400">
                    Resume Score
                  </p>

                  <h2 className="text-blue-400 text-2xl font-bold">
                    {applicant.resume?.aiAnalysis?.resumeScore ?? "N/A"}
                  </h2>

                </div>
                <div className="mt-6 flex gap-4">

  <a
    href={`${API_URL}${applicant.resume?.filePath}`}
    target="_blank"
    rel="noreferrer"
    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
  >
    View Resume
  </a>

  <a
    href={`${API_URL}${applicant.resume?.filePath}`}
    download
    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white"
  >
    Download Resume
  </a>

</div>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default Applicants;