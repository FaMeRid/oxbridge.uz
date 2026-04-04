import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/features/auth/authStore";
import "../styles/globals.css";

// ════════════════════════════════════════
// ICONS
// ════════════════════════════════════════
const Icons = {
  Edit: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  LogOut: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Settings: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
    </svg>
  ),
  CheckCircle: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  Download: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  Calendar: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Trophy: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6 9V7a2 2 0 012-2h8a2 2 0 012 2v2M6 9a2 2 0 01-2 2h16a2 2 0 01-2-2M6 9h12v10a2 2 0 01-2 2H8a2 2 0 01-2-2V9z" />
    </svg>
  ),
  Target: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
  TrendingUp: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 17" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  AlertCircle: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Share2: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  MoreVertical: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  ),
};

// ════════════════════════════════════════
// PROFILE DATA
// ════════════════════════════════════════
const PROFILE_SECTIONS = [
  { id: "overview", label: "📊 Overview", icon: "📊" },
  { id: "stats", label: "📈 Statistics", icon: "📈" },
  { id: "history", label: "📝 Test History", icon: "📝" },
  { id: "achievements", label: "🏆 Achievements", icon: "🏆" },
  { id: "goals", label: "🎯 Goals", icon: "🎯" },
];

// ════════════════════════════════════════
// HELPER COMPONENTS
// ════════════════════════════════════════
function StatCard({ icon, label, value, trend, color = "#a81011" }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #e2e8f0",
        borderRadius: "14px",
        padding: "24px",
        textAlign: "center",
        boxShadow: "0 2px 8px rgba(15,23,42,0.07)",
        transition: "all 0.2s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(15,23,42,0.1)";
        e.currentTarget.style.borderColor = color;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(15,23,42,0.07)";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: `linear-gradient(90deg, ${color}, rgba(${color}, 0.3))`,
        }}
      />
      <p style={{ fontSize: "2.2rem", margin: "0 0 12px 0" }}>{icon}</p>
      <p
        style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "1px",
          margin: "0 0 8px 0",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: "2rem",
          fontWeight: 800,
          color: "#0c1f4a",
          margin: "0",
        }}
      >
        {value}
      </p>
      {trend && (
        <div
          style={{
            marginTop: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
            color: trend.positive ? "#22c55e" : "#ef4444",
            fontSize: "0.85rem",
            fontWeight: 600,
          }}
        >
          <Icons.TrendingUp size={16} />
          {trend.value} {trend.label}
        </div>
      )}
    </div>
  );
}

function AchievementBadge({ title, description, icon, unlocked, progress }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        background: unlocked
          ? "linear-gradient(135deg, rgba(168,16,17,0.1), rgba(201,162,39,0.1))"
          : "rgba(226,232,240,0.05)",
        border: `1.5px solid ${unlocked ? "rgba(168,16,17,0.2)" : "rgba(226,232,240,0.1)"}`,
        borderRadius: "12px",
        textAlign: "center",
        transition: "all 0.2s ease",
        opacity: unlocked ? 1 : 0.6,
      }}
      onMouseEnter={(e) => {
        if (unlocked) {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.borderColor = "rgba(168,16,17,0.4)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.borderColor = `${unlocked ? "rgba(168,16,17,0.2)" : "rgba(226,232,240,0.1)"}`;
      }}
    >
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "12px",
          background: unlocked
            ? "linear-gradient(135deg, #a81011, #d42022)"
            : "rgba(226,232,240,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.8rem",
          marginBottom: "12px",
          boxShadow: unlocked
            ? "0 4px 12px rgba(168,16,17,0.2)"
            : "none",
        }}
      >
        {icon}
      </div>
      <p
        style={{
          fontSize: "0.9rem",
          fontWeight: 700,
          color: "#0c1f4a",
          margin: "0 0 4px 0",
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontSize: "0.8rem",
          color: "#94a3b8",
          margin: 0,
        }}
      >
        {description}
      </p>
      {progress && (
        <div
          style={{
            marginTop: "8px",
            width: "100%",
            height: "4px",
            background: "rgba(226,232,240,0.2)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #a81011, #d42022)",
              width: `${progress}%`,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      )}
    </div>
  );
}

