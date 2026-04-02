// src/pages/Home.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/features/auth/useAuth";
import { getBand } from "@/utils/helpers";
import { loadTestHistory } from "@/utils/testHistoryStorage";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import "@/styles/dashboard.css";
import "@/styles/globals.css";

/* ── Skill config ── */
const SKILLS_CFG = {
  Listening: { icon: "🎧", color: "#c9a227" },
  Reading:   { icon: "📖", color: "#0d7c59" },
  Writing:   { icon: "✍️", color: "#1e5dbf" },
  Speaking:  { icon: "🗣️", color: "#ff6b6b" },
};

const RECENT_COLORS = ["#c9a227", "#0d7c59", "#1e5dbf", "#a81011", "#7c3aed"];

/* ── helpers ── */
function relativeDate(iso) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const days  = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7)  return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function calcStreak(history) {
  if (!history.length) return 0;
  const days = [...new Set(
    history.map((h) => new Date(h.date).toDateString())
  )].sort((a, b) => new Date(b) - new Date(a));

  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  for (const d of days) {
    const day = new Date(d);
    const diff = Math.round((cursor - day) / 86400000);
    if (diff <= 1) { streak++; cursor = day; }
    else break;
  }
  return streak;
}

/* ── Chart Tooltip ── */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0c1f4a", border: "1px solid rgba(201,162,39,0.4)",
      borderRadius: 10, padding: "10px 16px",
    }}>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 18, fontWeight: 800, color: "#e8c84e", fontFamily: "'Playfair Display', serif" }}>
        Band {payload[0].value}
      </p>
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ icon, title, value, sub, highlight, delay }) {
  return (
    <div
      className={`stat-card${highlight ? " highlight" : ""}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <span className="icon">{icon}</span>
      <h4 className="stat-title">{title}</h4>
      <p className="stat-value">{value}</p>
      <p className="stat-sub">{sub}</p>
    </div>
  );
}

/* ── Skill Card ── */
function SkillCard({ skill, value, isActive, onClick, animate }) {
  const cfg = SKILLS_CFG[skill];
  const pct = value ? `${((value / 9) * 100).toFixed(1)}%` : "0%";

  return (
    <div className={`skill-card${isActive ? " active" : ""}`} onClick={onClick}>
      <div className="skill-header">
        <div className="skill-info">
          <div className="skill-icon-wrap">{cfg.icon}</div>
          <h3>{skill}</h3>
        </div>
        <span className="skill-score">{value ?? "—"}</span>
      </div>
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className={`progress-fill${animate ? " animate" : ""}`}
            style={{ "--target-width": pct }}
          />
        </div>
      </div>
      <div className="band-score">
        <span>Band <strong>{value ?? "—"}</strong> / 9.0</span>
        <span className="skill-hint">View chart →</span>
      </div>
    </div>
  );
}

/* ── Recent Card ── */
function RecentCard({ name, band, date, color }) {
  return (
    <div className="recent-card">
      <div className="recent-dot" style={{ background: color }} />
      <div className="recent-info">
        <h4>{name}</h4>
        <p>{date}</p>
      </div>
      <div className="score-badge">Band {band}</div>
    </div>
  );
}

/* ── Progress Chart ── */
function ProgressChart({ data, skill }) {
  const color = SKILLS_CFG[skill]?.color || "#a81011";

  if (!data || data.length === 0) {
    return (
      <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
        <p style={{ fontSize: "2rem" }}>📈</p>
        <p style={{ color: "var(--text3)", fontSize: "0.9rem" }}>
          Complete tests to see your progress chart
        </p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${skill}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#dde3ef" />
        <XAxis dataKey="day" tick={{ fill: "#8494b0", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis domain={[4, 9]} tick={{ fill: "#8494b0", fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(12,31,74,0.1)", strokeWidth: 1 }} />
        <Area
          type="monotone" dataKey="score"
          stroke={color} strokeWidth={3}
          fill={`url(#grad-${skill})`}
          dot={{ r: 5, fill: "#fff", stroke: color, strokeWidth: 2.5 }}
          activeDot={{ r: 7, fill: color, stroke: "#fff", strokeWidth: 2 }}
          isAnimationActive animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ── No tests CTA ── */
function NoTestsCTA({ navigate }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #0c1f4a, #1e293b)",
      borderRadius: 20, padding: "40px 36px",
      textAlign: "center", marginBottom: 40,
    }}>
      <p style={{ fontSize: "3rem", marginBottom: 16 }}>🎯</p>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", fontWeight: 800, color: "#fff", marginBottom: 10 }}>
        You haven't taken any tests yet
      </h2>
      <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", marginBottom: 24, maxWidth: 400, margin: "0 auto 24px" }}>
        Start your first IELTS practice test to see your band score, skill breakdown, and progress charts here.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="btn-primary" onClick={() => navigate("/practice")}>
          🚀 Start Practice
        </button>
        <button className="btn-secondary" style={{ background: "transparent", color: "#fff", borderColor: "rgba(255,255,255,0.2)" }}
          onClick={() => navigate("/jointest")}>
          🎯 Join with Code
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN HOME PAGE
══════════════════════════════════════════ */
export default function Home() {
  const { user }   = useAuth();
  const [, navigate] = useLocation();

  const [selectedSkill, setSelectedSkill] = useState("Listening");
  const [animateBars,   setAnimateBars]   = useState(false);
  const [history,       setHistory]       = useState([]);

  /* История тестов привязана к email аккаунта (без входа — отдельный гостевой набор) */
  useEffect(() => {
    const reload = () => setHistory(loadTestHistory(user));
    reload();
    const t = setTimeout(() => setAnimateBars(true), 400);
    const onUpdated = (e) => {
      const mine = (user?.email?.trim().toLowerCase() ?? null) === (e.detail?.email ?? null);
      if (mine) reload();
    };
    window.addEventListener("oxbridge-test-history-updated", onUpdated);
    return () => {
      clearTimeout(t);
      window.removeEventListener("oxbridge-test-history-updated", onUpdated);
    };
  }, [user?.email]);

  /* ── Считаем реальную статистику ── */
  const stats = useMemo(() => {
    if (!history.length) return null;

    const bands       = history.map((h) => h.band || getBand(h.score));
    const avgBand     = parseFloat((bands.reduce((a, b) => a + b, 0) / bands.length).toFixed(1));
    const bestBand    = Math.max(...bands);
    const streak      = calcStreak(history);

    // band по скиллам — берём последний результат каждого скилла
    const skillBands = {};
    for (const skill of ["listening", "reading", "writing", "speaking"]) {
      const entries = history.filter((h) => (h.skill || "").toLowerCase() === skill);
      if (entries.length) {
        const last = entries[entries.length - 1];
        const key  = skill.charAt(0).toUpperCase() + skill.slice(1);
        skillBands[key] = last.band || getBand(last.score);
      }
    }

    return { avgBand, bestBand, streak, skillBands, total: history.length };
  }, [history]);

  /* ── Данные для графика — последние 7 результатов по скиллу ── */
  const chartData = useMemo(() => {
    const result = {};
    for (const skillKey of Object.keys(SKILLS_CFG)) {
      const skill   = skillKey.toLowerCase();
      const entries = history
        .filter((h) => (h.skill || "").toLowerCase() === skill)
        .slice(-7);

      if (entries.length) {
        result[skillKey] = entries.map((h, i) => ({
          day:   relativeDate(h.date).replace(" days ago", "d").replace("Yesterday", "Yest"),
          score: h.band || getBand(h.score),
        }));
      }
    }
    return result;
  }, [history]);

  /* ── Recent activity — последние 5 тестов ── */
  const recentItems = useMemo(() =>
    [...history]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map((h) => ({
        name: h.testName || `${h.skill ? h.skill.charAt(0).toUpperCase() + h.skill.slice(1) : "IELTS"} Test`,
        band: h.band || getBand(h.score),
        date: relativeDate(h.date),
      })),
    [history]
  );

  /* ── Stat cards ── */
  const targetScore = user?.targetBand || 8.0;

  const statCards = stats ? [
    { icon: "📊", title: "Total Tests",   value: stats.total,            sub: "Completed",        delay: 0 },
    { icon: "📈", title: "Average Band",  value: stats.avgBand,          sub: "Overall",          delay: 0.07 },
    { icon: "🏆", title: "Best Band",     value: stats.bestBand,         sub: "Personal record",  delay: 0.14 },
    { icon: "🎯", title: "Target",        value: `Band ${targetScore}`,  sub: "Your goal",        delay: 0.21, highlight: true },
    { icon: "🔥", title: "Day Streak",    value: `${stats.streak}d`,     sub: "Keep going!",      delay: 0.28 },
    { icon: "📚", title: "Skills Tested", value: Object.keys(stats.skillBands).length, sub: "Out of 4", delay: 0.35 },
  ] : [];

  /* ── Skill bands для карточек — если нет данных показываем 0 ── */
  const skillBands = stats?.skillBands || {};

  const displayName = user?.displayName?.split(" ")[0] || "Student";

  return (
    <div className="dashboard-page">

      {/* ── Welcome ── */}
      <div className="welcome-section">
        <div>
          <p className="welcome-eyebrow">Student Dashboard</p>
          <h1>
            Welcome back, <span className="name">{displayName}</span>
          </h1>
          {stats ? (
            <p style={{ marginTop: 8, color: "var(--text2)" }}>
              {stats.bestBand >= targetScore
                ? "🎉 You've reached your target band! Keep it up."
                : `You're ${(targetScore - stats.bestBand).toFixed(1)} band away from your target. Keep going!`}
            </p>
          ) : (
            <p style={{ marginTop: 8, color: "var(--text2)" }}>
              Start your first test to track your progress.
            </p>
          )}
        </div>
        <div className="target-pill">
          <span style={{ fontSize: "1.8rem" }}>🎯</span>
          <div>
            <p className="target-pill-label">Target Score</p>
            <p className="target-pill-val">Band {targetScore}</p>
          </div>
        </div>
      </div>

      {/* ── No tests state ── */}
      {!stats && <NoTestsCTA navigate={navigate} />}

      {/* ── Stats grid ── */}
      {stats && (
        <>
          <div className="section-hd">
            <h2>Overview</h2>
            <span className="section-tag">All Time</span>
          </div>
          <div className="stats-grid">
            {statCards.map((s) => <StatCard key={s.title} {...s} />)}
          </div>
        </>
      )}

      {/* ── Skill Performance ── */}
      <div className="skills-section">
        <div className="section-hd">
          <h2>Skill Performance</h2>
          <span className="section-tag">
            {stats ? "Click to see chart" : "No data yet"}
          </span>
        </div>
        <div className="skills-grid">
          {Object.keys(SKILLS_CFG).map((skill) => (
            <SkillCard
              key={skill}
              skill={skill}
              value={skillBands[skill] ?? null}
              isActive={selectedSkill === skill}
              onClick={() => setSelectedSkill(skill)}
              animate={animateBars}
            />
          ))}
        </div>
      </div>

      {/* ── Recent Activity ── */}
      {recentItems.length > 0 && (
        <div className="recent-section">
          <div className="section-hd">
            <h2>Recent Activity</h2>
            <button
              onClick={() => navigate("/results")}
              style={{ background: "none", border: "none", color: "var(--crimson)", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}
            >
              View all →
            </button>
          </div>
          <div className="recent-grid">
            {recentItems.map((item, i) => (
              <RecentCard key={i} {...item} color={RECENT_COLORS[i % RECENT_COLORS.length]} />
            ))}
          </div>
        </div>
      )}

      {/* ── Quick Actions (если нет тестов) ── */}
      {!stats && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
          {[
            { icon: "🎧", label: "Listening Test",  path: "/practice" },
            { icon: "📖", label: "Reading Test",    path: "/practice" },
            { icon: "🎯", label: "Join with Code",  path: "/jointest" },
            { icon: "🛠️", label: "Study Tools",     path: "/tools"    },
          ].map((a) => (
            <button
              key={a.label}
              className="btn-secondary"
              onClick={() => navigate(a.path)}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              {a.icon} {a.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Progress Chart ── */}
      <div className="chart-section">
        <div className="chart-header">
          <span className="chart-title">Progress — {selectedSkill}</span>
          <div className="chart-tabs">
            {Object.keys(SKILLS_CFG).map((sk) => (
              <button
                key={sk}
                className={`chart-tab${selectedSkill === sk ? " active" : ""}`}
                onClick={() => setSelectedSkill(sk)}
              >
                {SKILLS_CFG[sk].icon} {sk}
              </button>
            ))}
          </div>
        </div>
        <ProgressChart data={chartData[selectedSkill]} skill={selectedSkill} />
      </div>

    </div>
  );
}