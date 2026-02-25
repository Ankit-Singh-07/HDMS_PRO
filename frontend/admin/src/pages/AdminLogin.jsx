import React, { useState } from "react";
import axios from "axios";
import "./login.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage(""); // 🔹 purana error clear

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // 🔒 Sirf admin allow
      if (res.data.role !== "admin") {
        setMessage("Admin access only ❌");
        return;
      }

      // ✅ Token save
      localStorage.setItem("token", res.data.token);

      // ✅ Redirect (NO alert)
      window.location.replace("/dashboard");
    } catch (error) {
      // ❌ Alert nahi dikhana
      if (
        error.response &&
        (error.response.status === 401 ||
          error.response.status === 400)
      ) {
        setMessage("Invalid admin credentials ❌");
      } else {
        setMessage("Server error, try again later ❌");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Admin Login</h2>
        <p>System administration & management</p>

        {message && <p className="error">{message}</p>}

        <form onSubmit={handleLogin}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="ankitsingh751899@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">LOGIN</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
