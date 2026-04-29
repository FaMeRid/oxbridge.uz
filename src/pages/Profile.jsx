import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/features/auth/authStore";
import "../styles/globals.css";
import "../styles/Profile.css";

// ════════════════════════════════════════
// ICONS  (без изменений)
// ════════════════════════════════════════
const Icons = {
  Edit: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  LogOut: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  CheckCircle: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  Download: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Calendar: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Target: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
  TrendingUp: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 17" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  MoreVertical: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  ),
};

const PROFILE_SECTIONS = [
  { id: "overview",     label: "📊 Overview" },
  { id: "stats",        label: "📈 Statistics" },
  { id: "history",      label: "📝 Test History" },
  { id: "achievements", label: "🏆 Achievements" },
  { id: "goals",        label: "🎯 Goals" },
];

// ════════════════════════════════════════
// HELPER COMPONENTS
// ════════════════════════════════════════
function StatCard({ icon, label, value, trend, color = "#a81011" }) {
  return (
    <div className="stat-card" style={{ "--card-color": color }}>
      <div className="stat-card__top" />
      <p className="stat-card__icon">{icon}</p>
      <p className="stat-card__label">{label}</p>
      <p className="stat-card__value">{value}</p>
      {trend && (
        <div className={`stat-card__trend ${trend.positive ? "stat-card__trend--up" : "stat-card__trend--down"}`}>
          <Icons.TrendingUp size={16} />
          {trend.value} {trend.label}
        </div>
      )}
    </div>
  );
}

