import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DoctorDashboard from './pages/DoctorDashboard';
import Appointments from './pages/Appointments';
import MyPatients from './pages/MyPatients';
import Reports from './pages/Reports';
import DoctorProfile from './pages/DoctorProfile';
import DoctorLogin from './pages/DoctorLogin';
import DoctorRegister from './pages/DoctorRegister'; // Import add kiya


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<DoctorLogin />} />
        {/* Register route yahan add kiya */}
        <Route path="/register" element={<DoctorRegister />} /> 

        <Route path="/" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute><MyPatients /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><DoctorProfile /></ProtectedRoute>} />
       

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;