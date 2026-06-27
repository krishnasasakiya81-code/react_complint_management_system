import { useState } from "react";
import { Search, ClipboardList, Building2, Calendar } from "lucide-react";

const TrackCard = () => {

  const [complaintId, setComplaintId] = useState("");
  const [data, setData] = useState(null);

  const trackComplaint = () => {

    // 🔥 GET DATA FROM LOCALSTORAGE
    const complaints = JSON.parse(localStorage.getItem("complaints")) || [];

    // ✅ FIX: use customId (NUMBER)
    const result = complaints.find(
      (item) => String(item.customId) === complaintId.trim()
    );

    if (!result) {
      alert("Complaint not found");
      setData(null);
    } else {
      setData(result);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-lg mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border p-6">

          {/* Input */}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Complaint ID
          </label>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

            <input
              type="text"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              placeholder="Enter Your Complaint ID (e.g. 1001)"
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>

          <button
            onClick={trackComplaint}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium mb-6"
          >
            Track Status
          </button>

          {data && (
            <div className="border-t pt-6 space-y-4">

              <div className="flex gap-3">
                <ClipboardList className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Complaint ID</p>
                  <p className="font-semibold">#{data.customId}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <ClipboardList className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Current Status</p>
                  <p className="font-semibold">{data.status}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Building2 className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-semibold">
                    {data.department || "General"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Calendar className="text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Last Update</p>
                  <p className="font-semibold">
                    {data.date || data.lastUpdate}
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default TrackCard;