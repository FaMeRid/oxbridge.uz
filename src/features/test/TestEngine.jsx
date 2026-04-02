// src/features/test/TestEngine.jsx
import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Question from "@/components/test/Question";
import AudioPlayer from "@/components/test/AudioPlayer";
import ListeningNotesTable from "@/components/test/ListeningNotesTable";
import ProgressBar from "@/components/test/ProgressBar";
import Answer from "@/components/test/Answer";
import { getBand, formatTime, questionMaxPoints, isQuestionAnswered } from "@/utils/helpers";
import { loadTestHistory, saveTestHistory } from "@/utils/testHistoryStorage";
import { useAuthStore } from "@/features/auth/authStore";

/* ══════════════════════════════════════════
   INLINE RESULT PAGE
══════════════════════════════════════════ */
function TestResult({ score, total, parts, answers, studentName, testName, onRetry }) {
  const band = getBand(score);
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const bandColor = band >= 7 ? "#0d7c59" : band >= 6 ? "#c9a227" : "#a81011";

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* Hero card */}
      <div style={{
        background: "linear-gradient(135deg, #0c1f4a, #1e293b)",
        borderRadius: 20, padding: "40px 36px",
        marginBottom: 32, textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,16,17,0.25) 0%, transparent 70%)" }} />

        {studentName && <p style={{ fontSize: "0.78rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>{studentName}</p>}
        <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>Test Complete</p>

        {/* Band */}
        <div style={{
          display: "inline-flex", flexDirection: "column", alignItems: "center",
          background: `${bandColor}22`, border: `2px solid ${bandColor}`,
          borderRadius: 16, padding: "20px 40px", marginBottom: 24,
        }}>
          <span style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: bandColor, marginBottom: 6 }}>IELTS Band</span>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "3.5rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{band}</span>
        </div>

        {/* Score */}
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

      {/* Answer review */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "var(--navy)", marginBottom: 16 }}>📋 Answer Review</h3>
        {parts.map((p, pi) => (
          <div key={pi} style={{ marginBottom: 24 }}>
            <p style={{
              fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "1.5px", color: "var(--text3)", marginBottom: 10,
              paddingBottom: 8, borderBottom: "1px solid var(--border)",
            }}>{p.title || `Part ${pi + 1}`}</p>

            {(p.questions || []).map((q) => (
              <Answer key={q.id} q={q} userAnswer={answers[q.id]} />
            ))}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button className="btn-primary" onClick={onRetry}>🔄 Try Again</button>
        <button className="btn-secondary" onClick={() => window.location.href = "/practice"}>← Back to Practice</button>
        <button className="btn-secondary" onClick={() => window.location.href = "/"}>🏠 Dashboard</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   TEST ENGINE
══════════════════════════════════════════ */
export default function TestEngine({ test, startPart = 0, mode = "full" }) {
  const parts = mode === "single" ? [test.parts?.[startPart] || test] : (test.parts || []);
  const user = useAuthStore((s) => s.user);
  const userRef = useRef(user);
  userRef.current = user;

  const session = useMemo(() => {
    try { return JSON.parse(sessionStorage.getItem("current_session")) || {}; }
    catch { return {}; }
  }, []);

  const studentName = session.studentName || "";
  const testName = session.testName || test?.name || "IELTS Test";

  const [currentPart, setCurrentPart] = useState(0);
  const [answers, setAnswers] = useState({});
  const [finished, setFinished] = useState(false);
  const [time, setTime] = useState(mode === "single" ? 10 * 60 : 40 * 60);

  const part = parts[currentPart];

  /* ── Timer ── */
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

  /* ── Score calculation (Listening + Reading auto) ── */
  const score = useMemo(() => {
    let s = 0;
    parts.forEach((p) => {
      (p.questions || []).forEach((q) => {
        const userAns = answers[q.id];
        if (userAns === undefined || userAns === null || userAns === "") return;

        // Если есть correctAnswer → проверяем
        if (q.correctAnswer !== undefined) {
          if (Array.isArray(q.correctAnswer)) {
            if (
              Array.isArray(userAns) &&
              q.correctAnswer.length === userAns.length &&
              q.correctAnswer.every((a) => userAns.includes(a))
            ) {
              s += questionMaxPoints(q);
            }
          } else if (
            userAns.toString().toLowerCase().trim() ===
            q.correctAnswer.toString().toLowerCase().trim()
          ) {
            s += questionMaxPoints(q);
          }
        }
      });
    });
    return s;
  }, [answers, parts]);

  const totalQuestions = useMemo(() =>
    parts.reduce((acc, p) => acc + (p.questions || []).reduce((a, q) => a + questionMaxPoints(q), 0), 0),
    [parts]
  );

  const totalSlots = useMemo(() =>
    parts.reduce((acc, p) => acc + (p.questions?.length || 0), 0),
    [parts]
  );

  const answeredSlotsAll = useMemo(() =>
    parts.reduce((acc, p) => acc + (p.questions || []).filter((q) => isQuestionAnswered(q, answers)).length, 0),
    [parts, answers]
  );

  /* ── Save result when finished ── */
  useEffect(() => {
    if (!finished) return;

    const resultEntry = {
      name: studentName || "Student",
      testName,
      score,
      total: totalQuestions,
      band: getBand(score),
      date: new Date().toISOString(),
      mode,
      skill: session.skill || "listening",
      answers, // сохраняем все ответы
    };

    // Сохраняем историю для студента
    const u = userRef.current;
    const history = loadTestHistory(u);
    history.push(resultEntry);
    saveTestHistory(u, history);

    // Если Writing / Speaking — сохраняем для проверки учителем
    if (["writing", "speaking"].includes(session.skill)) {
      const teacherResults = JSON.parse(localStorage.getItem("teacher_results") || "[]");
      teacherResults.push(resultEntry);
      localStorage.setItem("teacher_results", JSON.stringify(teacherResults));
    }

  }, [finished, score, totalQuestions, studentName, testName, answers, session.skill, mode]);

  const handleRetry = useCallback(() => {
    setAnswers({});
    setCurrentPart(0);
    setFinished(false);
    setTime(mode === "single" ? 10 * 60 : 40 * 60);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [mode]);

  const nextPart = useCallback(() => {
    if (currentPart < parts.length - 1) setCurrentPart((p) => p + 1);
    else setFinished(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPart, parts.length]);

  const prevPart = useCallback(() => {
    if (currentPart > 0) setCurrentPart((p) => p - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPart]);

  /* ── Guards ── */
  if (!parts || parts.length === 0) return <div className="page-wrap" style={{ textAlign: "center", paddingTop: 60 }}><p>⚠️ Test data not found.</p></div>;
  if (finished) return <TestResult score={score} total={totalQuestions} parts={parts} answers={answers} studentName={studentName} testName={testName} onRetry={handleRetry} />;
  if (!part) return <div className="page-wrap" style={{ textAlign: "center", paddingTop: 60 }}><p>Part not found.</p></div>;

  const answeredInPart = (part.questions || []).filter((q) => isQuestionAnswered(q, answers)).length;
  const timerColor = time < 60 ? "#a81011" : time < 300 ? "#c9a227" : "var(--navy)";
  const isNotesTable = part.layout === "listening-notes-table" && part.notesTable;

  return (
    <div style={{ maxWidth: isNotesTable ? 1100 : 760, margin: "0 auto", padding: "28px 24px 80px" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20, background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "14px 20px", boxShadow: "var(--shadow-sm)", position: "sticky", top: 76, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {studentName && <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, var(--crimson), var(--crimson-light))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "12px", fontWeight: 700 }}>{studentName.charAt(0).toUpperCase()}</div>}
          <div>
            {studentName && <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", lineHeight: 1.2 }}>{studentName}</p>}
            <p style={{ fontSize: "0.72rem", color: "var(--text3)" }}>{testName}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {parts.map((_, i) => {
            const partDone = (parts[i].questions || []).filter((q) => isQuestionAnswered(q, answers)).length === (parts[i].questions?.length || 0);
            return <div key={i} onClick={() => setCurrentPart(i)} style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", background: i === currentPart ? "linear-gradient(135deg, var(--crimson), var(--crimson-light))" : partDone ? "#edfaf5" : "var(--bg2)", color: i === currentPart ? "#fff" : partDone ? "#0d7c59" : "var(--text2)", border: i === currentPart ? "none" : `1px solid ${partDone ? "rgba(13,124,89,0.3)" : "var(--border)"}` }}>{partDone ? "✓" : i + 1}</div>;
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: time < 60 ? "#fff0f0" : time < 300 ? "#fdf6dc" : "var(--bg2)", border: `1px solid ${time < 60 ? "rgba(168,16,17,0.25)" : time < 300 ? "rgba(201,162,39,0.3)" : "var(--border)"}`, borderRadius: 10, padding: "8px 14px" }}>
          <span>⏱</span>
          <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: "1rem", color: timerColor }}>{formatTime(time)}</span>
        </div>
      </div>

      {/* Progress bar */}
      <ProgressBar current={answeredSlotsAll} total={totalSlots} part={currentPart} />

      {/* Audio */}
      {part.audio && <AudioPlayer src={part.audio} preventSeekBack={!!part.audioPreventSeekBack} />}

      {/* Part title */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 22px", marginBottom: 24, boxShadow: "var(--shadow-sm)" }}>
        <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: "var(--crimson)", marginBottom: 6 }}>Part {currentPart + 1} of {parts.length}</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "var(--navy)", marginBottom: 4 }}>{part.title}</h2>
        {part.instructions && <p style={{ fontSize: "0.88rem", color: "var(--text2)", marginBottom: 10, lineHeight: 1.5 }}><strong>{part.instructions}</strong></p>}
        <p style={{ fontSize: "0.78rem", color: "var(--text3)" }}>{answeredInPart} / {part.questions?.length || 0} answered</p>
      </div>

      {/* Questions */}
      {isNotesTable ? (
        <ListeningNotesTable columns={part.notesTable.columns} rows={part.notesTable.rows} answers={answers} onChange={setAnswer} questions={part.questions} />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
          {(part.questions || []).map((q, idx) => {
            const qAnswered = isQuestionAnswered(q, answers);
            const slotBefore = parts.slice(0, currentPart).reduce((acc, p) => acc + (p.questions?.length || 0), 0);
            return (
              <div key={q.id} style={{ background: "#fff", border: `1px solid ${qAnswered ? "rgba(13,124,89,0.3)" : "var(--border)"}`, borderRadius: 14, padding: 16 }}>
                <Question q={q} answers={answers} setAnswer={setAnswer} index={slotBefore + idx + 1} />
              </div>
            );
          })}
        </div>
      )}

      {/* Navigation buttons */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
        <button className="btn-primary" onClick={nextPart}>{currentPart < parts.length - 1 ? "Next →" : "Finish ✅"}</button>
        {currentPart > 0 && <button className="btn-secondary" onClick={prevPart}>← Previous</button>}
        <button className="btn-secondary" onClick={handleRetry}>🔄 Retry</button>
      </div>
    </div>
  );
}