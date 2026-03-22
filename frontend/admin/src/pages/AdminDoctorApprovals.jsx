import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar'; // 🔥 Sidebar import kar liya

const AdminDoctorApprovals = () => {
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchPendingDoctors = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const res = await axios.get('http://localhost:5000/api/auth/admin/pending-doctors', {
        headers: { "Authorization": `Bearer ${token}`, "x-auth-token": token }
      });
      setPendingDoctors(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch pending doctors", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const handleApprove = async (doctorId) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      await axios.put(`http://localhost:5000/api/auth/admin/approve-doctor/${doctorId}`, {}, {
        headers: { "Authorization": `Bearer ${token}`, "x-auth-token": token }
      });
      
      alert("✅ Doctor Approved Successfully! Now they will appear in the Patient Portal.");
      fetchPendingDoctors();
    } catch (err) {
      alert("❌ Error approving doctor.");
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen relative overflow-x-hidden max-w-[100vw]">
      {/* 🚀 RESPONSIVE SIDEBAR */}
      <AdminSidebar />

      {/* 🚀 RESPONSIVE MAIN CONTENT (Mobile par margin-left 0, aur padding-top zyada) */}
      <main className="flex-1 ml-0 md:ml-64 p-4 sm:p-6 md:p-8 pt-24 md:pt-8 w-full md:w-[calc(100%-256px)] min-w-0 transition-all duration-300">
        
        <header className="mb-6 md:mb-8 bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-orange-50 text-orange-600 rounded-xl md:rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-inner border border-orange-100">
            👨‍⚕️
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-black text-gray-800 tracking-tight">Doctor Approvals</h1>
            <p className="text-gray-500 text-xs md:text-sm font-medium mt-0.5 md:mt-1">Review and approve new doctors.</p>
          </div>
        </header>

        {loading ? (
          <div className="text-center p-10 font-bold text-orange-500 animate-pulse">Checking for new applications... ⏳</div>
        ) : pendingDoctors.length === 0 ? (
          <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-10 md:p-16 text-center shadow-sm">
            <span className="text-5xl md:text-6xl block mb-4">👍</span>
            <h2 className="text-xl md:text-2xl font-bold text-gray-700">All Caught Up!</h2>
            <p className="text-gray-500 mt-2 text-sm md:text-base">No pending doctor approvals at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {pendingDoctors.map((doc) => (
              <div key={doc._id} className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-orange-400"></div>
                
                <div className="flex justify-between items-start mb-4 mt-2">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold shadow-inner border border-slate-200/50">
                      {doc.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-gray-800 leading-tight">{doc.name}</h3>
                      <p className="text-[10px] md:text-xs font-bold text-orange-600 tracking-wider mt-1 uppercase">Pending Approval</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-5 md:mb-6 bg-slate-50 p-3 md:p-4 rounded-xl border border-slate-100">
                  <p className="text-xs md:text-sm flex flex-col md:flex-row md:justify-between gap-1 md:gap-0">
                    <span className="text-gray-500">Email:</span> 
                    <span className="font-semibold text-gray-700 truncate">{doc.email}</span>
                  </p>
                  <p className="text-xs md:text-sm flex flex-col md:flex-row md:justify-between gap-1 md:gap-0">
                    <span className="text-gray-500">Specialization:</span> 
                    <span className="font-semibold text-gray-700">{doc.specialization || "Not Provided"}</span>
                  </p>
                </div>

                <div className="flex gap-2 md:gap-3 mt-auto">
                  <button className="flex-1 bg-white border-2 border-gray-100 text-gray-500 text-sm md:text-base font-bold py-2 md:py-2.5 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors">
                    Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(doc._id)}
                    className="flex-1 bg-green-500 text-white text-sm md:text-base font-bold py-2 md:py-2.5 rounded-xl hover:bg-green-600 shadow-md shadow-green-500/30 transition-all active:scale-95 flex items-center justify-center gap-1 md:gap-2"
                  >
                    ✅ Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDoctorApprovals;