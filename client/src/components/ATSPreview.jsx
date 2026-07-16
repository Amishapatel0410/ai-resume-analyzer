import { motion } from "framer-motion";

function ATSPreview() {
  return (
    <section className="py-24 px-6 bg-slate-950 overflow-hidden">

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-center text-white mb-14"
      >
        AI Resume Analysis
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        whileHover={{
          scale: 1.03,
          boxShadow: "0px 0px 30px rgba(59,130,246,0.4)"
        }}
        className="max-w-lg mx-auto bg-slate-900 border border-blue-500 rounded-3xl p-10"
      >

        {/* Score */}
        <motion.h1
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 120
          }}
          className="text-7xl font-extrabold text-blue-400 text-center"
        >
          92%
        </motion.h1>

        <p className="mt-4 text-center text-xl text-green-400 font-semibold">
          Excellent ATS Compatibility
        </p>

        {/* ATS Progress */}
        <div className="mt-10">

          <div className="flex justify-between text-gray-300 mb-2">
            <span>ATS Score</span>
            <span>92%</span>
          </div>

          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "92%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="h-full bg-blue-500"
            />
          </div>

        </div>

        {/* Resume Score */}
        <div className="mt-6">

          <div className="flex justify-between text-gray-300 mb-2">
            <span>Resume Score</span>
            <span>88%</span>
          </div>

          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "88%" }}
              viewport={{ once: true }}
              transition={{
                duration: 1.2,
                delay: 0.3
              }}
              className="h-full bg-green-500"
            />
          </div>

        </div>

        {/* Highlights */}
        <div className="mt-10 space-y-3">

          <motion.div
            whileHover={{ x: 8 }}
            className="flex items-center text-gray-300"
          >
            ✅ Strong Technical Skills
          </motion.div>

          <motion.div
            whileHover={{ x: 8 }}
            className="flex items-center text-gray-300"
          >
            ✅ ATS Friendly Formatting
          </motion.div>

          <motion.div
            whileHover={{ x: 8 }}
            className="flex items-center text-gray-300"
          >
            ✅ Optimized Resume Structure
          </motion.div>

          <motion.div
            whileHover={{ x: 8 }}
            className="flex items-center text-gray-300"
          >
            ⚡ AI Powered Suggestions
          </motion.div>

        </div>

      </motion.div>

    </section>
  );
}

export default ATSPreview;