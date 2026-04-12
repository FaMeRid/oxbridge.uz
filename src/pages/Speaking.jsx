// src/pages/Speaking.jsx
import React, { useState } from "react";
import { useLocation } from "wouter";
import "@/styles/globals.css";

const PARTS = [
  {
    num: 1, title: "Part 1 — Introduction & Interview",
    desc: "The examiner asks general questions about yourself and familiar topics such as home, family, work, studies and interests.",
    time: "4–5 min", icon: "💬",
    topics: ["Home & Hometown", "Work or Studies", "Daily Routine", "Hobbies & Free Time", "Friends & Family"],
  },
  {
    num: 2, title: "Part 2 — Long Turn",
    desc: "You are given a cue card with a topic. You have 1 minute to prepare and then speak for 1–2 minutes.",
    time: "3–4 min", icon: "🗣️",
    topics: ["Describe a person", "Describe a place", "Describe an experience", "Describe an object", "Describe an event"],
  },
  {
    num: 3, title: "Part 3 — Discussion",
    desc: "The examiner asks further questions about the topic in Part 2. You discuss more abstract ideas and issues.",
    time: "4–5 min", icon: "🤔",
    topics: ["Society & Culture", "Technology & Change", "Education & Work", "Environment", "Global Issues"],
  },
];

const SAMPLE_QUESTIONS = {
  1: ["Do you work or are you a student?", "What do you enjoy most about your free time?", "How often do you use public transport?", "Tell me about your hometown.", "What kind of music do you like?"],
  2: ["Describe a memorable journey you have taken.\nYou should say:\n• where you went\n• who you went with\n• what you did there\n• and explain why it was memorable."],
  3: ["How has travel changed in recent years?", "Do you think people travel for the right reasons?", "What impact does tourism have on local cultures?", "Should governments do more to promote domestic tourism?"],
};

