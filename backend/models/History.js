const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  patientId: String,
  records: [
    {
      date: Date,
      doctor: String,
      diagnosis: String,
      prescription: String
    }
  ]
});

module.exports = mongoose.model("History", historySchema);