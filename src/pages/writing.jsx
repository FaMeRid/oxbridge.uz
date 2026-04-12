// src/pages/Writing.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { formatTime } from "@/utils/helpers";
import "@/styles/globals.css";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const TASK1_PROMPTS = [
  {
    id: "t1-1",
    title: "Bar Chart — Internet Usage",
    difficulty: "Foundation",
    description:
      "The bar chart below shows the percentage of people in different age groups who used the internet daily in the UK in 2020.",
    imageAlt: "Bar chart showing internet usage by age group",
    imagePlaceholder: true,
    minWords: 150,
    tips: [
      "Start with an overview — pick the most striking trend",
      "Group age groups logically (young vs older)",
      "Use accurate data language: 'approximately', 'roughly'",
      "Avoid opinions or explanations — just describe",
    ],
    structure: [
      { label: "Introduction",  desc: "Paraphrase the task. Do NOT copy the prompt." },
      { label: "Overview",      desc: "2 sentences. Biggest trend + exception." },
      { label: "Body 1",        desc: "Describe 2-3 specific data points with figures." },
      { label: "Body 2",        desc: "Compare or contrast remaining groups with figures." },
    ],
    sampleBands: { words: "~170–200", time: "20 min", band: "7.0+" },
  },
  {
    id: "t1-2",
    title: "Line Graph — CO₂ Emissions",
    difficulty: "Intermediate",
    description:
      "The line graph below shows the CO₂ emissions per capita in four countries between 1990 and 2020.",
    imagePlaceholder: true,
    minWords: 150,
    tips: [
      "Describe trends over time, not point-by-point",
      "Use trend language: rose sharply, declined steadily, plateaued",
      "Make at least one comparison between countries",
      "End with the final position of each line",
    ],
    structure: [
      { label: "Introduction",  desc: "Paraphrase — what the graph shows." },
      { label: "Overview",      desc: "Highest emitter + most notable change." },
      { label: "Body 1",        desc: "Countries 1 & 2 — trends over time." },
      { label: "Body 2",        desc: "Countries 3 & 4 — trends and comparison." },
    ],
    sampleBands: { words: "~175–210", time: "20 min", band: "7.5+" },
  },
  {
    id: "t1-3",
    title: "Process Diagram — Recycling Paper",
    difficulty: "Advanced",
    description:
      "The diagram below shows how paper is recycled. Summarise the information by selecting and reporting the main features.",
    imagePlaceholder: true,
    minWords: 150,
    tips: [
      "Use passive voice: 'The paper is collected...'",
      "Sequence language: first, then, following this, finally",
      "Cover every stage — don't skip steps",
      "No opinions, no data comparison needed",
    ],
    structure: [
      { label: "Introduction",  desc: "What the diagram shows (process)." },
      { label: "Overview",      desc: "How many stages, where it starts/ends." },
      { label: "Body 1",        desc: "Stages 1–4 with linking language." },
      { label: "Body 2",        desc: "Stages 5–end. Final product or output." },
    ],
    sampleBands: { words: "~180–200", time: "20 min", band: "7.0+" },
  },
];