export default function Speaking() {
  const [, navigate] = useLocation();
  const [activePart, setActivePart] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [timer, setTimer] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  const startTimer = (secs) => {
    setSeconds(secs);
    setRunning(true);
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { clearInterval(interval); setRunning(false); return 0; }
        return s - 1;
      });
    }, 1000);
    setTimer(interval);
  };

  const stopTimer = () => {
    clearInterval(timer);
    setRunning(false);
    setSeconds(0);
  };

  const formatTime = (s) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,"0")}`;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "36px 28px 80px" }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--crimson)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "block", width: 20, height: 2, background: "var(--crimson)" }} />
          IELTS Speaking
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, color: "var(--navy)", marginBottom: 10 }}>
          🗣️ Speaking Module
        </h1>
        <p style={{ color: "var(--text2)", maxWidth: 560, fontSize: "0.95rem", lineHeight: 1.65 }}>
          Practice all 3 parts of the IELTS Speaking test with timed exercises and sample questions.
        </p>
      </div>

      {/* Coming soon banner */}
      <div style={{
        background: "linear-gradient(135deg, #0c1f4a, #1e293b)",
        borderRadius: 16, padding: "24px 32px", marginBottom: 32,
        display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
      }}>
        <div style={{ fontSize: "2.5rem" }}>🚧</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 800, color: "#fff", marginBottom: 4 }}>
            Full Speaking Module Coming Soon
          </p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
            Voice recording, AI feedback, and band scoring are in development. For now — practice with timed questions below.
          </p>
        </div>
      </div>

      {/* Parts grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 36 }}>
        {PARTS.map((p) => (
          <div
            key={p.num}
            onClick={() => setActivePart(activePart === p.num ? null : p.num)}
            style={{
              background: "#fff", border: `1.5px solid ${activePart === p.num ? "var(--crimson-border)" : "var(--border)"}`,
              borderRadius: 16, padding: "22px 24px", cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: activePart === p.num ? "0 4px 24px rgba(168,16,17,0.1)" : "var(--shadow-sm)",
              transform: activePart === p.num ? "translateY(-2px)" : "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <span style={{ fontSize: "1.8rem" }}>{p.icon}</span>
              <span style={{
                fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "1px", padding: "3px 10px", borderRadius: 999,
                background: "var(--bg2)", color: "var(--text3)",
              }}>⏱ {p.time}</span>
            </div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.95rem", fontWeight: 700, color: "var(--navy)", marginBottom: 8 }}>
              {p.title}
            </h3>
            <p style={{ fontSize: "0.82rem", color: "var(--text2)", lineHeight: 1.6, marginBottom: 14 }}>{p.desc}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
              {p.topics.map((t) => (
                <span key={t} style={{
                  fontSize: "0.68rem", background: "var(--crimson-pale)", color: "var(--crimson)",
                  border: "1px solid var(--crimson-border)", padding: "2px 8px", borderRadius: 999, fontWeight: 600,
                }}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Active part questions */}
      {activePart && (
        <div style={{
          background: "#fff", border: "1px solid var(--border)",
          borderRadius: 16, padding: "24px 28px",
          boxShadow: "var(--shadow-sm)", marginBottom: 28,
          animation: "fadeUp 0.3s ease-out both",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--navy)" }}>
              Part {activePart} Practice
            </h3>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {running && (
                <div style={{
                  background: seconds < 30 ? "rgba(168,16,17,0.1)" : "var(--bg2)",
                  border: `1px solid ${seconds < 30 ? "var(--crimson-border)" : "var(--border)"}`,
                  borderRadius: 8, padding: "6px 14px",
                  fontFamily: "monospace", fontWeight: 800, fontSize: "1rem",
                  color: seconds < 30 ? "var(--crimson)" : "var(--navy)",
                }}>
                  ⏱ {formatTime(seconds)}
                </div>
              )}
              {!running ? (
                <button className="btn-primary" style={{ padding: "8px 16px", fontSize: "0.82rem" }}
                  onClick={() => startTimer(activePart === 2 ? 120 : activePart === 1 ? 60 : 90)}>
                  ▶ Start Timer
                </button>
              ) : (
                <button className="btn-secondary" style={{ padding: "8px 16px", fontSize: "0.82rem" }} onClick={stopTimer}>
                  ⏹ Stop
                </button>
              )}
            </div>
          </div>

          {/* Question */}
          <div style={{
            background: "var(--bg2)", borderRadius: 12, padding: "20px 22px",
            marginBottom: 20, border: "1px solid var(--border)",
          }}>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--text3)", marginBottom: 10 }}>
              {activePart === 2 ? "Cue Card" : `Question ${qIndex + 1} of ${SAMPLE_QUESTIONS[activePart].length}`}
            </p>
            <p style={{ fontSize: "1rem", color: "var(--navy)", lineHeight: 1.8, whiteSpace: "pre-line", fontWeight: activePart === 2 ? 500 : 400 }}>
              {SAMPLE_QUESTIONS[activePart][qIndex]}
            </p>
          </div>

          {/* Nav */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn-secondary"
              disabled={qIndex === 0}
              style={{ opacity: qIndex === 0 ? 0.4 : 1 }}
              onClick={() => { setQIndex((i) => i - 1); stopTimer(); }}
            >← Prev</button>
            <button
              className="btn-primary"
              disabled={qIndex >= SAMPLE_QUESTIONS[activePart].length - 1}
              style={{ opacity: qIndex >= SAMPLE_QUESTIONS[activePart].length - 1 ? 0.4 : 1 }}
              onClick={() => { setQIndex((i) => i + 1); stopTimer(); }}
            >Next →</button>
            <button
              className="btn-secondary"
              onClick={() => { setQIndex(Math.floor(Math.random() * SAMPLE_QUESTIONS[activePart].length)); stopTimer(); }}
            >🔀 Random</button>
          </div>
        </div>
      )}

      {/* Tips */}
      <div style={{ background: "var(--bg2)", borderRadius: 14, padding: "20px 24px" }}>
        <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--navy)", marginBottom: 12 }}>💡 Speaking Tips</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
          {[
            "Don't memorise scripts — speak naturally",
            "Use fillers: 'That's an interesting question...'",
            "Extend your answers — never say just 'yes' or 'no'",
            "Vary your vocabulary — avoid repeating the same words",
            "Speak at a natural pace — not too fast or slow",
            "It's OK to self-correct: 'I mean...' or 'What I meant was...'",
          ].map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ color: "var(--crimson)", fontWeight: 800, flexShrink: 0, marginTop: 1 }}>✓</span>
              <span style={{ fontSize: "0.82rem", color: "var(--text2)", lineHeight: 1.5 }}>{tip}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}