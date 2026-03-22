const express = require("express");
const router = express.Router();

// Middlewares
const auth = require("../middleware/auth"); 

// Controllers
const {
  addPrescription,
  getPatientPrescriptions,
  getAllPrescriptionsAdmin,
  downloadPrescriptionPDF
} = require("../controllers/prescriptionController");

// ==========================================
// 🚀 REAL DATABASE ROUTES
// ==========================================

// 1. DOCTOR -> Nayi Dawai Likhna
router.post("/doctor/add", auth, addPrescription);

// 2. PATIENT -> Apni Dawai Dekhna (Yahan se nakli data hamesha ke liye hata diya)
router.get("/patient/:id", getPatientPrescriptions); 

// 3. ADMIN -> Sabki Dawai Dekhna
router.get("/admin", auth, getAllPrescriptionsAdmin);

// 4. DOWNLOAD PDF
router.get("/download/:id", downloadPrescriptionPDF);

module.exports = router;