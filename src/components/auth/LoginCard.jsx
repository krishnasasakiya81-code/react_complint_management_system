import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DepartmentAuthContext } from "../../context/DepartmentAuthContext";
import { useContext } from "react";

const LoginCard = () => {
  const navigate = useNavigate();
  const { login: departmentLogin } = useContext(DepartmentAuthContext);

  // Login Type State
  const [loginType, setLoginType] = useState("user"); // "user" or "department"

  // User Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Department Login State
  const [mobile, setMobile] = useState("");
  const [deptPassword, setDeptPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ USER LOGIN
  const handleUserLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid Email or Password!");
      }

      const userData = {
        email: data.email,
        name: data.name,
        role: data.role
      };

      try {
        localStorage.setItem("currentUser", JSON.stringify(userData));
      } catch (err) {
        if (err.message && err.message.toLowerCase().includes("quota")) {
          localStorage.removeItem("complaints");
          localStorage.removeItem("feedbacks");
          localStorage.removeItem("departments");
          localStorage.removeItem("currentUser");
          localStorage.setItem("currentUser", JSON.stringify(userData));
        } else {
          throw err;
        }
      }

      alert("Login Successful!");

      const redirect = localStorage.getItem("redirectAfterLogin");

      if (redirect) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirect);
      } else if (data.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setError(error.message || "Invalid Email or Password!");
      alert(error.message || "Invalid Email or Password!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ DEPARTMENT LOGIN
  const handleDepartmentLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!mobile || !deptPassword) {
        throw new Error("Please enter both mobile number and password");
      }

      if (!/^\d{10}$/.test(mobile)) {
        throw new Error("Please enter a valid 10-digit mobile number");
      }

      const response = await fetch("http://localhost:5000/department/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile, password: deptPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid mobile or password!");
      }

      const departmentData = {
        _id: data._id,
        city: data.city,
        head: data.head,
        mobile: data.mobile,
        email: data.email,
        status: data.status,
      };

      departmentLogin(departmentData);
      alert("Department Login Successful!");
      navigate("/department/dashboard");
    } catch (error) {
      console.error(error);
      setError(error.message || "Invalid mobile or password!");
      alert(error.message || "Invalid mobile or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome!</h2>

      <p className="text-gray-600 mb-8">Sign in to your account to continue</p>

      {/* ✅ TAB BUTTONS */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setLoginType("user");
            setError("");
          }}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
            loginType === "user"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          👤 User Login
        </button>

        <button
          onClick={() => {
            setLoginType("department");
            setError("");
          }}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
            loginType === "department"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          🏢 Department Login
        </button>
      </div>

      {/* ✅ ERROR MESSAGE */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* ✅ USER LOGIN FORM */}
      {loginType === "user" && (
        <form onSubmit={handleUserLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      )}

      {/* ✅ DEPARTMENT LOGIN FORM */}
      {loginType === "department" && (
        <form onSubmit={handleDepartmentLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Mobile Number (10 digits)
            </label>

            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
              placeholder="9876543210"
              maxLength="10"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Password
            </label>

            <input
              type="password"
              value={deptPassword}
              onChange={(e) => setDeptPassword(e.target.value)}
              placeholder="Enter department password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In as Department"}
          </button>
        </form>
      )}

      {/* ✅ FOOTER LINKS */}
      <div className="mt-6 space-y-4">
        {loginType === "user" && (
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 font-semibold hover:text-blue-700"
            >
              Forgot password?
            </Link>
          </div>
        )}

        <div className={loginType === "user" ? "pt-6 border-t border-gray-200" : ""}>
          {loginType === "user" && (
            <p className="text-center text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Sign up now
              </Link>
            </p>
          )}

          {loginType === "department" && (
            <p className="text-center text-gray-600 text-sm">
              Contact admin to register your department
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginCard;