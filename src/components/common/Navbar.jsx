import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Landmark, Menu, X } from "lucide-react";

const Navbar = () => {

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex justify-between items-center h-16 relative">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <Landmark className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              GOVTRACK
            </span>
          </Link>

          {/* CENTER MENU */}
          <div className="hidden md:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">

            <Link to="/" className="text-gray-700 hover:text-black">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-black">About</Link>
            <Link to="/services" className="text-gray-700 hover:text-black">Services</Link>
            <Link to="/track" className="text-gray-700 hover:text-black">Track</Link>
            <Link to="/feedback" className="text-gray-700 hover:text-black">Feedback</Link>

            {user && (
              <>
                <Link to="/my-complaints" className="text-gray-700 hover:text-black">
                  My Complaints
                </Link>
                <Link to="/submit-complaint" className="text-gray-700 hover:text-black">
                  New Report
                </Link>
              </>
            )}

          </div>

          {/* RIGHT SIDE */}
          <div className="hidden md:flex items-center gap-4">

            {!user ? (
              <>
                <Link to="/login" className="text-gray-700 hover:text-black">
                  Login
                </Link>
                <Link to="/register" className="text-gray-700 hover:text-black">
                  Register
                </Link>
              </>
            ) : (
              <>
                <span
                  onClick={() => navigate("/profile")}
                  className="text-gray-700 cursor-pointer"
                >
                  {user.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Logout
                </button>
              </>
            )}

          </div>

          {/* MOBILE BUTTON */}
          <div className="md:hidden">
            <button onClick={() => setOpen(!open)}>
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden flex flex-col gap-3 mt-4 pb-4">

            <Link to="/" onClick={()=>setOpen(false)} className="text-gray-700">Home</Link>
            <Link to="/about" onClick={()=>setOpen(false)} className="text-gray-700">About</Link>
            <Link to="/services" onClick={()=>setOpen(false)} className="text-gray-700">Services</Link>
            <Link to="/track" onClick={()=>setOpen(false)} className="text-gray-700">Track</Link>
            <Link to="/feedback" onClick={()=>setOpen(false)} className="text-gray-700">Feedback</Link>

            {user && (
              <>
                <Link to="/my-complaints" onClick={()=>setOpen(false)} className="text-gray-700">
                  My Complaints
                </Link>

                <Link to="/submit-complaint" onClick={()=>setOpen(false)} className="text-gray-700">
                  New Report
                </Link>

                <span
                  onClick={() => {
                    navigate("/profile");
                    setOpen(false);
                  }}
                  className="text-gray-700 cursor-pointer"
                >
                  {user.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-blue-600 text-white px-3 py-2 rounded w-fit"
                >
                  Logout
                </button>
              </>
            )}

            {!user && (
              <>
                <Link to="/login" onClick={()=>setOpen(false)} className="text-gray-700">
                  Login
                </Link>
                <Link to="/register" onClick={()=>setOpen(false)} className="text-gray-700">
                  Register
                </Link>
              </>
            )}

          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;