const TASK2_PROMPTS = [
  {
    id: "t2-1",
    title: "Opinion Essay — Technology in Education",
    difficulty: "Foundation",
    type: "Opinion",
    question:
      "Some people believe that technology has made education better, while others think it has had a negative impact. To what extent do you agree or disagree?",
    minWords: 250,
    tips: [
      "State your position clearly in the introduction",
      "Give ONE clear opinion — don't sit on the fence",
      "Support each body paragraph with an example",
      "Paraphrase the question — never copy it",
    ],
    structure: [
      { label: "Introduction",  desc: "Background + thesis (your opinion, clear)." },
      { label: "Body 1",        desc: "Main reason supporting your view + example." },
      { label: "Body 2",        desc: "Second reason OR counter-argument + rebuttal." },
      { label: "Conclusion",    desc: "Restate opinion. No new ideas." },
    ],
    keyPhrases: [
      "In my view, …",
      "I strongly believe that …",
      "While some argue that …, I contend that …",
      "This is evidenced by …",
      "To conclude, …",
    ],
    sampleBands: { words: "~270–300", time: "40 min", band: "7.0+" },
  },
  {
    id: "t2-2",
    title: "Discussion Essay — Remote Work",
    difficulty: "Intermediate",
    type: "Discussion",
    question:
      "Remote working has become increasingly common. Discuss the advantages and disadvantages of this trend and give your own opinion.",
    minWords: 250,
    tips: [
      "Present BOTH sides before giving opinion",
      "Use a clear topic sentence for each paragraph",
      "Avoid personal anecdotes — use general examples",
      "Your opinion in the conclusion must match your essay",
    ],
    structure: [
      { label: "Introduction",  desc: "Topic intro + outline (discuss both + opinion)." },
      { label: "Advantages",    desc: "2 advantages with explanation and example." },
      { label: "Disadvantages", desc: "2 disadvantages with explanation and example." },
      { label: "Conclusion",    desc: "Summary + your overall opinion." },
    ],
    keyPhrases: [
      "On the one hand, …",
      "On the other hand, …",
      "A significant advantage is …",
      "However, a major drawback is …",
      "Overall, I believe …",
    ],
    sampleBands: { words: "~280–320", time: "40 min", band: "7.5+" },
  },
  {
    id: "t2-3",
    title: "Problem-Solution — Urban Traffic",
    difficulty: "Advanced",
    type: "Problem / Solution",
    question:
      "Traffic congestion in cities is a serious and growing problem. What are the causes of this problem and what measures could be taken to solve it?",
    minWords: 250,
    tips: [
      "Clearly separate causes from solutions",
      "Each paragraph = one main idea, fully developed",
      "Use modal verbs for solutions: could, should, might",
      "Be specific — avoid vague phrases like 'things would improve'",
    ],
    structure: [
      { label: "Introduction",  desc: "Introduce topic + state you'll cover causes & solutions." },
      { label: "Causes",        desc: "2 main causes of congestion, well explained." },
      { label: "Solutions",     desc: "2 practical solutions linked to each cause." },
      { label: "Conclusion",    desc: "Summarise key points. Optional: future outlook." },
    ],
    keyPhrases: [
      "One of the primary causes is …",
      "This leads to …",
      "A possible solution would be to …",
      "Governments could invest in …",
      "If these measures were implemented, …",
    ],
    sampleBands: { words: "~290–330", time: "40 min", band: "8.0+" },
  },
];

const DIFF_COLORS = {
  Foundation:   { bg: "#eff4ff", color: "#1e5dbf", border: "rgba(30,93,191,0.2)" },
  Intermediate: { bg: "#edfaf5", color: "#0d7c59", border: "rgba(13,124,89,0.2)" },
  Advanced:     { bg: "#fdecea", color: "#a81011", border: "rgba(168,16,17,0.2)" },
};

const TYPE_COLORS = {
  Opinion:            { bg: "#fdf6dc", color: "#c9a227" },
  Discussion:         { bg: "#eff4ff", color: "#1e5dbf" },
  "Problem / Solution": { bg: "#edfaf5", color: "#0d7c59" },
};

// ─────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────

function useWritingTimer(totalSeconds, onFinish) {
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [running, setRunning]   = useState(false);
  const [finished, setFinished] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!running || finished) return;
    ref.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(ref.current);
          setRunning(false);
          setFinished(true);
          onFinish?.();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [running, finished]);

  const start  = () => setRunning(true);
  const pause  = () => setRunning(false);
  const reset  = () => { clearInterval(ref.current); setTimeLeft(totalSeconds); setRunning(false); setFinished(false); };

  return { timeLeft, running, finished, start, pause, reset };
}

