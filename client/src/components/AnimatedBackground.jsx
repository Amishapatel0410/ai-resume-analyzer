// import { motion } from "framer-motion";

// function AnimatedBackground() {
//   return (
//     <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">

//       <motion.div
//         animate={{
//           x: [0, 120, 0],
//           y: [0, 80, 0]
//         }}
//         transition={{
//           repeat: Infinity,
//           duration: 12,
//           ease: "easeInOut"
//         }}
//         className="absolute w-96 h-96 rounded-full bg-blue-500/20 blur-3xl top-10 left-10"
//       />

//       <motion.div
//         animate={{
//           x: [0, -120, 0],
//           y: [0, -60, 0]
//         }}
//         transition={{
//           repeat: Infinity,
//           duration: 15,
//           ease: "easeInOut"
//         }}
//         className="absolute w-96 h-96 rounded-full bg-purple-500/20 blur-3xl bottom-10 right-10"
//       />

//       <motion.div
//         animate={{
//           x: [0, 80, 0],
//           y: [0, -120, 0]
//         }}
//         transition={{
//           repeat: Infinity,
//           duration: 18,
//           ease: "easeInOut"
//         }}
//         className="absolute w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl top-1/2 left-1/2"
//       />

//     </div>
//   );
// }

// export default AnimatedBackground;

import { motion } from "framer-motion";

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">

      <motion.div
        animate={{
          x: [0, 120, 0],
          y: [0, 80, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 12,
          ease: "easeInOut"
        }}
        className="absolute w-96 h-96 rounded-full bg-blue-500/20 blur-3xl top-10 left-10"
      />

      <motion.div
        animate={{
          x: [0, -120, 0],
          y: [0, -60, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 15,
          ease: "easeInOut"
        }}
        className="absolute w-96 h-96 rounded-full bg-purple-500/20 blur-3xl bottom-10 right-10"
      />

      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, -120, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 18,
          ease: "easeInOut"
        }}
        className="absolute w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl top-1/2 left-1/2"
      />

    </div>
  );
}

export default AnimatedBackground;