const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");

// 🟢 CREATE APPOINTMENT (Patient booking)
router.post("/book", async (req, res) => {
  try {
    const appointment = new Appointment({
      ...req.body,
      status: "Pending",
      meetingLink: ""
    });

    await appointment.save();
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🟢 PATIENT VIEW APPOINTMENTS
router.get("/patient/:id", async (req, res) => {
  const data = await Appointment.find({ patientId: req.params.id });
  res.json(data);
});


// 🟢 DOCTOR VIEW APPOINTMENTS
router.get("/doctor/:id", async (req, res) => {
  const data = await Appointment.find({ doctorId: req.params.id });
  res.json(data);
});


// 🟢 DOCTOR ACCEPT APPOINTMENT + CREATE VIDEO LINK
router.put("/accept/:id", async (req, res) => {
  const meetingLink = `https://meet.jit.si/HDMS-${req.params.id}`;

  const updated = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: "Confirmed", meetingLink },
    { new: true }
  );

  res.json(updated);
});


// 🔴 DOCTOR REJECT
router.put("/reject/:id", async (req, res) => {
  const updated = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: "Rejected" },
    { new: true }
  );

  res.json(updated);
});


// 🟢 COMPLETE APPOINTMENT
router.put("/complete/:id", async (req, res) => {
  const updated = await Appointment.findByIdAndUpdate(
    req.params.id,
    { status: "Completed" },
    { new: true }
  );

  res.json(updated);
});

module.exports = router;