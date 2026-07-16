import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "../services/resumeService";

function Upload() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a resume.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);

      const response = await uploadResume(formData);

      alert(response.message || "Resume Uploaded Successfully!");

      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Resume Upload Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

      <div className="bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl p-8">

        <h1 className="text-4xl font-bold text-center text-white">
          Upload Resume
        </h1>

        <p className="text-gray-400 text-center mt-3 mb-8">
          Upload your PDF or DOCX resume and receive an AI-powered analysis.
        </p>

        <form onSubmit={handleUpload}>

          <label
            htmlFor="resume"
            className="border-2 border-dashed border-blue-500 rounded-xl h-64 flex flex-col justify-center items-center cursor-pointer hover:bg-slate-800 transition"
          >

            <div className="text-6xl">
              📄
            </div>

            <p className="text-white text-xl mt-4">
              Click to Select Resume
            </p>

            <p className="text-gray-400 mt-2">
              PDF or DOCX
            </p>

            {file && (
              <div className="mt-6 text-green-400 font-semibold">
                Selected File:
                <br />
                {file.name}
              </div>
            )}

          </label>

          <input
            id="resume"
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileChange}
          />

          <button
            disabled={loading}
            className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold transition"
          >
            {loading
              ? "Analyzing Resume..."
              : "Upload & Analyze"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Upload;