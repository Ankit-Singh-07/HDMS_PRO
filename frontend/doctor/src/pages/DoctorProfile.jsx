import React, { useState } from 'react';
import DoctorSidebar from '../components/DoctorSidebar'; // Changed from Sidebar to DoctorSidebar

const DoctorProfile = () => {
  // 1. Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  
  // PRO FEATURE: Toast Notification State
  const [toast, setToast] = useState({ show: false, message: "" });

  // 2. Profile Data State (Ab ye data change ho sakta hai)
  const [profileData, setProfileData] = useState({
    name: "Dr. Ankit Singh",
    specialization: "Senior General Physician",
    degree: "MBBS, MD (General Medicine)",
    license: "MED-2026-8890",
    experience: "8+ Years",
    email: "contact@drankit.com",
    phone: "+91 98765 43210",
    clinic: "Aashirwad Hospital, Near Main Square, New Delhi, India"
  });

  // Settings State
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  // 3. Handle Input Changes
  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  // 4. Save Changes Function
  const handleSave = () => {
    setIsEditing(false); // Edit mode band karein
    
    // Success Message (Toast) dikhayein
    setToast({ show: true, message: "Profile Updated Successfully! ✅" });
    setTimeout(() => setToast({ show: false, message: "" }), 3000); // 3 sec baad gayab
  };

  // Profile Card ke liye Initials nikalna (e.g. "Ankit Singh" -> "AS")
  const getInitials = (name) => {
    let parts = name.replace("Dr. ", "").split(" ");
    return parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
  };

  return (
    <div className="flex bg-gray-50 min-h-screen relative overflow-x-hidden max-w-[100vw]">
      <DoctorSidebar />
      {/* 🚀 Main Content (pt-24 lagaya hai taaki mobile navbar ke neeche overlap na ho) */}
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-24 md:pt-8 w-full md:w-[calc(100%-256px)] min-w-0 transition-all duration-300">
        
        {/* PRO FEATURE: Toast Notification */}
        {toast.show && (
          <div className="fixed top-5 right-5 px-6 py-3 rounded-xl shadow-2xl z-50 animate-in slide-in-from-top-5 fade-in duration-300 font-bold text-white bg-green-500 flex items-center gap-2">
            {toast.message}
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">My Profile</h1>
          <p className="text-gray-500 mt-1">Manage your personal information and clinic settings.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: ID Card & Quick Info */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Profile Card */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center relative overflow-hidden transition-all duration-300">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-blue-400"></div>
              
              <div className="relative mt-8">
                <div className="w-28 h-28 bg-white rounded-full mx-auto p-1.5 shadow-md">
                  <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-4xl font-bold text-blue-600 uppercase">
                    {getInitials(profileData.name)}
                  </div>
                </div>
                
                {isEditing ? (
                  <div className="mt-4 space-y-2">
                    <input type="text" name="name" value={profileData.name} onChange={handleChange} className="w-full text-center border-b-2 border-blue-400 p-1 text-xl font-bold text-gray-800 outline-none focus:bg-blue-50 transition-colors" placeholder="Full Name" />
                    <input type="text" name="specialization" value={profileData.specialization} onChange={handleChange} className="w-full text-center border-b border-gray-200 p-1 text-blue-600 font-medium outline-none focus:bg-blue-50 transition-colors" placeholder="Specialization" />
                    <input type="text" name="degree" value={profileData.degree} onChange={handleChange} className="w-full text-center border-b border-gray-200 p-1 text-sm text-gray-500 outline-none focus:bg-blue-50 transition-colors" placeholder="Degree" />
                  </div>
                ) : (
                  <div className="mt-4">
                    <h2 className="text-2xl font-bold text-gray-800 flex justify-center items-center gap-2">
                      {profileData.name} <span className="text-blue-500 text-lg" title="Verified Professional">✔️</span>
                    </h2>
                    <p className="text-blue-600 font-medium mt-1">{profileData.specialization}</p>
                    <p className="text-gray-400 text-sm mt-1">{profileData.degree}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-3 justify-center border-t border-gray-50 pt-6">
                {isEditing ? (
                  <>
                    <button onClick={() => setIsEditing(false)} className="bg-gray-100 text-gray-600 px-5 py-2 rounded-xl font-bold hover:bg-gray-200 transition-all text-sm">
                      Cancel
                    </button>
                    <button onClick={handleSave} className="bg-green-500 text-white px-5 py-2 rounded-xl font-bold hover:bg-green-600 shadow-md transition-all text-sm">
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="bg-blue-50 text-blue-600 px-8 py-2.5 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all text-sm w-full">
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Verification & License */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Professional Credential</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Medical License Number</p>
                  {isEditing ? (
                     <input type="text" name="license" value={profileData.license} onChange={handleChange} className="w-full border border-blue-300 rounded-lg p-2 font-mono text-gray-800 outline-none focus:ring-2 focus:ring-blue-100" />
                  ) : (
                    <p className="font-bold text-gray-800 font-mono bg-gray-50 p-2 rounded-lg border border-gray-100">{profileData.license}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Years of Experience</p>
                  {isEditing ? (
                     <input type="text" name="experience" value={profileData.experience} onChange={handleChange} className="w-full border border-blue-300 rounded-lg p-2 text-gray-800 outline-none focus:ring-2 focus:ring-blue-100" />
                  ) : (
                    <p className="font-bold text-gray-800 p-2">{profileData.experience}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Info & Settings */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Contact & Clinic Information */}
            <div className={`bg-white p-8 rounded-3xl border ${isEditing ? 'border-blue-200 shadow-blue-50' : 'border-gray-100'} shadow-sm transition-all duration-300`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <span>🏥</span> Clinic & Contact Details
                </h3>
                {isEditing && <span className="text-xs font-bold bg-blue-100 text-blue-600 px-3 py-1 rounded-full animate-pulse">EDIT MODE ON</span>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    type="text" 
                    name="email"
                    readOnly={!isEditing} 
                    value={profileData.email} 
                    onChange={handleChange}
                    className={`w-full border rounded-xl p-3 font-medium outline-none transition-all ${isEditing ? 'border-blue-300 bg-white focus:ring-2 focus:ring-blue-100 text-gray-800' : 'border-gray-200 bg-gray-50 text-gray-600'}`} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number</label>
                  <input 
                    type="text" 
                    name="phone"
                    readOnly={!isEditing} 
                    value={profileData.phone} 
                    onChange={handleChange}
                    className={`w-full border rounded-xl p-3 font-medium outline-none transition-all ${isEditing ? 'border-blue-300 bg-white focus:ring-2 focus:ring-blue-100 text-gray-800' : 'border-gray-200 bg-gray-50 text-gray-600'}`} 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Clinic Address</label>
                  <textarea 
                    name="clinic"
                    readOnly={!isEditing} 
                    value={profileData.clinic} 
                    onChange={handleChange}
                    className={`w-full border rounded-xl p-3 font-medium h-24 resize-none outline-none transition-all ${isEditing ? 'border-blue-300 bg-white focus:ring-2 focus:ring-blue-100 text-gray-800' : 'border-gray-200 bg-gray-50 text-gray-600'}`}
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>⚙️</span> Account Settings
              </h3>
              
              <div className="space-y-4">
                {/* Email Toggle */}
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div>
                    <h4 className="font-bold text-gray-800">Email Notifications</h4>
                    <p className="text-sm text-gray-500 mt-1">Receive daily patient summaries on email.</p>
                  </div>
                  <button 
                    onClick={() => setEmailAlerts(!emailAlerts)}
                    className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${emailAlerts ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${emailAlerts ? 'translate-x-7' : 'translate-x-1'}`}></div>
                  </button>
                </div>

                {/* SMS Toggle */}
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div>
                    <h4 className="font-bold text-gray-800">SMS Alerts</h4>
                    <p className="text-sm text-gray-500 mt-1">Get instant SMS for emergency appointments.</p>
                  </div>
                  <button 
                    onClick={() => setSmsAlerts(!smsAlerts)}
                    className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${smsAlerts ? 'bg-blue-600' : 'bg-gray-300'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${smsAlerts ? 'translate-x-7' : 'translate-x-1'}`}></div>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorProfile;