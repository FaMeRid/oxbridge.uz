// src/pages/Speaking.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const PARTS = [
  {
    num: 1,
    title: "Part 1 — Introduction & Interview",
    desc: "General questions about yourself and familiar topics: home, family, work, studies and interests.",
    time: "4–5 min",
    topics: ["Home & Hometown", "Work or Studies", "Daily Routine", "Hobbies & Free Time", "Friends & Family"],
  },
  {
    num: 2,
    title: "Part 2 — Long Turn",
    desc: "You receive a cue card. 1 minute to prepare, then speak for 1–2 minutes without interruption.",
    time: "3–4 min",
    topics: ["Describe a person", "Describe a place", "Describe an experience", "Describe an object", "Describe an event"],
  },
  {
    num: 3,
    title: "Part 3 — Discussion",
    desc: "Abstract follow-up questions linked to the Part 2 topic. Demonstrate critical thinking.",
    time: "4–5 min",
    topics: ["Society & Culture", "Technology & Change", "Education & Work", "Environment", "Global Issues"],
  },
];

const SAMPLE_QUESTIONS = {
  1: [
    "Do you work or are you a student? What do you enjoy about it?",
    "Tell me about your hometown. What do you like most about living there?",
    "What do you enjoy doing in your free time? How often do you do it?",
    "How do you usually spend your weekends?",
    "What kind of music do you listen to? Why do you like it?",
  ],
  2: [
    "Describe a memorable journey you have taken.\nYou should say:\n• where you went\n• who you went with\n• what you did there\n• and explain why it was memorable.",
    "Describe a person who has had a positive influence on you.\nYou should say:\n• who this person is\n• how you know them\n• what qualities they have\n• and explain how they have influenced you.",
    "Describe a skill you would like to learn.\nYou should say:\n• what the skill is\n• why you want to learn it\n• how you plan to learn it\n• and explain what benefit it would bring you.",
  ],
  3: [
    "How has travel changed in recent decades? Is this mostly positive or negative?",
    "Do you think governments should do more to promote domestic tourism? Why?",
    "What impact does mass tourism have on local cultures and communities?",
    "How might artificial intelligence change the way we learn new skills in the future?",
    "Should education focus more on practical skills or academic knowledge? Why?",
  ],
};

const PART_COLORS = {
  1: { bg: "#eff4ff", accent: "#1e5dbf", dot: "#3b82f6" },
  2: { bg: "#fdf6dc", accent: "#b45309", dot: "#f59e0b" },
  3: { bg: "#edfaf5", accent: "#0d7c59", dot: "#10b981" },
};

// ─────────────────────────────────────────────
// OFFLINE HEURISTIC EVALUATOR (no AI required)
// ─────────────────────────────────────────────
const FILLERS = ["um", "uh", "er", "erm", "like", "you know", "i mean", "kind of", "sort of", "basically", "actually", "literally"];
const LINKERS = ["because", "however", "although", "though", "for example", "for instance", "therefore", "moreover", "furthermore", "in addition", "on the other hand", "as a result", "consequently", "whereas", "while", "since", "despite", "in contrast", "firstly", "secondly", "finally", "in conclusion"];
const ADVANCED_VOCAB = ["significant", "considerable", "substantial", "remarkable", "fascinating", "intriguing", "essential", "crucial", "particularly", "especially", "genuinely", "thoroughly", "extraordinary", "perspective", "opportunity", "experience", "atmosphere", "environment", "tremendous", "incredible", "phenomenon"];
const IDIOMS = ["a piece of cake", "once in a blue moon", "hit the nail on the head", "the bottom line", "at the end of the day", "to be honest", "in the long run", "make sense", "stand out", "broaden my horizons", "look forward to"];
const COMPLEX_GRAMMAR = [
  /\bif\s+\w+\s+(would|could|had|were)\b/i,
  /\bhaving\s+\w+ed\b/i,
  /\bwhich\s+is\b/i,
  /\bwho\s+(is|has|had)\b/i,
  /\bnot only\b.*\bbut also\b/i,
  /\b(despite|in spite of)\b/i,
  /\bhad been\b/i,
  /\bwould have\b/i,
];

