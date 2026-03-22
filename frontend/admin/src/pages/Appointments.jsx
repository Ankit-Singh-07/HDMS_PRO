import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔥 Smart Filters States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

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

  const fetchAppointments = async () => {
    try {
      const token = getAuthToken();
      const res = await axios.get('http://localhost:5000/api/appointments/admin', {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "x-auth-token": token 
        }
      });
      setAppointments(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    const confirmMsg = newStatus === 'CONFIRMED' ? 'Confirm this appointment?' : 'Cancel this appointment?';
    if (window.confirm(confirmMsg)) {
      try {
        const token = getAuthToken();
        await axios.put(`http://localhost:5000/api/appointments/admin/${id}`, 
          { status: newStatus },
          { 
            headers: { 
              "Authorization": `Bearer ${token}`,
              "x-auth-token": token 
            }
          }
        );
        alert(`✅ Appointment marked as ${newStatus}`);
        fetchAppointments(); 
      } catch (err) {
        alert("❌ Failed to update status.");
      }
    }
  };

  // 🔥 FILTER LOGIC (FIXED)
  const filteredAppointments = appointments.filter(apt => {
    // 🚀 FIX 1: Search bar ke liye bhi custom naam ko priority de di
    const ptName = apt.customPatientName || apt.patientId?.name || "";
    const docName = apt.doctorId?.name || "";
    const matchesSearch = ptName.toLowerCase().includes(searchTerm.toLowerCase()) || docName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || apt.status === statusFilter;
    
    const todayStr = new Date().toISOString().split('T')[0];
    const matchesDate = dateFilter === "All" ? true 
                      : dateFilter === "Today" ? apt.date === todayStr 
                      : apt.date !== todayStr; 
                      
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalApts = appointments.length;
  const pendingApts = appointments.filter(a => a.status === 'PENDING').length;
  const confirmedApts = appointments.filter(a => a.status === 'CONFIRMED').length;

  return (
    <div className="flex bg-[#f8fafc] min-h-screen relative overflow-x-hidden max-w-[100vw]">
      <AdminSidebar />
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-24 md:pt-8 w-full transition-all duration-300">
        
        <header className="mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Master Schedule</h1>
            <p className="text-teal-600 text-sm font-bold mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span> Tracking all hospital appointments
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-600">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 border-l-4 border-l-blue-500">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">🗓️</div>
            <div><p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total</p><h3 className="text-2xl font-black text-slate-800">{totalApts}</h3></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 border-l-4 border-l-orange-400">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-xl">⏳</div>
            <div><p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Action Needed (Pending)</p><h3 className="text-2xl font-black text-slate-800">{pendingApts}</h3></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 border-l-4 border-l-emerald-500">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl">✅</div>
            <div><p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Confirmed</p><h3 className="text-2xl font-black text-slate-800">{confirmedApts}</h3></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          
          <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-4 bg-slate-50/50">
            <div className="relative w-full lg:w-96">
              <input 
                type="text" placeholder="Search Patient or Doctor..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
              />
              <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
            </div>
            
            <div className="flex w-full lg:w-auto gap-3">
              <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="flex-1 lg:w-auto px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm font-bold text-slate-600 bg-white cursor-pointer hover:bg-slate-50">
                <option value="All">All Dates</option>
                <option value="Today">Today Only</option>
                <option value="Other">Upcoming / Past</option>
              </select>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="flex-1 lg:w-auto px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm font-bold text-slate-600 bg-white cursor-pointer hover:bg-slate-50">
                <option value="All">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-16 text-center text-indigo-500 font-bold animate-pulse flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                Fetching Schedule...
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-5xl mb-4 border border-slate-100 shadow-inner">📆</div>
                <h3 className="text-xl font-bold text-slate-700">No Appointments Found</h3>
                <p className="text-slate-500 text-sm mt-1">Try changing your filters or search terms.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                    <th className="p-4 pl-6">Patient</th>
                    <th className="p-4">Assigned Doctor</th>
                    <th className="p-4">Schedule</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.map((apt) => (
                    <tr key={apt._id} className="hover:bg-slate-50/80 transition-colors group">
                      
                      <td className="p-4 pl-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                          {/* 🚀 FIX 2: Avatar (Gol ghera) ke andar bhi custom naam ka pehla akshar aayega */}
                          {(apt.customPatientName || apt.patientId?.name || "P").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          {/* 🚀 FIX 3: Asli Custom Naam Yahan Dikhaye Ga! */}
                          <p className="font-bold text-slate-800 text-sm">{apt.customPatientName || apt.patientId?.name || "Unknown"}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 max-w-[120px] truncate">
                            {apt.problem || apt.reason || "General Visit"}
                          </p>
                        </div>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-slate-700 text-sm flex items-center gap-1">👨‍⚕️ {apt.doctorId?.name || "Dr. Unassigned"}</p>
                        <p className="text-[10px] text-slate-500 font-bold mt-0.5">ID: #{apt.doctorId?._id?.slice(-4).toUpperCase() || "N/A"}</p>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-slate-800 text-sm">{apt.date}</p>
                        <p className="text-xs font-bold text-indigo-600 mt-0.5 bg-indigo-50 inline-block px-2 py-0.5 rounded border border-indigo-100">{apt.time}</p>
                      </td>

                      <td className="p-4 text-center">
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest uppercase border ${
                          apt.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                          apt.status === 'CANCELLED' ? 'bg-red-50 text-red-600 border-red-200' : 
                          'bg-orange-50 text-orange-600 border-orange-200 animate-pulse'
                        }`}>
                          {apt.status || "PENDING"}
                        </span>
                      </td>

                      <td className="p-4 flex justify-center gap-2">
                        {apt.status !== 'CANCELLED' && (
                          <>
                            {apt.status === 'PENDING' && (
                              <button onClick={() => handleStatusChange(apt._id, 'CONFIRMED')} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-100" title="Confirm Appointment">
                                ✅
                              </button>
                            )}
                            <button onClick={() => handleStatusChange(apt._id, 'CANCELLED')} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-100" title="Cancel Appointment">
                              ❌
                            </button>
                          </>
                        )}
                        {apt.status === 'CANCELLED' && (
                          <span className="text-xs text-slate-400 font-bold">No Actions</span>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Appointments;