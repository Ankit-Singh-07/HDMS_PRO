const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "patient" },
    
    // 🔥 ADMIN APPROVAL FIELD (Naya Feature)
    isApproved: { 
      type: Boolean, 
      default: function() {
        return this.role === 'patient'; // Patient ko approval ki zaroorat nahi hai
      }
    },
    
    // DOCTOR SPECIFIC FIELDS (Register karte time save honge)
    specialization: { type: String, default: "" },
    license: { type: String, default: "" },
    experience: { type: String, default: "" },
    fee: { type: String, default: "500" },

    // 🔥 PATIENT DETAILS (Taaki data gayab na ho)
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    emergencyContact: { type: String, default: "" },
    dob: { type: String, default: "" },
    bloodGroup: { type: String, default: "B+" },
    weight: { type: String, default: "" },
    height: { type: String, default: "" },
    bp: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);