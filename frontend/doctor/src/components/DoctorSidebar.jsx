import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const DoctorSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 🔥 Mobile menu ko open/close karne ka state
  const [isOpen, setIsOpen] = useState(false);

  // Logout Function
  const handleLogout = () => {
    localStorage.clear();
    navigate('/'); // Login page par bhej dega
  };

  // Navbar ke Menu Items
  const navItems = [
    { name: 'Dashboard', icon: '🏠', path: '/doctor-dashboard' },
    { name: 'Appointments', icon: '📅', path: '/appointments' },
    { name: 'My Patients', icon: '👥', path: '/patients' },
    { name: 'Reports', icon: '📊', path: '/reports' },
    { name: 'My Profile', icon: '👤', path: '/profile' }
  ];

  return (
    <>
      {/* 📱 MOBILE TOP NAVBAR (Sirf phone par dikhega) */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-[#0a192f] text-white z-50 flex justify-between items-center p-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 text-white font-bold rounded flex items-center justify-center">H</div>
          <h2 className="text-xl font-black tracking-tight">HDMS <span className="text-white">PRO</span></h2>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-2xl p-1 focus:outline-none"
        >
          ☰
        </button>
      </div>

      {/* 🖥️ MAIN SIDEBAR (Desktop par hamesha, Mobile par slide hoga) */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#0a192f] text-white flex flex-col z-40 shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        
        {/* Logo Section (Sirf desktop par) */}
        <div className="p-6 mb-4 hidden md:block">
          <h2 className="text-2xl font-black text-teal-400 tracking-tight">HDMS <span className="text-white">PRO</span></h2>
          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Doctor Panel</p>
        </div>
        
        {/* Navigation Links (Mobile par thoda margin top chahiye navbar ke liye) */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-20 md:mt-0">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <button
                key={item.name}
                onClick={() => { 
                  navigate(item.path); 
                  setIsOpen(false); // Mobile pe click karne ke baad menu band ho jaye
                }}
                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl font-bold transition-all"
          >
            <span className="text-lg">🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* 🌑 BLACK OVERLAY (Jab mobile par menu khulega toh background thoda kala ho jayega) */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm transition-opacity"
        ></div>
      )}
    </>
  );
};

export default DoctorSidebar;