import { FaArrowUp } from "react-icons/fa";

function ScoreCard({ title, value, color }) {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 shadow-lg hover:scale-105 transition-all duration-300">

      <h3 className="text-gray-400 text-lg">
        {title}
      </h3>

      <div className="flex items-center justify-between mt-4">

        <h1 className={`text-4xl font-bold ${color}`}>
          {value}%
        </h1>

        <div className="bg-green-500 p-3 rounded-full">
          <FaArrowUp className="text-white" />
        </div>

      </div>

    </div>
  );
}

export default ScoreCard;