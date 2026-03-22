import React from 'react';
import Sidebar from '../components/Sidebar';
import StatsCards from '../components/StatsCards';
import AppointmentTable from '../components/AppointmentTable';

const DoctorDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50"> 
      
      {/* Sidebar ab apne aap mobile aur desktop dono layouts handle karega */}
      <Sidebar /> 

      {/* MAIN CONTENT WRAPPER - Mobile par full width aur margin-top, Desktop par ml-64 */}
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-24 md:pt-8 w-full md:w-[calc(100%-256px)] overflow-x-hidden transition-all duration-300">
        
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4 bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Doctor Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Welcome back! Here is your schedule for today.</p>
          </div>
          
          <div className="flex items-center gap-2 text-blue-600 font-semibold bg-blue-50 px-4 py-2 rounded-xl shadow-sm border border-blue-100">
            <span className="text-lg">📅</span>
            {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
          </div>
        </header>

        <section className="mb-8">
          <StatsCards />
        </section>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 md:p-6 border-b border-gray-50 bg-white">
            <h2 className="text-xl font-bold text-gray-800">Today's Appointments</h2>
          </div>
          <div className="overflow-x-auto w-full">
            <AppointmentTable />
          </div>
        </div>
        
      </main>
    </div>
  );
};

export default DoctorDashboard;