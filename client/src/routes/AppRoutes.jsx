import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Upload from "../pages/Upload";
import Dashboard from "../pages/Dashboard";
import Jobs from "../pages/Jobs";
import PostJob from "../pages/PostJob";
import NotFound from "../pages/NotFound";
import EmployerDashboard from "../pages/EmployerDashboard";
import Applicants from "../pages/Applicants";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/post-job" element={<PostJob />} />
      <Route path="*" element={<NotFound />} />
      <Route
  path="/employer-dashboard"
  element={<EmployerDashboard />}
/>
<Route
  path="/applicants/:id"
  element={<Applicants />}
/>
    </Routes>
  );
}

export default AppRoutes;