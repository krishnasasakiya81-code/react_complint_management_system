import React, { useState, useEffect } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";

const Profile = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user) {
    return <Navigate to="/login" />;
  }

  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState(user);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [forcePasswordUpdate, setForcePasswordUpdate] = useState(
    localStorage.getItem("forcePasswordUpdate") === "true"
  );

  useEffect(() => {
    if (location.state?.forcePasswordUpdate) {
      localStorage.setItem("forcePasswordUpdate", "true");
      setForcePasswordUpdate(true);
    }
  }, [location.state]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem("currentUser", JSON.stringify(formData));

    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.map((u) =>
      u.email === user.email ? formData : u
    );

    localStorage.setItem("users", JSON.stringify(users));

    alert("Profile Updated!");
    setIsEdit(false);
  };

  // 🔥 UPDATED PASSWORD CHANGE (BACKEND BASED)
  const handleChangePassword = async () => {
    if (!newPass || !confirmPass) {
      alert("Fill all fields");
      return;
    }

    if (newPass !== confirmPass) {
      alert("New password and confirm password do not match");
      return;
    }

    const payload = {
      email: user.email,
      newPassword: newPass,
      skipOldPassword: forcePasswordUpdate,
    };

    if (!forcePasswordUpdate) {
      if (!oldPass) {
        alert("Please enter your old password");
        return;
      }
      payload.oldPassword = oldPass;
    }

    try {
      const res = await fetch("http://localhost:5000/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || data.message);
        return;
      }

      const updatedUser = { ...formData, password: newPass };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      let users = JSON.parse(localStorage.getItem("users")) || [];
      users = users.map((u) =>
        u.email === user.email ? updatedUser : u
      );

      localStorage.setItem("users", JSON.stringify(users));

      setFormData(updatedUser);
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
      setForcePasswordUpdate(false);
      localStorage.removeItem("forcePasswordUpdate");

      alert("Password changed successfully!");
    } catch (err) {
      alert("Server error!");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">

      <div className="max-w-5xl mx-auto">

        {/* PROFILE HEADER */}
        <div className="bg-white shadow rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

          <div className="flex items-center gap-4">

            <div className="flex flex-col items-center">
              <img
                src={
                  formData.profilePic ||
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e5e7eb'/%3E%3Ctext x='50' y='55' font-family='Arial,Helvetica,sans-serif' font-size='24' text-anchor='middle' fill='%239ca3af'%3E%3F%3C/text%3E%3C/svg%3E"
                }
                alt="profile"
                className="w-20 h-20 rounded-full object-cover border"
              />

              {isEdit && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-2 text-xs"
                />
              )}
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                {formData.name}
              </h2>
              <p className="text-gray-500 text-sm">
                {formData.email}
              </p>

              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                Verified User
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (isEdit) handleSave();
              else setIsEdit(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {isEdit ? "Save" : "Edit Profile"}
          </button>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="md:col-span-2 bg-white p-6 rounded-xl shadow">

            <h3 className="text-lg font-semibold mb-4">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <p className="text-gray-500 text-sm">Full Name</p>
                {isEdit ? (
                  <input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <p className="font-medium">{formData.name}</p>
                )}
              </div>

              <div>
                <p className="text-gray-500 text-sm">Email</p>
                <p className="font-medium">{formData.email}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Phone</p>
                {isEdit ? (
                  <input
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <p className="font-medium">
                    {formData.phone || "Not Added"}
                  </p>
                )}
              </div>

              <div>
                <p className="text-gray-500 text-sm">Address</p>
                {isEdit ? (
                  <input
                    value={formData.address || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="border p-2 rounded w-full"
                  />
                ) : (
                  <p className="font-medium">
                    {formData.address || "Not Added"}
                  </p>
                )}
              </div>

            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow flex flex-col justify-between">

            <h3 className="text-lg font-semibold mb-4">
              Account
            </h3>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>

          </div>
        </div>

        {/* PASSWORD */}
        <div className="bg-white mt-6 p-6 rounded-xl shadow max-w-lg">

          <h3 className="text-lg font-semibold mb-4">
            Change Password
          </h3>

          {forcePasswordUpdate && (
            <div className="mb-4 rounded border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
              You must update your password after OTP verification.
            </div>
          )}

          {!forcePasswordUpdate && (
            <input
              type="password"
              placeholder="Old Password"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              className="border p-2 rounded w-full mb-3"
            />
          )}

          <input
            type="password"
            placeholder="New Password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            className="border p-2 rounded w-full mb-3"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            className="border p-2 rounded w-full mb-3"
          />

          <button
            onClick={handleChangePassword}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Update Password
          </button>

        </div>

      </div>
    </div>
  );
};

export default Profile;