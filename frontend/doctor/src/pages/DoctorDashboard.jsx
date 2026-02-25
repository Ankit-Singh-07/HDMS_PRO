import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [medicines, setMedicines] = useState([{ name: "", dose: "", days: "" }]);
  const [notes, setNotes] = useState("");

  /* =====================
     FETCH APPOINTMENTS
  ===================== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
      return;
    }

    axios
      .get("http://localhost:5000/api/appointments/doctor", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAppointments(res.data || []));
  }, []);

  /* =====================
     ADD MEDICINE ROW
  ===================== */
  const addMedicine = () => {
    setMedicines([...medicines, { name: "", dose: "", days: "" }]);
  };

  /* =====================
     HANDLE MEDICINE CHANGE
  ===================== */
  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  /* =====================
     SUBMIT PRESCRIPTION
  ===================== */
  const submitPrescription = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/prescriptions",
        {
          patientId: selectedPatient.patientId._id,
          medicines,
          notes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Prescription added successfully ✅");
      setSelectedPatient(null);
      setMedicines([{ name: "", dose: "", days: "" }]);
      setNotes("");
    } catch {
      alert("Failed to add prescription ❌");
    }
  };

  return (
    <div style={styles.container}>
      {/* ===== SIDEBAR ===== */}
      <aside style={styles.sidebar}>
        <h2>HDMS</h2>
        <button style={styles.navActive}>Dashboard</button>
        <button
          style={styles.logout}
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
      </aside>

      {/* ===== MAIN ===== */}
      <main style={styles.main}>
        <h1>Doctor Dashboard</h1>

        {/* ===== APPOINTMENTS LIST ===== */}
        <section style={styles.card}>
          <h3>Today’s Appointments</h3>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Problem</th>
                <th>Time</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id}>
                  <td>{a.patientId?.name}</td>
                  <td>{a.problem}</td>
                  <td>{a.time}</td>
                  <td>
                    <button
                      style={styles.btn}
                      onClick={() => setSelectedPatient(a)}
                    >
                      Add Prescription
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ===== PRESCRIPTION FORM ===== */}
        {selectedPatient && (
          <section style={styles.card}>
            <h3>
              Prescription for {selectedPatient.patientId?.name}
            </h3>

            {medicines.map((m, i) => (
              <div key={i} style={styles.medicineRow}>
                <input
                  placeholder="Medicine name"
                  value={m.name}
                  onChange={(e) =>
                    handleMedicineChange(i, "name", e.target.value)
                  }
                />
                <input
                  placeholder="Dose"
                  value={m.dose}
                  onChange={(e) =>
                    handleMedicineChange(i, "dose", e.target.value)
                  }
                />
                <input
                  placeholder="Days"
                  value={m.days}
                  onChange={(e) =>
                    handleMedicineChange(i, "days", e.target.value)
                  }
                />
              </div>
            ))}

            <button style={styles.addBtn} onClick={addMedicine}>
              + Add Medicine
            </button>

            <textarea
              placeholder="Doctor notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={styles.textarea}
            />

            <button style={styles.submitBtn} onClick={submitPrescription}>
              Save Prescription
            </button>
          </section>
        )}
      </main>
    </div>
  );
};

export default DoctorDashboard;

/* ================= STYLES ================= */

const styles = {
  container: { display: "flex", minHeight: "100vh", background: "#f4f6f8" },
  sidebar: {
    width: "220px",
    background: "#0f4c75",
    color: "#fff",
    padding: "20px",
  },
  navActive: {
    background: "#3282b8",
    border: "none",
    color: "#fff",
    padding: "10px",
    width: "100%",
  },
  logout: {
    marginTop: "20px",
    background: "#e74c3c",
    border: "none",
    color: "#fff",
    padding: "10px",
    width: "100%",
  },
  main: { flex: 1, padding: "25px" },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  btn: {
    background: "#2ecc71",
    border: "none",
    color: "#fff",
    padding: "6px 10px",
    cursor: "pointer",
  },
  medicineRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },
  addBtn: {
    background: "#3498db",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    marginBottom: "10px",
  },
  textarea: {
    width: "100%",
    height: "80px",
    marginBottom: "10px",
  },
  submitBtn: {
    background: "#27ae60",
    color: "#fff",
    border: "none",
    padding: "10px",
  },
};
