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
// REAL AI EVALUATION via Anthropic API
// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// FREE OFFLINE IELTS SPEAKING EVALUATOR
// ─────────────────────────────────────────────
const SP_FILLERS   = ["um","uh","er","erm","like","you know","i mean","kind of","sort of","basically","actually","literally","right","okay so"];
const SP_LINKERS   = ["because","however","although","for example","for instance","therefore","moreover","furthermore","in addition","on the other hand","as a result","consequently","despite","whereas","while","since","so that","such as","to illustrate","what i mean is","in other words"];
const SP_ADV_VOCAB = ["significant","considerable","remarkable","fascinating","intriguing","essential","crucial","particularly","genuinely","extraordinary","perspective","opportunity","atmosphere","tremendous","phenomenon","prevalent","fundamental","appreciate","beneficial","challenging","stimulating","diverse","impact","influence","demonstrate","reflect","suggest","contribute","develop","enhance","expand"];
const SP_IDIOMS    = ["broaden my horizons","a piece of cake","once in a blue moon","at the end of the day","make ends meet","bear in mind","keep in mind","look forward to","stand out","make sense","bring about","come to terms with","have a lot to offer","goes without saying","in the long run"];
const SP_COMPLEX_G = [/\bif\s+\w+\s+(would|could|had|were)\b/i,/\bwhich\s+(is|are|has|have)\b/i,/\bnot only\b.*\bbut also\b/i,/\balthough\b/i,/\bwhereas\b/i,/\bdespite\b/i,/\bwould have\b/i,/\bhad been\b/i,/\bwithout\s+\w+ing\b/i,/\bhaving said that\b/i];

function halfBandS(v){ return Math.round(Math.min(9, Math.max(3.5, v))*2)/2; }

