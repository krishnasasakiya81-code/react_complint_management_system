import { useEffect, useState } from "react";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchComplaints = async () => {
    try {
      const response = await fetch("http://localhost:5000/admin/complaints");
      const data = await response.json();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((c) => {
    const complaintId = c.id || c._id || "";

    const matchSearch =
      complaintId.toString().toLowerCase().includes(search.toLowerCase()) ||
      (c.subject || "").toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "All" || c.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5000/admin/update-status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Update failed");
      }

      // 🔥 UI UPDATE WITHOUT RELOAD
      setComplaints((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, status: newStatus } : c
        )
      );

      alert("Status updated ✅");

    } catch (err) {
      console.error(err);
      alert("Unable to update complaint status ❌");
    }
  };

  return (
    <div className="bg-[#f5f7fb] min-h-screen p-4 sm:p-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Complaint Management
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Review, assign, and resolve citizen grievances efficiently.
          </p>
        </div>
      </div>

      {/* FILTER */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col sm:flex-row flex-wrap gap-3">

        <input
          type="text"
          placeholder="Search by Complaint ID, Subject..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-72"
        />

        <select className="border px-3 py-2 rounded w-full sm:w-auto">
          <option>All Categories</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto"
        >
          <option value="All">Status: All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <input
          type="date"
          className="border px-3 py-2 rounded w-full sm:w-auto"
        />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="min-w-[700px] w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-3 text-left">Complaint ID</th>
              <th className="p-3 text-left">Submitter</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredComplaints.map((c, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">

                <td className="p-3 text-blue-600 font-medium whitespace-nowrap">
                  {c._id}
                </td>

                <td className="p-3 whitespace-nowrap">
                  {c.userName || c.userEmail || "User"}
                </td>

                <td className="p-3 whitespace-nowrap">
                  {c.createdAt
                    ? new Date(c.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>

                <td className="p-3">
                  <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                    {c.category}
                  </span>
                </td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium
                    ${c.status === "Pending" && "bg-yellow-100 text-yellow-700"}
                    ${c.status === "In Progress" && "bg-blue-100 text-blue-700"}
                    ${c.status === "Resolved" && "bg-green-100 text-green-700"}
                  `}
                  >
                    {c.status}
                  </span>
                </td>

                <td className="p-3">
                  <select
                    value={c.status}
                    onChange={(e) =>
                      updateStatus(c._id, e.target.value)
                    }
                    className="border px-2 py-1 rounded w-full"
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-3 text-sm text-gray-500">
          Showing {filteredComplaints.length} complaints
        </div>
      </div>

    </div>
  );
};

export default Complaints;