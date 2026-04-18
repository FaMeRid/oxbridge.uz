import React, { useEffect, useMemo, useRef, useState } from "react";
import YouTube from "react-youtube";
import "../../styles/shadowing.css";

const LESSONS = [
  {
    id: "yt-1",
    level: "Beginner",
    topic: "Daily",
    title: "Short shadowing demo",
    videoId: "aDJi1C5EJQo", 
    lines: [
      { start: 0, end: 1.5, text: "I already apologyzed." },
      { start: 2, end: 3, text: "It's over." },
      { start: 5.0, end: 15.0, text: "Over? Tonght was just the icing on the biryhday cake." },
    ],
  },
  // Добавить видео:
  // {
  //   id: "yt-2",
  //   level: "Intermediate",
  //   topic: "Business",
  //   title: "Presentation opener",
  //   videoId: "XXXXXXXXXXX",
  //   lines: [
  //     { start: 12.0, end: 15.0, text: "..." },
  //   ],
  // },
];

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

export default function ShadowingPractice() {
  const transcriptRef = useRef(null);

  const [levelFilter, setLevelFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [lessonId, setLessonId] = useState(LESSONS[0].id);

  // player state
  const playerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [autoScroll, setAutoScroll] = useState(true);

  // looping
  const [repeatLine, setRepeatLine] = useState(false);
  const [abLoop, setAbLoop] = useState(false);
  const [loopA, setLoopA] = useState(0);
  const [loopB, setLoopB] = useState(6);
  const [activeIdx, setActiveIdx] = useState(0);
  const [progressByLesson, setProgressByLesson] = useState(() => {
    const init = {};
    LESSONS.forEach((l) => (init[l.id] = 0));
    return init;
  });

  const filteredLessons = useMemo(() => {
    const byLevel =
      levelFilter === "All" ? LESSONS : LESSONS.filter((l) => l.level === levelFilter);

    const q = query.trim().toLowerCase();
    if (!q) return byLevel;

    return byLevel.filter((l) => {
      const hay = `${l.level} ${l.topic} ${l.title}`.toLowerCase();
      return hay.includes(q);
    });
  }, [levelFilter, query]);

  useEffect(() => {
    if (!filteredLessons.some((l) => l.id === lessonId)) {
      setLessonId(filteredLessons[0]?.id ?? LESSONS[0].id);
    }
  }, [filteredLessons, lessonId]);

  const lesson = useMemo(() => LESSONS.find((l) => l.id === lessonId), [lessonId]);
  const progress = progressByLesson[lessonId] ?? 0;
  useEffect(() => {
    if (!isReady) return;

    const interval = setInterval(() => {
      const p = playerRef.current;
      if (!p || !lesson) return;

      const t = p.getCurrentTime?.() ?? 0;

      // AB loop
      if (abLoop && t >= loopB) {
        p.seekTo(loopA, true);
        p.playVideo?.();
        return;
      }

      // active line
      const idx = lesson.lines.findIndex((ln) => t >= ln.start && t < ln.end);
      if (idx !== -1 && idx !== activeIdx) {
        setActiveIdx(idx);
      }

      // repeat current line
      if (repeatLine) {
        const cur = lesson.lines[activeIdx];
        if (cur && t >= cur.end) {
          p.seekTo(cur.start, true);
          p.playVideo?.();
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isReady, lesson, activeIdx, repeatLine, abLoop, loopA, loopB]);

  // autoscroll transcript
  useEffect(() => {
    if (!autoScroll) return;
    const container = transcriptRef.current;
    if (!container) return;

    const el = container.querySelector(`[data-line-index="${activeIdx}"]`);
    if (!el) return;
    el.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [activeIdx, autoScroll]);

  // apply playback rate when changed
  useEffect(() => {
    const p = playerRef.current;
    if (!p || !isReady) return;
    try {
      p.setPlaybackRate?.(playbackRate);
    } catch {
      // some videos may restrict rates
    }
  }, [playbackRate, isReady]);

  const onReady = (event) => {
    playerRef.current = event.target;
    setIsReady(true);
    // set initial speed
    try {
      event.target.setPlaybackRate(playbackRate);
    } catch {}
  };

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;

    const state = p.getPlayerState?.();
    // 1 playing, 2 paused
    if (state === 1) p.pauseVideo?.();
    else p.playVideo?.();
  };

  const seekTo = (time) => {
    const p = playerRef.current;
    if (!p) return;
    p.seekTo(time, true);
    p.playVideo?.();
  };

  const jump = (sec) => {
    const p = playerRef.current;
    if (!p) return;
    const t = p.getCurrentTime?.() ?? 0;
    p.seekTo(Math.max(0, t + sec), true);
  };

  const loopActiveSentence = () => {
    if (!lesson) return;
    const cur = lesson.lines[activeIdx];
    if (!cur) return;
    setLoopA(cur.start);
    setLoopB(cur.end);
    setAbLoop(true);
  };

  const markPlus = (value = 20) => {
    setProgressByLesson((prev) => ({
      ...prev,
      [lessonId]: clamp((prev[lessonId] ?? 0) + value, 0, 100),
    }));
  };

  if (!lesson) return null;

  return (
    <div className="vt">
      <div className="vt__container">
        {/* top bar */}
        <header className="vt__topbar">
          <div className="vt__brand">
            <div className="vt__logo">🎧</div>
            <div>
              <div className="vt__h1">Shadowing</div>
              <div className="vt__sub">YouTube + timed transcript (VoiceTube-like)</div>
            </div>
          </div>

          <div className="vt__filters">
            <input
              className="vt__input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search lessons..."
            />
            <select
              className="vt__select"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            <select
              className="vt__select"
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
            >
              {filteredLessons.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.level} · {l.title}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="vt__grid">
          {/* left: player */}
          <section className="card">
            <div className="card__head">
              <div className="pillRow">
                <span className="pill">{lesson.level}</span>
                <span className="pill pill--muted">{lesson.topic}</span>
              </div>
              <div className="card__title">{lesson.title}</div>
            </div>

            <div className="playerWrap">
              <YouTube
                videoId={lesson.videoId}
                onReady={onReady}
                opts={{
                  width: "100%",
                  height: "100%",
                  playerVars: {
                    rel: 0,
                    modestbranding: 1,
                    playsinline: 1,
                  },
                }}
                className="player"
                iframeClassName="player__iframe"
              />
            </div>

            <div className="panel">
              <div className="panel__row">
                <div className="btnRow">
                  <button className="btn btn--primary" onClick={togglePlay}>
                    Play / Pause
                  </button>
                  <button className="btn" onClick={() => jump(-2)}>-2s</button>
                  <button className="btn" onClick={() => jump(2)}>+2s</button>
                  <button className="btn btn--success" onClick={() => markPlus(20)}>+20%</button>
                </div>

                <div className="rightRow">
                  <label className="field">
                    <span>Speed</span>
                    <select
                      className="vt__select"
                      value={playbackRate}
                      onChange={(e) => setPlaybackRate(Number(e.target.value))}
                    >
                      <option value={0.75}>0.75x</option>
                      <option value={0.9}>0.9x</option>
                      <option value={1}>1.0x</option>
                      <option value={1.1}>1.1x</option>
                      <option value={1.25}>1.25x</option>
                    </select>
                  </label>

                  <label className="check">
                    <input
                      type="checkbox"
                      checked={autoScroll}
                      onChange={(e) => setAutoScroll(e.target.checked)}
                    />
                    <span>Auto-scroll</span>
                  </label>
                </div>
              </div>

              <div className="panel__row panel__row--secondary">
                <div className="btnRow">
                  <button
                    className={`btn ${repeatLine ? "btn--active" : ""}`}
                    onClick={() => setRepeatLine((v) => !v)}
                  >
                    Repeat sentence
                  </button>

                  <button className="btn" onClick={loopActiveSentence}>
                    Loop active sentence (A/B)
                  </button>

                  <button
                    className={`btn ${abLoop ? "btn--active" : ""}`}
                    onClick={() => setAbLoop((v) => !v)}
                  >
                    A/B loop: {abLoop ? "ON" : "OFF"}
                  </button>
                </div>

                <div className="abRow">
                  <label className="field">
                    <span>A</span>
                    <input
                      className="vt__input"
                      type="number"
                      step="0.25"
                      value={loopA}
                      onChange={(e) => setLoopA(Number(e.target.value))}
                    />
                  </label>
                  <label className="field">
                    <span>B</span>
                    <input
                      className="vt__input"
                      type="number"
                      step="0.25"
                      value={loopB}
                      onChange={(e) => setLoopB(Number(e.target.value))}
                    />
                  </label>
                </div>
              </div>

              <div className="progressBox">
                <div className="progressBox__top">
                  <span>Progress</span>
                  <strong>{progress}%</strong>
                </div>
                <div className="bar">
                  <div className="bar__fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          </section>

          {/* right: transcript */}
          <aside className="card">
            <div className="card__head">
              <div className="card__title">Transcript</div>
              <div className="muted">
                Click a line to jump. Current line is highlighted.
              </div>
            </div>

            <div className="transcript" ref={transcriptRef}>
              {lesson.lines.map((ln, i) => (
                <button
                  key={`${lesson.id}-${i}`}
                  className={`line ${i === activeIdx ? "line--active" : ""}`}
                  onClick={() => seekTo(ln.start)}
                  data-line-index={i}
                >
                  <div className="line__time">{formatTime(ln.start)}</div>
                  <div className="line__text">{ln.text}</div>
                </button>
              ))}
            </div>

            <div className="bottomTips">
              <div className="bottomTips__title">Tips</div>
              <ul>
                <li>Start at 0.9x speed, then move to 1.0x.</li>
                <li>Repeat 8 to 12 times per sentence.</li>
                <li>Use A/B loop to isolate hard parts.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}