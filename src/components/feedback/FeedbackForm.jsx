import React, { useState } from "react";

const FeedbackForm = () => {
  const [form, setForm] = useState({
    subject: "",
    message: "",
    rating: 4,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRating = (value) => {
    setForm({
      ...form,
      rating: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newFeedback = {
      ...form,
      id: Date.now(),
      date: new Date().toLocaleDateString(),
    };

    const existing =
      JSON.parse(localStorage.getItem("feedbacks")) || [];

    localStorage.setItem(
      "feedbacks",
      JSON.stringify([...existing, newFeedback])
    );

    alert("Feedback Submitted!");

    setForm({
      subject: "",
      message: "",
      rating: 4,
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-2xl">

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center">
          Share Your Feedback
        </h1>

        <p className="text-gray-500 mb-6 text-center">
          Your experience helps us improve the system.
        </p>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 sm:p-8 rounded-xl shadow-md space-y-5"
        >

          {/* Subject */}
          <div>
            <label className="block mb-2 font-medium">Subject</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="What is your feedback about?"
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block mb-2 font-medium">Overall Rating</label>

            <div className="flex items-center gap-2 text-2xl cursor-pointer flex-wrap">
              {[1,2,3,4,5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleRating(star)}
                  className={
                    star <= form.rating
                      ? "text-blue-600"
                      : "text-gray-300"
                  }
                >
                  ★
                </span>
              ))}

              <span className="text-sm text-gray-600 ml-2">
                {form.rating}.0 / 5.0
              </span>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block mb-2 font-medium">Your Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="4"
              placeholder="Write your feedback..."
              className="w-full border border-gray-300 p-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">

            <button
              type="reset"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Submit Feedback
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default FeedbackForm;