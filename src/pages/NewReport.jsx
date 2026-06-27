import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewReport = () => {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    category: "",
    subject: "",
    description: "",
    location: ""
  });

  const [image, setImage] = useState(null); // preview
  const [file, setFile] = useState(null);   // actual file

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // IMAGE UPLOAD (same UI)
  const handleImageUpload = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {

      if (selectedFile.size > 300000) {
        alert("Image too large! Max 300KB");
        return;
      }

      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };

      reader.readAsDataURL(selectedFile);
    }
  };

  const getCoordinates = async (city) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${city}`
      );
      const data = await res.json();

      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const coords = await getCoordinates(form.location);

      if (!coords) {
        alert("Invalid location");
        return;
      }

      const cleanCity =
        form.location.trim().charAt(0).toUpperCase() +
        form.location.trim().slice(1);

      // ✅ FIXED USER FETCH (NO CRASH)
      const storedUser = localStorage.getItem("currentUser");

      if (!storedUser) {
        alert("Session expired, please login again ❌");
        navigate("/login");
        return;
      }

      const currentUser = JSON.parse(storedUser);

      if (!currentUser || !currentUser.email) {
        alert("User data missing ❌");
        navigate("/login");
        return;
      }

      const formData = new FormData();

      formData.append("userEmail", currentUser.email);
      formData.append("userName", currentUser.name);
      formData.append("category", form.category);
      formData.append("subject", form.subject);
      formData.append("description", form.description);
      formData.append("location", form.location);
      formData.append("city", cleanCity);
      formData.append("lat", coords.lat);
      formData.append("lng", coords.lng);
      formData.append("status", "Pending");

      if (file) {
        formData.append("image", file);
      }

      const response = await fetch("http://localhost:5000/admin/complaint", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to save complaint");
      }

      alert("Complaint Submitted successfully! ✅");

      setForm({
        category: "",
        subject: "",
        description: "",
        location: ""
      });

      setImage(null);
      setFile(null);

      navigate("/my-complaints");

    } catch (error) {
      console.error(error);
      alert("Something went wrong ❌");
    }
  };

  return (

    <div className="bg-gray-50 min-h-screen py-12">

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow">

        <h1 className="text-3xl font-bold mb-2">
          File a New Complaint
        </h1>

        <p className="text-gray-500 mb-8">
          Provide detailed information to help us track and resolve your issue efficiently.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <label className="block text-sm mb-2">
              Complaint Category
            </label>

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded-lg p-3"
              required
            >
              <option value="">Select category</option>
              <option>Infrastructure</option>
              <option>Sanitation</option>
              <option>Public Safety</option>
              <option>Electricity</option>
              <option>Water Supply</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Subject</label>

            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="Brief summary of the issue"
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Detailed Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the incident..."
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Location / Address</label>

            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Enter city (e.g. Ahmedabad)"
              className="w-full border rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Attachments</label>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="fileUpload"
              />

              <label htmlFor="fileUpload" className="cursor-pointer">
                <div className="text-blue-500 text-3xl mb-2">⬆</div>
                <p className="text-gray-600">Click to upload</p>
                <p className="text-gray-400 text-sm">PNG, JPG (max 300KB)</p>
              </label>

              {image && (
                <img
                  src={image}
                  alt="preview"
                  className="mt-4 w-32 mx-auto rounded object-cover"
                />
              )}

            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Submit Complaint
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default NewReport;