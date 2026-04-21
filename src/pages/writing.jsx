// src/pages/Writing.jsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useLocation } from "wouter";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

// ─────────────────────────────────────────────
// INLINE SVG CHARTS (real visuals, no images)
// ─────────────────────────────────────────────
function BarChartInternet() {
  const data = [
    { label: "16–24", v: 99 },
    { label: "25–34", v: 98 },
    { label: "35–44", v: 96 },
    { label: "45–54", v: 92 },
    { label: "55–64", v: 83 },
    { label: "65–74", v: 64 },
    { label: "75+",   v: 32 },
  ];
  const W = 520, H = 280, P = 40;
  const max = 100;
  const bw = (W - P * 2) / data.length - 8;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ background: "#fff", borderRadius: 10 }}>
      <text x={W / 2} y={20} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700, fill: "#0c1f4a" }}>
        Daily Internet Use by Age Group, UK 2020 (%)
      </text>
      {[0, 25, 50, 75, 100].map(y => {
        const py = H - P - ((H - P * 2) * y) / max;
        return (
          <g key={y}>
            <line x1={P} y1={py} x2={W - P} y2={py} stroke="#e2e8f0" />
            <text x={P - 6} y={py + 3} textAnchor="end" style={{ fontSize: 9, fill: "#94a3b8" }}>{y}%</text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const x = P + i * (bw + 8) + 4;
        const h = ((H - P * 2) * d.v) / max;
        const y = H - P - h;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={bw} height={h} fill="url(#barGrad)" rx={3} />
            <text x={x + bw / 2} y={y - 4} textAnchor="middle" style={{ fontSize: 10, fontWeight: 700, fill: "#0c1f4a" }}>{d.v}%</text>
            <text x={x + bw / 2} y={H - P + 14} textAnchor="middle" style={{ fontSize: 10, fill: "#64748b" }}>{d.label}</text>
          </g>
        );
      })}
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e3a6e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function LineChartCO2() {
  const years = [1990, 1995, 2000, 2005, 2010, 2015, 2020];
  const series = [
    { name: "USA",   color: "#a81011", data: [19.5, 19.8, 20.5, 19.6, 17.4, 16.0, 14.2] },
    { name: "China", color: "#f59e0b", data: [2.1, 2.7, 2.9, 4.5, 6.7, 7.4, 7.9] },
    { name: "UK",    color: "#1e5dbf", data: [9.8, 9.5, 9.4, 9.0, 7.8, 6.4, 4.8] },
    { name: "India", color: "#0d7c59", data: [0.7, 0.9, 1.0, 1.2, 1.5, 1.7, 1.9] },
  ];
  const W = 540, H = 290, P = 44;
  const max = 22;
  const xS = i => P + ((W - P * 2) * i) / (years.length - 1);
  const yS = v => H - P - ((H - P * 2) * v) / max;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ background: "#fff", borderRadius: 10 }}>
      <text x={W / 2} y={20} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700, fill: "#0c1f4a" }}>
        CO₂ Emissions per Capita (tonnes), 1990–2020
      </text>
      {[0, 5, 10, 15, 20].map(g => {
        const py = yS(g);
        return (
          <g key={g}>
            <line x1={P} y1={py} x2={W - P} y2={py} stroke="#e2e8f0" />
            <text x={P - 6} y={py + 3} textAnchor="end" style={{ fontSize: 9, fill: "#94a3b8" }}>{g}</text>
          </g>
        );
      })}
      {years.map((y, i) => (
        <text key={y} x={xS(i)} y={H - P + 14} textAnchor="middle" style={{ fontSize: 10, fill: "#64748b" }}>{y}</text>
      ))}
      {series.map(s => {
        const path = s.data.map((v, i) => `${i === 0 ? "M" : "L"} ${xS(i)} ${yS(v)}`).join(" ");
        return (
          <g key={s.name}>
            <path d={path} fill="none" stroke={s.color} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
            {s.data.map((v, i) => <circle key={i} cx={xS(i)} cy={yS(v)} r={3} fill={s.color} />)}
          </g>
        );
      })}
      <g transform={`translate(${W - P - 90}, 36)`}>
        {series.map((s, i) => (
          <g key={s.name} transform={`translate(0, ${i * 16})`}>
            <rect width={10} height={10} fill={s.color} rx={2} />
            <text x={14} y={9} style={{ fontSize: 10, fill: "#374151", fontWeight: 600 }}>{s.name}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function ProcessDiagramRecycling() {
  const stages = [
    { x: 60,  y: 90,  label: "1. Used paper\ncollected" },
    { x: 200, y: 90,  label: "2. Sorted by\ntype" },
    { x: 340, y: 90,  label: "3. Shredded\n& cleaned" },
    { x: 480, y: 90,  label: "4. Pulped\nwith water" },
    { x: 480, y: 220, label: "5. Bleached &\nde-inked" },
    { x: 340, y: 220, label: "6. Pressed\n& dried" },
    { x: 200, y: 220, label: "7. Rolled into\nnew sheets" },
    { x: 60,  y: 220, label: "8. New paper\nproducts" },
  ];
  return (
    <svg viewBox="0 0 560 320" width="100%" style={{ background: "#fff", borderRadius: 10 }}>
      <text x={280} y={22} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700, fill: "#0c1f4a" }}>
        The Paper Recycling Process
      </text>
      {stages.map((s, i) => {
        const next = stages[i + 1];
        return (
          <g key={i}>
            <rect x={s.x - 50} y={s.y - 28} width={100} height={56} rx={8} fill="#edfaf5" stroke="#0d7c59" strokeWidth={1.4} />
            {s.label.split("\n").map((l, j) => (
              <text key={j} x={s.x} y={s.y - 4 + j * 13} textAnchor="middle" style={{ fontSize: 10, fontWeight: 600, fill: "#0c1f4a" }}>{l}</text>
            ))}
            {next && i !== 3 && (
              <line x1={s.x + 50} y1={s.y} x2={next.x - 50} y2={next.y} stroke="#0d7c59" strokeWidth={1.5} markerEnd="url(#arrow)" />
            )}
            {i === 3 && (
              <path d={`M ${s.x} ${s.y + 28} Q ${s.x + 60} ${(s.y + next.y) / 2} ${next.x} ${next.y - 28}`} fill="none" stroke="#0d7c59" strokeWidth={1.5} markerEnd="url(#arrow)" />
            )}
          </g>
        );
      })}
      <defs>
        <marker id="arrow" markerWidth={8} markerHeight={8} refX={7} refY={4} orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#0d7c59" />
        </marker>
      </defs>
    </svg>
  );
}

const CHART_BY_ID = {
  "t1-1": BarChartInternet,
  "t1-2": LineChartCO2,
  "t1-3": ProcessDiagramRecycling,
};

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const TASK1_PROMPTS = [
  {
    id: "t1-1",
    title: "Bar Chart — Internet Usage",
    difficulty: "Foundation",
    description: "The bar chart below shows the percentage of people in different age groups who used the internet daily in the UK in 2020.",
    minWords: 150,
    tips: ["Start with an overview — pick the most striking trend","Group age groups logically (young vs older)","Use accurate data language: 'approximately', 'roughly'","Avoid opinions or explanations — just describe"],
    structure: [
      { label: "Introduction", desc: "Paraphrase the task. Do NOT copy the prompt." },
      { label: "Overview",     desc: "2 sentences. Biggest trend + exception." },
      { label: "Body 1",       desc: "Describe 2-3 specific data points with figures." },
      { label: "Body 2",       desc: "Compare or contrast remaining groups with figures." },
    ],
    sampleBands: { words: "~170–200", time: "20 min", band: "7.0+" },
  },
  {
    id: "t1-2",
    title: "Line Graph — CO₂ Emissions",
    difficulty: "Intermediate",
    description: "The line graph below shows the CO₂ emissions per capita in four countries between 1990 and 2020.",
    minWords: 150,
    tips: ["Describe trends over time, not point-by-point","Use trend language: rose sharply, declined steadily, plateaued","Make at least one comparison between countries","End with the final position of each line"],
    structure: [
      { label: "Introduction", desc: "Paraphrase — what the graph shows." },
      { label: "Overview",     desc: "Highest emitter + most notable change." },
      { label: "Body 1",       desc: "Countries 1 & 2 — trends over time." },
      { label: "Body 2",       desc: "Countries 3 & 4 — trends and comparison." },
    ],
    sampleBands: { words: "~175–210", time: "20 min", band: "7.5+" },
  },
  {
    id: "t1-3",
    title: "Process Diagram — Recycling Paper",
    difficulty: "Advanced",
    description: "The diagram below shows how paper is recycled. Summarise the information by selecting and reporting the main features.",
    minWords: 150,
    tips: ["Use passive voice: 'The paper is collected...'","Sequence language: first, then, following this, finally","Cover every stage — don't skip steps","No opinions, no data comparison needed"],
    structure: [
      { label: "Introduction", desc: "What the diagram shows (process)." },
      { label: "Overview",     desc: "How many stages, where it starts/ends." },
      { label: "Body 1",       desc: "Stages 1–4 with linking language." },
      { label: "Body 2",       desc: "Stages 5–end. Final product or output." },
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
    question: "Some people believe that technology has made education better, while others think it has had a negative impact. To what extent do you agree or disagree?",
    minWords: 250,
    tips: ["State your position clearly in the introduction","Give ONE clear opinion — don't sit on the fence","Support each body paragraph with an example","Paraphrase the question — never copy it"],
    structure: [
      { label: "Introduction",  desc: "Background + thesis (your opinion, clear)." },
      { label: "Body 1",        desc: "Main reason supporting your view + example." },
      { label: "Body 2",        desc: "Second reason OR counter-argument + rebuttal." },
      { label: "Conclusion",    desc: "Restate opinion. No new ideas." },
    ],
    keyPhrases: ["In my view, …","I strongly believe that …","While some argue that …, I contend that …","This is evidenced by …","To conclude, …"],
    sampleBands: { words: "~270–300", time: "40 min", band: "7.0+" },
  },
  {
    id: "t2-2",
    title: "Discussion Essay — Remote Work",
    difficulty: "Intermediate",
    type: "Discussion",
    question: "Remote working has become increasingly common. Discuss the advantages and disadvantages of this trend and give your own opinion.",
    minWords: 250,
    tips: ["Present BOTH sides before giving opinion","Use a clear topic sentence for each paragraph","Avoid personal anecdotes — use general examples","Your opinion in the conclusion must match your essay"],
    structure: [
      { label: "Introduction",  desc: "Topic intro + outline (discuss both + opinion)." },
      { label: "Advantages",    desc: "2 advantages with explanation and example." },
      { label: "Disadvantages", desc: "2 disadvantages with explanation and example." },
      { label: "Conclusion",    desc: "Summary + your overall opinion." },
    ],
    keyPhrases: ["On the one hand, …","On the other hand, …","A significant advantage is …","However, a major drawback is …","Overall, I believe …"],
    sampleBands: { words: "~280–320", time: "40 min", band: "7.5+" },
  },
  {
    id: "t2-3",
    title: "Problem-Solution — Urban Traffic",
    difficulty: "Advanced",
    type: "Problem / Solution",
    question: "Traffic congestion in cities is a serious and growing problem. What are the causes of this problem and what measures could be taken to solve it?",
    minWords: 250,
      tips: ["Clearly separate causes from solutions","Each paragraph = one main idea, fully developed","Use modal verbs for solutions: could, should, might","Be specific — avoid vague phrases like 'things would improve'"],
    structure: [
      { label: "Introduction", desc: "Introduce topic + state you'll cover causes & solutions." },
      { label: "Causes",       desc: "2 main causes of congestion, well explained." },
      { label: "Solutions",    desc: "2 practical solutions linked to each cause." },
      { label: "Conclusion",   desc: "Summarise key points. Optional: future outlook." },
    ],
    keyPhrases: ["One of the primary causes is …","This leads to …","A possible solution would be to …","Governments could invest in …","If these measures were implemented, …"],
    sampleBands: { words: "~290–330", time: "40 min", band: "8.0+" },
  },
];

// ─────────────────────────────────────────────
// FEEDBACK GENERATOR (offline, IELTS-style)
// ─────────────────────────────────────────────
function generateFeedback(text, taskNum) {
  const words      = text.trim().split(/\s+/).filter(Boolean);
  const wc         = words.length;
  const sentences  = text.split(/[.!?]+/).filter(s => s.trim().length > 8);
  const paras      = text.split(/\n\n+/).filter(p => p.trim().length > 20);
  const avgSentLen = wc / Math.max(sentences.length, 1);

  const hasOverview   = /overall|in general|it is (clear|evident|apparent)|notably|as (a whole|can be seen)/i.test(text);
  const hasLinking    = /(furthermore|however|in addition|moreover|on the other hand|by contrast|consequently|nevertheless|as a result|therefore|additionally)/i.test(text);
  const hasPassive    = /\b(is|are|was|were|has been|have been)\s+\w+(ed|en)\b/i.test(text);
  const hasFigures    = /\d+\s*(%|per cent|million|billion|thousand)|approximately\s+\d+/i.test(text);
  const hasConclusion = /\b(in conclusion|to conclude|to summarise|in summary|overall|in brief)\b/i.test(text);
  const hasThesis     = /(i (strongly )?(believe|think|argue|contend)|in my (view|opinion)|it is my (view|belief))/i.test(text);
  const hasTrendLang  = /(rose|fell|declined|increased|decreased|surged|dropped|remained|plateaued|fluctuated|peaked|grew)\b/i.test(text);
  const hasExamples   = /(for example|for instance|such as|namely|to illustrate)/i.test(text);
  const uniqueRatio   = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g,""))).size / Math.max(wc, 1);
  const longSentRatio = sentences.filter(s => s.trim().split(/\s+/).length > 15).length / Math.max(sentences.length, 1);

  let ta = 5.0;
  if (wc >= (taskNum===1?150:250)) ta += 0.5;
  if (wc >= (taskNum===1?170:280)) ta += 0.25;
  if (hasOverview)    ta += taskNum===1 ? 0.75 : 0.25;
  if (hasFigures)     ta += taskNum===1 ? 0.75 : 0.25;
  if (hasConclusion)  ta += taskNum===2 ? 0.75 : 0.25;
  if (hasThesis)      ta += taskNum===2 ? 0.5  : 0;
  if (hasTrendLang)   ta += taskNum===1 ? 0.5  : 0;
  if (paras.length>=3) ta += 0.25;

  let cc = 5.0;
  if (hasLinking)          cc += 1.0;
  if (sentences.length>=6) cc += 0.5;
  if (paras.length>=3)     cc += 0.5;
  if (avgSentLen>=12 && avgSentLen<=28) cc += 0.5;
  if (hasExamples)         cc += 0.25;

  let lr = 5.0;
  if (uniqueRatio>=0.6)  lr += 0.5;
  if (uniqueRatio>=0.7)  lr += 0.5;
  if (hasPassive)        lr += 0.5;
  if (hasTrendLang)      lr += 0.25;
  if (hasExamples)       lr += 0.25;
  if (wc>220)            lr += 0.25;

  let gr = 5.0;
  if (longSentRatio>0.3) gr += 0.5;
  if (avgSentLen>=10)    gr += 0.25;
  if (hasPassive)        gr += 0.5;
  if (sentences.length>=5) gr += 0.25;
  if (hasLinking)        gr += 0.25;
  if (wc>180)            gr += 0.25;

  const round = v => Math.round(Math.min(9, Math.max(4.5, v)) * 2) / 2;
  const taScore = round(ta);
  const ccScore = round(cc);
  const lrScore = round(lr);
  const grScore = round(gr);
  const overall = Math.round(((taScore+ccScore+lrScore+grScore)/4) * 2) / 2;

  const strengths = [];
  if (hasFigures && taskNum===1)    strengths.push("Good use of specific figures and data references.");
  if (hasLinking)                   strengths.push("Effective linking language guides the reader through your ideas.");
  if (hasOverview && taskNum===1)   strengths.push("Clear overview identifies the most notable trends in the data.");
  if (hasConclusion && taskNum===2) strengths.push("Well-structured conclusion restates your position appropriately.");
  if (hasThesis && taskNum===2)     strengths.push("Your position is clearly stated in the introduction.");
  if (hasExamples)                  strengths.push("Concrete examples strengthen your argument and Task Response score.");
  if (wc>=(taskNum===1?150:250))    strengths.push(`Word count (${wc} words) meets the minimum requirement.`);
  if (uniqueRatio>=0.65)            strengths.push("Good vocabulary range — avoids repetition.");
  if (paras.length>=3)              strengths.push("Clear paragraph structure aids readability.");
  if (strengths.length===0)         strengths.push("Your response addresses the task and stays on topic.");

  const improvements = [];
  if (wc < (taskNum===1?150:250))    improvements.push(`Word count (${wc}) is below the ${taskNum===1?150:250}-word minimum — this incurs a penalty.`);
  if (!hasOverview && taskNum===1)   improvements.push("Missing overview: add 1–2 sentences summarising the most significant trend and any exception.");
  if (!hasFigures && taskNum===1)    improvements.push("Include specific figures (%, exact values) — vague descriptions lose Task Achievement marks.");
  if (!hasLinking)                   improvements.push("Cohesive devices are missing. Use 'Furthermore,', 'By contrast,' and 'As a result,'.");
  if (!hasConclusion && taskNum===2) improvements.push("Add a clear conclusion that restates your overall opinion.");
  if (!hasThesis && taskNum===2)     improvements.push("State your position explicitly: 'I strongly believe…' or 'In my view…'");
  if (avgSentLen>30)                 improvements.push(`Average sentence is ${Math.round(avgSentLen)} words — too long. Break complex sentences for clarity.`);
  if (uniqueRatio<0.55)              improvements.push("Low vocabulary range — avoid repeating the same words. Use synonyms.");
  if (paras.length<3 && wc>80)       improvements.push("Use double line breaks to separate Introduction, Body, and Conclusion clearly.");
  if (!hasExamples && taskNum===2)   improvements.push("Add concrete examples ('For instance, …') to support your arguments.");
  if (!hasPassive && taskNum===1)    improvements.push("Use the passive voice for descriptions ('The figure is shown as…').");
  if (improvements.length===0)       improvements.push("Excellent work — focus on polishing minor grammar for an even higher band.");

  const examinerNote = `Estimated Band ${overall.toFixed(1)} — ${
    overall >= 7.5 ? "very competent essay with clear structure and strong language."
    : overall >= 6.5 ? "competent essay; address the gaps below to break into Band 7."
    : overall >= 5.5 ? "modest essay — focus on structure, examples and lexical range."
    : "limited response — review Task Achievement criteria carefully."
  }`;

  return {
    overall,
    criteria: {
      task:       { label: taskNum===1 ? "Task Achievement" : "Task Response", score: taScore },
      coherence:  { label: "Coherence & Cohesion",  score: ccScore },
      lexical:    { label: "Lexical Resource",      score: lrScore },
      grammar:    { label: "Grammatical Range",     score: grScore },
    },
    strengths: strengths.slice(0, 5),
    improvements: improvements.slice(0, 6),
    examinerNote,
    stats: { wc, sentences: sentences.length, paragraphs: paras.length, avgSentLen: Math.round(avgSentLen), uniqueRatio: +uniqueRatio.toFixed(2) },
  };
}

