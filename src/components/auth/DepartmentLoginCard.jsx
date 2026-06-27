import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DepartmentAuthContext } from "../../context/DepartmentAuthContext";

const DepartmentLoginCard = () => {
  const navigate = useNavigate();
  const { login } = useContext(DepartmentAuthContext);

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!mobile || !password) {
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
        body: JSON.stringify({ mobile, password }),
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

      login(departmentData);
      alert("Login Successful!");
      navigate("/department/dashboard");
    } catch (error) {
      console.error(error);
      setError(error.message || "Invalid mobile or password!");
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Department Login</h2>

      <p className="text-gray-600 mb-8">Sign in as a department to manage complaints</p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Mobile Number
          </label>

          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="10-digit mobile number"
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login as Department"}
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Back to{" "}
        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
          User Login
        </Link>
      </p>
    </div>
  );
};

export default DepartmentLoginCard;
