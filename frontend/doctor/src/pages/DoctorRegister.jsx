import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Navigation ke liye

const DoctorRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    specialization: "",
    license: "",
    experience: "",
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1=form, 2=otp
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* =====================
     INPUT HANDLER
  ===================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* =====================
     STEP 1: SEND EMAIL OTP
  ===================== */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (
      !form.name || !form.email || !form.phone || !form.password ||
      !form.specialization || !form.license || !form.experience
    ) {
      setError("All fields are required ❌");
      return;
    }
    if (!emailRegex.test(form.email)) {
      setError("Invalid email address ❌");
      return;
    }
    if (!phoneRegex.test(form.phone)) {
      setError("Invalid phone number ❌");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters ❌");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("https://hdms-backend-7j7w.onrender.com/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to send OTP ❌");
        return;
      }

      setStep(2);
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     STEP 2: VERIFY OTP + REGISTER
  ===================== */
  const verifyOtpAndRegister = async () => {
    if (otp.length !== 6) {
      setError("Enter a valid 6-digit OTP ❌");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ✅ VERIFY OTP
      const verifyRes = await fetch("https://hdms-backend-7j7w.onrender.com/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp: String(otp) }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setError(verifyData.message || "OTP verification failed ❌");
        return;
      }

      // ✅ REGISTER DOCTOR
      const registerRes = await fetch("https://hdms-backend-7j7w.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: "doctor",
          specialization: form.specialization,
          license: form.license,
          experience: form.experience,
          phone: form.phone,
        }),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        setError(registerData.message || "Registration failed ❌");
        return;
      }

      alert("Doctor registered successfully ✅");
      navigate("/login"); // React Router se navigate karein

    } catch (err) {
      console.error(err);
      setError("OTP verification failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 relative overflow-hidden py-12">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100 z-10 relative animate-in fade-in zoom-in duration-500">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl mx-auto flex items-center justify-center mb-5 shadow-lg shadow-blue-200">
            <span className="text-3xl text-white font-bold">H</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Doctor <span className="text-blue-600">Registration</span>
          </h2>
          <p className="text-gray-500 mt-2 font-medium">Create your professional account to manage patients.</p>
        </div>

        {/* Error Message Box */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-bold rounded-xl text-center animate-pulse">
            {error}
          </div>
        )}

        {/* ===== STEP 1: FORM ===== */}
        {step === 1 && (
          <form onSubmit={handleRegister} className="space-y-6">
            
            {/* Personal Details - Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors" placeholder="Dr. John Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors" placeholder="doctor@hospital.com" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors" placeholder="9876543210" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-colors" placeholder="••••••••" />
              </div>
            </div>

            {/* Professional Details Section */}
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
              <h4 className="text-blue-800 font-bold mb-4 flex items-center gap-2"><span>🩺</span> Professional Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <input name="specialization" value={form.specialization} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-colors text-sm" placeholder="Specialization (e.g. Cardiology)" />
                </div>
                <div>
                  <input name="license" value={form.license} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-colors text-sm" placeholder="License Number" />
                </div>
                <div>
                  <input name="experience" type="number" value={form.experience} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-colors text-sm" placeholder="Experience (Years)" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 active:scale-95 disabled:bg-blue-400 disabled:cursor-not-allowed">
              {loading ? "Sending OTP to Email..." : "Continue to Verify ➔"}
            </button>
          </form>
        )}

        {/* ===== STEP 2: OTP ===== */}
        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right-10 duration-500 text-center py-4">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <span className="text-4xl">✉️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Verify your Email</h3>
            <p className="text-gray-500">We've sent a 6-digit OTP to <span className="font-bold text-blue-600">{form.email}</span></p>

            <div className="max-w-xs mx-auto mt-6">
              <input
                type="text"
                maxLength="6"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Sirf numbers allow karega
                className="w-full text-center text-2xl tracking-[0.5em] font-bold px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none bg-gray-50 focus:bg-white transition-all"
              />
            </div>

            <button onClick={verifyOtpAndRegister} disabled={loading} className="w-full max-w-xs mx-auto block bg-green-500 text-white font-bold py-3.5 rounded-xl hover:bg-green-600 transition-all shadow-lg hover:shadow-green-200 active:scale-95 disabled:bg-green-400 mt-6">
              {loading ? "Verifying..." : "Verify & Complete Registration"}
            </button>
            
            <button onClick={() => setStep(1)} className="text-sm font-bold text-gray-500 hover:text-blue-600 mt-4 transition-colors">
              Wrong email? Go back
            </button>
          </div>
        )}

        <p className="mt-8 text-center text-xs text-gray-400 font-medium">
          * Note: Your account will require admin approval before you can access the dashboard.
        </p>
        
        {step === 1 && (
          <p className="mt-4 text-center text-sm text-gray-600 border-t border-gray-100 pt-6">
            Already have an account?{" "}
            <span onClick={() => navigate('/login')} className="font-bold text-blue-600 hover:text-blue-500 cursor-pointer transition-colors">
              Sign in here
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default DoctorRegister;