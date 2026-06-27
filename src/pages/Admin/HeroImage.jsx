import React, { useState } from "react";

const HeroImage = () => {

  const [image, setImage] = useState("");

  const handleUpdate = () => {
    fetch("http://localhost:5000/admin/hero-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image }),
    })
      .then(res => res.json())
      .then(() => {
        alert("Image Updated Successfully ✅");
      })
      .catch(err => console.error(err));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Hero Image Management</h1>

      <input
        type="text"
        placeholder="Paste Image URL"
        className="border p-2 w-full mb-4"
        onChange={(e) => setImage(e.target.value)}
      />

      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Update Image
      </button>
    </div>
  );
};

export default HeroImage;