import React, { useEffect, useMemo, useRef, useState } from "react";
import YouTube from "react-youtube";

const LESSONS = [
  {
    id: "yt-office-1",
    level: "Intermediate",
    topic: "Comedy / Office",
    title: "The Office — \"I declare bankruptcy\"",
    videoId: "AEFaFCEXPjk",
    lines: [
      { start: 0.5,  end: 3.2,  text: "I've made some very poor decisions recently." },
      { start: 3.4,  end: 6.1,  text: "And I need to get my finances under control." },
      { start: 6.3,  end: 9.8,  text: "So I've decided — I declare bankruptcy!" },
      { start: 10.1, end: 13.0, text: "Michael, you can't just say the words 'I declare bankruptcy'..." },
      { start: 13.2, end: 16.5, text: "...and have it be legally binding." },
      { start: 17.0, end: 20.3, text: "That is why I'm also yelling it." },
      { start: 20.8, end: 24.1, text: "I DECLARE BANKRUPTCY!" },
    ],
  },
  {
    id: "yt-friends-1",
    level: "Beginner",
    topic: "Comedy / Daily life",
    title: "Friends — \"How you doin'\"",
    videoId: "sZHOQZHxg8I",
    lines: [
      { start: 1.0,  end: 3.5,  text: "Hey. How you doin'?" },
      { start: 4.0,  end: 7.2,  text: "Oh, I'm doing great, actually." },
      { start: 7.5,  end: 11.0, text: "Yeah? That's great. That's really great." },
      { start: 11.3, end: 14.8, text: "So... do you wanna grab some coffee or something?" },
      { start: 15.2, end: 18.5, text: "Sure, I'd love that." },
      { start: 19.0, end: 22.3, text: "Cool. Cool cool cool." },
    ],
  },
  {
    id: "yt-ted-confidence",
    level: "Advanced",
    topic: "TED Talk / Psychology",
    title: "Amy Cuddy — Power poses",
    videoId: "Ks-_Mh1QhMc",
    lines: [
      { start: 14.0, end: 18.5, text: "So I want to start by offering you a free no-tech life hack..." },
      { start: 18.8, end: 23.5, text: "...and all it requires is that you change your body posture for two minutes." },
      { start: 24.0, end: 29.2, text: "But before I give it away, I want to ask you to do something for me." },
      { start: 29.6, end: 34.1, text: "I want you to really, truly feel powerful." },
      { start: 34.5, end: 39.0, text: "So the next two minutes are going to be your two minutes." },
      { start: 39.4, end: 44.8, text: "I want you to make your bodies as big as possible." },
      { start: 45.2, end: 50.5, text: "Spread out. Take up space. Expand." },
      { start: 51.0, end: 56.3, text: "Our bodies change our minds. And our minds change our behavior." },
      { start: 56.7, end: 62.0, text: "And our behavior changes our outcomes." },
    ],
  },
  {
    id: "yt-breaking-bad-1",
    level: "Advanced",
    topic: "Drama / Monologue",
    title: "Breaking Bad — \"Say my name\"",
    videoId: "2IzmRFq4vQs",
    lines: [
      { start: 3.0,  end: 7.5,  text: "You know who I am." },
      { start: 8.0,  end: 13.2, text: "I'm the man who killed Gus Fring." },
      { start: 13.8, end: 19.0, text: "A cartel assassin and a dirty DEA agent, and Gus Fring." },
      { start: 19.5, end: 24.3, text: "You've all heard of me." },
      { start: 25.0, end: 29.8, text: "Say. My. Name." },
      { start: 32.0, end: 36.5, text: "...Heisenberg." },
      { start: 37.0, end: 40.2, text: "You're goddamn right." },
    ],
  },
  {
    id: "yt-office-presentation",
    level: "Intermediate",
    topic: "Business / Presentation",
    title: "The Office — Dwight's speech",
    videoId: "7LvbGRc-WFk",
    lines: [
      { start: 1.0,  end: 5.5,  text: "Fact. Bears eat beets." },
      { start: 6.0,  end: 10.2, text: "Bears. Beets. Battlestar Galactica." },
      { start: 11.0, end: 15.8, text: "Identity theft is not a joke, Jim!" },
      { start: 16.2, end: 20.5, text: "Millions of families suffer every year." },
      { start: 21.0, end: 25.3, text: "MICHAEL!" },
      { start: 26.0, end: 30.8, text: "That's not — that's not funny." },
      { start: 31.2, end: 36.0, text: "Okay. I think we need to table this discussion for now." },
    ],
  },
  {
    id: "yt-ted-simon-sinek",
    level: "Advanced",
    topic: "TED Talk / Leadership",
    title: "Simon Sinek — Start with Why",
    videoId: "qp0HIF3SfI4",
    lines: [
      { start: 5.0,  end: 10.3, text: "How do you explain when things don't go as assumed?" },
      { start: 10.8, end: 16.2, text: "Or better, how do you explain when others are able to achieve things..." },
      { start: 16.5, end: 21.8, text: "...that seem to defy all of the assumptions?" },
      { start: 22.3, end: 27.5, text: "For example: Why is Apple so innovative?" },
      { start: 28.0, end: 33.2, text: "Year after year, after year, they're more innovative than all their competition." },
      { start: 33.8, end: 39.5, text: "And yet, they're just a computer company." },
      { start: 40.0, end: 45.3, text: "They're just like everyone else. They have the same access to the same talent." },
      { start: 45.8, end: 51.0, text: "The same agencies. The same consultants. The same media." },
      { start: 51.5, end: 57.2, text: "Then why is it that they seem to have something different?" },
    ],
  },
  {
    id: "yt-seinfeld-1",
    level: "Beginner",
    topic: "Comedy / Everyday",
    title: "Seinfeld — No soup for you",
    videoId: "lo7mUx5pYDI",
    lines: [
      { start: 1.5,  end: 5.0,  text: "You want the soup?" },
      { start: 5.5,  end: 9.2,  text: "Yes, please. One turkey chili." },
      { start: 9.8,  end: 13.5, text: "You're going to order the right way." },
      { start: 14.0, end: 17.8, text: "You're going to point to what you want..." },
      { start: 18.2, end: 22.0, text: "...and you're going to say clearly: 'I want the soup.'" },
      { start: 22.5, end: 26.3, text: "I want the soup." },
      { start: 27.0, end: 31.5, text: "No soup for you! Come back, one year!" },
    ],
  },
  {
    id: "yt-mr-robot",
    level: "Advanced",
    topic: "Drama / Monologue",
    title: "Mr. Robot — \"Hello, friend\"",
    videoId: "xIBiJ_SzJTA",
    lines: [
      { start: 2.0,  end: 7.5,  text: "Hello, friend. Hello, friend? That's lame." },
      { start: 8.0,  end: 13.3, text: "Maybe I should give you a name. But that's a slippery slope." },
      { start: 13.8, end: 19.2, text: "You're only in my head. We have to remember that." },
      { start: 19.8, end: 25.0, text: "Shit. It's actually happened. I'm talking to an imaginary person." },
      { start: 25.5, end: 31.0, text: "What I'm about to tell you is top secret." },
      { start: 31.5, end: 37.2, text: "A conspiracy bigger than all of us." },
      { start: 37.8, end: 43.5, text: "There's a powerful group of people out there that are secretly running the world." },
    ],
  },
];

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];
const TOPICS = ["All", "Comedy / Office", "Comedy / Daily life", "Comedy / Everyday", "Drama / Monologue", "TED Talk / Psychology", "TED Talk / Leadership", "Business / Presentation"];
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const fmt = (s) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
};

