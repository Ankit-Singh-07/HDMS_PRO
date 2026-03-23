import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoctorSidebar from '../components/DoctorSidebar';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState({ disease: '', medicines: '', advice: '' });

  // 🔑 SMART TOKEN FINDER
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

  const fetchAppointments = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const res = await axios.get('https://hdms-backend-7j7w.onrender.com/api/appointments/doctor', {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "x-auth-token": token 
        }
      });
      setAppointments(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = getAuthToken();
      await axios.put(`https://hdms-backend-7j7w.onrender.com/api/appointments/${id}/status`, 
        { status: newStatus },
        { headers: { "Authorization": `Bearer ${token}`, "x-auth-token": token } }
      );
      fetchAppointments(); 
    } catch (err) {
      alert("Error updating status");
    }
  };

  // 🚀 FIXED: Modal mein bhi naya naam bhejne ka logic
  const openPrescriptionModal = (appointment) => {
    setSelectedPatient({
      ...appointment.patientId, 
      displayName: appointment.customPatientName || appointment.patientId?.name
    });
    setIsPrescriptionModalOpen(true);
  };

  const handleSendPrescription = async (e) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      const pId = typeof selectedPatient === 'object' ? selectedPatient._id : selectedPatient;

      if (!pId) {
        alert("Patient ID missing! Cannot send prescription.");
        return;
      }

      const medicinesArray = prescriptionData.medicines.split(',').map(med => med.trim());

      await axios.post('https://hdms-backend-7j7w.onrender.com/api/prescriptions/doctor/add', {
        patientId: pId,
        disease: prescriptionData.disease,
        medicines: medicinesArray,
        advice: prescriptionData.advice
      }, {
        headers: { "Authorization": `Bearer ${token}`, "x-auth-token": token }
      });

      alert("✅ Prescription sent to Patient successfully!");
      setIsPrescriptionModalOpen(false);
      setPrescriptionData({ disease: '', medicines: '', advice: '' });
      fetchAppointments();
      
    } catch (err) {
      console.error("Prescription Error:", err.response?.data || err.message);
      alert(`Error sending prescription: ${err.response?.data?.message || 'Server Failed'}`);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-blue-600">Loading your schedule... ⏳</div>;

  return (
    <div className="flex min-h-screen bg-gray-50 relative overflow-x-hidden max-w-[100vw]">
      
      <DoctorSidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-24 md:pt-8 w-full md:w-[calc(100%-256px)] min-w-0 transition-all duration-300">
        
        <header className="mb-6 md:mb-8 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Appointments Schedule</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your daily and upcoming patient visits.</p>
          </div>
          <button onClick={fetchAppointments} className="w-full md:w-auto bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-95">
            + Refresh List
          </button>
        </header>

        <div className="bg-white p-4 md:p-6 rounded-3xl border border-gray-100 shadow-sm w-full">
          {appointments.length === 0 ? (
            <div className="text-center text-gray-400 font-bold p-10">No appointments found.</div>
          ) : (
            <div className="space-y-4 w-full">
              
              <div className="hidden md:grid grid-cols-5 text-xs font-bold text-gray-400 uppercase tracking-wider pb-3 border-b border-gray-100 px-4">
                <div className="col-span-1">Patient Name</div>
                <div className="col-span-1">Date & Time</div>
                <div className="col-span-1">Problem</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>

              {appointments.map((apt) => (
                <div key={apt._id} className="flex flex-col md:grid md:grid-cols-5 items-start md:items-center p-4 md:p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all gap-3 md:gap-0">
                  
                  <div className="col-span-1 font-bold text-gray-800 w-full flex justify-between md:block">
                    <span className="md:hidden text-xs text-gray-400 uppercase">Patient:</span>
                    <div>
                      {/* 🚀 FIXED: Yahan Naya Naam aayega */}
                      {apt.customPatientName || apt.patientId?.name || 'Unknown Patient'}
                      <p className="text-[10px] text-gray-400 font-normal">{apt.patientId?.phone || 'No phone'}</p>
                    </div>
                  </div>

                  <div className="col-span-1 w-full flex justify-between md:block">
                    <span className="md:hidden text-xs text-gray-400 uppercase">Time:</span>
                    <div className="text-right md:text-left">
                      <p className="font-bold text-gray-700 text-sm">{apt.date}</p>
                      <p className="text-xs text-gray-500">{apt.time}</p>
                    </div>
                  </div>

                  <div className="col-span-1 text-sm font-medium text-gray-600 w-full flex justify-between md:block">
                    <span className="md:hidden text-xs text-gray-400 uppercase">Reason:</span>
                    <span className="text-right md:text-left">{apt.problem || apt.reason || "General Visit"}</span>
                  </div>

                  <div className="col-span-1 w-full flex justify-between md:block items-center">
                    <span className="md:hidden text-xs text-gray-400 uppercase">Status:</span>
                    <span className={`px-3 py-1 text-[10px] font-extrabold uppercase rounded-lg ${apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : apt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{apt.status}</span>
                  </div>

                  <div className="col-span-1 flex justify-end gap-2 w-full mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-0 border-gray-50">
                    {apt.status === 'PENDING' && <button onClick={() => handleUpdateStatus(apt._id, 'CONFIRMED')} className="flex-1 md:flex-none bg-green-50 text-green-600 text-xs font-bold px-3 py-2 md:py-1.5 rounded-lg hover:bg-green-100">Confirm</button>}
                    {apt.status === 'CONFIRMED' && <button onClick={() => openPrescriptionModal(apt)} className="flex-1 md:flex-none bg-blue-50 text-blue-600 text-xs font-bold px-3 py-2 md:py-1.5 rounded-lg hover:bg-blue-100 shadow-sm">💊 Prescribe</button>}
                    {apt.status !== 'CANCELLED' && <button onClick={() => handleUpdateStatus(apt._id, 'CANCELLED')} className="flex-1 md:flex-none bg-red-50 text-red-600 text-xs font-bold px-3 py-2 md:py-1.5 rounded-lg hover:bg-red-100">Cancel</button>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* PRESCRIPTION MODAL */}
      {isPrescriptionModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-6 animate-in zoom-in-95 duration-200">
            {/* 🚀 FIXED: Modal mein bhi naya naam dikhega */}
            <h3 className="text-xl font-bold text-gray-800 mb-4">Write Prescription for {selectedPatient?.displayName || 'Patient'}</h3>
            <form onSubmit={handleSendPrescription} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Diagnosis / Disease</label>
                <input required type="text" value={prescriptionData.disease} onChange={e => setPrescriptionData({...prescriptionData, disease: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500" placeholder="e.g. Viral Fever" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Medicines</label>
                <textarea required rows="3" value={prescriptionData.medicines} onChange={e => setPrescriptionData({...prescriptionData, medicines: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500" placeholder="Paracetamol 500mg, Vitamin C" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Doctor's Advice</label>
                <input type="text" value={prescriptionData.advice} onChange={e => setPrescriptionData({...prescriptionData, advice: e.target.value})} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-blue-500" placeholder="Rest for 3 days" />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsPrescriptionModalOpen(false)} className="flex-1 bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200">Cancel</button>
                <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-blue-700">Send to Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;