function TestHistoryItem({ test, index, totalTests, getBandScore }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px",
        background: expanded ? "#f4f6fb" : "#f9fafb",
        borderRadius: "10px",
        border: expanded ? "1.5px solid #a81011" : "1px solid #e2e8f0",
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}
      onClick={() => setExpanded(!expanded)}
      onMouseEnter={(e) => {
        if (!expanded) {
          e.currentTarget.style.background = "#f4f6fb";
          e.currentTarget.style.borderColor = "#dde3ef";
        }
      }}
      onMouseLeave={(e) => {
        if (!expanded) {
          e.currentTarget.style.background = "#f9fafb";
          e.currentTarget.style.borderColor = "#e2e8f0";
        }
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flex: 1,
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #a81011, #d42022)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: "0.95rem",
          }}
        >
          #{totalTests - index}
        </div>
        <div>
          <p
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "#0f172a",
              margin: "0 0 4px 0",
            }}
          >
            {test.name || `Test ${totalTests - index}`}
          </p>
          <p
            style={{
              fontSize: "0.8rem",
              color: "#94a3b8",
              margin: 0,
            }}
          >
            <Icons.Calendar size={12} style={{ display: "inline", marginRight: "4px" }} />
            {new Date(test.date || test.timestamp || Date.now()).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <div style={{ textAlign: "right" }}>
          <p
            style={{
              fontSize: "1.1rem",
              fontWeight: 800,
              color: "#0f172a",
              margin: 0,
            }}
          >
            {test.score}/40
          </p>
          <p
            style={{
              fontSize: "0.8rem",
              color: "#94a3b8",
              margin: "4px 0 0 0",
            }}
          >
            {Math.round((test.score / 40) * 100)}%
          </p>
        </div>

        <div
          style={{
            padding: "10px 16px",
            background: "linear-gradient(135deg, #a81011, #d42022)",
            color: "#fff",
            borderRadius: "8px",
            fontWeight: 700,
            textAlign: "center",
            minWidth: "80px",
          }}
        >
          <p style={{ fontSize: "0.8rem", margin: "0 0 4px 0" }}>Band</p>
          <p style={{ fontSize: "1.3rem", margin: 0 }}>
            {getBandScore(test.score).toFixed(1)}
          </p>
        </div>

        <div
          style={{
            color: "#94a3b8",
            transition: "transform 0.2s",
            transform: expanded ? "rotate(180deg)" : "rotate(0)",
          }}
        >
          <Icons.MoreVertical size={20} />
        </div>
      </div>

      {expanded && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "100%",
            marginTop: "8px",
            padding: "16px",
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "10px",
            zIndex: 10,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: "0 0 4px 0" }}>
                Accuracy
              </p>
              <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0c1f4a", margin: 0 }}>
                {(test.accuracy || 0).toFixed(1)}%
              </p>
            </div>
            <div>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: "0 0 4px 0" }}>
                Time Taken
              </p>
              <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0c1f4a", margin: 0 }}>
                {test.duration || "--"} min
              </p>
            </div>
            <div>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: "0 0 4px 0" }}>
                Section
              </p>
              <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#0c1f4a", margin: 0 }}>
                {test.section || "--"}
              </p>
            </div>
            <div>
              <p style={{ fontSize: "0.8rem", color: "#94a3b8", margin: "0 0 4px 0" }}>
                Status
              </p>
              <p
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "#22c55e",
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Icons.CheckCircle size={16} />
                Completed
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GoalCard({ goal, progress }) {
  return (
    <div
      style={{
        padding: "20px",
        background: "#fff",
        border: "1.5px solid #e2e8f0",
        borderRadius: "12px",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#a81011";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(168,16,17,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#e2e8f0";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "#0c1f4a",
              margin: "0 0 4px 0",
            }}
          >
            {goal.name}
          </p>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#94a3b8",
              margin: 0,
            }}
          >
            Target: Band {goal.target}
          </p>
        </div>
        <Icons.Target size={20} style={{ color: "#a81011" }} />
      </div>

      <div
        style={{
          height: "6px",
          background: "#f0f3f9",
          borderRadius: "3px",
          overflow: "hidden",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            height: "100%",
            background: `linear-gradient(90deg, #a81011, #d42022)`,
            width: `${progress}%`,
            transition: "width 0.5s ease",
          }}
        />
      </div>

      <p
        style={{
          fontSize: "0.8rem",
          color: "#94a3b8",
          margin: 0,
        }}
      >
        {progress}% Complete
      </p>
    </div>
  );
}

