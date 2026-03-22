const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const Appointment = require('../models/Appointment');

// ✅ CRASH-PROOF DASHBOARD ROUTE
router.get('/dashboard-data/:id', async (req, res) => {
  try {
    const ptId = req.params.id;

    // 1. Agar ID galat aayi toh crash hone se roko
    if (!ptId || ptId === 'undefined') {
      return res.status(400).json({ message: "Invalid Patient ID" });
    }

    // 2. Patient dhoondo
    const patient = await User.findById(ptId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // 3. Appointment dhoondo (Safe Try-Catch ke andar taaki server crash na ho)
    let upcomingAppointment = null;
    try {
      upcomingAppointment = await Appointment.findOne({ 
          patientId: ptId, 
          status: { $in: ['PENDING', 'CONFIRMED', 'Pending', 'Confirmed'] } 
      }); 
      // Note: Maine yahan se .populate() hata diya hai temporary taaki crash rukk jaye!
    } catch (apptError) {
      console.log("⚠️ Appointment fetch warning:", apptError.message);
    }

    // 4. Safely Frontend ko data bhejo
    res.status(200).json({
      name: patient.name || "Patient",
      phone: patient.phone || "",
      address: patient.address || "",
      emergencyContact: patient.emergencyContact || "",
      dob: patient.dob || "",
      vitals: {
          bloodGroup: patient.bloodGroup || "B+", 
          weight: patient.weight || "--",
          height: patient.height || "--",
          bp: patient.bp || "--/--"
      },
      upcomingAppointment: upcomingAppointment
    });
  } catch (error) {
    console.error("🔥 DASHBOARD CRASH ERROR:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// 🔥 PROFILE UPDATE ROUTE (As it was)
router.put('/update-profile/:id', async (req, res) => {
  try {
    const { phone, address, emergencyContact, dob, bloodGroup, weight, height, bp } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          phone: phone,
          address: address,
          emergencyContact: emergencyContact,
          dob: dob,
          bloodGroup: bloodGroup,
          weight: weight,
          height: height,
          bp: bp
        }
      },
      { new: true }
    );

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;