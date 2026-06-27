import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {

  const navigate = useNavigate();

  const [resolvedCount, setResolvedCount] = useState(0);
  const [heroImg, setHeroImg] = useState("");

  // 🔥 FETCH RESOLVED COUNT + HERO IMAGE
  useEffect(() => {
    // count
    fetch("http://localhost:5000/complaints/resolved/count")
      .then(res => res.json())
      .then(data => {
        setResolvedCount(data.count);
      })
      .catch(err => console.error(err));

    // hero image
    fetch("http://localhost:5000/hero-image")
      .then(res => res.json())
      .then(data => {
        setHeroImg(data.image);
      })
      .catch(err => console.error(err));

  }, []);

  // Complaint button logic
  const handleComplaint = () => {
    const user = localStorage.getItem("currentUser");

    if (!user) {
      localStorage.setItem("redirectAfterLogin", "/submit-complaint");
      navigate("/login");
    } else {
      navigate("/submit-complaint");
    }
  };

  // Track button logic
  const handleTrack = () => {
    const user = localStorage.getItem("currentUser");

    if (!user) {
      localStorage.setItem("redirectAfterLogin", "/track");
      navigate("/login");
    } else {
      navigate("/track");
    }
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div>

            <div className="inline-block bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              OFFICIAL GOVERNMENT PORTAL
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="text-gray-900">Public Voice:</span>
              <br />
              <span className="text-blue-600">Transparent</span>
              <span className="text-gray-900"> Issue Tracking</span>
            </h1>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Empowering citizens to report and track public service issues effectively.
              Our platform ensures accountability and rapid resolution for all community grievances.
            </p>

            {/* Stats */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gray-500 rounded-full border-2 border-white"></div>
                </div>
                <span className="text-gray-600 text-sm">
                  Joined by <strong>50,000+</strong> active citizens
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">

              <button
                onClick={handleComplaint}
                className="bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700 transition"
              >
                File a Complaint
              </button>

              <button
                onClick={handleTrack}
                className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded font-semibold hover:border-gray-400 transition"
              >
                Track Status
              </button>

            </div>
          </div>

          {/* Right Image */}
          <div className="relative rounded-lg overflow-hidden h-96">

            <img
              src={heroImg || "https://t3.ftcdn.net/jpg/04/53/31/70/360_F_453317039_vgYyunvq6lALcAzte0pkE5Hz5gRGsPJr.jpg"}
              alt="Government Building"
              className="w-full h-full object-cover"
            />

            {/* Stats Card */}
            <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-lg p-4 w-48">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 text-sm">
                  ISSUES RESOLVED
                </span>
              </div>

              <h3 className="text-3xl font-bold text-gray-900">
                {resolvedCount.toLocaleString()}
              </h3>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;