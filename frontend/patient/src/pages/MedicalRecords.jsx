import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PatientSidebar from '../components/PatientSidebar';

const MedicalRecords = () => {
  const navigate = useNavigate();
  // 🔥 INITIAL STATE KHALI HAI (Dummy Data Hata Diya Gaya Hai)
  const [reports, setReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

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

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const userStr = localStorage.getItem('user');
        const token = getAuthToken(); 
        
        if (!userStr || !token) {
          navigate('/');
          return;
        }
        
        const user = JSON.parse(userStr);
        const ptId = user._id || user.id;

        const apiHeaders = { 
          "Authorization": `Bearer ${token}`,
          "x-auth-token": token 
        };

        try {
          const prescriptionRes = await axios.get(`http://localhost:5000/api/prescriptions/patient/${ptId}`, { headers: apiHeaders });
          setPrescriptions(prescriptionRes.data);
        } catch (err) {
          console.error("Prescriptions Error:", err);
        }

        try {
          const reportRes = await axios.get(`http://localhost:5000/api/reports/patient/${ptId}`, { headers: apiHeaders });
          setReports(reportRes.data);
        } catch (err) {}

        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchRecords();
  }, [navigate]);

  const handleDownloadPrescription = (id) => {
    window.open(`http://localhost:5000/api/prescriptions/download/${id}`, '_blank');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-teal-600 font-bold">Loading records... ⏳</div>;

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <PatientSidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-24 md:pt-8 w-full transition-all duration-300">
        <header className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center text-2xl">📄</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Medical Records</h1>
            <p className="text-gray-500 text-sm mt-1">Access all your lab reports and past prescriptions here.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><span>🔬</span> Lab Reports</h3>
            <div className="p-6 bg-white rounded-3xl border border-gray-100 text-center text-gray-400 font-bold">No Lab Reports Found.</div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><span>💊</span> Past Prescriptions</h3>
            <div className="space-y-4">
              {prescriptions.length === 0 ? (
                <div className="p-6 bg-white rounded-3xl border border-gray-100 text-center text-gray-400 font-bold">No Prescriptions Found from Doctor.</div>
              ) : (
                prescriptions.map((prescription) => (
                  <div key={prescription._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-gray-800">{prescription.disease || "General Checkup"}</h4>
                        <p className="text-sm font-medium text-teal-600 mt-1">By {prescription.doctorId?.name || 'Doctor'}</p>
                      </div>
                      <span className="text-xs font-bold text-gray-400 border border-gray-200 px-2 py-1 rounded-md bg-gray-50">
                        {prescription.date || new Date(prescription.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-xl mt-4 border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Prescribed Medicines</p>
                      <p className="text-sm text-gray-700 font-medium truncate">
                        {prescription.medicines?.map(m => typeof m === 'object' ? m.name : m).join(', ')}
                      </p>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button onClick={() => setSelectedPrescription(prescription)} className="flex-1 border-2 border-teal-50 text-teal-600 font-bold py-2.5 rounded-xl hover:bg-teal-50 transition-colors text-sm">View Details</button>
                      <button onClick={() => handleDownloadPrescription(prescription._id)} className="flex-1 bg-teal-600 text-white font-bold py-2.5 rounded-xl hover:bg-teal-700 transition-colors shadow-md flex items-center justify-center gap-2 text-sm">⬇️ PDF</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </main>

      {/* POPUP MODAL */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-teal-600 p-6 text-white flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{selectedPrescription.doctorId?.name || 'Doctor'}</h3>
                <p className="text-teal-100 text-sm mt-1">Prescription Details</p>
              </div>
              <button onClick={() => setSelectedPrescription(null)} className="text-white hover:text-gray-200 text-2xl">✕</button>
            </div>

            <div className="p-6">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Diagnosis</p>
                  <p className="font-bold text-gray-800">{selectedPrescription.disease}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-teal-600 font-bold uppercase mb-3 flex items-center gap-2">Medicines</p>
                <ul className="space-y-3">
                  {selectedPrescription.medicines?.map((med, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <span>💊</span> {typeof med === 'object' ? `${med.name}` : med}
                    </li>
                  ))}
                </ul>
              </div>

              {selectedPrescription.notes && (
                <div className="mt-4 p-4 bg-orange-50 rounded-xl">
                  <p className="text-xs text-orange-600 font-bold uppercase mb-1">Advice</p>
                  <p className="text-sm text-gray-700">{selectedPrescription.notes}</p>
                </div>
              )}

              <div className="mt-8 flex gap-3">
                <button onClick={() => setSelectedPrescription(null)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl">Close</button>
                <button onClick={() => handleDownloadPrescription(selectedPrescription._id)} className="flex-1 bg-gray-900 text-white font-bold py-3 rounded-xl">Download PDF</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;