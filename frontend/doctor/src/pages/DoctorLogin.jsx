import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; 
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../firebase";

const DoctorLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post("https://hdms-backend-7j7w.onrender.com/api/auth/login", {
        email,
        password,
      });
      if (res.data.role !== "doctor") {
        setMessage("Doctor access only ❌");
        return;
      }
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (error) {
      // 🔥 FIX: Backend ka error pakadna
      if (error.response && error.response.status === 403) {
        setMessage("⚠️ " + (error.response.data.message || "Your account is pending Admin approval."));
      } else {
        setMessage("Invalid credentials ❌");
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const res = await axios.post("https://hdms-backend-7j7w.onrender.com/api/auth/social-login", {
        name: user.displayName,
        email: user.email,
        role: "doctor",
      });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (error) {
      // 🔥 FIX: Google login ke liye bhi backend error pakadna
      if (error.response && error.response.status === 403) {
        setMessage("⚠️ " + (error.response.data.message || "Your account is pending Admin approval."));
      } else {
        setMessage("Google login failed ❌");
      }
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      const res = await axios.post("https://hdms-backend-7j7w.onrender.com/api/auth/social-login", {
        name: user.displayName,
        email: user.email,
        role: "doctor",
      });
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (error) {
      // 🔥 FIX: Facebook login ke liye bhi backend error pakadna
      if (error.response && error.response.status === 403) {
        setMessage("⚠️ " + (error.response.data.message || "Your account is pending Admin approval."));
      } else {
        setMessage("Facebook login failed ❌");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100 z-10 relative animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl mx-auto flex items-center justify-center mb-5 shadow-lg shadow-blue-200">
            <span className="text-3xl text-white font-bold">H</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">HDMS <span className="text-blue-600">PRO</span></h2>
          <p className="text-gray-500 mt-2 font-medium">Sign in as Doctor</p>
        </div>

        {message && (
          <div className={`mb-6 p-3 ${message.includes('⚠️') ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : 'bg-red-50 border-red-200 text-red-600'} text-sm font-bold rounded-xl text-center`}>
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <input 
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-gray-800"
            placeholder="Email Address"
          />
          <input 
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 text-gray-800"
            placeholder="Password"
          />
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 shadow-lg transition-all active:scale-95">
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          New doctor?{" "}
          <Link
            to="/register" 
            className="font-bold text-blue-600 hover:text-blue-500 cursor-pointer transition-colors"
          >
            Create account
          </Link>
        </p>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-400 font-bold tracking-widest text-[10px] uppercase">OR CONTINUE WITH</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <button onClick={handleGoogleLogin} type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold hover:bg-gray-50 transition-colors shadow-sm active:scale-95">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
            <button onClick={handleFacebookLogin} type="button" className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold hover:bg-gray-50 transition-colors shadow-sm active:scale-95">
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5" />
              Continue with Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin; 