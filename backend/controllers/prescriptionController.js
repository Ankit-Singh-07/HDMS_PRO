const PDFDocument = require("pdfkit");
const Prescription = require("../models/Prescription");

/* =========================
   DOCTOR → ADD PRESCRIPTION
========================= */
exports.addPrescription = async (req, res) => {
  try {
    const { patientId, medicines, notes } = req.body;

    if (!patientId || !medicines || medicines.length === 0) {
      return res.status(400).json({ message: "MISSING_FIELDS" });
    }

    const prescription = await Prescription.create({
      doctorId: req.user._id,
      patientId,
      medicines,
      notes,
    });

    res.status(201).json(prescription);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "ADD_PRESCRIPTION_FAILED" });
  }
};

/* =========================
   PATIENT → VIEW PRESCRIPTIONS
========================= */
exports.getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      patientId: req.user._id,
    })
      .populate("doctorId", "name")
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "FETCH_FAILED" });
  }
};

/* =========================
   DOWNLOAD PDF
========================= */
exports.downloadPrescriptionPDF = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("doctorId", "name")
      .populate("patientId", "name");

    if (!prescription)
      return res.status(404).json({ message: "Prescription not found" });

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Prescription-${prescription._id}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(22).text("HDMS Hospital", { align: "center" });
    doc.moveDown(0.5);
    doc.fontSize(12).text("Digital Prescription", { align: "center" });

    doc.moveDown(2);

    doc.fontSize(12).text(`Patient: ${prescription.patientId.name}`);
    doc.text(`Doctor: ${prescription.doctorId.name}`);
    doc.text(`Date: ${new Date(prescription.createdAt).toDateString()}`);

    doc.moveDown();

    doc.fontSize(14).text("Medicines", { underline: true });
    doc.moveDown(0.5);

    prescription.medicines.forEach((m, i) => {
      doc.fontSize(12).text(
        `${i + 1}. ${m.name} - ${m.dose} - ${m.days} days`
      );
    });

    doc.moveDown();

    doc.fontSize(14).text("Doctor Notes", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(prescription.notes || "N/A");

    doc.moveDown(3);
    doc.fontSize(10).text(
      "This is a system generated prescription.",
      { align: "center" }
    );

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "PDF_GENERATION_FAILED" });
  }
};
