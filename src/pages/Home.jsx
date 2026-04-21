// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/features/auth/authStore";
import "@/styles/globals.css";
import VerticalTestimonials from "@/components/tools/VerticalTestimonials";
import { FACULTY_MEMBERS } from "@/features/about/faculty";
import "@/styles/VerticalTesting.css"
import StudyBuddy from "@/components/StudyBuddy";

function FloatingSticker({ emoji, style }) {
  return (
    <span aria-hidden="true" style={{
      position: "absolute", fontSize: "clamp(1.6rem,3vw,2.2rem)",
      userSelect: "none", pointerEvents: "none",
      animation: "floatBob 4s ease-in-out infinite",
      ...style,
    }}>
      {emoji}
    </span>
  );
}

function useCountUp(target, duration = 1600, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let frame;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(e * target));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target, duration]);
  return val;
}

function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const PT_QUESTIONS = [
  // Foundation
  { id:1,  level:"Foundation",        emoji:"🌱", q:"She ___ to school every day.",                                        opts:["go","goes","going","gone"],                                      ans:"goes"                    },
  { id:2,  level:"Foundation",        emoji:"🌱", q:"There ___ many students in the class.",                               opts:["is","are","was","been"],                                         ans:"are"                     },
  { id:3,  level:"Foundation",        emoji:"🌱", q:"Choose the correct spelling:",                                         opts:["recieve","receive","receve","receeve"],                          ans:"receive"                 },
  // Pre-Intermediate
  { id:4,  level:"Pre-Intermediate",  emoji:"📗", q:"By tomorrow morning, she ___ the report.",                            opts:["finish","will finish","will have finished","finished"],          ans:"will have finished"       },
  { id:5,  level:"Pre-Intermediate",  emoji:"📗", q:"The project ___ by the team last week.",                              opts:["completed","was completed","has completed","completes"],         ans:"was completed"            },
  { id:6,  level:"Pre-Intermediate",  emoji:"📗", q:"'Abundant' is closest in meaning to:",                                opts:["rare","plentiful","limited","costly"],                           ans:"plentiful"               },
  // Intermediate
  { id:7,  level:"Intermediate",      emoji:"📘", q:"If I ___ you, I would study harder.",                                 opts:["am","was","were","be"],                                          ans:"were"                    },
  { id:8,  level:"Intermediate",      emoji:"📘", q:"The results ___ to several different causes.",                        opts:["attributed","were attributed","have attributed","are attributing"], ans:"were attributed"         },
  { id:9,  level:"Intermediate",      emoji:"📘", q:"Most academic: 'The study ___ a link between diet and disease.'",    opts:["showed","demonstrated","proved","found"],                        ans:"demonstrated"            },
  // Upper-Intermediate
  { id:10, level:"Upper-Intermediate",emoji:"📙", q:"Scarcely ___ down when the phone rang.",                             opts:["I had sat","had I sat","I sat","did I sit"],                     ans:"had I sat"               },
  { id:11, level:"Upper-Intermediate",emoji:"📙", q:"The policy was ___ due to public opposition.",                       opts:["withdrawn","withheld","withstood","withheld"],                   ans:"withdrawn"               },
  { id:12, level:"Upper-Intermediate",emoji:"📙", q:"'Mitigate' means:",                                                   opts:["worsen","ignore","reduce the severity of","highlight"],         ans:"reduce the severity of"  },
  // Advanced
  { id:13, level:"Advanced",          emoji:"🏆", q:"Not until recently ___ the true scale of the problem.",              opts:["scientists understood","did scientists understand","scientists did understand","understood scientists"], ans:"did scientists understand" },
  { id:14, level:"Advanced",          emoji:"🏆", q:"The findings are ___ with previous research.",                       opts:["consistent","coherent","compatible","compliant"],                ans:"consistent"              },
  { id:15, level:"Advanced",          emoji:"🏆", q:"'The government should ___ greater transparency in spending.'",      opts:["mandate","suggest","hope for","want"],                           ans:"mandate"                 },
];

