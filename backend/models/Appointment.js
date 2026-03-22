const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    // 🔥 YAHAN JADOO HAI: Mongoose ko bata rahe hain ki ye ID 'User' model se aayegi
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    // 🚀 YEH RAHI NAYI LINE (Ab Mongoose is custom naam ko save hone dega!)
    customPatientName: { type: String },
    
    problem: { type: String },
    reason: { type: String },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, default: "PENDING" }, // PENDING, CONFIRMED, CANCELLED
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);