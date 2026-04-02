// src/features/test/TestEngine.jsx
import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Question           from "@/components/test/Question";
import AudioPlayer        from "@/components/test/AudioPlayer";
import ListeningNotesTable from "@/components/test/ListeningNotesTable";
import ProgressBar from "@/components/test/ProgressBar";
import Answer      from "@/components/test/Answer";
import { getBand, formatTime, questionMaxPoints, isQuestionAnswered } from "@/utils/helpers";
import { loadTestHistory, saveTestHistory } from "@/utils/testHistoryStorage";
import { useAuthStore } from "@/features/auth/authStore";

/* ══════════════════════════════════════════
   INLINE RESULT PAGE
   (используем свой, не компонент из /pages)
══════════════════════════════════════════ */
function TestResult({ score, total, parts, answers, studentName, testName, onRetry }) {
  const band      = getBand(score);
  const pct       = total > 0 ? Math.round((score / total) * 100) : 0;
  const bandColor = band >= 7 ? "#0d7c59" : band >= 6 ? "#c9a227" : "#a81011";

  // Собираем все вопросы из всех частей
  const allQuestions = parts.flatMap((p) => p.questions || []);

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}>

      {/* ── Hero card ── */}
      <div style={{
        background:   "linear-gradient(135deg, #0c1f4a, #1e293b)",
        borderRadius: 20, padding: "40px 36px",
        marginBottom: 32, textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,16,17,0.25) 0%, transparent 70%)" }} />

        {studentName && (
          <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>
            {studentName}
          </p>
        )}

        <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
          Test Complete
        </p>

        {/* Band */}
        <div style={{
          display: "inline-flex", flexDirection: "column", alignItems: "center",
          background: `${bandColor}22`, border: `2px solid ${bandColor}`,
          borderRadius: 16, padding: "20px 40px", marginBottom: 24,
        }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: bandColor, marginBottom: 6 }}>
            IELTS Band
          </span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.5rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
            {band}
          </span>
        </div>

        {/* Score + percent */}
        <div style={{ display: "flex", justifyContent: "center", gap: 32 }}>
          <div>
            <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 4 }}>Score</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}>{score} / {total}</p>
          </div>
          <div>
            <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 4 }}>Accuracy</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}>{pct}%</p>
          </div>
          <div>
            <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 4 }}>Wrong</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 800, color: "#fff" }}>{total - score}</p>
          </div>
        </div>
      </div>

      {/* ── Progress bar visual ── */}
      <div style={{
        background: "#fff", border: "1px solid var(--border)",
        borderRadius: 16, padding: "22px 28px", marginBottom: 28,
        boxShadow: "var(--shadow-sm)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: "0.8rem", color: "var(--text3)", fontWeight: 600 }}>
          <span>0</span><span>Progress</span><span>{total}</span>
        </div>
        <div style={{ height: 14, background: "var(--bg2)", borderRadius: 999, overflow: "hidden", border: "1px solid var(--border)" }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: `linear-gradient(90deg, ${bandColor}, ${bandColor}cc)`,
            borderRadius: 999, transition: "width 1s ease",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: "0.8rem" }}>
          <span style={{ color: "#0d7c59", fontWeight: 700 }}>✓ {score} correct</span>
          <span style={{ color: "#a81011", fontWeight: 700 }}>✗ {total - score} wrong</span>
        </div>
      </div>

      {/* ── Answer breakdown ── */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "var(--navy)", marginBottom: 16 }}>
          📋 Answer Review
        </h3>

        {parts.map((p, pi) => (
          <div key={pi} style={{ marginBottom: 24 }}>
            <p style={{
              fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "1.5px", color: "var(--text3)", marginBottom: 10,
              paddingBottom: 8, borderBottom: "1px solid var(--border)",
            }}>
              {p.title || `Part ${pi + 1}`}
            </p>
            {(p.questions || []).map((q) => (
              <Answer key={q.id} q={q} userAnswer={answers[q.id]} />
            ))}
          </div>
        ))}
      </div>

      {/* ── Actions ── */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button className="btn-primary" onClick={onRetry}>
          🔄 Try Again
        </button>
        <button className="btn-secondary" onClick={() => window.location.href = "/practice"}>
          ← Back to Practice
        </button>
        <button className="btn-secondary" onClick={() => window.location.href = "/"}>
          🏠 Dashboard
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   TEST ENGINE
══════════════════════════════════════════ */
export default function TestEngine({
  test,
  startPart = 0,
  mode      = "full",
}) {
  // Если single — оборачиваем в массив
  const parts = mode === "single" ? [test.parts?.[startPart] || test] : (test.parts || []);

  // Читаем имя студента и название теста из сессии
  const user = useAuthStore((s) => s.user);
  const userRef = useRef(user);
  userRef.current = user;

  const session     = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem("current_session")) || {}; }
    catch { return {}; }
  }, []);

  const studentName = session.studentName || "";
  const testName    = session.testName || test?.name || "IELTS Test";

  const [currentPart, setCurrentPart] = useState(0);
  const [answers,     setAnswers]     = useState({});
  const [finished,    setFinished]    = useState(false);
  const [time,        setTime]        = useState(
    mode === "single" ? 10 * 60 : 40 * 60
  );

  const part = parts[currentPart];

  /* ── Все хуки до любого return (правила React) ── */
  useEffect(() => {
    if (finished) return;
    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) { clearInterval(timer); setFinished(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [finished]);

  const setAnswer = useCallback((id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const score = useMemo(() => {
    let s = 0;
    parts.forEach((p) => {
      (p.questions || []).forEach((q) => {
        const user = answers[q.id];
        if (!user) return;
        const pts = questionMaxPoints(q);
        if (Array.isArray(q.answer)) {
          if (Array.isArray(user) && q.answer.length === user.length && q.answer.every((a) => user.includes(a))) {
            s += pts;
          }
        } else if (user.toString().toLowerCase().trim() === q.answer.toString().toLowerCase().trim()) {
          s += pts;
        }
      });
    });
    return s;
  }, [answers, parts]);

  const totalQuestions = useMemo(
    () =>
      parts.reduce(
        (acc, p) => acc + (p.questions || []).reduce((a, q) => a + questionMaxPoints(q), 0),
        0
      ),
    [parts]
  );

  const totalSlots = useMemo(
    () => parts.reduce((acc, p) => acc + (p.questions?.length || 0), 0),
    [parts]
  );

  const answeredSlotsAll = useMemo(
    () =>
      parts.reduce(
        (acc, p) =>
          acc + (p.questions || []).filter((q) => isQuestionAnswered(q, answers)).length,
        0
      ),
    [parts, answers]
  );

  useEffect(() => {
    if (!finished) return;

    const band = getBand(score);
    const resultEntry = {
      name:     studentName || "Student",
      testName,
      score,
      total:    totalQuestions,
      band,
      date:     new Date().toISOString(),
      mode,
      skill:    session.skill || "listening",
    };

    const u = userRef.current;
    const history = loadTestHistory(u);
    history.push(resultEntry);
    saveTestHistory(u, history);

    const classResults = JSON.parse(localStorage.getItem("class_results")) || [];
    classResults.push(resultEntry);
    localStorage.setItem("class_results", JSON.stringify(classResults));
  }, [finished, score, totalQuestions, studentName, testName, mode, session.skill]);

  const handleRetry = useCallback(() => {
    setAnswers({});
    setCurrentPart(0);
    setFinished(false);
    setTime(mode === "single" ? 10 * 60 : 40 * 60);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [mode]);

  const nextPart = useCallback(() => {
    if (currentPart < parts.length - 1) {
      setCurrentPart((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setFinished(true);
    }
  }, [currentPart, parts.length]);

  const prevPart = useCallback(() => {
    if (currentPart > 0) {
      setCurrentPart((p) => p - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPart]);

  /* ── Guards (после хуков) ── */
  if (!parts || parts.length === 0) {
    return (
      <div className="page-wrap" style={{ textAlign: "center", paddingTop: 60 }}>
        <p style={{ fontSize: "2rem", marginBottom: 12 }}>⚠️</p>
        <p style={{ color: "var(--text2)" }}>Test data not found.</p>
      </div>
    );
  }

  if (finished) {
    return (
      <TestResult
        score={score}
        total={totalQuestions}
        parts={parts}
        answers={answers}
        studentName={studentName}
        testName={testName}
        onRetry={handleRetry}
      />
    );
  }

  if (!part) {
    return (
      <div className="page-wrap" style={{ textAlign: "center", paddingTop: 60 }}>
        <p style={{ color: "var(--text2)" }}>Part not found.</p>
      </div>
    );
  }

  const answeredInPart = (part.questions || []).filter((q) => isQuestionAnswered(q, answers)).length;
  const timerColor = time < 60 ? "#a81011" : time < 300 ? "#c9a227" : "var(--navy)";
  const isNotesTable = part.layout === "listening-notes-table" && part.notesTable;

  return (
    <div style={{ maxWidth: isNotesTable ? 1100 : 760, margin: "0 auto", padding: "28px 24px 80px" }}>

      {/* ── Top bar: timer + student name + part nav ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12, marginBottom: 20,
        background: "#fff", border: "1px solid var(--border)",
        borderRadius: 14, padding: "14px 20px",
        boxShadow: "var(--shadow-sm)", position: "sticky", top: 76, zIndex: 100,
      }}>
        {/* Student name */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {studentName && (
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--crimson), var(--crimson-light))",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "12px", fontWeight: 700, flexShrink: 0,
            }}>
              {studentName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            {studentName && <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", lineHeight: 1.2 }}>{studentName}</p>}
            <p style={{ fontSize: "0.72rem", color: "var(--text3)" }}>{testName}</p>
          </div>
        </div>

        {/* Part pills */}
        {parts.length > 1 && (
          <div style={{ display: "flex", gap: 6 }}>
            {parts.map((_, i) => {
              const partAnswered = (parts[i].questions || []).filter((q) =>
                isQuestionAnswered(q, answers)
              ).length;
              const partTotal = parts[i].questions?.length || 0;
              const partDone  = partAnswered === partTotal && partTotal > 0;

              return (
                <div
                  key={i}
                  style={{
                    width: 32, height: 32, borderRadius: 8,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.75rem", fontWeight: 700, cursor: "pointer",
                    background: i === currentPart
                      ? "linear-gradient(135deg, var(--crimson), var(--crimson-light))"
                      : partDone ? "#edfaf5" : "var(--bg2)",
                    color: i === currentPart ? "#fff" : partDone ? "#0d7c59" : "var(--text2)",
                    border: i === currentPart ? "none" : `1px solid ${partDone ? "rgba(13,124,89,0.3)" : "var(--border)"}`,
                    transition: "all 0.2s",
                  }}
                  onClick={() => setCurrentPart(i)}
                  title={`Part ${i + 1}`}
                >
                  {partDone ? "✓" : i + 1}
                </div>
              );
            })}
          </div>
        )}

        {/* Timer */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: time < 60 ? "#fff0f0" : time < 300 ? "#fdf6dc" : "var(--bg2)",
          border: `1px solid ${time < 60 ? "rgba(168,16,17,0.25)" : time < 300 ? "rgba(201,162,39,0.3)" : "var(--border)"}`,
          borderRadius: 10, padding: "8px 14px",
        }}>
          <span style={{ fontSize: "0.9rem" }}>⏱</span>
          <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: "1rem", color: timerColor }}>
            {formatTime(time)}
          </span>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <ProgressBar
        current={answeredSlotsAll}
        total={totalSlots}
        part={currentPart}
      />

      {/* ── Audio player ── */}
      {part.audio && (
        <div style={{ marginBottom: 20 }}>
          <AudioPlayer src={part.audio} preventSeekBack={!!part.audioPreventSeekBack} />
        </div>
      )}

      {/* ── Part title ── */}
      <div style={{
        background: "#fff", border: "1px solid var(--border)",
        borderRadius: 14, padding: "18px 22px", marginBottom: 24,
        boxShadow: "var(--shadow-sm)",
      }}>
        <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: "var(--crimson)", marginBottom: 6 }}>
          Part {currentPart + 1} of {parts.length}
        </p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "var(--navy)", marginBottom: 4 }}>
          {part.title}
        </h2>
        {part.instructions && (
          <p style={{ fontSize: "0.88rem", color: "var(--text2)", marginBottom: 10, lineHeight: 1.5 }}>
            <strong>{part.instructions}</strong>
          </p>
        )}
        <p style={{ fontSize: "0.78rem", color: "var(--text3)" }}>
          {answeredInPart} / {part.questions?.length || 0} answered
        </p>
      </div>

      {/* ── Notes table (IELTS-style) or question cards ── */}
      {isNotesTable ? (
        <ListeningNotesTable
          columns={part.notesTable.columns}
          rows={part.notesTable.rows}
          answers={answers}
          onChange={setAnswer}
          questions={part.questions}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
          {(part.questions || []).map((q, idx) => {
            const qAnswered = isQuestionAnswered(q, answers);
            const slotBefore = parts
              .slice(0, currentPart)
              .reduce((acc, p) => acc + (p.questions?.length || 0), 0);
            return (
              <div
                key={q.id}
                style={{
                  background: "#fff", border: `1.5px solid ${qAnswered ? "rgba(13,124,89,0.3)" : "var(--border)"}`,
                  borderRadius: 14, padding: "20px 22px",
                  boxShadow: "var(--shadow-sm)",
                  transition: "border-color 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    background: qAnswered
                      ? "linear-gradient(135deg, #0d7c59, #10a376)"
                      : "linear-gradient(135deg, var(--navy3), #1e3a7a)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: "0.75rem", fontWeight: 800,
                  }}>
                    {qAnswered ? "✓" : slotBefore + idx + 1}
                  </div>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Question {slotBefore + idx + 1}
                  </span>
                </div>

                <Question q={q} value={answers[q.id]} onChange={setAnswer} />
              </div>
            );
          })}
        </div>
      )}

      {/* ── Navigation ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 12, flexWrap: "wrap",
        background: "#fff", border: "1px solid var(--border)",
        borderRadius: 14, padding: "16px 22px",
        boxShadow: "var(--shadow-sm)",
      }}>
        <button
          className="btn-secondary"
          onClick={prevPart}
          disabled={currentPart === 0}
          style={{ opacity: currentPart === 0 ? 0.4 : 1 }}
        >
          ← Previous
        </button>

        {/* Dots */}
        {parts.length > 1 && (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {parts.map((_, i) => (
              <div key={i} style={{
                width: i === currentPart ? 20 : 8,
                height: 8, borderRadius: 999,
                background: i === currentPart ? "var(--crimson)" : "var(--border)",
                transition: "all 0.3s",
              }} />
            ))}
          </div>
        )}

        <button className="btn-primary" onClick={nextPart}>
          {currentPart === parts.length - 1 ? "🏁 Finish Test" : "Next Part →"}
        </button>
      </div>

    </div>
  );
}