const LVL_COLORS = {
  "Foundation":         { color:"#0d7c59", bg:"#edfaf5", border:"rgba(13,124,89,0.25)"   },
  "Pre-Intermediate":   { color:"#1e5dbf", bg:"#eff4ff", border:"rgba(30,93,191,0.25)"   },
  "Intermediate":       { color:"#c9a227", bg:"#fdf6dc", border:"rgba(201,162,39,0.3)"   },
  "Upper-Intermediate": { color:"#a81011", bg:"#fff0f0", border:"rgba(168,16,17,0.25)"   },
  "Advanced":           { color:"#7c3aed", bg:"#f5f0ff", border:"rgba(124,58,237,0.25)"  },
};

function ptBand(correct, total) {
  const p = correct / total;
  if (p >= 0.93) return { band:"8.0–9.0", label:"Advanced",           emoji:"🏆", color:"#7c3aed" };
  if (p >= 0.80) return { band:"7.0–7.5", label:"Upper-Intermediate", emoji:"📙", color:"#a81011" };
  if (p >= 0.67) return { band:"6.0–6.5", label:"Intermediate",       emoji:"📘", color:"#c9a227" };
  if (p >= 0.47) return { band:"5.0–5.5", label:"Pre-Intermediate",   emoji:"📗", color:"#1e5dbf" };
  return               { band:"4.0–4.5", label:"Foundation",           emoji:"🌱", color:"#0d7c59" };
}

