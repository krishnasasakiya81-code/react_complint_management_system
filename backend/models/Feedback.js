const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  complaintId: mongoose.Schema.Types.ObjectId,
  userEmail: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  comments: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
