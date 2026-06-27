import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
      <div className="bg-white shadow px-4 sm:px-6 py-3">

        <div className="flex items-center justify-between">

          {/* LEFT SIDE */}
          <div className="flex items-center gap-6">

            {/* Logo */}
            <h2
              onClick={() => navigate("/admin/dashboard")}
              className="text-xl font-bold text-blue-600 cursor-pointer"
            >
              GovTrack
            </h2>

            {/* MENU (Desktop) */}
            <div className="hidden sm:flex items-center gap-6 text-gray-600 font-medium">

              <span
                onClick={() => navigate("/admin/dashboard")}
                className={`cursor-pointer pb-1 ${
                  isActive("/admin/dashboard")
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "hover:text-blue-600"
                }`}
              >
                Dashboard
              </span>

              <span
                onClick={() => navigate("/admin/complaints")}
                className={`cursor-pointer pb-1 ${
                  isActive("/admin/complaints")
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "hover:text-blue-600"
                }`}
              >
                Complaints
              </span>

              <span
                onClick={() => navigate("/admin/users")}
                className="hover:text-blue-600 cursor-pointer"
              >
                Users
              </span>

              <span
                onClick={() => navigate("/admin/feedbacks")}
                className="hover:text-blue-600 cursor-pointer"
              >
                Feedback
              </span>

              <span
                onClick={() => navigate("/admin/departments")}
                className="hover:text-blue-600 cursor-pointer"
              >
                Departments
              </span>

              {/* ✅ ADDED SERVICES HERE */}
              <span
                onClick={() => navigate("/admin/services")}
                className={`cursor-pointer pb-1 ${
                  isActive("/admin/services")
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "hover:text-blue-600"
                }`}
              >
                Services
              </span>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">

            {/* Desktop */}
            <div className="hidden sm:flex items-center gap-4">

              <div className="text-sm">
                <p className="font-semibold">Admin User</p>
                <p className="text-gray-500 text-xs">System Manager</p>
              </div>

              <button
                onClick={handleLogout}
                className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700"
              >
                Logout
              </button>
            </div>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden text-2xl font-bold"
            >
              ☰
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="flex flex-col gap-3 mt-3 text-gray-600 font-medium">

            <span onClick={() => navigate("/admin/dashboard")}>Dashboard</span>
            <span onClick={() => navigate("/admin/complaints")}>Complaints</span>
            <span onClick={() => navigate("/admin/users")}>Users</span>
            <span onClick={() => navigate("/admin/feedbacks")}>Feedback</span>
            <span onClick={() => navigate("/admin/departments")}>Departments</span>
            <span onClick={() => navigate("/admin/services")}>Services</span>

            <div className="text-sm">
              <p className="font-semibold">Admin User</p>
              <p className="text-gray-500 text-xs">System Manager</p>
            </div>

            <button
              onClick={handleLogout}
              className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* PAGE CONTENT */}
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;