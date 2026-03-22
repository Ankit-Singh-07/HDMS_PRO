import React from 'react';
import PatientSidebar from '../components/PatientSidebar';

const Reports = () => {
  // Dummy Data for Reports & Prescriptions
  const labReports = [
    { id: 1, name: "Complete Blood Count (CBC)", date: "10 Mar 2026", lab: "Dr. Lal PathLabs", status: "Available" },
    { id: 2, name: "Lipid Profile Test", date: "15 Jan 2026", lab: "City Diagnostic Center", status: "Available" },
  ];

  const prescriptions = [
    { id: 1, doctor: "Dr. Ankit Singh", diagnosis: "Viral Fever", date: "12 Mar 2026", medicines: "Paracetamol, Vitamin C" },
    { id: 2, doctor: "Dr. Rahul Verma", diagnosis: "Routine Checkup", date: "20 Dec 2025", medicines: "Multivitamins" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 relative overflow-x-hidden max-w-[100vw]">
      {/* Sidebar import kar liya taaki design same rahe */}
      <PatientSidebar />

      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-24 md:pt-8 w-full md:w-[calc(100%-256px)] min-w-0 transition-all duration-300">
        
        {/* Header */}
        <header className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Medical Records</h1>
            <p className="text-gray-500 text-sm mt-1">Access all your lab reports and past prescriptions here.</p>
          </div>
          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-2xl shadow-sm">
            📄
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT: Lab Reports Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><span>🔬</span> Lab Reports</h2>
            
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              {labReports.map((report) => (
                <div key={report.id} className="p-4 rounded-2xl border border-gray-100 hover:border-teal-300 hover:shadow-md transition-all bg-gray-50 hover:bg-white group">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-lg">🧪</div>
                      <div>
                        <h3 className="font-bold text-gray-800">{report.name}</h3>
                        <p className="text-xs text-gray-500 font-medium">{report.lab}</p>
                      </div>
                    </div>
                    <span className="bg-green-100 text-green-700 text-[10px] font-extrabold px-2 py-1 rounded-md uppercase tracking-wider">{report.status}</span>
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-400">{report.date}</p>
                    <button className="text-sm font-bold text-teal-600 hover:text-teal-800 flex items-center gap-1 group-hover:underline">
                      ⬇️ Download PDF
                    </button>
                  </div>
                </div>
              ))}

              {labReports.length === 0 && (
                <p className="text-center text-gray-400 py-4 font-medium">No lab reports found.</p>
              )}
            </div>
          </div>

          {/* RIGHT: Past Prescriptions Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><span>💊</span> Past Prescriptions</h2>
            
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              {prescriptions.map((rx) => (
                <div key={rx.id} className="p-4 rounded-2xl border border-gray-100 hover:border-teal-300 hover:shadow-md transition-all bg-gray-50 hover:bg-white">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-800 text-lg">{rx.diagnosis}</h3>
                    <span className="text-xs font-bold text-gray-400 bg-white border border-gray-200 px-2 py-1 rounded-md">{rx.date}</span>
                  </div>
                  <p className="text-sm text-teal-600 font-bold mb-3">By {rx.doctor}</p>
                  
                  <div className="bg-white p-3 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Prescribed Medicines</p>
                    <p className="text-sm text-gray-700 font-medium">{rx.medicines}</p>
                  </div>

                  <button className="w-full mt-4 py-2 border-2 border-teal-100 text-teal-600 font-bold rounded-xl hover:bg-teal-50 transition-colors text-sm">
                    View Full Prescription
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Reports;