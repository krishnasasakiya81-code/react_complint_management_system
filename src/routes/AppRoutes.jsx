import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import Services from "../pages/Services";
import Contact from "../pages/Contact";
import MyComplaints from "../pages/MyComplaints";
import NewReport from "../pages/NewReport";
import MapPage from "../pages/MapPage";
import FeedbackForm from "../components/feedback/FeedbackForm";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import VerifyOTP from "../pages/Auth/VerifyOTP";

import Dashboard from "../pages/Admin/Dashboard";
import Departments from "../pages/Admin/Departments";
import DepartmentDashboard from "../pages/DepartmentDashboard";

import Profile from "../pages/Profile";
import AdminLayout from "../components/admin/AdminLayout";
import AdminServices from "../pages/Admin/AdminServices";
import Feedbacks from "../pages/Admin/Feedbacks";
import Complaints from "../pages/Admin/Complaints";
import Users from "../pages/Admin/Users";

import TrackComplaint from "../pages/TrackComplaint";
import DepartmentProtectedRoute from "../utils/DepartmentProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/track" element={<TrackComplaint />} />
      <Route path="/my-complaints" element={<MyComplaints />} />
      <Route path="/submit-complaint" element={<NewReport />} />
      <Route path="/feedback" element={<FeedbackForm />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />

      <Route path="/map" element={<MapPage />} />
      <Route path="/profile" element={<Profile />} />

      {/* ADMIN ROUTES */}

      <Route
        path="/admin/dashboard"
        element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/complaints"
        element={
          <AdminLayout>
            <Complaints />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/services"
        element={
          <AdminLayout>
            <AdminServices />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminLayout>
            <Users />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/feedbacks"
        element={
          <AdminLayout>
            <Feedbacks />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/departments"
        element={
          <AdminLayout>
            <Departments />
          </AdminLayout>
        }
      />

      {/* ✅ DEPARTMENT ROUTES */}
      <Route
        path="/department/dashboard"
        element={
          <DepartmentProtectedRoute>
            <DepartmentDashboard />
          </DepartmentProtectedRoute>
        }
      />

      {/* Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
};

export default AppRoutes;