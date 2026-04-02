// src/pages/Result.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { getBand } from "@/utils/helpers";
import { useAuthStore } from "@/features/auth/authStore";
import { loadTestHistory, clearTestHistory } from "@/utils/testHistoryStorage";
import "@/styles/globals.css";

/* ── Band config ── */
const BAND_CONFIG = {
  9:   { label: "Expert",        color: "#0d7c59", bg: "#edfaf5", border: "rgba(13,124,89,0.3)"   },
  8.5: { label: "Very Good",     color: "#0d7c59", bg: "#edfaf5", border: "rgba(13,124,89,0.3)"   },
  8:   { label: "Very Good",     color: "#0d7c59", bg: "#edfaf5", border: "rgba(13,124,89,0.3)"   },
  7.5: { label: "Good",          color: "#1e5dbf", bg: "#eff4ff", border: "rgba(30,93,191,0.25)"  },
  7:   { label: "Good",          color: "#1e5dbf", bg: "#eff4ff", border: "rgba(30,93,191,0.25)"  },
  6.5: { label: "Competent",     color: "#c9a227", bg: "#fdf6dc", border: "rgba(201,162,39,0.3)"  },
  6:   { label: "Competent",     color: "#c9a227", bg: "#fdf6dc", border: "rgba(201,162,39,0.3)"  },
  5.5: { label: "Modest",        color: "#a81011", bg: "#fff0f0", border: "rgba(168,16,17,0.25)"  },
  5:   { label: "Modest",        color: "#a81011", bg: "#fff0f0", border: "rgba(168,16,17,0.25)"  },
  4.5: { label: "Limited",       color: "#a81011", bg: "#fff0f0", border: "rgba(168,16,17,0.25)"  },
};

function getBandConfig(band) {
  return BAND_CONFIG[band] || BAND_CONFIG[4.5];
}

