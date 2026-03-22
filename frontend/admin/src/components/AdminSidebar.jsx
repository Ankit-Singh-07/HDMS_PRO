import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("Super Admin");
  
  // 🔥 NAYA: Mobile Sidebar State
  const [isOpen, setIsOpen] = useState(false); 

  useEffect(() => {
    const storedUser = localStorage.getItem('user'); 
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.name) {
          setAdminName(parsedUser.name);
        }
      } catch (error) {
        console.error("User error:", error);
      }
    }
  }, []);

  const avatarInitial = adminName.charAt(0).toUpperCase();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Kya aap sach mein logout karna chahte hain?");
    if (confirmLogout) {
      localStorage.clear(); 
      navigate('/'); 
    }
  };

  // Mobile menu band karne ka function
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          #admin-sidebar, #mobile-nav { display: none !important; }
          main { margin-left: 0 !important; width: 100% !important; max-width: 100% !important; padding: 0 !important; }
        }
      `}} />

      {/* 📱 MOBILE TOP NAVBAR (Sirf chhote screen par dikhega) */}
      <div id="mobile-nav" className="md:hidden fixed top-0 left-0 w-full bg-[#0f172a] text-white p-4 flex justify-between items-center z-50 shadow-lg">
        <h1 className="text-xl font-black flex items-center gap-1">
          HDMS<span className="text-indigo-500">PRO</span>
        </h1>
        <button onClick={() => setIsOpen(!isOpen)} className="text-3xl focus:outline-none active:scale-90 transition-transform">
          {isOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* 📱 MOBILE OVERLAY (Dark background jab menu khule) */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity" 
          onClick={closeSidebar}
        ></div>
      )}

      {/* 💻 MAIN SIDEBAR (Desktop par fixed, Mobile par slide hoga) */}
      <aside id="admin-sidebar" className={`w-64 bg-[#0f172a] h-screen fixed top-0 left-0 flex flex-col shadow-2xl z-50 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        
        <div className="p-6 hidden md:block">
          <h1 className="text-2xl font-black text-white tracking-wider flex items-center gap-2">
            HDMS<span className="text-indigo-500">PRO</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-bold tracking-[0.2em] mt-1 uppercase">Admin Control</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 md:mt-0 overflow-y-auto">
          <NavLink to="/admin/dashboard" onClick={closeSidebar} className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <span className="text-xl">📊</span> Overview
          </NavLink>
          
          <NavLink to="/admin/doctors" onClick={closeSidebar} className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <span className="text-xl">👨‍⚕️</span> Manage Doctors
          </NavLink>

          <NavLink to="/admin/doctor-approvals" onClick={closeSidebar} className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <span className="text-xl">✅</span> Approvals
            <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">NEW</span>
          </NavLink>

          <NavLink to="/admin/patients" onClick={closeSidebar} className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <span className="text-xl">🏥</span> Manage Patients
          </NavLink>

          <NavLink to="/admin/appointments" onClick={closeSidebar} className={({isActive}) => `flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <span className="text-xl">🗓️</span> Appointments
          </NavLink>
        </nav>

        {/* 👑 BOTTOM PROFILE SECTION */}
        <div className="p-4 border-t border-slate-800/50">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg text-lg">
              {avatarInitial}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{adminName}</p>
              <p className="text-xs text-slate-500 font-medium">System Owner</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all active:scale-95"
          >
            <span className="text-lg">🚪</span> Logout System
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;