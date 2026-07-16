import { motion } from "framer-motion";

function HowItWorks() {
  const steps = [
    {
      icon: "📄",
      title: "Upload Resume",
      desc: "Upload your PDF or DOCX resume securely for AI analysis."
    },
    {
      icon: "🤖",
      title: "AI Analysis",
      desc: "Our AI analyzes ATS score, strengths, weaknesses and missing skills."
    },
    {
      icon: "💼",
      title: "Job Matching",
      desc: "Receive personalized job recommendations based on your skills."
    }
  ];

  return (
    <section className="py-24 bg-slate-950 px-6 overflow-hidden">

      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-center text-white mb-16"
      >
        How It Works
      </motion.h2>

      <div className="relative max-w-6xl mx-auto">

        {/* Blue line for desktop */}
        <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-blue-600 rounded-full"></div>

        <div className="grid md:grid-cols-3 gap-10 relative">

          {steps.map((step, index) => (

            <motion.div
              key={index}
              initial={{
                opacity: 0,
                x: index % 2 === 0 ? -60 : 60
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.2
              }}
              whileHover={{
                y: -10,
                scale: 1.04,
                boxShadow:
                  "0px 0px 25px rgba(59,130,246,0.45)"
              }}
              className="relative bg-slate-900 border border-slate-700 rounded-2xl p-8 text-center z-10"
            >

              <motion.div
                animate={{
                  y: [0, -8, 0]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5,
                  delay: index * 0.3
                }}
                className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-4xl mx-auto mb-6"
              >
                {step.icon}
              </motion.div>

              <h3 className="text-2xl font-bold text-white mb-4">
                {index + 1}. {step.title}
              </h3>

              <p className="text-gray-400 leading-7">
                {step.desc}
              </p>

            </motion.div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;