function MiniPlacementTest() {
  const [, navigate]   = useLocation();
  const [step, setStep]       = useState("intro");
  const [idx,  setIdx]        = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSel]    = useState(null);
  const [confirmed, setConf]  = useState(false);

  const q   = PT_QUESTIONS[idx];
  const lc  = LVL_COLORS[q?.level] || LVL_COLORS["Foundation"];
  const pct = Math.round((idx / PT_QUESTIONS.length) * 100);

  const confirm = () => {
    if (!selected) return;
    setAnswers((p) => ({ ...p, [q.id]: selected }));
    setConf(true);
    setTimeout(() => {
      if (idx + 1 >= PT_QUESTIONS.length) { setStep("result"); }
      else { setIdx((i) => i + 1); setSel(null); setConf(false); }
    }, 900);
  };

  const score  = PT_QUESTIONS.filter((q) => answers[q.id] === q.ans).length;
  const result = ptBand(score, PT_QUESTIONS.length);

  
  if (step === "intro") return (
    <div style={{ textAlign:"center" }}>
      <div style={{ fontSize:"3rem", marginBottom:14 }}>🎓</div>
      <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.45rem", fontWeight:800, color:"#0c1f4a", marginBottom:10 }}>
        Find Your IELTS Level
      </h3>
      <p style={{ color:"#475569", fontSize:"0.9rem", lineHeight:1.7, marginBottom:20, maxWidth:380, margin:"0 auto 20px" }}>
        15 questions · Foundation → Advanced · ~5 minutes
      </p>
      <div style={{ display:"flex", justifyContent:"center", gap:6, flexWrap:"wrap", marginBottom:24 }}>
        {Object.entries(LVL_COLORS).map(([l, c]) => (
          <span key={l} style={{ fontSize:"0.65rem", fontWeight:700, background:c.bg, color:c.color, border:`1px solid ${c.border}`, padding:"3px 10px", borderRadius:999 }}>{l}</span>
        ))}
      </div>
      <button className="btn-primary" style={{ padding:"13px 32px" }} onClick={() => setStep("test")}>
        ⚡ Start Free Test
      </button>
      <p style={{ marginTop:10, fontSize:"0.72rem", color:"#94a3b8" }}>No sign-up required</p>
    </div>
  );

  if (step === "result") return (
    <div style={{ textAlign:"center" }}>
      <div style={{ fontSize:"2.8rem", marginBottom:10 }}>{result.emoji}</div>
      <p style={{ fontSize:"0.68rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"2px", color:"#94a3b8", marginBottom:6 }}>Estimated Band</p>
      <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"3.2rem", fontWeight:800, color:result.color, lineHeight:1, marginBottom:8 }}>{result.band}</div>
      <span style={{ display:"inline-block", background:LVL_COLORS[result.label]?.bg, color:result.color, border:`1px solid ${LVL_COLORS[result.label]?.border}`, padding:"4px 14px", borderRadius:999, fontSize:"0.75rem", fontWeight:700, marginBottom:18 }}>
        {result.label}
      </span>
      <div style={{ background:"var(--bg2)", borderRadius:10, padding:"12px 16px", marginBottom:20 }}>
        <p style={{ fontSize:"0.82rem", fontWeight:700, color:"#0c1f4a", marginBottom:8 }}>✅ {score} / {PT_QUESTIONS.length} correct</p>
        <div style={{ height:5, background:"var(--border)", borderRadius:999, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${Math.round((score/PT_QUESTIONS.length)*100)}%`, background:`linear-gradient(90deg,${result.color}88,${result.color})`, borderRadius:999 }} />
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        <button className="btn-primary" style={{ width:"100%", justifyContent:"center" }} onClick={() => navigate("/placement")}>
          📋 Take Full Placement Test
        </button>
        <button className="btn-secondary" style={{ width:"100%", justifyContent:"center" }} onClick={() => navigate("/practice")}>
          🚀 Start Practicing
        </button>
        <button onClick={() => { setStep("intro"); setIdx(0); setAnswers({}); setSel(null); setConf(false); }} style={{ background:"none", border:"none", color:"#94a3b8", fontSize:"0.78rem", cursor:"pointer", marginTop:2 }}>
          ↺ Retry
        </button>
      </div>
    </div>
  );

  return (
    <div>
      {/* Progress bar */}
      <div style={{ marginBottom:18 }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5, fontSize:"0.72rem", fontWeight:700 }}>
          <span style={{ color:lc.color, display:"flex", alignItems:"center", gap:5 }}>{q.emoji} {q.level}</span>
          <span style={{ color:"#94a3b8" }}>{idx+1} / {PT_QUESTIONS.length}</span>
        </div>
        <div style={{ height:5, background:"var(--bg2)", borderRadius:999, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,#0c1f4a,${lc.color})`, borderRadius:999, transition:"width 0.4s ease" }} />
        </div>
      </div>

      {/* Level badge */}
      <span style={{ fontSize:"0.62rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px", padding:"3px 10px", borderRadius:999, background:lc.bg, color:lc.color, border:`1px solid ${lc.border}`, display:"inline-block", marginBottom:14 }}>
        {q.level}
      </span>

      {/* Question */}
      <p style={{ fontSize:"0.95rem", fontWeight:600, color:"#0c1f4a", lineHeight:1.65, marginBottom:14 }}>{q.q}</p>

      {/* Options */}
      <div style={{ display:"flex", flexDirection:"column", gap:7, marginBottom:16 }}>
        {q.opts.map((opt) => {
          const isSel  = selected === opt;
          const isCorr = confirmed && opt === q.ans;
          const isWrng = confirmed && isSel && opt !== q.ans;
          return (
            <button key={opt} onClick={() => { if (!confirmed) setSel(opt); }}
              style={{
                textAlign:"left", padding:"10px 13px", borderRadius:9,
                border:`1.5px solid ${isCorr?"rgba(13,124,89,0.5)":isWrng?"rgba(168,16,17,0.4)":isSel?lc.border:"var(--border)"}`,
                background:isCorr?"#edfaf5":isWrng?"#fff0f0":isSel?lc.bg:"#fff",
                color:isCorr?"#0d7c59":isWrng?"#a81011":isSel?lc.color:"var(--navy)",
                fontWeight:isSel||isCorr?700:400, fontSize:"0.86rem",
                cursor:confirmed?"default":"pointer", transition:"all 0.15s",
                display:"flex", alignItems:"center", justifyContent:"space-between",
              }}>
              {opt}
              {isCorr && <span>✓</span>}
              {isWrng && <span>✗</span>}
            </button>
          );
        })}
      </div>

      {!confirmed ? (
        <button className="btn-primary" style={{ width:"100%", justifyContent:"center", opacity:selected?1:0.45 }} disabled={!selected} onClick={confirm}>
          Confirm →
        </button>
      ) : (
        <div style={{ textAlign:"center", padding:"9px", borderRadius:9, background:answers[q.id]===q.ans?"#edfaf5":"#fff0f0", border:`1px solid ${answers[q.id]===q.ans?"rgba(13,124,89,0.3)":"rgba(168,16,17,0.2)"}`, fontSize:"0.8rem", fontWeight:700, color:answers[q.id]===q.ans?"#0d7c59":"#a81011" }}>
          {answers[q.id]===q.ans ? "✅ Correct! Next..." : `❌ Correct: "${q.ans}"`}
        </div>
      )}
    </div>
  );
}

