import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postJob } from "../services/jobsService";

function PostJob() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "Full-time",
    salary: "",
    description: "",
    requirements: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      setLoading(true);

      const response = await postJob(formData);

      alert(response.message);

      navigate("/jobs");

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Failed to post job."
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="min-h-screen bg-slate-950 flex justify-center items-center">

      <div className="bg-slate-900 p-8 rounded-xl w-full max-w-2xl">

        <h1 className="text-white text-3xl font-bold mb-6">

          Post New Job

        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            name="title"
            placeholder="Job Title"
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            name="company"
            placeholder="Company"
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            name="location"
            placeholder="Location"
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <input
            name="salary"
            placeholder="Salary"
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <select
            name="type"
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          >

            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
            <option>Remote</option>

          </select>

          <textarea
            name="description"
            rows="4"
            placeholder="Description"
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <textarea
            name="requirements"
            rows="3"
            placeholder="Requirements (Java, React, Node)"
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-800 text-white"
          />

          <button
            disabled={loading}
            className="w-full bg-green-600 py-3 rounded text-white"
          >
            {loading ? "Posting..." : "Post Job"}
          </button>

        </form>

      </div>

    </div>

  );
}

export default PostJob;