function useWordCount(text) {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

function DiffBadge({ diff }) {
  const c = DIFF_COLORS[diff] || DIFF_COLORS.Foundation;
  return (
    <span style={{
      fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "1px", padding: "3px 10px", borderRadius: 999,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>{diff}</span>
  );
}

function TypeBadge({ type }) {
  const c = TYPE_COLORS[type] || TYPE_COLORS.Opinion;
  return (
    <span style={{
      fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "1px", padding: "3px 10px", borderRadius: 999,
      background: c.bg, color: c.color,
    }}>{type}</span>
  );
}

// Timer Display
function TimerDisplay({ timeLeft, total, running, finished, onStart, onPause, onReset }) {
  const pct      = Math.round((timeLeft / total) * 100);
  const isLow    = timeLeft < 300;
  const isVeryLow= timeLeft < 60;
  const color    = isVeryLow ? "#a81011" : isLow ? "#c9a227" : "#0d7c59";

  return (
    <div style={{
      background: "#fff", border: `1.5px solid ${isVeryLow ? "rgba(168,16,17,0.3)" : isLow ? "rgba(201,162,39,0.3)" : "var(--border)"}`,
      borderRadius: 16, padding: "20px 24px",
      boxShadow: "var(--shadow-sm)",
    }}>
      {/* Arc progress */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <svg width="110" height="110" viewBox="0 0 110 110">
          <circle cx="55" cy="55" r="46" fill="none" stroke="var(--bg2)" strokeWidth="8"/>
          <circle
            cx="55" cy="55" r="46" fill="none"
            stroke={color} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 46}`}
            strokeDashoffset={`${2 * Math.PI * 46 * (1 - pct / 100)}`}
            transform="rotate(-90 55 55)"
            style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
          />
          <text x="55" y="48" textAnchor="middle" fill={color}
            style={{ fontFamily: "monospace", fontSize: "18px", fontWeight: 700 }}>
            {formatTime(timeLeft)}
          </text>
          <text x="55" y="66" textAnchor="middle" fill="var(--text3)"
            style={{ fontSize: "10px" }}>
            {finished ? "TIME UP" : running ? "remaining" : "paused"}
          </text>
        </svg>
      </div>

      {/* Controls */}
      {!finished && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {!running ? (
            <button className="btn-primary" style={{ padding: "8px 20px", fontSize: "0.82rem" }} onClick={onStart}>
              {timeLeft === total ? "▶ Start Timer" : "▶ Resume"}
            </button>
          ) : (
            <button className="btn-secondary" style={{ padding: "8px 20px", fontSize: "0.82rem" }} onClick={onPause}>
              ⏸ Pause
            </button>
          )}
          <button
            onClick={onReset}
            style={{
              padding: "8px 14px", fontSize: "0.82rem",
              background: "none", border: "1px solid var(--border)",
              borderRadius: 8, cursor: "pointer", color: "var(--text3)",
            }}
          >↺</button>
        </div>
      )}

      {finished && (
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "0.82rem", color: "#a81011", fontWeight: 700, marginBottom: 10 }}>
            ⏰ Time's up!
          </p>
          <button className="btn-secondary" style={{ padding: "8px 18px", fontSize: "0.82rem" }} onClick={onReset}>
            ↺ Reset
          </button>
        </div>
      )}
    </div>
  );
}

// Word Count Bar
function WordCountBar({ count, min }) {
  const pct   = Math.min(Math.round((count / min) * 100), 100);
  const done  = count >= min;
  const color = done ? "#0d7c59" : count >= min * 0.8 ? "#c9a227" : "var(--navy)";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: "0.78rem", fontWeight: 700 }}>
        <span style={{ color }}>
          {count} words {done ? "✓ Minimum reached" : `(${min - count} more needed)`}
        </span>
        <span style={{ color: "var(--text3)" }}>Min: {min}</span>
      </div>
      <div style={{ height: 6, background: "var(--bg2)", borderRadius: 999, overflow: "hidden", border: "1px solid var(--border)" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: done
            ? "linear-gradient(90deg, #0d7c59, #10a376)"
            : "linear-gradient(90deg, var(--navy3), var(--crimson))",
          borderRadius: 999,
          transition: "width 0.3s ease",
        }} />
      </div>
    </div>
  );
}

// Structure Guide
function StructureGuide({ structure }) {
  return (
    <div style={{
      background: "#fff", border: "1px solid var(--border)",
      borderRadius: 14, padding: "18px 20px",
      boxShadow: "var(--shadow-sm)",
    }}>
      <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--text3)", marginBottom: 14 }}>
        Essay Structure
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {structure.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 12, position: "relative" }}>
            {/* Line */}
            {i < structure.length - 1 && (
              <div style={{
                position: "absolute", left: 11, top: 24, bottom: -4,
                width: 2, background: "var(--border)", zIndex: 0,
              }} />
            )}
            {/* Dot */}
            <div style={{
              width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, var(--navy3), var(--crimson))",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: "0.65rem", fontWeight: 800,
              position: "relative", zIndex: 1, marginTop: 1,
            }}>
              {i + 1}
            </div>
            <div style={{ paddingBottom: i < structure.length - 1 ? 16 : 0 }}>
              <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", marginBottom: 2 }}>
                {s.label}
              </p>
              <p style={{ fontSize: "0.78rem", color: "var(--text2)", lineHeight: 1.5 }}>
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Tips Panel
function TipsPanel({ tips, keyPhrases }) {
  const [open, setOpen] = useState(true);

  return (
    <div style={{
      background: "#fff", border: "1px solid var(--border)",
      borderRadius: 14, overflow: "hidden",
      boxShadow: "var(--shadow-sm)",
    }}>
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          width: "100%", display: "flex", justifyContent: "space-between",
          alignItems: "center", padding: "14px 18px",
          background: "none", border: "none", cursor: "pointer",
          borderBottom: open ? "1px solid var(--border)" : "none",
        }}
      >
        <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--text3)" }}>
          💡 Tips & Phrases
        </span>
        <span style={{ color: "var(--text3)", fontSize: "0.8rem", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
      </button>

      {open && (
        <div style={{ padding: "14px 18px" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--text3)", marginBottom: 8 }}>
            Key Tips
          </p>
          <ul style={{ paddingLeft: 16, marginBottom: keyPhrases ? 16 : 0 }}>
            {tips.map((t, i) => (
              <li key={i} style={{ fontSize: "0.82rem", color: "var(--text2)", marginBottom: 6, lineHeight: 1.5 }}>
                {t}
              </li>
            ))}
          </ul>

          {keyPhrases && (
            <>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "var(--text3)", marginBottom: 8 }}>
                Useful Phrases
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {keyPhrases.map((p, i) => (
                  <div key={i} style={{
                    background: "var(--bg2)", borderRadius: 8, padding: "6px 12px",
                    fontSize: "0.8rem", color: "var(--navy)", fontStyle: "italic",
                    border: "1px solid var(--border)",
                  }}>
                    {p}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// WRITING EDITOR (main test view)
// ─────────────────────────────────────────────

function WritingEditor({ task, taskNum, onBack, onSubmit }) {
  const totalSec  = taskNum === 1 ? 20 * 60 : 40 * 60;
  const [text, setText] = useState("");
  const wordCount = useWordCount(text);
  const [submitted, setSubmitted] = useState(false);
  const textareaRef = useRef(null);

  const { timeLeft, running, finished, start, pause, reset } = useWritingTimer(
    totalSec,
    () => { /* auto-save on time up */ }
  );

  const handleSubmit = () => {
    if (!window.confirm("Submit your essay? You won't be able to edit it.")) return;

    const entry = {
      taskNum,
      taskId:    task.id,
      taskTitle: task.title,
      text,
      wordCount,
      timeUsed:  totalSec - timeLeft,
      date:      new Date().toISOString(),
    };

    const history = JSON.parse(localStorage.getItem("writing_history")) || [];
    history.push(entry);
    localStorage.setItem("writing_history", JSON.stringify(history));

    setSubmitted(true);
    onSubmit?.(entry);
  };

  if (submitted) {
    return (
      <SubmittedView
        task={task}
        taskNum={taskNum}
        text={text}
        wordCount={wordCount}
        timeUsed={totalSec - timeLeft}
        onBack={onBack}
        onRetry={() => { setText(""); setSubmitted(false); reset(); }}
      />
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }}>

      {/* ── LEFT: Task + Editor ── */}
      <div>
        {/* Task card */}
        <div style={{
          background: "#fff", border: "1.5px solid var(--border)",
          borderRadius: 16, padding: "24px 28px", marginBottom: 20,
          boxShadow: "var(--shadow-sm)", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--navy3), var(--crimson))" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{
              background: "linear-gradient(135deg, var(--navy3), var(--crimson))",
              color: "#fff", fontSize: "0.7rem", fontWeight: 800,
              padding: "4px 12px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "1px",
            }}>
              Task {taskNum}
            </span>
            <DiffBadge diff={task.difficulty} />
            {task.type && <TypeBadge type={task.type} />}
          </div>

          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 800, color: "var(--navy)", marginBottom: 12 }}>
            {task.title}
          </h2>

          {/* Prompt */}
          <div style={{
            background: "var(--bg2)", borderRadius: 10, padding: "16px 18px",
            marginBottom: 14, border: "1px solid var(--border)",
          }}>
            <p style={{ fontSize: "0.95rem", color: "var(--navy)", lineHeight: 1.7, fontStyle: taskNum === 2 ? "italic" : "normal" }}>
              {taskNum === 2 ? `"${task.question}"` : task.description}
            </p>
          </div>

          {/* Image placeholder for Task 1 */}
          {taskNum === 1 && task.imagePlaceholder && (
            <div style={{
              background: "var(--bg2)", border: "2px dashed var(--border2)",
              borderRadius: 10, padding: "32px 24px", textAlign: "center",
              marginBottom: 14,
            }}>
              <p style={{ fontSize: "1.8rem", marginBottom: 8 }}>📊</p>
              <p style={{ fontSize: "0.82rem", color: "var(--text3)", fontWeight: 600 }}>
                {task.imageAlt || "Chart / Diagram would appear here"}
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--text3)", marginTop: 4 }}>
                In the real IELTS exam, the visual data appears in this space
              </p>
            </div>
          )}

          <div style={{
            display: "flex", gap: 20, fontSize: "0.75rem",
            color: "var(--text3)", fontWeight: 600,
          }}>
            <span>⏱ {taskNum === 1 ? "20" : "40"} minutes</span>
            <span>📝 Minimum {task.minWords} words</span>
            <span>🎯 Target: {task.sampleBands.band}</span>
          </div>
        </div>

        {/* Textarea */}
        <div style={{
          background: "#fff", border: "1.5px solid var(--border)",
          borderRadius: 16, overflow: "hidden",
          boxShadow: "var(--shadow-sm)",
          transition: "border-color 0.2s",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "12px 18px", borderBottom: "1px solid var(--border)",
            background: "var(--bg2)",
          }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--text3)" }}>
              Your Answer
            </span>
            <span style={{ fontSize: "0.78rem", color: "var(--text3)" }}>
              {wordCount} words
            </span>
          </div>

          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              taskNum === 1
                ? "The bar chart illustrates...\n\nOverall, it is clear that..."
                : "In recent years, the debate over... has attracted significant attention.\n\nIn my view,..."
            }
            style={{
              width: "100%", minHeight: 380,
              padding: "20px 22px",
              border: "none", outline: "none", resize: "vertical",
              fontFamily: "'Inter', sans-serif", fontSize: "0.95rem",
              lineHeight: 1.85, color: "var(--navy)",
              background: "#fff",
            }}
          />

          {/* Bottom bar */}
          <div style={{ padding: "12px 18px", borderTop: "1px solid var(--border)" }}>
            <WordCountBar count={wordCount} min={task.minWords} />
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: "flex", gap: 12, marginTop: 20, alignItems: "center" }}>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={wordCount < task.minWords}
            style={{ opacity: wordCount < task.minWords ? 0.5 : 1 }}
          >
            🏁 Submit Essay
          </button>
          <button className="btn-secondary" onClick={onBack}>
            ← Change Task
          </button>
          {wordCount < task.minWords && (
            <span style={{ fontSize: "0.78rem", color: "var(--text3)" }}>
              Write {task.minWords - wordCount} more words to submit
            </span>
          )}
        </div>
      </div>

      {/* ── RIGHT: Sidebar ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "sticky", top: 80 }}>
        <TimerDisplay
          timeLeft={timeLeft}
          total={totalSec}
          running={running}
          finished={finished}
          onStart={start}
          onPause={pause}
          onReset={reset}
        />
        <StructureGuide structure={task.structure} />
        <TipsPanel tips={task.tips} keyPhrases={task.keyPhrases} />
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────
// SUBMITTED VIEW
// ─────────────────────────────────────────────

function SubmittedView({ task, taskNum, text, wordCount, timeUsed, onBack, onRetry }) {
  const [showFull, setShowFull] = useState(false);

  const feedbackItems = [
    { label: "Word count",    val: wordCount,             ok: wordCount >= task.minWords,   hint: wordCount >= task.minWords ? "Above minimum ✓" : "Below minimum" },
    { label: "Time used",     val: formatTime(timeUsed),  ok: true,                          hint: taskNum === 1 ? "Target: ~20 min" : "Target: ~40 min" },
    { label: "Min required",  val: task.minWords,         ok: true,                          hint: "" },
  ];

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0c1f4a, #1e293b)",
        borderRadius: 20, padding: "36px 40px", marginBottom: 28,
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,16,17,0.2) 0%, transparent 70%)" }} />
        <p style={{ fontSize: "3rem", marginBottom: 12 }}>✅</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, color: "#fff", marginBottom: 8 }}>
          Essay Submitted!
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem" }}>
          Task {taskNum} · {task.title}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 24 }}>
        {feedbackItems.map((f) => (
          <div key={f.label} style={{
            background: "#fff", border: `1px solid ${f.ok ? "var(--border)" : "rgba(168,16,17,0.2)"}`,
            borderRadius: 14, padding: "18px 20px", textAlign: "center",
            boxShadow: "var(--shadow-sm)",
          }}>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--text3)", marginBottom: 6 }}>{f.label}</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, color: f.ok ? "var(--navy)" : "var(--crimson)", lineHeight: 1, marginBottom: 4 }}>
              {f.val}
            </p>
            {f.hint && <p style={{ fontSize: "0.72rem", color: f.ok ? "#0d7c59" : "var(--crimson)", fontWeight: 600 }}>{f.hint}</p>}
          </div>
        ))}
      </div>

      {/* Self-check */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px", marginBottom: 20, boxShadow: "var(--shadow-sm)" }}>
        <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--navy)", marginBottom: 14 }}>
          📋 Self-Check Checklist
        </p>
        {[
          "Did I include an introduction, body paragraphs, and conclusion?",
          "Did I avoid copying the question verbatim?",
          "Did I use a range of vocabulary and sentence structures?",
          "Did I stay on topic throughout the essay?",
          taskNum === 1 ? "Did I include specific data from the chart/diagram?" : "Did I support every claim with an example or explanation?",
          "Did I check for grammar and spelling errors?",
        ].map((item, i) => (
          <CheckItem key={i} text={item} />
        ))}
      </div>

      {/* Essay preview */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginBottom: 24, boxShadow: "var(--shadow-sm)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: "1px solid var(--border)", background: "var(--bg2)" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text2)" }}>Your Essay</span>
          <button onClick={() => setShowFull((p) => !p)} style={{ background: "none", border: "none", color: "var(--crimson)", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>
            {showFull ? "Collapse ↑" : "Expand ↓"}
          </button>
        </div>
        <div style={{
          padding: "16px 20px",
          maxHeight: showFull ? "none" : 140,
          overflow: "hidden",
          position: "relative",
          fontSize: "0.9rem", color: "var(--navy)", lineHeight: 1.8,
          whiteSpace: "pre-wrap",
        }}>
          {text}
          {!showFull && (
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: "linear-gradient(to top, #fff, transparent)" }} />
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button className="btn-primary" onClick={onRetry}>🔄 Try Again</button>
        <button className="btn-secondary" onClick={onBack}>← All Tasks</button>
        <button className="btn-secondary" onClick={() => window.location.href = "/practice"}>📝 Practice</button>
      </div>
    </div>
  );
}

function CheckItem({ text }) {
  const [checked, setChecked] = useState(false);
  return (
    <label style={{
      display: "flex", alignItems: "flex-start", gap: 10,
      padding: "8px 0", cursor: "pointer",
      borderBottom: "1px solid var(--bg2)",
      fontSize: "0.85rem", color: checked ? "var(--text3)" : "var(--navy)",
      textDecoration: checked ? "line-through" : "none",
      transition: "all 0.2s",
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked((p) => !p)}
        style={{ marginTop: 2, accentColor: "var(--crimson)", flexShrink: 0 }}
      />
      {text}
    </label>
  );
}

// ─────────────────────────────────────────────
// TASK SELECTOR
// ─────────────────────────────────────────────

function TaskCard({ task, taskNum, onClick }) {
  const dc = DIFF_COLORS[task.difficulty];
  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff", border: "1.5px solid var(--border)",
        borderRadius: 16, padding: "22px 24px",
        cursor: "pointer", transition: "all 0.2s",
        boxShadow: "var(--shadow-sm)",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--crimson-border)"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(168,16,17,0.1)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <DiffBadge diff={task.difficulty} />
        {task.type && <TypeBadge type={task.type} />}
      </div>

      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 700, color: "var(--navy)", marginBottom: 8 }}>
        {task.title}
      </h3>

      <p style={{ fontSize: "0.82rem", color: "var(--text2)", lineHeight: 1.6, marginBottom: 14,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {taskNum === 2 ? task.question : task.description}
      </p>

      <div style={{ display: "flex", gap: 16, fontSize: "0.72rem", color: "var(--text3)", fontWeight: 600 }}>
        <span>⏱ {taskNum === 1 ? "20" : "40"} min</span>
        <span>📝 {task.minWords}+ words</span>
        <span>🎯 {task.sampleBands.band}</span>
      </div>

      <div style={{
        marginTop: 16, width: "100%", padding: "9px",
        background: "linear-gradient(135deg, var(--navy3), var(--crimson))",
        borderRadius: 8, color: "#fff", fontSize: "0.82rem", fontWeight: 700,
        textAlign: "center",
      }}>
        Start Task {taskNum} →
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

export default function Writing() {
  const [, navigate]  = useLocation();
  const [taskNum, setTaskNum] = useState(null);   // null | 1 | 2
  const [selected, setSelected] = useState(null); // prompt object
  const [activeTab, setActiveTab] = useState("task1");

  const handleSelect = (task, num) => {
    setSelected(task);
    setTaskNum(num);
  };

  const handleBack = () => {
    setSelected(null);
    setTaskNum(null);
  };

  // ── Active editor ──
  if (selected && taskNum) {
    return (
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "28px 24px 80px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, fontSize: "0.82rem", color: "var(--text3)" }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: "0.82rem" }}>Home</button>
          <span>/</span>
          <button onClick={handleBack} style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", fontSize: "0.82rem" }}>Writing</button>
          <span>/</span>
          <span style={{ color: "var(--navy)", fontWeight: 600 }}>Task {taskNum} — {selected.title}</span>
        </div>

        <WritingEditor
          task={selected}
          taskNum={taskNum}
          onBack={handleBack}
          onSubmit={() => {}}
        />
      </div>
    );
  }

  // ── Task selector ──
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 28px 80px" }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <p style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontSize: "0.72rem", fontWeight: 700, letterSpacing: "2.5px",
          textTransform: "uppercase", color: "var(--crimson)", marginBottom: 12,
        }}>
          <span style={{ display: "block", width: 20, height: 2, background: "var(--crimson)" }} />
          IELTS Academic
        </p>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.8rem,4vw,2.6rem)",
          fontWeight: 800, color: "var(--navy)", marginBottom: 10,
        }}>
          ✍️ Writing Module
        </h1>
        <p style={{ color: "var(--text2)", maxWidth: 580, fontSize: "0.95rem", lineHeight: 1.65 }}>
          Practice both Task 1 and Task 2 under timed conditions. Use the built-in structure guide
          and tips to improve your band score.
        </p>
      </div>

      {/* Info row */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 36,
      }}>
        {[
          {
            num: "1", title: "Task 1 — Data Description",
            desc: "Describe a chart, graph, table or diagram in at least 150 words. Focus on key trends, comparisons, and data. No opinions.",
            time: "20 min", words: "150+", icon: "📊",
            accent: "var(--navy3)",
          },
          {
            num: "2", title: "Task 2 — Essay Writing",
            desc: "Write a well-structured essay of at least 250 words in response to a question. Give your opinion with supporting arguments.",
            time: "40 min", words: "250+", icon: "📝",
            accent: "var(--crimson)",
          },
        ].map((t) => (
          <div key={t.num} style={{
            background: "linear-gradient(135deg, #0c1f4a, #1e293b)",
            borderRadius: 16, padding: "24px 28px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,16,17,0.2) 0%, transparent 70%)" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: "1.8rem" }}>{t.icon}</span>
              <div>
                <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 3 }}>
                  Task {t.num}
                </p>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1rem", fontWeight: 800, color: "#fff" }}>{t.title}</h3>
              </div>
            </div>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.65, marginBottom: 16 }}>{t.desc}</p>
            <div style={{ display: "flex", gap: 16, fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>
              <span>⏱ {t.time}</span>
              <span>📝 {t.words} words</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border)", marginBottom: 28 }}>
        {[
          { id: "task1", label: "📊 Task 1 — Data Description", count: TASK1_PROMPTS.length },
          { id: "task2", label: "📝 Task 2 — Essay Writing",    count: TASK2_PROMPTS.length },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "12px 24px", background: "none", border: "none",
              borderBottom: `2px solid ${activeTab === t.id ? "var(--crimson)" : "transparent"}`,
              marginBottom: -1, cursor: "pointer",
              color: activeTab === t.id ? "var(--navy)" : "var(--text3)",
              fontWeight: 700, fontSize: "0.88rem",
              fontFamily: "'Inter', sans-serif",
              transition: "all 0.2s",
            }}
          >
            {t.label}
            <span style={{
              marginLeft: 8, fontSize: "0.7rem", fontWeight: 700,
              background: activeTab === t.id ? "var(--crimson-pale)" : "var(--bg2)",
              color: activeTab === t.id ? "var(--crimson)" : "var(--text3)",
              padding: "2px 8px", borderRadius: 999,
            }}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Task cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
        {activeTab === "task1"
          ? TASK1_PROMPTS.map((t) => <TaskCard key={t.id} task={t} taskNum={1} onClick={() => handleSelect(t, 1)} />)
          : TASK2_PROMPTS.map((t) => <TaskCard key={t.id} task={t} taskNum={2} onClick={() => handleSelect(t, 2)} />)
        }
      </div>

    </div>
  );
}