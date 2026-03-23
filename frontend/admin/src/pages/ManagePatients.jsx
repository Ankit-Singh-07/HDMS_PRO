import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [bloodFilter, setBloodFilter] = useState("All");

  // Modal State
  const [selectedPatient, setSelectedPatient] = useState(null);

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

  const fetchPatients = async () => {
    try {
      const token = getAuthToken();
      const res = await axios.get('https://hdms-backend-7j7w.onrender.com/api/auth/patients-list', {
        headers: { "Authorization": `Bearer ${token}` }
      });
      // Sort newest first
      setPatients(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // 🔥 DELETE PATIENT
  const handleDelete = async (id, name) => {
    if (window.confirm(`⚠️ DANGER: Are you sure you want to permanently remove patient '${name}'?`)) {
      try {
        const token = getAuthToken();
        await axios.delete(`https://hdms-backend-7j7w.onrender.com/api/auth/delete-user/${id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        alert(`✅ Patient ${name} removed from the system.`);
        fetchPatients();
      } catch (err) {
        alert("❌ Failed to delete patient.");
      }
    }
  };

  // 🔥 EXPORT CSV (Excel)
  const exportToCSV = () => {
    if (patients.length === 0) return alert("No data to export!");
    const headers = ["Patient ID,Name,Email,Phone,Blood Group,Registered Date"];
    const rows = patients.map(p => 
      `#${p._id.slice(-6).toUpperCase()},${p.name},${p.email},${p.phone || 'N/A'},${p.bloodGroup || 'N/A'},${new Date(p.createdAt).toLocaleDateString()}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "HDMS_Patients_Directory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Smart Filtering
  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBlood = bloodFilter === "All" || p.bloodGroup === bloodFilter;
    return matchesSearch && matchesBlood;
  });

  // Stats
  const totalPatients = patients.length;
  const recentPatients = patients.filter(p => {
    const isRecent = (new Date() - new Date(p.createdAt)) < (7 * 24 * 60 * 60 * 1000); // Last 7 days
    return isRecent;
  }).length;

  return (
    <div className="flex bg-[#f8fafc] min-h-screen relative overflow-x-hidden max-w-[100vw]">
      <AdminSidebar />
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-24 md:pt-8 w-full transition-all duration-300">
        
        {/* HEADER */}
        <header className="mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Patient Directory</h1>
            <p className="text-teal-600 text-sm font-bold mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span> Complete Hospital Records
            </p>
          </div>
          <button onClick={exportToCSV} className="bg-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-900 shadow-lg shadow-slate-200 transition-all active:scale-95 flex items-center gap-2">
            ⬇️ Export Data (CSV)
          </button>
        </header>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 border-l-4 border-l-teal-500">
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center text-xl">🏥</div>
            <div><p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Total Registered</p><h3 className="text-2xl font-black text-slate-800">{totalPatients}</h3></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 border-l-4 border-l-indigo-500">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl">🆕</div>
            <div><p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">New This Week</p><h3 className="text-2xl font-black text-slate-800">{recentPatients}</h3></div>
          </div>
        </div>

        {/* MAIN TABLE SECTION */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          
          {/* FILTERS */}
          <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-center gap-4 bg-slate-50/50">
            <div className="relative w-full lg:w-96">
              <input 
                type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 outline-none text-sm font-medium"
              />
              <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
            </div>
            <select value={bloodFilter} onChange={(e) => setBloodFilter(e.target.value)} className="w-full lg:w-auto px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm font-bold text-slate-600 bg-white cursor-pointer hover:bg-slate-50">
              <option value="All">All Blood Groups</option>
              <option value="A+">A+</option><option value="A-">A-</option>
              <option value="B+">B+</option><option value="B-">B-</option>
              <option value="O+">O+</option><option value="O-">O-</option>
              <option value="AB+">AB+</option><option value="AB-">AB-</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-16 text-center text-teal-600 font-bold animate-pulse flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
                Fetching Patient Records...
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-5xl mb-4 border border-slate-100 shadow-inner">🩼</div>
                <h3 className="text-xl font-bold text-slate-700">No Patients Found</h3>
                <p className="text-slate-500 text-sm mt-1">Check your search spelling or clear filters.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                    <th className="p-4 pl-6">Patient Info</th>
                    <th className="p-4">Vitals</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Registration Date</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPatients.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/80 transition-colors group">
                      
                      <td className="p-4 pl-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">ID: #{p._id.slice(-6).toUpperCase()}</p>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-[10px] font-black tracking-widest border border-red-100 shadow-sm inline-block">
                          🩸 {p.bloodGroup || "UNKNOWN"}
                        </span>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-slate-700 text-sm truncate max-w-[150px]">{p.email}</p>
                        <p className="text-[10px] text-slate-500 font-bold mt-0.5">📞 {p.phone || "No phone added"}</p>
                      </td>

                      <td className="p-4 text-sm font-bold text-slate-600">
                        {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>

                      <td className="p-4 flex justify-center gap-2">
                        <button onClick={() => setSelectedPatient(p)} className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-100" title="View Profile">
                          👁️
                        </button>
                        <button onClick={() => handleDelete(p._id, p.name)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors border border-red-100" title="Delete Patient">
                          🗑️
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* 🔥 PREMIUM VIEW PROFILE MODAL */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-gradient-to-r from-teal-500 to-emerald-400 p-6 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-teal-600 shadow-lg">
                  {selectedPatient.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-white">
                  <h2 className="text-xl font-black">{selectedPatient.name}</h2>
                  <p className="text-teal-50 text-xs font-bold uppercase tracking-wider mt-1">Patient ID: #{selectedPatient._id.slice(-6).toUpperCase()}</p>
                </div>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors">
                ❌
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Blood Group</p>
                  <p className="font-black text-red-500 text-lg mt-1">{selectedPatient.bloodGroup || "N/A"}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Registered On</p>
                  <p className="font-bold text-slate-700 text-sm mt-1">{new Date(selectedPatient.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">📧</div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Email Address</p>
                    <p className="font-bold text-slate-700 text-sm">{selectedPatient.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">📞</div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Phone Number</p>
                    <p className="font-bold text-slate-700 text-sm">{selectedPatient.phone || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setSelectedPatient(null)} className="px-6 py-2.5 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManagePatients;