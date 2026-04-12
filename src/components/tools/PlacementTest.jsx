import React, { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "wouter";
import { getBand, formatTime } from "@/utils/helpers";
import "@/styles/globals.css";

// ─────────────────────────────────────────────
// QUESTIONS DATA
// ─────────────────────────────────────────────

const SECTIONS = [
  {
    id:    "grammar",
    title: "Grammar",
    icon:  "📐",
    desc:  "Choose the correct grammatical form.",
    color: "#1e5dbf",
    bg:    "#eff4ff",
    time:  6 * 60,
    questions: [
      { id: "g1",  text: "She ___ to work by bus every day.",                              type: "radio", options: ["go", "goes", "going", "gone"],                     answer: "goes" },
      { id: "g2",  text: "By the time we arrived, the meeting ___ already ___.",           type: "radio", options: ["had / started", "has / started", "was / starting", "is / starting"], answer: "had / started" },
      { id: "g3",  text: "If I ___ more time, I would study abroad.",                      type: "radio", options: ["have", "had", "would have", "will have"],           answer: "had" },
      { id: "g4",  text: "The report ___ by the manager before the deadline.",             type: "radio", options: ["submitted", "was submitted", "has submit", "submits"], answer: "was submitted" },
      { id: "g5",  text: "Neither the students nor the teacher ___ happy about the result.", type: "radio", options: ["was", "were", "are being", "have been"],         answer: "was" },
      { id: "g6",  text: "He suggested ___ the project deadline.",                         type: "radio", options: ["extend", "to extend", "extending", "extended"],    answer: "extending" },
      { id: "g7",  text: "This is the city ___ she was born.",                             type: "radio", options: ["that", "which", "where", "who"],                   answer: "where" },
      { id: "g8",  text: "I wish I ___ harder when I was at school.",                      type: "radio", options: ["study", "studied", "had studied", "would study"],  answer: "had studied" },
      { id: "g9",  text: "The more you practise, ___ you become.",                         type: "radio", options: ["the better", "better", "the best", "most better"],  answer: "the better" },
      { id: "g10", text: "Despite ___ tired, she finished the entire test.",               type: "radio", options: ["being", "be", "been", "was"],                      answer: "being" },
    ],
  },
  {
    id:    "vocabulary",
    title: "Vocabulary",
    icon:  "📚",
    desc:  "Choose the word that best fits the sentence.",
    color: "#0d7c59",
    bg:    "#edfaf5",
    time:  6 * 60,
    questions: [
      { id: "v1",  text: "The scientist made a ___ discovery that changed modern medicine.",       type: "radio", options: ["groundbreaking", "ordinary", "subtle", "gradual"],        answer: "groundbreaking" },
      { id: "v2",  text: "The government plans to ___ new regulations on air pollution.",         type: "radio", options: ["implement", "neglect", "dismiss", "ignore"],              answer: "implement" },
      { id: "v3",  text: "She was ___ by the complexity of the problem.",                        type: "radio", options: ["overwhelmed", "overstated", "overruled", "overjoyed"],    answer: "overwhelmed" },
      { id: "v4",  text: "The new policy will ___ thousands of people in rural areas.",           type: "radio", options: ["affect", "effect", "infect", "deflect"],                  answer: "affect" },
      { id: "v5",  text: "His argument was ___ and easy to follow.",                             type: "radio", options: ["coherent", "vague", "ambiguous", "irrelevant"],           answer: "coherent" },
      { id: "v6",  text: "The company had to ___ its plans due to a lack of funding.",           type: "radio", options: ["abandon", "adopt", "adapt", "advance"],                   answer: "abandon" },
      { id: "v7",  text: "There is a strong ___ between exercise and mental health.",            type: "radio", options: ["correlation", "collision", "competition", "contradiction"], answer: "correlation" },
      { id: "v8",  text: "The government introduced ___ measures to control inflation.",         type: "radio", options: ["stringent", "flexible", "lenient", "passive"],             answer: "stringent" },
      { id: "v9",  text: "The author's writing style is ___ — it conveys deep meaning in few words.", type: "radio", options: ["concise", "verbose", "ambiguous", "elaborate"],    answer: "concise" },
      { id: "v10", text: "Scientists are trying to find ways to ___ the effects of climate change.", type: "radio", options: ["mitigate", "accelerate", "imitate", "tolerate"],     answer: "mitigate" },
    ],
  },
  {
    id:    "reading",
    title: "Reading",
    icon:  "📖",
    desc:  "Read the passage carefully and answer the questions.",
    color: "#c9a227",
    bg:    "#fdf6dc",
    time:  8 * 60,
    passage: `Urban Vertical Farming

As cities grow and arable land becomes scarcer, vertical farming has emerged as a promising 
solution to food security challenges. Unlike traditional agriculture, vertical farms grow crops 
in stacked layers inside controlled environments, using artificial lighting and hydroponic systems 
that deliver nutrients directly to plant roots.

Proponents argue that vertical farms use up to 95% less water than conventional farming and 
eliminate the need for pesticides entirely. Furthermore, since these facilities can be built 
within cities, transportation costs and carbon emissions from food delivery are significantly 
reduced. Some facilities have achieved year-round production, unaffected by seasonal changes 
or extreme weather events.

However, vertical farming is not without its critics. The energy required to power artificial 
lighting systems is substantial, and unless renewable sources are used, the carbon footprint 
may rival or even exceed that of traditional farms. Initial construction costs remain prohibitively 
high for many investors, and the range of crops that can be grown economically is currently 
limited to leafy greens and herbs.

Despite these challenges, investment in vertical farming technology has grown considerably 
in recent years, with major players entering markets in Asia, Europe, and North America. 
Supporters believe that as technology improves and energy costs fall, vertical farming will 
become increasingly competitive with traditional agriculture.`,
    questions: [
      { id: "r1", text: "According to the passage, vertical farms deliver nutrients to plants through:", type: "radio", options: ["Rainwater irrigation", "Hydroponic systems", "Soil fertilisers", "Seasonal rainfall"], answer: "Hydroponic systems" },
      { id: "r2", text: "Which of the following is listed as an advantage of vertical farming?",         type: "radio", options: ["Lower energy costs", "Wider crop variety", "Reduced water usage", "Lower construction costs"], answer: "Reduced water usage" },
      { id: "r3", text: "What concern do critics raise about artificial lighting in vertical farms?",    type: "radio", options: ["It disturbs nearby residents", "It may increase carbon footprint", "It reduces crop quality", "It is unreliable"], answer: "It may increase carbon footprint" },
      { id: "r4", text: "The word 'prohibitively' in paragraph 3 is closest in meaning to:",           type: "radio", options: ["Excessively", "Slightly", "Reasonably", "Gradually"], answer: "Excessively" },
      { id: "r5", text: "What does the passage suggest about the future of vertical farming?",          type: "radio", options: ["It will replace all traditional farms soon", "It may become more competitive as technology improves", "It is already cheaper than conventional farming", "It is declining due to lack of interest"], answer: "It may become more competitive as technology improves" },
      { id: "r6", text: "Which crops are currently best suited to vertical farming, according to the text?", type: "radio", options: ["Root vegetables and fruit", "Wheat and rice", "Leafy greens and herbs", "Beans and legumes"], answer: "Leafy greens and herbs" },
    ],
  },
  {
    id:    "writing",
    title: "Writing",
    icon:  "✍️",
    desc:  "Write a short response. Minimum 80 words.",
    color: "#7c3aed",
    bg:    "#f5f0ff",
    time:  10 * 60,
    questions: [
      {
        id:   "w1",
        type: "essay",
        text: "Some people think that studying abroad is the best way to learn a new language. Others believe that language schools in your home country are just as effective. Discuss both views and give your own opinion.",
        minWords: 80,
        hint:     "Structure: Introduction → View 1 → View 2 → Your opinion → Conclusion",
      },
    ],
  },
];

// ─────────────────────────────────────────────
// BAND / LEVEL MAPPING
// ─────────────────────────────────────────────

function getLevel(pct) {
  if (pct >= 90) return { band: "8.0–9.0", level: "Expert",       color: "#0d7c59", bg: "#edfaf5", emoji: "🏆" };
  if (pct >= 75) return { band: "7.0–7.5", level: "Upper Advanced", color: "#1e5dbf", bg: "#eff4ff", emoji: "🎯" };
  if (pct >= 60) return { band: "6.0–6.5", level: "Advanced",     color: "#c9a227", bg: "#fdf6dc", emoji: "📈" };
  if (pct >= 45) return { band: "5.0–5.5", level: "Intermediate", color: "#a81011", bg: "#fff0f0", emoji: "📚" };
  return { band: "4.0–4.5", level: "Foundation", color: "#64748b", bg: "#f1f5f9", emoji: "🌱" };
}

function getRecommendations(pct, sectionScores) {
  const recs = [];
  if ((sectionScores.grammar   || 0) < 60) recs.push({ skill: "Grammar",    tip: "Focus on conditionals, passive voice, and complex tenses." });
  if ((sectionScores.vocabulary|| 0) < 60) recs.push({ skill: "Vocabulary", tip: "Learn 10 Academic Word List items per day. Read academic articles daily." });
  if ((sectionScores.reading   || 0) < 60) recs.push({ skill: "Reading",    tip: "Practise skimming and scanning. Read one academic text daily." });
  if (recs.length === 0) recs.push({ skill: "Maintenance", tip: "You're performing well. Challenge yourself with Band 8+ practice tests." });
  return recs;
}

// ─────────────────────────────────────────────
// TIMER HOOK
// ─────────────────────────────────────────────

function useSectionTimer(totalSec, onExpire) {
  const [left, setLeft]     = useState(totalSec);
  const [running, setRun]   = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => {
      setLeft((t) => {
        if (t <= 1) { clearInterval(ref.current); setRun(false); onExpire?.(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [running]);

  useEffect(() => {
    setLeft(totalSec);
    setRun(false);
    clearInterval(ref.current);
  }, [totalSec]);

  return {
    left, running,
    start: () => setRun(true),
    pause: () => setRun(false),
  };
}

// ─────────────────────────────────────────────
// WORD COUNT
// ─────────────────────────────────────────────

function countWords(t) {
  return t.trim() === "" ? 0 : t.trim().split(/\s+/).length;
}

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────

function ProgressDots({ sections, current, answers }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {sections.map((s, i) => {
        const done    = i < current;
        const active  = i === current;
        return (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              width:        active ? 28 : 22,
              height:       22,
              borderRadius: 999,
              background:   done   ? "#0d7c59"
                          : active ? "linear-gradient(135deg, var(--navy3), var(--crimson))"
                          : "var(--bg2)",
              border:       `2px solid ${done ? "#0d7c59" : active ? "transparent" : "var(--border)"}`,
              display:      "flex", alignItems: "center", justifyContent: "center",
              fontSize:     "0.65rem", fontWeight: 800, color: done || active ? "#fff" : "var(--text3)",
              transition:   "all 0.3s",
              flexShrink:   0,
            }}>
              {done ? "✓" : i + 1}
            </div>
            {i < sections.length - 1 && (
              <div style={{ width: 20, height: 2, background: done ? "#0d7c59" : "var(--border)", borderRadius: 999, transition: "background 0.3s" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SectionTimer({ left, total, running, onStart, onPause }) {
  const pct     = Math.round((left / total) * 100);
  const isLow   = left < 60;
  const isMid   = left < 180;
  const color   = isLow ? "#a81011" : isMid ? "#c9a227" : "#0d7c59";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: isLow ? "rgba(168,16,17,0.06)" : isMid ? "rgba(201,162,39,0.06)" : "var(--bg2)",
      border:     `1.5px solid ${isLow ? "rgba(168,16,17,0.25)" : isMid ? "rgba(201,162,39,0.25)" : "var(--border)"}`,
      borderRadius: 12, padding: "8px 14px",
      transition: "all 0.3s",
    }}>
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="13" fill="none" stroke="var(--bg2)" strokeWidth="3"/>
        <circle cx="16" cy="16" r="13" fill="none" stroke={color} strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 13}`}
          strokeDashoffset={`${2 * Math.PI * 13 * (1 - pct / 100)}`}
          transform="rotate(-90 16 16)"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
        />
      </svg>
      <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: "1rem", color, minWidth: 44 }}>
        {formatTime(left)}
      </span>
      {!running ? (
        <button onClick={onStart} style={{ background: color, color: "#fff", border: "none", borderRadius: 6, padding: "4px 10px", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer" }}>
          ▶ Start
        </button>
      ) : (
        <button onClick={onPause} style={{ background: "none", border: `1px solid ${color}`, borderRadius: 6, padding: "4px 10px", fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", color }}>
          ⏸
        </button>
      )}
    </div>
  );
}

function RadioQuestion({ q, value, onChange, index }) {
  return (
    <div style={{
      background: "#fff", border: `1.5px solid ${value ? "rgba(13,124,89,0.3)" : "var(--border)"}`,
      borderRadius: 14, padding: "20px 22px",
      boxShadow: "var(--shadow-sm)", transition: "border-color 0.2s",
    }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
          background: value
            ? "linear-gradient(135deg, #0d7c59, #10a376)"
            : "linear-gradient(135deg, var(--navy3), #1e3a7a)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: "0.72rem", fontWeight: 800,
        }}>
          {value ? "✓" : index + 1}
        </div>
        <p style={{ fontSize: "0.95rem", color: "var(--navy)", lineHeight: 1.65, fontWeight: 500, paddingTop: 3 }}>
          {q.text}
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 40 }}>
        {q.options.map((opt) => {
          const sel = value === opt;
          return (
            <label key={opt} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 14px", borderRadius: 8, cursor: "pointer",
              background:  sel ? "#edfaf5" : "#fff",
              border:      `1.5px solid ${sel ? "rgba(13,124,89,0.35)" : "var(--border)"}`,
              color:       sel ? "#0d7c59" : "var(--navy)",
              fontWeight:  sel ? 700 : 400,
              fontSize:    "0.88rem",
              transition:  "all 0.15s",
            }}>
              <input
                type="radio"
                name={q.id}
                checked={sel}
                onChange={() => onChange(q.id, opt)}
                style={{ accentColor: "#0d7c59", flexShrink: 0 }}
              />
              {opt}
            </label>
          );
        })}
      </div>
    </div>
  );
}

function EssayQuestion({ q, value, onChange }) {
  const words   = countWords(value || "");
  const done    = words >= q.minWords;
  const color   = done ? "#0d7c59" : words >= q.minWords * 0.7 ? "#c9a227" : "var(--navy)";

  return (
    <div>
      {/* Prompt */}
      <div style={{
        background: "var(--bg2)", border: "1px solid var(--border)",
        borderRadius: 14, padding: "20px 24px", marginBottom: 20,
      }}>
        <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--text3)", marginBottom: 10 }}>
          Writing Prompt
        </p>
        <p style={{ fontSize: "1rem", color: "var(--navy)", lineHeight: 1.75, fontStyle: "italic", fontWeight: 500 }}>
          "{q.text}"
        </p>
        {q.hint && (
          <p style={{ marginTop: 12, fontSize: "0.78rem", color: "var(--text2)", padding: "8px 12px", background: "#fff", borderRadius: 8, border: "1px solid var(--border)" }}>
            💡 {q.hint}
          </p>
        )}
      </div>

      {/* Textarea */}
      <div style={{ background: "#fff", border: "1.5px solid var(--border)", borderRadius: 14, overflow: "hidden", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 16px", background: "var(--bg2)", borderBottom: "1px solid var(--border)", fontSize: "0.75rem", fontWeight: 700 }}>
          <span style={{ color: "var(--text3)", textTransform: "uppercase", letterSpacing: "1px" }}>Your Response</span>
          <span style={{ color }}>{words} / {q.minWords} words min</span>
        </div>
        <textarea
          value={value || ""}
          onChange={(e) => onChange(q.id, e.target.value)}
          placeholder="Begin your response here..."
          style={{
            width: "100%", minHeight: 240,
            padding: "18px 20px", border: "none", outline: "none",
            resize: "vertical", fontFamily: "'Inter', sans-serif",
            fontSize: "0.95rem", lineHeight: 1.8,
            color: "var(--navy)", background: "#fff",
          }}
        />
        <div style={{ padding: "10px 16px", borderTop: "1px solid var(--border)" }}>
          <div style={{ height: 5, background: "var(--bg2)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${Math.min((words / q.minWords) * 100, 100)}%`,
              background: done ? "#0d7c59" : "linear-gradient(90deg, var(--navy3), var(--crimson))",
              borderRadius: 999, transition: "width 0.3s",
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SECTION SCREEN
// ─────────────────────────────────────────────

function SectionScreen({ section, sectionIndex, totalSections, answers, onAnswer, onNext, onPrev, isLast }) {
  const { left, running, start, pause } = useSectionTimer(section.time, onNext);

  const answered = section.questions.filter((q) =>
    q.type === "essay"
      ? countWords(answers[q.id] || "") >= q.minWords
      : answers[q.id] !== undefined
  ).length;

  const allDone = answered === section.questions.length;

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 0 80px" }}>

      {/* Section header */}
      <div style={{
        background: "#fff", border: "1px solid var(--border)",
        borderRadius: 16, padding: "20px 28px", marginBottom: 28,
        boxShadow: "var(--shadow-sm)", position: "sticky", top: 68, zIndex: 50,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 46, height: 46, borderRadius: 12, flexShrink: 0,
              background: section.bg, border: `1.5px solid ${section.color}30`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem",
            }}>
              {section.icon}
            </div>
            <div>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--text3)", marginBottom: 2 }}>
                Section {sectionIndex + 1} of {totalSections}
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 800, color: "var(--navy)" }}>
                {section.title}
              </h2>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text3)", fontWeight: 600 }}>
              {answered}/{section.questions.length} answered
            </span>
            <SectionTimer left={left} total={section.time} running={running} onStart={start} onPause={pause} />
          </div>
        </div>
      </div>

      {/* Reading passage */}
      {section.passage && (
        <div style={{
          background: "#fff", border: "1px solid var(--border)",
          borderRadius: 14, padding: "24px 28px", marginBottom: 24,
          boxShadow: "var(--shadow-sm)", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${section.color}, ${section.color}88)` }} />
          <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--text3)", marginBottom: 16 }}>
            Reading Passage
          </p>
          <p style={{ fontSize: "0.92rem", lineHeight: 1.9, color: "var(--navy)", whiteSpace: "pre-line" }}>
            {section.passage}
          </p>
        </div>
      )}

      {/* Questions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {section.questions.map((q, i) =>
          q.type === "radio" ? (
            <RadioQuestion key={q.id} q={q} index={i} value={answers[q.id]} onChange={onAnswer} />
          ) : (
            <EssayQuestion key={q.id} q={q} value={answers[q.id]} onChange={onAnswer} />
          )
        )}
      </div>

      {/* Nav */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "#fff", border: "1px solid var(--border)",
        borderRadius: 14, padding: "16px 22px", boxShadow: "var(--shadow-sm)",
      }}>
        <button
          className="btn-secondary"
          onClick={onPrev}
          disabled={sectionIndex === 0}
          style={{ opacity: sectionIndex === 0 ? 0.4 : 1 }}
        >← Back</button>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {!allDone && (
            <span style={{ fontSize: "0.75rem", color: "var(--text3)" }}>
              {section.questions.length - answered} unanswered
            </span>
          )}
        </div>

        <button
          className="btn-primary"
          onClick={onNext}
          style={{ opacity: !allDone && !isLast ? 0.65 : 1 }}
        >
          {isLast ? "🏁 Submit Test" : "Next Section →"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// INTRO SCREEN
// ─────────────────────────────────────────────

function IntroScreen({ onStart }) {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px 80px" }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>🎓</div>
        <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "var(--crimson)", marginBottom: 12 }}>
          Oxbridge Academy
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 800, color: "var(--navy)", marginBottom: 12, lineHeight: 1.15 }}>
          IELTS Placement Test
        </h1>
        <p style={{ color: "var(--text2)", fontSize: "1rem", lineHeight: 1.7, maxWidth: 500, margin: "0 auto" }}>
          Discover your current IELTS level across all key skills. This test takes approximately
          <strong> 30 minutes</strong> and covers Grammar, Vocabulary, Reading, and Writing.
        </p>
      </div>

      {/* Sections overview */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 14, marginBottom: 32 }}>
        {SECTIONS.map((s, i) => (
          <div key={s.id} style={{
            background: s.bg, border: `1px solid ${s.color}30`,
            borderRadius: 14, padding: "18px 20px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span style={{ fontSize: "1.4rem" }}>{s.icon}</span>
              <span style={{ fontWeight: 700, color: s.color, fontSize: "0.9rem" }}>{s.title}</span>
            </div>
            <p style={{ fontSize: "0.78rem", color: "var(--text2)", lineHeight: 1.5 }}>{s.desc}</p>
            <div style={{ display: "flex", gap: 12, marginTop: 10, fontSize: "0.72rem", color: "var(--text3)", fontWeight: 700 }}>
              <span>⏱ {Math.round(s.time / 60)} min</span>
              <span>❓ {s.questions.length} questions</span>
            </div>
          </div>
        ))}
      </div>

      {/* Rules */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px", marginBottom: 28, boxShadow: "var(--shadow-sm)" }}>
        <p style={{ fontWeight: 700, color: "var(--navy)", marginBottom: 14, fontSize: "0.9rem" }}>📋 Before you begin</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            "Find a quiet place — this is a timed test.",
            "Answer all questions — unanswered sections will score 0.",
            "The Writing section requires a minimum of 80 words.",
            "Your results will show your estimated IELTS band and study recommendations.",
            "Do not refresh the page — your progress will be lost.",
          ].map((rule, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ color: "var(--crimson)", fontWeight: 800, flexShrink: 0 }}>✓</span>
              <span style={{ fontSize: "0.85rem", color: "var(--text2)", lineHeight: 1.5 }}>{rule}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Total time */}
      <div style={{
        background: "linear-gradient(135deg, var(--navy3), var(--navy2))",
        borderRadius: 14, padding: "16px 24px", marginBottom: 28,
        display: "flex", alignItems: "center", gap: 16,
      }}>
        <span style={{ fontSize: "1.8rem" }}>⏱</span>
        <div>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 4 }}>Total Time</p>
          <p style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 800 }}>~30 minutes</p>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 4 }}>Questions</p>
          <p style={{ color: "#fff", fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 800 }}>
            {SECTIONS.reduce((a, s) => a + s.questions.length, 0)}
          </p>
        </div>
      </div>

      <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "16px", fontSize: "1rem" }} onClick={onStart}>
        🚀 Start Placement Test
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// RESULTS SCREEN
// ─────────────────────────────────────────────

function ResultsScreen({ answers }) {
  const [, navigate] = useLocation();

  // Calculate section scores
  const sectionScores = useMemo(() => {
    const scores = {};
    SECTIONS.forEach((s) => {
      if (s.id === "writing") {
        const w   = countWords(answers["w1"] || "");
        scores[s.id] = w >= 80 ? 100 : Math.round((w / 80) * 100);
      } else {
        const total   = s.questions.length;
        const correct = s.questions.filter((q) => answers[q.id] === q.answer).length;
        scores[s.id]  = Math.round((correct / total) * 100);
      }
    });
    return scores;
  }, [answers]);

  const overallPct = useMemo(() => {
    const vals = Object.values(sectionScores);
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }, [sectionScores]);

  const level = getLevel(overallPct);
  const recs  = getRecommendations(overallPct, sectionScores);

  // Save result
  useEffect(() => {
    const result = {
      date:         new Date().toISOString(),
      overallPct,
      band:         level.band,
      level:        level.level,
      sectionScores,
    };
    const history = JSON.parse(localStorage.getItem("placement_history")) || [];
    history.push(result);
    localStorage.setItem("placement_history", JSON.stringify(history));
    localStorage.setItem("placement_latest", JSON.stringify(result));
  }, []);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 80px" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0c1f4a, #1e293b)",
        borderRadius: 20, padding: "44px 40px", marginBottom: 28,
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,16,17,0.25) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,162,39,0.15) 0%, transparent 70%)" }} />

        <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 16, position: "relative" }}>
          Your IELTS Level
        </p>

        <div style={{ fontSize: "3rem", marginBottom: 12, position: "relative" }}>{level.emoji}</div>

        <div style={{
          display: "inline-block",
          background: `${level.color}22`, border: `2px solid ${level.color}`,
          borderRadius: 16, padding: "16px 36px", marginBottom: 20, position: "relative",
        }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", color: level.color, marginBottom: 6 }}>Estimated Band</p>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "3rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{level.band}</p>
        </div>

        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 700, color: "#fff", position: "relative" }}>
          {level.level}
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 24, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)", position: "relative" }}>
          <div>
            <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 4 }}>Overall Score</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, color: "#fff" }}>{overallPct}%</p>
          </div>
          <div>
            <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 4 }}>Sections</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, color: "#fff" }}>{SECTIONS.length}</p>
          </div>
          <div>
            <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 4 }}>Questions</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, color: "#fff" }}>
              {SECTIONS.reduce((a, s) => a + s.questions.length, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Section breakdown */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 28px", marginBottom: 20, boxShadow: "var(--shadow-sm)" }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "var(--navy)", marginBottom: 20 }}>
          Section Breakdown
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {SECTIONS.map((s) => {
            const pct   = sectionScores[s.id] || 0;
            const label = s.id === "writing"
              ? pct === 100 ? "Word count met ✓" : `${Math.round((pct / 100) * 80)} / 80 words`
              : `${s.questions.filter((q) => answers[q.id] === q.answer).length} / ${s.questions.length} correct`;

            return (
              <div key={s.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem", fontWeight: 700, color: "var(--navy)" }}>
                    {s.icon} {s.title}
                  </span>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700, color: s.color }}>{pct}% — {label}</span>
                </div>
                <div style={{ height: 8, background: "var(--bg2)", borderRadius: 999, overflow: "hidden", border: "1px solid var(--border)" }}>
                  <div style={{
                    height: "100%", width: `${pct}%`,
                    background: `linear-gradient(90deg, ${s.color}88, ${s.color})`,
                    borderRadius: 999, transition: "width 1s ease",
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 16, padding: "24px 28px", marginBottom: 24, boxShadow: "var(--shadow-sm)" }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.05rem", fontWeight: 700, color: "var(--navy)", marginBottom: 16 }}>
          📌 Study Recommendations
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {recs.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 14, padding: "14px 16px", background: "var(--bg2)", borderRadius: 10, border: "1px solid var(--border)" }}>
              <span style={{ color: "var(--crimson)", fontWeight: 800, fontSize: "1rem", flexShrink: 0, marginTop: 1 }}>→</span>
              <div>
                <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--navy)", marginBottom: 3 }}>{r.skill}</p>
                <p style={{ fontSize: "0.82rem", color: "var(--text2)", lineHeight: 1.5 }}>{r.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button className="btn-primary" onClick={() => window.location.reload()}>🔄 Retake Test</button>
        <button className="btn-secondary" onClick={() => navigate("/practice")}>📝 Start Practice</button>
        <button className="btn-secondary" onClick={() => navigate("/")}>🏠 Dashboard</button>
      </div>

    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

export default function PlacementTest() {
  const [stage,   setStage]   = useState("intro");    // intro | test | results
  const [section, setSection] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (id, val) => {
    setAnswers((prev) => ({ ...prev, [id]: val }));
  };

  const handleNext = () => {
    if (section < SECTIONS.length - 1) {
      setSection((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setStage("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (section > 0) {
      setSection((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (stage === "intro") {
    return (
      <div style={{ padding: "36px 28px" }}>
        <IntroScreen onStart={() => setStage("test")} />
      </div>
    );
  }

  if (stage === "results") {
    return (
      <div style={{ padding: "36px 28px" }}>
        <ResultsScreen answers={answers} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 28px" }}>

      {/* Top progress bar */}
      <div style={{
        background: "#fff", border: "1px solid var(--border)",
        borderRadius: 14, padding: "14px 22px", marginBottom: 28,
        boxShadow: "var(--shadow-sm)",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--text3)", marginBottom: 4 }}>
            Placement Test
          </p>
          <p style={{ fontWeight: 700, color: "var(--navy)", fontSize: "0.88rem" }}>
            Section {section + 1} of {SECTIONS.length} — {SECTIONS[section].title}
          </p>
        </div>
        <ProgressDots sections={SECTIONS} current={section} answers={answers} />
        <div style={{ height: 4, width: "100%", background: "var(--bg2)", borderRadius: 999, overflow: "hidden", marginTop: 4 }}>
          <div style={{
            height: "100%",
            width: `${((section) / SECTIONS.length) * 100}%`,
            background: "linear-gradient(90deg, var(--navy3), var(--crimson))",
            borderRadius: 999, transition: "width 0.4s ease",
          }} />
        </div>
      </div>

      <SectionScreen
        section={SECTIONS[section]}
        sectionIndex={section}
        totalSections={SECTIONS.length}
        answers={answers}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onPrev={handlePrev}
        isLast={section === SECTIONS.length - 1}
      />
    </div>
  );
}