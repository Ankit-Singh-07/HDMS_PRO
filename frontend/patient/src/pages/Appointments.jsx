import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Appointments.css";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // 🔹 Fetch data
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/appointments")
      .then((res) => setAppointments(res.data))
      .catch(() => alert("Failed to load appointments"));
  }, []);

  // 🔹 Cancel appointment
  const handleCancel = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/appointments/${id}`
    );

    setAppointments((prev) =>
      prev.filter((a) => a._id !== id)
    );
  };

  // 🔹 Filter + Search
  const filtered = appointments.filter((a) => {
    const matchSearch =
      a.doctor.toLowerCase().includes(search.toLowerCase());

    const matchFilter =
      filter === "All" || a.status === filter;

    return matchSearch && matchFilter;
  });

  // 🔹 Stats Calculation
  const upcoming = appointments.filter(
    (a) => a.status === "Upcoming"
  ).length;

  const completed = appointments.filter(
    (a) => a.status === "Completed"
  ).length;

  const cancelled = appointments.filter(
    (a) => a.status === "Cancelled"
  ).length;

  return (
    <div className="appointments-page">

      {/* 🔹 Top Bar */}
      <div className="top-bar">
        <h2>My Appointments</h2>

        <button className="book-btn">
          + Book Appointment
        </button>
      </div>

      {/* 🔥 Stats Section */}
      <div className="stats">
        <div className="stat-card">
          <h3>Upcoming</h3>
          <p>{upcoming}</p>
        </div>

        <div className="stat-card">
          <h3>Completed</h3>
          <p>{completed}</p>
        </div>

        <div className="stat-card">
          <h3>Cancelled</h3>
          <p>{cancelled}</p>
        </div>
      </div>

      {/* 🔹 Search + Filter */}
      <div className="controls">

        <input
          placeholder="Search doctor..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >
          <option>All</option>
          <option>Upcoming</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>

      </div>

      {/* 🔹 Cards */}
      <div className="appointments-grid">

        {filtered.map((appt) => (
          <div
            key={appt._id}
            className="appointment-card"
          >

            {/* 👨‍⚕️ Doctor Avatar */}
            <div className="avatar">👨‍⚕️</div>

            <h3>{appt.doctor}</h3>
            <p>{appt.department}</p>

            <p><b>Date:</b> {appt.date}</p>
            <p><b>Time:</b> {appt.time}</p>

            <span
              className={`status ${appt.status.toLowerCase()}`}
            >
              {appt.status}
            </span>

            <div className="actions">

              <button className="view">
                View
              </button>

              {/* 🔹 Reschedule */}
              {appt.status === "Upcoming" && (
                <button className="reschedule">
                  Reschedule
                </button>
              )}

              {/* 🔹 Cancel */}
              {appt.status === "Upcoming" && (
                <button
                  className="cancel"
                  onClick={() =>
                    handleCancel(appt._id)
                  }
                >
                  Cancel
                </button>
              )}

            </div>
          </div>
        ))}

      </div>

      {/* 🔥 Empty State */}
      {filtered.length === 0 && (
        <div className="empty">
          <h3>No appointments found</h3>
          <p>
            Book your first appointment to get started.
          </p>
        </div>
      )}

    </div>
  );
};

export default Appointments;