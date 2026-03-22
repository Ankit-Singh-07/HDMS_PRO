const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema(
  {
    // 🔥 SAME PUL YAHAN BHI BANA DIYA
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    
    disease: { type: String, default: "General Checkup" },
    medicines: { type: Array, required: true },
    notes: { type: String },
    advice: { type: String },
    date: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);