import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative min-h-[80vh] flex flex-col justify-center items-center text-center px-6 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-blue-600/20 blur-3xl rounded-full -top-24 -left-24"></div>

      <div className="absolute w-96 h-96 bg-purple-600/20 blur-3xl rounded-full -bottom-24 -right-24"></div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-6xl md:text-7xl font-extrabold mb-6 text-white"
      >
        AI Resume Analyzer
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-xl text-gray-300 max-w-2xl mb-10 leading-8"
      >
        Upload your resume, get an ATS score, receive AI-powered
        suggestions, and discover jobs perfectly matched to your skills.
      </motion.p>

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex gap-5"
      >
        <motion.button
          whileHover={{
            scale: 1.08,
            boxShadow: "0px 0px 20px rgb(37 99 235)"
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/upload")}
          className="bg-blue-600 px-7 py-3 rounded-xl font-semibold text-white"
        >
          Upload Resume
        </motion.button>

        <motion.button
          whileHover={{
            scale: 1.08,
            backgroundColor: "#2563eb"
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/jobs")}
          className="border border-blue-500 px-7 py-3 rounded-xl font-semibold text-white"
        >
          Explore Jobs
        </motion.button>
      </motion.div>

      {/* Floating AI Badge */}
      <motion.div
        animate={{
          y: [0, -12, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 3
        }}
        className="mt-16 bg-slate-900 border border-blue-600 px-6 py-3 rounded-full text-blue-400 font-semibold shadow-lg"
      >
        🤖 AI Powered Resume Analysis
      </motion.div>
    </section>
  );
}

export default Hero;