function evaluateOffline(transcript, partNum) {
  const text = transcript.trim();
  const lower = text.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  const sentenceCount = sentences.length || 1;
  const avgWPS = wordCount / sentenceCount;

  // Lexical diversity (Type-Token Ratio)
  const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z']/g, ""))).size;
  const ttr = wordCount > 0 ? uniqueWords / wordCount : 0;

  // Counts
  const fillerCount   = FILLERS.reduce((n, f) => n + (lower.match(new RegExp(`\\b${f}\\b`, "g")) || []).length, 0);
  const linkerCount   = LINKERS.reduce((n, l) => n + (lower.includes(l) ? 1 : 0), 0);
  const advancedCount = ADVANCED_VOCAB.reduce((n, w) => n + (lower.includes(w) ? 1 : 0), 0);
  const idiomCount    = IDIOMS.reduce((n, i) => n + (lower.includes(i) ? 1 : 0), 0);
  const complexCount  = COMPLEX_GRAMMAR.reduce((n, r) => n + (r.test(text) ? 1 : 0), 0);
  const exampleCount  = (lower.match(/\b(for example|for instance|such as|like when|like the time)\b/g) || []).length;

  const fillerRatio = wordCount > 0 ? fillerCount / wordCount : 0;

  // ── Per-criterion band scoring (3.0–9.0) ──
  // Fluency & Coherence
  let fluency = 4;
  if (wordCount > 150) fluency += 2.5;
  else if (wordCount > 100) fluency += 2;
  else if (wordCount > 60) fluency += 1.5;
  else if (wordCount > 30) fluency += 0.8;
  if (linkerCount >= 4) fluency += 1;
  else if (linkerCount >= 2) fluency += 0.5;
  if (fillerRatio > 0.08) fluency -= 1;
  else if (fillerRatio > 0.04) fluency -= 0.5;

  // Lexical Resource
  let vocab = 4;
  if (ttr > 0.65) vocab += 2.5;
  else if (ttr > 0.55) vocab += 2;
  else if (ttr > 0.45) vocab += 1.5;
  else if (ttr > 0.35) vocab += 1;
  if (advancedCount >= 3) vocab += 1;
  else if (advancedCount >= 1) vocab += 0.5;
  if (idiomCount >= 1) vocab += 0.5;
  if (exampleCount >= 1) vocab += 0.3;

  // Grammatical Range & Accuracy
  let grammar = 4.5;
  if (avgWPS > 14) grammar += 1.5;
  else if (avgWPS > 10) grammar += 1;
  else if (avgWPS > 7) grammar += 0.5;
  if (complexCount >= 3) grammar += 1.5;
  else if (complexCount >= 1) grammar += 0.8;
  if (sentenceCount >= 6) grammar += 0.5;

  // Pronunciation (cannot be measured from text; estimate from fluency)
  let pronunciation = 5 + (fluency - 5) * 0.6;

  // Clamp to half-bands
  const clamp = v => Math.min(9, Math.max(3, Math.round(v * 2) / 2));
  fluency = clamp(fluency);
  vocab = clamp(vocab);
  grammar = clamp(grammar);
  pronunciation = clamp(pronunciation);

  const band = clamp((fluency + vocab + grammar + pronunciation) / 4);

  // ── Comments ──
  const fluencyComment = wordCount < 40
    ? "Answer was very short. Try to extend your response with reasons and details."
    : fillerRatio > 0.06
      ? `Quite a few fillers (${fillerCount} detected). Try to pause silently instead of using "um" or "like".`
      : linkerCount >= 3
        ? "Smooth delivery with good use of linking phrases."
        : "Reasonable flow, but ideas could be connected more smoothly.";

  const vocabComment = ttr > 0.6
    ? `Excellent lexical variety (${uniqueWords} unique words out of ${wordCount}).`
    : ttr > 0.45
      ? "Decent range of vocabulary, with some repetition."
      : `Limited variety — many words are repeated (only ${uniqueWords} unique out of ${wordCount}). Use synonyms.`;

  const grammarComment = complexCount >= 2
    ? "Good attempts at complex structures (conditionals, relative clauses)."
    : avgWPS < 7
      ? "Sentences are quite short. Try combining ideas with conjunctions."
      : "Mostly simple sentences — add some subordinate clauses for variety.";

  const pronComment = "Estimated from text only — actual pronunciation requires audio analysis.";

  // ── Strengths & improvements (dynamic) ──
  const strengths = [];
  if (wordCount > 100) strengths.push(`Good answer length (${wordCount} words) — you developed your ideas.`);
  if (linkerCount >= 3) strengths.push(`Used ${linkerCount} linking phrases to connect ideas.`);
  if (advancedCount >= 2) strengths.push(`Reached for advanced vocabulary (${advancedCount} sophisticated words).`);
  if (idiomCount >= 1) strengths.push("Used idiomatic language — sounds more natural.");
  if (complexCount >= 2) strengths.push("Attempted complex grammatical structures.");
  if (exampleCount >= 1) strengths.push("Supported your point with specific examples.");
  if (strengths.length === 0) strengths.push("You attempted to address the question.");

  const improvements = [];
  if (wordCount < 80) improvements.push(`Speak longer — you said only ${wordCount} words. Aim for at least ${partNum === 2 ? 180 : 100}.`);
  if (fillerRatio > 0.05) improvements.push(`Reduce fillers — you used "${FILLERS.filter(f => lower.includes(` ${f} `)).slice(0,3).join('", "') || "um/uh"}" too often.`);
  if (linkerCount < 3) improvements.push("Use more linking phrases: 'however', 'for example', 'as a result', 'on the other hand'.");
  if (ttr < 0.5) improvements.push("Vary your vocabulary — try synonyms instead of repeating the same words.");
  if (complexCount < 2) improvements.push("Use complex sentences with 'because', 'although', 'which', 'if I had…'.");
  if (idiomCount === 0) improvements.push("Add 1–2 idiomatic expressions to sound more native (e.g., 'broaden my horizons').");
  if (exampleCount === 0) improvements.push("Support your ideas with concrete examples ('For instance, last year…').");
  if (improvements.length === 0) improvements.push("Keep practising — you're already at a solid level.");

  // ── Better phrase: pick the weakest sentence and rewrite ──
  let originalPhrase = sentences.find(s => /\b(good|nice|bad|like|very|things|stuff)\b/i.test(s)) || sentences[0] || text;
  if (originalPhrase.length > 100) originalPhrase = originalPhrase.substring(0, 95) + "...";

  let improvedPhrase = originalPhrase
    .replace(/\bvery good\b/gi, "exceptional")
    .replace(/\bvery bad\b/gi, "deeply disappointing")
    .replace(/\bvery nice\b/gi, "genuinely delightful")
    .replace(/\bvery\b/gi, "remarkably")
    .replace(/\bgood\b/gi, "excellent")
    .replace(/\bnice\b/gi, "wonderful")
    .replace(/\bbad\b/gi, "unfortunate")
    .replace(/\bbig\b/gi, "substantial")
    .replace(/\bsmall\b/gi, "modest")
    .replace(/\ba lot of\b/gi, "a considerable number of")
    .replace(/\b(things|stuff)\b/gi, "aspects")
    .replace(/\b(I like|I love)\b/gi, "I genuinely enjoy")
    .replace(/\bI think\b/gi, "From my perspective,")
    .replace(/\bbut\b/gi, "however,");
  if (improvedPhrase === originalPhrase) {
    improvedPhrase = originalPhrase.replace(/\.?$/, "") + ", which had a meaningful impact on me.";
  }

  const level = band >= 7.5 ? "Very strong" : band >= 6.5 ? "Competent" : band >= 5.5 ? "Developing" : "Basic";
  const examinerNote = `Part ${partNum} — ${level} performance. ${
    wordCount < 60 ? "Your answer was too brief; develop ideas with reasons and examples."
    : ttr < 0.45 ? "Try to use a wider range of vocabulary."
    : linkerCount < 3 ? "Connect your ideas with more linking phrases."
    : "Keep building on this with idiomatic language and complex structures."
  }`;

  return {
    band,
    criteria: {
      fluency:       { score: fluency,       comment: fluencyComment },
      vocabulary:    { score: vocab,         comment: vocabComment },
      grammar:       { score: grammar,       comment: grammarComment },
      pronunciation: { score: pronunciation, comment: pronComment },
    },
    strengths: strengths.slice(0, 4),
    improvements: improvements.slice(0, 5),
    betterPhrase: { original: originalPhrase, improved: improvedPhrase },
    examinerNote,
    stats: { wordCount, uniqueWords, sentenceCount, fillerCount, linkerCount, ttr: +ttr.toFixed(2) },
  };
}
async function evaluateLocal(transcript, partNum) {
  await new Promise(r => setTimeout(r, 900)); // small UX delay
  return evaluateOffline(transcript, partNum);
}

