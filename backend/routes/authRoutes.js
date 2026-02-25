const express = require("express");
const router = express.Router();
const {
  register,
  login,
  socialLogin,
  sendOtp,
  verifyOtpAndRegisterDoctor,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/social-login", socialLogin);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpAndRegisterDoctor);

module.exports = router;
