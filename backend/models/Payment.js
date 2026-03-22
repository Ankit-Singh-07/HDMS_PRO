const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  patientId: String,
  amount: Number,
  status: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Payment", paymentSchema);