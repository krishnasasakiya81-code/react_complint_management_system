const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  city: String,
  head: String,
  mobile: String,
  email: String,
  status: String,
  password: String,

  // ✅ ADD THIS FIELD
  complaintCount: {
    type: Number,
    default: 0,
  },

  // ✅ SOLVED COMPLAINTS COUNT
  solvedCount: {
    type: Number,
    default: 0,
  }

}, { timestamps: true });

module.exports = mongoose.model("Department", departmentSchema);