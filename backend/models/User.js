const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  password: String,
  resetOTP: String,
  resetOTPExpires: Date,
  phone: String,
  city: String,
  address: String,
  role: {
    type: String,
    enum: ["user", "admin", "department_head"],
    default: "user",
  },
  status: {
    type: String,
    enum: ["Active", "Suspended"],
    default: "Active",
  },
  department: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
