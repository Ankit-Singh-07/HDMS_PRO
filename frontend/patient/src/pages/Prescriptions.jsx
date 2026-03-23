import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Prescriptions.css";

const Prescriptions = () => {

  const [data, setData] = useState([]);

  // 🔹 Fetch prescriptions
  useEffect(() => {
    axios
      .get("https://hdms-backend-7j7w.onrender.com/api/prescriptions")
      .then((res) => setData(res.data))
      .catch(() => console.log("Error"));
  }, []);

  return (
    <div className="prescriptions-page">

      <h2>My Prescriptions</h2>

      {/* 🔥 Stats */}
      <div className="stats">

        <div className="stat-card">
          <h3>Total</h3>
          <p>{data.length}</p>
        </div>

        <div className="stat-card">
          <h3>Active</h3>
          <p>
            {data.filter(p => p.status === "Active").length}
          </p>
        </div>

        <div className="stat-card">
          <h3>Completed</h3>
          <p>
            {data.filter(p => p.status === "Completed").length}
          </p>
        </div>

      </div>

      {/* 🔥 Prescription Cards */}
      <div className="prescription-grid">

        {data.map((p) => (
          <div key={p._id} className="prescription-card">

            <div className="top">
              <h3>{p.doctor}</h3>
              <span className={`status ${p.status.toLowerCase()}`}>
                {p.status}
              </span>
            </div>

            <p className="date">{p.date}</p>

            <h4>Medicines</h4>

            <ul>
              {p.medicines.map((m, i) => (
                <li key={i}>
                  {m.name} — {m.dosage}
                </li>
              ))}
            </ul>

            <div className="actions">

              {/* ⭐ Download */}
              <a
                href={`https://hdms-backend-7j7w.onrender.com/uploads/${p.fileUrl}`}
                target="_blank"
                rel="noreferrer"
              >
                <button className="download">
                  Download
                </button>
              </a>

            </div>

          </div>
        ))}

      </div>

      {/* 🔥 Empty State */}
      {data.length === 0 && (
        <div className="empty">
          <h3>No prescriptions yet</h3>
          <p>Your doctor prescriptions will appear here.</p>
        </div>
      )}

    </div>
  );
};

export default Prescriptions;