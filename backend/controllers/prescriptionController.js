const PDFDocument = require("pdfkit");
const Prescription = require("../models/Prescription");

/* =========================
   DOCTOR → ADD PRESCRIPTION
========================= */
exports.addPrescription = async (req, res) => {
  try {
    // Frontend se 'disease', 'advice' ya 'notes' kuch bhi aaye, handle ho jayega
    const { patientId, disease, medicines, notes, advice } = req.body;

    if (!patientId || !medicines || medicines.length === 0) {
      return res.status(400).json({ message: "MISSING_FIELDS" });
    }

    const prescription = await Prescription.create({
      doctorId: req.user._id || req.user.id, // JWT se doctor ki ID
      patientId,
      disease: disease || "General Checkup",
      medicines,
      notes: notes || advice,
      date: new Date().toLocaleDateString('en-IN')
    });

    res.status(201).json({ success: true, data: prescription });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "ADD_PRESCRIPTION_FAILED" });
  }
};

/* =========================
   PATIENT/DOCTOR → VIEW PRESCRIPTIONS
========================= */
exports.getPatientPrescriptions = async (req, res) => {
  try {
    // URL params se ID aaye (Frontend) ya JWT se aaye, dono chalega
    const patientId = req.params.patientId || req.params.id || req.user._id || req.user.id;

    const prescriptions = await Prescription.find({ patientId })
      .populate("doctorId", "name specialization") // Doctor ki details jod dega
      .sort({ createdAt: -1 });

    res.json(prescriptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "FETCH_FAILED" });
  }
};

/* =========================
   ADMIN → VIEW ALL PRESCRIPTIONS
   (Naya Function Admin Panel ke liye)
========================= */
exports.getAllPrescriptionsAdmin = async (req, res) => {
  try {
    // Admin ko sab dikhega, Patient aur Doctor dono ka naam jod kar
    const prescriptions = await Prescription.find()
      .populate('patientId', 'name phone email')
      .populate('doctorId', 'name specialization')
      .sort({ createdAt: -1 });
      
    res.status(200).json(prescriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "SERVER_ERROR" });
  }
};

/* =========================
   DOWNLOAD PDF (Aapka Original Masterpiece)
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
      // Handle both Object and String formats of medicines array safely
      let medText = typeof m === 'object' ? `${m.name} - ${m.dose} - ${m.days} days` : m;
      doc.fontSize(12).text(`${i + 1}. ${medText}`);
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