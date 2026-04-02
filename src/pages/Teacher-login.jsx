// src/pages/Teacher-login.jsx
import React, { useState } from "react";
import { useLocation } from "wouter";
import "@/styles/globals.css";

// Список учителей — в будущем заменишь на Firebase/Supabase
const TEACHERS = [
  { id: 1, name: "Shoxruh Shoberdiev", email: "teacher@oxbridge.uz", password: "teacher2026" },
  { id: 2, name: "Demo Teacher",       email: "demo@oxbridge.uz",    password: "demo123"      },
];

export default function TeacherLogin() {
  const [, navigate]  = useLocation();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    await new Promise((r) => setTimeout(r, 600)); // имитация запроса

    const teacher = TEACHERS.find(
      (t) => t.email === email && t.password === password
    );

    if (!teacher) {
      setError("Wrong email or password");
      setLoading(false);
      return;
    }

    // Сохраняем учителя в sessionStorage
    sessionStorage.setItem("teacher", JSON.stringify({
      id:   teacher.id,
      name: teacher.name,
      email: teacher.email,
    }));

    navigate("/teacher");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">👨‍🏫</div>
          <h1 className="auth-title">Teacher Area</h1>
          <p className="auth-subtitle">Sign in to your teacher dashboard</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="teacher@oxbridge.uz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.8rem", color: "var(--text3)" }}>
          Student? <a href="/login" style={{ color: "var(--crimson)", fontWeight: 700 }}>Go to student login</a>
        </p>
      </div>
    </div>
  );
}
