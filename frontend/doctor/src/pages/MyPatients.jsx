import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoctorSidebar from '../components/DoctorSidebar';

const MyPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All"); 
  const [selectedPatient, setSelectedPatient] = useState(null); 
  const [isRecordOpen, setIsRecordOpen] = useState(false); 

  const [patientRecords, setPatientRecords] = useState({ prescriptions: [], reports: [] });
  const [loadingRecords, setLoadingRecords] = useState(false);

  const getAuthToken = () => {
    let token = localStorage.getItem('token');
    if (!token) {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try { const user = JSON.parse(userStr); token = user.token; } catch (e) {}
      }
    }
    return token;
  };

  useEffect(() => {
    const fetchRealPatients = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const res = await axios.get('https://hdms-backend-7j7w.onrender.com/api/appointments/doctor', {
          headers: { "Authorization": `Bearer ${token}`, "x-auth-token": token }
        });

        const appointmentsData = res.data;
        const patientMap = new Map();

        appointmentsData.forEach(apt => {
          if (!apt.patientId) return; 

          const ptName = apt.customPatientName || apt.patientId.name || "Unknown Patient";
          const ptId = apt.patientId._id;
          const uniqueKey = `${ptId}-${ptName.toLowerCase().trim()}`;

          if (!patientMap.has(uniqueKey)) {
            patientMap.set(uniqueKey, {
              id: apt._id.substring(apt._id.length - 4).toUpperCase(),
              rawId: ptId, 
              name: ptName,
              initials: ptName.charAt(0).toUpperCase(),
              age: "N/A", 
              gender: apt.patientId.gender ? apt.patientId.gender.charAt(0).toUpperCase() : "M",
              blood: apt.patientId.bloodGroup || "B+",
              lastVisit: apt.date,
              nextVisit: apt.status === 'PENDING' ? `Today, ${apt.time}` : "No upcoming visit",
              status: apt.status === 'PENDING' ? "In Waiting Room" : "Discharged",
              alerts: apt.status === 'PENDING' ? ["New Appointment"] : [],
              phone: apt.patientId.phone || "N/A",
              vitals: { bp: "120/80", weight: "70", sugar: "90" }, 
              history: [],
              reports: []
            });
          }

          patientMap.get(uniqueKey).history.push({
            date: apt.date,
            issue: apt.problem || apt.reason || "General Consultation",
            notes: `Status: ${apt.status} | Time: ${apt.time}`
          });
        });

        setPatients(Array.from(patientMap.values()));
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch patients:", err);
        setLoading(false);
      }
    };

    fetchRealPatients();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === "Today") return matchesSearch && patient.nextVisit.includes("Today");
    return matchesSearch; 
  });

  const handleOpenRecord = async (patient) => {
    setSelectedPatient(patient);
    setIsRecordOpen(true);
    setLoadingRecords(true);

    try {
      const token = getAuthToken();
      const apiHeaders = { "Authorization": `Bearer ${token}`, "x-auth-token": token };

      const [prescriptionRes, reportRes] = await Promise.allSettled([
        axios.get(`https://hdms-backend-7j7w.onrender.com/api/prescriptions/patient/${patient.rawId}`, { headers: apiHeaders }),
        axios.get(`https://hdms-backend-7j7w.onrender.com/api/reports/patient/${patient.rawId}`, { headers: apiHeaders })
      ]);

      setPatientRecords({
        prescriptions: prescriptionRes.status === 'fulfilled' ? prescriptionRes.value.data : [],
        reports: reportRes.status === 'fulfilled' ? reportRes.value.data : []
      });

    } catch (err) {
      console.error("Record fetch error:", err);
    } finally {
      setLoadingRecords(false);
    }
  };

  const getStatusColor = (status) => {
    if (status.includes("Waiting")) return "bg-green-100 text-green-700 border-green-200";
    return "bg-gray-100 text-gray-600 border-gray-200"; 
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-blue-600">Syncing Live Patients Data... ⏳</div>;

  return (
    <div className="flex bg-gray-50 min-h-screen relative overflow-x-hidden max-w-[100vw]">
      <DoctorSidebar />
      
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-24 md:pt-8 w-full md:w-[calc(100%-256px)] min-w-0 transition-all duration-300">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">My Patients</h1>
            <p className="text-gray-500 mt-1">Manage and track live patient records.</p>
          </div>

          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="Search patient by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm transition-all"
            />
            <span className="absolute left-4 top-3.5 text-xl opacity-40">🔍</span>
          </div>
        </header>

        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <button onClick={() => setActiveTab("All")} className={`px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${activeTab === "All" ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}>
            All Patients ({patients.length})
          </button>
          <button onClick={() => setActiveTab("Today")} className={`px-6 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === "Today" ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'}`}>
            📅 Today's Visits ({patients.filter(p => p.nextVisit.includes("Today")).length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.length > 0 ? (
            filteredPatients.map((p) => (
              <div key={p.id} className="bg-white p-6 rounded-3xl shadow-sm border-2 border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
                
                <div className="absolute top-5 right-5">
                  <span className={`text-[10px] font-extrabold uppercase px-3 py-1.5 rounded-lg border ${getStatusColor(p.status)}`}>
                    {p.status.includes("Waiting") ? '🟢 ' : ''}{p.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-3 mt-2">
                  <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-inner">
                    {p.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 leading-tight truncate max-w-[150px]">{p.name}</h3>
                    <p className="text-xs text-blue-600 font-bold tracking-wider mt-1">ID: #{p.id}</p>
                  </div>
                </div>
                
                <div className="space-y-3 border-t border-gray-100 pt-4 text-sm text-gray-600 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium">Blood Group:</span> 
                    <span className="font-bold text-red-500">{p.blood}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 font-medium">Last Visit:</span> 
                    <span className="font-bold text-gray-600">{p.lastVisit}</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <span className="text-gray-500 font-bold text-xs uppercase">Next Visit:</span> 
                    <span className={`font-bold ${p.nextVisit.includes('Today') ? 'text-green-600 animate-pulse' : 'text-gray-800'}`}>
                      {p.nextVisit}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => handleOpenRecord(p)} 
                  className="w-full mt-5 py-3 rounded-xl font-bold transition-all active:scale-95 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  View Full Report ➔
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <span className="text-4xl mb-3 block">📭</span>
              <p className="text-gray-800 font-bold text-lg mb-1">No patients found</p>
              <p className="text-gray-400 text-sm">Waiting for new appointments.</p>
            </div>
          )}
        </div>
      </main>

      {/* 🚀 FIXED AND POLISHED MODAL */}
      {isRecordOpen && selectedPatient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            
            <div className="p-6 text-white flex justify-between items-center shrink-0 bg-[#0a192f]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl bg-blue-500 text-white">
                  {selectedPatient.initials}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
                  <p className="text-white/70 text-sm font-medium">Patient ID: #{selectedPatient.id} | Ph: {selectedPatient.phone}</p>
                </div>
              </div>
              <button onClick={() => setIsRecordOpen(false)} className="text-white/60 hover:text-white text-3xl">&times;</button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
              {loadingRecords ? (
                <div className="text-center p-10 font-bold text-blue-600 animate-pulse">Loading Medical Records...</div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><span>📋</span> Visit History</h3>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 mb-8">
                    {selectedPatient.history.map((hist, index) => (
                      <div key={index} className="p-4 border-b border-gray-50 last:border-0">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-gray-800">{hist.issue}</span>
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{hist.date}</span>
                        </div>
                        <p className="text-sm text-gray-500">{hist.notes}</p>
                      </div>
                    ))}
                  </div>

                  {/* 🚀 FIXED: Prescriptions mein Date aur Premium Styling add kar di hai */}
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><span>💊</span> Prescriptions</h3>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 mb-8">
                    {patientRecords.prescriptions.length > 0 ? patientRecords.prescriptions.map((rx, idx) => (
                      <div key={idx} className="p-4 border-b border-gray-50 last:border-0">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-gray-800 text-lg">{rx.disease || "General Checkup"}</span>
                          
                          {/* Yahan Date aayegi! */}
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                            {rx.date || (rx.createdAt ? new Date(rx.createdAt).toLocaleDateString('en-IN') : 'Recent')}
                          </span>
                        </div>
                        
                        <div className="bg-gray-50 p-3 rounded-xl mt-2 border border-gray-100">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Medicines</p>
                          <p className="text-sm font-medium text-gray-700">
                            {Array.isArray(rx.medicines) ? rx.medicines.join(', ') : rx.medicines}
                          </p>
                        </div>
                        
                        {rx.advice && <p className="text-sm text-gray-500 mt-3 flex items-center gap-2"><span>💡</span> {rx.advice}</p>}
                      </div>
                    )) : (
                      <p className="p-6 text-center text-gray-400 font-bold">No prescriptions found.</p>
                    )}
                  </div>
                  
                  {/* Lab Reports (Same as before) */}
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><span>🧪</span> Lab Reports</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {patientRecords.reports.length > 0 ? patientRecords.reports.map((report, index) => (
                      <div key={report._id || index} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <div>
                          <p className="text-sm font-bold text-gray-800">{report.testName || "Medical Report"}</p>
                          <p className="text-xs text-gray-400 font-medium mt-0.5">{report.labName || "Hospital Lab"}</p>
                        </div>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase">AVAILABLE</span>
                      </div>
                    )) : (
                      <div className="col-span-full p-6 text-center text-gray-400 font-bold border-2 border-dashed border-gray-100 rounded-xl bg-white">No lab reports.</div>
                    )}
                  </div>

                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPatients;