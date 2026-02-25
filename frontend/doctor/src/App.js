import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DoctorLogin from "./pages/DoctorLogin";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorRegister from "./pages/DoctorRegister"; // ✅ ADD ONLY

function App() {
  return (
    <Router>
      <Routes>
        {/* Doctor Login */}
        <Route path="/" element={<DoctorLogin />} />

        {/* Doctor Register (OTP Page) ✅ ADD */}
        <Route
          path="/doctor/register"
          element={<DoctorRegister />}
        />

        {/* Doctor Dashboard ✅ VERY IMPORTANT */}
        <Route
          path="/doctor/dashboard"
          element={<DoctorDashboard />}
        />
      </Routes>
    </Router>
  );
}

export default App;
