const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const multer = require("multer");

// 📦 Storage config
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// GET all reports
router.get("/", async (req, res) => {
  const data = await Report.find();
  res.json(data);
});

// UPLOAD report with file
router.post("/add", upload.single("file"), async (req, res) => {
  const report = new Report({
    title: req.body.title,
    type: req.body.type,
    fileUrl: req.file.filename
  });

  await report.save();
  res.json(report);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Report.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// 🔥 NAYA ROUTE ADD KIYA HAI (Frontend Medical Records Frontend ke liye)
router.get('/patient/:id', async (req, res) => {
  try {
    // Deployment Demo Data (Taaki frontend khali na lage)
    const demoReports = [
      { _id: 'r1', testName: 'Complete Blood Count (CBC)', labName: 'Dr. Lal PathLabs', date: '10 Mar 2026', status: 'AVAILABLE' },
      { _id: 'r2', testName: 'Lipid Profile Test', labName: 'City Diagnostic Center', date: '15 Jan 2026', status: 'AVAILABLE' }
    ];
    res.status(200).json(demoReports);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;