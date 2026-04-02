// src/pages/TeacherDashboard.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { generateCode, getBand } from "@/utils/helpers";
import { useClassroomStore } from "@/features/classroom/ClassroomStore";

const TESTS_KEY   = "oxbridge_tests";
const RESULTS_KEY = "class_results";
const SKILLS      = ["Listening", "Reading", "Writing", "Speaking"];

const SKILL_ICONS = {
  Listening: "🎧", Reading: "📖", Writing: "✍️", Speaking: "🗣️",
};

function loadTests() {
  try { return JSON.parse(localStorage.getItem(TESTS_KEY)) || []; }
  catch { return []; }
}

/* ── Guard: редирект если не учитель ── */
function useTeacherGuard() {
  const [, navigate] = useLocation();
  const [teacher, setTeacher] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("teacher");
    if (!raw) { navigate("/teacher-login"); return; }
    try {
      setTeacher(JSON.parse(raw));
    } catch {
      navigate("/teacher-login");
    } finally {
      setChecked(true);
    }
  }, []);

  return { teacher, checked };
}

/* ══════════════════════════════════════════
   SESSION CARD
══════════════════════════════════════════ */
function SessionCard({ session, onDelete }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(session.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{
      background: "#fff", border: "1px solid var(--border)",
      borderRadius: 14, padding: "16px 20px",
      boxShadow: "var(--shadow-sm)",
      display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 11,
        background: "var(--crimson-pale)", border: "1px solid var(--crimson-border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.3rem", flexShrink: 0,
      }}>
        {SKILL_ICONS[session.skill] || "📋"}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--navy)", marginBottom: 2 }}>
          {session.testName}
        </p>
        <p style={{ fontSize: "0.76rem", color: "var(--text3)" }}>
          {session.skill} ·{" "}
          {session.mode === "full"
            ? "Full test (all parts)"
            : `Part ${session.partNumber} only`}
        </p>
      </div>

      {/* Code — кликабельный */}
      <div
        onClick={copy}
        title="Click to copy"
        style={{
          background: "var(--navy3)", color: "#fff",
          padding: "8px 20px", borderRadius: 10,
          fontFamily: "monospace", fontWeight: 800,
          fontSize: "1.1rem", letterSpacing: 2,
          cursor: "pointer", userSelect: "none", flexShrink: 0,
          transition: "opacity 0.2s",
        }}
      >
        {copied ? "✅ Copied!" : session.code}
      </div>

      <button
        onClick={() => onDelete(session.code)}
        style={{
          width: 34, height: 34, borderRadius: "50%",
          border: "none", background: "var(--bg2)",
          cursor: "pointer", color: "var(--text3)", flexShrink: 0,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#fdecea"; e.currentTarget.style.color = "#dc2626"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "var(--bg2)"; e.currentTarget.style.color = "var(--text3)"; }}
      >✕</button>
    </div>
  );
}

