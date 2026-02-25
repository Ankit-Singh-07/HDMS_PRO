const Appointment = require("../models/Appointment");

/* ============================
   PATIENT → BOOK APPOINTMENT
============================ */
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, problem, date, time } = req.body;

    const appointment = await Appointment.create({
      patientId: req.user.id,   // JWT se
      doctorId,
      problem,
      date,
      time,
    });

    res.json({ message: "APPOINTMENT_BOOKED", appointment });
  } catch (err) {
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};

/* ============================
   DOCTOR → VIEW APPOINTMENTS
============================ */
exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.user.id,
    })
      .populate("patientId")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};

/* ============================
   DOCTOR → ACCEPT / REJECT
============================ */
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    await Appointment.findByIdAndUpdate(req.params.id, { status });

    res.json({ message: "STATUS_UPDATED" });
  } catch (err) {
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};