function StatCounter({ value, suffix, label, icon, started }) {
  const num = useCountUp(value, 1600, started);
  return (
    <div style={{ textAlign:"center", padding:"20px 14px", background:"#f9fafb", borderRadius:14 }}>
      <p style={{ fontSize:"1.9rem", margin:"0 0 8px" }}>{icon}</p>
      <p style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.8rem,4vw,2.4rem)", fontWeight:800, color:"#a81011", margin:"0 0 5px", lineHeight:1 }}>
        {suffix==="+" ? `${num.toLocaleString()}+` : suffix==="%" ? `${num}%` : `${num}${suffix}`}
      </p>
      <p style={{ color:"#475569", fontSize:"0.85rem", fontWeight:600, margin:0 }}>{label}</p>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color, highlights, link, hovered, onHover }) {
  const [, navigate] = useLocation();
  return (
    <div onClick={() => navigate(link)} onMouseEnter={onHover} onMouseLeave={() => onHover(false)}
      style={{ background:"#fff", border:`1.5px solid ${hovered?`${color}40`:"#e2e8f0"}`, borderRadius:16, padding:"24px 20px", cursor:"pointer", transition:"all 0.25s", transform:hovered?"translateY(-6px)":"none", boxShadow:hovered?`0 14px 36px ${color}22`:"0 2px 8px rgba(15,23,42,0.06)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
        <span style={{ fontSize:"2rem", transition:"transform 0.3s", transform:hovered?"scale(1.15) rotate(-5deg)":"none" }}>{icon}</span>
        <div style={{ width:3, height:34, background:color, borderRadius:2, opacity:hovered?1:0.2, transition:"opacity 0.3s" }} />
      </div>
      <h3 style={{ fontSize:"1rem", fontWeight:700, color:"#0f172a", marginBottom:6 }}>{title}</h3>
      <p style={{ color:"#475569", fontSize:"0.83rem", marginBottom:12, lineHeight:1.6 }}>{desc}</p>
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        {highlights.map((h) => <span key={h} style={{ background:`${color}15`, color, padding:"3px 9px", borderRadius:999, fontSize:"0.68rem", fontWeight:700 }}>{h}</span>)}
      </div>
    </div>
  );
}

export default function Home() {
  const [, navigate]       = useLocation();
  const user               = useAuthStore((s) => s.user);
  const isAuth             = !!user;

  const [hoveredFeat, setHoveredFeat] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [scrollProg,  setScrollProg]  = useState(0);

  useEffect(() => {
    const fn = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProg(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const { ref:statsRef, visible:statsVis } = useFadeIn();
  const { ref:featRef,  visible:featVis  } = useFadeIn();
  const { ref:testRef,  visible:testVis  } = useFadeIn();
  const { ref:testitRef,visible:testitVis} = useFadeIn();
  const { ref:faqRef,   visible:faqVis   } = useFadeIn();

  const FEATURES = [
    { icon:"📝", title:"Vocabulary Builder",  desc:"1000+ IELTS words with spaced repetition & audio",          color:"#6366f1", highlights:["Flashcards","Audio","Quizzes"],          link:"/tools"     },
    { icon:"🔍", title:"Grammar Checker",     desc:"200+ exercises across 20 grammar rules. Instant feedback",  color:"#ec4899", highlights:["Interactive","200+ Exercises","Feedback"],link:"/tools"     },
    { icon:"✍️", title:"Essay Templates",     desc:"Band 8+ samples with proven Task 1 & 2 structures",         color:"#8b5cf6", highlights:["Task 1 & 2","Real Samples","Practice"],  link:"/writing"   },
    { icon:"🃏", title:"Flashcard Deck",      desc:"32+ cards for idioms, collocations & academic phrases",     color:"#ec4899", highlights:["Gamified","Multiple Modes","Progress"],  link:"/tools"     },
    { icon:"🎯", title:"Score Predictor",     desc:"Estimate your band based on real practice performance",     color:"#f97316", highlights:["AI-Powered","Real-Time","Analysis"],     link:"/results"   },
    { icon:"🗓️", title:"Study Planner",       desc:"Personalised 30/60/90-day schedule adapting to your level", color:"#f59e0b", highlights:["Adaptive","Reminders","Goals"],         link:"/tools"     },
    { icon:"🗣️", title:"Speaking Practice",   desc:"Part 1/2/3 cue cards with timed exercises and tips",       color:"#14b8a6", highlights:["All Parts","Timed","Tips"],              link:"/speaking"  },
    { icon:"🎧", title:"Listening Tests",     desc:"Full mock tests with 4 authentic parts and auto-scoring",  color:"#06b6d4", highlights:["4 Parts","Auto-Score","Timer"],          link:"/listening" },
  ];


  const FAQS = [
    { q:"How does Oxbridge help me prepare for IELTS?",                  a:"50+ interactive tools including vocabulary builders, grammar checkers, essay templates, reading trainers, and mock tests. Our score predictor gives realistic band estimates and personalised study plans optimise your prep." },
    { q:"Can I start for free?",                                         a:"Yes! Create a free account for instant access to practice tests, basic vocabulary, grammar fundamentals, and our community forum. No credit card needed." },
    { q:"How accurate is the band score prediction?",                    a:"Our algorithm analyses thousands of real test results to predict your band with strong accuracy. It gives per-skill breakdowns so you know exactly where to focus." },
    { q:"What's the difference between student and teacher accounts?",   a:"Students access practice tests, study tools, and personal dashboards. Teachers get a dashboard to create sessions, assign specific test parts via a join code, and monitor student results in real time." },
    { q:"Can I take individual test sections?",                          a:"Yes. Teachers create sessions for specific parts and share a code. Students join at /jointest, enter their name and code, and start that section immediately." },
    { q:"How do I track my progress?",                                   a:"Your dashboard shows test history, band trends per skill, streaks, and a 7-day progress chart. Every test is saved and visible from your Profile." },
  ];

  return (
    <div style={{ overflowX:"hidden" }}>

      <style>{`
        @keyframes floatBob {
          0%,100% { transform:translateY(0) rotate(0deg); }
          33%      { transform:translateY(-14px) rotate(4deg); }
          66%      { transform:translateY(-6px) rotate(-3deg); }
        }
        @keyframes heroSlide { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        .sec-fade { opacity:0; transform:translateY(20px); transition:opacity 0.65s ease,transform 0.65s ease; }
        .sec-fade.vis { opacity:1; transform:translateY(0); }
      `}</style>

      {/* Scroll bar */}
      <div style={{ position:"fixed", top:0, left:0, height:3, background:"linear-gradient(90deg,#a81011,#d42022)", width:`${scrollProg}%`, zIndex:9999, transition:"width 0.1s linear" }} />

      {/* Notification */}
      <div style={{ background:"linear-gradient(90deg,#a81011,#d42022)", color:"#fff", padding:"11px 24px", textAlign:"center", fontSize:"0.88rem", fontWeight:600 }}>
        🎉 New: 200+ Grammar Exercises & Full Mock Tests! — Start free, no credit card needed
      </div>

      {/* ══════════ HERO ══════════ */}
      <section style={{ background:"linear-gradient(135deg,#fdf0f0 0%,#f4f6fb 50%,#fff 100%)", padding:"100px 28px 80px", textAlign:"center", position:"relative", overflow:"hidden" }}>

        <FloatingSticker emoji="🎧" style={{ top:"12%",  left:"6%",   animationDelay:"0s",   animationDuration:"4.5s" }} />
        <FloatingSticker emoji="📖" style={{ top:"18%",  right:"8%",  animationDelay:"0.8s", animationDuration:"5s"   }} />
        <FloatingSticker emoji="✍️" style={{ top:"55%",  left:"4%",   animationDelay:"1.2s", animationDuration:"4.2s" }} />
        <FloatingSticker emoji="🎯" style={{ top:"60%",  right:"5%",  animationDelay:"0.4s", animationDuration:"5.5s" }} />
        <FloatingSticker emoji="🏆" style={{ top:"80%",  left:"9%",   animationDelay:"1.8s", animationDuration:"4.8s" }} />
        <FloatingSticker emoji="💡" style={{ top:"85%",  right:"10%", animationDelay:"0.6s", animationDuration:"4s"   }} />
        <FloatingSticker emoji="🌍" style={{ top:"30%",  left:"2%",   animationDelay:"2.0s", animationDuration:"6s"   }} />
        <FloatingSticker emoji="⭐" style={{ top:"35%",  right:"3%",  animationDelay:"1.5s", animationDuration:"5.2s" }} />

        <div style={{ position:"absolute", top:-80,  left:-80,  width:300, height:300, background:"radial-gradient(circle,rgba(168,16,17,0.08) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-40,right:-40, width:260, height:260, background:"radial-gradient(circle,rgba(201,162,39,0.08) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />

        <div style={{ maxWidth:900, margin:"0 auto", position:"relative", zIndex:1, animation:"heroSlide 0.7s ease-out both" }}>
          <div style={{ display:"inline-block", background:"#fff", border:"1px solid rgba(168,16,17,0.2)", borderRadius:50, padding:"9px 20px", marginBottom:24, fontSize:"0.85rem", fontWeight:700, color:"#a81011" }}>
            ✨ Join 10,000+ students succeeding in IELTS
          </div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(2.2rem,6vw,4rem)", fontWeight:800, color:"#0c1f4a", marginBottom:18, lineHeight:1.15 }}>
            Your Friendly IELTS <br/>
            <span style={{ color:"#a81011", display:"inline-block", animation:"pulse 3s ease-in-out infinite" }}>Study Companion</span>
          </h1>
          <p style={{ fontSize:"clamp(0.95rem,2vw,1.15rem)", color:"#475569", maxWidth:580, margin:"0 auto 36px", lineHeight:1.8 }}>
            Master IELTS with 50+ interactive tools, expert-designed courses, and a supportive global community. Track your progress and achieve your target band with confidence.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginBottom:36 }}>
            <button onClick={() => navigate(isAuth?"/practice":"/register")} className="btn-primary" style={{ padding:"15px 44px", fontSize:"1rem" }}>
              🚀 {isAuth ? "Continue Practice" : "Start Free"}
            </button>
            <button onClick={() => navigate("/about")} style={{ padding:"15px 40px", background:"#fff", color:"#a81011", border:"2px solid #a81011", borderRadius:12, fontSize:"1rem", fontWeight:700, cursor:"pointer", transition:"all 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.background="#fdf0f0"}
              onMouseLeave={(e) => e.currentTarget.style.background="#fff"}>
              📚 Explore More
            </button>
          </div>
          <div style={{ display:"flex", justifyContent:"center", gap:24, flexWrap:"wrap", paddingTop:22, borderTop:"1px solid rgba(226,232,240,0.5)" }}>
            {["No credit card needed","Instant access","Free to start"].map((t) => (
              <p key={t} style={{ fontSize:"0.87rem", color:"#475569", fontWeight:600, margin:0, display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ color:"#10b981", fontWeight:800 }}>✓</span> {t}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <div ref={statsRef} className={`sec-fade${statsVis?" vis":""}`}>
        <section style={{ background:"#fff", padding:"52px 28px", borderTop:"1px solid #e2e8f0" }}>
          <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:18 }}>
            <StatCounter value={6500} suffix="+" label="Happy Students" icon="👥" started={statsVis} />
            <StatCounter value={50}    suffix="+" label="Study Tools"    icon="🛠️" started={statsVis} />
            <StatCounter value={90}    suffix="%" label="Success Rate"   icon="🎯" started={statsVis} />
            <StatCounter value={13}    suffix="+" label="Years Teaching" icon="📅" started={statsVis} />
          </div>
        </section>
      </div>

      {/* ══════════ FEATURES ══════════ */}
      <div ref={featRef} className={`sec-fade${featVis?" vis":""}`}>
        <section style={{ background:"linear-gradient(180deg,#f9fafb 0%,#fff 100%)", padding:"80px 28px", borderTop:"1px solid #e2e8f0" }}>
          <div style={{ maxWidth:1280, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:48 }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:800, color:"#0c1f4a", marginBottom:12 }}>
                Your Complete Learning Toolkit 🛠️
              </h2>
              <p style={{ fontSize:"1rem", color:"#475569", maxWidth:520, margin:"0 auto" }}>
                Everything you need to master IELTS — in one platform
              </p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))", gap:18 }}>
              {FEATURES.map((f, i) => (
                <FeatureCard key={f.title} {...f}
                  hovered={hoveredFeat===i}
                  onHover={(v) => setHoveredFeat(v===false?null:i)}
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ══════════ PLACEMENT TEST SECTION ══════════ */}
      <div ref={testRef} className={`sec-fade${testVis?" vis":""}`}>
        <section style={{ background:"linear-gradient(135deg,#f0f4ff 0%,#e8f0fb 100%)", padding:"90px 28px", borderTop:"1px solid #e2e8f0", position:"relative", overflow:"hidden" }}>

          <FloatingSticker emoji="🤔" style={{ top:"10%", left:"4%",   animationDelay:"0s",   animationDuration:"5s"   }} />
          <FloatingSticker emoji="💭" style={{ top:"20%", right:"5%",  animationDelay:"1s",   animationDuration:"4.5s" }} />
          <FloatingSticker emoji="📊" style={{ top:"65%", left:"3%",   animationDelay:"0.5s", animationDuration:"5.5s" }} />
          <FloatingSticker emoji="🌟" style={{ top:"72%", right:"4%",  animationDelay:"1.5s", animationDuration:"4.2s" }} />

          <div style={{ maxWidth:1000, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:52, alignItems:"center" }}>

            {/* Left copy */}
            <div>
              <span style={{ display:"inline-block", background:"#fff", color:"#a81011", padding:"7px 18px", borderRadius:999, fontSize:"0.75rem", fontWeight:800, letterSpacing:"0.5px", boxShadow:"0 4px 12px rgba(0,0,0,0.06)", marginBottom:20 }}>
                NOT SURE WHERE TO START? 🤔
              </span>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.7rem,3.5vw,2.5rem)", fontWeight:800, color:"#0c1f4a", marginBottom:14, lineHeight:1.2 }}>
                Find Your Current IELTS Level
              </h2>
              <p style={{ color:"#475569", fontSize:"0.97rem", lineHeight:1.75, marginBottom:26 }}>
                Take our free 15-question diagnostic — Foundation to Advanced — and get your estimated band in under 5 minutes.
              </p>

              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
                {[
                  { icon:"🌱", label:"Foundation",         desc:"Basic grammar & everyday vocabulary" },
                  { icon:"📘", label:"Intermediate",       desc:"Complex tenses & academic vocabulary" },
                  { icon:"🏆", label:"Advanced",           desc:"Inverted conditionals & formal register" },
                ].map((l) => (
                  <div key={l.label} style={{ display:"flex", alignItems:"center", gap:11 }}>
                    <span style={{ fontSize:"1.15rem" }}>{l.icon}</span>
                    <span style={{ fontSize:"0.86rem" }}>
                      <strong style={{ color:"#0c1f4a" }}>{l.label}</strong>
                      <span style={{ color:"#94a3b8" }}> — {l.desc}</span>
                    </span>
                  </div>
                ))}
              </div>

              <button onClick={() => navigate("/placement")}
                style={{ padding:"14px 30px", background:"#0c1f4a", color:"#fff", border:"none", borderRadius:12, fontSize:"0.92rem", fontWeight:700, cursor:"pointer", transition:"all 0.25s", boxShadow:"0 8px 24px rgba(12,31,74,0.2)" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 12px 32px rgba(12,31,74,0.3)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 8px 24px rgba(12,31,74,0.2)"; }}>
                Take Full Placement Test ⚡
              </button>
            </div>

            {/* Right: mini test */}
            <div style={{ background:"rgba(255,255,255,0.88)", backdropFilter:"blur(14px)", borderRadius:24, padding:"30px 26px", border:"1px solid rgba(255,255,255,0.9)", boxShadow:"0 20px 60px rgba(0,0,0,0.08)", minHeight:400 }}>
              <MiniPlacementTest />
            </div>

          </div>
        </section>
      </div>

{/* ══════════ TESTIMONIALS ══════════ */}
<div ref={testitRef} className={`sec-fade${testitVis?" vis":""}`}>
  <section style={{ background:"linear-gradient(180deg,#fff 0%,#f9fafb 100%)", padding:"80px 28px", borderTop:"1px solid #e2e8f0" }}>
    <div style={{ maxWidth:1280, margin:"0 auto" }}>
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <section style={{ padding: "80px 20px" }}>
          <h2 style={{ textAlign: "center", marginBottom: 30 }}>
            Loved by Students ❤️
          </h2>

          <VerticalTestimonials />
        </section>
      </div>
    </div>
  </section>
</div>
      {/* ══════════ FAQ ══════════ */}
      <div ref={faqRef} className={`sec-fade${faqVis?" vis":""}`}>
        <section style={{ background:"linear-gradient(135deg,#f9fafb 0%,#fff 100%)", padding:"80px 28px", borderTop:"1px solid #e2e8f0" }}>
          <div style={{ maxWidth:840, margin:"0 auto" }}>
            <div style={{ textAlign:"center", marginBottom:48 }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:800, color:"#0c1f4a", marginBottom:12 }}>
                Frequently Asked Questions 🤔
              </h2>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {FAQS.map((f, i) => (
                <div key={i} style={{ background:"#fff", border:`1px solid ${expandedFaq===i?"rgba(168,16,17,0.25)":"#e2e8f0"}`, borderRadius:14, overflow:"hidden", transition:"border-color 0.2s", boxShadow:"0 2px 8px rgba(15,23,42,0.04)" }}>
                  <button onClick={() => setExpandedFaq(expandedFaq===i?null:i)}
                    style={{ width:"100%", display:"flex", justifyContent:"space-between", alignItems:"center", padding:"17px 20px", background:"none", border:"none", cursor:"pointer", textAlign:"left" }}>
                    <span style={{ fontSize:"0.93rem", fontWeight:700, color:"#0f172a", paddingRight:14 }}>{f.q}</span>
                    <span style={{ color:"#a81011", fontSize:"1rem", flexShrink:0, transform:expandedFaq===i?"rotate(45deg)":"none", transition:"transform 0.25s" }}>+</span>
                  </button>
                  {expandedFaq===i && (
                    <div style={{ padding:"0 20px 16px", borderTop:"1px solid #f1f5f9" }}>
                      <p style={{ color:"#475569", fontSize:"0.88rem", lineHeight:1.7, marginTop:12 }}>{f.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ══════════ FINAL CTA ══════════ */}
      <section style={{ background:"linear-gradient(135deg,#a81011 0%,#d42022 100%)", padding:"90px 28px 80px", color:"#fff", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <FloatingSticker emoji="🎓" style={{ top:"15%", left:"8%",   animationDelay:"0s",   animationDuration:"4s"   }} />
        <FloatingSticker emoji="🚀" style={{ top:"20%", right:"8%",  animationDelay:"1.2s", animationDuration:"5s"   }} />
        <FloatingSticker emoji="⭐" style={{ top:"65%", left:"5%",   animationDelay:"0.7s", animationDuration:"4.5s" }} />
        <FloatingSticker emoji="🏆" style={{ top:"70%", right:"6%",  animationDelay:"1.8s", animationDuration:"5.5s" }} />
        <div style={{ position:"absolute", top:-50, right:-50, width:280, height:280, background:"radial-gradient(circle,rgba(255,255,255,0.1) 0%,transparent 70%)", borderRadius:"50%", pointerEvents:"none" }} />
        <div style={{ maxWidth:700, margin:"0 auto", position:"relative", zIndex:1 }}>
          <div style={{ fontSize:"3rem", marginBottom:16, animation:"pulse 3s ease-in-out infinite" }}>🎯</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:800, marginBottom:16 }}>
            Ready to Achieve Your Target Band?
          </h2>
          <p style={{ fontSize:"1.02rem", marginBottom:32, opacity:0.9, lineHeight:1.7 }}>
            Join thousands of successful students. Start free today — no credit card required.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={() => navigate(isAuth?"/practice":"/register")}
              style={{ padding:"15px 40px", background:"#fff", color:"#a81011", border:"none", borderRadius:12, fontSize:"1rem", fontWeight:700, cursor:"pointer", transition:"all 0.25s", boxShadow:"0 8px 24px rgba(0,0,0,0.2)" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 12px 32px rgba(0,0,0,0.3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.2)"; }}>
              {isAuth ? "Continue Practice →" : "Start Free Trial →"}
            </button>
            <button onClick={() => navigate("/placement")}
              style={{ padding:"15px 36px", background:"transparent", color:"#fff", border:"2px solid rgba(255,255,255,0.5)", borderRadius:12, fontSize:"1rem", fontWeight:700, cursor:"pointer", transition:"all 0.25s" }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor="rgba(255,255,255,0.9)"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor="rgba(255,255,255,0.5)"}>
              ⚡ Try Placement Test
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
