const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  addPrescription,
  getPatientPrescriptions,
} = require("../controllers/prescriptionController");

// ✅ Doctor writes prescription
router.post(
  "/doctor/add",
  auth,
  roleMiddleware("doctor"),
  addPrescription
);

// ✅ Patient views prescriptions
router.get(
  "/patient",
  auth,
  roleMiddleware("patient"),
  getPatientPrescriptions
);

module.exports = router;
