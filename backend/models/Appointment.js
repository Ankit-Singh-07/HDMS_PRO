const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientId: String,
  doctorId: String,
  date: String,
  time: String,
  problem: String,

  status: {
    type: String,
    default: "Pending"
  },

  meetingLink: String
});

module.exports = mongoose.model("Appointment", appointmentSchema);