// src/pages/Jointest.jsx
import React, { useState } from "react";
import { useLocation } from "wouter";
import { useClassroomStore } from "@/features/classroom/ClassroomStore";
import "@/styles/globals.css";

export default function Jointest() {
  const [, navigate]  = useLocation();
  const [code, setCode]   = useState("");
  const [name, setName]   = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getSessionByCode = useClassroomStore((s) => s.getSessionByCode);

  const handleJoin = async (e) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) return setError("Enter the session code");
    if (!name.trim()) return setError("Enter your name");

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    const session = getSessionByCode(code.trim());

    if (!session) {
      setError("Invalid code. Ask your teacher for the correct code.");
      setLoading(false);
      return;
    }

    // Сессия учителя хранит skill с заглавной буквы; для маршрутов — lowercase
    const skillNorm = String(session.skill || "listening").toLowerCase();

    sessionStorage.setItem("current_session", JSON.stringify({
      ...session,
      skill: skillNorm,
      studentName: name.trim(),
      assignedByTeacher: true,
    }));

    // Переходим на нужный скилл
    const routes = {
      listening: "/listening",
      reading:   "/reading",
      writing:   "/writing",
      speaking:  "/speaking",
    };

    const route = routes[skillNorm] || "/listening";
    navigate(route);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #fdf0f0 0%, #f4f6fb 50%, #fdf0f0 100%)",
      padding: 24,
    }}>
      <div style={{
        background: "#fff", borderRadius: 20,
        padding: "44px 40px", width: "100%", maxWidth: 440,
        boxShadow: "0 16px 60px rgba(15,23,42,0.18)",
        border: "1px solid rgba(168,16,17,0.1)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Top accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, var(--crimson), var(--crimson-light))" }} />

        {/* Icon + title */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 14, margin: "0 auto 12px",
            background: "linear-gradient(145deg, var(--crimson), var(--crimson-light))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.8rem", boxShadow: "var(--shadow-red)",
          }}>🎯</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, color: "var(--navy)", marginBottom: 6 }}>
            Join Test
          </h1>
          <p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>
            Enter the code your teacher gave you
          </p>
        </div>

        {error && (
          <div style={{
            background: "#fff5f5", border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 8, padding: "11px 16px", color: "#dc2626",
            fontSize: "0.875rem", textAlign: "center", marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleJoin}>

          {/* Name */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Your Name</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Amir Karimov"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Code */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Session Code</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. L1P2-XYZ"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              style={{ letterSpacing: 3, fontFamily: "monospace", fontSize: "1.1rem", fontWeight: 700 }}
              required
            />
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? "Connecting..." : "🚀 Join Test"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.8rem", color: "var(--text3)" }}>
          Don't have a code? Ask your teacher.
        </p>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block", fontSize: "0.78rem", fontWeight: 700,
  textTransform: "uppercase", letterSpacing: "0.8px",
  color: "var(--text2)", marginBottom: 6,
};
