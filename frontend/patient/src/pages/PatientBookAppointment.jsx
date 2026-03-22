import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PatientSidebar from '../components/PatientSidebar';

const PatientBookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const timeSlots = ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "05:00 PM", "05:30 PM", "06:00 PM"];

  // 🚀 Naye States add kiye hain Patient Name aur Problem ke liye
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [patientName, setPatientName] = useState(""); // Naya state
  const [problem, setProblem] = useState(""); // Naya state
  
  const [toast, setToast] = useState({ show: false, message: "" });
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/doctors-list");
        setDoctors(res.data);
      } catch (err) {
        console.error("Failed to fetch doctors", err);
      }
    };
    fetchDoctors();
    
    // Default name set karna (agar khud ke liye kar raha hai)
    const userStr = localStorage.getItem("user");
    if(userStr) {
        try {
            const user = JSON.parse(userStr);
            setPatientName(user.name);
        } catch(e) {}
    }
  }, []);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedDate || !selectedTime || !patientName || !problem) {
      setToast({ show: true, message: "⚠️ Please fill all the details (Name, Problem, Doctor, Date, Time)!" });
      setTimeout(() => setToast({ show: false, message: "" }), 3000);
      return;
    }

    setIsBooking(true);
    try {
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("token"); 
      
      if (!userStr || !token) {
        setToast({ show: true, message: "⚠️ Please Logout and Login again!" });
        setIsBooking(false);
        return;
      }

      const user = JSON.parse(userStr);

      // 🚀 Backend ko ab customized Name aur Problem bhej rahe hain
      await axios.post("http://localhost:5000/api/appointments/book", {
        patientId: user._id || user.id, // Account ID wahi rahegi
        customPatientName: patientName, // Yahan Naya naam bhej rahe hain
        doctorId: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        reason: problem // Nayi problem bhej rahe hain
      }, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "x-auth-token": token 
        }
      });

      setToast({ show: true, message: "✅ Appointment Booked Successfully!" });
      setTimeout(() => {
        setToast({ show: false, message: "" });
        setSelectedDoctor(null); 
        setSelectedDate(""); 
        setSelectedTime("");
        setProblem(""); // Reset problem
        // Name ko wapas account holder ke naam pe set kar diya
        setPatientName(user.name);
      }, 3000);
      
    } catch (err) {
      console.error(err);
      setToast({ show: true, message: "❌ Failed to book appointment. Try again." });
      setTimeout(() => setToast({ show: false, message: "" }), 3000);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative overflow-x-hidden max-w-[100vw]">
      <PatientSidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-24 md:pt-8 w-full md:w-[calc(100%-256px)] min-w-0 transition-all duration-300">
        
        {toast.show && (
          <div className={`fixed top-5 right-5 px-6 py-3 rounded-xl shadow-2xl z-50 animate-in slide-in-from-top-5 fade-in duration-300 font-bold text-white flex items-center gap-2 ${toast.message.includes('✅') ? 'bg-teal-500' : 'bg-red-500'}`}>
            {toast.message}
          </div>
        )}

        <header className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">Book an Appointment</h1>
          <p className="text-gray-500 text-sm mt-1">Select your preferred doctor and time slot.</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          <div className="xl:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><span>👨‍⚕️</span> Step 1: Choose a Doctor</h2>
            
            {doctors.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-gray-100 shadow-sm text-gray-500 font-bold">
                Loading doctors...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map((doc) => (
                  <div 
                    key={doc._id} 
                    onClick={() => setSelectedDoctor(doc._id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${selectedDoctor === doc._id ? 'border-teal-500 bg-teal-50 shadow-md transform scale-[1.02]' : 'border-gray-100 bg-white hover:border-teal-200 hover:shadow-sm'}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center font-bold text-xl uppercase">
                          {doc.name ? doc.name.charAt(0) : "D"}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{doc.name}</h3>
                          <p className="text-xs text-teal-600 font-bold">{doc.specialization || "General Physician"}</p>
                        </div>
                      </div>
                      <span className="bg-yellow-50 text-yellow-600 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">⭐ 4.8</span>
                    </div>
                    
                    <div className="flex justify-between items-center border-t border-gray-100/50 pt-3 mt-2">
                      <p className="text-xs text-gray-500 font-medium">Experience: <span className="text-gray-800 font-bold">{doc.experience || "5+ Years"}</span></p>
                      <p className="text-xs text-gray-500 font-medium">Fee: <span className="text-teal-600 font-extrabold">{doc.fee ? `₹${doc.fee}` : "₹500"}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="xl:col-span-1 space-y-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><span>📅</span> Step 2: Details & Time</h2>
            
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              
              {/* 🚀 NAYE INPUT BOXES YAHAN HAIN */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Patient Name</label>
                <input 
                  type="text" 
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Rahul Kumar"
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-100 focus:border-teal-500 outline-none transition-all text-gray-700 font-medium bg-gray-50 focus:bg-white"
                />
              </div>

              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Health Problem / Reason</label>
                <input 
                  type="text" 
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="e.g. Viral Fever since 2 days"
                  className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-teal-100 focus:border-teal-500 outline-none transition-all text-gray-700 font-medium bg-gray-50 focus:bg-white"
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Date</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full border-2 border-gray-100 rounded-xl p-3 focus:ring-0 focus:border-teal-500 outline-none transition-colors text-gray-700 font-medium bg-gray-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Available Slots</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${selectedTime === time ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300 hover:bg-teal-50'}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 border-t border-gray-100 pt-6">
                <button 
                  onClick={handleBookAppointment}
                  disabled={isBooking}
                  className="w-full bg-teal-600 text-white font-bold py-3.5 rounded-xl hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-200 active:scale-95 flex justify-center items-center gap-2 disabled:opacity-70 disabled:active:scale-100"
                >
                  {isBooking ? 'Booking...' : 'Confirm Booking ➔'}
                </button>
                <p className="text-center text-[10px] text-gray-400 mt-3 font-medium uppercase tracking-widest">Pay at Clinic</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PatientBookAppointment;