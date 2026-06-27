import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DepartmentAuthContext } from "../context/DepartmentAuthContext";

const DepartmentDashboard = () => {
  const navigate = useNavigate();
  const { department, logout } = useContext(DepartmentAuthContext);

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [solvedCount, setSolvedCount] = useState(0);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    if (!department) {
      navigate("/login");
      return;
    }

    fetchComplaints();
    fetchSolvedCount();
  }, [department, navigate]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/department/${department.city}/complaints`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch complaints");
      }

      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const fetchSolvedCount = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/department/${department._id}/solved-count`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch solved count");
      }

      const data = await response.json();
      setSolvedCount(data.solvedCount);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSolveComplaint = async (complaintId) => {
    if (
      !window.confirm(
        "Are you sure you want to mark this complaint as solved?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/department/${department._id}/complaints/${complaintId}/solve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ solvedBy: department.head }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark complaint as solved");
      }

      alert("Complaint marked as solved! ✅");
      fetchComplaints();
      fetchSolvedCount();
    } catch (error) {
      console.error(error);
      alert("Failed to mark complaint as solved");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!department) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading complaints...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Under Review":
        return "bg-blue-100 text-blue-800";
      case "Assigned":
        return "bg-purple-100 text-purple-800";
      case "In Progress":
        return "bg-cyan-100 text-cyan-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Low":
        return "text-green-600";
      case "Medium":
        return "text-yellow-600";
      case "High":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const filteredComplaints =
    filter === "All"
      ? complaints
      : complaints.filter((c) => c.status === filter);

  const unsolvedCount = filteredComplaints.filter((c) => !c.isSolved).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">GovTrack</h1>
            <p className="text-gray-600 text-sm">Department Dashboard</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-sm text-gray-500">Logged in as:</p>
              <p className="text-lg font-semibold text-gray-900">
                {department.head} - {department.city}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Complaints</h3>
            <p className="text-4xl font-bold text-blue-600">{filteredComplaints.length}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Unsolved</h3>
            <p className="text-4xl font-bold text-yellow-600">{unsolvedCount}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Solved</h3>
            <p className="text-4xl font-bold text-green-600">{solvedCount}</p>
          </div>
        </div>

        {/* FILTER AND REFRESH */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Status
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <button
              onClick={fetchComplaints}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* COMPLAINTS TABLE */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Solved
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No complaints found for your city.
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {complaint._id?.slice(-6) || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {complaint.category || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {complaint.subject || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            complaint.status
                          )}`}
                        >
                          {complaint.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        <span className={getPriorityColor(complaint.priority)}>
                          {complaint.priority || "Medium"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {complaint.isSolved ? (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            ✅ Yes
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            ❌ No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {!complaint.isSolved ? (
                          <button
                            onClick={() => handleSolveComplaint(complaint._id)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition text-xs"
                          >
                            Mark as Solved
                          </button>
                        ) : (
                          <span className="text-gray-500 text-xs">Already Solved</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;
