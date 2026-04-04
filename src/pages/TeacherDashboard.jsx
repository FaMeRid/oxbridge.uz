import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { generateCode, getBand } from "@/utils/helpers";
import { useClassroomStore } from "@/features/classroom/ClassroomStore";

const TESTS_KEY   = "oxbridge_tests";
const RESULTS_KEY = "class_results";
const REQUESTS_KEY = "join_requests";
const SESSIONS_KEY = "classroom_sessions";
const SKILLS = ["Listening", "Reading", "Writing", "Speaking"];

const SKILL_ICONS = {
  Listening: "🎧",
  Reading: "📖",
  Writing: "✍️",
  Speaking: "🗣️",
};

// ════════════════════════════════════════
// GUARD: Redirect if not teacher
// ════════════════════════════════════════
function useTeacherGuard() {
  const [, navigate] = useLocation();
  const [teacher, setTeacher] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("teacher");
    if (!raw) {
      navigate("/teacher-login");
      return;
    }
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

// ════════════════════════════════════════
// LOAD/SAVE FUNCTIONS
// ════════════════════════════════════════
function loadTests() {
  try {
    return JSON.parse(localStorage.getItem(TESTS_KEY)) || [];
  } catch {
    return [];
  }
}

function loadResults() {
  try {
    return JSON.parse(localStorage.getItem(RESULTS_KEY)) || [];
  } catch {
    return [];
  }
}

function loadRequests() {
  try {
    return JSON.parse(localStorage.getItem(REQUESTS_KEY)) || [];
  } catch {
    return [];
  }
}

function loadSessions() {
  try {
    return JSON.parse(localStorage.getItem(SESSIONS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveRequests(requests) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

// ════════════════════════════════════════
// JOIN REQUEST CARD
// ════════════════════════════════════════
function JoinRequestCard({ request, onApprove, onReject, session }) {
  const getBandColor = (band) => {
    if (band >= 8) return { bg: "#d1fae5", border: "#10b981", text: "#065f46" };
    if (band >= 7) return { bg: "#fef3c7", border: "#f59e0b", text: "#92400e" };
    if (band >= 6) return { bg: "#fecaca", border: "#f87171", text: "#7f1d1d" };
    return { bg: "#fee2e2", border: "#fca5a5", text: "#991b1b" };
  };

  const colors = getBandColor(request.estimatedBand || 6);

  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid var(--border)",
        borderRadius: 14,
        padding: "16px 20px",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: colors.bg,
          border: `2px solid ${colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.8rem",
          flexShrink: 0,
        }}
      >
        {request.studentName?.charAt(0).toUpperCase() || "?"}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 200 }}>
        <p
          style={{
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "var(--navy)",
            marginBottom: 4,
          }}
        >
          {request.studentName || "Unknown Student"}
        </p>
        <p style={{ fontSize: "0.8rem", color: "var(--text2)", marginBottom: 4 }}>
          {SKILL_ICONS[session?.skill] || "📋"} {session?.skill || "Unknown"} ·{" "}
          {session?.testName || "Unknown Test"}
        </p>
        <p style={{ fontSize: "0.75rem", color: "var(--text3)" }}>
          Requested {new Date(request.requestedAt).toLocaleString("en-GB")}
        </p>
      </div>

      {/* Band Score */}
      <div
        style={{
          background: colors.bg,
          color: colors.text,
          border: `1.5px solid ${colors.border}`,
          padding: "6px 14px",
          borderRadius: 8,
          fontWeight: 700,
          fontSize: "0.85rem",
          flexShrink: 0,
        }}
      >
        Est. Band {request.estimatedBand || 6}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button
          onClick={() => onApprove(request.id)}
          style={{
            padding: "8px 16px",
            background: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: "0.8rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#059669")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#10b981")}
        >
          ✓ Approve
        </button>
        <button
          onClick={() => onReject(request.id)}
          style={{
            padding: "8px 16px",
            background: "#f3f4f6",
            color: "#dc2626",
            border: "1.5px solid rgba(239,68,68,0.3)",
            borderRadius: 8,
            fontWeight: 600,
            fontSize: "0.8rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fee2e2";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#f3f4f6";
          }}
        >
          ✕ Reject
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════
// SESSION CARD
// ════════════════════════════════════════
function SessionCard({
  session,
  onDelete,
  studentCount,
  pendingRequests,
  onManageRequests,
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(session.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid var(--border)",
        borderRadius: 14,
        padding: "16px 20px",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 11,
          background: "var(--crimson-pale)",
          border: "1px solid var(--crimson-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.3rem",
          flexShrink: 0,
        }}
      >
        {SKILL_ICONS[session.skill] || "📋"}
      </div>

      <div style={{ flex: 1, minWidth: 200 }}>
        <p
          style={{
            fontWeight: 700,
            fontSize: "0.9rem",
            color: "var(--navy)",
            marginBottom: 2,
          }}
        >
          {session.testName}
        </p>
        <p style={{ fontSize: "0.76rem", color: "var(--text3)" }}>
          {session.skill} ·{" "}
          {session.mode === "full"
            ? "Full test (all parts)"
            : `Part ${session.partNumber} only`}
        </p>
        <p style={{ fontSize: "0.72rem", color: "var(--text3)", marginTop: 4 }}>
          👥 {studentCount} student{studentCount !== 1 ? "s" : ""} joined
        </p>
      </div>

      {/* Pending badge */}
      {pendingRequests > 0 && (
        <div
          style={{
            background: "#fef3c7",
            border: "1.5px solid #f59e0b",
            color: "#92400e",
            padding: "6px 12px",
            borderRadius: 8,
            fontWeight: 700,
            fontSize: "0.8rem",
            flexShrink: 0,
            cursor: "pointer",
          }}
          onClick={() => onManageRequests(session.code)}
          title="Click to manage"
        >
          ⏳ {pendingRequests} pending
        </div>
      )}

      {/* Code */}
      <div
        onClick={copy}
        title="Click to copy"
        style={{
          background: "var(--navy3)",
          color: "#fff",
          padding: "8px 20px",
          borderRadius: 10,
          fontFamily: "monospace",
          fontWeight: 800,
          fontSize: "1.1rem",
          letterSpacing: 2,
          cursor: "pointer",
          userSelect: "none",
          flexShrink: 0,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        {copied ? "✅ Copied!" : session.code}
      </div>

      {/* Delete button */}
      <button
        onClick={() => onDelete(session.code)}
        style={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: "none",
          background: "var(--bg2)",
          cursor: "pointer",
          color: "var(--text3)",
          flexShrink: 0,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#fdecea";
          e.currentTarget.style.color = "#dc2626";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--bg2)";
          e.currentTarget.style.color = "var(--text3)";
        }}
      >
        ✕
      </button>
    </div>
  );
}

// ════════════════════════════════════════
// RESULTS TABLE
// ════════════════════════════════════════
function ResultsTable({ results }) {
  if (results.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          color: "var(--text3)",
        }}
      >
        <p style={{ fontSize: "2.5rem", marginBottom: 12 }}>📭</p>
        <p style={{ fontWeight: 700, fontSize: "1rem" }}>No results yet.</p>
        <p style={{ fontSize: "0.85rem", marginTop: 8 }}>
          Results will appear here after students complete a test.
        </p>
      </div>
    );
  }

  // Group by student
  const byStudent = {};
  results.forEach((r) => {
    if (!byStudent[r.studentId]) {
      byStudent[r.studentId] = [];
    }
    byStudent[r.studentId].push(r);
  });

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "var(--bg2)" }}>
            {[
              "#",
              "Student Name",
              "Email",
              "Test Name",
              "Skill",
              "Score",
              "Band",
              "Date",
            ].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: "left",
                  padding: "12px 14px",
                  background: "var(--bg2)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  color: "var(--text2)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((r, i) => {
            const band = getBand(r.score);
            const bandColor =
              band >= 8 ? "#0d7c59" : band >= 7 ? "#c9a227" : "#a81011";
            return (
              <tr
                key={i}
                style={{
                  background: i % 2 === 0 ? "#fff" : "var(--bg2)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <td style={{ ...tdStyle }}>
                  <strong>{i + 1}</strong>
                </td>
                <td style={{ ...tdStyle, fontWeight: 600 }}>
                  {r.studentName || "Unknown"}
                </td>
                <td style={{ ...tdStyle, fontSize: "0.8rem" }}>
                  {r.studentEmail || "—"}
                </td>
                <td style={{ ...tdStyle }}>{r.testName || "—"}</td>
                <td style={{ ...tdStyle }}>
                  {SKILL_ICONS[r.skill]} {r.skill || "—"}
                </td>
                <td style={{ ...tdStyle }}>
                  <strong>
                    {r.score}/{r.total || 40}
                  </strong>
                </td>
                <td style={{ ...tdStyle }}>
                  <span
                    style={{
                      background: `${bandColor}18`,
                      color: bandColor,
                      border: `1px solid ${bandColor}40`,
                      padding: "4px 12px",
                      borderRadius: 999,
                      fontWeight: 800,
                      fontSize: "0.82rem",
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    Band {band}
                  </span>
                </td>
                <td
                  style={{
                    ...tdStyle,
                    color: "var(--text3)",
                    fontSize: "0.8rem",
                  }}
                >
                  {r.date
                    ? new Date(r.date).toLocaleDateString("en-GB")
                    : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ════════════════════════════════════════
// ANALYTICS CARDS
// ════════════════════════════════════════
function AnalyticsCard({ icon, label, value, subtext, color }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid var(--border)",
        borderRadius: 14,
        padding: "20px 24px",
        boxShadow: "var(--shadow-sm)",
        textAlign: "center",
      }}
    >
      <p style={{ fontSize: "2rem", margin: "0 0 8px 0" }}>{icon}</p>
      <p
        style={{
          fontSize: "0.8rem",
          fontWeight: 700,
          color: "var(--text2)",
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          margin: "0 0 8px 0",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: "clamp(1.4rem, 3vw, 2rem)",
          fontWeight: 800,
          color: color || "var(--navy)",
          margin: "0 0 6px 0",
        }}
      >
        {value}
      </p>
      {subtext && (
        <p style={{ fontSize: "0.75rem", color: "var(--text3)", margin: 0 }}>
          {subtext}
        </p>
      )}
    </div>
  );
}

const tdStyle = {
  padding: "12px 14px",
  borderBottom: "1px solid var(--border)",
  fontSize: "0.88rem",
  color: "var(--navy)",
};

const labelStyle = {
  fontSize: "0.72rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.8px",
  color: "var(--text2)",
  marginBottom: 8,
};

// ════════════════════════════════════════
// MAIN DASHBOARD
// ════════════════════════════════════════
export default function TeacherDashboard() {
  const { teacher, checked } = useTeacherGuard();
  const [, navigate] = useLocation();
  const [tab, setTab] = useState("overview"); // overview | sessions | requests | results
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [requests, setRequests] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [flash, setFlash] = useState("");
  const [selectedSessionCode, setSelectedSessionCode] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const [form, setForm] = useState({
    testId: "",
    skill: "Listening",
    partNumber: 1,
    mode: "single",
  });

  // Load data
  useEffect(() => {
    setTests(loadTests());
    setResults(loadResults());
    setRequests(loadRequests());
    setSessions(loadSessions());
  }, []);

  // Auto refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setResults(loadResults());
      setRequests(loadRequests());
      setSessions(loadSessions());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const showFlash = (msg) => {
    setFlash(msg);
    setTimeout(() => setFlash(""), 3500);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("teacher");
    navigate("/teacher-login");
  };

  // Create session
  const handleCreateSession = () => {
    if (!form.testId) return alert("Select a test");
    const test = tests.find((t) => String(t.id) === String(form.testId));
    if (!test) return alert("Test not found");

    const code = generateCode(
      form.skill,
      form.testId,
      form.partNumber,
      form.mode
    );
    const session = {
      id: Date.now(),
      code,
      skill: form.skill,
      testId: Number(form.testId),
      testName: test.name,
      partNumber: form.mode === "full" ? null : form.partNumber,
      mode: form.mode,
      createdAt: new Date().toISOString(),
      students: [],
      teacherId: teacher?.id || "teacher_1",
    };

    const newSessions = [...sessions, session];
    setSessions(newSessions);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(newSessions));
    showFlash(`✅ Session created! Code: ${code}`);
    setForm({ testId: "", skill: "Listening", partNumber: 1, mode: "single" });
  };

  // Delete session
  const handleDeleteSession = (code) => {
    if (!window.confirm("Delete this session?")) return;
    const newSessions = sessions.filter((s) => s.code !== code);
    setSessions(newSessions);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(newSessions));
    showFlash("🗑️ Session deleted");
  };

  // Clear all sessions
  const handleClearSessions = () => {
    if (!window.confirm("Delete all sessions?")) return;
    setSessions([]);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify([]));
    showFlash("🗑️ All sessions cleared");
  };

  // Approve join request
  const handleApproveRequest = (requestId) => {
    const request = requests.find((r) => r.id === requestId);
    if (!request) return;

    // Add student to session
    const updatedSessions = sessions.map((s) => {
      if (s.code === request.sessionCode) {
        return {
          ...s,
          students: [
            ...s.students,
            {
              id: request.studentId,
              name: request.studentName,
              email: request.studentEmail,
              joinedAt: new Date().toISOString(),
            },
          ],
        };
      }
      return s;
    });

    // Remove from requests
    const newRequests = requests.filter((r) => r.id !== requestId);

    setSessions(updatedSessions);
    setRequests(newRequests);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(updatedSessions));
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(newRequests));
    showFlash("✅ Student approved!");
  };

  // Reject join request
  const handleRejectRequest = (requestId) => {
    const newRequests = requests.filter((r) => r.id !== requestId);
    setRequests(newRequests);
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(newRequests));
    showFlash("❌ Request rejected");
  };

  // Refresh results
  const refreshResults = () => {
    setResults(loadResults());
    showFlash("🔄 Results refreshed");
  };

  // Clear results
  const clearResults = () => {
    if (!window.confirm("Clear all student results?")) return;
    localStorage.removeItem(RESULTS_KEY);
    setResults([]);
    showFlash("🗑️ All results cleared");
  };

  if (!checked) return null;
  if (!teacher) return null;

  const selectedTest = tests.find((t) => String(t.id) === String(form.testId));
  const maxParts = selectedTest?.parts || 4;

  // Calculate stats
  const totalStudents = new Set(
    sessions.reduce((acc, s) => [...acc, ...s.students.map((st) => st.id)], [])
  ).size;
  const totalSessions = sessions.length;
  const pendingRequests = requests.length;
  const avgBand =
    results.length > 0
      ? (
          results.reduce((sum, r) => sum + getBand(r.score), 0) / results.length
        ).toFixed(1)
      : 0;

  const TABS = [
    { key: "overview", label: "📊 Overview" },
    { key: "sessions", label: `🎓 Sessions (${sessions.length})` },
    {
      key: "requests",
      label: `⏳ Requests${pendingRequests > 0 ? ` (${pendingRequests})` : ""}`,
    },
    { key: "results", label: `📈 Results (${results.length})` },
  ];

  // Get requests for selected session
  const sessionRequests =
    selectedSessionCode && showRequestModal
      ? requests.filter((r) => r.sessionCode === selectedSessionCode)
      : [];

  const sessionRequestsSession = sessions.find(
    (s) => s.code === selectedSessionCode
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 28px 80px" }}>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <div>
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "var(--crimson)",
              marginBottom: 8,
            }}
          >
            Teacher Dashboard
          </p>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
              fontWeight: 800,
              color: "var(--navy)",
              lineHeight: 1.15,
              margin: "0 0 8px 0",
            }}
          >
            👨‍🏫 {teacher.name}
          </h1>
          <p style={{ color: "var(--text3)", fontSize: "0.85rem", margin: 0 }}>
            {teacher.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            color: "#dc2626",
            border: "1.5px solid rgba(239,68,68,0.3)",
            padding: "10px 18px",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: "0.875rem",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fee2e2";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff";
          }}
        >
          🚪 Logout
        </button>
      </div>

      {/* Flash message */}
      {flash && (
        <div
          style={{
            background: flash.includes("✅") ? "#d1fae5" : "#fee2e2",
            border: `1px solid ${flash.includes("✅") ? "#6ee7b7" : "#fca5a5"}`,
            color: flash.includes("✅") ? "#065f46" : "#7f1d1d",
            padding: "12px 16px",
            borderRadius: 10,
            marginBottom: 24,
            fontWeight: 600,
          }}
        >
          {flash}
        </div>
      )}

      {/* ── Tabs ── */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 28,
          borderBottom: "2px solid var(--border)",
          paddingBottom: 0,
          overflowX: "auto",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setTab(t.key);
              setShowRequestModal(false);
            }}
            style={{
              padding: "12px 20px",
              border: "none",
              background: "transparent",
              fontWeight: tab === t.key ? 700 : 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              color: tab === t.key ? "var(--crimson)" : "var(--text2)",
              borderBottom:
                tab === t.key ? "3px solid var(--crimson)" : "3px solid transparent",
              transition: "all 0.2s",
              marginBottom: -2,
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════
          OVERVIEW TAB
      ════════════════════════════════ */}
      {tab === "overview" && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
              marginBottom: 40,
            }}
          >
            <AnalyticsCard
              icon="👥"
              label="Total Students"
              value={totalStudents}
              subtext="Joined sessions"
              color="#10b981"
            />
            <AnalyticsCard
              icon="🎓"
              label="Active Sessions"
              value={totalSessions}
              subtext="Ready for students"
              color="#0c1f4a"
            />
            <AnalyticsCard
              icon="⏳"
              label="Pending Requests"
              value={pendingRequests}
              subtext={
                pendingRequests > 0
                  ? "Action needed"
                  : "All approved!"
              }
              color={pendingRequests > 0 ? "#f59e0b" : "#10b981"}
            />
            <AnalyticsCard
              icon="📊"
              label="Avg Band Score"
              value={avgBand}
              subtext={`From ${results.length} results`}
              color="#8b5cf6"
            />
          </div>

          {/* Quick actions */}
          <div
            style={{
              background: "#fff",
              border: "1.5px solid var(--border)",
              borderRadius: 16,
              padding: "28px",
              marginBottom: 40,
            }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--navy)",
                marginBottom: 16,
              }}
            >
              ⚡ Quick Actions
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 12,
              }}
            >
              <button
                onClick={() => setTab("sessions")}
                style={{
                  padding: "12px 16px",
                  background: "linear-gradient(135deg, #a81011, #d42022)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                🚀 Create Session
              </button>
              <button
                onClick={() => setTab("requests")}
                style={{
                  padding: "12px 16px",
                  background: "#fff",
                  color: "#f59e0b",
                  border: "1.5px solid #fcd34d",
                  borderRadius: 10,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                ⏳ Review Requests ({pendingRequests})
              </button>
              <button
                onClick={() => setTab("results")}
                style={{
                  padding: "12px 16px",
                  background: "#fff",
                  color: "#0c1f4a",
                  border: "1.5px solid var(--border)",
                  borderRadius: 10,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                📊 View Results ({results.length})
              </button>
            </div>
          </div>

          {/* Recent activity */}
          <div
            style={{
              background: "#fff",
              border: "1.5px solid var(--border)",
              borderRadius: 16,
              padding: "28px",
            }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--navy)",
                marginBottom: 16,
              }}
            >
              📋 Recent Activity
            </h2>

            {sessions.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "var(--text3)",
                  fontSize: "0.9rem",
              }}
              >
                No activity yet. Create a session to get started!
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {sessions.slice(-5).map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "12px",
                      background: "var(--bg2)",
                      borderRadius: 8,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        flexShrink: 0,
                      }}
                    >
                      {SKILL_ICONS[s.skill] || "📋"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p
                        style={{
                          fontWeight: 600,
                          color: "var(--navy)",
                          fontSize: "0.9rem",
                          margin: "0 0 2px 0",
                        }}
                      >
                        {s.testName}
                      </p>
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "var(--text3)",
                          margin: 0,
                        }}
                      >
                        {s.students.length} student{s.students.length !== 1 ? "s" : ""} • Code: {s.code}
                      </p>
                    </div>
                    <div
                      style={{
                        background: "var(--navy3)",
                        color: "#fff",
                        padding: "4px 10px",
                        borderRadius: 6,
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {s.code}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ════════════════════════════════
          SESSIONS TAB
      ════════════════════════════════ */}
      {tab === "sessions" && (
        <>
          {/* Create session form */}
          <div
            style={{
              background: "#fff",
              border: "1.5px solid var(--border)",
              borderRadius: 18,
              padding: "28px 32px",
              boxShadow: "var(--shadow-sm)",
              marginBottom: 32,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background:
                  "linear-gradient(90deg, var(--crimson), var(--crimson-light), var(--gold))",
              }}
            />
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "var(--navy)",
                marginBottom: 8,
              }}
            >
              🎓 Create Test Session
            </p>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--text2)",
                marginBottom: 24,
              }}
            >
              Choose a skill, test, and mode. Share the code with students to let them join.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 16,
                marginBottom: 20,
              }}
            >
              {/* Skill */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Skill</label>
                <select
                  className="form-select"
                  value={form.skill}
                  onChange={(e) =>
                    setForm({ ...form, skill: e.target.value, testId: "" })
                  }
                  style={{
                    padding: "10px 12px",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: "0.9rem",
                  }}
                >
                  {SKILLS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Test */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gridColumn: "span 2",
                }}
              >
                <label style={labelStyle}>Test</label>
                <select
                  className="form-select"
                  value={form.testId}
                  onChange={(e) =>
                    setForm({ ...form, testId: e.target.value, partNumber: 1 })
                  }
                  style={{
                    padding: "10px 12px",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: "0.9rem",
                  }}
                >
                  <option value="">— Select test —</option>
                  {tests
                    .filter((t) => t.skill === form.skill)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Mode */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <label style={labelStyle}>Mode</label>
                <select
                  className="form-select"
                  value={form.mode}
                  onChange={(e) => setForm({ ...form, mode: e.target.value })}
                  style={{
                    padding: "10px 12px",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    fontSize: "0.9rem",
                  }}
                >
                  <option value="single">Single Part</option>
                  <option value="full">Full Test</option>
                </select>
              </div>

              {/* Part */}
              {form.mode === "single" && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <label style={labelStyle}>Part</label>
                  <select
                    className="form-select"
                    value={form.partNumber}
                    onChange={(e) =>
                      setForm({ ...form, partNumber: Number(e.target.value) })
                    }
                    style={{
                      padding: "10px 12px",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: "0.9rem",
                    }}
                  >
                    {Array.from({ length: maxParts }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        Part {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Preview */}
            {form.testId && (
              <div
                style={{
                  background: "var(--bg2)",
                  borderRadius: 10,
                  padding: "12px 16px",
                  fontSize: "0.85rem",
                  color: "var(--text2)",
                  marginBottom: 20,
                }}
              >
                📌 Preview:&nbsp;
                <strong style={{ color: "var(--navy)" }}>
                  {SKILL_ICONS[form.skill]} {form.skill} · {selectedTest?.name}
                  {form.mode === "single"
                    ? ` · Part ${form.partNumber} only`
                    : " · Full test (all parts)"}
                </strong>
              </div>
            )}

            <button
              onClick={handleCreateSession}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "linear-gradient(135deg, #a81011, #d42022)",
                color: "#fff",
                border: "none",
                padding: "12px 28px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(168,16,17,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              🚀 Generate Code
            </button>
          </div>

          {/* Active sessions */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--navy)",
              }}
            >
              Active Sessions ({sessions.length})
            </h2>
            {sessions.length > 0 && (
              <button
                onClick={handleClearSessions}
                style={{
                  background: "none",
                  border: "1.5px solid rgba(239,68,68,0.3)",
                  color: "#dc2626",
                  padding: "8px 14px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
              >
                🗑️ Clear all
              </button>
            )}
          </div>

          {sessions.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 24px",
                background: "#fff",
                borderRadius: 16,
                border: "1.5px dashed var(--border2)",
              }}
            >
              <p style={{ fontSize: "2.5rem", marginBottom: 12 }}>🎓</p>
              <p style={{ color: "var(--text3)", fontWeight: 600, fontSize: "1rem" }}>
                No active sessions.
              </p>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text3)",
                  marginTop: 8,
                }}
              >
                Create a session above to get started.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {sessions.map((s) => {
                const sessionPendingRequests = requests.filter(
                  (r) => r.sessionCode === s.code
                ).length;
                return (
                  <SessionCard
                    key={s.code}
                    session={s}
                    onDelete={handleDeleteSession}
                    studentCount={s.students.length}
                    pendingRequests={sessionPendingRequests}
                    onManageRequests={() => {
                      setSelectedSessionCode(s.code);
                      setShowRequestModal(true);
                      setTab("requests");
                    }}
                  />
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ════════════════════════════════
          REQUESTS TAB
      ════════════════════════════════ */}
      {tab === "requests" && (
        <>
          {/* Filter by session */}
          {selectedSessionCode && showRequestModal && (
            <div
              style={{
                background: "#fff",
                border: "1.5px solid var(--border)",
                borderRadius: 14,
                padding: "16px 20px",
                marginBottom: 20,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <p
                style={{
                  fontWeight: 700,
                  color: "var(--navy)",
                  fontSize: "0.9rem",
                  margin: 0,
                }}
              >
                📋 {sessionRequestsSession?.testName || "Session"} · Requests:{" "}
                {sessionRequests.length}
              </p>
              <button
                onClick={() => {
                  setSelectedSessionCode(null);
                  setShowRequestModal(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text3)",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                ✕ Close
              </button>
            </div>
          )}

          {/* All requests or filtered */}
          {(selectedSessionCode && showRequestModal
            ? sessionRequests
            : requests
          ).length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 24px",
                background: "#fff",
                borderRadius: 16,
                border: "1.5px solid var(--border)",
              }}
            >
              <p style={{ fontSize: "2.5rem", marginBottom: 12 }}>📭</p>
              <p
                style={{
                  color: "var(--text3)",
                  fontWeight: 600,
                  fontSize: "1rem",
                }}
              >
                No join requests.
              </p>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text3)",
                  marginTop: 8,
                }}
              >
                Requests will appear here when students try to join a session.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {(selectedSessionCode && showRequestModal
                ? sessionRequests
                : requests
              ).map((req) => {
                const session = sessions.find((s) => s.code === req.sessionCode);
                return (
                  <JoinRequestCard
                    key={req.id}
                    request={req}
                    session={session}
                    onApprove={handleApproveRequest}
                    onReject={handleRejectRequest}
                  />
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ════════════════════════════════
          RESULTS TAB
      ════════════════════════════════ */}
      {tab === "results" && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--navy)",
              }}
            >
              Student Results ({results.length})
            </h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={refreshResults}
                style={{
                  padding: "8px 16px",
                  background: "#fff",
                  color: "var(--text2)",
                  border: "1.5px solid var(--border)",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                }}
              >
                🔄 Refresh
              </button>
              {results.length > 0 && (
                <button
                  onClick={clearResults}
                  style={{
                    padding: "8px 16px",
                    background: "#fff",
                    color: "#dc2626",
                    border: "1.5px solid rgba(239,68,68,0.3)",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                  }}
                >
                  🗑️ Clear
                </button>
              )}
            </div>
          </div>

          <div
            style={{
              background: "#fff",
              border: "1.5px solid var(--border)",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <ResultsTable results={results} />
          </div>
        </>
      )}
    </div>
  );
}