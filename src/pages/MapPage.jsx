import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// 🔧 Fix leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// 🎨 Status-based marker icon
const getIcon = (status) => {
  const s = status?.toLowerCase();

  return new L.Icon({
    iconUrl:
      s === "resolved"
        ? "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
        : s === "pending"
        ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
        : "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    iconSize: [30, 30],
  });
};

// 🌍 GUJARAT CITY COORDINATES
const cityCoords = {
  ahmedabad: [23.0225, 72.5714],
  surat: [21.1702, 72.8311],
  vadodara: [22.3072, 73.1812],
  rajkot: [22.3039, 70.8022],
  gandhinagar: [23.2156, 72.6369],
  bhavnagar: [21.7645, 72.1519],
  jamnagar: [22.4707, 70.0577],
};

const MapPage = () => {

  // 📦 Get data
  const stored = JSON.parse(localStorage.getItem("complaints")) || [];

  // 🔥 Filter valid complaints
  const complaints = stored.filter((c) => c);

  // 📊 Counts
  const total = complaints.length;
  const resolved = complaints.filter(c => c.status?.toLowerCase() === "resolved").length;
  const pending = complaints.filter(c => c.status?.toLowerCase() === "pending").length;
  const progress = complaints.filter(c => c.status?.toLowerCase() === "in progress").length;

  return (
    <div className="flex h-screen">

      {/* 🔹 LEFT PANEL */}
      <div className="w-1/4 bg-gray-100 p-4">
        <h2 className="text-xl font-bold mb-4">Impact Map</h2>

        <div className="bg-white p-3 rounded shadow mb-3">
          <p>Total Complaints</p>
          <h2 className="font-bold">{total}</h2>
        </div>

        <div className="bg-white p-3 rounded shadow mb-3">
          <p className="text-green-600">Resolved</p>
          <h2 className="font-bold">{resolved}</h2>
        </div>

        <div className="bg-white p-3 rounded shadow mb-3">
          <p className="text-red-600">Pending</p>
          <h2 className="font-bold">{pending}</h2>
        </div>

        <div className="bg-white p-3 rounded shadow">
          <p className="text-blue-600">In Progress</p>
          <h2 className="font-bold">{progress}</h2>
        </div>
      </div>

      {/* 🔹 MAP */}
      <div className="w-3/4 flex justify-center items-center bg-gray-200 relative">

        <div className="w-[95%] h-[90%] rounded-xl overflow-hidden shadow-lg relative">

          <MapContainer
            center={[22.2587, 71.1924]} // Gujarat center
            zoom={7}
            minZoom={6}
            maxBounds={[
              [20, 68],
              [25, 75],
            ]}
            className="h-full w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* 📍 MARKERS */}
            {complaints.map((c, index) => {

              let lat = c.lat;
              let lng = c.lng;

              // 🔥 If no lat/lng → use city
              if ((!lat || !lng) && c.city) {
                const coords = cityCoords[c.city.toLowerCase()];
                if (coords) {
                  lat = coords[0];
                  lng = coords[1];
                }
              }

              // ❌ Skip invalid
              if (!lat || !lng) return null;

              return (
                <Marker
                  key={index}
                  position={[parseFloat(lat), parseFloat(lng)]}
                  icon={getIcon(c.status)}
                >
                  <Popup>
                    <b>{c.city || "Unknown"}</b> <br />
                    {c.subject} <br />
                    Status: {c.status}
                  </Popup>
                </Marker>
              );
            })}

          </MapContainer>

          {/* ✅ SUMMARY */}
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-white px-6 py-2 rounded shadow flex gap-4 z-[1000]">
            <span>All: {total}</span>
            <span className="text-green-600">Resolved: {resolved}</span>
            <span className="text-red-600">Pending: {pending}</span>
            <span className="text-blue-600">Progress: {progress}</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MapPage;