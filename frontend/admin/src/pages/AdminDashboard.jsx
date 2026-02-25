import React, { useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🔒 Token hi nahi hai → login
    if (!token) {
      window.location.href = "/";
      return;
    }

    // 🔍 Sirf token verify karne ke liye (NO alert, NO force logout)
    axios
      .get("http://localhost:5000/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        console.log("Admin verified ✅");
      })
      .catch((error) => {
        // ❗ Sirf REAL unauthorized pe hi redirect
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/";
        }
      });
  }, []);

  const adminName = "Admin"; // baad me backend se dynamic

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>HDMS</h2>

        <button style={styles.navActive}>Dashboard</button>
        <button style={styles.nav}>Doctors</button>
        <button style={styles.nav}>Patients</button>
        <button style={styles.nav}>Appointments</button>
        <button style={styles.nav}>Reports</button>
        <button style={styles.nav}>Settings</button>

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

      {/* Main Content */}
      <main style={styles.main}>
        <header style={styles.header}>
          <h1>Admin Dashboard</h1>
          <span>Welcome, {adminName}</span>
        </header>

        {/* Stats Cards */}
        <section style={styles.cards}>
          <div style={styles.card}>
            <h3>Total Doctors</h3>
            <p style={styles.cardValue}>18</p>
          </div>
          <div style={styles.card}>
            <h3>Total Patients</h3>
            <p style={styles.cardValue}>520</p>
          </div>
          <div style={styles.card}>
            <h3>Total Appointments</h3>
            <p style={styles.cardValue}>1,240</p>
          </div>
          <div style={styles.card}>
            <h3>Pending Approvals</h3>
            <p style={styles.cardValue}>4</p>
          </div>
        </section>

        {/* Recent Activities Table */}
        <section style={styles.tableSection}>
          <h3>Recent Activities</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Activity</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dr. Sharma</td>
                <td>Doctor</td>
                <td>Added new appointment</td>
                <td>10 Feb</td>
              </tr>
              <tr>
                <td>Ankit Singh</td>
                <td>Patient</td>
                <td>Booked appointment</td>
                <td>10 Feb</td>
              </tr>
              <tr>
                <td>Admin</td>
                <td>Admin</td>
                <td>Approved doctor profile</td>
                <td>9 Feb</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;

/* ================= STYLES ================= */
const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "#f4f6f8",
    fontFamily: "Segoe UI, sans-serif",
  },
  sidebar: {
    width: "240px",
    background: "#2c3e50",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  logo: {
    marginBottom: "30px",
    textAlign: "center",
  },
  nav: {
    background: "transparent",
    border: "none",
    color: "#fff",
    textAlign: "left",
    padding: "10px",
    cursor: "pointer",
    marginBottom: "5px",
  },
  navActive: {
    background: "#34495e",
    border: "none",
    color: "#fff",
    textAlign: "left",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "4px",
    marginBottom: "5px",
  },
  logout: {
    marginTop: "auto",
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "4px",
  },
  main: {
    flex: 1,
    padding: "25px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },
  cards: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },
  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "6px",
    flex: "1 1 200px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  cardValue: {
    fontSize: "28px",
    fontWeight: "bold",
    marginTop: "10px",
  },
  tableSection: {
    background: "#fff",
    padding: "20px",
    borderRadius: "6px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
};
