// src/pages/Practice.jsx
import React, { useState } from "react";
import { useLocation, Link } from "wouter";
import "@/styles/globals.css";

/* ── Конфиг скиллов ── */
const SKILL_ICONS = {
  Listening: "🎧",
  Reading:   "📖",
  Writing:   "✍️",
  Speaking:  "🗣️",
  FullMock:  "🚀",
};

/* ── Список тестов ── */
const TEST_LIST = {
  Listening: [
    { id: 1, name: "Listening Test 1 ", duration: "40 min", difficulty: "Foundation",   parts: 4 },
    { id: 2, name: "Listening Test 2 ", duration: "40 min", difficulty: "Intermediate", parts: 4 },
    { id: 3, name: "Listening Test 3 ", duration: "40 min", difficulty: "Advanced",     parts: 4 },
    { id: 4, name: "Listening Test 4 ", duration: "40 min", difficulty: "Expert",       parts: 4 },
  ],
  Reading: [
    { id: 1, name: "Reading Test 1 ",  duration: "60 min", difficulty: "Foundation",   parts: 3 },
    { id: 2, name: "Reading Test 2 ",  duration: "60 min", difficulty: "Intermediate", parts: 3 },
    { id: 3, name: "Reading Test 3 ",  duration: "60 min", difficulty: "Advanced",     parts: 3 },
  ],
  Writing: [
    { id: 1, name: "Writing Test 1 ", duration: "20 min", difficulty: "Foundation",   parts: 1 },
    { id: 2, name: "Writing Test 2 ", duration: "40 min", difficulty: "Intermediate", parts: 1 },
    { id: 3, name: "Writing Test 3 ", duration: "20 min", difficulty: "Advanced",     parts: 1 },
    { id: 4, name: "Writing Test 4 ", duration: "40 min", difficulty: "Expert",       parts: 1 },
  ],
  Speaking: [
    { id: 1, name: "Speaking Mock 1", duration: "15 min", difficulty: "Foundation",   parts: 3 },
    { id: 2, name: "Speaking Mock 2", duration: "15 min", difficulty: "Intermediate", parts: 3 },
    { id: 3, name: "Speaking Mock 3", duration: "15 min", difficulty: "Advanced",     parts: 3 },
  ],
};

const SKILL_ROUTES = {
  Listening: "/listening",
  Reading:   "/reading",
  Writing:   "/writing",
  Speaking:  "/speaking",
};

const DIFF_COLORS = {
  Foundation:   { bg: "#eff4ff", color: "#1e5dbf", border: "rgba(30,93,191,0.2)" },
  Intermediate: { bg: "#edfaf5", color: "#0d7c59", border: "rgba(13,124,89,0.2)" },
  Advanced:     { bg: "#fdf6dc", color: "#c9a227", border: "rgba(201,162,39,0.3)" },
  Expert:       { bg: "#fdecea", color: "#a81011", border: "rgba(168,16,17,0.2)" },
};