/* ══════════════════════════════════════════
   SINGLE RESULT CARD  (для истории)
══════════════════════════════════════════ */
function HistoryCard({ entry, index }) {
  const band   = entry.band || getBand(entry.score);
  const cfg    = getBandConfig(band);
  const pct    = entry.total > 0 ? Math.round((entry.score / entry.total) * 100) : 0;
  const date   = entry.date ? new Date(entry.date).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" }) : "—";

  return (
    <div style={{
      background: "#fff", border: "1px solid var(--border)",
      borderRadius: 14, padding: "18px 22px",
      boxShadow: "var(--shadow-sm)",
      display: "flex", alignItems: "center",
      gap: 16, flexWrap: "wrap",
      animation: "fadeUp 0.4s ease-out both",
      animationDelay: `${index * 0.06}s`,
    }}>

      {/* Index */}
      <div style={{
        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
        background: "var(--bg2)", border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.78rem", fontWeight: 700, color: "var(--text3)",
      }}>
        {index + 1}
      </div>

      {/* Test name + date */}
      <div style={{ flex: 1, minWidth: 120 }}>
        <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--navy)", marginBottom: 2 }}>
          {entry.testName || "IELTS Test"}
        </p>
        <p style={{ fontSize: "0.75rem", color: "var(--text3)" }}>
          {entry.skill ? `${entry.skill.charAt(0).toUpperCase() + entry.skill.slice(1)} · ` : ""}{date}
        </p>
      </div>

      {/* Progress bar mini */}
      <div style={{ flex: 1, minWidth: 100 }}>
        <div style={{ height: 6, background: "var(--bg2)", borderRadius: 999, overflow: "hidden", marginBottom: 4 }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}bb)`,
            borderRadius: 999,
          }} />
        </div>
        <p style={{ fontSize: "0.72rem", color: "var(--text3)" }}>
          {entry.score}/{entry.total || 40} correct
        </p>
      </div>

      {/* Band badge */}
      <div style={{
        background: cfg.bg, color: cfg.color,
        border: `1px solid ${cfg.border}`,
        borderRadius: 10, padding: "8px 18px",
        textAlign: "center", flexShrink: 0,
      }}>
        <p style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 2 }}>Band</p>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 800, lineHeight: 1 }}>{band}</p>
      </div>

    </div>
  );
}

/* ══════════════════════════════════════════
   STATS SUMMARY
══════════════════════════════════════════ */
function StatsSummary({ history }) {
  if (history.length === 0) return null;

  const bands    = history.map((h) => h.band || getBand(h.score));
  const avgBand  = (bands.reduce((a, b) => a + b, 0) / bands.length).toFixed(1);
  const bestBand = Math.max(...bands);
  const total    = history.length;

  const bandAbove7 = bands.filter((b) => b >= 7).length;
  const rate7plus  = Math.round((bandAbove7 / total) * 100);

  const stats = [
    { icon: "📊", label: "Tests Taken",  value: total },
    { icon: "📈", label: "Average Band", value: avgBand },
    { icon: "🏆", label: "Best Band",    value: bestBand },
    { icon: "🎯", label: "Band 7+ Rate", value: `${rate7plus}%` },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
      gap: 14, marginBottom: 32,
    }}>
      {stats.map((s) => (
        <div key={s.label} style={{
          background: "#fff", border: "1px solid var(--border)",
          borderRadius: 14, padding: "18px 20px",
          textAlign: "center", boxShadow: "var(--shadow-sm)",
          animation: "fadeUp 0.4s ease-out both",
        }}>
          <span style={{ fontSize: "1.5rem", marginBottom: 8, display: "block" }}>{s.icon}</span>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, color: "var(--navy)", lineHeight: 1, marginBottom: 4 }}>
            {s.value}
          </p>
          <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.2px", color: "var(--text3)" }}>
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   BAND SCALE VISUAL
══════════════════════════════════════════ */
function BandScale({ current }) {
  const bands = [4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9];

  return (
    <div style={{
      background: "#fff", border: "1px solid var(--border)",
      borderRadius: 14, padding: "20px 24px",
      boxShadow: "var(--shadow-sm)", marginBottom: 28,
    }}>
      <p style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "var(--text3)", marginBottom: 14 }}>
        IELTS Band Scale
      </p>
      <div style={{ display: "flex", gap: 4, alignItems: "flex-end" }}>
        {bands.map((b) => {
          const cfg      = getBandConfig(b);
          const isActive = b === current;
          const height   = 24 + (b - 4.5) * 8;

          return (
            <div key={b} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              {isActive && (
                <div style={{
                  fontSize: "0.6rem", fontWeight: 800, color: cfg.color,
                  background: cfg.bg, border: `1px solid ${cfg.border}`,
                  borderRadius: 4, padding: "2px 4px", whiteSpace: "nowrap",
                }}>
                  You
                </div>
              )}
              <div style={{
                width: "100%", height,
                background: isActive ? cfg.color : b < (current || 0) ? `${cfg.color}55` : "var(--bg2)",
                borderRadius: "4px 4px 0 0",
                border: isActive ? `2px solid ${cfg.color}` : "1px solid var(--border)",
                transition: "all 0.3s",
              }} />
              <span style={{
                fontSize: "0.6rem", fontWeight: isActive ? 800 : 500,
                color: isActive ? cfg.color : "var(--text3)",
              }}>
                {b}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   EMPTY STATE
══════════════════════════════════════════ */
function EmptyState({ onGoPractice }) {
  return (
    <div style={{
      textAlign: "center", padding: "80px 24px",
      background: "#fff", borderRadius: 20,
      border: "1px dashed var(--border2)",
    }}>
      <p style={{ fontSize: "3.5rem", marginBottom: 16 }}>📭</p>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", color: "var(--navy)", marginBottom: 10 }}>
        No results yet
      </h2>
      <p style={{ color: "var(--text2)", fontSize: "0.9rem", maxWidth: 360, margin: "0 auto 28px" }}>
        Complete your first test to see your score, band, and detailed breakdown here.
      </p>
      <button className="btn-primary" onClick={onGoPractice}>
        🚀 Start a Test
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN RESULTS PAGE
══════════════════════════════════════════ */
export default function Results() {
  const [, navigate] = useLocation();
  const user = useAuthStore((s) => s.user);
  const [history,  setHistory]  = useState([]);
  const [filter,   setFilter]   = useState("All");
  const [sortDesc, setSortDesc] = useState(true);

  useEffect(() => {
    const reload = () => setHistory(loadTestHistory(user));
    reload();
    const onUpdated = (e) => {
      const mine = (user?.email?.trim().toLowerCase() ?? null) === (e.detail?.email ?? null);
      if (mine) reload();
    };
    window.addEventListener("oxbridge-test-history-updated", onUpdated);
    return () => window.removeEventListener("oxbridge-test-history-updated", onUpdated);
  }, [user?.email]);

  const clearHistory = () => {
    if (!window.confirm("Clear all your test history?")) return;
    clearTestHistory(user);
    setHistory([]);
  };

  /* Filter + sort */
  const SKILLS = ["All", "Listening", "Reading", "Writing", "Speaking"];

  const visible = history
    .filter((h) => filter === "All" || (h.skill || "").toLowerCase() === filter.toLowerCase())
    .slice()
    .sort((a, b) => {
      const da = new Date(a.date), db = new Date(b.date);
      return sortDesc ? db - da : da - db;
    });

  /* Latest result for hero */
  const latest   = [...history].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  const latestBand = latest ? (latest.band || getBand(latest.score)) : null;
  const latestCfg  = latestBand ? getBandConfig(latestBand) : null;

  return (
    <div className="page-wrap">

      {/* ── Header ── */}
      <div style={{ marginBottom: 32 }}>
        <p style={{
          fontSize: "0.72rem", fontWeight: 700, letterSpacing: "2.5px",
          textTransform: "uppercase", color: "var(--crimson)", marginBottom: 10,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ display: "block", width: 20, height: 2, background: "var(--crimson)" }} />
          My Progress
        </p>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.8rem,4vw,2.6rem)",
          fontWeight: 800, color: "var(--navy)", lineHeight: 1.15, marginBottom: 8,
        }}>
          Test Results 📊
        </h1>
        <p style={{ color: "var(--text2)", fontSize: "0.95rem" }}>
          Track your IELTS progress and identify areas for improvement.
        </p>
      </div>

      {history.length === 0 ? (
        <EmptyState onGoPractice={() => navigate("/practice")} />
      ) : (
        <>
          {/* ── Latest result hero ── */}
          {latest && (
            <div style={{
              background: "linear-gradient(135deg, #0c1f4a, #1e293b)",
              borderRadius: 20, padding: "36px 40px",
              marginBottom: 28, display: "flex",
              alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: 24,
              position: "relative", overflow: "hidden",
              animation: "fadeUp 0.5s ease-out both",
            }}>
              {/* bg glow */}
              <div style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,16,17,0.2) 0%, transparent 70%)" }} />

              <div style={{ position: "relative", zIndex: 1 }}>
                <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
                  Latest Result
                </p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 800, color: "#fff", marginBottom: 6 }}>
                  {latest.testName || "IELTS Test"}
                </h2>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
                  {latest.skill ? `${latest.skill.charAt(0).toUpperCase() + latest.skill.slice(1)} · ` : ""}
                  {latest.date ? new Date(latest.date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : ""}
                </p>
              </div>

              <div style={{ display: "flex", gap: 20, alignItems: "center", position: "relative", zIndex: 1, flexWrap: "wrap" }}>
                {/* Score */}
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Score</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                    {latest.score}<span style={{ fontSize: "1rem", opacity: 0.5 }}>/{latest.total || 40}</span>
                  </p>
                </div>

                <div style={{ width: 1, height: 48, background: "rgba(255,255,255,0.1)" }} />

                {/* Band */}
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Band</p>
                  <p style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "2rem", fontWeight: 800, lineHeight: 1,
                    color: latestCfg?.color || "#fff",
                  }}>
                    {latestBand}
                  </p>
                </div>

                <div style={{ width: 1, height: 48, background: "rgba(255,255,255,0.1)" }} />

                {/* Level */}
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Level</p>
                  <p style={{ fontSize: "1rem", fontWeight: 700, color: latestCfg?.color || "#fff" }}>
                    {latestCfg?.label || "—"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Stats summary ── */}
          <StatsSummary history={history} />

          {/* ── Band scale ── */}
          {latestBand && <BandScale current={latestBand} />}

          {/* ── Toolbar ── */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", flexWrap: "wrap",
            gap: 12, marginBottom: 16,
          }}>
            {/* Skill filter */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {SKILLS.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  style={{
                    padding: "6px 14px", borderRadius: 999,
                    border: "1.5px solid var(--border)",
                    background: filter === s
                      ? "linear-gradient(135deg, var(--crimson), var(--crimson-light))"
                      : "#fff",
                    color: filter === s ? "#fff" : "var(--text2)",
                    fontSize: "0.8rem", fontWeight: 600,
                    cursor: "pointer", transition: "all 0.2s",
                    boxShadow: filter === s ? "var(--shadow-red)" : "none",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Sort + clear */}
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setSortDesc((p) => !p)}
                style={{
                  padding: "6px 14px", borderRadius: 8,
                  border: "1px solid var(--border)", background: "#fff",
                  color: "var(--text2)", fontSize: "0.78rem", fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {sortDesc ? "↓ Newest" : "↑ Oldest"}
              </button>
              <button
                onClick={clearHistory}
                style={{
                  padding: "6px 14px", borderRadius: 8,
                  border: "1.5px solid rgba(239,68,68,0.25)",
                  background: "#fff", color: "#dc2626",
                  fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
                }}
              >
                🗑️ Clear
              </button>
            </div>
          </div>

          {/* ── History list ── */}
          {visible.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text3)" }}>
              <p style={{ fontSize: "1.8rem", marginBottom: 8 }}>🔍</p>
              <p style={{ fontWeight: 600 }}>No results for "{filter}"</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36 }}>
              {visible.map((entry, i) => (
                <HistoryCard key={i} entry={entry} index={i} />
              ))}
            </div>
          )}

          {/* ── CTA ── */}
          <div style={{
            background: "linear-gradient(135deg, var(--navy3), var(--navy2))",
            borderRadius: 16, padding: "28px 32px",
            display: "flex", alignItems: "center",
            justifyContent: "space-between", flexWrap: "wrap", gap: 16,
          }}>
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                Ready for your next test?
              </p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>
                Consistent practice is the key to a higher band score.
              </p>
            </div>
            <button className="btn-primary" onClick={() => navigate("/practice")}>
              🚀 Practice Now
            </button>
          </div>
        </>
      )}

    </div>
  );
}
