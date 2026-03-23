import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getAuthToken = () => localStorage.getItem('token');

  const fetchDoctors = async () => {
    try {
      const token = getAuthToken();
      const res = await axios.get('https://hdms-backend-7j7w.onrender.com/api/auth/doctors-list', {
        headers: { "Authorization": `Bearer ${token}` }
      });
      setDoctors(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // 🔥 DELETE DOCTOR FUNCTION
  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete Dr. ${name}?`)) {
      try {
        const token = getAuthToken();
        await axios.delete(`https://hdms-backend-7j7w.onrender.com/api/auth/delete-user/${id}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        alert(`✅ Dr. ${name} has been deleted.`);
        fetchDoctors(); // Refresh list after delete
      } catch (err) {
        alert("❌ Failed to delete doctor.");
      }
    }
  };

  const handleAddNew = () => {
    alert("ℹ️ DOCTOR REGISTRATION PROCESS:\nPlease ask the new doctor to click 'Create Account' on the login page. Once they register, their profile will appear in the 'Approvals' tab for you to verify.");
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (doc.email && doc.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex bg-[#f8fafc] min-h-screen relative overflow-x-hidden max-w-[100vw]">
      <AdminSidebar />
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-24 md:pt-8 w-full transition-all duration-300">
        
        <header className="mb-8 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Manage Doctors</h1>
            <p className="text-teal-600 text-sm font-bold mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span> Live Database Connected
            </p>
          </div>
          <button onClick={handleAddNew} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg transition-all active:scale-95">
            + Add New Doctor
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-2xl">👨‍⚕️</div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Approved Doctors</p>
              <h3 className="text-2xl font-black text-slate-800">{doctors.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">📇 Doctors Directory</h2>
            <input 
              type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-72 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-slate-50 text-sm"
            />
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-10 text-center font-bold text-indigo-500 animate-pulse">Loading Doctors... ⏳</div>
            ) : filteredDoctors.length === 0 ? (
              <div className="p-10 text-center text-slate-500 font-bold">No doctors found.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                    <th className="p-4 pl-6">Doctor Info</th>
                    <th className="p-4">Specialization</th>
                    <th className="p-4">Contact / Email</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDoctors.map((doc) => (
                    <tr key={doc._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 pl-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                          {doc.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{doc.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">ID: #{doc._id.slice(-4).toUpperCase()}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">{doc.specialization || "General"}</span>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-semibold text-slate-700">{doc.email}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{doc.phone || "No Phone Set"}</p>
                      </td>
                      <td className="p-4 flex justify-center gap-2">
                        <button onClick={() => handleDelete(doc._id, doc.name)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Delete Doctor">🗑️</button>
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

export default ManageDoctors;