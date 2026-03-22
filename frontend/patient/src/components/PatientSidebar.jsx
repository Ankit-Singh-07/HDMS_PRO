import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // 🛑 FIX: Yahan se 'Link' ko hata diya

const PatientSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path ? "bg-teal-600 text-white shadow-lg" : "text-gray-400 hover:bg-white/10 hover:text-white";

  const handleLogout = () => {
    const confirmLogout = window.confirm("Kya aap sach mein logout karna chahte hain?");
    if (confirmLogout) {
      localStorage.clear(); 
      navigate('/'); 
    }
  };

  const closeMenu = () => setIsOpen(false);

  const handleNavigation = (path) => {
    navigate(path);
    closeMenu();
  };

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 w-full bg-[#0a2540] text-white p-4 flex justify-between items-center z-40 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center font-bold">H</div>
          <h2 className="text-xl font-bold text-teal-400 tracking-wider">HDMS<span className="text-white">PRO</span></h2>
        </div>
        <button onClick={() => setIsOpen(true)} className="text-2xl focus:outline-none p-1 bg-white/10 rounded-lg">☰</button>
      </div>

      {isOpen && <div className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={closeMenu}></div>}

      <div className={`fixed inset-y-0 left-0 w-64 bg-[#0a2540] p-6 text-white flex flex-col z-50 transform transition-transform duration-300 shadow-2xl md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="mb-10 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-teal-400">HDMS PRO</h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Patient Portal</p>
          </div>
          <button onClick={closeMenu} className="md:hidden text-gray-400 hover:text-white bg-white/5 p-2 rounded-lg">✕</button>
        </div>
        
       <nav className="space-y-2 flex-1 overflow-y-auto pr-2">
         <button onClick={() => handleNavigation('/dashboard')} className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all ${isActive('/dashboard')}`}>
           🏠 <span>My Dashboard</span>
         </button>
         
         <button onClick={() => handleNavigation('/patient/book-appointment')} className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all ${isActive('/patient/book-appointment')}`}>
           📅 <span>Book Appointment</span>
         </button>
         
         <button onClick={() => handleNavigation('/reports')} className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all ${isActive('/reports')}`}>
           📄 <span>Medical Records</span>
         </button>

         <button onClick={() => handleNavigation('/billing')} className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all ${isActive('/billing')}`}>
           💳 <span>Billing & Payments</span>
         </button>

         <button onClick={() => handleNavigation('/profile')} className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all ${isActive('/profile')}`}>
           👤 <span>My Profile</span>
         </button>
       </nav>

        <div className="pt-6 border-t border-gray-800 mt-2">
          <button onClick={handleLogout} className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-400/10 w-full rounded-xl transition-all text-left">
            🚪 <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default PatientSidebar;