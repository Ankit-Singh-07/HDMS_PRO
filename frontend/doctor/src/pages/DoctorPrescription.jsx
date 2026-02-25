import React, { useState } from "react";
import axios from "axios";

const DoctorPrescription = ({ appointmentId }) => {
  const [medicines, setMedicines] = useState("");
  const [notes, setNotes] = useState("");

  const submitPrescription = () => {
    const token = localStorage.getItem("token");

    axios.post(
      "http://localhost:5000/api/prescriptions/doctor/add",
      { appointmentId, medicines, notes },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ).then(() => {
      alert("Prescription saved ✅");
    });
  };

  return (
    <div>
      <h3>Write Prescription</h3>

      <textarea
        placeholder="Medicines (e.g. Paracetamol 500mg)"
        value={medicines}
        onChange={(e) => setMedicines(e.target.value)}
      />

      <textarea
        placeholder="Doctor notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button onClick={submitPrescription}>
        Save Prescription
      </button>
    </div>
  );
};

export default DoctorPrescription;
