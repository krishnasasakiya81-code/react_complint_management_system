import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const VerifyOTPCard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("http://localhost:5000/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Invalid OTP");
      }

      const currentUser = {
        email: data.email,
        name: data.name,
        role: data.role,
      };

      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      setVerifiedUser(currentUser);
      setStatus({ type: "success", message: "OTP verified successfully." });
      setShowPrompt(true);
    } catch (error) {
      setStatus({ type: "error", message: error.message || "OTP verification failed." });
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (verifiedUser) {
      localStorage.setItem("forcePasswordUpdate", "true");
      navigate("/profile", { state: { forcePasswordUpdate: true } });
    }
  };

  const handleSkip = () => {
    localStorage.removeItem("forcePasswordUpdate");
    if (verifiedUser?.role === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify OTP</h2>
      <p className="text-gray-600 mb-8">
        Enter the OTP sent to your email to login. OTP is valid for 10 minutes.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
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
          <label className="block text-sm font-semibold text-gray-900 mb-2">OTP Code</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="123456"
            inputMode="numeric"
            maxLength={6}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify OTP and Login"}
        </button>
      </form>

      {status && (
        <div
          className={`mt-6 p-4 rounded-lg ${
            status.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}
        >
          {status.message}
        </div>
      )}

      {showPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Password Update</h3>
            <p className="text-gray-700 mb-6">
              Your OTP has been verified. Do you want to update your password now?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleSkip}
                className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={handleContinue}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-gray-200 text-center">
        <p className="text-gray-600">
          Didn&apos;t receive the OTP?{' '}
          <Link to="/forgot-password" className="text-blue-600 font-semibold hover:text-blue-700">
            Send again
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTPCard;
