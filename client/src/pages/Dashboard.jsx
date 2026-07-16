import { useEffect, useState } from "react";
import api from "../services/api";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ScoreCard from "../components/ScoreCard";
import SkillsCard from "../components/SkillsCard";
import AnalysisCard from "../components/AnalysisCard";

function Dashboard() {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const response = await api.get("/resumes/my-resume");
      setResume(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-950 text-white text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">

      <Sidebar />

      <div className="ml-64 p-8">

        <Navbar />

        <div className="mt-8">

          <h1 className="text-4xl font-bold text-white">
            Welcome {user?.name} 👋
          </h1>

          <p className="text-gray-400 mt-2 mb-8">
            Here's your latest resume analysis.
          </p>

          {!resume ? (
            <div className="bg-slate-900 rounded-2xl p-8 text-white">

              <h2 className="text-2xl font-semibold">
                No Resume Uploaded
              </h2>

              <p className="text-gray-400 mt-2">
                Upload your resume to view AI analysis.
              </p>

            </div>
          ) : (
            <>

              {/* Score Cards */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <ScoreCard
                  title="ATS Score"
                  value={resume.aiAnalysis?.atsScore || 0}
                  color="text-green-400"
                />

                <ScoreCard
                  title="Resume Score"
                  value={resume.aiAnalysis?.resumeScore || 0}
                  color="text-blue-400"
                />

                <ScoreCard
                  title="Job Match"
                  value={85}
                  color="text-purple-400"
                />

              </div>

              {/* Skills */}

              <div className="mt-8">
                <SkillsCard
                  skills={resume.extractedInfo?.skills}
                />
              </div>

              {/* Summary */}

              <div className="bg-slate-900 rounded-2xl p-6 mt-8">

                <h2 className="text-2xl font-bold text-white mb-4">
                  Professional Summary
                </h2>

                <p className="text-gray-300 leading-7">
                  {resume.aiAnalysis?.summarizedProfile ||
                    "No summary available."}
                </p>

              </div>

              {/* Strength & Weakness */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

                <AnalysisCard
                  title="Strengths"
                  data={resume.aiAnalysis?.strengths}
                  color="text-green-400"
                />

                <AnalysisCard
                  title="Weaknesses"
                  data={resume.aiAnalysis?.weaknesses}
                  color="text-red-400"
                />

              </div>

              {/* Suggestions */}

              <div className="mt-8">

                <AnalysisCard
                  title="Suggested Improvements"
                  data={resume.aiAnalysis?.suggestedImprovements}
                  color="text-yellow-400"
                />

              </div>

            </>
          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;