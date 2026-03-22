const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// 🔥 ADD THIS — Global Middlewares FIRST
app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(express.json());

// ==========================================
// 🚦 ALL ROUTES
// ==========================================

const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api/upload", uploadRoutes);

const reportRoutes = require("./routes/reportRoutes");
app.use("/api/reports", reportRoutes);

const appointmentRoutes = require("./routes/appointmentRoutes");
app.use("/api/appointments", appointmentRoutes);

const prescriptionRoutes = require("./routes/prescriptionRoutes");
app.use("/api/prescriptions", prescriptionRoutes);

// 🔐 AUTH ROUTES (🔥 MOST IMPORTANT)
app.use("/api/auth", require("./routes/authRoutes"));

// 👨‍⚕️ DOCTOR ROUTES
app.use("/api/doctor", require("./routes/doctorRoutes"));

// ✉️ OTP ROUTES
app.use("/api/otp", require("./routes/otpRoutes"));

// 👑 ADMIN ROUTES
app.use("/api/admin", require("./routes/adminRoutes"));

// 🏥 PATIENT ROUTES (🔥 NAYA ADD KIYA HAI YAHAN)
app.use("/api/patient", require("./routes/patientRoutes"));

// 🛠️ TEST ROUTE
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected successfully ✅" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});