import React, { useState } from 'react';
import PatientSidebar from '../components/PatientSidebar';

const Billing = () => {
  // 🚀 Initial Dummy Data (Same as your screenshot)
  const [invoices, setInvoices] = useState([
    {
      id: 'INV-2026-001',
      title: 'Consultation - Dr. Rahul Verma',
      date: '10 MAR 2026',
      amount: 800,
      status: 'PAID',
    },
    {
      id: 'INV-2026-002',
      title: 'Blood Test & Lab Charges',
      date: '15 JAN 2026',
      amount: 1200,
      status: 'PAID',
    },
    {
      id: 'INV-2026-003',
      title: 'Upcoming Consultation - Dr. Ankit Singh',
      date: '12 MAR 2026',
      amount: 500,
      status: 'PENDING',
    }
  ]);

  // Payment Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('idle'); // idle, processing, success

  // 💳 Handle Payment Click
  const handlePayNow = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
    setPaymentStatus('processing');

    // Simulate Payment Processing Time (2.5 seconds)
    setTimeout(() => {
      setPaymentStatus('success');
      
      // Update the invoice status to PAID after success
      setTimeout(() => {
        setInvoices(prevInvoices => 
          prevInvoices.map(inv => 
            inv.id === invoice.id ? { ...inv, status: 'PAID' } : inv
          )
        );
        setIsModalOpen(false); // Close modal
      }, 1500); // Wait 1.5s after success before closing

    }, 2500);
  };

  // 📄 Handle Receipt Download
  const handleDownloadReceipt = (invoice) => {
    const receiptText = `
    ======================================
              HDMS PRO - RECEIPT
    ======================================
    Invoice No : ${invoice.id}
    Date       : ${invoice.date}
    Patient    : Ankit Singh
    --------------------------------------
    Description: ${invoice.title}
    Amount Paid: Rs. ${invoice.amount}/-
    Status     : ${invoice.status}
    --------------------------------------
    Thank you for choosing HDMS PRO.
    ======================================
    `;
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${invoice.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative overflow-x-hidden max-w-[100vw]">
      <PatientSidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-24 md:pt-8 w-full transition-all duration-300">
        
        {/* Header Section */}
        <header className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Billing & Payments</h1>
          <p className="text-gray-500 text-sm mt-1">View your past transactions and pending dues.</p>
        </header>

        {/* Invoice List Section */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span>💳</span> Invoice History
          </h3>

          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all gap-4">
                
                {/* Left Side: Icon & Details */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${invoice.status === 'PAID' ? 'bg-green-50 text-green-500' : 'bg-orange-50 text-orange-500'}`}>
                    {invoice.status === 'PAID' ? '✓' : '⏳'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{invoice.title}</h4>
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">
                      {invoice.id} • {invoice.date}
                    </p>
                  </div>
                </div>

                {/* Right Side: Amount & Action Button */}
                <div className="flex items-center justify-between w-full md:w-auto gap-6 md:gap-8">
                  <div className="text-right">
                    <h3 className="text-xl font-extrabold text-gray-800">₹{invoice.amount}</h3>
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest ${invoice.status === 'PAID' ? 'text-green-600' : 'text-orange-500'}`}>
                      {invoice.status}
                    </span>
                  </div>

                  {invoice.status === 'PAID' ? (
                    <button 
                      onClick={() => handleDownloadReceipt(invoice)}
                      className="bg-teal-50 text-teal-600 font-bold px-4 py-2 rounded-lg hover:bg-teal-100 transition-colors flex items-center gap-2 text-sm"
                    >
                      Receipt <span>⬇️</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => handlePayNow(invoice)}
                      className="bg-gray-900 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-gray-800 transition-all shadow-md active:scale-95 text-sm whitespace-nowrap"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 🚀 PAYMENT MODAL (POPUP) */}
      {isModalOpen && selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden p-8 text-center animate-in zoom-in-95 duration-200">
            
            {paymentStatus === 'processing' ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Processing Payment</h3>
                <p className="text-sm text-gray-500 font-medium">Please do not close or refresh this page.</p>
                <div className="mt-6 p-4 bg-gray-50 rounded-xl w-full text-left">
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">Paying for</p>
                  <p className="font-bold text-gray-800">{selectedInvoice.title}</p>
                  <p className="text-lg font-extrabold text-teal-600 mt-2">₹{selectedInvoice.amount}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center animate-in zoom-in-50 duration-300">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
                <p className="text-sm text-gray-500 font-medium">Your invoice has been marked as paid.</p>
                <p className="text-sm font-bold text-gray-400 mt-6 animate-pulse">Redirecting...</p>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;