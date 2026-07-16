function JobCard({ job, onApply }) {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 shadow-lg hover:shadow-blue-500/20 transition">

      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-2xl font-bold text-white">
            {job.title}
          </h2>

          <p className="text-gray-400">
            {job.company}
          </p>
        </div>

        <div className="text-center">
          <p className="text-green-400 text-3xl font-bold">
            {job.matchPercentage}%
          </p>

          <p className="text-gray-400 text-sm">
            Match
          </p>
        </div>

      </div>

      <div className="mt-4">

        <p className="text-gray-300">
          📍 {job.location}
        </p>

        <p className="text-gray-300">
          💼 {job.type}
        </p>

        <p className="text-gray-300">
          💰 {job.salary}
        </p>

      </div>

      <div className="mt-5">

        <h3 className="text-white font-semibold mb-2">
          Required Skills
        </h3>

        <div className="flex flex-wrap gap-2">

          {job.requirements?.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-600 px-3 py-1 rounded-full text-sm text-white"
            >
              {skill}
            </span>
          ))}

        </div>

      </div>

      <button
        onClick={() => onApply(job._id)}
        className="mt-6 w-full bg-green-600 hover:bg-green-700 py-3 rounded-xl text-white font-semibold"
      >
        Apply Now
      </button>

    </div>
  );
}

export default JobCard;