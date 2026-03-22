import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MedicalRecords from './pages/MedicalRecords';
import Login from "./pages/PatientLogin";
import PatientRegister from "./pages/PatientRegister"; 
import PatientDashboard from "./pages/PatientDashboard";
import PatientBookAppointment from './pages/PatientBookAppointment';
// import Reports from "./pages/Reports"; // 👈 Purane wale ko comment kar diya taaki conflict na ho
import Prescriptions from "./pages/Prescriptions";
import Billing from "./pages/Billing";
import Profile from "./pages/Profile";

// 🔐 SECURITY GUARD: Bina token walo ko Login par bhej dega
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ⭐ PUBLIC ROUTES (Bina login ke khulenge) */}
        <Route path="/" element={<Login />} />
        <Route path="/patient/register" element={<PatientRegister />} />

        {/* ⭐ PROTECTED ROUTES (Sirf login ke baad khulenge) */}
        <Route path="/dashboard" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
        
        <Route path="/patient/book-appointment" element={<ProtectedRoute><PatientBookAppointment /></ProtectedRoute>} />
        
        {/* 🚀 FIX: Medical Records ko yahan add kiya aur Protect kiya */}
        <Route path="/reports" element={<ProtectedRoute><MedicalRecords /></ProtectedRoute>} />
        
        <Route path="/prescriptions" element={<ProtectedRoute><Prescriptions /></ProtectedRoute>} />
        
        <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
        
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;