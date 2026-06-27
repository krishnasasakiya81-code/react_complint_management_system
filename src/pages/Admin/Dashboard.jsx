import { useEffect, useState } from "react";

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);

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

    // 🔥 AUTO REFRESH every 5 sec (important)
    const interval = setInterval(() => {
      fetchComplaints();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Stats
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === "Pending").length;
  const inProgress = complaints.filter(c => c.status === "In Progress").length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold mb-2">Dashboard Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">TOTAL COMPLAINTS</p>
          <h2 className="text-2xl font-bold">{total}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">PENDING</p>
          <h2 className="text-2xl font-bold text-yellow-500">{pending}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">IN PROGRESS</p>
          <h2 className="text-2xl font-bold text-blue-500">{inProgress}</h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">RESOLVED</p>
          <h2 className="text-2xl font-bold text-green-500">{resolved}</h2>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm p-4">

        <h2 className="font-semibold mb-4">Recent Complaints</h2>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-500 text-left">
              <th className="p-2">ID</th>
              <th>User</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {complaints.slice(0, 5).map((c, i) => (
              <tr key={i} className="border-b">

                {/* 🔥 FIX: use _id */}
                <td className="p-2 font-medium text-blue-600">
                  {c._id}
                </td>

                <td>{c.userName || c.userEmail || "User"}</td>
                <td>{c.category}</td>

                <td>
                  <span className={`px-2 py-1 rounded text-xs 
                    ${c.status === "Pending" && "bg-yellow-100 text-yellow-600"}
                    ${c.status === "In Progress" && "bg-blue-100 text-blue-600"}
                    ${c.status === "Resolved" && "bg-green-100 text-green-600"}
                  `}>
                    {c.status}
                  </span>
                </td>

                <td>{c.date}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Dashboard;