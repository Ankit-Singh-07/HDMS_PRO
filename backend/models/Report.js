const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  title: String,
  type: String,
  fileUrl: String,
  date: {
    type: String,
    default: new Date().toLocaleDateString()
  }
});

module.exports = mongoose.model("Report", reportSchema);