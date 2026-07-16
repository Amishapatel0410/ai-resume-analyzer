import { motion } from "framer-motion";

function Features() {
  const features = [
    {
      icon: "📊",
      title: "ATS Score",
      desc: "Know how ATS-friendly your resume is."
    },
    {
      icon: "🤖",
      title: "AI Suggestions",
      desc: "Improve your resume using AI recommendations."
    },
    {
      icon: "🎯",
      title: "Skill Analysis",
      desc: "Find missing skills required by companies."
    },
    {
      icon: "💼",
      title: "Job Matching",
      desc: "Get jobs based on your resume."
    },
    {
      icon: "📄",
      title: "Resume Insights",
      desc: "Identify strengths and weaknesses."
    },
    {
      icon: "⚡",
      title: "Fast Analysis",
      desc: "Complete AI analysis within seconds."
    }
  ];

  return (
    <section
      id="features"
      className="py-20 px-6 bg-slate-950"
    >
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-center text-white mb-14"
      >
        Powerful Features
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {features.map((item, index) => (

          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: index * 0.15
            }}
            whileHover={{
              y: -10,
              scale: 1.04,
              boxShadow:
                "0px 0px 25px rgba(59,130,246,0.45)"
            }}
            className="bg-slate-900 border border-slate-700 rounded-2xl p-8 cursor-pointer"
          >

            <motion.div
              whileHover={{
                rotate: 10,
                scale: 1.2
              }}
              transition={{
                type: "spring",
                stiffness: 300
              }}
              className="text-5xl mb-5"
            >
              {item.icon}
            </motion.div>

            <h3 className="text-2xl font-bold text-white mb-4">
              {item.title}
            </h3>

            <p className="text-gray-400 leading-7">
              {item.desc}
            </p>

          </motion.div>

        ))}

      </div>
    </section>
  );
}

export default Features;