import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/features/auth/authStore";
import "../styles/globals.css";

export default function Profile() {
  const { user, logout } = useAuthStore();
  const [, navigate] = useLocation();
  const [testHistory, setTestHistory] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    targetBand: 7.5,
  });

  // Load test history from localStorage
  useEffect(() => {
    if (user?.email) {
      const saved = localStorage.getItem(`test_history_${user.email}`);
      if (saved) {
        setTestHistory(JSON.parse(saved));
      }
      setFormData({
        displayName: user.displayName || "",
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
            Not Logged In
          </h2>
          <p
            style={{
              color: "#475569",
              fontSize: "0.95rem",
              marginBottom: "28px",
            }}
          >
            Please sign in to view your profile and track your progress.
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
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(168,16,17,0.28)";
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
    bestScore: testHistory.length > 0 ? Math.max(...testHistory.map((t) => t.score || 0)) : 0,
    avgBand:
      testHistory.length > 0
        ? (
            testHistory.reduce((sum, t) => sum + getBandScore(t.score || 0), 0) /
            testHistory.length
          ).toFixed(1)
        : 0,
  };

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
    // Implement profile save logic here
    setEditMode(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f9fafb 0%, #fff 100%)",
        padding: "40px 28px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header Section */}
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "40px",
            marginBottom: "32px",
            boxShadow: "0 2px 8px rgba(15,23,42,0.07)",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              marginBottom: "28px",
              flexWrap: "wrap",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, #a81011, #d42022)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "1.8rem",
                fontWeight: 800,
                boxShadow: "0 4px 16px rgba(168,16,17,0.3)",
              }}
            >
              {initials}
            </div>

            {/* User Info */}
            <div>
              <h1
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "#0c1f4a",
                  margin: "0 0 8px 0",
                }}
              >
                {user.displayName || "Student"}
              </h1>
              <p
                style={{
                  color: "#475569",
                  fontSize: "0.95rem",
                  margin: 0,
                }}
              >
                {user.provider === "google" ? "🔵 Google Account" : "📧 Email Account"}
              </p>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "0.85rem",
                  margin: "4px 0 0 0",
                }}
              >
                Member since {new Date(user.loginTime || Date.now()).toLocaleDateString()}
              </p>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setEditMode(!editMode)}
                style={{
                  padding: "10px 20px",
                  background: editMode ? "#fff5f5" : "#f4f6fb",
                  color: editMode ? "#dc2626" : "#0f172a",
                  border: `1.5px solid ${editMode ? "rgba(220,38,38,0.3)" : "#dde3ef"}`,
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontSize: "0.9rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = editMode ? "#fef2f2" : "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = editMode ? "#fff5f5" : "#f4f6fb";
                }}
              >
                {editMode ? "✕ Cancel" : "✏️ Edit"}
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: "10px 20px",
                  background: "#fff5f5",
                  color: "#dc2626",
                  border: "1.5px solid rgba(220,38,38,0.3)",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontSize: "0.9rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fef2f2";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff5f5";
                }}
              >
                🚪 Logout
              </button>
            </div>
          </div>

          {/* Edit Form */}
          {editMode && (
            <div
              style={{
                background: "#f9fafb",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "24px",
              }}
            >
              <div style={{ display: "grid", gap: "16px" }}>
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
                      transition: "border-color 0.2s",
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
                    }}
                  >
                    {[5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((band) => (
                      <option key={band} value={band}>
                        Band {band}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSaveProfile}
                  style={{
                    padding: "12px 24px",
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
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          {[
            { icon: "📚", label: "Tests Taken", value: stats.totalTests },
            { icon: "📊", label: "Average Score", value: `${stats.avgScore}/40` },
            { icon: "🏆", label: "Best Score", value: `${stats.bestScore}/40` },
            { icon: "⭐", label: "Average Band", value: stats.avgBand },
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(15,23,42,0.07)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <p style={{ fontSize: "2rem", margin: "0 0 12px 0" }}>
                {stat.icon}
              </p>
              <p
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  margin: "0 0 8px 0",
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  color: "#0c1f4a",
                  margin: 0,
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Test History Section */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 2px 8px rgba(15,23,42,0.07)",
          }}
        >
          <h2
            style={{
              fontSize: "1.3rem",
              fontWeight: 700,
              color: "#0c1f4a",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            📊 Test History
          </h2>

          {testHistory.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                background: "#f9fafb",
                borderRadius: "12px",
                border: "1px dashed #e2e8f0",
              }}
            >
              <p style={{ fontSize: "3rem", margin: "0 0 12px 0" }}>📝</p>
              <p
                style={{
                  color: "#475569",
                  fontSize: "0.95rem",
                  margin: "0",
                }}
              >
                No tests taken yet. Start practicing!
              </p>
              <button
                onClick={() => navigate("/practice")}
                style={{
                  marginTop: "16px",
                  padding: "10px 20px",
                  background: "linear-gradient(135deg, #a81011, #d42022)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.9rem",
                }}
              >
                Take a Test →
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
              {testHistory.map((test, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px",
                    background: "#f9fafb",
                    borderRadius: "10px",
                    border: "1px solid #e2e8f0",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f4f6fb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f9fafb";
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "#0f172a",
                        margin: "0 0 6px 0",
                      }}
                    >
                      Test #{testHistory.length - idx}
                    </p>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "#94a3b8",
                        margin: 0,
                      }}
                    >
                      {test.date ||
                        new Date(test.timestamp || Date.now()).toLocaleDateString()}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "20px",
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
                          fontSize: "0.85rem",
                          color: "#94a3b8",
                          margin: "4px 0 0 0",
                        }}
                      >
                        {(test.accuracy || 0).toFixed(1)}% accuracy
                      </p>
                    </div>

                    <div
                      style={{
                        padding: "8px 16px",
                        background: "linear-gradient(135deg, #a81011, #d42022)",
                        color: "#fff",
                        borderRadius: "8px",
                        fontWeight: 700,
                        textAlign: "center",
                        minWidth: "80px",
                      }}
                    >
                      <p style={{ fontSize: "0.85rem", margin: "0 0 4px 0" }}>
                        Band
                      </p>
                      <p style={{ fontSize: "1.2rem", margin: 0 }}>
                        {getBandScore(test.score).toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}