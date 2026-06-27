const express = require("express");
const router = express.Router();

const Department = require("../models/Department");
const Complaint = require("../models/Complaint");

// ✅ DEPARTMENT LOGIN
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const department = await Department.findOne({ mobile, password });

    if (!department) {
      return res.status(401).json({ error: "Invalid mobile or password" });
    }

    res.json({
      _id: department._id,
      city: department.city,
      head: department.head,
      mobile: department.mobile,
      email: department.email,
      status: department.status,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET DEPARTMENT COMPLAINTS BY CITY
router.get("/:city/complaints", async (req, res) => {
  try {
    const { city } = req.params;
    
    const complaints = await Complaint.find({ 
      city: { $regex: new RegExp(city, "i") }
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ MARK COMPLAINT AS SOLVED BY DEPARTMENT
router.put("/:departmentId/complaints/:complaintId/solve", async (req, res) => {
  try {
    const { departmentId, complaintId } = req.params;
    const { solvedBy } = req.body;

    // Find and update complaint
    const complaint = await Complaint.findByIdAndUpdate(
      complaintId,
      {
        isSolved: true,
        solvedAt: new Date(),
        solvedBy: solvedBy,
      },
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    // Get the department and increment solvedCount
    const department = await Department.findByIdAndUpdate(
      departmentId,
      { $inc: { solvedCount: 1 } },
      { new: true }
    );

    res.json({
      message: "Complaint marked as solved ✅",
      complaint,
      department
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET DEPARTMENT SOLVED COUNT
router.get("/:departmentId/solved-count", async (req, res) => {
  try {
    const { departmentId } = req.params;

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    res.json({
      _id: department._id,
      city: department.city,
      solvedCount: department.solvedCount,
      complaintCount: department.complaintCount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET ALL DEPARTMENTS WITH SOLVED COUNT
router.get("/", async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
