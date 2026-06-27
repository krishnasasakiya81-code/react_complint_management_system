import { useEffect, useState } from "react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await fetch("http://localhost:5000/admin/users");
        const complaintsRes = await fetch("http://localhost:5000/admin/complaints");

        let usersData = [];
        if (usersRes.ok) usersData = await usersRes.json();

        const complaintsData = await complaintsRes.json();

        setUsers(Array.isArray(usersData) ? usersData : []);
        setComplaints(Array.isArray(complaintsData) ? complaintsData : []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const getComplaintCount = (email) => {
    return complaints.filter(c => c.userEmail === email).length;
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === "All" || u.status === statusFilter;

    return matchSearch && matchStatus;
  });

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Suspended" : "Active";

    try {
      await fetch(`http://localhost:5000/admin/users/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      setUsers(users.map(u =>
        u._id === id ? { ...u, status: newStatus } : u
      ));
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  return (
    <div className="bg-[#f5f7fb] min-h-screen p-4 sm:p-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>
          <p className="text-gray-500 text-sm">View and manage citizen accounts</p>
        </div>

        
      </div>

      {/* FILTER */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col sm:flex-row flex-wrap gap-3">

        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-72"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto"
        >
          <option value="All">All Status</option>
          <option value="Active">Active</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="min-w-[800px] w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="p-3 text-left">User ID</th>
              <th className="p-3 text-left">Citizen Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date Joined</th>
              <th className="p-3 text-left">Complaints</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">

                <td className="p-3 text-blue-600 font-medium whitespace-nowrap">
                  {u._id?.slice(-4).toUpperCase()}
                </td>

                <td className="p-3 whitespace-nowrap">{u.name}</td>

                <td className="p-3 whitespace-nowrap">{u.email}</td>

                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs
                    ${u.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}
                  `}>
                    {u.status}
                  </span>
                </td>

                <td className="p-3 whitespace-nowrap">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}
                </td>

                <td className="p-3">
                  {getComplaintCount(u.email)}
                </td>

                <td className="p-3">
                  <button
                    onClick={() => toggleStatus(u._id, u.status)}
                    className="bg-gray-200 px-3 py-1 rounded text-xs"
                  >
                    Toggle
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

        <div className="p-3 text-sm text-gray-500">
          Showing {filteredUsers.length} users
        </div>
      </div>

    </div>
  );
};

export default Users;