import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../firebase";

const PatientLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  /* =====================
     NORMAL LOGIN
  ===================== */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("https://hdms-backend-7j7w.onrender.com/api/auth/login", {
        email,
        password,
      });

      if (res.data.role !== "patient" && res.data.role !== "admin") {
        setError("Patient access only ❌");
        return;
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      // 🚀 ASLI FIX YAHAN HAI: Login hote hi dashboard par bhejo!
      navigate('/dashboard'); 
      
    } catch {
      setError("Invalid credentials ❌");
    }
  };

  /* =====================
     GOOGLE LOGIN
  ===================== */
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const res = await axios.post("https://hdms-backend-7j7w.onrender.com/api/auth/social-login", {
        name: user.displayName,
        email: user.email,
        role: "patient",
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      // 🚀 ASLI FIX: Google login success hote hi dashboard par bhejo!
      navigate('/dashboard');

    } catch (err) {
      console.error(err);
      setError("Google login failed ❌");
    }
  };

  /* =====================
     FACEBOOK LOGIN
  ===================== */
  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;

      const res = await axios.post("https://hdms-backend-7j7w.onrender.com/api/auth/social-login", {
        name: user.displayName,
        email: user.email,
        role: "patient",
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      // 🚀 ASLI FIX: Facebook login success hote hi dashboard par bhejo!
      navigate('/dashboard');

    } catch {
      setError("Facebook login failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Background Decorative Blobs (Teal Theme) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100 z-10 relative animate-in fade-in zoom-in duration-500">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl mx-auto flex items-center justify-center mb-5 shadow-lg shadow-teal-200">
            <span className="text-3xl text-white font-bold">H</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">HDMS <span className="text-teal-600">PRO</span></h2>
          <p className="text-gray-500 mt-2 font-medium">Welcome! Sign in to Patient Portal</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm font-bold rounded-xl text-center animate-pulse">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 focus:bg-white text-gray-800 transition-colors"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-500 outline-none bg-gray-50 focus:bg-white text-gray-800 transition-colors"
            />
          </div>
          <button className="w-full bg-teal-600 text-white font-bold py-3.5 rounded-xl hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-200 active:scale-95">
            Sign In
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          New patient?{" "}
          <Link to="/patient/register" className="font-bold text-teal-600 hover:text-teal-500 transition-colors">
            Create account
          </Link>
        </p>

        {/* Social Login Divider */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-400 font-bold tracking-widest text-[10px] uppercase">OR CONTINUE WITH</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button onClick={handleGoogleLogin} type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold hover:bg-gray-50 transition-colors shadow-sm active:scale-95">
              <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
            <button onClick={handleFacebookLogin} type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold hover:bg-gray-50 transition-colors shadow-sm active:scale-95">
              <img src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png" alt="Facebook" className="w-5 h-5" />
              Continue with Facebook
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientLogin;