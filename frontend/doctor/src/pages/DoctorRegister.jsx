import React, { useState } from "react";
import "./doctorRegister.css";

const DoctorRegister = () => {
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
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.password ||
      !form.specialization ||
      !form.license ||
      !form.experience
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

      const res = await fetch("http://localhost:5000/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to send OTP ❌");
        return;
      }

      alert("OTP sent to your email ✅");
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
      setError("Enter valid 6-digit OTP ❌");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ✅ VERIFY OTP
      const verifyRes = await fetch("http://localhost:5000/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          otp: String(otp),
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        setError(verifyData.message || "OTP verification failed ❌");
        return;
      }

      // ✅ REGISTER DOCTOR
      const registerRes = await fetch(
        "http://localhost:5000/api/auth/register",
        {
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
        }
      );

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        setError(registerData.message || "Registration failed ❌");
        return;
      }

      alert("Doctor registered successfully ✅");
      window.location.href = "/";

    } catch (err) {
      console.error(err);
      setError("OTP verification failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dr-container">
      <div className="dr-card">
        <h2>Doctor Registration</h2>
        <p>Create your professional account</p>

        {error && <p className="error">{error}</p>}

        {/* ===== STEP 1: FORM ===== */}
        {step === 1 && (
          <form onSubmit={handleRegister}>
            <input name="name" placeholder="Full Name" onChange={handleChange} />
            <input name="email" placeholder="Email Address" onChange={handleChange} />
            <input name="phone" placeholder="Phone Number" onChange={handleChange} />
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              onChange={handleChange}
            />

            <div className="doctor-box">
              <h4>Doctor Details</h4>
              <input
                name="specialization"
                placeholder="Specialization (e.g. Cardiology)"
                onChange={handleChange}
              />
              <input
                name="license"
                placeholder="License Number"
                onChange={handleChange}
              />
              <input
                name="experience"
                placeholder="Years of Experience"
                onChange={handleChange}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Sending OTP..." : "Register"}
            </button>
          </form>
        )}

        {/* ===== STEP 2: OTP ===== */}
        {step === 2 && (
          <div className="otp-box">
            <h3>Email OTP Verification</h3>
            <p>Enter 6-digit OTP sent to your email</p>

            <input
              maxLength="6"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button onClick={verifyOtpAndRegister} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP & Register"}
            </button>
          </div>
        )}

        <small className="note">
          * Account will require admin approval before login
        </small>
      </div>
    </div>
  );
};

export default DoctorRegister;
