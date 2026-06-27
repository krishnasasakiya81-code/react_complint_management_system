const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    userName: String,
    category: String,
    subject: String,
    description: String,
    location: String,
    city: String,
    lat: Number,
    lng: Number,

    status: {
      type: String,
      enum: ["Pending", "Under Review", "Assigned", "In Progress", "Resolved"],
      default: "Pending",
    },

    assignedTo: String,

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    // ✅ IMAGE FIX (important)
    image: {
      type: String,
      default: null,
    },

    // optional multiple images
    attachments: {
      type: [String],
      default: [],
    },

    // ✅ ADD THIS (department mobile for SMS)
    departmentMobile: String,

    // ✅ ADD THIS (optional - department id/name)
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },

    // ✅ SOLVED TRACKING
    isSolved: {
      type: Boolean,
      default: false,
    },

    solvedAt: {
      type: Date,
      default: null,
    },

    solvedBy: String,  // department name/head

  },
  {
    strict: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);