// ════════════════════════════════════════
// MAIN PROFILE COMPONENT
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

  // Load test history from localStorage
  useEffect(() => {
    if (user?.email) {
      const saved = localStorage.getItem(`test_history_${user.email}`);
      if (saved) {
        setTestHistory(JSON.parse(saved));
      }
      setFormData({
        displayName: user.displayName || "",
        email: user.email || "",
        phone: user.phone || "",
        targetBand: 7.5,
      });
    }
  }, [user]);

  // Redirect if not logged in
  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fdf0f0 0%, #f4f6fb 100%)",
          padding: "24px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            background: "#fff",
            padding: "60px 40px",
            borderRadius: "20px",
            maxWidth: "500px",
            boxShadow: "0 8px 32px rgba(15,23,42,0.12)",
          }}
        >
          <p style={{ fontSize: "3.5rem", marginBottom: "16px" }}>🔒</p>
          <h2
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "1.8rem",
              fontWeight: 800,
              color: "#0c1f4a",
              marginBottom: "12px",
            }}
          >
            Access Restricted
          </h2>
          <p
            style={{
              color: "#475569",
              fontSize: "0.95rem",
              marginBottom: "28px",
              lineHeight: 1.6,
            }}
          >
            Please sign in to view your profile, track your progress, and access personalized study recommendations.
          </p>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "14px 32px",
              background: "linear-gradient(135deg, #a81011, #d42022)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "0.95rem",
              boxShadow: "0 4px 12px rgba(168,16,17,0.28)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(168,16,17,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(168,16,17,0.28)";
            }}
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  // Calculate band score from raw score
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

  // Get user initials
  const initials = user.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user.email.charAt(0).toUpperCase();

  // Calculate statistics
  const stats = {
    totalTests: testHistory.length,
    avgScore:
      testHistory.length > 0
        ? Math.round(
            testHistory.reduce((sum, t) => sum + (t.score || 0), 0) /
              testHistory.length
          )
        : 0,
    bestScore:
      testHistory.length > 0
        ? Math.max(...testHistory.map((t) => t.score || 0))
        : 0,
    avgBand:
      testHistory.length > 0
        ? (
            testHistory.reduce((sum, t) => sum + getBandScore(t.score || 0), 0) /
            testHistory.length
          ).toFixed(1)
        : 0,
    streakDays: 7,
    levelProgress: 65,
  };

  const achievements = [
    { title: "First Test", description: "Take your first test", icon: "🚀", unlocked: testHistory.length > 0, progress: testHistory.length > 0 ? 100 : 0 },
    { title: "Century", description: "Score 30+ points", icon: "💯", unlocked: stats.bestScore >= 30, progress: Math.min((stats.bestScore / 30) * 100, 100) },
    { title: "Band 7+", description: "Achieve Band 7", icon: "⭐", unlocked: getBandScore(stats.bestScore) >= 7, progress: Math.min((getBandScore(stats.bestScore) / 7) * 100, 100) },
    { title: "Consistency", description: "7-day streak", icon: "🔥", unlocked: stats.streakDays >= 7, progress: Math.min((stats.streakDays / 7) * 100, 100) },
    { title: "Dedicated", description: "Take 10 tests", icon: "💪", unlocked: stats.totalTests >= 10, progress: Math.min((stats.totalTests / 10) * 100, 100) },
    { title: "Master", description: "Band 8+", icon: "👑", unlocked: getBandScore(stats.bestScore) >= 8, progress: Math.min((getBandScore(stats.bestScore) / 8) * 100, 100) },
  ];

  const goals = [
    { name: "IELTS Academic", target: 7.5, progress: 60 },
    { name: "Speaking Practice", target: 8, progress: 45 },
    { name: "Writing Improvement", target: 7, progress: 75 },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    setEditMode(false);
  };

  const downloadReport = () => {
    const report = {
      name: user.displayName,
      email: user.email,
      stats,
      testHistory,
      downloadedAt: new Date().toISOString(),
    };
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `profile-report-${user.email}.json`;
    link.click();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f9fafb 0%, #fff 100%)",
        padding: "40px 28px 80px",
      }}
    >
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .profile-animate {
          animation: slideUp 0.3s ease;
        }
      `}</style>

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Hero Section */}
        <div
          className="profile-animate"
          style={{
            background: "linear-gradient(135deg, #0c1f4a 0%, #1e3a8a 100%)",
            borderRadius: "20px",
            padding: "40px",
            marginBottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "28px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background decoration */}
          <div
            style={{
              position: "absolute",
              top: -60,
              right: -60,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(168,16,17,0.2), transparent)",
              pointerEvents: "none",
            }}
          />

          {/* Avatar */}
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #a81011, #d42022)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "2.2rem",
              fontWeight: 800,
              boxShadow: "0 8px 24px rgba(168,16,17,0.4)",
              flexShrink: 0,
              position: "relative",
              zIndex: 1,
              border: "3px solid rgba(255,255,255,0.2)",
            }}
          >
            {initials}
          </div>

          {/* User Info */}
          <div style={{ flex: 1, position: "relative", zIndex: 1 }}>
            <h1
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "2.2rem",
                fontWeight: 800,
                color: "#fff",
                margin: "0 0 8px 0",
              }}
            >
              {user.displayName || "Student"}
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: "0.95rem",
                margin: "0 0 8px 0",
              }}
            >
              {user.provider === "google"
                ? "🔵 Google Account"
                : "📧 Email Account"}
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "0.85rem",
                margin: 0,
              }}
            >
              Member since{" "}
              {new Date(user.loginTime || Date.now()).toLocaleDateString(
                "en-US",
                { year: "numeric", month: "long" }
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              position: "relative",
              zIndex: 1,
            }}
          >
            <button
              onClick={() => setEditMode(!editMode)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "11px 20px",
                background: editMode
                  ? "rgba(239,68,68,0.2)"
                  : "rgba(255,255,255,0.15)",
                color: editMode ? "#fee2e2" : "#fff",
                border: "1.5px solid",
                borderColor: editMode
                  ? "rgba(239,68,68,0.4)"
                  : "rgba(255,255,255,0.3)",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                fontSize: "0.9rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = editMode
                  ? "rgba(239,68,68,0.3)"
                  : "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = editMode
                  ? "rgba(239,68,68,0.2)"
                  : "rgba(255,255,255,0.15)";
              }}
            >
              <Icons.Edit size={16} />
              {editMode ? "Cancel" : "Edit"}
            </button>
            <button
              onClick={downloadReport}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "11px 20px",
                background: "rgba(255,255,255,0.15)",
                color: "#fff",
                border: "1.5px solid rgba(255,255,255,0.3)",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                fontSize: "0.9rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              }}
            >
              <Icons.Download size={16} />
              Report
            </button>
            <button
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "11px 20px",
                background: "rgba(220,38,38,0.2)",
                color: "#fee2e2",
                border: "1.5px solid rgba(220,38,38,0.4)",
                borderRadius: "8px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                fontSize: "0.9rem",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(220,38,38,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(220,38,38,0.2)";
              }}
            >
              <Icons.LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        {/* Edit Form */}
        {editMode && (
          <div
            className="profile-animate"
            style={{
              background: "#fff",
              border: "1.5px solid #e2e8f0",
              borderRadius: "16px",
              padding: "28px",
              marginBottom: "32px",
              boxShadow: "0 4px 12px rgba(168,16,17,0.1)",
            }}
          >
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#0c1f4a",
                marginBottom: "20px",
              }}
            >
              Edit Your Profile
            </h3>

            {saveSuccess && (
              <div
                style={{
                  padding: "12px 16px",
                  background: "rgba(16,185,129,0.1)",
                  border: "1px solid rgba(16,185,129,0.3)",
                  borderRadius: "8px",
                  color: "#059669",
                  fontSize: "0.9rem",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Icons.CheckCircle size={16} />
                Profile updated successfully!
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "20px",
                marginBottom: "20px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "#475569",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                  }}
                >
                  Display Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "1.5px solid #dde3ef",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    fontFamily: "Inter, sans-serif",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#a81011";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#dde3ef";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "#475569",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                  }}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "1.5px solid #dde3ef",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    fontFamily: "Inter, sans-serif",
                    boxSizing: "border-box",
                    background: "#f9fafb",
                    cursor: "not-allowed",
                    color: "#94a3b8",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "#475569",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                  }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+998 99 999 99 99"
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "1.5px solid #dde3ef",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    fontFamily: "Inter, sans-serif",
                    boxSizing: "border-box",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#a81011";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#dde3ef";
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "#475569",
                    marginBottom: "8px",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                  }}
                >
                  Target Band Score
                </label>
                <select
                  name="targetBand"
                  value={formData.targetBand}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    border: "1.5px solid #dde3ef",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    fontFamily: "Inter, sans-serif",
                    cursor: "pointer",
                    outline: "none",
                    transition: "all 0.2s",
                  }}
                >
                  {[5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((band) => (
                    <option key={band} value={band}>
                      Band {band}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSaveProfile}
              style={{
                padding: "12px 32px",
                background: "linear-gradient(135deg, #a81011, #d42022)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
                fontSize: "0.95rem",
                boxShadow: "0 4px 12px rgba(168,16,17,0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              ✓ Save Changes
            </button>
          </div>
        )}

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "32px",
            borderBottom: "2px solid #e2e8f0",
            overflowX: "auto",
            paddingBottom: "0",
          }}
        >
          {PROFILE_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              style={{
                padding: "14px 20px",
                background: "transparent",
                border: "none",
                borderBottom:
                  activeTab === section.id
                    ? "3px solid #a81011"
                    : "3px solid transparent",
                color:
                  activeTab === section.id ? "#a81011" : "#475569",
                fontWeight: activeTab === section.id ? 700 : 600,
                fontSize: "0.95rem",
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
                marginBottom: "-2px",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== section.id) {
                  e.currentTarget.style.color = "#0c1f4a";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== section.id) {
                  e.currentTarget.style.color = "#475569";
                }
              }}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="profile-animate">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "20px",
                  marginBottom: "32px",
                }}
              >
                <StatCard
                  icon="📚"
                  label="Tests Taken"
                  value={stats.totalTests}
                  trend={{ positive: true, value: "+2", label: "this week" }}
                />
                <StatCard
                  icon="📊"
                  label="Average Score"
                  value={`${stats.avgScore}/40`}
                  trend={{ positive: true, value: "+3", label: "improvement" }}
                />
                <StatCard
                  icon="🏆"
                  label="Best Score"
                  value={`${stats.bestScore}/40`}
                  color="#c9a227"
                />
                <StatCard
                  icon="⭐"
                  label="Average Band"
                  value={stats.avgBand}
                  color="#10b981"
                />
              </div>

              {/* Quick Tips */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(201,162,39,0.1), rgba(168,16,17,0.08))",
                  border: "1.5px solid rgba(201,162,39,0.2)",
                  borderRadius: "14px",
                  padding: "24px",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: "#0c1f4a",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  💡 Study Recommendations
                </h3>
                <div
                  style={{
                    display: "grid",
                    gap: "12px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#475569",
                      margin: 0,
                    }}
                  >
                    ✓ Your reading score is improving! Keep practicing daily.
                  </p>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#475569",
                      margin: 0,
                    }}
                  >
                    ✓ Focus on listening: You need 2 more points to reach your
                    target band.
                  </p>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#475569",
                      margin: 0,
                    }}
                  >
                    ✓ Next milestone: Band 7.5 - You're {(stats.levelProgress)}% there!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === "stats" && (
            <div className="profile-animate">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "20px",
                }}
              >
                {[
                  { label: "Tests Completed", value: stats.totalTests, icon: "📝" },
                  { label: "Average Accuracy", value: `${Math.round((stats.avgScore / 40) * 100)}%`, icon: "📊" },
                  { label: "Current Streak", value: `${stats.streakDays} days`, icon: "🔥" },
                  { label: "Level Progress", value: `${stats.levelProgress}%`, icon: "📈" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "#fff",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "20px",
                      textAlign: "center",
                    }}
                  >
                    <p style={{ fontSize: "2rem", margin: "0 0 12px 0" }}>
                      {item.icon}
                    </p>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        margin: "0 0 8px 0",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {item.label}
                    </p>
                    <p
                      style={{
                        fontSize: "2rem",
                        fontWeight: 800,
                        color: "#0c1f4a",
                        margin: 0,
                      }}
                    >
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Test History Tab */}
          {activeTab === "history" && (
            <div className="profile-animate">
              {testHistory.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 20px",
                    background: "#f9fafb",
                    borderRadius: "14px",
                    border: "2px dashed #e2e8f0",
                  }}
                >
                  <p style={{ fontSize: "3rem", margin: "0 0 16px 0" }}>
                    📝
                  </p>
                  <p
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "#0c1f4a",
                      marginBottom: "8px",
                    }}
                  >
                    No tests taken yet
                  </p>
                  <p
                    style={{
                      color: "#475569",
                      fontSize: "0.9rem",
                      marginBottom: "24px",
                    }}
                  >
                    Start practicing to see your progress here
                  </p>
                  <button
                    onClick={() => navigate("/practice")}
                    style={{
                      padding: "12px 28px",
                      background:
                        "linear-gradient(135deg, #a81011, #d42022)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: "0.95rem",
                    }}
                  >
                    Take a Test →
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
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

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div className="profile-animate">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "16px",
                }}
              >
                {achievements.map((achievement, idx) => (
                  <AchievementBadge
                    key={idx}
                    {...achievement}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === "goals" && (
            <div className="profile-animate">
              <div
                style={{
                  display: "grid",
                  gap: "16px",
                  marginBottom: "32px",
                }}
              >
                {goals.map((goal, idx) => (
                  <GoalCard key={idx} goal={goal} progress={goal.progress} />
                ))}
              </div>

              <div
                style={{
                  background: "#f9fafb",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#475569",
                  }}
                >
                  Want to set new goals?{" "}
                  <a
                    href="/settings"
                    style={{
                      color: "#a81011",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    Go to Settings
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}