// ─────────────────────────────────────────────
// WEB SPEECH API TRANSCRIPTION
// ─────────────────────────────────────────────
function useWebSpeech(onTranscript, onInterimTranscript) {
  const recognitionRef = useRef(null);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      recognition.onresult = (e) => {
        let interim = "";
        let final = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) final += t + " ";
          else interim += t;
        }
        if (final) onTranscript(final);
        if (interim) onInterimTranscript?.(interim);
      };
      recognition.onerror = (e) => console.warn("Speech recognition error:", e.error);
      recognitionRef.current = recognition;
    }
  }, []);

  return {
    supported,
    start: () => { try { recognitionRef.current?.start(); } catch (_) {} },
    stop:  () => { try { recognitionRef.current?.stop();  } catch (_) {} },
  };
}

// ─────────────────────────────────────────────
// BAND RING SVG
// ─────────────────────────────────────────────
function BandRing({ score, size = 72, label }) {
  const pct   = ((score - 4) / 5) * 100;
  const r     = size / 2 - 7;
  const circ  = 2 * Math.PI * r;
  const color = score >= 7.5 ? "#0d7c59" : score >= 6.5 ? "#c9a227" : "#a81011";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="5"/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5"
          strokeLinecap="round" strokeDasharray={circ}
          strokeDashoffset={circ * (1 - Math.max(0, Math.min(100, pct)) / 100)}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: "stroke-dashoffset 1s ease 0.2s" }}
        />
        <text x={size/2} y={size/2 + 1} textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: size > 65 ? "15px" : "11px", fontWeight: 800, fill: color, fontFamily: "Georgia, serif" }}>
          {score?.toFixed(1)}
        </text>
      </svg>
      {label && <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.4px", textAlign: "center", maxWidth: size }}>{label}</span>}
    </div>
  );
}

