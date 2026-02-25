import React from "react";
import "./PatientDashboard.css";

export default function PatientDashboard() {
  const stats = [
    { title: "Total Appointments", value: 12 },
    { title: "Upcoming Visits", value: 2 },
    { title: "Prescriptions", value: 5 },
    { title: "Bills", value: 3 },
  ];

  const upcoming = {
    doctor: "Dr. Sharma (Cardiologist)",
    date: "25 Feb 2026",
    time: "10:30 AM",
    status: "Confirmed",
  };

  const history = [
    {
      doctor: "Dr. Mehta",
      problem: "Fever",
      date: "10 Jan 2026",
      status: "Completed",
    },
    {
      doctor: "Dr. Gupta",
      problem: "Headache",
      date: "02 Dec 2025",
      status: "Completed",
    },
  ];

  return (
    <div className="dashboard">
      {/* Profile Card */}
      <div className="card profile">
        <img
          src="https://i.pravatar.cc/120"
          alt="profile"
          className="profile-img"
        />
        <div>
          <h2>Ankit Singh</h2>
          <p>Age: 21 • Male • Blood: B+</p>
          <p>📞 9876543210</p>
        </div>
        <button className="btn">Edit Profile</button>
      </div>

      {/* Stats */}
      <div className="stats">
        {stats.map((s, i) => (
          <div key={i} className="card stat">
            <h4>{s.title}</h4>
            <p>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Appointment */}
      <div className="card">
        <h3>Upcoming Appointment</h3>
        <p><b>{upcoming.doctor}</b></p>
        <p>📅 {upcoming.date}</p>
        <p>⏰ {upcoming.time}</p>
        <span className="status">{upcoming.status}</span>
        <div className="actions">
          <button className="btn">Join Video Call</button>
          <button className="btn outline">Cancel</button>
        </div>
      </div>

      {/* Appointment History */}
      <div className="card">
        <h3>Appointment History</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Problem</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i}>
                  <td>{h.doctor}</td>
                  <td>{h.problem}</td>
                  <td>{h.date}</td>
                  <td>{h.status}</td>
                  <td>
                    <button className="btn small">Rebook</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prescription + Billing */}
      <div className="grid">
        <div className="card">
          <h3>Prescriptions</h3>
          <p>Latest prescription available</p>
          <button className="btn">Download PDF</button>
        </div>

        <div className="card">
          <h3>Billing</h3>
          <p>Pending bill: ₹1,200</p>
          <button className="btn">Pay Now</button>
        </div>
      </div>
    </div>
  );
}