const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);


require('dotenv').config();
const multer = require("multer");
const path = require("path");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const axios = require("axios");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

const Complaint = require("./models/Complaint");
const User = require("./models/User");
const Feedback = require("./models/Feedback");
const Department = require("./models/Department");
const Service = require("./models/Service");
const departmentRoutes = require("./routes/department");

const app = express();

/* ===================================================== */
/* 🔥 HERO IMAGE DYNAMIC */
/* ===================================================== */

let heroImage = "https://t3.ftcdn.net/jpg/04/53/31/70/360_F_453317039_vgYyunvq6lALcAzte0pkE5Hz5gRGsPJr.jpg";

/* GET IMAGE */
app.get("/hero-image", (req, res) => {
  res.json({ image: heroImage });
});

/* UPDATE IMAGE (ADMIN) */
app.post("/admin/hero-image", (req, res) => {
  heroImage = req.body.image;
  res.json({ message: "Image updated ✅" });
});




/* ================== MULTER ================== */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static("uploads"));

/* ================== MIDDLEWARE ================== */
app.use(cors());
app.use(express.json({ limit: "5mb" }));

/* ================== DB ================== */
connectDB()
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

/* ================== EMAIL ================== */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "krishnasasakiya81@gmail.com",
    pass: process.env.EMAIL_PASS || "ueejlsxffkurnlgp",
  },
});

const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;

const pendingDepartmentOtps = new Map();

/* ================== LOGIN ================== */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================== REGISTER ================== */
app.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      phone,
      password,
      status: "Active"
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: newUser
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================== FORGOT PASSWORD ================== */
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Email address not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.resetOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const mailOptions = {
      from: "GOVTRACK <krishnasasakiya81@gmail.com>",
      to: user.email,
      subject: "Your GOVTRACK OTP Code",
      text: `Hello ${user.name || "User"},\n\nYour GOVTRACK verification code is: ${otp}\n\nUse this code within 10 minutes to login. If you did not request this, please ignore this email.\n\nThanks,\nThe GOVTRACK Team`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "OTP sent to your email. Please check your inbox." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================== VERIFY OTP ================== */
app.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, resetOTP: otp });

    if (!user || !user.resetOTPExpires || user.resetOTPExpires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    user.resetOTP = undefined;
    user.resetOTPExpires = undefined;
    await user.save();

    res.json({
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




/* ================== CHANGE PASSWORD ================== */
app.put("/change-password", async (req, res) => {
  try {
    const { email, oldPassword, newPassword, skipOldPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!skipOldPassword) {
      if (!oldPassword || user.password !== oldPassword) {
        return res.status(400).json({ error: "Old password is incorrect" });
      }
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET SERVICES
app.get("/services", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ ADD SERVICE
app.post("/services", async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ DELETE SERVICE
app.delete("/services/:id", async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ? UPDATE SERVICE
app.put("/services/:id", async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
      },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.json(updatedService);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





/* ================== SAVE COMPLAINT ================== */
app.post("/admin/complaint", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const data = new Complaint({
      ...req.body,
      userEmail: req.body.userEmail || req.body.email,
      image: imagePath,
    });

    await data.save();

    res.status(201).json({
      message: "Complaint Saved",
      complaint: data
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================== ADMIN GET ALL COMPLAINTS ================== */
app.get("/admin/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




/* ===================================================== */
/* 🔥 GET RESOLVED COUNT */
/* ===================================================== */
app.get("/complaints/resolved/count", async (req, res) => {
  try {
    const count = await Complaint.countDocuments({
      status: { $regex: "^resolved$", $options: "i" }
    });

    res.json({ count });

  } catch (err) {
    console.error("❌ Count Error:", err);
    res.status(500).json({ error: err.message });
  }
});







/* ================== 🔥 ADD THIS (FIX) ================== */
app.put("/admin/update-status/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    res.json({ message: "Status updated", complaint: updated });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================== ADMIN USERS ================== */
app.get("/admin/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================== ADMIN DEPARTMENTS ================== */
app.get("/admin/departments", async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    res.json(departments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/admin/departments/:id", async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/admin/departments", async (req, res) => {
  try {
    const dept = new Department(req.body);
    await dept.save();
    res.json(dept);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/admin/send-department-otp", async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ error: "Invalid mobile number" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000;
    pendingDepartmentOtps.set(mobile, { otp, expires });

    if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
      try {
        await twilioClient.messages.create({
          body: `Your GOVTRACK OTP is ${otp}. It expires in 10 minutes.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: `+91${mobile}`,
        });

        return res.json({ message: "OTP sent via SMS" });
      } catch (smsErr) {
        console.error("SMS send failed", smsErr);
      }
    }

    console.log(`Department OTP for ${mobile}: ${otp}`);
    res.json({
      message: "OTP generated for testing. Configure TWILIO_* env vars to send SMS.",
      otp,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/admin/verify-department-otp", async (req, res) => {
  try {
    const { mobile, otp } = req.body;
    const record = pendingDepartmentOtps.get(mobile);

    if (!record) {
      return res.status(400).json({ error: "OTP not requested" });
    }

    if (record.expires < Date.now()) {
      pendingDepartmentOtps.delete(mobile);
      return res.status(400).json({ error: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    pendingDepartmentOtps.delete(mobile);
    res.json({ message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/admin/department-notify/:id", async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ error: "Department not found" });
    }

    const city = (department.city || "").trim();
    const complaints = await Complaint.find({
      city: { $regex: new RegExp(`^${city}$`, "i") }
    });

    const complaintList = complaints.length
      ? complaints.map((c, index) => `\n${index + 1}. ${c.title || c.description || "Complaint"} - Status: ${c.status || "N/A"}`).join("")
      : "No complaints found for this city.";

    const mailOptions = {
      from: "GOVTRACK <krishnasasakiya81@gmail.com>",
      to: department.email,
      subject: `Complaint summary for ${department.city}`,
      text: `Hello ${department.head || "Department Head"},\n\nHere is the current complaint summary for ${department.city}:\n\n${complaintList}\n\nTotal complaints: ${complaints.length}\n\nPlease take the necessary action.\n\nThanks,\nGOVTRACK`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: `Summary email sent to ${department.email}`, count: complaints.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================== USER STATUS TOGGLE ================== */
app.put("/admin/users/:id/status", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.status = user.status === "Active" ? "Suspended" : "Active";
    await user.save();

    res.json({ message: "Status updated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});








/* ================== DEPARTMENT ROUTES ================== */
app.use("/department", departmentRoutes);


/* ================== MY COMPLAINTS ================== */
app.get("/my-complaints/:email", async (req, res) => {
  try {
    const complaints = await Complaint.find({
      userEmail: req.params.email
    });

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================== SERVER ================== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