// ─────────────────────────────────────────────
// BAND RING
// ─────────────────────────────────────────────
function BandRing({ score, size = 80 }) {
  const pct = ((score - 4) / 5) * 100;
  const r = size / 2 - 7;
  const c = 2 * Math.PI * r;
  const color = score >= 7.5 ? "#0d7c59" : score >= 6.5 ? "#c9a227" : "#a81011";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={5} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeLinecap="round" strokeDasharray={c}
        strokeDashoffset={c * (1 - Math.max(0, Math.min(100, pct)) / 100)}
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: "stroke-dashoffset 1s ease 0.2s" }}
      />
      <text x={size/2} y={size/2 + 1} textAnchor="middle" dominantBaseline="middle"
        style={{ fontSize: size > 65 ? 16 : 12, fontWeight: 800, fill: color, fontFamily: "Georgia, serif" }}>
        {score?.toFixed(1)}
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────
// FEEDBACK PANEL
// ─────────────────────────────────────────────
function FeedbackPanel({ feedback, essay, onClose }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);
  const close = () => { setVisible(false); setTimeout(() => onClose?.(), 320); };
  const criteria = Object.values(feedback.criteria);

  return (
    <div onClick={close} style={{
      position: "fixed", inset: 0, background: "rgba(8,16,40,0.65)", zIndex: 1000,
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      backdropFilter: "blur(6px)",
      opacity: visible ? 1 : 0, transition: "opacity 0.3s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: "100%", maxWidth: 820, background: "#fff",
        borderRadius: "24px 24px 0 0", maxHeight: "92vh", overflowY: "auto",
        transform: visible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.45s cubic-bezier(0.34,1.3,0.64,1)",
        boxShadow: "0 -12px 60px rgba(0,0,0,0.2)",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 0" }}>
          <div style={{ width: 36, height: 4, background: "#e2e8f0", borderRadius: 99 }} />
        </div>

        <div style={{
          background: "linear-gradient(135deg,#0c1f4a,#1e3a6e 60%,#a81011)",
          margin: "12px 16px 0", borderRadius: 16, padding: "22px 24px",
          color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>
              IELTS Examiner — Offline Analysis
            </p>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "2rem", fontWeight: 800, margin: "0 0 6px" }}>
              Band {feedback.overall.toFixed(1)}
            </h2>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", maxWidth: 420 }}>
              {feedback.examinerNote}
            </p>
            <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap" }}>
              {[
                ["Words", feedback.stats.wc],
                ["Sentences", feedback.stats.sentences],
                ["Paragraphs", feedback.stats.paragraphs],
                ["Avg sent.", feedback.stats.avgSentLen],
              ].map(([k,v]) => (
                <div key={k}>
                  <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>{k}</p>
                  <p style={{ fontSize: "0.95rem", fontWeight: 700, fontFamily: "Georgia, serif" }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
          <BandRing score={feedback.overall} size={100} />
        </div>

        <div style={{ padding: "20px 16px 36px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
            {criteria.map(c => (
              <div key={c.label} style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 8px", textAlign: "center", border: "1px solid #f1f5f9" }}>
                <BandRing score={c.score} size={64} />
                <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "#64748b", marginTop: 6, lineHeight: 1.3 }}>{c.label}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
            <div style={{ background: "#f0fdf4", borderRadius: 12, padding: "14px 16px", border: "1px solid rgba(13,124,89,0.15)" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", color: "#0d7c59", marginBottom: 10 }}>Strengths</p>
              {feedback.strengths.map((s,i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: "#0d7c59", flexShrink: 0, marginTop: 1 }}>✓</span>
                  <p style={{ fontSize: "0.8rem", color: "#166534", lineHeight: 1.5 }}>{s}</p>
                </div>
              ))}
            </div>
            <div style={{ background: "#fef9ec", borderRadius: 12, padding: "14px 16px", border: "1px solid rgba(201,162,39,0.15)" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", color: "#c9a227", marginBottom: 10 }}>To improve</p>
              {feedback.improvements.map((s,i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: "#c9a227", fontWeight: 700, flexShrink: 0 }}>{i+1}.</span>
                  <p style={{ fontSize: "0.8rem", color: "#92400e", lineHeight: 1.5 }}>{s}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: "#f8fafc", borderRadius: 12, padding: "18px 20px", border: "1px solid #f1f5f9" }}>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#94a3b8", marginBottom: 10 }}>Your essay</p>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.85, color: "#1e293b", fontFamily: "Georgia, serif", whiteSpace: "pre-wrap" }}>{essay}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
const TOTAL_TIME = 60 * 60;

export default function Writing() {
  const [, navigate] = useLocation();
  const [activeTask, setActiveTask] = useState(1);
  const [task1Id, setTask1Id]   = useState(TASK1_PROMPTS[0].id);
  const [task2Id, setTask2Id]   = useState(TASK2_PROMPTS[0].id);
  const [task1Text, setTask1Text] = useState("");
  const [task2Text, setTask2Text] = useState("");

  const [testStarted, setTestStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [feedback, setFeedback] = useState(null);
  const [feedbackTask, setFeedbackTask] = useState(1);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!testStarted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [testStarted]);

  const task1 = TASK1_PROMPTS.find(p => p.id === task1Id);
  const task2 = TASK2_PROMPTS.find(p => p.id === task2Id);
  const currentPrompt = activeTask === 1 ? task1 : task2;
  const currentText   = activeTask === 1 ? task1Text : task2Text;
  const setCurrentText = activeTask === 1 ? setTask1Text : setTask2Text;

  const wordCount = useMemo(
    () => currentText.trim().split(/\s+/).filter(Boolean).length,
    [currentText]
  );
  const minWords = currentPrompt.minWords;
  const wordPct = Math.min(100, (wordCount / minWords) * 100);
  const ChartCmp = activeTask === 1 ? CHART_BY_ID[task1Id] : null;

  const startTest = () => { setTestStarted(true); setTimeLeft(TOTAL_TIME); };

  const submitForFeedback = (taskNum) => {
    const text = taskNum === 1 ? task1Text : task2Text;
    if (text.trim().split(/\s+/).filter(Boolean).length < 30) {
      alert("Напиши хотя бы 30 слов для анализа.");
      return;
    }
    setFeedback(generateFeedback(text, taskNum));
    setFeedbackTask(taskNum);
  };

  const finishTest = () => {
    submitForFeedback(activeTask);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const resetTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTestStarted(false);
    setTimeLeft(TOTAL_TIME);
    setTask1Text("");
    setTask2Text("");
    setFeedback(null);
    setActiveTask(1);
  };

  const timePct = (timeLeft / TOTAL_TIME) * 100;
  const timeColor = timeLeft < 300 ? "#a81011" : timeLeft < 900 ? "#c9a227" : "#0d7c59";

  if (!testStarted) {
    return (
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "36px 24px 100px", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <div style={{ marginBottom: 30 }}>
          <p style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: "0.7rem", fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "#a81011", marginBottom: 12 }}>
            <span style={{ width: 20, height: 2, background: "#a81011" }} />
            IELTS Academic
          </p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, color: "#0c1f4a", marginBottom: 10 }}>
            Writing Module
          </h1>
          <p style={{ color: "#64748b", maxWidth: 560, fontSize: "0.92rem", lineHeight: 1.65 }}>
            Real exam conditions: 60 minutes, two tasks. Task 1 (≥150 words, ~20 min) describes a chart or diagram. Task 2 (≥250 words, ~40 min) is an essay. You receive a Band score with full feedback at the end.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: 20 }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#1e5dbf", marginBottom: 10 }}>Task 1 — choose a prompt</p>
            {TASK1_PROMPTS.map(p => (
              <label key={p.id} style={{
                display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", marginBottom: 6,
                borderRadius: 10, cursor: "pointer",
                background: task1Id === p.id ? "#eff4ff" : "transparent",
                border: `1px solid ${task1Id === p.id ? "#3b82f6" : "transparent"}`,
              }}>
                <input type="radio" checked={task1Id === p.id} onChange={() => setTask1Id(p.id)} style={{ marginTop: 4 }} />
                <div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0c1f4a" }}>{p.title}</p>
                  <p style={{ fontSize: "0.72rem", color: "#64748b", marginTop: 2 }}>{p.difficulty} · {p.sampleBands.band}</p>
                </div>
              </label>
            ))}
          </div>
          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: 20 }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: "#0d7c59", marginBottom: 10 }}>Task 2 — choose a prompt</p>
            {TASK2_PROMPTS.map(p => (
              <label key={p.id} style={{
                display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", marginBottom: 6,
                borderRadius: 10, cursor: "pointer",
                background: task2Id === p.id ? "#edfaf5" : "transparent",
                border: `1px solid ${task2Id === p.id ? "#10b981" : "transparent"}`,
              }}>
                <input type="radio" checked={task2Id === p.id} onChange={() => setTask2Id(p.id)} style={{ marginTop: 4 }} />
                <div>
                  <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0c1f4a" }}>{p.title}</p>
                  <p style={{ fontSize: "0.72rem", color: "#64748b", marginTop: 2 }}>{p.difficulty} · {p.type} · {p.sampleBands.band}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <button onClick={startTest} style={{
            padding: "14px 36px", fontSize: "1rem", fontWeight: 700, color: "#fff",
            background: "linear-gradient(135deg,#a81011,#c41718)", border: "none", borderRadius: 12,
            cursor: "pointer", boxShadow: "0 6px 20px rgba(168,16,17,0.3)",
          }}>
            Start 60-minute Writing Test
          </button>
          <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginTop: 10 }}>
            The timer will start immediately. You can switch between Task 1 and Task 2 at any time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 20px 80px", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14,
        padding: "12px 18px", marginBottom: 16, position: "sticky", top: 8, zIndex: 20,
        boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
      }}>
        <div style={{ display: "flex", gap: 8 }}>
          {[1,2].map(t => (
            <button key={t} onClick={() => setActiveTask(t)} style={{
              padding: "8px 16px", fontSize: "0.82rem", fontWeight: 700,
              background: activeTask === t ? "#0c1f4a" : "#f1f5f9",
              color: activeTask === t ? "#fff" : "#64748b",
              border: "none", borderRadius: 9, cursor: "pointer",
            }}>
              Task {t}
              <span style={{ marginLeft: 8, fontSize: "0.7rem", opacity: 0.7 }}>
                {(t===1 ? task1Text : task2Text).trim().split(/\s+/).filter(Boolean).length}w
              </span>
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 140, height: 6, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${timePct}%`, height: "100%", background: timeColor, transition: "width 1s linear" }} />
          </div>
          <span style={{ fontFamily: "monospace", fontSize: "1.1rem", fontWeight: 700, color: timeColor, minWidth: 60 }}>
            {formatTime(timeLeft)}
          </span>
          <button onClick={finishTest} style={{
            padding: "8px 14px", fontSize: "0.8rem", fontWeight: 700,
            background: "#0c1f4a", color: "#fff", border: "none", borderRadius: 9, cursor: "pointer",
          }}>
            Finish & Get Feedback
          </button>
          <button onClick={resetTest} style={{
            padding: "8px 12px", fontSize: "0.78rem", fontWeight: 600,
            background: "#fff", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: 9, cursor: "pointer",
          }}>
            Reset
          </button>
        </div>
      </div>

      {timeLeft === 0 && (
        <div style={{ background: "#fef2f2", border: "1px solid rgba(168,16,17,0.3)", color: "#a81011", padding: "10px 16px", borderRadius: 10, marginBottom: 14, fontSize: "0.85rem", fontWeight: 700 }}>
          ⏱ Time's up! You can still submit each task for feedback.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 18 }}>
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{
              fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1,
              padding: "3px 10px", borderRadius: 99,
              background: activeTask === 1 ? "#eff4ff" : "#edfaf5",
              color: activeTask === 1 ? "#1e5dbf" : "#0d7c59",
            }}>
              Task {activeTask} · {currentPrompt.difficulty}
            </span>
            <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>≥ {minWords} words · ~{currentPrompt.sampleBands.time}</span>
          </div>

          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.2rem", color: "#0c1f4a", marginBottom: 10 }}>
            {currentPrompt.title}
          </h2>
          <p style={{ fontSize: "0.92rem", color: "#374151", lineHeight: 1.7, marginBottom: 14 }}>
            {activeTask === 1 ? currentPrompt.description : currentPrompt.question}
          </p>

          {activeTask === 1 && ChartCmp && (
            <div style={{ background: "#f8fafc", padding: 12, borderRadius: 12, border: "1px solid #f1f5f9", marginBottom: 16 }}>
              <ChartCmp />
            </div>
          )}

          <div style={{ background: "#f8fafc", borderRadius: 12, padding: 14, border: "1px solid #f1f5f9", marginBottom: 12 }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
              Recommended structure
            </p>
            {currentPrompt.structure.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                <div style={{ minWidth: 22, height: 22, borderRadius: "50%", background: "linear-gradient(135deg,#0c1f4a,#a81011)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800 }}>
                  {i + 1}
                </div>
                <div>
                  <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "#0c1f4a" }}>{s.label}</p>
                  <p style={{ fontSize: "0.76rem", color: "#64748b", lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "#fef9ec", borderRadius: 12, padding: 14, border: "1px solid rgba(201,162,39,0.2)" }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#c9a227", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Tips</p>
            {currentPrompt.tips.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                <span style={{ color: "#c9a227", fontWeight: 700 }}>·</span>
                <p style={{ fontSize: "0.78rem", color: "#92400e", lineHeight: 1.5 }}>{t}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: 22, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0c1f4a" }}>Your answer — Task {activeTask}</p>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: wordCount < minWords ? "#a81011" : "#0d7c59" }}>
              {wordCount} / {minWords} words
            </span>
          </div>

          <div style={{ width: "100%", height: 4, background: "#f1f5f9", borderRadius: 99, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ width: `${wordPct}%`, height: "100%", background: wordCount < minWords ? "#a81011" : "#0d7c59", transition: "width 0.3s" }} />
          </div>

          <textarea
            value={currentText}
            onChange={e => setCurrentText(e.target.value)}
            placeholder={`Start writing your Task ${activeTask} response here…\n\nUse double Enter for new paragraphs.`}
            style={{
              flex: 1, minHeight: 460, width: "100%",
              padding: "14px 16px", fontSize: "0.95rem", lineHeight: 1.7,
              fontFamily: "Georgia, serif", color: "#1e293b",
              border: "1.5px solid #e2e8f0", borderRadius: 12, resize: "vertical",
              outline: "none",
            }}
            onFocus={e => (e.target.style.borderColor = "#0c1f4a")}
            onBlur={e => (e.target.style.borderColor = "#e2e8f0")}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
            <p style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
              {wordCount < minWords
                ? `${minWords - wordCount} more words to reach the minimum.`
                : "Minimum reached — good job."}
            </p>
            <button onClick={() => submitForFeedback(activeTask)} style={{
              padding: "10px 18px", fontSize: "0.85rem", fontWeight: 700, color: "#fff",
              background: "linear-gradient(135deg,#0c1f4a,#1e3a6e)", border: "none", borderRadius: 10, cursor: "pointer",
            }}>
              Get Feedback for Task {activeTask}
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <FeedbackPanel
          feedback={feedback}
          essay={feedbackTask === 1 ? task1Text : task2Text}
          onClose={() => setFeedback(null)}
        />
      )}
    </div>
  );
}