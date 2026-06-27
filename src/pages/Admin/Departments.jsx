import React, { useState, useEffect } from "react";

const Departments = () => {

  const [departments, setDepartments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [complaintCounts, setComplaintCounts] = useState({});
  const [solvedCounts, setSolvedCounts] = useState({});

  const [formData, setFormData] = useState({
    city: "",
    head: "",
    mobile: "",
    email: "",
    status: "Available",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/admin/departments")
      .then(res => res.json())
      .then(data => {
        setDepartments(data);
        // Fetch solved counts for each department
        data.forEach(dept => {
          if (dept._id) {
            fetch(`http://localhost:5000/department/${dept._id}/solved-count`)
              .then(res => res.json())
              .then(solveData => {
                setSolvedCounts(prev => ({
                  ...prev,
                  [dept._id]: solveData.solvedCount || 0
                }));
              })
              .catch(err => console.error(err));
          }
        });
      })
      .catch(err => console.error(err));

    // 🔥 FIXED COUNT LOGIC
    fetch("http://localhost:5000/admin/complaints")
      .then(res => res.json())
      .then(data => {
        const counts = {};

        data.forEach(c => {
          const city = (c.city || c.location || "").toLowerCase().trim(); // 🔥 FIX

          if (city) {
            counts[city] = (counts[city] || 0) + 1;
          }
        });

        setComplaintCounts(counts);
      })
      .catch(err => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;

    try {
      await fetch(`http://localhost:5000/admin/departments/${id}`, {
        method: "DELETE",
      });

      setDepartments(departments.filter(d => d._id !== id));

      alert("Deleted ✅");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const sendOtp = async () => {
    if (!formData.mobile) return alert("Enter mobile number");

    if (!/^\d{10}$/.test(formData.mobile)) {
      return alert("Enter a valid 10-digit mobile number ❌");
    }

    try {
      setOtpSending(true);
      setOtpVerified(false);
      setOtpMessage("");

      const res = await fetch("http://localhost:5000/admin/send-department-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile: formData.mobile }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send OTP");
      }

      if (data.otp) {
        setOtpMessage("OTP generated for testing. Use this code to verify: " + data.otp);
        setOtp(data.otp);
      } else {
        setOtpMessage("OTP sent to mobile. Enter it below to verify.");
      }
    } catch (err) {
      console.error(err);
      setOtpMessage(err.message || "Failed to send OTP");
    } finally {
      setOtpSending(false);
    }
  };

  const verifyOtp = async () => {
    if (!formData.mobile) return alert("Enter mobile number");
    if (!otp) return alert("Enter the OTP");

    try {
      const res = await fetch("http://localhost:5000/admin/verify-department-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mobile: formData.mobile, otp }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "OTP verification failed");
      }

      setOtpVerified(true);
      setOtpMessage("OTP verified successfully ✅");
    } catch (err) {
      console.error(err);
      setOtpVerified(false);
      setOtpMessage(err.message || "Invalid OTP");
    }
  };

  const handleAdd = async () => {
    if (!formData.city || !formData.head || !formData.mobile || !formData.email) {
      return alert("Fill all required fields");
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      return alert("Mobile number must be exactly 10 digits ❌");
    }

    if (!otpVerified) {
      return alert("Verify your mobile OTP before adding department");
    }

    try {
      const res = await fetch("http://localhost:5000/admin/departments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const newDept = await res.json();

      setDepartments([...departments, newDept]);

      try {
        const notifyRes = await fetch(`http://localhost:5000/admin/department-notify/${newDept._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const notifyData = await notifyRes.json();
        if (!notifyRes.ok) {
          throw new Error(notifyData.error || "Notify email failed");
        }

        alert(`Department Added ✅ Email sent to ${newDept.email} with ${notifyData.count} complaints.`);
      } catch (notifyErr) {
        console.error(notifyErr);
        alert(`Department added, but notification failed: ${notifyErr.message}`);
      }

      setFormData({
        city: "",
        head: "",
        mobile: "",
        email: "",
        status: "Available",
      });

      setOtp("");
      setOtpVerified(false);
      setOtpMessage("");
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Error saving department");
    }
  };

  const handleAssign = async (dept) => {
    try {
      const res = await fetch(`http://localhost:5000/admin/department-notify/${dept._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Notification failed");
      }

      alert(`Email sent to ${dept.email} with ${data.count} complaints.`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to send complaint summary email");
    }
  };

  const filteredData =
    filter === "All"
      ? departments
      : departments.filter(d => d.status === filter);

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">

      <h2 className="text-2xl sm:text-3xl font-bold mb-4">
        Department Management
      </h2>

      <div className="flex flex-wrap gap-3 mb-5">

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(!showForm)}
        >
          + Add Department
        </button>

        <select
          className="border px-3 py-2 rounded"
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">Filter</option>
          <option value="Available">Available</option>
          <option value="Moderate">Moderate</option>
          <option value="High Workload">High Workload</option>
        </select>

      </div>

      {showForm && (
        <div className="bg-white p-4 rounded shadow mb-5 flex flex-wrap gap-3">

          <input placeholder="City" className="border p-2 rounded flex-1"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />

          <input placeholder="Head Name" className="border p-2 rounded flex-1"
            value={formData.head}
            onChange={(e) => setFormData({ ...formData, head: e.target.value })}
          />

          <input placeholder="Mobile for OTP verification" className="border p-2 rounded flex-1"
            value={formData.mobile}
            maxLength={10}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value.replace(/\D/g, "") })}
          />

          <input placeholder="Password for login" className="border p-2 rounded flex-1"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <input placeholder="Email for complaint summary" className="border p-2 rounded flex-1"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <button onClick={sendOtp} className="bg-gray-200 px-3 py-2 rounded">
            {otpSending ? "Sending..." : "Send OTP to Email"}
          </button>

          <input placeholder="Enter OTP from Email" className="border p-2 rounded flex-1"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

         

          <button onClick={verifyOtp} className="bg-green-600 text-white px-3 py-2 rounded">
            Verify OTP
          </button>

          <div className="w-full text-sm text-gray-600 mt-1">
            {otpMessage}
            {otpVerified && <span className="text-green-700"> OTP verified ✅</span>}
          </div>

          <select className="border p-2 rounded"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option>Available</option>
            <option>Moderate</option>
            <option>High Workload</option>
          </select>

          <button className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleAdd}>
            Save
          </button>

        </div>
      )}

      <div className="bg-white rounded shadow overflow-x-auto">

        <table className="min-w-[700px] w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">Head</th>
              <th className="p-3 text-left">Mobile</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Complaints</th>
              <th className="p-3 text-left">Solved</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((d, i) => (
              <tr key={i} className="border-t">
                <td className="p-3">{d.city}</td>
                <td className="p-3">{d.head}</td>
                <td className="p-3">{d.mobile}</td>
                <td className="p-3">{d.status}</td>

                {/* 🔥 FIXED COUNT DISPLAY */}
                <td className="p-3">
                  {complaintCounts[d.city?.toLowerCase().trim()] || 0}
                </td>

                {/* ✅ SOLVED COUNT */}
                <td className="p-3 font-semibold text-green-600">
                  {solvedCounts[d._id] || 0}
                </td>

                <td className="p-3 flex gap-2">

                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                    onClick={() => handleAssign(d)}
                  >
                    Send Summary
                  </button>

                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                    onClick={() => handleDelete(d._id)}
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
};

export default Departments;