import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const PatientRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("form"); // form | otp
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* =====================
     INPUT HANDLER
  ===================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* =====================
     SEND EMAIL OTP
  ===================== */
  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required ❌");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters ❌");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/otp/send", { email: form.email });
      setStep("otp");
    } catch {
      setError("Failed to send OTP. Email might be invalid ❌");
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     VERIFY OTP & REGISTER
  ===================== */
  const verifyOtpAndRegister = async () => {
    if (otp.length !== 6) {
      setError("Enter valid 6-digit OTP ❌");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ verify OTP
      await axios.post("http://localhost:5000/api/otp/verify", {
        email: form.email,
        otp,
      });

      // 2️⃣ register patient
      await axios.post("http://localhost:5000/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: "patient",
      });

      alert("Patient registered successfully ✅");
      navigate("/"); // 👈 Wapas Login page par bheje
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 relative overflow-hidden py-12">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100 z-10 relative animate-in fade-in zoom-in duration-500">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl mx-auto flex items-center justify-center mb-5 shadow-lg shadow-teal-200">
            <span className="text-3xl text-white font-bold">H</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">Create <span className="text-teal-600">Account</span></h2>
          <p className="text-gray-500 mt-2 font-medium">Register as a Patient</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-bold rounded-xl text-center animate-pulse">
            {error}
          </div>
        )}

        {/* STEP 1: FORM */}
        {step === "form" && (
          <form onSubmit={sendOtp} className="space-y-5 animate-in fade-in duration-500">
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 focus:bg-white text-gray-800 transition-colors"
            />
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 focus:bg-white text-gray-800 transition-colors"
            />
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 chars)"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 focus:bg-white text-gray-800 transition-colors"
            />
            <button disabled={loading} className="w-full bg-teal-600 text-white font-bold py-3.5 rounded-xl hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-200 active:scale-95 disabled:bg-teal-400">
              {loading ? "Sending OTP..." : "Continue ➔"}
            </button>
            
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/" className="font-bold text-teal-600 hover:text-teal-500 transition-colors">
                Sign in
              </Link>
            </p>
          </form>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === "otp" && (
          <div className="space-y-6 animate-in slide-in-from-right-10 duration-500 text-center py-4">
            <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <span className="text-4xl">✉️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Verify your Email</h3>
            <p className="text-gray-500">Enter the 6-digit OTP sent to <span className="font-bold text-teal-600">{form.email}</span></p>

            <input
              placeholder="0 0 0 0 0 0"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Sirf numbers
              maxLength="6"
              className="w-full max-w-xs mx-auto text-center text-2xl tracking-[0.5em] font-bold px-4 py-4 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none bg-gray-50 focus:bg-white transition-all block mt-6"
            />

            <button onClick={verifyOtpAndRegister} disabled={loading} className="w-full max-w-xs mx-auto block bg-emerald-500 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-600 transition-all shadow-lg hover:shadow-emerald-200 active:scale-95 disabled:bg-emerald-400 mt-6">
              {loading ? "Verifying..." : "Verify & Complete"}
            </button>
            
            <button onClick={() => setStep("form")} className="text-sm font-bold text-gray-400 hover:text-teal-600 mt-6 transition-colors block w-full text-center">
              Wrong email? Go back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientRegister;