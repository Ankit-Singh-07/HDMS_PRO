import React, { useState } from "react";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "../firebase";

const DoctorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // 🔐 EMAIL LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (res.data.role !== "doctor") {
        setMessage("Doctor access only ❌");
        return;
      }

      localStorage.setItem("token", res.data.token);
      window.location.href = "/doctor/dashboard";
    } catch {
      setMessage("Invalid credentials ❌");
    }
  };

  // 🔴 GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const res = await axios.post(
        "http://localhost:5000/api/auth/social-login",
        {
          name: user.displayName,
          email: user.email,
          role: "doctor",
        }
      );

      localStorage.setItem("token", res.data.token);
      window.location.href = "/doctor/dashboard";
    } catch {
      setMessage("Google login failed ❌");
    }
  };

  // 🔵 FACEBOOK LOGIN
  const handleFacebookLogin = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;

      const res = await axios.post(
        "http://localhost:5000/api/auth/social-login",
        {
          name: user.displayName,
          email: user.email,
          role: "doctor",
        }
      );

      localStorage.setItem("token", res.data.token);
      window.location.href = "/doctor/dashboard";
    } catch {
      setMessage("Facebook login failed ❌");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Doctor Portal</h2>
        <p>Sign in as Doctor</p>

        {message && <p style={styles.error}>{message}</p>}

        <form onSubmit={handleLogin}>
          <input
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button style={styles.button}>Sign In</button>
        </form>

        {/* 🔗 REGISTER LINK */}
        <p style={styles.registerText}>
          New doctor?{" "}
          <span
            style={styles.registerLink}
            onClick={() => (window.location.href = "/doctor/register")}
          >
            Create account
          </span>
        </p>

        {/* 🔥 SOCIAL LOGIN */}
        <div style={styles.socialContainer}>
          <p style={styles.orText}>OR CONTINUE WITH</p>

          <button
            onClick={handleGoogleLogin}
            style={{ ...styles.socialBtn }}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              style={styles.icon}
            />
            Continue with Google
          </button>

          <button
            onClick={handleFacebookLogin}
            style={{ ...styles.socialBtn }}
          >
            <img
              src="https://www.svgrepo.com/show/475647/facebook-color.svg"
              alt="Facebook"
              style={styles.icon}
            />
            Continue with Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;

/* 🎨 STYLES */
const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #0f4c75, #3282b8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "380px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#2ecc71",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginBottom: "10px",
  },
  registerText: {
    marginTop: "12px",
    fontSize: "14px",
  },
  registerLink: {
    color: "#3282b8",
    fontWeight: "bold",
    cursor: "pointer",
  },
  socialContainer: {
    marginTop: "20px",
  },
  orText: {
    fontSize: "12px",
    color: "#777",
    marginBottom: "10px",
    letterSpacing: "1px",
  },
  socialBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
    border: "1px solid #ddd",
    background: "#fff",
    marginBottom: "10px",
  },
  icon: {
    width: "18px",
    height: "18px",
  },
};
