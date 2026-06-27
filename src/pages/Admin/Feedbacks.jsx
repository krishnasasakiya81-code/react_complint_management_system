import React, { useState } from "react";

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState(
    JSON.parse(localStorage.getItem("feedbacks")) || []
  );

  const total = feedbacks.length;

  const avgRating =
    total === 0
      ? 0
      : (
          feedbacks.reduce((sum, f) => sum + f.rating, 0) /
          total
        ).toFixed(1);

  const today = new Date().toLocaleDateString();

  const todayCount = feedbacks.filter(
    (f) => f.date === today
  ).length;

  const updateStatus = (id, newStatus) => {
    const updated = feedbacks.map((f) =>
      f.id === id ? { ...f, status: newStatus } : f
    );

    setFeedbacks(updated);
    localStorage.setItem("feedbacks", JSON.stringify(updated));
  };

  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();

    if (s === "responded")
      return "bg-green-100 text-green-700";
    if (s === "reviewed")
      return "bg-blue-100 text-blue-700";

    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">
            User Feedback Management
          </h1>
          <p className="text-gray-500 text-sm">
            Monitor and respond to citizen feedback.
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Total Feedbacks</p>
          <h2 className="text-2xl font-bold">{total}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Average Rating</p>
          <h2 className="text-2xl font-bold">
            {avgRating}/5.0
          </h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">New Today</p>
          <h2 className="text-2xl font-bold">
            {todayCount}
          </h2>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-x-auto">

        <table className="min-w-[700px] w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Message</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {feedbacks.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  No feedback found
                </td>
              </tr>
            ) : (
              feedbacks.map((f) => (
                <tr
                  key={f.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3 whitespace-nowrap">{f.date}</td>

                  <td className="p-3 font-medium whitespace-nowrap">
                    {f.subject}
                  </td>

                  <td className="p-3 text-gray-600 max-w-[200px] truncate">
                    {f.message}
                  </td>

                  <td className="p-3 text-yellow-500 whitespace-nowrap">
                    {"★".repeat(f.rating)}
                    {"☆".repeat(5 - f.rating)}
                  </td>

                  <td className="p-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusStyle(
                        f.status || "pending"
                      )}`}
                    >
                      {f.status || "Pending"}
                    </span>
                  </td>

                  <td className="p-3 whitespace-nowrap">
                    {(f.status || "pending") === "pending" ? (
                      <button
                        onClick={() =>
                          updateStatus(f.id, "Responded")
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Respond
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          updateStatus(f.id, "Reviewed")
                        }
                        className="text-blue-600 text-xs"
                      >
                        View Details
                      </button>
                    )}
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Feedbacks;