const LEVEL_COLOR = {
  Beginner: { bg: "#e8f5e9", text: "#2e7d32", dot: "#43a047" },
  Intermediate: { bg: "#fff8e1", text: "#f57f17", dot: "#ffa000" },
  Advanced: { bg: "#fce4ec", text: "#c62828", dot: "#e53935" },
};

export default function ShadowingPractice() {
  const transcriptRef = useRef(null);
  const playerRef = useRef(null);

  const [levelFilter, setLevelFilter] = useState("All");
  const [topicFilter, setTopicFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [lessonId, setLessonId] = useState(LESSONS[0].id);
  const [isReady, setIsReady] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showTranslation, setShowTranslation] = useState(false);
  const [repeatLine, setRepeatLine] = useState(false);
  const [abLoop, setAbLoop] = useState(false);
  const [loopA, setLoopA] = useState(0);
  const [loopB, setLoopB] = useState(6);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressByLesson, setProgressByLesson] = useState(() =>
    Object.fromEntries(LESSONS.map((l) => [l.id, 0]))
  );

  const filteredLessons = useMemo(() => {
    let result = LESSONS;
    if (levelFilter !== "All") result = result.filter((l) => l.level === levelFilter);
    if (topicFilter !== "All") result = result.filter((l) => l.topic === topicFilter);
    const q = query.trim().toLowerCase();
    if (q) result = result.filter((l) => `${l.level} ${l.topic} ${l.title}`.toLowerCase().includes(q));
    return result.length ? result : LESSONS;
  }, [levelFilter, topicFilter, query]);

  useEffect(() => {
    if (!filteredLessons.some((l) => l.id === lessonId)) {
      setLessonId(filteredLessons[0]?.id ?? LESSONS[0].id);
    }
  }, [filteredLessons]);

  const lesson = useMemo(() => LESSONS.find((l) => l.id === lessonId), [lessonId]);
  const progress = progressByLesson[lessonId] ?? 0;
  const lc = LEVEL_COLOR[lesson?.level] ?? LEVEL_COLOR.Beginner;

  useEffect(() => {
    if (!isReady || !lesson) return;
    const interval = setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      const t = p.getCurrentTime?.() ?? 0;
      if (abLoop && t >= loopB) { p.seekTo(loopA, true); p.playVideo?.(); return; }
      const idx = lesson.lines.findIndex((ln) => t >= ln.start && t < ln.end);
      if (idx !== -1 && idx !== activeIdx) setActiveIdx(idx);
      if (repeatLine) {
        const cur = lesson.lines[activeIdx];
        if (cur && t >= cur.end) { p.seekTo(cur.start, true); p.playVideo?.(); }
      }
    }, 150);
    return () => clearInterval(interval);
  }, [isReady, lesson, activeIdx, repeatLine, abLoop, loopA, loopB]);

  useEffect(() => {
    if (!autoScroll || !transcriptRef.current) return;
    const el = transcriptRef.current.querySelector(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeIdx, autoScroll]);

  useEffect(() => {
    if (!isReady || !playerRef.current) return;
    try { playerRef.current.setPlaybackRate?.(playbackRate); } catch {}
  }, [playbackRate, isReady]);

  const onReady = (e) => {
    playerRef.current = e.target;
    setIsReady(true);
    try { e.target.setPlaybackRate(playbackRate); } catch {}
  };
  const onStateChange = (e) => setIsPlaying(e.data === 1);

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    p.getPlayerState?.() === 1 ? p.pauseVideo?.() : p.playVideo?.();
  };
  const seekTo = (t) => { playerRef.current?.seekTo(t, true); playerRef.current?.playVideo?.(); };
  const jump = (s) => {
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(Math.max(0, (p.getCurrentTime?.() ?? 0) + s), true);
  };
  const loopActive = () => {
    if (!lesson) return;
    const cur = lesson.lines[activeIdx];
    if (!cur) return;
    setLoopA(cur.start); setLoopB(cur.end); setAbLoop(true);
  };
  const markPlus = () => setProgressByLesson((p) => ({ ...p, [lessonId]: clamp((p[lessonId] ?? 0) + 25, 0, 100) }));

  if (!lesson) return null;

  return (
    <div style={S.root}>
      {/* SIDEBAR */}
      <aside style={S.sidebar}>
        <div style={S.sidebarHead}>
          <div style={S.logo}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
          </div>
          <div>
            <div style={S.brandName}>Shadowing</div>
            <div style={S.brandSub}>Video practice</div>
          </div>
        </div>

        <div style={S.searchWrap}>
          <input
            style={S.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search videos..."
          />
        </div>

        <div style={S.filterGroup}>
          <div style={S.filterLabel}>Level</div>
          <div style={S.filterPills}>
            {LEVELS.map((l) => (
              <button key={l} style={levelFilter === l ? S.pillActive : S.pill} onClick={() => setLevelFilter(l)}>{l}</button>
            ))}
          </div>
        </div>

        <div style={S.lessonList}>
          {filteredLessons.map((l) => {
            const c = LEVEL_COLOR[l.level];
            const active = l.id === lessonId;
            return (
              <button key={l.id} style={active ? S.lessonItemActive : S.lessonItem} onClick={() => { setLessonId(l.id); setActiveIdx(0); }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ ...S.dot, background: c.dot }} />
                  <span style={{ ...S.levelBadge, background: c.bg, color: c.text }}>{l.level}</span>
                </div>
                <div style={active ? S.lessonTitleActive : S.lessonTitle}>{l.title}</div>
                <div style={S.lessonTopic}>{l.topic}</div>
                <div style={S.lessonProgress}>
                  <div style={{ ...S.lessonBar, width: `${progressByLesson[l.id] ?? 0}%` }} />
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* MAIN */}
      <main style={S.main}>
        {/* Header */}
        <div style={S.mainHeader}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ ...S.levelBadge, background: lc.bg, color: lc.text, fontSize: 12 }}>{lesson.level}</span>
              <span style={S.topicChip}>{lesson.topic}</span>
            </div>
            <h1 style={S.mainTitle}>{lesson.title}</h1>
          </div>
          <div style={S.progressBig}>
            <svg viewBox="0 0 36 36" width="52" height="52" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="3"/>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke={lc.dot} strokeWidth="3"
                strokeDasharray={`${progress} 100`} strokeLinecap="round"
                style={{ transition: "stroke-dasharray 0.5s ease" }}/>
            </svg>
            <div style={S.progressLabel}><span style={{ fontWeight: 600, fontSize: 15 }}>{progress}%</span><span style={{ fontSize: 11, color: "#9ca3af" }}>done</span></div>
          </div>
        </div>

        {/* Player */}
        <div style={S.playerOuter}>
          <YouTube
            videoId={lesson.videoId}
            onReady={onReady}
            onStateChange={onStateChange}
            opts={{ width: "100%", height: "100%", playerVars: { rel: 0, modestbranding: 1, playsinline: 1 } }}
            style={{ width: "100%", height: "100%" }}
            iframeClassName="yt-iframe"
          />
        </div>

        {/* Controls */}
        <div style={S.controls}>
          <div style={S.controlsRow}>
            <div style={S.btnGroup}>
              <button style={S.btnPrimary} onClick={togglePlay}>
                {isPlaying ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                )}
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button style={S.btn} onClick={() => jump(-3)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.31"/></svg>
                −3s
              </button>
              <button style={S.btn} onClick={() => jump(3)}>
                +3s
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.49-3.31"/></svg>
              </button>
            </div>

            <div style={S.btnGroup}>
              <span style={S.controlLabel}>Speed</span>
              {[0.75, 0.9, 1, 1.25].map((r) => (
                <button key={r} style={playbackRate === r ? S.speedActive : S.speed} onClick={() => setPlaybackRate(r)}>{r}x</button>
              ))}
            </div>

            <div style={S.btnGroup}>
              <button style={repeatLine ? S.btnToggleOn : S.btnToggle} onClick={() => setRepeatLine((v) => !v)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                Repeat line
              </button>
              <button style={abLoop ? S.btnToggleOn : S.btnToggle} onClick={() => setAbLoop((v) => !v)}>A/B loop</button>
              <button style={S.btn} onClick={loopActive}>Loop active</button>
            </div>
          </div>

          {abLoop && (
            <div style={S.abRow}>
              <span style={S.controlLabel}>A/B loop:</span>
              {["A", "B"].map((lbl, i) => (
                <label key={lbl} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                  <span style={{ fontWeight: 600, color: "#6366f1" }}>{lbl}</span>
                  <input
                    type="number" step="0.25" style={S.abInput}
                    value={i === 0 ? loopA : loopB}
                    onChange={(e) => i === 0 ? setLoopA(+e.target.value) : setLoopB(+e.target.value)}
                  />
                  <span style={{ color: "#9ca3af", fontSize: 12 }}>s</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Bottom: transcript + tips */}
        <div style={S.bottomGrid}>
          {/* Transcript */}
          <div style={S.transcriptCard}>
            <div style={S.cardHead}>
              <span style={S.cardTitle}>Transcript</span>
              <label style={S.toggleLabel}>
                <input type="checkbox" checked={autoScroll} onChange={(e) => setAutoScroll(e.target.checked)} style={{ marginRight: 5 }} />
                Auto-scroll
              </label>
            </div>
            <div ref={transcriptRef} style={S.transcriptList}>
              {lesson.lines.map((ln, i) => {
                const active = i === activeIdx;
                return (
                  <button key={`${lesson.id}-${i}`} data-idx={i} style={active ? S.lineActive : S.line} onClick={() => seekTo(ln.start)}>
                    <span style={active ? S.timeActive : S.time}>{fmt(ln.start)}</span>
                    <span style={S.lineText}>{ln.text}</span>
                    {active && (
                      <button style={S.markBtn} onClick={(e) => { e.stopPropagation(); markPlus(); }}>+25%</button>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tips */}
          <div style={S.tipsCard}>
            <div style={S.cardHead}><span style={S.cardTitle}>How to shadow</span></div>
            {[
              ["1. Listen", "Play the full clip once without shadowing. Focus on rhythm and tone."],
              ["2. Echo", "Pause after each sentence. Repeat exactly as you heard it."],
              ["3. Shadow", "Play again and speak along simultaneously, matching the speaker."],
              ["4. Record", "Record yourself and compare. Focus on stress and intonation."],
              ["5. Speed up", "Once comfortable at 0.9x, move to 1.0x and then 1.1x."],
            ].map(([t, d]) => (
              <div key={t} style={S.tip}>
                <div style={S.tipTitle}>{t}</div>
                <div style={S.tipDesc}>{d}</div>
              </div>
            ))}

            <div style={{ marginTop: 20, padding: "14px 16px", background: "#f0f4ff", borderRadius: 10, fontSize: 13, color: "#4338ca", lineHeight: 1.6 }}>
              <strong style={{ display: "block", marginBottom: 4 }}>Pro tip</strong>
              Use A/B loop to isolate one difficult sentence and repeat it 8–12 times. This is the fastest way to fix pronunciation.
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .yt-iframe { width: 100%; height: 100%; border: none; display: block; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
      `}</style>
    </div>
  );
}

const S = {
  root: { display: "flex", minHeight: "100vh", background: "#f9fafb", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#111827" },
  sidebar: { width: 260, minHeight: "100vh", background: "#fff", borderRight: "1px solid #f3f4f6", display: "flex", flexDirection: "column", padding: "20px 0", flexShrink: 0 },
  sidebarHead: { display: "flex", alignItems: "center", gap: 10, padding: "0 20px 20px", borderBottom: "1px solid #f3f4f6" },
  logo: { width: 36, height: 36, borderRadius: 10, background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", flexShrink: 0 },
  brandName: { fontWeight: 700, fontSize: 15, letterSpacing: -0.3 },
  brandSub: { fontSize: 11, color: "#9ca3af" },
  searchWrap: { padding: "16px 16px 8px" },
  searchInput: { width: "100%", padding: "8px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none", background: "#f9fafb", color: "#111827" },
  filterGroup: { padding: "8px 16px 12px" },
  filterLabel: { fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#9ca3af", marginBottom: 6 },
  filterPills: { display: "flex", flexWrap: "wrap", gap: 4 },
  pill: { padding: "4px 10px", borderRadius: 99, fontSize: 12, border: "1px solid #e5e7eb", background: "#fff", color: "#6b7280", cursor: "pointer", fontWeight: 500 },
  pillActive: { padding: "4px 10px", borderRadius: 99, fontSize: 12, border: "1px solid #6366f1", background: "#eef2ff", color: "#4338ca", cursor: "pointer", fontWeight: 600 },
  lessonList: { flex: 1, overflowY: "auto", padding: "4px 8px" },
  lessonItem: { width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", marginBottom: 2 },
  lessonItemActive: { width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 8, border: "none", background: "#f5f3ff", cursor: "pointer", marginBottom: 2 },
  lessonTitle: { fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 2, lineHeight: 1.4 },
  lessonTitleActive: { fontSize: 13, fontWeight: 600, color: "#4338ca", marginBottom: 2, lineHeight: 1.4 },
  lessonTopic: { fontSize: 11, color: "#9ca3af", marginBottom: 6 },
  lessonProgress: { height: 3, background: "#e5e7eb", borderRadius: 99, overflow: "hidden" },
  lessonBar: { height: "100%", background: "#6366f1", borderRadius: 99, transition: "width 0.4s ease" },
  dot: { width: 6, height: 6, borderRadius: 99, flexShrink: 0 },
  levelBadge: { fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99 },
  topicChip: { fontSize: 12, color: "#6b7280", background: "#f3f4f6", padding: "2px 8px", borderRadius: 99 },
  main: { flex: 1, padding: "24px 28px", overflowY: "auto", maxWidth: 900 },
  mainHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  mainTitle: { fontSize: 22, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.3 },
  progressBig: { position: "relative", flexShrink: 0 },
  progressLabel: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  playerOuter: { width: "100%", aspectRatio: "16/9", borderRadius: 14, overflow: "hidden", background: "#000", marginBottom: 16 },
  controls: { background: "#fff", borderRadius: 12, padding: "14px 16px", marginBottom: 16, border: "1px solid #f3f4f6" },
  controlsRow: { display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" },
  btnGroup: { display: "flex", alignItems: "center", gap: 6 },
  controlLabel: { fontSize: 12, color: "#9ca3af", fontWeight: 500 },
  btn: { display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", color: "#374151", fontSize: 13, fontWeight: 500, cursor: "pointer" },
  btnPrimary: { display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "none", borderRadius: 8, background: "#4f46e5", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  btnToggle: { display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", color: "#6b7280", fontSize: 13, fontWeight: 500, cursor: "pointer" },
  btnToggleOn: { display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", border: "1px solid #a5b4fc", borderRadius: 8, background: "#eef2ff", color: "#4338ca", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  speed: { padding: "5px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "#fff", color: "#6b7280", fontSize: 12, fontWeight: 500, cursor: "pointer" },
  speedActive: { padding: "5px 10px", borderRadius: 6, border: "1px solid #a5b4fc", background: "#eef2ff", color: "#4338ca", fontSize: 12, fontWeight: 700, cursor: "pointer" },
  abRow: { display: "flex", alignItems: "center", gap: 16, marginTop: 12, paddingTop: 12, borderTop: "1px solid #f3f4f6" },
  abInput: { width: 64, padding: "5px 8px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 13, outline: "none" },
  bottomGrid: { display: "grid", gridTemplateColumns: "1fr 280px", gap: 16 },
  transcriptCard: { background: "#fff", borderRadius: 12, border: "1px solid #f3f4f6", overflow: "hidden" },
  tipsCard: { background: "#fff", borderRadius: 12, border: "1px solid #f3f4f6", padding: "16px", overflowY: "auto" },
  cardHead: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "1px solid #f3f4f6" },
  cardTitle: { fontSize: 14, fontWeight: 700, letterSpacing: -0.2 },
  toggleLabel: { fontSize: 12, color: "#6b7280", display: "flex", alignItems: "center", cursor: "pointer" },
  transcriptList: { maxHeight: 340, overflowY: "auto", padding: "8px" },
  line: { display: "flex", alignItems: "flex-start", gap: 10, width: "100%", textAlign: "left", padding: "10px 10px", borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", marginBottom: 2 },
  lineActive: { display: "flex", alignItems: "flex-start", gap: 10, width: "100%", textAlign: "left", padding: "10px 10px", borderRadius: 8, border: "none", background: "#f5f3ff", cursor: "pointer", marginBottom: 2 },
  time: { fontSize: 11, color: "#d1d5db", fontWeight: 600, fontFamily: "monospace", flexShrink: 0, marginTop: 2, minWidth: 32 },
  timeActive: { fontSize: 11, color: "#6366f1", fontWeight: 700, fontFamily: "monospace", flexShrink: 0, marginTop: 2, minWidth: 32 },
  lineText: { fontSize: 14, color: "#374151", lineHeight: 1.5, flex: 1 },
  markBtn: { fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "1px solid #c7d2fe", background: "#eef2ff", color: "#4338ca", cursor: "pointer", fontWeight: 600, flexShrink: 0 },
  tip: { paddingBottom: 14, marginBottom: 14, borderBottom: "1px solid #f3f4f6" },
  tipTitle: { fontSize: 13, fontWeight: 700, color: "#111827", marginBottom: 4 },
  tipDesc: { fontSize: 12, color: "#6b7280", lineHeight: 1.6 },
};