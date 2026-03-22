import React from "react";
import ManageDoctors from "./pages/ManageDoctors";
import ManagePatients from "./pages/ManagePatients";
import Appointments from "./pages/Appointments";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDoctorApprovals from './pages/AdminDoctorApprovals';


function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Login */}
        <Route path="/" element={<AdminLogin />} />

        {/* Admin Dashboard */}
        <Route path="/dashboard" element={<AdminDashboard />} />
      {/* ⭐ ADMIN ROUTES */}
<Route path="/admin/dashboard" element={<AdminDashboard />} />
<Route path="/admin/doctors" element={<ManageDoctors />} />  {/* 👈 Ye nayi line add karni hai */}
<Route path="/admin/patients" element={<ManagePatients />} />
        <Route path="/admin/appointments" element={<Appointments />} />
        <Route path="/admin/doctor-approvals" element={<AdminDoctorApprovals />} />
      </Routes>
    </Router>
  );
}

export default App;