// ─────────────────────────────────────────────
// WAVEFORM VISUALIZER
// ─────────────────────────────────────────────
function WaveformBars({ active }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 28 }}>
      {[0,1,2,3,4,5,6,7].map(i => (
        <div key={i} style={{
          width: 3, borderRadius: 99,
          background: active ? "#a81011" : "#d1d5db",
          height: active ? undefined : 6,
          animation: active ? `wave ${0.5 + i * 0.07}s ease-in-out infinite alternate` : "none",
          animationDelay: `${i * 0.06}s`,
        }} />
      ))}
      <style>{`
        @keyframes wave {
          from { height: 4px; }
          to   { height: 26px; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────
// FEEDBACK PANEL
// ─────────────────────────────────────────────
function FeedbackPanel({ evaluation, transcript, interimText, onClose }) {
  const [tab, setTab] = useState("scores");
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose?.(), 320);
  };

  const criteriaOrder = ["fluency", "vocabulary", "grammar", "pronunciation"];
  const criteriaLabels = {
    fluency: "Fluency & Coherence",
    vocabulary: "Lexical Resource",
    grammar: "Grammatical Range",
    pronunciation: "Pronunciation",
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(8,16,40,0.65)",
        zIndex: 1000,
        display: "flex", alignItems: "flex-end", justifyContent: "center",
        backdropFilter: "blur(6px)",
        opacity: visible ? 1 : 0, transition: "opacity 0.3s ease",
      }}
    >
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 780, background: "#fff",
        borderRadius: "24px 24px 0 0",
        maxHeight: "90vh", overflowY: "auto",
        transform: visible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.45s cubic-bezier(0.34,1.3,0.64,1)",
        boxShadow: "0 -12px 60px rgba(0,0,0,0.2)",
      }}>
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 36, height: 4, background: "#e2e8f0", borderRadius: 99 }} />
        </div>

        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg,#0c1f4a 0%,#1e3a6e 60%,#a81011 100%)",
          margin: "12px 16px 0", borderRadius: 16, padding: "22px 24px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
            <div>
              <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>
                IELTS Examiner — Offline Analysis
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6 }}>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "2rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                  Band {evaluation.band?.toFixed(1)}
                </h2>
                <span style={{
                  fontSize: "0.7rem", fontWeight: 700,
                  background: evaluation.band >= 7 ? "rgba(16,185,129,0.2)" : evaluation.band >= 6 ? "rgba(245,158,11,0.2)" : "rgba(168,16,17,0.2)",
                  color: evaluation.band >= 7 ? "#6ee7b7" : evaluation.band >= 6 ? "#fcd34d" : "#fca5a5",
                  padding: "3px 10px", borderRadius: 99, border: "1px solid currentColor",
                }}>
                  {evaluation.band >= 7.5 ? "Excellent" : evaluation.band >= 6.5 ? "Good" : evaluation.band >= 5.5 ? "Competent" : "Developing"}
                </span>
              </div>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.5, maxWidth: 380 }}>
                {evaluation.examinerNote}
              </p>
              {evaluation.stats && (
                <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap" }}>
                  {[
                    ["Words", evaluation.stats.wordCount],
                    ["Unique", evaluation.stats.uniqueWords],
                    ["Sentences", evaluation.stats.sentenceCount],
                    ["Fillers", evaluation.stats.fillerCount],
                    ["Linkers", evaluation.stats.linkerCount],
                  ].map(([k,v]) => (
                    <div key={k}>
                      <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>{k}</p>
                      <p style={{ fontSize: "0.95rem", color: "#fff", fontWeight: 700, fontFamily: "Georgia, serif" }}>{v}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <BandRing score={evaluation.band} size={80} />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", margin: "14px 16px 0", borderBottom: "1px solid #f1f5f9", gap: 0 }}>
          {[["scores","Scores"],["transcript","Transcript"],["improve","Improve"]].map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              padding: "10px 20px", background: "none", border: "none", cursor: "pointer",
              fontSize: "0.82rem", fontWeight: 700,
              color: tab === id ? "#0c1f4a" : "#94a3b8",
              borderBottom: `2px solid ${tab === id ? "#a81011" : "transparent"}`,
              marginBottom: -1, transition: "all 0.15s",
            }}>{label}</button>
          ))}
        </div>

        <div style={{ padding: "20px 16px 36px" }}>

          {/* ── TAB: Scores ── */}
          {tab === "scores" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
                {criteriaOrder.map(k => (
                  <div key={k} style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 8px", textAlign: "center", border: "1px solid #f1f5f9" }}>
                    <BandRing score={evaluation.criteria?.[k]?.score ?? 6} size={60} />
                    <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#64748b", marginTop: 6, lineHeight: 1.3 }}>{criteriaLabels[k]}</p>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {criteriaOrder.map(k => {
                  const c = evaluation.criteria?.[k];
                  if (!c) return null;
                  const color = c.score >= 7.5 ? "#0d7c59" : c.score >= 6.5 ? "#c9a227" : "#a81011";
                  return (
                    <div key={k} style={{ display: "flex", gap: 12, alignItems: "flex-start", background: "#f8fafc", borderRadius: 10, padding: "12px 14px", border: "1px solid #f1f5f9" }}>
                      <div style={{ minWidth: 36, textAlign: "center" }}>
                        <span style={{ fontSize: "0.9rem", fontWeight: 800, color, fontFamily: "Georgia, serif" }}>{c.score?.toFixed(1)}</span>
                      </div>
                      <div>
                        <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#374151", marginBottom: 2 }}>{criteriaLabels[k]}</p>
                        <p style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.5 }}>{c.comment}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* IELTS band scale */}
              <div style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 16px", border: "1px solid #f1f5f9", marginTop: 16 }}>
                <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>IELTS Band Scale</p>
                <div style={{ display: "flex", gap: 3 }}>
                  {[4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9].map(b => {
                    const active = Math.abs(b - (evaluation.band||6)) < 0.26;
                    const color  = b >= 7.5 ? "#0d7c59" : b >= 6.0 ? "#c9a227" : "#a81011";
                    return (
                      <div key={b} style={{ flex:1, height: active ? 28 : 18, background: active ? color : "#e2e8f0", borderRadius: 4, display:"flex", alignItems:"center", justifyContent:"center", alignSelf:"flex-end", transition:"all 0.3s" }}>
                        {active && <span style={{ fontSize:"0.6rem", fontWeight:800, color:"#fff" }}>{b}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: Transcript ── */}
          {tab === "transcript" && (
            <div>
              {interimText && (
                <div style={{ background: "#fef9ec", borderRadius: 10, padding: "12px 14px", marginBottom: 12, border: "1px solid rgba(201,162,39,0.2)", fontSize: "0.82rem", color: "#92400e" }}>
                  <span style={{ fontWeight: 700 }}>Live: </span>{interimText}
                </div>
              )}
              <div style={{ background: "#f8fafc", borderRadius: 12, padding: "18px 20px", border: "1px solid #f1f5f9", marginBottom: 16 }}>
                <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#94a3b8", marginBottom: 10 }}>Your Answer</p>
                <p style={{ fontSize: "0.92rem", lineHeight: 1.85, color: "#1e293b", fontFamily: "Georgia, serif", whiteSpace: "pre-wrap" }}>{transcript}</p>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ background: "#f0fdf4", borderRadius: 12, padding: "14px 16px", border: "1px solid rgba(13,124,89,0.15)" }}>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", color: "#0d7c59", marginBottom: 10 }}>What you did well</p>
                  {evaluation.strengths?.map((s,i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                      <span style={{ color: "#0d7c59", flexShrink: 0, marginTop: 1 }}>✓</span>
                      <p style={{ fontSize: "0.8rem", color: "#166534", lineHeight: 1.5 }}>{s}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#fef9ec", borderRadius: 12, padding: "14px 16px", border: "1px solid rgba(201,162,39,0.15)" }}>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", color: "#c9a227", marginBottom: 10 }}>To improve</p>
                  {evaluation.improvements?.map((s,i) => (
                    <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                      <span style={{ color: "#c9a227", fontWeight: 700, flexShrink: 0 }}>{i+1}.</span>
                      <p style={{ fontSize: "0.8rem", color: "#92400e", lineHeight: 1.5 }}>{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: Improve ── */}
          {tab === "improve" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {evaluation.betterPhrase && (
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f1f5f9", overflow: "hidden" }}>
                  <div style={{ background: "#f8fafc", padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
                    <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#94a3b8" }}>
                      Phrase Upgrade Suggestion
                    </p>
                  </div>
                  <div style={{ padding: "20px" }}>
                    <div style={{ marginBottom: 16 }}>
                      <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#a81011", marginBottom: 6 }}>You said:</p>
                      <p style={{ fontSize: "0.9rem", color: "#374151", fontStyle: "italic", background: "#fef2f2", padding: "14px", borderRadius: 10, borderLeft: "4px solid #a81011" }}>
                        "{evaluation.betterPhrase.original}"
                      </p>
                    </div>

                    <div style={{ textAlign: "center", margin: "12px 0" }}>
                      <span style={{ color: "#0d7c59", fontSize: "1.4rem" }}>↓</span>
                    </div>

                    <div>
                      <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#0d7c59", marginBottom: 6 }}>Better version:</p>
                      <p style={{ fontSize: "0.9rem", color: "#166534", fontStyle: "italic", background: "#f0fdf4", padding: "14px", borderRadius: 10, borderLeft: "4px solid #0d7c59" }}>
                        "{evaluation.betterPhrase.improved}"
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ background: "#f8fafc", borderRadius: 14, padding: "20px", border: "1px solid #f1f5f9" }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0c1f4a", marginBottom: 14 }}>
                  To reach Band {Math.min(9, (evaluation.band || 6) + 0.5).toFixed(1)} — personalized recommendations
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {evaluation.improvements?.map((tip, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{
                        width: 24, height: 24, borderRadius: "50%",
                        background: "linear-gradient(135deg, #a81011, #c41718)",
                        color: "#fff", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontSize: "0.75rem", fontWeight: 800, flexShrink: 0
                      }}>{i+1}</div>
                      <p style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "#374151" }}>{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function Speaking() {
  const [, navigate] = useLocation();
  const [activePart, setActivePart] = useState(null);
  const [qIndex, setQIndex] = useState(0);

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [duration, setDuration] = useState(0);

  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const finalTranscriptRef = useRef("");

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [aiError, setAiError] = useState("");

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  const currentQuestion = activePart ? SAMPLE_QUESTIONS[activePart][qIndex] : "";

  const speech = useWebSpeech(
    (text) => {
      finalTranscriptRef.current += text;
      setFinalTranscript(finalTranscriptRef.current);
    },
    (interim) => setInterimTranscript(interim)
  );

  useEffect(() => { resetAll(); /* eslint-disable-next-line */ }, [activePart, qIndex]);

  const resetAll = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && isRecording) mediaRecorderRef.current.stop();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    speech.stop();
    setIsRecording(false);
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    setFinalTranscript("");
    setInterimTranscript("");
    finalTranscriptRef.current = "";
    setEvaluation(null);
    setShowPanel(false);
    setAiError("");
    setIsAnalyzing(false);
    chunksRef.current = [];
  }, [audioUrl, isRecording]);

  const startRecording = async () => {
    resetAll();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url  = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setIsRecording(false);
        stream.getTracks().forEach(t => t.stop());
        if (timerRef.current) clearInterval(timerRef.current);
      };

      mr.start();
      if (speech.supported) speech.start();
      setIsRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    } catch (err) {
      console.error(err);
      alert("Microphone access denied. Please allow microphone permission and try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      speech.stop();
      setInterimTranscript("");
    }
  };

  const analyzeAnswer = async () => {
    const text = finalTranscriptRef.current.trim();
    if (!text) {
      setAiError("Запишите ответ перед анализом. (Если транскрипт пуст — используйте Chrome для распознавания речи.)");
      return;
    }
    setIsAnalyzing(true);
    setAiError("");
    try {
      const result = await evaluateLocal(text, activePart);
      setEvaluation(result);
      setShowPanel(true);
    } catch (err) {
      console.error(err);
      setAiError("Ошибка анализа.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fmtTime = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  const pc = activePart ? PART_COLORS[activePart] : null;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "36px 24px 100px", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <p style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "2.5px", textTransform: "uppercase", color: "#a81011", marginBottom: 12 }}>
          <span style={{ width: 20, height: 2, background: "#a81011", display: "block" }} />
          IELTS Academic
        </p>
        <h1 style={{ fontFamily: "Georgia, 'Playfair Display', serif", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, color: "#0c1f4a", marginBottom: 10 }}>
          Speaking Module
        </h1>
        <p style={{ color: "#64748b", maxWidth: 520, fontSize: "0.92rem", lineHeight: 1.65 }}>
          Record your answer to a real IELTS question. The built-in analyser transcribes your speech and gives you a band-style score with specific feedback — fully offline, no AI required.
        </p>
      </div>

      {/* Part selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 32 }}>
        {PARTS.map(p => {
          const c   = PART_COLORS[p.num];
          const act = activePart === p.num;
          return (
            <div key={p.num}
              onClick={() => { setActivePart(act ? null : p.num); setQIndex(0); }}
              style={{
                background: "#fff",
                border: `1.5px solid ${act ? c.dot : "#e2e8f0"}`,
                borderRadius: 16, padding: "18px 20px", cursor: "pointer",
                transform: act ? "translateY(-3px)" : "none",
                boxShadow: act ? `0 6px 24px ${c.dot}30` : "0 1px 4px rgba(0,0,0,0.05)",
                transition: "all 0.2s",
                position: "relative", overflow: "hidden",
              }}
            >
              {act && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: c.dot, borderRadius: "16px 16px 0 0" }} />}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", color: c.accent, background: c.bg, padding: "3px 10px", borderRadius: 99 }}>Part {p.num}</span>
                <span style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 600 }}>{p.time}</span>
              </div>
              <h3 style={{ fontSize: "0.88rem", fontWeight: 700, color: "#0c1f4a", marginBottom: 6, lineHeight: 1.3 }}>{p.title.split("—")[1]?.trim()}</h3>
              <p style={{ fontSize: "0.75rem", color: "#64748b", lineHeight: 1.5 }}>{p.desc}</p>
            </div>
          );
        })}
      </div>

      {activePart && (
        <div style={{
          background: "#fff", border: "1.5px solid #e2e8f0",
          borderRadius: 20, overflow: "hidden",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        }}>
          <div style={{ height: 4, background: `linear-gradient(90deg, ${pc.dot}, #a81011)` }} />

          <div style={{ padding: "24px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", background: pc.bg, color: pc.accent, padding: "3px 10px", borderRadius: 99 }}>
                  Part {activePart} — Q{qIndex+1}/{SAMPLE_QUESTIONS[activePart].length}
                </span>
                {activePart === 2 && <span style={{ fontSize: "0.68rem", color: "#94a3b8", fontWeight: 600 }}>1 min to prepare</span>}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => setQIndex(i => Math.max(0, i-1))} disabled={qIndex===0}
                  style={{ padding: "5px 12px", fontSize: "0.78rem", fontWeight: 600, border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", color: qIndex===0?"#d1d5db":"#374151", cursor: qIndex===0?"not-allowed":"pointer" }}>
                  ←
                </button>
                <button onClick={() => setQIndex(i => i < SAMPLE_QUESTIONS[activePart].length-1 ? i+1 : i)} disabled={qIndex>=SAMPLE_QUESTIONS[activePart].length-1}
                  style={{ padding: "5px 12px", fontSize: "0.78rem", fontWeight: 600, border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", color: qIndex>=SAMPLE_QUESTIONS[activePart].length-1?"#d1d5db":"#374151", cursor: qIndex>=SAMPLE_QUESTIONS[activePart].length-1?"not-allowed":"pointer" }}>
                  →
                </button>
                <button onClick={() => setQIndex(Math.floor(Math.random()*SAMPLE_QUESTIONS[activePart].length))}
                  style={{ padding: "5px 12px", fontSize: "0.78rem", fontWeight: 600, border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", color: "#374151", cursor: "pointer" }}>
                  ⇌
                </button>
              </div>
            </div>

            <div style={{
              background: "#f8fafc", borderRadius: 14, padding: "20px 22px",
              marginBottom: 24, border: "1px solid #f1f5f9",
              borderLeft: `4px solid ${pc.dot}`,
            }}>
              <p style={{ fontSize: "1rem", color: "#0c1f4a", lineHeight: 1.8, whiteSpace: "pre-line", fontFamily: "Georgia, serif" }}>
                {currentQuestion}
              </p>
            </div>

            <div style={{ background: "#f8fafc", borderRadius: 14, padding: "20px 22px", border: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151" }}>
                  {isRecording ? "Recording…" : audioUrl ? "Recording complete" : "Ready to record"}
                </p>
                {isRecording && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#a81011", animation: "pulse 1s ease-in-out infinite" }} />
                    <span style={{ fontFamily: "monospace", fontSize: "0.88rem", fontWeight: 700, color: "#a81011" }}>{fmtTime(duration)}</span>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
                {!isRecording && !audioUrl && (
                  <button onClick={startRecording} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "11px 24px", borderRadius: 12, border: "none", cursor: "pointer",
                    background: "linear-gradient(135deg,#a81011,#c41718)", color: "#fff",
                    fontSize: "0.88rem", fontWeight: 700,
                    boxShadow: "0 4px 16px rgba(168,16,17,0.3)",
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                    Start Recording
                  </button>
                )}

                {isRecording && (
                  <button onClick={stopRecording} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "11px 24px", borderRadius: 12, border: "1.5px solid #a81011", cursor: "pointer",
                    background: "#fff", color: "#a81011",
                    fontSize: "0.88rem", fontWeight: 700,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
                    Stop
                  </button>
                )}

                {audioUrl && (
                  <>
                    <audio controls src={audioUrl} style={{ height: 36, flex: "0 0 auto" }} />
                    <button onClick={resetAll} style={{
                      padding: "8px 14px", fontSize: "0.8rem", fontWeight: 600,
                      border: "1px solid #e2e8f0", borderRadius: 9, background: "#fff", color: "#64748b", cursor: "pointer",
                    }}>
                      Discard
                    </button>
                    <button onClick={analyzeAnswer} disabled={isAnalyzing} style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "11px 24px", borderRadius: 12, border: "none", cursor: isAnalyzing ? "not-allowed" : "pointer",
                      background: isAnalyzing ? "#f1f5f9" : "linear-gradient(135deg,#0c1f4a,#1e3a6e)",
                      color: isAnalyzing ? "#94a3b8" : "#fff",
                      fontSize: "0.88rem", fontWeight: 700,
                      boxShadow: isAnalyzing ? "none" : "0 4px 16px rgba(12,31,74,0.25)",
                    }}>
                      {isAnalyzing ? (
                        <>
                          <span style={{ display: "inline-block", animation: "spin 0.7s linear infinite", fontSize: 14 }}>◌</span>
                          Analyzing…
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                          Get Feedback
                        </>
                      )}
                    </button>
                  </>
                )}

                {isRecording && <WaveformBars active />}
              </div>

              {(finalTranscript || interimTranscript) && (
                <div style={{ marginTop: 4 }}>
                  <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#94a3b8", marginBottom: 6 }}>Live transcript</p>
                  <p style={{ fontSize: "0.85rem", color: "#374151", lineHeight: 1.7, background: "#fff", padding: "10px 14px", borderRadius: 8, border: "1px solid #f1f5f9" }}>
                    <span>{finalTranscript}</span>
                    {interimTranscript && <span style={{ color: "#94a3b8" }}> {interimTranscript}</span>}
                  </p>
                </div>
              )}

              {aiError && (
                <div style={{ marginTop: 10, padding: "10px 14px", background: "#fef2f2", border: "1px solid rgba(168,16,17,0.2)", borderRadius: 8, fontSize: "0.82rem", color: "#a81011" }}>
                  {aiError}
                </div>
              )}

              {!speech.supported && (
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 8 }}>
                  Note: Live transcription is not supported in this browser. Try Chrome or Edge for speech recognition.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {!activePart && (
        <div style={{ background: "#f8fafc", borderRadius: 16, padding: "22px 24px", border: "1px solid #f1f5f9", marginTop: 4 }}>
          <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0c1f4a", marginBottom: 14 }}>Speaking Tips</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10 }}>
            {[
              "Don't memorise scripts — speak naturally and spontaneously",
              "Use fillers wisely: 'That's an interesting question…'",
              "Always extend your answers — aim for 3+ sentences",
              "Vary vocabulary — avoid repeating the same words",
              "Speak at a natural pace — clarity beats speed",
              "Self-correct confidently: 'What I meant was…'",
            ].map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: "#a81011", fontWeight: 800, flexShrink: 0, marginTop: 1, fontSize: "0.8rem" }}>✓</span>
                <span style={{ fontSize: "0.8rem", color: "#64748b", lineHeight: 1.55 }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showPanel && evaluation && (
        <FeedbackPanel
          evaluation={evaluation}
          transcript={finalTranscript}
          interimText={interimTranscript}
          onClose={() => setShowPanel(false)}
        />
      )}

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes pulse   { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  );
}