/* ══════════════════════════════════════════
   MODAL
══════════════════════════════════════════ */
function StartModal({ test, skill, onClose, onStart }) {
  if (!test) return null;

  const dc = DIFF_COLORS[test.difficulty];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>

        {/* Close */}
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* Icon + title */}
        <span className="modal-icon">{SKILL_ICONS[skill]}</span>
        <h3 className="modal-title">{test.name}</h3>
        <p className="modal-subtitle">
          Get ready to test your {skill.toLowerCase()} skills! 💪<br />
          Find a quiet place before you begin.
        </p>

        {/* Info row */}
        <div style={{
          display:      "flex",
          gap:          10,
          flexWrap:     "wrap",
          background:   "var(--bg2)",
          borderRadius: 12,
          padding:      "14px 18px",
          marginBottom: 20,
          fontSize:     "0.82rem",
          color:        "var(--text2)",
        }}>
          <span>⏱ <strong>{test.duration}</strong></span>
          <span>📄 <strong>{test.parts} parts</strong></span>
          <span style={{
            background:   dc.bg,
            color:        dc.color,
            border:       `1px solid ${dc.border}`,
            padding:      "2px 12px",
            borderRadius: 999,
            fontWeight:   700,
            fontSize:     "0.74rem",
          }}>
            {test.difficulty}
          </span>
        </div>

        {/* Instructions */}
        <ul style={{ marginBottom: 24, paddingLeft: 20, color: "var(--text2)", fontSize: "0.87rem", lineHeight: 2 }}>
          <li>Do not close the browser tab during the test</li>
          <li>Your answers are saved automatically</li>
          <li>Timer starts immediately after clicking Start</li>
          <li>You cannot pause once the test begins</li>
          <li style={{ listStyle: "none", marginLeft: -20, marginTop: 8, padding: "10px 14px", background: "var(--bg2)", borderRadius: 10, fontSize: "0.82rem" }}>
            <strong>Teacher-assigned practice</strong> (e.g. one part only) uses a code on{" "}
            <Link href="/jointest" style={{ color: "var(--crimson)", fontWeight: 700 }}>Join test</Link>
            — you cannot pick a single part from here.
          </li>
        </ul>

        {/* Actions — students always start the full test; teachers assign partial practice via /teacher + code */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={() => onStart(test, skill, 0, "full")}
          >
            🚀 Start Full Test
          </button>
          <button
            className="btn-secondary"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={onClose}
          >
            ← Go Back
          </button>
        </div>

      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function Practice() {
  const [, navigate]    = useLocation();
  const [selectedSkill, setSelectedSkill] = useState("Listening");
  const [modalTest,     setModalTest]     = useState(null);

  /* открыть модалку */
  const openModal = (test) => setModalTest(test);

  /* закрыть модалку */
  const closeModal = () => setModalTest(null);

  /* ── СТАРТ ТЕСТА ── */
  const handleStart = (test, skill, startPart, mode) => {
    // Сохраняем сессию в sessionStorage
    const session = {
      testId:    test.id,
      skill:     skill.toLowerCase(),
      startPart,
      mode,
      testName:  test.name,
      assignedByTeacher: false,
    };
    sessionStorage.setItem("current_session", JSON.stringify(session));

    // Переходим на страницу скилла
    const route = SKILL_ROUTES[skill] || "/listening";
    navigate(route);
  };

  const tests = TEST_LIST[selectedSkill] || [];

  return (
    <div className="practice-layout">

      {/* ── SIDEBAR ── */}
      <aside className="practice-sidebar">
        <p className="practice-sidebar-title">📚 Skills</p>

        {Object.keys(TEST_LIST).map((skill) => (
          <button
            key={skill}
            onClick={() => { setSelectedSkill(skill); closeModal(); }}
            className={`practice-skill-btn${selectedSkill === skill ? " active" : ""}`}
          >
            {SKILL_ICONS[skill]} {skill}
          </button>
        ))}

        <div style={{ height: 1, background: "var(--border)", margin: "12px 0" }} />

        <button
          onClick={() => { setSelectedSkill("FullMock"); closeModal(); }}
          className={`practice-skill-btn mock-btn${selectedSkill === "FullMock" ? " active" : ""}`}
        >
          🚀 Full Mock
        </button>

        <div className="practice-sidebar-progress">
          <p className="practice-sidebar-progress-label">🏅 Progress</p>
          <div className="progress-bar-thin">
            <div className="progress-bar-fill" style={{ width: "45%" }} />
          </div>
          <p className="progress-bar-pct">45% complete</p>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="practice-main">

        {selectedSkill === "FullMock" ? (
          <FullMockSection onStart={handleStart} />
        ) : (
          <>
            {/* Header */}
            <div className="practice-skill-header">
              <div className="practice-skill-icon">{SKILL_ICONS[selectedSkill]}</div>
              <div>
                <p className="practice-skill-title">{selectedSkill}</p>
                <p className="practice-skill-subtitle">{tests.length} tests available 📝</p>
              </div>
            </div>

            {/* Mini stats */}
            <div className="practice-stats-row">
              {[
                { icon: "📊", val: 0,       label: "Attempts" },
                { icon: "🏆", val: "—",     label: "Best Score" },
                { icon: "📈", val: "—",     label: "Avg Score" },
                { icon: "⏱️", val: "00:00", label: "Avg Time" },
              ].map((s) => (
                <div key={s.label} className="practice-mini-stat">
                  <div className="practice-mini-stat-icon">{s.icon}</div>
                  <div className="practice-mini-stat-val">{s.val}</div>
                  <div className="practice-mini-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Test cards */}
            <p className="practice-section-title">📝 {selectedSkill} Tests</p>
            <div className="practice-tests-grid">
              {tests.map((test) => {
                const dc = DIFF_COLORS[test.difficulty];
                return (
                  <div key={test.id} className="test-card">
                    <div className="test-card-top">
                      <span className="test-card-name">{test.name}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text3)" }}>🆓</span>
                    </div>

                    <span
                      className="test-diff-badge"
                      style={{ background: dc.bg, color: dc.color, borderColor: dc.border }}
                    >
                      {test.difficulty}
                    </span>

                    <div className="test-card-meta">
                      <span>⏱ {test.duration}</span>
                      <span>📄 {test.parts} parts</span>
                    </div>

                    <button
                      className="test-start-btn"
                      onClick={() => openModal(test)}
                    >
                      Start Test →
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* ── MODAL ── */}
      {modalTest && (
        <StartModal
          test={modalTest}
          skill={selectedSkill}
          onClose={closeModal}
          onStart={handleStart}
        />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   FULL MOCK SECTION
══════════════════════════════════════════ */
function FullMockSection({ onStart }) {
  const mockTest = { id: 1, name: "Full Mock Test — Set 1", duration: "~2h 45min", difficulty: "Advanced", parts: 4 };

  return (
    <div className="fullmock-section">
      <div className="practice-skill-header">
        <div className="practice-skill-icon">🚀</div>
        <div>
          <p className="practice-skill-title">Full Mock Test</p>
          <p className="practice-skill-subtitle">Complete IELTS simulation — all 4 skills 📝</p>
        </div>
      </div>

      <div className="fullmock-info-card">
        <div className="fullmock-info-row">
          <span className="fullmock-info-item">⏱ Duration: <strong>~2h 45min</strong></span>
          <span className="fullmock-info-item">📋 Sections: <strong>4</strong></span>
          <span className="fullmock-info-item">❓ Questions: <strong>120+</strong></span>
          <span className="fullmock-info-item">🆓 Free</span>
        </div>
      </div>

      <p className="practice-section-title" style={{ marginBottom: 20 }}>📦 What's Included</p>
      <div className="fullmock-breakdown">
        {[
          { icon: "🎧", skill: "Listening", time: "40 min", q: "40 questions", color: "#c9a227" },
          { icon: "📖", skill: "Reading",   time: "60 min", q: "40 questions", color: "#0d7c59" },
          { icon: "✍️",  skill: "Writing",   time: "60 min", q: "2 tasks",      color: "#1e5dbf" },
          { icon: "🗣️", skill: "Speaking",  time: "15 min", q: "3 parts",      color: "#a81011" },
        ].map((s) => (
          <div key={s.skill} className="fullmock-part-card">
            <div className="fullmock-part-icon" style={{ background: `${s.color}18`, color: s.color }}>
              {s.icon}
            </div>
            <div>
              <p className="fullmock-part-name">{s.skill}</p>
              <p className="fullmock-part-meta">{s.time} · {s.q}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="fullmock-actions">
        <button
          className="btn-primary big"
          onClick={() => onStart(mockTest, "Listening", 0, "full")}
        >
          🚀 Start Full Mock Test
        </button>
        <p className="fullmock-note">
          💡 Make sure you have enough time before starting.
        </p>
      </div>
    </div>
  );
}
