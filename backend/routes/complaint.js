const express = require("express");
const router = express.Router();

const Department = require("../models/Department");
const Complaint = require("../models/Complaint");

router.post("/", async (req, res) => {
  try {
    const { city, description } = req.body;

    // complaint save
    await Complaint.create({
      city,
      description,
    });

    // count increase
    await Department.findOneAndUpdate(
      { city },
      { $inc: { complaintCount: 1 } }
    );

    res.json({ msg: "Complaint submitted" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error" });
  }
});

module.exports = router;