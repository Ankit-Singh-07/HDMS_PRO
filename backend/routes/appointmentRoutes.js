const express = require("express");
const router = express.Router();

// 🔐 Security Middleware
const auth = require("../middleware/auth"); 

const {
  bookAppointment,
  getDoctorAppointments,
  getAllAppointmentsAdmin,
  updateAppointmentStatus
} = require("../controllers/appointmentController");

// ==========================================
// 🚀 THE PRO ROUTES 
// ==========================================

// 1. PATIENT → Nayi Appointment Book Karega
router.post("/book", auth, bookAppointment);

// 2. DOCTOR → Apni Appointments Dekhega
router.get("/doctor", auth, getDoctorAppointments);

// 3. DOCTOR → Status Update Karega
router.put("/:id/status", auth, updateAppointmentStatus);

// ==========================================
// 🔥 FIX: ADMIN ROUTES 🔥
// (Yahan se 'auth' hata diya kyunki Admin Hardcoded hai)
// ==========================================

// 4. ADMIN → Hospital ki saari appointments dekhega
router.get("/admin", getAllAppointmentsAdmin);

// 5. ADMIN → Status Update Karega (Confirm/Cancel)
router.put("/admin/:id", updateAppointmentStatus);

module.exports = router;