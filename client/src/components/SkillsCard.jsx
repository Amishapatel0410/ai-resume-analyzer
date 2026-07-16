function SkillsCard({ skills }) {
  return (
    <div className="bg-slate-900 rounded-2xl p-6">

      <h2 className="text-2xl font-bold text-white mb-4">
        Skills
      </h2>

      <div className="flex flex-wrap gap-3">

        {skills?.length > 0 ? (
          skills.map((skill, index) => (
            <span
              key={index}
              className="bg-blue-600 px-4 py-2 rounded-full text-white"
            >
              {skill}
            </span>
          ))
        ) : (
          <p className="text-gray-400">
            No skills found.
          </p>
        )}

      </div>

    </div>
  );
}

export default SkillsCard;