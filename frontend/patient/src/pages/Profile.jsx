import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PatientSidebar from '../components/PatientSidebar';

const Profile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile State
  const [profile, setProfile] = useState({
    name: 'Ankit Singh',
    email: '',
    phone: '',
    address: '',
    emergencyContact: '',
    dob: '',
    bloodGroup: 'B+',
    weight: '',
    height: '',
    bp: '',
    patientId: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return navigate('/');
        const user = JSON.parse(userStr);
        const ptId = user._id || user.id;

        // Dashboard wale route se hi purana data utha lenge
        const res = await axios.get(`http://localhost:5000/api/patient/dashboard-data/${ptId}`);
        const data = res.data;

        setProfile({
          name: data.name || user.name,
          email: user.email,
          phone: data.phone || '',
          address: data.address || 'Varanasi, Uttar Pradesh, India',
          emergencyContact: data.emergencyContact || '',
          dob: data.dob || '01 Jan 2005',
          bloodGroup: data.vitals?.bloodGroup || 'B+',
          weight: data.vitals?.weight || '',
          height: data.vitals?.height || '',
          bp: data.vitals?.bp || '',
          patientId: `#PT-${ptId.substring(ptId.length - 4).toUpperCase()}` // Generate short ID
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile", err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const userStr = localStorage.getItem('user');
      const user = JSON.parse(userStr);
      const ptId = user._id || user.id;

      // Backend API call
      await axios.put(`http://localhost:5000/api/patient/update-profile/${ptId}`, profile);
      
      setIsEditing(false);
      setSaving(false);
      
      // Chota sa alert takki user ko pata chale save ho gaya
      alert("Profile and Vitals updated successfully! Check your Dashboard.");
    } catch (err) {
      console.error("Error saving profile", err);
      alert("Failed to update profile.");
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-teal-600 font-bold">Loading Profile... ⏳</div>;

  return (
    <div className="flex min-h-screen bg-gray-50 relative overflow-x-hidden max-w-[100vw]">
      <PatientSidebar />

      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-24 md:pt-8 w-full transition-all duration-300">
        
        <header className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">My Profile</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your personal and medical information.</p>
          </div>
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="border-2 border-teal-50 bg-white text-teal-600 font-bold px-6 py-2 rounded-xl hover:bg-teal-50 transition-colors flex items-center gap-2"
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button 
                onClick={() => setIsEditing(false)}
                className="bg-gray-100 text-gray-600 font-bold px-4 py-2 rounded-xl hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="bg-teal-600 text-white font-bold px-6 py-2 rounded-xl hover:bg-teal-700 shadow-md"
              >
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar & Vitals */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 text-white rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4 shadow-lg shadow-teal-200">
                {profile.name.charAt(0)}
              </div>
              <h2 className="text-2xl font-extrabold text-gray-800">{profile.name}</h2>
              <p className="text-teal-600 font-bold text-sm mt-1">Patient ID: {profile.patientId}</p>

              <div className="mt-8 border-t border-gray-100 pt-6 text-left space-y-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Blood Group</p>
                  {isEditing ? (
                    <select name="bloodGroup" value={profile.bloodGroup} onChange={handleChange} className="mt-1 w-full border border-gray-200 rounded-lg p-2 outline-none focus:border-teal-500">
                      <option value="A+">A+</option><option value="A-">A-</option>
                      <option value="B+">B+</option><option value="B-">B-</option>
                      <option value="O+">O+</option><option value="O-">O-</option>
                      <option value="AB+">AB+</option><option value="AB-">AB-</option>
                    </select>
                  ) : (
                    <p className="font-bold text-red-500 text-lg flex items-center gap-2">🩸 {profile.bloodGroup}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Date of Birth</p>
                  {isEditing ? (
                    <input type="text" name="dob" value={profile.dob} onChange={handleChange} className="mt-1 w-full border border-gray-200 rounded-lg p-2 outline-none focus:border-teal-500" />
                  ) : (
                    <p className="font-bold text-gray-800 flex items-center gap-2">🎂 {profile.dob}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Info & Dashboard Vitals input */}
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Email Address</p>
                  <p className="font-bold text-gray-800">{profile.email} <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded ml-2">Verified</span></p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Phone Number</p>
                  {isEditing ? <input type="text" name="phone" value={profile.phone} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-md p-1 outline-none" placeholder="+91..." /> : <p className="font-bold text-gray-800">{profile.phone || 'Not provided'}</p>}
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 md:col-span-2">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Residential Address</p>
                  {isEditing ? <input type="text" name="address" value={profile.address} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-md p-1 outline-none" /> : <p className="font-bold text-gray-800">{profile.address || 'Not provided'}</p>}
                </div>
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 md:col-span-2">
                  <p className="text-xs font-bold text-red-400 uppercase mb-1">Emergency Contact</p>
                  {isEditing ? <input type="text" name="emergencyContact" value={profile.emergencyContact} onChange={handleChange} className="w-full bg-white border border-red-200 rounded-md p-1 outline-none" placeholder="Emergency Phone..." /> : <p className="font-bold text-red-600">📞 {profile.emergencyContact || 'Not provided'}</p>}
                </div>
              </div>
            </div>

            {/* Dashboard Vitals Setup */}
            <div className={`bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-opacity ${!isEditing ? 'opacity-50 grayscale' : ''}`}>
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-gray-800">Health Measurements</h3>
                {!isEditing && <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded">Click Edit to Update</span>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Weight (kg)</p>
                  {isEditing ? <input type="number" name="weight" value={profile.weight} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-md p-1 outline-none" placeholder="e.g. 70" /> : <p className="font-bold text-gray-800">{profile.weight || '--'} kg</p>}
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Height (cm)</p>
                  {isEditing ? <input type="number" name="height" value={profile.height} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-md p-1 outline-none" placeholder="e.g. 175" /> : <p className="font-bold text-gray-800">{profile.height || '--'} cm</p>}
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Blood Pressure</p>
                  {isEditing ? <input type="text" name="bp" value={profile.bp} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-md p-1 outline-none" placeholder="e.g. 120/80" /> : <p className="font-bold text-gray-800">{profile.bp || '--/--'}</p>}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;