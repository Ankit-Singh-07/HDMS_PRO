import React, { useState } from "react";
import axios from "axios";
import "./patientRegister.css";

const PatientRegister = () => {
  const [step, setStep] = useState("form"); // form | otp
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
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
      await axios.post("http://localhost:5000/api/otp/send", {
        email: form.email,
      });

      setStep("otp"); // ✅ THIS WAS MISSING BEFORE
    } catch {
      setError("Failed to send OTP ❌");
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
      window.location.href = "/";
    } catch (err) {
      setError(
        err.response?.data?.message || "OTP verification failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pr-container">
      <div className="pr-card">
        <h2>Patient Registration</h2>
        <p>Create your patient account</p>

        {error && <p className="error">{error}</p>}

        {/* STEP 1 */}
        {step === "form" && (
          <form onSubmit={sendOtp}>
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
            />
            <input
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 chars)"
              onChange={handleChange}
            />
            <button disabled={loading}>
              {loading ? "Sending OTP..." : "Continue"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === "otp" && (
          <div className="otp-box">
            <h3>Email OTP Verification</h3>
            <input
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
            />
            <button onClick={verifyOtpAndRegister} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP & Register"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientRegister;
