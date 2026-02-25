const Otp = require("../models/otp");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");

exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "EMAIL_REQUIRED" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);

  await Otp.deleteMany({ email });

  await Otp.create({
    email,
    otp: hashedOtp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  await sendEmail(email, otp);

  res.json({ message: "OTP_SENT" });
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const record = await Otp.findOne({ email });
  if (!record) return res.status(400).json({ message: "OTP_NOT_FOUND" });

  if (record.expiresAt < new Date())
    return res.status(400).json({ message: "OTP_EXPIRED" });

  const isValid = await bcrypt.compare(otp, record.otp);
  if (!isValid)
    return res.status(400).json({ message: "INVALID_OTP" });

  await Otp.deleteMany({ email });

  res.json({ message: "OTP_VERIFIED" });
};
