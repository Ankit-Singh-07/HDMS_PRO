import React, { useState } from 'react';

const AppointmentTable = () => {
  // Modal aur Patient ko track karne ke liye state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const appointments = [
    { id: 1, patient: "Ankit Singh", problem: "Viral Fever", time: "10:30 AM", status: "Waiting" },
    { id: 2, patient: "Rahul Verma", problem: "Checkup", time: "11:00 AM", status: "In-Progress" },
    { id: 3, patient: "Sanya Gupta", problem: "Fracture", time: "11:45 AM", status: "Completed" },
  ];

  const getStatusColor = (status) => {
    if (status === "Waiting") return "bg-yellow-100 text-yellow-700";
    if (status === "In-Progress") return "bg-blue-100 text-blue-700";
    return "bg-green-100 text-green-700";
  };

  // Button click par modal open karna
  const handlePrescribeClick = (patientName) => {
    setSelectedPatient(patientName);
    setIsModalOpen(true);
  };

  return (
    <>
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="p-4 text-sm font-semibold text-gray-600">Patient</th>
            <th className="p-4 text-sm font-semibold text-gray-600">Problem</th>
            <th className="p-4 text-sm font-semibold text-gray-600">Time</th>
            <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
            <th className="p-4 text-sm font-semibold text-gray-600 text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {appointments.map((app) => (
            <tr key={app.id} className="hover:bg-blue-50/20 transition-colors">
              <td className="p-4 font-bold text-gray-800">{app.patient}</td>
              <td className="p-4 text-gray-600">{app.problem}</td>
              <td className="p-4 text-gray-600 font-mono text-sm">{app.time}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
              </td>
              <td className="p-4 text-center">
                <button 
                  onClick={() => handlePrescribeClick(app.patient)}
                  className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all font-semibold text-sm border border-blue-100 hover:border-blue-600"
                >
                  Prescribe
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Prescription Modal (Pop-up) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">Digital Prescription</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white text-xl">✖</button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-sm text-gray-500">Patient Name</p>
                <p className="font-bold text-gray-800 text-lg">{selectedPatient}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medicines</label>
                <textarea 
                  placeholder="E.g. Paracetamol 500mg - 1 Tab - Morning/Night" 
                  className="w-full border border-gray-200 rounded-xl p-3 h-24 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Advice</label>
                <input 
                  type="text" 
                  placeholder="Drink warm water, take rest..." 
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="px-5 py-2 rounded-xl text-gray-600 hover:bg-gray-200 transition-all font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  alert(`Prescription saved successfully for ${selectedPatient}!`);
                  setIsModalOpen(false);
                }} 
                className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-all font-bold flex items-center gap-2"
              >
                <span>💾</span> Save & Print
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentTable;