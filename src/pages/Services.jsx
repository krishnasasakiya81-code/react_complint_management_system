import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ServicesHero from "../components/common/ServicesHero";

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  const handleSelect = () => {
    const user = localStorage.getItem("currentUser");

    if (!user) {
      localStorage.setItem("redirectAfterLogin", "/submit-complaint");
      navigate("/login");
    } else {
      navigate("/submit-complaint");
    }
  };

  // 🔥 Fetch services from backend
  useEffect(() => {
    fetch("http://localhost:5000/services")
      .then(res => res.json())
      .then(data => setServices(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <ServicesHero />

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">

        {services.map((service) => (
          <div key={service._id} className="bg-white rounded-lg shadow">

            <img
              src={service.image}
              alt=""
              className="w-full h-48 object-cover rounded-t-lg"
            />

            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">
                {service.title}
              </h3>

              <p className="text-gray-600 text-sm">
                {service.description}
              </p>

              <button
                onClick={handleSelect}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Select Category →
              </button>
            </div>

          </div>
        ))}

      </div>
    </>
  );
};

export default Services;