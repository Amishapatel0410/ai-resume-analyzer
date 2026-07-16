// function Navbar() {
//   const user = JSON.parse(localStorage.getItem("user"));

//   return (
//     <div className="bg-slate-900 h-20 rounded-xl flex justify-between items-center px-8 shadow-lg">

//       <div>
//         <h2 className="text-2xl font-bold text-white">
//           Dashboard
//         </h2>
//       </div>

//       <div className="flex items-center gap-4">

//         <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
//           {user?.name?.charAt(0).toUpperCase()}
//         </div>

//         <div>

//           <h3 className="text-white font-semibold">
//             {user?.name}
//           </h3>

//           <p className="text-gray-400 text-sm">
//             {user?.email}
//           </p>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default Navbar;

import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";



function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-4 z-50 mx-6"
    >
      <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl shadow-2xl px-8 py-4 flex justify-between items-center">

        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-xl">
            🤖
          </div>

          <div>
            <h1 className="text-white font-bold text-2xl">
              AI Resume
            </h1>

            <p className="text-xs text-gray-400">
              Smart Job Matching
            </p>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="hidden md:flex gap-8 text-white font-medium">

          <Link
            to="/"
            className="hover:text-blue-400 transition"
          >
            Home
          </Link>

          <Link
            to="/jobs"
            className="hover:text-blue-400 transition"
          >
            Jobs
          </Link>

          <Link
            to="/upload"
            className="hover:text-blue-400 transition"
          >
            Upload
          </Link>

          {user?.role === "employer" && (
            <Link
              to="/employer-dashboard"
              className="hover:text-blue-400 transition"
            >
              Dashboard
            </Link>
          )}

          {user?.role === "candidate" && (
            <Link
              to="/dashboard"
              className="hover:text-blue-400 transition"
            >
              Dashboard
            </Link>
          )}

        </div>

        {/* User */}
        <div className="flex items-center gap-4">

          {user ? (
            <>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold"
              >
                {user.name?.charAt(0).toUpperCase()}
              </motion.div>

              <div className="hidden lg:block">
                <h3 className="text-white font-semibold">
                  {user.name}
                </h3>

                <p className="text-gray-400 text-sm">
                  {user.role}
                </p>
              </div>


              <motion.button
                whileHover={{
                  scale: 1.05,
                  backgroundColor: "#dc2626"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-red-600 px-4 py-2 rounded-lg text-white"
              >
                Logout
              </motion.button>
            </>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
            >
              <Link
                to="/login"
                className="bg-blue-600 px-5 py-2 rounded-lg text-white"
              >
                Login
              </Link>
            </motion.div>
          )}

        </div>

      </div>
    </motion.nav>
  );
}

export default Navbar;