import React, { useEffect, useState } from "react";
import axios from "axios";

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/prescriptions/patient", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPrescriptions(res.data));
  }, []);

  return (
    <div>
      <h2>My Prescriptions</h2>

      {prescriptions.map((p) => (
        <div key={p._id}>
          <p><b>Doctor:</b> {p.doctorId?.name}</p>
          <p><b>Medicines:</b> {p.medicines}</p>
          <p><b>Notes:</b> {p.notes}</p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default PatientPrescriptions;
