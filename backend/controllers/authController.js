const User = require("../models/User");
const Otp = require("../models/otp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* =========================
   REGISTER (Patient only)
========================= */
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (role === "admin") {
      return res.status(403).json({ message: "ADMIN_REGISTER_NOT_ALLOWED" });
    }

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "MISSING_FIELDS" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "USER_EXISTS" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "hdms_fallback_secret_123",
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      token,
      role: user.role,
      name: user.name,
      _id: user._id, 
      user: user    
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
  }
};

/* =========================
   LOGIN
========================= */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "MISSING_FIELDS" });
    }

    /* 🔒 HARD CODED ADMIN */
    if (email === "ankitsingh751899@gmail.com") {
      if (password !== "Ankit@12345") {
        return res.status(401).json({ message: "INVALID_ADMIN_CREDENTIALS" });
      }

      const token = jwt.sign(
        { id: "ADMIN_ID", role: "admin" },
        process.env.JWT_SECRET || "hdms_fallback_secret_123", 
        { expiresIn: "1d" }
      );

      return res.json({
        token,
        role: "admin",
        name: "Super Admin",
        _id: "ADMIN_ID", 
        user: { _id: "ADMIN_ID", name: "Super Admin", role: "admin" } 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "INVALID_CREDENTIALS" });
    }

    // 🔥 NAYI CONDITION: Agar doctor approve nahi hai, toh login rok do!
    if (user.role === 'doctor' && !user.isApproved) {
      return res.status(403).json({ message: "Your account is pending Admin approval." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "INVALID_CREDENTIALS" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "hdms_fallback_secret_123", 
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      role: user.role,
      name: user.name,
      _id: user._id, 
      user: user    
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: "INTERNAL_SERVER_ERROR" });
  }
};

/* =========================
   SOCIAL LOGIN
========================= */
const socialLogin = async (req, res) => {
  try {
    let { name, email, role } = req.body;

    // 🔥 Default role patient
    if (!role) role = "patient";

    if (role === "admin") {
      return res.status(403).json({ message: "ADMIN_SOCIAL_LOGIN_NOT_ALLOWED" });
    }

    if (!email) {
      return res.status(400).json({ message: "EMAIL_REQUIRED" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const hashedSocialPassword = await bcrypt.hash("SOCIAL_LOGIN", 10); 
      
      user = await User.create({
        name: name || "Social User",
        email,
        password: hashedSocialPassword, 
        role,
        // (Database Schema automatically Doctor ko isApproved: false kar dega)
      });
    }

    // 🚨 YAHAN LAGA DIYA GUARD! 🚨
    // Agar Google se aaya hua user Doctor hai aur approve nahi hai, toh bahar nikalo
    if (user.role === 'doctor' && !user.isApproved) {
      return res.status(403).json({ message: "Your account is pending Admin approval. Please wait." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "hdms_fallback_secret_123", 
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      role: user.role,
      name: user.name,
      _id: user._id, 
      user: user    
    });
  } catch (err) {
    console.error("SOCIAL LOGIN ERROR:", err);
    return res.status(500).json({ message: "SOCIAL_LOGIN_FAILED" });
  }
};
/* =========================
   SEND OTP (Doctor)
========================= */
const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "PHONE_REQUIRED" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({ phone, otp });
    console.log("📲 OTP (DEV MODE):", otp);

    return res.json({ message: "OTP_SENT" });
  } catch (err) {
    console.error("OTP ERROR:", err);
    return res.status(500).json({ message: "OTP_FAILED" });
  }
};

/* =========================
   VERIFY OTP + REGISTER DOCTOR
========================= */
const verifyOtpAndRegisterDoctor = async (req, res) => {
  try {
    const { otp, doctorData } = req.body;

    const record = await Otp.findOne({
      phone: doctorData.phone,
      otp,
    });

    if (!record) {
      return res.status(400).json({ message: "INVALID_OTP" });
    }

    const userExists = await User.findOne({ email: doctorData.email });
    if (userExists) {
      return res.status(409).json({ message: "USER_EXISTS" });
    }

    const hashedPassword = await bcrypt.hash(doctorData.password, 10);

    await User.create({
      name: doctorData.name,
      email: doctorData.email,
      password: hashedPassword,
      role: "doctor",
      phone: doctorData.phone,
      specialization: doctorData.specialization,
      license: doctorData.license,
      experience: doctorData.experience,
      isApproved: false, // 🔥 Doctor hamesha by default unapproved hota hai
    });

    await Otp.deleteMany({ phone: doctorData.phone });

    return res.status(201).json({ message: "REGISTER_SUCCESS" });
  } catch (err) {
    console.error("VERIFY OTP ERROR:", err);
    return res.status(500).json({ message: "REGISTER_FAILED" });
  }
};


/* =======================================
   🔥 ADMIN SPECIFIC FUNCTIONS (NAYE HAIN) 🔥
======================================= */

// Admin Dashboard ke liye (Pending Doctor List)
// Admin Dashboard ke liye (Pending Doctor List)
const getPendingDoctors = async (req, res) => {
  try {
    // 🔥 FIX: isApproved: { $ne: true } ka matlab hai wo saare doctors lao jo true NAHI hain (chahe false ho ya khali ho)
    const pendingDoctors = await User.find({ 
      role: 'doctor', 
      isApproved: { $ne: true } 
    }).select('-password');
    
    res.json(pendingDoctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Admin Dashboard se Approve karna
const approveDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    const doctor = await User.findByIdAndUpdate(
      doctorId, 
      { isApproved: true },
      { new: true }
    );
    res.json({ message: "Doctor Approved Successfully!", doctor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
// 🔥 PATIENTS LIST NIKALNE KE LIYE
// 🔥 PATIENTS LIST NIKALNE KE LIYE (NINJA FIX)
const getPatientsList = async (req, res) => {
  try {
    // 🚀 FIX: Ab hum database ko bol rahe hain ki "Jo Admin aur Doctor nahi hain, un sabko le aao!"
    // Isse aapke purane Ankit Singh wale test accounts bhi aa jayenge jisme role set nahi tha.
    const patients = await User.find({ 
      role: { $nin: ["admin", "doctor"] } 
    }).select("-password");
    
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 🔥 KISI BHI DOCTOR YA PATIENT KO DELETE KARNE KE LIYE
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  register,
  login,
  socialLogin,
  sendOtp,
  verifyOtpAndRegisterDoctor,
  getPendingDoctors,
  approveDoctor,
  getPatientsList, // 🔥 ADDED THIS
  deleteUser       // 🔥 ADDED THIS
};