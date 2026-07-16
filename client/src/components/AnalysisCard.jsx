function AnalysisCard({ title, data, color }) {
  return (
    <div className="bg-slate-900 rounded-2xl p-6">

      <h2 className={`text-2xl font-bold ${color} mb-4`}>
        {title}
      </h2>

      <ul className="space-y-2">

        {data?.length > 0 ? (
          data.map((item, index) => (
            <li key={index}>
              • {item}
            </li>
          ))
        ) : (
          <p className="text-gray-400">
            No Data
          </p>
        )}

      </ul>

    </div>
  );
}

export default AnalysisCard;