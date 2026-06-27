import React, { useEffect, useState } from "react";

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  const fetchServices = () => {
    fetch("http://localhost:5000/services")
      .then(res => res.json())
      .then(data => setServices(data));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const saveService = () => {
    if (!title || !description || !image) {
      alert("Please fill all fields");
      return;
    }

    const url = selectedServiceId
      ? `http://localhost:5000/services/${selectedServiceId}`
      : "http://localhost:5000/services";
    const method = selectedServiceId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, image })
    }).then(() => {
      fetchServices();
      setTitle("");
      setDescription("");
      setImage("");
      setSelectedServiceId(null);
    });
  };

  const startEditService = (service) => {
    setSelectedServiceId(service._id);
    setTitle(service.title || "");
    setDescription(service.description || "");
    setImage(service.image || "");
  };

  const cancelEdit = () => {
    setSelectedServiceId(null);
    setTitle("");
    setDescription("");
    setImage("");
  };

  const deleteService = (id) => {
    fetch(`http://localhost:5000/services/${id}`, {
      method: "DELETE"
    }).then(() => fetchServices());
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">

      <h2 className="text-2xl font-bold mb-6">Manage Services</h2>

      {/* 🔥 FORM CARD */}
      <div className="bg-white p-5 rounded-xl shadow mb-8">

        <div className="grid md:grid-cols-3 gap-4">

          <input
            placeholder="Service Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="border p-2 rounded"
          />

        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          <button
            onClick={saveService}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {selectedServiceId ? "Update Service" : "+ Add Service"}
          </button>
          {selectedServiceId && (
            <button
              onClick={cancelEdit}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>

      </div>

      {/* 🔥 SERVICE CARDS */}
      <div className="grid md:grid-cols-2 gap-6">

        {services.map((s) => (
          <div key={s._id} className="bg-white rounded-xl shadow overflow-hidden">

            <img
              src={s.image}
              alt={s.title}
              className="h-48 w-full object-cover"
            />

            <div className="p-4">

              <h3 className="text-lg font-bold mb-1">{s.title}</h3>

              <p className="text-gray-600 text-sm mb-3">
                {s.description}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => startEditService(s)}
                  className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                >
                  Update
                </button>
                <button
                  onClick={() => deleteService(s._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default AdminServices;