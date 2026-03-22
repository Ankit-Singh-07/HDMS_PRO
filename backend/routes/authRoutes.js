const express = require("express");
const router = express.Router();
const User = require("../models/User"); 

const {
  register,
  login,
  socialLogin,
  sendOtp,
  verifyOtpAndRegisterDoctor,
  getPendingDoctors, 
  approveDoctor,
  getPatientsList, // 🔥 ADDED: Patient list fetch karne ke liye
  deleteUser       // 🔥 ADDED: Delete function ke liye
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/social-login", socialLogin);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpAndRegisterDoctor);

// 🔥 PATIENT & ADMIN KE LIYE: Asli Doctors ki list (SIRF APPROVED WALE)
router.get("/doctors-list", async (req, res) => {
  try {
    // 🚀 FIX: .select("-password") lagaya hai taaki Email aur Phone bhi Admin panel mein dikhe
    const doctors = await User.find({ role: "doctor", isApproved: true }).select("-password");
    res.status(200).json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// 🔥 ADMIN KE LIYE: Approval Routes
router.get("/admin/pending-doctors", getPendingDoctors);
router.put("/admin/approve-doctor/:id", approveDoctor);

// 🔥 NAYE ROUTES: Patients aur Delete ke liye (Jo abhi humne banaye the)
router.get("/patients-list", getPatientsList);
router.delete("/delete-user/:id", deleteUser);


module.exports = router;