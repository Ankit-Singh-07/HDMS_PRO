import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PatientSidebar from '../components/PatientSidebar';
import AIAssistant from '../components/AIAssistant';

const PatientDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        
        // 🛑 FIX 1: navigate('/') kiya taaki error na aaye
        if (!userStr) {
           console.log("No auth token, redirecting to login...");
           navigate('/'); 
           return; 
        }
        
        const user = JSON.parse(userStr);
        const ptId = user._id || user.id; 

        if (!ptId) {
            localStorage.clear();
            navigate('/'); // 🛑 FIX 2
            return;
        }

        const res = await axios.get(`http://localhost:5000/api/patient/dashboard-data/${ptId}`);
        setDashboardData(res.data);
        setLoading(false);

      } catch (err) {
        console.error("Dashboard Error:", err);
        setLoading(false); 
      }
    };

    fetchPatientData();
  }, [navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-teal-600 font-bold text-xl">Loading your health overview... ⏳</div>;
  
  if (!dashboardData) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-red-500 font-bold text-lg gap-4 bg-gray-50">
       <span>⚠️ Patient data not found in Database.</span>
       {/* 🛑 FIX 3: navigate('/') */}
       <button onClick={() => { localStorage.clear(); navigate('/'); }} className="px-4 py-2 bg-teal-600 text-white rounded-lg">Go to Login</button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 relative overflow-x-hidden max-w-[100vw]">
      <PatientSidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-24 md:pt-8 w-full md:w-[calc(100%-256px)] min-w-0 transition-all duration-300">
        
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Hello, {dashboardData.name}! 👋</h1>
            <p className="text-gray-500 text-sm mt-1">Here is your health overview for today.</p>
          </div>
          {/* 🔥 ADD KIYA HAI: onClick={() => navigate('/patient/book-appointment')} */}
          <button onClick={() => navigate('/patient/book-appointment')} className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:bg-teal-700 transition-all active:scale-95 flex items-center gap-2">
            <span>➕</span> Book Appointment
          </button>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-2xl mb-3">🩸</div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Blood Group</p>
            <h3 className="text-xl font-extrabold text-gray-800 mt-1">{dashboardData.vitals.bloodGroup}</h3>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-2xl mb-3">⚖️</div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Weight</p>
            <h3 className="text-xl font-extrabold text-gray-800 mt-1">{dashboardData.vitals.weight} <span className="text-sm text-gray-500 font-medium">kg</span></h3>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center text-2xl mb-3">📏</div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Height</p>
            <h3 className="text-xl font-extrabold text-gray-800 mt-1">{dashboardData.vitals.height} <span className="text-sm text-gray-500 font-medium">cm</span></h3>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center text-2xl mb-3">❤️</div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Blood Pressure</p>
            <h3 className="text-xl font-extrabold text-gray-800 mt-1">{dashboardData.vitals.bp}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><span>🗓️</span> Upcoming Appointment</h3>
            
            {dashboardData.upcomingAppointment ? (
              <div className="bg-gradient-to-br from-teal-500 to-teal-700 p-6 rounded-2xl text-white shadow-lg shadow-teal-200">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="text-2xl font-bold">{dashboardData.upcomingAppointment.doctorId?.name || 'Assigned Doctor'}</h4>
                    <p className="text-teal-100 font-medium mt-1">{dashboardData.upcomingAppointment.doctorId?.specialization || 'Consultation'}</p>
                  </div>
                  <span className="bg-white/20 px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-widest backdrop-blur-sm">
                     {dashboardData.upcomingAppointment.status || 'Confirmed'}
                  </span>
                </div>
                
                <div className="flex gap-8 border-t border-white/20 pt-5">
                  <div>
                    <p className="text-xs text-teal-200 uppercase tracking-wider font-bold mb-1">Date</p>
                    <p className="font-bold text-lg">
                       {new Date(dashboardData.upcomingAppointment.date).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'})}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-teal-200 uppercase tracking-wider font-bold mb-1">Time</p>
                    <p className="font-bold text-lg">{dashboardData.upcomingAppointment.time || '10:30 AM'}</p>
                  </div>
                </div>
              </div>
            ) : (
               <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-center text-gray-500">
                  <p>No upcoming appointments found.</p>
               </div>
            )}
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><span>📄</span> Recent Prescriptions</h3>
              <button className="text-sm font-bold text-teal-600 hover:text-teal-700">View All</button>
            </div>
            
            <div className="space-y-4">
              {[
                { name: "Viral Fever Prescription", date: "10 Jan 2026", doctor: "Dr. Ankit Singh" },
                { name: "Blood Test Report", date: "05 Jan 2026", doctor: "Pathology Lab" }
              ].map((record, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-teal-200 hover:bg-teal-50/50 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform">💊</div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{record.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">By {record.doctor}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded-md border border-gray-100">{record.date}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <AIAssistant />

    </div>
  );
};

export default PatientDashboard;