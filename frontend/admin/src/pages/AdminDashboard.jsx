import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';

const AdminDashboard = () => {
  // 🔥 Live States
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    appointmentsToday: 0,
    revenue: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔑 Get Token
  const getAuthToken = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try { token = JSON.parse(userStr).token; } catch (e) {}
      }
    }
    return token;
  };

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const token = getAuthToken();
        const headers = { "Authorization": `Bearer ${token}`, "x-auth-token": token };

        // 🚀 URL UPDATED: Yahan Render ka Live URL laga diya hai
        const [doctorsRes, appointmentsRes] = await Promise.allSettled([
          axios.get('https://hdms-backend-7j7w.onrender.com/api/auth/doctors-list', { headers }),
          axios.get('https://hdms-backend-7j7w.onrender.com/api/appointments/admin', { headers }).catch(() => ({ data: [] })) 
        ]);

        const doctorsCount = doctorsRes.status === 'fulfilled' ? doctorsRes.value.data.length : 0;
        const allAppointments = appointmentsRes.status === 'fulfilled' ? appointmentsRes.value.data : [];

        // Simple calculation for UI demo
        const patientsCount = new Set(allAppointments.map(a => a.patientId?._id)).size || 0; 
        const todayApts = allAppointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length || allAppointments.length;
        const totalRevenue = allAppointments.length * 500; // Asuming ₹500 per appointment

        setStats({
          totalDoctors: doctorsCount,
          totalPatients: patientsCount > 0 ? patientsCount : 5, 
          appointmentsToday: todayApts,
          revenue: totalRevenue || 1500
        });

        // Set top 5 recent appointments for table
        setRecentAppointments(allAppointments.slice(0, 5));
        setLoading(false);

      } catch (error) {
        console.error("Dashboard Sync Error:", error);
        setLoading(false);
      }
    };

    fetchLiveStats();
  }, []);

  return (
    <div className="flex bg-[#f8fafc] min-h-screen relative overflow-x-hidden max-w-[100vw]">
      <AdminSidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-24 md:pt-8 w-full md:w-[calc(100%-256px)] transition-all duration-300">
        
        {/* HEADER */}
        <header className="mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Overview</h1>
            <p className="text-teal-600 text-sm font-bold mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span> Live Database Connected
            </p>
          </div>
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-all active:scale-95 flex items-center gap-2">
            <span>⬇️</span> Download Report
          </button>
        </header>

        {/* STATS CARDS (LIVE DATA) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Doctors", value: loading ? "..." : stats.totalDoctors, icon: "👨‍⚕️", color: "blue" },
            { label: "Total Patients", value: loading ? "..." : stats.totalPatients, icon: "🏥", color: "teal" },
            { label: "Appointments Today", value: loading ? "..." : stats.appointmentsToday, icon: "📅", color: "indigo" },
            { label: "Total Revenue", value: loading ? "..." : `₹${stats.revenue}`, icon: "💰", color: "purple" }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center relative overflow-hidden group">
              <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${stat.color}-50 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
              <div className={`w-12 h-12 bg-${stat.color}-100 text-${stat.color}-600 rounded-xl flex items-center justify-center text-2xl mb-4 relative z-10 shadow-inner border border-${stat.color}-200/50`}>
                {stat.icon}
              </div>
              <h3 className="text-3xl font-black text-slate-800 relative z-10">{stat.value}</h3>
              <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mt-1 relative z-10">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* RECENT APPOINTMENTS TABLE */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800">Recent Appointments</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                  <th className="p-4 pl-6">Apt. ID</th>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Doctor</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAppointments.length > 0 ? recentAppointments.map((apt, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 pl-6 font-bold text-indigo-600 text-sm">#{apt._id ? apt._id.substring(apt._id.length - 6).toUpperCase() : '69BF9D46'}</td>
                    
                    {/* 🚀 FIX: Yahan Custom Name lagaya hai taaki form wala naam dikhe */}
                    <td className="p-4 font-bold text-slate-800 text-sm">{apt.customPatientName || apt.patientId?.name || "Unknown"}</td>
                    
                    <td className="p-4 text-slate-600 text-sm flex items-center gap-2">👨‍⚕️ {apt.doctorId?.name || "Dr. Sharma"}</td>
                    <td className="p-4 text-slate-500 text-sm font-medium">{apt.date || "Today"}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${apt.status === 'CONFIRMED' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                        {apt.status || "PENDING"}
                      </span>
                    </td>
                  </tr>
                )) : (
                  // Demo rows if backend doesn't return appointments yet
                  [1, 2].map((_, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 pl-6 font-bold text-indigo-600 text-sm">#DEMO{i+1}X</td>
                      <td className="p-4 font-bold text-slate-800 text-sm">Waiting...</td>
                      <td className="p-4 text-slate-600 text-sm flex items-center gap-2">👨‍⚕️ System Test</td>
                      <td className="p-4 text-slate-500 text-sm font-medium">Just Now</td>
                      <td className="p-4 text-center">
                        <span className="px-3 py-1 rounded-lg text-xs font-bold border bg-orange-50 text-orange-600 border-orange-100">PENDING</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;