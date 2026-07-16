import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUpload,
  FaBriefcase,
  FaSignOutAlt,
} from "react-icons/fa";

function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "Upload", path: "/upload", icon: <FaUpload /> },
    { name: "Jobs", path: "/jobs", icon: <FaBriefcase /> },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 shadow-xl">

      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-blue-400">
          AI Resume
        </h1>
      </div>

      <div className="space-y-2 px-4">

        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              location.pathname === item.path
                ? "bg-blue-600 text-white"
                : "text-gray-300 hover:bg-slate-800"
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        ))}

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-slate-800 mt-10"
        >
          <FaSignOutAlt />
          Logout
        </button>

      </div>
    </div>
  );
}

export default Sidebar;