/* ══════════════════════════════════════════
   RESULTS TABLE
══════════════════════════════════════════ */
function ResultsTable({ results }) {
  if (results.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text3)" }}>
        <p style={{ fontSize: "2rem", marginBottom: 10 }}>📭</p>
        <p style={{ fontWeight: 600 }}>No results yet.</p>
        <p style={{ fontSize: "0.85rem", marginTop: 6 }}>
          Results will appear here after students complete a test.
        </p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["#", "Name", "Test", "Score", "Band", "Date"].map((h) => (
              <th key={h} style={{
                textAlign: "left", padding: "10px 14px",
                background: "var(--bg2)", fontSize: "0.72rem",
                fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "1px", color: "var(--text2)",
                borderBottom: "1px solid var(--border)",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => {
            const band = getBand(r.score);
            const bandColor = band >= 7 ? "#0d7c59" : band >= 6 ? "#c9a227" : "#a81011";
            return (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "var(--bg2)" }}>
                <td style={td}>{i + 1}</td>
                <td style={{ ...td, fontWeight: 600 }}>{r.name || "Student"}</td>
                <td style={{ ...td, color: "var(--text2)" }}>{r.testName || "—"}</td>
                <td style={td}><strong>{r.score}/{r.total || 40}</strong></td>
                <td style={td}>
                  <span style={{
                    background: `${bandColor}18`, color: bandColor,
                    border: `1px solid ${bandColor}40`,
                    padding: "3px 12px", borderRadius: 999,
                    fontWeight: 800, fontSize: "0.82rem",
                    fontFamily: "'Playfair Display', serif",
                  }}>
                    Band {band}
                  </span>
                </td>
                <td style={{ ...td, color: "var(--text3)", fontSize: "0.8rem" }}>
                  {r.date ? new Date(r.date).toLocaleString("en-GB") : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const td = { padding: "11px 14px", borderBottom: "1px solid var(--bg2)", fontSize: "0.88rem", color: "var(--navy)" };

/* ══════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════ */
export default function TeacherDashboard() {
  const { teacher, checked } = useTeacherGuard();
  const [, navigate]         = useLocation();
  const [tab, setTab]        = useState("sessions"); // sessions | results
  const [tests, setTests]    = useState([]);
  const [results, setResults] = useState([]);
  const [flash,  setFlash]   = useState("");

  const [form, setForm] = useState({
    testId: "", skill: "Listening", partNumber: 1, mode: "single",
  });

  const sessions      = useClassroomStore((s) => s.sessions);
  const createSession = useClassroomStore((s) => s.createSession);
  const deleteSession = useClassroomStore((s) => s.deleteSession);
  const clearSessions = useClassroomStore((s) => s.clearSessions);

  useEffect(() => {
    setTests(loadTests());
    setResults(JSON.parse(localStorage.getItem(RESULTS_KEY)) || []);
  }, []);

  const showFlash = (msg) => { setFlash(msg); setTimeout(() => setFlash(""), 3500); };

  const handleLogout = () => {
    sessionStorage.removeItem("teacher");
    navigate("/teacher-login");
  };

  /* Create session */
  const handleCreateSession = () => {
    if (!form.testId) return alert("Select a test");
    const test = tests.find((t) => String(t.id) === String(form.testId));
    if (!test) return alert("Test not found");

    const code = generateCode(form.skill, form.testId, form.partNumber, form.mode);
    const session = {
      id:         Date.now(),
      code,
      skill:      form.skill,
      testId:     Number(form.testId),
      testName:   test.name,
      partNumber: form.mode === "full" ? null : form.partNumber,
      startPart:  form.mode === "full" ? 0 : form.partNumber - 1,
      mode:       form.mode,
      createdAt:  new Date().toISOString(),
      students:   [],
    };

    createSession(session);
    showFlash(`✅ Code generated: ${code}`);
  };

  /* Refresh results */
  const refreshResults = () => {
    setResults(JSON.parse(localStorage.getItem(RESULTS_KEY)) || []);
    showFlash("🔄 Results refreshed");
  };

  /* Clear results */
  const clearResults = () => {
    if (!window.confirm("Clear all student results?")) return;
    localStorage.removeItem(RESULTS_KEY);
    setResults([]);
  };

  if (!checked) return null;
  if (!teacher) return null;

  const selectedTest = tests.find((t) => String(t.id) === String(form.testId));
  const maxParts     = selectedTest?.parts || 4;

  const TABS = [
    { key: "sessions", label: "🎓 Sessions" },
    { key: "results",  label: `📊 Results ${results.length > 0 ? `(${results.length})` : ""}` },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 28px 80px" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
        <div>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "var(--crimson)", marginBottom: 6 }}>
            Teacher Area
          </p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.6rem,3vw,2.2rem)", fontWeight: 800, color: "var(--navy)", lineHeight: 1.15 }}>
            👨‍🏫 {teacher.name}
          </h1>
          <p style={{ color: "var(--text3)", fontSize: "0.85rem", marginTop: 4 }}>{teacher.email}</p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "#fff", color: "#dc2626",
            border: "1.5px solid rgba(239,68,68,0.3)",
            padding: "10px 18px", borderRadius: 10,
            fontWeight: 600, fontSize: "0.875rem", cursor: "pointer",
          }}
        >
          🚪 Logout
        </button>
      </div>

      {flash && (
        <div className="admin-success" style={{ marginBottom: 24 }}>{flash}</div>
      )}

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28, borderBottom: "1px solid var(--border)", paddingBottom: 0 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "10px 20px",
              border: "none",
              background: "transparent",
              fontWeight: 700,
              fontSize: "0.9rem",
              cursor: "pointer",
              color: tab === t.key ? "var(--crimson)" : "var(--text2)",
              borderBottom: tab === t.key ? "2px solid var(--crimson)" : "2px solid transparent",
              transition: "all 0.2s",
              marginBottom: -1,
            }}
          >{t.label}</button>
        ))}
      </div>

      {/* ════════════════════════════════
          SESSIONS TAB
      ════════════════════════════════ */}
      {tab === "sessions" && (
        <>
          {/* Create session form */}
          <div style={{
            background: "#fff", border: "1px solid var(--border)",
            borderRadius: 18, padding: "28px 32px",
            boxShadow: "var(--shadow-sm)", marginBottom: 32,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--crimson), var(--crimson-light), var(--gold))" }} />
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>
              🎓 Create Test Session
            </p>
            <p style={{ fontSize: "0.83rem", color: "var(--text2)", marginBottom: 20 }}>
              Choose a skill, test, and part. Students join at <strong>/jointest</strong> with the code.
            </p>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>

              {/* Skill */}
              <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 140 }}>
                <label style={labelStyle}>Skill</label>
                <select className="form-select" value={form.skill}
                  onChange={(e) => setForm({ ...form, skill: e.target.value, testId: "" })}>
                  {SKILLS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>

              {/* Test */}
              <div style={{ display: "flex", flexDirection: "column", flex: 2, minWidth: 200 }}>
                <label style={labelStyle}>Test</label>
                <select className="form-select" value={form.testId}
                  onChange={(e) => setForm({ ...form, testId: e.target.value, partNumber: 1 })}>
                  <option value="">— select test —</option>
                  {tests.filter((t) => t.skill === form.skill).map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              {/* Mode */}
              <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 140 }}>
                <label style={labelStyle}>Mode</label>
                <select className="form-select" value={form.mode}
                  onChange={(e) => setForm({ ...form, mode: e.target.value })}>
                  <option value="single">Single Part</option>
                  <option value="full">Full Test</option>
                </select>
              </div>

              {/* Part */}
              {form.mode === "single" && (
                <div style={{ display: "flex", flexDirection: "column", minWidth: 120 }}>
                  <label style={labelStyle}>Part</label>
                  <select className="form-select" value={form.partNumber}
                    onChange={(e) => setForm({ ...form, partNumber: Number(e.target.value) })}>
                    {Array.from({ length: maxParts }, (_, i) => (
                      <option key={i + 1} value={i + 1}>Part {i + 1}</option>
                    ))}
                  </select>
                </div>
              )}

            </div>

            {/* Preview */}
            {form.testId && (
              <div style={{ background: "var(--bg2)", borderRadius: 10, padding: "11px 16px", fontSize: "0.84rem", color: "var(--text2)", marginBottom: 16 }}>
                📌 Students will receive:&nbsp;
                <strong style={{ color: "var(--navy)" }}>
                  {SKILL_ICONS[form.skill]} {form.skill} · {selectedTest?.name}
                  {form.mode === "single" ? ` · Part ${form.partNumber} only` : " · Full test (all parts)"}
                </strong>
              </div>
            )}

            <button className="btn-primary" onClick={handleCreateSession}>
              🚀 Generate Session Code
            </button>
          </div>

          {/* Active sessions list */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--navy)" }}>
              Active Sessions ({sessions.length})
            </h2>
            {sessions.length > 0 && (
              <button
                onClick={() => { if (window.confirm("Delete all sessions?")) clearSessions(); }}
                style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: "0.83rem" }}
              >
                🗑️ Clear all
              </button>
            )}
          </div>

          {sessions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 24px", background: "#fff", borderRadius: 16, border: "1px dashed var(--border2)" }}>
              <p style={{ fontSize: "2rem", marginBottom: 8 }}>🎓</p>
              <p style={{ color: "var(--text3)", fontWeight: 600 }}>No active sessions.</p>
              <p style={{ fontSize: "0.83rem", color: "var(--text3)", marginTop: 6 }}>
                Create a session above and share the code with students.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {sessions.map((s) => (
                <SessionCard key={s.code} session={s} onDelete={deleteSession} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ════════════════════════════════
          RESULTS TAB
      ════════════════════════════════ */}
      {tab === "results" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--navy)" }}>
              Student Results
            </h2>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-secondary" onClick={refreshResults} style={{ padding: "8px 16px", fontSize: "0.83rem" }}>
                🔄 Refresh
              </button>
              {results.length > 0 && (
                <button
                  onClick={clearResults}
                  style={{ background: "none", border: "1.5px solid rgba(239,68,68,0.3)", color: "#dc2626", padding: "8px 16px", borderRadius: 10, cursor: "pointer", fontSize: "0.83rem", fontWeight: 600 }}
                >
                  🗑️ Clear
                </button>
              )}
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
            <ResultsTable results={results} />
          </div>
        </>
      )}

    </div>
  );
}

const labelStyle = {
  fontSize: "0.72rem", fontWeight: 700,
  textTransform: "uppercase", letterSpacing: "0.8px",
  color: "var(--text2)", marginBottom: 6,
};
