const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

//  MIDDLEWARES (ORDER MAT BADALNA)
const appointmentRoutes = require("./routes/appointmentRoutes");

app.use("/api/appointments", appointmentRoutes);

const prescriptionRoutes = require("./routes/prescriptionRoutes");
app.use("/api/prescriptions", prescriptionRoutes);

app.use(cors());
app.use(express.json());
app.use("/api/prescriptions", require("./routes/prescriptionRoutes"));


//  AUTH ROUTES (🔥 MISSING THA – MOST IMPORTANT)
app.use("/api/auth", require("./routes/authRoutes"));

//  DOCTOR ROUTES
app.use("/api/doctor", require("./routes/doctorRoutes"));

//otp ke liye

app.use("/api/otp", require("./routes/otpRoutes"));


//  TEST ROUTE
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected successfully ✅" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
