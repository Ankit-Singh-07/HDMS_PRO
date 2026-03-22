import React from 'react';
import Sidebar from '../components/Sidebar';

const Reports = () => {
  const revenueData = [
    { month: "Jan", amount: 65, label: "₹65k", color: "linear-gradient(to top, #3b82f6, #67e8f9)" }, 
    { month: "Feb", amount: 80, label: "₹80k", color: "linear-gradient(to top, #a855f7, #f472b6)" }, 
    { month: "Mar", amount: 100, label: "₹1L", color: "linear-gradient(to top, #10b981, #2dd4bf)" }, 
    { month: "Apr", amount: 45, label: "₹45k", color: "linear-gradient(to top, #f97316, #fcd34d)" }, 
    { month: "May", amount: 90, label: "₹90k", color: "linear-gradient(to top, #6366f1, #3b82f6)" }, 
    { month: "Jun", amount: 120, label: "₹1.2L", color: "linear-gradient(to top, #f43f5e, #fb7185)" }, 
  ];

  const treatmentsData = [
    { name: "General Checkup", percentage: 45, color: "#3b82f6" },
    { name: "Viral Fever", percentage: 30, color: "#10b981" },
    { name: "Orthopedic", percentage: 15, color: "#a855f7" },
    { name: "Cardiology", percentage: 10, color: "#ef4444" },
  ];

  const handleDownloadPDF = () => {
    window.print(); 
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <div className="print:hidden">
        <Sidebar />
      </div>

      {/* FIXED OVERLAP HERE: Added pt-24 for mobile top spacing */}
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-24 md:pt-8 w-full md:w-[calc(100%-256px)] overflow-x-hidden transition-all duration-300 print:ml-0 print:p-0 print:pt-0">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 print:hidden">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Analytics & Reports</h1>
            <p className="text-gray-500 mt-1">Track your clinic's performance and patient trends.</p>
          </div>
          <button 
            onClick={handleDownloadPDF}
            className="bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl font-bold shadow-sm hover:bg-gray-50 hover:text-blue-600 transition-all flex items-center gap-2 active:scale-95"
          >
            <span>📥</span> Download PDF Report
          </button>
        </header>

        <div className="hidden print:block mb-8 text-center border-b pb-4">
          <h1 className="text-4xl font-bold text-gray-800">HDMS Medical Report</h1>
          <p className="text-gray-500 mt-2">Generated on: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-3xl text-white shadow-lg shadow-blue-200 hover:-translate-y-1 transition-transform print:shadow-none print:border print:text-black print:bg-none print:bg-white">
            <div className="flex justify-between items-center mb-4">
              <span className="text-3xl bg-white/20 p-3 rounded-2xl print:bg-gray-100">💰</span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold print:bg-gray-100 print:text-green-600">+15%</span>
            </div>
            <p className="text-blue-100 font-medium text-sm uppercase tracking-wider print:text-gray-500">Total Revenue</p>
            <h2 className="text-3xl font-extrabold mt-1">₹4,52,000</h2>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform print:shadow-none">
            <div className="flex justify-between items-center mb-4">
              <span className="text-3xl bg-green-50 p-3 rounded-2xl">📈</span>
              <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-bold">+8%</span>
            </div>
            <p className="text-gray-400 font-medium text-sm uppercase tracking-wider">Patient Growth</p>
            <h2 className="text-3xl font-extrabold text-gray-800 mt-1">1,240</h2>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:-translate-y-1 transition-transform print:shadow-none">
            <div className="flex justify-between items-center mb-4">
              <span className="text-3xl bg-purple-50 p-3 rounded-2xl">🧪</span>
              <span className="text-purple-600 bg-purple-50 px-3 py-1 rounded-full text-sm font-bold">12 Pending</span>
            </div>
            <p className="text-gray-400 font-medium text-sm uppercase tracking-wider">Lab Reports</p>
            <h2 className="text-3xl font-extrabold text-gray-800 mt-1">342</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm print:mb-8 print:shadow-none">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><span>📊</span> Revenue Overview (6 Months)</h3>
            
            <div className="h-64 flex items-end gap-2 sm:gap-6 justify-between mt-10 relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                <div className="border-b-2 border-dashed w-full h-1/4"></div>
                <div className="border-b-2 border-dashed w-full h-1/4"></div>
                <div className="border-b-2 border-dashed w-full h-1/4"></div>
                <div className="border-b-2 border-dashed w-full h-1/4"></div>
              </div>

              {revenueData.map((data, index) => (
                <div key={index} className="flex flex-col items-center flex-1 group z-10 h-full justify-end">
                  <span className="text-xs font-extrabold text-gray-700 mb-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 bg-white px-3 py-1 rounded-lg shadow-md border border-gray-100">
                    {data.label}
                  </span>
                  <div 
                    className="w-full max-w-[45px] rounded-t-xl transition-all duration-300 hover:scale-[1.05] shadow-sm"
                    style={{ 
                      height: `${(data.amount / 120) * 100}%`,
                      background: data.color 
                    }}
                  ></div>
                  <span className="text-sm font-bold text-gray-500 mt-3 group-hover:text-gray-800 transition-colors">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm print:shadow-none">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><span>🧬</span> Top Treatments</h3>
            <div className="space-y-6 mt-4">
              {treatmentsData.map((item, index) => (
                <div key={index} className="group">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{item.name}</span>
                    <span className="font-extrabold text-gray-400">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
                    <div 
                      className="h-3.5 rounded-full transition-all duration-1000 shadow-sm" 
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-blue-50/50 p-5 rounded-2xl border border-blue-100 flex gap-4 items-start print:hidden">
              <span className="text-2xl drop-shadow-sm">💡</span>
              <div>
                <h4 className="font-extrabold text-blue-800 text-sm tracking-wide uppercase">AI Insight</h4>
                <p className="text-sm text-blue-700 mt-1 font-medium leading-relaxed">General checkups have increased by 15% this month. Consider opening a new slot for routine visits on weekends to maximize revenue.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;