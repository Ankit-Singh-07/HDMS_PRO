import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PatientLogin from "./pages/PatientLogin";
import PatientRegister from "./pages/PatientRegister";
import PatientDashboard from "./pages/PatientDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Patient */}
        <Route path="/" element={<PatientLogin />} />
        <Route path="/patient/register" element={<PatientRegister />} />
        <Route path="/dashboard" element={<PatientDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