function evaluateSpeakingOffline(transcript, partNum) {
  const text   = transcript.trim();
  const lower  = text.toLowerCase();
  const words  = text.split(/\s+/).filter(Boolean);
  const wc     = words.length;
  const sents  = text.split(/[.!?]+/).map(s=>s.trim()).filter(s=>s.length>6);
  const sc     = Math.max(sents.length, 1);
  const avgLen = wc / sc;
  const uniq   = new Set(words.map(w=>w.toLowerCase().replace(/[^a-z']/g,""))).size;
  const ttr    = uniq / Math.max(wc, 1);

  // Count features
  const fillerCnt  = SP_FILLERS.reduce((n,f)=>n+(lower.match(new RegExp(`\\b${f}\\b`,"g"))||[]).length, 0);
  const fillerRatio= fillerCnt / Math.max(wc, 1);
  const linkerCnt  = SP_LINKERS.filter(l=>lower.includes(l)).length;
  const advCnt     = SP_ADV_VOCAB.filter(w=>lower.includes(w)).length;
  const idiomCnt   = SP_IDIOMS.filter(i=>lower.includes(i)).length;
  const compCnt    = SP_COMPLEX_G.filter(p=>p.test(text)).length;
  const exCnt      = (lower.match(/\b(for example|for instance|like when|such as)\b/g)||[]).length;
  const compRatio  = sents.filter(s=>s.split(/\s+/).length>14||SP_COMPLEX_G.some(p=>p.test(s))).length/sc;

  const usedLinkers= SP_LINKERS.filter(l=>lower.includes(l)).slice(0,5);
  const usedAdv    = SP_ADV_VOCAB.filter(w=>lower.includes(w)).slice(0,5);
  const usedIdioms = SP_IDIOMS.filter(i=>lower.includes(i));
  const fillerList = SP_FILLERS.filter(f=>new RegExp(`\\b${f}\\b`,"i").test(lower)).slice(0,4);
  const freq = {}; words.forEach(w=>{const k=w.toLowerCase().replace(/[^a-z]/g,"");if(k.length>4)freq[k]=(freq[k]||0)+1;});
  const repWords = Object.entries(freq).filter(([,v])=>v>=3).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([w,c])=>`"${w}"(×${c})`);

  // Target lengths by part
  const targetWC = partNum===2 ? 160 : 80;

  // ── Scoring ──────────────────────────────────────────────────
  let fluency=5, vocab=5, grammar=5, pronun=5;

  // Fluency
  if(wc>=targetWC) fluency+=1.5; else if(wc>=targetWC*0.7) fluency+=0.8; else if(wc>=targetWC*0.4) fluency+=0.3;
  if(linkerCnt>=4) fluency+=0.5; else if(linkerCnt>=2) fluency+=0.25;
  if(fillerRatio>0.08) fluency-=1; else if(fillerRatio>0.05) fluency-=0.5; else if(fillerRatio<0.02) fluency+=0.25;
  if(sc>=6) fluency+=0.25;

  // Vocabulary
  if(ttr>=0.70) vocab+=1.5; else if(ttr>=0.60) vocab+=1; else if(ttr>=0.50) vocab+=0.5;
  if(advCnt>=5) vocab+=1; else if(advCnt>=3) vocab+=0.6; else if(advCnt>=1) vocab+=0.25;
  if(idiomCnt>=2) vocab+=0.75; else if(idiomCnt===1) vocab+=0.4;
  if(exCnt>=2) vocab+=0.25;

  // Grammar
  if(compCnt>=4) grammar+=1.5; else if(compCnt>=2) grammar+=0.8; else if(compCnt>=1) grammar+=0.35;
  if(compRatio>=0.5) grammar+=0.5; else if(compRatio>=0.3) grammar+=0.25;
  if(avgLen>=12) grammar+=0.25;

  // Pronunciation (estimated from text fluency/vocabulary)
  pronun = 5 + (fluency - 5) * 0.4 + (vocab - 5) * 0.2;

  const fScore = halfBandS(fluency);
  const vScore = halfBandS(vocab);
  const gScore = halfBandS(grammar);
  const pScore = halfBandS(pronun);
  const overall= halfBandS((fScore+vScore+gScore+pScore)/4);

  // ── Comments ─────────────────────────────────────────────────
  const fComment = wc < targetWC*0.5
    ? `Answer is very short (${wc} words) — aim for ${targetWC}+ words in Part ${partNum}.`
    : fillerRatio > 0.07
      ? `${fillerCnt} filler word(s) detected (${fillerList.join(", ")}) — practise pausing silently instead.`
      : linkerCnt >= 3
        ? `Good flow with ${linkerCnt} linking expressions: ${usedLinkers.slice(0,3).join(", ")}.`
        : "Reasonable delivery but ideas could be connected more smoothly.";

  const fDetail = `Word count: ${wc} (target: ${targetWC}+ for Part ${partNum}). ${fillerRatio>0.05?`Filler ratio: ${(fillerRatio*100).toFixed(1)}% — above recommended 5%.`:"Low filler rate ✓."} Linking language: ${linkerCnt} expression(s). ${sc} sentences, avg ${Math.round(avgLen)} words each.`;

  const vComment = usedAdv.length >= 3
    ? `Good vocabulary range: ${usedAdv.slice(0,3).join(", ")}.`
    : idiomCnt >= 1
      ? `Idiomatic language used: ${usedIdioms.slice(0,2).join(", ")}.`
      : repWords.length > 0
        ? `Word repetition detected: ${repWords.join(", ")} — use synonyms.`
        : "Vocabulary is adequate but would benefit from more precise or idiomatic language.";

  const vDetail = `Unique word ratio: ${(ttr*100).toFixed(0)}%. ${ttr>=0.6?"Good variety ✓.":"High repetition — use synonyms."} Advanced vocab: ${advCnt} words (${usedAdv.slice(0,4).join(", ")||"none detected"}). Idioms: ${idiomCnt} (${usedIdioms.join(", ")||"none"}). ${repWords.length?`Repeated: ${repWords.join(", ")}.`:""}`;

  const gComment = compCnt >= 3
    ? `Complex structures present: ${compCnt} instances (conditionals, relative clauses, subordination).`
    : compCnt >= 1
      ? "Some complex structures attempted but most sentences are simple."
      : "Grammar mostly limited to simple sentences — no complex structures detected.";

  const gDetail = `${compCnt} complex structures. ${compRatio>=0.4?"Good sentence variety ✓.":"Mostly simple sentences — practise 'Although…', 'which means…', 'If I were to…'."} Avg sentence: ${Math.round(avgLen)} words.`;

  const pComment = "Pronunciation estimated from text — actual evaluation requires audio analysis. The richness of vocabulary and fluency indicators suggest this level.";
  const pDetail = `Based on linguistic analysis: vocabulary sophistication, sentence rhythm, and word variety. For accurate pronunciation feedback, a human examiner or speech analysis tool is required.`;

  // ── Strengths ─────────────────────────────────────────────────
  const strengths = [];
  if(wc>=targetWC) strengths.push(`Good answer length (${wc} words) — you developed your ideas adequately for Part ${partNum}.`);
  if(linkerCnt>=3) strengths.push(`${linkerCnt} linking expressions used: ${usedLinkers.slice(0,3).join(", ")} — ideas are well-connected.`);
  if(usedAdv.length>=3) strengths.push(`Academic/advanced vocabulary: ${usedAdv.slice(0,3).join(", ")} — demonstrates Lexical Resource.`);
  if(idiomCnt>=1) strengths.push(`Idiomatic language: "${usedIdioms[0]}" — sounds natural and native-like.`);
  if(exCnt>=1) strengths.push(`Supported points with ${exCnt} example(s) — demonstrates ability to extend answers.`);
  if(compCnt>=2) strengths.push(`${compCnt} complex structures demonstrate grammatical range.`);
  if(fillerRatio<0.03&&wc>40) strengths.push("Low filler word usage — speech sounds fluent and controlled.");
  if(ttr>=0.65) strengths.push(`Good vocabulary variety — ${(ttr*100).toFixed(0)}% unique words.`);
  if(strengths.length===0) strengths.push("You attempted to address the question and maintained relevant focus.");

  // ── Improvements ─────────────────────────────────────────────
  const improvements = [];
  if(wc<targetWC) improvements.push(`Answer is too short (${wc} words, target ${targetWC}+). Extend with reasons, examples, and personal experience.`);
  if(fillerRatio>0.07) improvements.push(`Reduce fillers — "${fillerList.slice(0,3).join('", "')}" appear too frequently. Pause silently instead.`);
  if(linkerCnt<3) improvements.push(`Add more linking language: 'Furthermore', 'On the other hand', 'As a result', 'For instance'.`);
  if(exCnt===0) improvements.push("Add specific examples to support your ideas: 'For instance, last year I…' or 'Take … as an example.'");
  if(ttr<0.5) improvements.push(`High word repetition (${repWords.slice(0,3).join(", ")}). Use synonyms and pronoun references.`);
  if(compCnt<2) improvements.push("Use complex sentences: 'Although … , …', 'which has led to …', 'If I were to … , …', 'Having said that…'");
  if(idiomCnt===0) improvements.push("Include 1-2 natural expressions: 'broaden my horizons', 'at the end of the day', 'it goes without saying'.");
  if(improvements.length===0) improvements.push("Strong performance — focus on pronunciation clarity and adding even more idiomatic expressions.");

  // ── Phrase upgrade ────────────────────────────────────────────
  const simpleSent = sents.filter(s=>s.trim().length>15).sort((a,b)=>a.split(/\s+/).length-b.split(/\s+/).length)[0] || sents[0] || "I think it is good.";
  let improved = simpleSent.trim()
    .replace(/\bI think\b/gi,"From my perspective,")
    .replace(/\bI believe\b/gi,"It is my firm view that")
    .replace(/\bgood\b/gi,"beneficial")
    .replace(/\bbig\b/gi,"substantial")
    .replace(/\bvery (\w+)\b/gi,(_,a)=>`remarkably ${a}`)
    .replace(/\ba lot of\b/gi,"a considerable number of")
    .replace(/\bthings\b/gi,"aspects");
  if(improved===simpleSent.trim()) improved = simpleSent.trim().replace(/\.?$/,", which I believe has a profound impact on daily life.");
  const upgradeWhy = compCnt<2
    ? "Added subordination to show grammatical range — simple sentences limit the Grammar score to Band 5–6."
    : "Upgraded vocabulary precision to match the Lexical Resource expected at Band 7.";

  // ── Examiner note ─────────────────────────────────────────────
  const lv = overall>=7.5?"very competent":overall>=6.5?"good":overall>=5.5?"competent":"developing";
  const examinerNote = `Part ${partNum} — ${lv} response at Band ${overall.toFixed(1)}. ${wc>=targetWC?"Answer length is appropriate.":"The response is too brief — develop ideas further."} ${linkerCnt>=3?"Good coherence through linking language.":"More cohesive devices would improve the score."} ${advCnt>=3?"Vocabulary is varied and precise.":"Vocabulary range needs expanding with more idiomatic/academic language."} Most impactful improvement: ${improvements[0]||"practise extending answers with examples"}.`;

  const bandJustification = `Band ${overall.toFixed(1)} = average of Fluency ${fScore}, Vocabulary ${vScore}, Grammar ${gScore}, Pronunciation ${pScore}. ${overall<7?`To reach Band ${(overall+0.5).toFixed(1)}: ${improvements[0]?.toLowerCase()||"address areas above"}.`:"Strong performance — minor refinements in grammar range and idiomatic language would push toward Band 8."} Stats: ${wc} words, ${(ttr*100).toFixed(0)}% unique, ${linkerCnt} linkers, ${compCnt} complex structures, ${fillerCnt} fillers.`;

  // ── Missed opportunities ──────────────────────────────────────
  const missed = [];
  if(exCnt===0) missed.push("Specific examples or personal anecdotes — 'For example, when I was…' or 'I experienced this firsthand when…'");
  if(partNum===2 && !lower.includes("in conclusion")&&!lower.includes("overall")&&!lower.includes("to summarise")) missed.push("A brief rounding-off statement at the end of the long turn — 'Overall, this is why I find … so memorable.'");
  if(idiomCnt===0) missed.push("Natural idiomatic expressions — these signal high fluency to examiners: 'broaden my horizons', 'goes without saying'.");
  if(partNum===3 && !lower.includes("society")&&!lower.includes("government")&&!lower.includes("future")&&!lower.includes("overall")) missed.push("Broader societal perspective — Part 3 expects abstract thinking beyond personal experience.");

  const usefulExpr = [
    "From my point of view, … (signals a clear perspective)",
    "What I find particularly interesting is … (shows depth)",
    "It goes without saying that … (natural discourse marker)",
    "Having said that, … (concession + counterpoint)",
    partNum===3?"This raises the broader question of … (abstract thinking for Part 3)":"Having had the opportunity to … (extends Part 2 narrative)",
  ];

  return {
    band: overall,
    criteria:{
      fluency:      {score:fScore,     comment:fComment,  details:fDetail,  tip:`Practise speaking for ${partNum===2?120:60} seconds on any topic daily without pausing — record yourself and count fillers.`},
      vocabulary:   {score:vScore,     comment:vComment,  details:vDetail,  tip:`Learn 5 collocations per day in topic areas (travel, work, technology). Use them immediately in spoken sentences.`},
      grammar:      {score:gScore,     comment:gComment,  details:gDetail,  tip:`Practise one complex structure per day: start 5 sentences with 'Although…' then 5 with 'Despite…', then 5 with 'If I were to…'.`},
      pronunciation:{score:pScore,     comment:pComment,  details:pDetail,  tip:`Shadow native speakers from BBC or TED Talks for 10 minutes daily — mimic rhythm, stress, and intonation exactly.`},
    },
    strengths:       strengths.slice(0,4),
    improvements:    improvements.slice(0,4),
    phrasePairs:[{original:simpleSent.slice(0,90), improved:improved.slice(0,180), why:upgradeWhy}],
    missedOpportunities: missed.slice(0,3),
    usefulExpressions: usefulExpr,
    examinerNote,
    nextStepFocus: `${improvements[0]||"Extend your answers with concrete examples and linking language."}`,
    bandJustification,
  };
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
    start: () => recognitionRef.current?.start(),
    stop:  () => recognitionRef.current?.stop(),
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
function FeedbackPanel({ evaluation, transcript, onClose }) {
  const [tab, setTab] = useState("scores");
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  const handleClose = () => { setVisible(false); setTimeout(() => onClose?.(), 320); };

  const criteriaOrder = ["fluency", "vocabulary", "grammar", "pronunciation"];
  const criteriaLabels = {
    fluency: "Fluency & Coherence",
    vocabulary: "Lexical Resource",
    grammar: "Grammatical Range",
    pronunciation: "Pronunciation",
  };
  const criteriaIcons = { fluency: "💬", vocabulary: "📚", grammar: "⚙️", pronunciation: "🔊" };

  const bandColor = evaluation.band >= 7.5 ? "#0d7c59" : evaluation.band >= 6.5 ? "#c9a227" : "#a81011";
  const bandLabel = evaluation.band >= 7.5 ? "Excellent" : evaluation.band >= 6.5 ? "Good" : evaluation.band >= 5.5 ? "Competent" : "Developing";

  const TABS = [["scores","Scores"],["transcript","Transcript"],["phrases","Phrases"],["deepdive","Deep Dive"]];

  return (
    <div onClick={handleClose} style={{
      position:"fixed", inset:0, background:"rgba(8,16,40,0.68)", zIndex:1000,
      display:"flex", alignItems:"flex-end", justifyContent:"center",
      backdropFilter:"blur(6px)",
      opacity: visible ? 1 : 0, transition:"opacity 0.3s ease",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width:"100%", maxWidth:820, background:"#fff",
        borderRadius:"24px 24px 0 0", maxHeight:"92vh", overflowY:"auto",
        transform: visible ? "translateY(0)" : "translateY(100%)",
        transition:"transform 0.45s cubic-bezier(0.34,1.3,0.64,1)",
        boxShadow:"0 -16px 60px rgba(0,0,0,0.25)",
      }}>

        {/* Handle + close */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 20px 0" }}>
          <div style={{ width:36, height:4, background:"#e2e8f0", borderRadius:99, margin:"0 auto" }} />
        </div>

        {/* Hero */}
        <div style={{
          background:"linear-gradient(135deg,#0c1f4a 0%,#1a3468 55%,#a81011 100%)",
          margin:"12px 16px 0", borderRadius:16, padding:"22px 24px",
          position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", top:-50, right:-50, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.035)" }} />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", position:"relative" }}>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:"0.66rem", fontWeight:700, letterSpacing:"2px", textTransform:"uppercase", color:"rgba(255,255,255,0.42)", marginBottom:8 }}>
                IELTS Analyser · Free & Instant
              </p>
              <div style={{ display:"flex", alignItems:"baseline", gap:12, marginBottom:8 }}>
                <h2 style={{ fontFamily:"Georgia, serif", fontSize:"2.2rem", fontWeight:800, color:"#fff", lineHeight:1 }}>
                  Band {evaluation.band?.toFixed(1)}
                </h2>
                <span style={{
                  fontSize:"0.72rem", fontWeight:700, padding:"3px 12px", borderRadius:99,
                  border:"1px solid currentColor",
                  background: evaluation.band >= 7 ? "rgba(16,185,129,0.2)" : evaluation.band >= 6 ? "rgba(245,158,11,0.2)" : "rgba(168,16,17,0.2)",
                  color: evaluation.band >= 7 ? "#6ee7b7" : evaluation.band >= 6 ? "#fcd34d" : "#fca5a5",
                }}>{bandLabel}</span>
              </div>
              <p style={{ fontSize:"0.82rem", color:"rgba(255,255,255,0.75)", lineHeight:1.65, maxWidth:440, marginBottom:14 }}>
                {evaluation.examinerNote}
              </p>
              {/* Mini score row */}
              <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                {criteriaOrder.map(k => {
                  const s = evaluation.criteria?.[k]?.score ?? 6;
                  const c = s >= 7.5 ? "#6ee7b7" : s >= 6.5 ? "#fcd34d" : "#fca5a5";
                  return (
                    <div key={k} onClick={() => setTab("scores")} style={{ cursor:"pointer" }}>
                      <p style={{ fontSize:"0.58rem", color:"rgba(255,255,255,0.4)", textTransform:"uppercase", letterSpacing:"0.8px", marginBottom:2 }}>{criteriaIcons[k]} {criteriaLabels[k].split("&")[0].trim()}</p>
                      <p style={{ fontSize:"1rem", fontWeight:800, color:c, fontFamily:"Georgia, serif" }}>{s?.toFixed(1)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <BandRing score={evaluation.band} size={84} />
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", margin:"14px 16px 0", borderBottom:"1px solid #f1f5f9" }}>
          {TABS.map(([id,label]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              padding:"10px 18px", background:"none", border:"none", cursor:"pointer",
              fontSize:"0.8rem", fontWeight:700,
              color: tab===id ? "#0c1f4a" : "#94a3b8",
              borderBottom:`2px solid ${tab===id ? "#a81011" : "transparent"}`,
              marginBottom:-1, transition:"all 0.15s", whiteSpace:"nowrap",
            }}>{label}</button>
          ))}
          <button onClick={handleClose} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:"#94a3b8", fontSize:"1.1rem", padding:"10px 16px" }}>✕</button>
        </div>

        <div style={{ padding:"20px 16px 40px" }}>

          {/* ══ TAB: SCORES ══ */}
          {tab==="scores" && (
            <div>
              {/* 4 rings */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10, marginBottom:20 }}>
                {criteriaOrder.map(k => (
                  <div key={k} style={{ background:"#f8fafc", borderRadius:12, padding:"14px 8px", textAlign:"center", border:"1px solid #f1f5f9" }}>
                    <BandRing score={evaluation.criteria?.[k]?.score ?? 6} size={62} />
                    <p style={{ fontSize:"0.62rem", fontWeight:700, color:"#64748b", marginTop:6, lineHeight:1.3 }}>{criteriaLabels[k]}</p>
                  </div>
                ))}
              </div>

              {/* Detailed criterion cards */}
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {criteriaOrder.map(k => {
                  const c = evaluation.criteria?.[k];
                  if (!c) return null;
                  const col = c.score >= 7.5 ? "#0d7c59" : c.score >= 6.5 ? "#c9a227" : "#a81011";
                  const bgCol = c.score >= 7.5 ? "#f0fdf4" : c.score >= 6.5 ? "#fefce8" : "#fff7f7";
                  return (
                    <div key={k} style={{ background:bgCol, borderRadius:12, padding:"16px 18px", border:`1px solid ${col}22` }}>
                      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:8 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <span style={{ fontSize:"1rem" }}>{criteriaIcons[k]}</span>
                          <div>
                            <p style={{ fontSize:"0.8rem", fontWeight:700, color:"#1e293b" }}>{criteriaLabels[k]}</p>
                            <p style={{ fontSize:"0.76rem", color:"#64748b", marginTop:1 }}>{c.comment}</p>
                          </div>
                        </div>
                        <span style={{ fontSize:"1.15rem", fontWeight:800, color:col, fontFamily:"Georgia, serif", flexShrink:0, marginLeft:12 }}>{c.score?.toFixed(1)}</span>
                      </div>
                      {c.details && (
                        <p style={{ fontSize:"0.78rem", color:"#475569", lineHeight:1.65, marginBottom:8, paddingLeft:28 }}>{c.details}</p>
                      )}
                      {c.tip && (
                        <div style={{ display:"flex", gap:8, alignItems:"flex-start", background:"rgba(255,255,255,0.7)", borderRadius:8, padding:"8px 12px", marginLeft:28 }}>
                          <span style={{ fontSize:"0.7rem", fontWeight:700, color:col, textTransform:"uppercase", letterSpacing:"0.5px", flexShrink:0, marginTop:1 }}>Drill</span>
                          <p style={{ fontSize:"0.77rem", color:"#374151", lineHeight:1.5 }}>{c.tip}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Band scale */}
              <div style={{ background:"#f8fafc", borderRadius:12, padding:"14px 16px", border:"1px solid #f1f5f9", marginTop:14 }}>
                <p style={{ fontSize:"0.7rem", fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"1px", marginBottom:10 }}>Your position on the IELTS band scale</p>
                <div style={{ display:"flex", gap:3 }}>
                  {[4,4.5,5,5.5,6,6.5,7,7.5,8,8.5,9].map(b => {
                    const active = Math.abs(b-(evaluation.band||6)) < 0.26;
                    const col = b >= 7.5 ? "#0d7c59" : b >= 6.0 ? "#c9a227" : "#a81011";
                    return (
                      <div key={b} style={{ flex:1, height:active?28:18, background:active?col:"#e2e8f0", borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", alignSelf:"flex-end", transition:"all 0.3s" }}>
                        {active && <span style={{ fontSize:"0.6rem", fontWeight:800, color:"#fff" }}>{b}</span>}
                      </div>
                    );
                  })}
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                  <span style={{ fontSize:"0.65rem", color:"#94a3b8" }}>4.0 — Basic</span>
                  <span style={{ fontSize:"0.65rem", color:"#94a3b8" }}>9.0 — Expert</span>
                </div>
              </div>
            </div>
          )}

          {/* ══ TAB: TRANSCRIPT ══ */}
          {tab==="transcript" && (
            <div>
              {/* Transcript text */}
              <div style={{ background:"#f8fafc", borderRadius:12, padding:"18px 20px", border:"1px solid #f1f5f9", marginBottom:16 }}>
                <p style={{ fontSize:"0.68rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px", color:"#94a3b8", marginBottom:10 }}>Your transcribed answer</p>
                <p style={{ fontSize:"0.95rem", lineHeight:1.9, color:"#1e293b", fontFamily:"Georgia, serif", whiteSpace:"pre-wrap" }}>{transcript}</p>
              </div>

              {/* Strengths */}
              <div style={{ background:"#f0fdf4", borderRadius:12, padding:"16px 18px", border:"1px solid rgba(13,124,89,0.15)", marginBottom:10 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                  <div style={{ width:24, height:24, borderRadius:8, background:"#0d7c59", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ color:"#fff", fontSize:"12px" }}>✓</span>
                  </div>
                  <p style={{ fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", color:"#0d7c59" }}>What you did well</p>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {(evaluation.strengths || []).map((s,i) => (
                    <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                      <div style={{ width:20, height:20, borderRadius:"50%", background:"rgba(13,124,89,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                        <span style={{ fontSize:"0.65rem", fontWeight:800, color:"#0d7c59" }}>{i+1}</span>
                      </div>
                      <p style={{ fontSize:"0.82rem", color:"#166534", lineHeight:1.6 }}>{s}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Improvements */}
              <div style={{ background:"#fef9ec", borderRadius:12, padding:"16px 18px", border:"1px solid rgba(201,162,39,0.15)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                  <div style={{ width:24, height:24, borderRadius:8, background:"#c9a227", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ color:"#fff", fontSize:"12px" }}>↑</span>
                  </div>
                  <p style={{ fontSize:"0.75rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px", color:"#c9a227" }}>Areas to improve</p>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {(evaluation.improvements || []).map((s,i) => (
                    <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                      <div style={{ width:20, height:20, borderRadius:"50%", background:"rgba(201,162,39,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                        <span style={{ fontSize:"0.65rem", fontWeight:800, color:"#c9a227" }}>{i+1}</span>
                      </div>
                      <p style={{ fontSize:"0.82rem", color:"#92400e", lineHeight:1.6 }}>{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ TAB: PHRASES ══ */}
          {tab==="phrases" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <p style={{ fontSize:"0.82rem", color:"#64748b", lineHeight:1.6 }}>
                The examiner picked specific phrases from your answer and rewrote them at a higher band level.
              </p>

              {/* phrasePairs */}
              {(evaluation.phrasePairs || (evaluation.betterPhrase ? [evaluation.betterPhrase] : [])).map((pair, i) => (
                <div key={i} style={{ background:"#fff", borderRadius:14, border:"1px solid #f1f5f9", overflow:"hidden" }}>
                  <div style={{ background:"#f8fafc", padding:"10px 16px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:22, height:22, borderRadius:"50%", background:"linear-gradient(135deg,#0c1f4a,#a81011)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <span style={{ color:"#fff", fontSize:"0.65rem", fontWeight:800 }}>{i+1}</span>
                    </div>
                    <p style={{ fontSize:"0.72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.8px", color:"#64748b" }}>Phrase upgrade</p>
                  </div>
                  <div style={{ padding:"16px" }}>
                    <div style={{ marginBottom:10 }}>
                      <p style={{ fontSize:"0.66rem", fontWeight:700, color:"#a81011", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:6 }}>You said</p>
                      <p style={{ fontSize:"0.9rem", color:"#374151", fontStyle:"italic", background:"#fef2f2", padding:"12px 14px", borderRadius:8, borderLeft:"3px solid #a81011", lineHeight:1.55 }}>
                        "{pair.original}"
                      </p>
                    </div>
                    <div style={{ display:"flex", justifyContent:"center", margin:"8px 0" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
                    </div>
                    <div style={{ marginBottom:pair.why ? 10 : 0 }}>
                      <p style={{ fontSize:"0.66rem", fontWeight:700, color:"#0d7c59", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:6 }}>More natural / advanced</p>
                      <p style={{ fontSize:"0.9rem", color:"#166534", fontStyle:"italic", background:"#f0fdf4", padding:"12px 14px", borderRadius:8, borderLeft:"3px solid #0d7c59", lineHeight:1.55 }}>
                        "{pair.improved}"
                      </p>
                    </div>
                    {pair.why && (
                      <div style={{ background:"#f8fafc", borderRadius:8, padding:"8px 12px", marginTop:8 }}>
                        <p style={{ fontSize:"0.76rem", color:"#475569", lineHeight:1.5 }}>
                          <span style={{ fontWeight:700, color:"#0c1f4a" }}>Why: </span>{pair.why}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Useful expressions */}
              {evaluation.usefulExpressions?.length > 0 && (
                <div style={{ background:"#f8fafc", borderRadius:14, padding:"18px", border:"1px solid #f1f5f9" }}>
                  <p style={{ fontSize:"0.72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px", color:"#94a3b8", marginBottom:12 }}>
                    Expressions to use for this topic
                  </p>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {evaluation.usefulExpressions.map((expr, i) => (
                      <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                        <span style={{ fontSize:"0.7rem", fontWeight:700, color:"#6366f1", background:"#eef2ff", padding:"2px 8px", borderRadius:99, flexShrink:0, marginTop:2 }}>tip</span>
                        <p style={{ fontSize:"0.82rem", color:"#374151", lineHeight:1.55 }}>{expr}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ TAB: DEEP DIVE ══ */}
          {tab==="deepdive" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

              {/* Missed opportunities */}
              {evaluation.missedOpportunities?.length > 0 && (
                <div style={{ background:"#fff", borderRadius:14, border:"1px solid #f1f5f9", overflow:"hidden" }}>
                  <div style={{ background:"#f8fafc", padding:"12px 16px", borderBottom:"1px solid #f1f5f9" }}>
                    <p style={{ fontSize:"0.72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px", color:"#64748b" }}>
                      Missed opportunities
                    </p>
                    <p style={{ fontSize:"0.72rem", color:"#94a3b8", marginTop:2 }}>Ideas or perspectives you could have included to score higher</p>
                  </div>
                  <div style={{ padding:"16px", display:"flex", flexDirection:"column", gap:10 }}>
                    {evaluation.missedOpportunities.map((opp, i) => (
                      <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                        <div style={{ width:24, height:24, borderRadius:"50%", background:"#f1f5f9", border:"1px solid #e2e8f0", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <span style={{ fontSize:"0.65rem", fontWeight:700, color:"#64748b" }}>{i+1}</span>
                        </div>
                        <p style={{ fontSize:"0.82rem", color:"#374151", lineHeight:1.6 }}>{opp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Personalised next step */}
              {evaluation.nextStepFocus && (
                <div style={{
                  background:"linear-gradient(135deg,#0c1f4a,#1e3a6e)",
                  borderRadius:14, padding:"20px",
                }}>
                  <p style={{ fontSize:"0.7rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"1.5px", color:"rgba(255,255,255,0.5)", marginBottom:8 }}>
                    Your next step — practise today
                  </p>
                  <p style={{ fontSize:"0.92rem", color:"#fff", lineHeight:1.7 }}>{evaluation.nextStepFocus}</p>
                </div>
              )}

              {/* Per-criterion drills */}
              <div style={{ background:"#f8fafc", borderRadius:14, padding:"18px", border:"1px solid #f1f5f9" }}>
                <p style={{ fontSize:"0.72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px", color:"#94a3b8", marginBottom:14 }}>
                  5-minute daily drills by criterion
                </p>
                <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                  {criteriaOrder.map(k => {
                    const c = evaluation.criteria?.[k];
                    if (!c?.tip) return null;
                    const col = c.score >= 7.5 ? "#0d7c59" : c.score >= 6.5 ? "#c9a227" : "#a81011";
                    return (
                      <div key={k} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                        <div style={{ width:32, height:32, borderRadius:8, background:col+"15", border:`1px solid ${col}30`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <span style={{ fontSize:"14px" }}>{criteriaIcons[k]}</span>
                        </div>
                        <div>
                          <p style={{ fontSize:"0.76rem", fontWeight:700, color:"#1e293b", marginBottom:2 }}>{criteriaLabels[k]}</p>
                          <p style={{ fontSize:"0.78rem", color:"#475569", lineHeight:1.55 }}>{c.tip}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Band descriptors table */}
              <div style={{ background:"#fff", borderRadius:14, border:"1px solid #f1f5f9", overflow:"hidden" }}>
                <div style={{ background:"#f8fafc", padding:"12px 16px", borderBottom:"1px solid #f1f5f9" }}>
                  <p style={{ fontSize:"0.72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"1px", color:"#64748b" }}>Band descriptors — fluency & coherence</p>
                </div>
                <div style={{ padding:"12px 16px" }}>
                  {[
                    [9, "Speaks fluently with only very occasional repetition or self-correction."],
                    [7, "Speaks at length without noticeable effort; some hesitation or repetition."],
                    [6, "Willing to speak at length; some loss of coherence due to hesitation."],
                    [5, "Usually maintains flow but uses repetition and self-correction."],
                    [4, "Cannot respond without noticeable pauses; limited ability to link ideas."],
                  ].map(([b, desc]) => {
                    const isCurrent = evaluation.band >= b - 0.5 && evaluation.band < b + 0.5;
                    return (
                      <div key={b} style={{ display:"flex", gap:12, padding:"8px 0", borderBottom:"1px solid #f8fafc", background: isCurrent ? "#fffbeb" : "transparent", margin:"0 -16px", padding:"8px 16px" }}>
                        <span style={{ fontSize:"0.78rem", fontWeight:800, color: b >= 7 ? "#0d7c59" : b >= 6 ? "#c9a227" : "#a81011", minWidth:20 }}>{b}</span>
                        <p style={{ fontSize:"0.76rem", color: isCurrent ? "#92400e" : "#64748b", lineHeight:1.5, fontWeight: isCurrent ? 600 : 400 }}>{desc} {isCurrent && "← you are here"}</p>
                      </div>
                    );
                  })}
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

  // Recording
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [duration, setDuration] = useState(0);

  // Transcript
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const finalTranscriptRef = useRef("");

  // AI feedback
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [aiError, setAiError] = useState("");

  // Refs
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

  // Reset on question change
  useEffect(() => {
    resetAll();
  }, [activePart, qIndex]);

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

  const analyzeWithAI = async () => {
    const text = finalTranscriptRef.current.trim();
    if (!text) {
      setAiError("No transcript captured. Make sure your microphone is working and try speaking clearly.");
      return;
    }
    setIsAnalyzing(true);
    setAiError("");
    try {
      const result = evaluateSpeakingOffline(text, activePart);
      setEvaluation(result);
      setShowPanel(true);
    } catch (err) {
      console.error(err);
      setAiError("Could not connect to AI. Please check your network and try again.");
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
          Record your answer to a real IELTS question. The built-in analyser transcribes your speech and gives you a band score with specific feedback — free, instant, no API needed.
        </p>
      </div>

      {/* Part selector cards */}
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

      {/* Active practice area */}
      {activePart && (
        <div style={{
          background: "#fff", border: "1.5px solid #e2e8f0",
          borderRadius: 20, overflow: "hidden",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        }}>
          {/* Top accent bar */}
          <div style={{ height: 4, background: `linear-gradient(90deg, ${pc.dot}, #a81011)` }} />

          <div style={{ padding: "24px 28px" }}>
            {/* Question header */}
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

            {/* Question box */}
            <div style={{
              background: "#f8fafc", borderRadius: 14, padding: "20px 22px",
              marginBottom: 24, border: "1px solid #f1f5f9",
              borderLeft: `4px solid ${pc.dot}`,
            }}>
              <p style={{ fontSize: "1rem", color: "#0c1f4a", lineHeight: 1.8, whiteSpace: "pre-line", fontFamily: "Georgia, serif" }}>
                {currentQuestion}
              </p>
            </div>

            {/* ── RECORDING AREA ── */}
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

              {/* Controls */}
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
                    <button onClick={analyzeWithAI} disabled={isAnalyzing} style={{
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
                          Get AI Feedback
                        </>
                      )}
                    </button>
                  </>
                )}

                {isRecording && <WaveformBars active />}
              </div>

              {/* Live transcript preview */}
              {(finalTranscript || interimTranscript) && (
                <div style={{ marginTop: 4 }}>
                  <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", color: "#94a3b8", marginBottom: 6 }}>Live transcript</p>
                  <p style={{ fontSize: "0.85rem", color: "#374151", lineHeight: 1.7, background: "#fff", padding: "10px 14px", borderRadius: 8, border: "1px solid #f1f5f9" }}>
                    <span>{finalTranscript}</span>
                    {interimTranscript && <span style={{ color: "#94a3b8" }}> {interimTranscript}</span>}
                  </p>
                </div>
              )}

              {/* Error */}
              {aiError && (
                <div style={{ marginTop: 10, padding: "10px 14px", background: "#fef2f2", border: "1px solid rgba(168,16,17,0.2)", borderRadius: 8, fontSize: "0.82rem", color: "#a81011" }}>
                  {aiError}
                </div>
              )}

              {/* Speech not supported notice */}
              {!speech.supported && (
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 8 }}>
                  Note: Live transcription is not supported in this browser. Firefox and Safari may not capture speech — try Chrome for best results.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* No part selected — tips */}
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

      {/* Feedback panel overlay */}
      {showPanel && evaluation && (
        <FeedbackPanel
          evaluation={evaluation}
          transcript={finalTranscript}
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