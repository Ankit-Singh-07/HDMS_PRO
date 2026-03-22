const Appointment = require("../models/Appointment");

/* ============================
   PATIENT → BOOK APPOINTMENT
============================ */
exports.bookAppointment = async (req, res) => {
  try {
    // 🔥 NAYI UPDATE: Frontend se 'customPatientName' ko bhi receive kar rahe hain
    const { doctorId, problem, reason, date, time, patientId, customPatientName } = req.body;

    const appointment = await Appointment.create({
      patientId: patientId || req.user.id || req.user._id, // Body ya JWT kahin se bhi le lega
      doctorId,
      problem: problem || reason,
      reason: reason || problem,
      date,
      time,
      customPatientName, // 🔥 NAYI UPDATE: Ab custom naam Database mein save hoga!
      status: 'PENDING'
    });

    res.json({ message: "APPOINTMENT_BOOKED", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};

/* ============================
   DOCTOR → VIEW APPOINTMENTS
============================ */
exports.getDoctorAppointments = async (req, res) => {
  try {
    // JWT se doctor ID nikalna
    const doctorId = req.user.id || req.user._id;

    const appointments = await Appointment.find({ doctorId })
      .populate("patientId", "name phone email bloodGroup dob") // Doctor ko patient ki saari history milegi
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};

/* ============================
   ADMIN → VIEW ALL APPOINTMENTS
   (Naya Function Admin Panel ke liye)
============================ */
exports.getAllAppointmentsAdmin = async (req, res) => {
  try {
    // Admin ko saari appointments dikhengi
    const appointments = await Appointment.find()
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name specialization')
      .sort({ createdAt: -1 });
      
    res.status(200).json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};

/* ============================
   DOCTOR/ADMIN → ACCEPT / REJECT
============================ */
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id, 
      { status },
      { new: true }
    );

    res.json({ message: "STATUS_UPDATED", appointment: updatedAppointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};