import React, { useState } from "react";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../firebase";
import "./patientLogin.css";

const PatientLogin = () => {
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
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (res.data.role !== "patient") {
        setError("Patient access only ❌");
        return;
      }

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
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

      const res = await axios.post(
        "http://localhost:5000/api/auth/social-login",
        {
          name: user.displayName,
          email: user.email,
          role: "patient",
        }
      );

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch {
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

      const res = await axios.post(
        "http://localhost:5000/api/auth/social-login",
        {
          name: user.displayName,
          email: user.email,
          role: "patient",
        }
      );

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch {
      setError("Facebook login failed ❌");
    }
  };

  return (
    <div className="pl-container">
      <div className="pl-card">
        <h2>Patient Portal</h2>
        <p className="subtitle">Sign in as Patient</p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="primary-btn">Sign In</button>
        </form>

        <p className="link-text">
          New patient?{" "}
          <span onClick={() => (window.location.href = "/patient/register")}>
            Create account
          </span>
        </p>

        <div className="divider">OR CONTINUE WITH</div>

        <button className="social-btn google" onClick={handleGoogleLogin}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
            alt="google"
          />
          Continue with Google
        </button>

        <button className="social-btn facebook" onClick={handleFacebookLogin}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png"
            alt="facebook"
          />
          Continue with Facebook
        </button>
      </div>
    </div>
  );
};

export default PatientLogin;