function AchievementBadge({ title, description, icon, unlocked, progress }) {
  return (
    <div className={`achievement ${unlocked ? "achievement--unlocked" : ""}`}>
      <div className="achievement__icon">{icon}</div>
      <p className="achievement__title">{title}</p>
      <p className="achievement__desc">{description}</p>
      {progress != null && (
        <div className="achievement__progress">
          <div className="achievement__progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

function TestHistoryItem({ test, index, totalTests, getBandScore }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`history-item ${expanded ? "history-item--expanded" : ""}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="history-item__left">
        <div className="history-item__num">#{totalTests - index}</div>
        <div>
          <p className="history-item__name">
            {test.name || `Test ${totalTests - index}`}
          </p>
          <p className="history-item__date">
            <Icons.Calendar size={12} />{" "}
            {new Date(test.date || test.timestamp || Date.now()).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="history-item__right">
        <div style={{ textAlign: "right" }}>
          <p className="history-item__score-label">{test.score}/40</p>
          <p className="history-item__percent">
            {Math.round((test.score / 40) * 100)}%
          </p>
        </div>

        <div className="history-item__band">
          <p className="history-item__band-label">Band</p>
          <p className="history-item__band-value">
            {getBandScore(test.score).toFixed(1)}
          </p>
        </div>

        <div className={`history-item__chevron ${expanded ? "history-item__chevron--open" : ""}`}>
          <Icons.MoreVertical size={20} />
        </div>
      </div>

      {expanded && (
        <div className="history-item__details" onClick={(e) => e.stopPropagation()}>
          <div>
            <p className="history-item__details-label">Accuracy</p>
            <p className="history-item__details-value">{(test.accuracy || 0).toFixed(1)}%</p>
          </div>
          <div>
            <p className="history-item__details-label">Time Taken</p>
            <p className="history-item__details-value">{test.duration || "--"} min</p>
          </div>
          <div>
            <p className="history-item__details-label">Section</p>
            <p className="history-item__details-value">{test.section || "--"}</p>
          </div>
          <div>
            <p className="history-item__details-label">Status</p>
            <p className="history-item__status">
              <Icons.CheckCircle size={16} /> Completed
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function GoalCard({ goal, progress }) {
  return (
    <div className="goal-card">
      <div className="goal-card__header">
        <div>
          <p className="goal-card__title">{goal.name}</p>
          <p className="goal-card__target">Target: Band {goal.target}</p>
        </div>
        <Icons.Target size={20} style={{ color: "#a81011" }} />
      </div>

      <div className="goal-card__bar">
        <div className="goal-card__bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <p className="goal-card__percent">{progress}% Complete</p>
    </div>
  );
}

// ════════════════════════════════════════
// MAIN PROFILE
// ════════════════════════════════════════
export default function Profile() {
  const { user, logout } = useAuthStore();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [testHistory, setTestHistory] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    phone: "",
    targetBand: 7.5,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (user?.email) {
      const saved = localStorage.getItem(`test_history_${user.email}`);
      if (saved) setTestHistory(JSON.parse(saved));
      setFormData({
        displayName: user.displayName || "",
        email: user.email || "",
        phone: user.phone || "",
        targetBand: 7.5,
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="access-restricted">
        <div className="access-restricted__card">
          <p className="access-restricted__emoji">🔒</p>
          <h2 className="access-restricted__title">Access Restricted</h2>
          <p className="access-restricted__text">
            Please sign in to view your profile, track your progress, and access personalized study recommendations.
          </p>
          <button className="btn-primary" onClick={() => navigate("/login")}>
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  const getBandScore = (score) => {
    if (score >= 39) return 9.0;
    if (score >= 37) return 8.5;
    if (score >= 35) return 8.0;
    if (score >= 32) return 7.5;
    if (score >= 30) return 7.0;
    if (score >= 26) return 6.5;
    if (score >= 23) return 6.0;
    return 5.5;
  };

  const initials = user.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user.email.charAt(0).toUpperCase();

  const stats = {
    totalTests: testHistory.length,
    avgScore: testHistory.length > 0
      ? Math.round(testHistory.reduce((sum, t) => sum + (t.score || 0), 0) / testHistory.length)
      : 0,
    bestScore: testHistory.length > 0 ? Math.max(...testHistory.map((t) => t.score || 0)) : 0,
    avgBand: testHistory.length > 0
      ? (testHistory.reduce((sum, t) => sum + getBandScore(t.score || 0), 0) / testHistory.length).toFixed(1)
      : 0,
    streakDays: 7,
    levelProgress: 65,
  };

  const achievements = [
    { title: "First Test",  description: "Take your first test", icon: "🚀", unlocked: testHistory.length > 0, progress: testHistory.length > 0 ? 100 : 0 },
    { title: "Century",     description: "Score 30+ points",     icon: "💯", unlocked: stats.bestScore >= 30, progress: Math.min((stats.bestScore / 30) * 100, 100) },
    { title: "Band 7+",     description: "Achieve Band 7",        icon: "⭐", unlocked: getBandScore(stats.bestScore) >= 7, progress: Math.min((getBandScore(stats.bestScore) / 7) * 100, 100) },
    { title: "Consistency", description: "7-day streak",          icon: "🔥", unlocked: stats.streakDays >= 7, progress: Math.min((stats.streakDays / 7) * 100, 100) },
    { title: "Dedicated",   description: "Take 10 tests",         icon: "💪", unlocked: stats.totalTests >= 10, progress: Math.min((stats.totalTests / 10) * 100, 100) },
    { title: "Master",      description: "Band 8+",               icon: "👑", unlocked: getBandScore(stats.bestScore) >= 8, progress: Math.min((getBandScore(stats.bestScore) / 8) * 100, 100) },
  ];

  const goals = [
    { name: "IELTS Academic",       target: 7.5, progress: 60 },
    { name: "Speaking Practice",    target: 8,   progress: 45 },
    { name: "Writing Improvement",  target: 7,   progress: 75 },
  ];

  const handleLogout = () => { logout(); navigate("/login"); };
  const handleInputChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSaveProfile = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setEditMode(false);
  };
  const downloadReport = () => {
    const report = {
      name: user.displayName, email: user.email, stats, testHistory,
      downloadedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `profile-report-${user.email}.json`;
    link.click();
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* ── HERO ── */}
        <div className="profile-hero profile-animate">
          <div className="profile-hero__decoration" />

          <div className="profile-avatar">{initials}</div>

          <div className="profile-info">
            <h1 className="profile-info__name">{user.displayName || "Student"}</h1>
            <p className="profile-info__provider">
              {user.provider === "google" ? "🔵 Google Account" : "📧 Email Account"}
            </p>
            <p className="profile-info__since">
              Member since{" "}
              {new Date(user.loginTime || Date.now()).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
            </p>
          </div>

          <div className="profile-actions">
            <button
              className={`profile-btn ${editMode ? "profile-btn--edit-active" : ""}`}
              onClick={() => setEditMode(!editMode)}
            >
              <Icons.Edit size={16} />
              {editMode ? "Cancel" : "Edit"}
            </button>
            <button className="profile-btn" onClick={downloadReport}>
              <Icons.Download size={16} />
              Report
            </button>
            <button className="profile-btn profile-btn--logout" onClick={handleLogout}>
              <Icons.LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* ── EDIT FORM ── */}
        {editMode && (
          <div className="edit-form profile-animate">
            <h3 className="edit-form__title">Edit Your Profile</h3>

            {saveSuccess && (
              <div className="edit-form__success">
                <Icons.CheckCircle size={16} />
                Profile updated successfully!
              </div>
            )}

            <div className="edit-form__grid">
              <div>
                <label className="edit-form__label">Display Name</label>
                <input
                  className="edit-form__input"
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="edit-form__label">Email</label>
                <input
                  className="edit-form__input"
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                />
              </div>
              <div>
                <label className="edit-form__label">Phone Number</label>
                <input
                  className="edit-form__input"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+998 99 999 99 99"
                />
              </div>
              <div>
                <label className="edit-form__label">Target Band Score</label>
                <select
                  className="edit-form__input"
                  name="targetBand"
                  value={formData.targetBand}
                  onChange={handleInputChange}
                >
                  {[5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((band) => (
                    <option key={band} value={band}>Band {band}</option>
                  ))}
                </select>
              </div>
            </div>

            <button className="edit-form__save" onClick={handleSaveProfile}>
              ✓ Save Changes
            </button>
          </div>
        )}

        {/* ── TABS ── */}
        <div className="profile-tabs">
          {PROFILE_SECTIONS.map((s) => (
            <button
              key={s.id}
              className={`profile-tab ${activeTab === s.id ? "profile-tab--active" : ""}`}
              onClick={() => setActiveTab(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* ── TAB CONTENT ── */}
        <div>
          {activeTab === "overview" && (
            <div className="profile-animate">
              <div className="stat-grid">
                <StatCard icon="📚" label="Tests Taken"  value={stats.totalTests}      trend={{ positive: true, value: "+2", label: "this week" }} />
                <StatCard icon="📊" label="Average Score" value={`${stats.avgScore}/40`} trend={{ positive: true, value: "+3", label: "improvement" }} />
                <StatCard icon="🏆" label="Best Score"    value={`${stats.bestScore}/40`} color="#c9a227" />
                <StatCard icon="⭐" label="Average Band"  value={stats.avgBand}          color="#10b981" />
              </div>

              <div className="tips-card">
                <h3 className="tips-card__title">💡 Study Recommendations</h3>
                <div className="tips-card__list">
                  <p>✓ Your reading score is improving! Keep practicing daily.</p>
                  <p>✓ Focus on listening: You need 2 more points to reach your target band.</p>
                  <p>✓ Next milestone: Band 7.5 — You're {stats.levelProgress}% there!</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="profile-animate">
              <div className="stats-grid">
                {[
                  { label: "Tests Completed",  value: stats.totalTests, icon: "📝" },
                  { label: "Average Accuracy", value: `${Math.round((stats.avgScore / 40) * 100)}%`, icon: "📊" },
                  { label: "Current Streak",   value: `${stats.streakDays} days`, icon: "🔥" },
                  { label: "Level Progress",   value: `${stats.levelProgress}%`, icon: "📈" },
                ].map((item, idx) => (
                  <div key={idx} className="stat-mini">
                    <p className="stat-mini__icon">{item.icon}</p>
                    <p className="stat-mini__label">{item.label}</p>
                    <p className="stat-mini__value">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="profile-animate">
              {testHistory.length === 0 ? (
                <div className="history-empty">
                  <p className="history-empty__emoji">📝</p>
                  <p className="history-empty__title">No tests taken yet</p>
                  <p className="history-empty__text">Start practicing to see your progress here</p>
                  <button className="btn-primary" onClick={() => navigate("/practice")}>
                    Take a Test →
                  </button>
                </div>
              ) : (
                <div className="history-list">
                  {testHistory.map((test, idx) => (
                    <div key={idx} style={{ position: "relative" }}>
                      <TestHistoryItem
                        test={test}
                        index={idx}
                        totalTests={testHistory.length}
                        getBandScore={getBandScore}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="profile-animate">
              <div className="achievements-grid">
                {achievements.map((a, idx) => (
                  <AchievementBadge key={idx} {...a} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "goals" && (
            <div className="profile-animate">
              <div className="goals-grid">
                {goals.map((g, idx) => (
                  <GoalCard key={idx} goal={g} progress={g.progress} />
                ))}
              </div>

              <div className="goals-footer">
                <p>
                  Want to set new goals?{" "}
                  <a href="/settings">Go to Settings</a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}