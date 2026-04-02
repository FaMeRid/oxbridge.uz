// src/pages/Admin.jsx
import React, { useState } from "react";
import "@/styles/globals.css";
import "@/styles/admin.css";
import { useClassroomStore } from "@/features/classroom/ClassroomStore";

const STORAGE_KEY = "oxbridge_tests";
const ADMIN_PASS  = "admin2026";
const SKILLS      = ["Listening", "Reading", "Writing", "Speaking"];

/* ── helpers ── */
function generateCode(testId, part) {
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `L${testId}P${part + 1}-${rand}`;
}

function loadTests() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}

function saveTests(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

/* ══════════════════════════════════════════
   PASSWORD GATE
══════════════════════════════════════════ */
function PasswordGate({ onUnlock }) {
  const [pass, setPass]   = useState("");
  const [err,  setErr]    = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (pass === ADMIN_PASS) {
      onUnlock();
    } else {
      setErr(true);
      setPass("");
      setTimeout(() => setErr(false), 2000);
    }
  };

  return (
    <div className="admin-gate">
      <div className="admin-gate-box">
        <span className="admin-gate-icon">🛡️</span>
        <h2>Admin Panel</h2>
        <p>Enter password to continue</p>
        <form onSubmit={submit}>
          <input
            type="password"
            className={`form-input${err ? " input-error" : ""}`}
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            autoFocus
          />
          {err && <p className="gate-error">Wrong password ❌</p>}
          <button className="btn-primary" style={{ width: "100%", marginTop: 16 }}>
            Unlock
          </button>
        </form>
        <p className="gate-hint">Admin access only</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   STATS ROW
══════════════════════════════════════════ */
function StatsRow({ tests }) {
  const listening = tests.filter((t) => t.skill === "Listening").length;
  const reading   = tests.filter((t) => t.skill === "Reading").length;

  return (
    <div className="admin-stats-row">
      {[
        { icon: "📋", num: tests.length, label: "Total Tests", cls: "total" },
        { icon: "🎧", num: listening,    label: "Listening" },
        { icon: "📖", num: reading,      label: "Reading" },
        { icon: "✍️",  num: tests.filter((t) => t.skill === "Writing").length,  label: "Writing" },
        { icon: "🗣️", num: tests.filter((t) => t.skill === "Speaking").length, label: "Speaking" },
      ].map((s) => (
        <div key={s.label} className={`admin-stat-card${s.cls ? " " + s.cls : ""}`}>
          <span className="admin-stat-icon">{s.icon}</span>
          <div className="admin-stat-num">{s.num}</div>
          <div className="admin-stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN ADMIN
══════════════════════════════════════════ */
export default function Admin() {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem("admin_unlocked") === "true"
  );

  const [tests,   setTests]   = useState(loadTests);
  const [filter,  setFilter]  = useState("All");
  const [success, setSuccess] = useState("");

  const [newTest, setNewTest] = useState({
    name: "", skill: "Listening", parts: 1,
  });

  const [sessionConfig, setSessionConfig] = useState({
    testId: "", part: 1,
  });

  const createSession = useClassroomStore((s) => s.createSession);

  /* unlock */
  const unlock = () => {
    sessionStorage.setItem("admin_unlocked", "true");
    setUnlocked(true);
  };

  /* show temporary success message */
  const flash = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3000);
  };

  /* ── Add Test ── */
  const addTest = () => {
    if (!newTest.name.trim()) return alert("Enter test name");

    const test = {
      id:    Date.now(),
      name:  newTest.name.trim(),
      skill: newTest.skill,
      parts: newTest.parts,
    };

    const updated = [...tests, test];
    setTests(updated);
    saveTests(updated);
    setNewTest({ name: "", skill: "Listening", parts: 1 });
    flash("✅ Test created!");
  };

  /* ── Delete Test ── */
  const deleteTest = (id) => {
    if (!window.confirm("Delete this test?")) return;
    const updated = tests.filter((t) => t.id !== id);
    setTests(updated);
    saveTests(updated);
  };

  /* ── Upload JSON ── */
  const handleUploadJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);

        if (!json.name || !json.parts) {
          return alert("❌ Invalid test format (need name + parts)");
        }

        const imported = { ...json, id: Date.now() };
        const updated  = [...tests, imported];
        setTests(updated);
        saveTests(updated);
        flash("✅ Test uploaded!");
      } catch {
        alert("❌ Invalid JSON file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  /* ── Create Session ── */
  const handleCreateSession = () => {
    const test = tests.find((t) => t.id == sessionConfig.testId);
    if (!test) return alert("Select a test first");

    const partIndex = sessionConfig.part - 1;
    const session = {
      id:       Date.now(),
      type:     test.skill.toLowerCase(),
      testId:   test.id,
      part:     sessionConfig.part,
      code:     generateCode(test.id, partIndex),
      students: [],
    };

    createSession(session);
    flash(`🎓 Session created! Code: ${session.code}`);
    alert(`Session Code: ${session.code}`);
  };

  /* ── Reset All ── */
  const handleReset = () => {
    if (!window.confirm("Delete ALL tests? This cannot be undone.")) return;
    setTests([]);
    saveTests([]);
    flash("Tests cleared.");
  };

  /* ── Filtered list ── */
  const visible = filter === "All" ? tests : tests.filter((t) => t.skill === filter);

  if (!unlocked) return <PasswordGate onUnlock={unlock} />;

  return (
    <div className="admin-page">

      {/* ─── TOPBAR ─── */}
      <div className="admin-topbar">
        <div>
          <p className="admin-eyebrow">Oxbridge · Admin</p>
          <h1 className="admin-title">Admin Dashboard 🛡️</h1>
        </div>
        <button className="admin-danger-btn" onClick={handleReset}>
          🗑️ Clear All Tests
        </button>
      </div>

      {/* ─── STATS ─── */}
      <StatsRow tests={tests} />

      {/* ─── SUCCESS FLASH ─── */}
      {success && <div className="admin-success">{success}</div>}

      {/* ─── CREATE TEST FORM ─── */}
      <div className="admin-form">
        <p className="admin-form-title">➕ Create New Test</p>
        <div className="admin-form-row">

          <div className="admin-field">
            <label>Test name</label>
            <input
              className="form-input"
              placeholder="e.g. Cambridge 20 Test 1"
              value={newTest.name}
              onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && addTest()}
            />
          </div>

          <div className="admin-field">
            <label>Skill</label>
            <select
              className="form-select"
              value={newTest.skill}
              onChange={(e) => setNewTest({ ...newTest, skill: e.target.value })}
            >
              {SKILLS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="admin-field" style={{ maxWidth: 120 }}>
            <label>Parts</label>
            <input
              type="number"
              className="form-input"
              min="1"
              max="4"
              value={newTest.parts}
              onChange={(e) => setNewTest({ ...newTest, parts: Number(e.target.value) })}
            />
          </div>

          <div className="admin-field" style={{ justifyContent: "flex-end" }}>
            <label style={{ opacity: 0 }}>Go</label>
            <button className="btn-primary" onClick={addTest}>
              ➕ Create
            </button>
          </div>

        </div>
      </div>

      {/* ─── UPLOAD JSON ─── */}
      <div className="admin-form">
        <p className="admin-form-title">📂 Upload JSON Test</p>
        <p style={{ fontSize: "0.85rem", color: "var(--text2)", marginBottom: 14 }}>
          Upload a test in the standard format: <code style={{ background: "var(--bg2)", padding: "2px 8px", borderRadius: 6 }}>{"{ id, name, skill, parts: [...] }"}</code>
        </p>
        <input
          type="file"
          accept=".json"
          className="form-input"
          style={{ cursor: "pointer" }}
          onChange={handleUploadJSON}
        />
      </div>

      {/* ─── TEST LIST ─── */}
      <div className="admin-toolbar">
        <p className="admin-list-header">{visible.length} test{visible.length !== 1 ? "s" : ""}</p>
        <div className="admin-filter-tabs">
          {["All", ...SKILLS].map((f) => (
            <button
              key={f}
              className={`admin-filter-tab${filter === f ? " active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="admin-empty">
          <p style={{ fontSize: "2rem", marginBottom: 12 }}>📭</p>
          <p style={{ color: "var(--text3)", fontWeight: 600 }}>No tests yet. Create one above.</p>
        </div>
      ) : (
        <div className="admin-tests-grid">
          {visible.map((t) => (
            <div key={t.id} className="admin-test-card">
              <div className="admin-test-card-top">
                <span className="admin-test-skill-badge">{t.skill}</span>
                <button
                  className="admin-delete-btn"
                  onClick={() => deleteTest(t.id)}
                  title="Delete"
                >
                  ✕
                </button>
              </div>
              <div className="admin-test-name">{t.name}</div>
              <div className="admin-test-meta">
                <span>📄 {t.parts} part{t.parts !== 1 ? "s" : ""}</span>
                <span style={{ color: "var(--crimson)", fontWeight: 700 }}>🆓 Free</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── SESSION CREATOR ─── */}
      <div className="admin-form" style={{ marginTop: 32 }}>
        <p className="admin-form-title">🎓 Create Teacher Session</p>
        <p style={{ fontSize: "0.85rem", color: "var(--text2)", marginBottom: 16 }}>
          Generate a code that students can use at <strong>/jointest</strong> to start a specific test.
        </p>
        <div className="admin-form-row">

          <div className="admin-field">
            <label>Select test</label>
            <select
              className="form-select"
              value={sessionConfig.testId}
              onChange={(e) => setSessionConfig({ ...sessionConfig, testId: e.target.value })}
            >
              <option value="">— choose test —</option>
              {tests.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.skill})
                </option>
              ))}
            </select>
          </div>

          <div className="admin-field" style={{ maxWidth: 120 }}>
            <label>Part #</label>
            <input
              type="number"
              className="form-input"
              min="1"
              max="4"
              value={sessionConfig.part}
              onChange={(e) => setSessionConfig({ ...sessionConfig, part: Number(e.target.value) })}
            />
          </div>

          <div className="admin-field" style={{ justifyContent: "flex-end" }}>
            <label style={{ opacity: 0 }}>Go</label>
            <button className="btn-primary" onClick={handleCreateSession}>
              🚀 Generate Code
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
