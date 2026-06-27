import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyComplaints = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("All");
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));

      if (!currentUser?.email) {
        setComplaints([]);
        return;
      }

      try {
        const res = await fetch(`http://localhost:5000/my-complaints/${encodeURIComponent(currentUser.email)}`);
        const data = await res.json();

        if (res.ok) {
          const updatedData = data.map((item, index) => ({
            ...item,
            customId: 1000 + index + 1
          }));

          setComplaints(updatedData);
          localStorage.setItem("complaints", JSON.stringify(updatedData));

        } else {
          throw new Error("API failed");
        }

      } catch (err) {
        console.error("API error, loading from localStorage", err);
        const saved = JSON.parse(localStorage.getItem("complaints")) || [];
        setComplaints(saved);
      }
    };

    fetchComplaints();
  }, []);

  const filteredComplaints =
    filter === "All"
      ? complaints
      : complaints.filter(c => c.status === filter);

  const pendingCount = complaints.filter(c => c.status === "Pending").length;
  const progressCount = complaints.filter(c => c.status === "In Progress").length;
  const resolvedCount = complaints.filter(c => c.status === "Resolved").length;

  return (
    <div className="bg-gray-50 min-h-screen py-6 sm:py-10">

      <div className="max-w-6xl mx-auto px-4">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">My Complaints</h1>
            <p className="text-gray-500 text-sm sm:text-base">
              Track and manage your submitted reports
            </p>
          </div>

          <button
            onClick={() => navigate("/submit-complaint")}
            className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + File New Complaint
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {["All", "Pending", "In Progress", "Resolved"].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded text-sm ${
                filter === tab
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* DESKTOP */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">

            <thead className="border-b text-gray-500 text-sm">
              <tr>
                <th className="p-4 text-left">Complaint ID</th>
                <th>Date</th>
                <th>Category</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-400">
                    No complaints found
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((c, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">

                    <td className="p-4 font-medium">#{c.customId}</td>
                    <td>{c.date}</td>

                    <td>
                      <div className="flex items-center gap-3">
                        <span className="bg-gray-100 px-3 py-1 rounded text-sm">
                          {c.category}
                        </span>

                        {c.image ? (
                          <img
                            src={`http://localhost:5000${c.image}`}
                            alt="complaint"
                            className="w-12 h-12 object-cover rounded border"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">No Image</span>
                        )}
                      </div>
                    </td>

                    <td>
                      <span className={`px-3 py-1 rounded text-sm ${
                        c.status === "Resolved"
                          ? "bg-green-100 text-green-600"
                          : c.status === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-blue-100 text-blue-600"
                      }`}>
                        {c.status}
                      </span>
                    </td>

                    <td
                      className="text-blue-600 cursor-pointer"
                      onClick={() => alert(`Viewing ${c.customId}`)}
                    >
                      View Details
                    </td>

                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

        {/* MOBILE */}
        <div className="md:hidden space-y-4">
          {filteredComplaints.length === 0 ? (
            <p className="text-center text-gray-400">No complaints found</p>
          ) : (
            filteredComplaints.map((c, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4 space-y-2">

                <div className="flex justify-between">
                  <span className="font-bold">#{c.customId}</span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    c.status === "Resolved"
                      ? "bg-green-100 text-green-600"
                      : c.status === "Pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-blue-100 text-blue-600"
                  }`}>
                    {c.status}
                  </span>
                </div>

                <p className="text-sm text-gray-500">{c.date}</p>

                <div className="flex items-center gap-3">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {c.category}
                  </span>

                  {c.image && (
                    <img
                      src={`http://localhost:5000${c.image}`}
                      alt="complaint"
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                </div>

                <button
                  className="text-blue-600 text-sm"
                  onClick={() => alert(`Viewing ${c.customId}`)}
                >
                  View Details
                </button>

              </div>
            ))
          )}
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">

          <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full text-xl">📋</div>
            <div>
              <p className="text-gray-500 text-sm">Pending Review</p>
              <h3 className="text-xl font-bold">{pendingCount}</h3>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-full text-xl">🔄</div>
            <div>
              <p className="text-gray-500 text-sm">In Progress</p>
              <h3 className="text-xl font-bold">{progressCount}</h3>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-5 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-full text-xl">✔</div>
            <div>
              <p className="text-gray-500 text-sm">Resolved Total</p>
              <h3 className="text-xl font-bold">{resolvedCount}</h3>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MyComplaints;