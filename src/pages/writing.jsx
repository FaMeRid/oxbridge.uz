// src/pages/Writing.jsx
import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import { useRoute } from "wouter";

// ==================== ФОРМАТИРОВАНИЕ ВРЕМЕНИ ====================
function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${String(sec).padStart(2, "0")}`;
}

// ==================== ЛЕНИВЫЕ ГРАФИКИ ====================
const BarChartInternet = lazy(() => import("@/components/charts/BarChartInternet"));
const LineChartCO2 = lazy(() => import("@/components/charts/LineChartCO2"));
const ProcessDiagramRecycling = lazy(() => import("@/components/charts/ProcessDiagramRecycling"));
const MapTown = lazy(() => import("@/components/charts/MapTown"));
const MixedCharts = lazy(() => import("@/components/charts/MixedCharts"));
const BarChartDegrees = lazy(() => import("@/components/charts/BarChartDegrees"));
const TwoChartsSpending = lazy(() => import("@/components/charts/TwoChartsSpending"));

const CHART_BY_ID = {
  "t1-1": BarChartInternet,
  "t1-2": LineChartCO2,
  "t1-3": ProcessDiagramRecycling,
  "map-town": MapTown,
  "mixed-employment": MixedCharts,
  "bar-degrees": BarChartDegrees,
  "two-charts-spending": TwoChartsSpending,
};

const CHART_CONTEXT = {
  "t1-1": `Bar chart — Daily Internet Use by Age Group, UK 2020: 16-24:99%, 25-34:98%, 35-44:96%, 45-54:92%, 55-64:83%, 65-74:64%, 75+:32%. Key trend: near-universal among young adults; drops sharply in 65+.`,
  "t1-2": `Line graph — CO2 Emissions per Capita (tonnes), 1990-2020: USA: 19.5→14.2, China: 2.1→7.9, UK: 9.8→4.8, India: 0.7→1.9. Key: USA highest but declining, China dramatic rise.`,
  "t1-3": `Process diagram — Paper Recycling, 8 stages: 1. Collection → 2. Sorting → 3. Shredding & cleaning → 4. Pulping → 5. Bleaching & de-inking → 6. Pressing & drying → 7. Rolling → 8. New products.`,
  "map-town": `Maps of a town in 1970 and 2020. Key changes: new housing, road expansion, demolition of industrial zone, creation of park.`,
  "mixed-employment": `Bar chart: employment in 5 sectors (2000 vs 2020). Line graph: GDP growth. Service sector growth correlates with GDP increase.`,
  "bar-degrees": `Bar chart — percentage of men and women who completed university degrees in six subjects in 2019. Key: female-dominated subjects: Education (78%), Psychology (72%); male-dominated: Engineering (85%), Computing (76%); balanced: Business (52% female, 48% male).`,
  "two-charts-spending": `Two charts — household expenditure in 1980 vs 2020. Categories: Housing (1980: 25%, 2020: 32%), Food (1980: 20%, 2020: 14%), Transport (1980: 12%, 2020: 18%), Leisure (1980: 8%, 2020: 14%), Healthcare (1980: 5%, 2020: 10%). Key changes: housing and leisure rose significantly; food spending fell.`,
};

// ==================== ДИНАМИЧЕСКИЙ ИМПОРТ ОЦЕНЩИКА ====================
const loadEvaluator = () => import("@/utils/evaluateWritingOffline");

// ==================== РАЗРЕШЕНИЕ testId ====================
// Поддерживает оба варианта:
//   - URL /writing/2  (если в роутере описано "/writing/:testId")
//   - sessionStorage.current_session  (что пишет Practice.jsx)
// При отсутствии того и другого — дефолт 1.
function resolveTestId(routeParam) {
  if (routeParam) {
    const n = parseInt(routeParam, 10);
    if (!Number.isNaN(n) && n > 0) return n;
  }
  try {
    const raw = sessionStorage.getItem("current_session");
    if (raw) {
      const s = JSON.parse(raw);
      if (s && s.skill === "writing" && s.testId) {
        const n = parseInt(s.testId, 10);
        if (!Number.isNaN(n) && n > 0) return n;
      }
    }
  } catch {
    /* ignore */
  }
  return 1;
}

// ==================== КОМПОНЕНТЫ ИНТЕРФЕЙСА ====================
function BandRing({ score, size = 80 }) {
  const pct = ((score - 4) / 5) * 100;
  const r = size / 2 - 7;
  const c = 2 * Math.PI * r;
  const color = score >= 7.5 ? "#0d7c59" : score >= 6.5 ? "#c9a227" : "#a81011";
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={5} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - Math.max(0, Math.min(100, pct)) / 100)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dashoffset 1s ease 0.2s" }}
      />
      <text
        x={size / 2}
        y={size / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontSize: size > 65 ? 16 : 12, fontWeight: 800, fill: color, fontFamily: "Georgia, serif" }}>
        {score?.toFixed(1)}
      </text>
    </svg>
  );
}

function FeedbackPanel({ feedback, essay, onClose }) {
  const [visible, setVisible] = useState(false);
  const [tab, setTab] = useState("scores");
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);
  const close = () => {
    setVisible(false);
    setTimeout(() => onClose?.(), 320);
  };

  const criteriaList = feedback.criteria ? Object.values(feedback.criteria) : [];
  const overall = feedback.overall ?? 6;
  const bandLabel = overall >= 7.5 ? "Excellent" : overall >= 6.5 ? "Good" : overall >= 5.5 ? "Competent" : "Developing";
  const TABS = [
    ["scores", "Scores"],
    ["feedback", "Feedback"],
    ["phrases", "Upgrade"],
    ["deep", "Deep Dive"],
  ];

  return (
    <div
      onClick={close}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(8,16,40,0.68)",
        zIndex: 1000,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        backdropFilter: "blur(6px)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 840,
          background: "#fff",
          borderRadius: "24px 24px 0 0",
          maxHeight: "92vh",
          overflowY: "auto",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.45s cubic-bezier(0.34,1.3,0.64,1)",
          boxShadow: "0 -16px 60px rgba(0,0,0,0.25)",
        }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 0" }}>
          <div style={{ width: 36, height: 4, background: "#e2e8f0", borderRadius: 99 }} />
        </div>

        <div
          style={{
            background: "linear-gradient(135deg,#0c1f4a 0%,#1a3468 55%,#a81011 100%)",
            margin: "12px 16px 0",
            borderRadius: 16,
            padding: "22px 24px",
            position: "relative",
            overflow: "hidden",
          }}>
          <div
            style={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.035)",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: "0.66rem",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.42)",
                  marginBottom: 8,
                }}>
                IELTS Band Analyser · Free
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 8 }}>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "2.2rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>
                  Band {overall.toFixed(1)}
                </h2>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    padding: "3px 12px",
                    borderRadius: 99,
                    border: "1px solid currentColor",
                    background: overall >= 7 ? "rgba(16,185,129,0.2)" : overall >= 6 ? "rgba(245,158,11,0.2)" : "rgba(168,16,17,0.2)",
                    color: overall >= 7 ? "#6ee7b7" : overall >= 6 ? "#fcd34d" : "#fca5a5",
                  }}>
                  {bandLabel}
                </span>
              </div>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.65, maxWidth: 460, marginBottom: 14 }}>
                {feedback.examinerNote}
              </p>
              <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                {criteriaList.map((c) => {
                  const col = c.score >= 7.5 ? "#6ee7b7" : c.score >= 6.5 ? "#fcd34d" : "#fca5a5";
                  return (
                    <div key={c.label} style={{ cursor: "pointer" }} onClick={() => setTab("scores")}>
                      <p
                        style={{
                          fontSize: "0.58rem",
                          color: "rgba(255,255,255,0.4)",
                          textTransform: "uppercase",
                          letterSpacing: "0.8px",
                          marginBottom: 2,
                        }}>
                        {c.label?.split("&")[0]?.split("/")[0]?.trim()}
                      </p>
                      <p style={{ fontSize: "1rem", fontWeight: 800, color: col, fontFamily: "Georgia, serif" }}>{c.score?.toFixed(1)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <BandRing score={overall} size={90} />
          </div>
        </div>

        <div style={{ display: "flex", margin: "14px 16px 0", borderBottom: "1px solid #f1f5f9" }}>
          {TABS.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                padding: "10px 18px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: tab === id ? "#0c1f4a" : "#94a3b8",
                borderBottom: `2px solid ${tab === id ? "#a81011" : "transparent"}`,
                marginBottom: -1,
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}>
              {label}
            </button>
          ))}
          <button
            onClick={close}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              fontSize: "1.1rem",
              padding: "10px 16px",
            }}>
            ✕
          </button>
        </div>

        <div style={{ padding: "20px 16px 44px" }}>
          {tab === "scores" && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
                {criteriaList.map((c) => (
                  <div
                    key={c.label}
                    style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 8px", textAlign: "center", border: "1px solid #f1f5f9" }}>
                    <BandRing score={c.score} size={64} />
                    <p style={{ fontSize: "0.62rem", fontWeight: 700, color: "#64748b", marginTop: 6, lineHeight: 1.3 }}>{c.label}</p>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {criteriaList.map((c) => {
                  const col = c.score >= 7.5 ? "#0d7c59" : c.score >= 6.5 ? "#c9a227" : "#a81011";
                  const bg = c.score >= 7.5 ? "#f0fdf4" : c.score >= 6.5 ? "#fefce8" : "#fff7f7";
                  return (
                    <div key={c.label} style={{ background: bg, borderRadius: 12, padding: "16px 18px", border: `1px solid ${col}22` }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1e293b", marginBottom: 3 }}>{c.label}</p>
                          <p style={{ fontSize: "0.78rem", color: "#475569", lineHeight: 1.5, marginBottom: c.detail ? 8 : 0 }}>{c.comment}</p>
                          {c.detail && <p style={{ fontSize: "0.76rem", color: "#64748b", lineHeight: 1.6, fontStyle: "italic" }}>{c.detail}</p>}
                        </div>
                        <span style={{ fontSize: "1.2rem", fontWeight: 800, color: col, fontFamily: "Georgia, serif", flexShrink: 0, marginLeft: 16 }}>
                          {c.score?.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 16px", border: "1px solid #f1f5f9" }}>
                <p
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: 10,
                  }}>
                  Your position on the IELTS scale
                </p>
                <div style={{ display: "flex", gap: 3 }}>
                  {[4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((b) => {
                    const active = Math.abs(b - overall) < 0.26;
                    const col = b >= 7.5 ? "#0d7c59" : b >= 6.0 ? "#c9a227" : "#a81011";
                    return (
                      <div
                        key={b}
                        style={{
                          flex: 1,
                          height: active ? 28 : 18,
                          background: active ? col : "#e2e8f0",
                          borderRadius: 4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          alignSelf: "flex-end",
                          transition: "all 0.3s",
                        }}>
                        {active && <span style={{ fontSize: "0.6rem", fontWeight: 800, color: "#fff" }}>{b}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {tab === "feedback" && (
            <div>
              <div
                style={{ background: "#f8fafc", borderRadius: 12, padding: "16px 18px", marginBottom: 14, border: "1px solid #f1f5f9" }}>
                <p
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: "#94a3b8",
                    marginBottom: 10,
                  }}>
                  Your essay
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: 1.9,
                    color: "#1e293b",
                    fontFamily: "Georgia, serif",
                    whiteSpace: "pre-wrap",
                  }}>
                  {essay}
                </p>
              </div>
              <div style={{ background: "#f0fdf4", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(13,124,89,0.15)", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      background: "#0d7c59",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    <span style={{ color: "#fff", fontSize: "12px" }}>✓</span>
                  </div>
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#0d7c59" }}>
                    What you did well
                  </p>
                </div>
                {(feedback.strengths || []).map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "rgba(13,124,89,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 1,
                      }}>
                      <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#0d7c59" }}>{i + 1}</span>
                    </div>
                    <p style={{ fontSize: "0.83rem", color: "#166534", lineHeight: 1.6 }}>{s}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fef9ec", borderRadius: 12, padding: "16px 18px", border: "1px solid rgba(201,162,39,0.15)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 8,
                      background: "#c9a227",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                    <span style={{ color: "#fff", fontSize: "12px" }}>↑</span>
                  </div>
                  <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "#c9a227" }}>
                    Priority improvements
                  </p>
                </div>
                {(feedback.improvements || []).map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "rgba(201,162,39,0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 1,
                      }}>
                      <span style={{ fontSize: "0.65rem", fontWeight: 800, color: "#c9a227" }}>{i + 1}</span>
                    </div>
                    <p style={{ fontSize: "0.83rem", color: "#92400e", lineHeight: 1.6 }}>{s}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === "phrases" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <p style={{ fontSize: "0.84rem", color: "#64748b", lineHeight: 1.6 }}>
                The examiner identified a specific phrase from your essay and rewrote it at Band 7–8 level.
              </p>
              {feedback.phraseUpgrade && (
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f1f5f9", overflow: "hidden" }}>
                  <div style={{ background: "#f8fafc", padding: "10px 16px", borderBottom: "1px solid #f1f5f9" }}>
                    <p
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        color: "#64748b",
                      }}>
                      Phrase upgrade from your essay
                    </p>
                  </div>
                  <div style={{ padding: "18px" }}>
                    <div style={{ marginBottom: 12 }}>
                      <p
                        style={{
                          fontSize: "0.66rem",
                          fontWeight: 700,
                          color: "#a81011",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: 6,
                        }}>
                        You wrote
                      </p>
                      <p
                        style={{
                          fontSize: "0.92rem",
                          color: "#374151",
                          fontStyle: "italic",
                          background: "#fef2f2",
                          padding: "12px 14px",
                          borderRadius: 8,
                          borderLeft: "3px solid #a81011",
                          lineHeight: 1.6,
                        }}>
                        "{feedback.phraseUpgrade.original}"
                      </p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <polyline points="19 12 12 19 5 12" />
                      </svg>
                    </div>
                    <div style={{ marginBottom: feedback.phraseUpgrade.why ? 12 : 0 }}>
                      <p
                        style={{
                          fontSize: "0.66rem",
                          fontWeight: 700,
                          color: "#0d7c59",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: 6,
                        }}>
                        Band 7–8 version
                      </p>
                      <p
                        style={{
                          fontSize: "0.92rem",
                          color: "#166534",
                          fontStyle: "italic",
                          background: "#f0fdf4",
                          padding: "12px 14px",
                          borderRadius: 8,
                          borderLeft: "3px solid #0d7c59",
                          lineHeight: 1.6,
                        }}>
                        "{feedback.phraseUpgrade.improved}"
                      </p>
                    </div>
                    {feedback.phraseUpgrade.why && (
                      <div style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 14px" }}>
                        <p style={{ fontSize: "0.78rem", color: "#475569", lineHeight: 1.5 }}>
                          <span style={{ fontWeight: 700, color: "#0c1f4a" }}>Why: </span>
                          {feedback.phraseUpgrade.why}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {tab === "deep" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {feedback.bandJustification && (
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f1f5f9", overflow: "hidden" }}>
                  <div style={{ background: "#f8fafc", padding: "10px 16px", borderBottom: "1px solid #f1f5f9" }}>
                    <p
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        color: "#64748b",
                      }}>
                      Why Band {overall.toFixed(1)} and not higher
                    </p>
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <p style={{ fontSize: "0.84rem", color: "#374151", lineHeight: 1.7 }}>{feedback.bandJustification}</p>
                  </div>
                </div>
              )}
              {feedback.missingElements?.length > 0 && (
                <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f1f5f9", overflow: "hidden" }}>
                  <div style={{ background: "#f8fafc", padding: "10px 16px", borderBottom: "1px solid #f1f5f9" }}>
                    <p
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        color: "#64748b",
                      }}>
                      Missing or underdeveloped elements
                    </p>
                  </div>
                  <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                    {feedback.missingElements.map((el, i) => (
                      <div key={i} style={{ display: "flex", gap: 10 }}>
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: "50%",
                            background: "#fef2f2",
                            border: "1px solid #fca5a5",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}>
                          <span style={{ fontSize: "0.65rem", fontWeight: 700, color: "#a81011" }}>{i + 1}</span>
                        </div>
                        <p style={{ fontSize: "0.83rem", color: "#374151", lineHeight: 1.6 }}>{el}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ background: "linear-gradient(135deg,#0c1f4a,#1e3a6e)", borderRadius: 14, padding: "20px" }}>
                <p
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    color: "rgba(255,255,255,0.5)",
                    marginBottom: 10,
                  }}>
                  To reach Band {Math.min(9, overall + 0.5).toFixed(1)}
                </p>
                {(feedback.improvements || []).slice(0, 3).map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 8 }}>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}>
                      <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.65rem", fontWeight: 800 }}>{i + 1}</span>
                    </div>
                    <p style={{ fontSize: "0.83rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>{tip}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #f1f5f9", overflow: "hidden" }}>
                <div style={{ background: "#f8fafc", padding: "10px 16px", borderBottom: "1px solid #f1f5f9" }}>
                  <p
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      color: "#64748b",
                    }}>
                    IELTS official descriptors — Task Achievement
                  </p>
                </div>
                {[
                  [9, "Fully addresses all requirements. Response is fully developed with relevant, extended and supported ideas."],
                  [7, "Addresses all requirements. Presents, extends and supports main ideas, though may over-generalise."],
                  [6, "Addresses the requirements. Ideas are relevant but may not be elaborated enough."],
                  [5, "The purpose is not always clear. Ideas are limited and not always relevant to the task."],
                ].map(([b, desc]) => {
                  const cur = overall >= b - 0.5 && overall < b + 0.5;
                  return (
                    <div
                      key={b}
                      style={{
                        display: "flex",
                        gap: 12,
                        padding: "10px 16px",
                        borderBottom: "0.5px solid #f8fafc",
                        background: cur ? "#fffbeb" : "transparent",
                      }}>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 800,
                          color: b >= 7 ? "#0d7c59" : b >= 6 ? "#c9a227" : "#a81011",
                          minWidth: 20,
                        }}>
                        {b}
                      </span>
                      <p
                        style={{
                          fontSize: "0.76rem",
                          color: cur ? "#92400e" : "#64748b",
                          lineHeight: 1.5,
                          fontWeight: cur ? 600 : 400,
                        }}>
                        {desc}
                        {cur ? " ← you are here" : ""}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AnalyzingOverlay() {
  const [dots, setDots] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d + 1) % 5), 350);
    return () => clearInterval(t);
  }, []);
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(8,16,40,0.72)",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
      }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: "36px 48px", textAlign: "center", maxWidth: 360 }}>
        <div style={{ marginBottom: 20, display: "flex", gap: 6, justifyContent: "center" }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: i <= dots ? "#a81011" : "#e2e8f0",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>
        <h3 style={{ fontFamily: "Georgia, serif", fontSize: "1.3rem", fontWeight: 800, color: "#0c1f4a", marginBottom: 8 }}>
          Analysing your essay
        </h3>
        <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: 1.65 }}>
          Reading every sentence, checking data accuracy, vocabulary range, grammar structures, and coherence. This takes 1–2 seconds.
        </p>
        <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 12 }}>Offline IELTS Band Analyser</p>
      </div>
    </div>
  );
}

const TOTAL_TIME = 60 * 60; // 60 минут

// ==================== ОСНОВНОЙ КОМПОНЕНТ ====================
export default function Writing() {
  const [, params] = useRoute("/writing/:testId");
  const testId = resolveTestId(params?.testId);

  const [testMeta, setTestMeta] = useState(null);
  const [task1List, setTask1List] = useState([]);
  const [task2List, setTask2List] = useState([]);
  const [selectedTask1Idx, setSelectedTask1Idx] = useState(0);
  const [selectedTask2Idx, setSelectedTask2Idx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTask, setActiveTask] = useState(1);
  const [task1Text, setTask1Text] = useState("");
  const [task2Text, setTask2Text] = useState("");
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const timerRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [feedbackTask, setFeedbackTask] = useState(1);
  const [aiError, setAiError] = useState("");

  // Ключи для автосохранения чернового эссе по тесту
  const draftKey1 = `writing_draft_test${testId}_task1`;
  const draftKey2 = `writing_draft_test${testId}_task2`;

  // Загрузка JSON по testId, нормализация и подгрузка черновиков
  useEffect(() => {
    let cancelled = false;
    const loadTest = async () => {
      setLoading(true);
      setError(null);
      try {
        const module = await import(`@/data/test/writing/test-${testId}.json`);
        if (cancelled) return;
        const data = module.default;

        let t1List = [];
        if (Array.isArray(data.task1)) t1List = data.task1;
        else if (data.task1 && typeof data.task1 === "object") t1List = [data.task1];
        else throw new Error("task1 missing or invalid");

        let t2List = [];
        if (Array.isArray(data.task2)) t2List = data.task2;
        else if (data.task2 && typeof data.task2 === "object") t2List = [data.task2];
        else throw new Error("task2 missing or invalid");

        setTask1List(t1List);
        setTask2List(t2List);
        setSelectedTask1Idx(0);
        setSelectedTask2Idx(0);
        setTestMeta({
          level: data.level || `Test ${testId}`,
          band: data.band || "N/A",
          color: data.color || "#0c1f4a",
          bg: data.bg || "#f8fafc",
          border: data.border || "#e2e8f0",
        });

        // Восстановим черновики из localStorage, если есть
        try {
          const d1 = localStorage.getItem(draftKey1) || "";
          const d2 = localStorage.getItem(draftKey2) || "";
          setTask1Text(d1);
          setTask2Text(d2);
        } catch {
          /* ignore */
        }
      } catch (err) {
        console.error("Load test error:", err);
        if (!cancelled) {
          setError(
            `Test ${testId} not found or invalid. Make sure the file src/data/test/writing/test-${testId}.json exists and is valid JSON.`
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadTest();
    return () => {
      cancelled = true;
    };
  }, [testId]);

  // Автосохранение черновиков (debounced ~ через useEffect)
  useEffect(() => {
    if (loading || error) return;
    try {
      localStorage.setItem(draftKey1, task1Text);
    } catch {
      /* ignore */
    }
  }, [task1Text, loading, error, draftKey1]);

  useEffect(() => {
    if (loading || error) return;
    try {
      localStorage.setItem(draftKey2, task2Text);
    } catch {
      /* ignore */
    }
  }, [task2Text, loading, error, draftKey2]);

  // Таймер
  useEffect(() => {
    if (loading || error) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [loading, error]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Текущие выбранные задания
  const currentTask1 = task1List[selectedTask1Idx];
  const currentTask2 = task2List[selectedTask2Idx];
  const currentPrompt = activeTask === 1 ? currentTask1 : currentTask2;
  const currentText = activeTask === 1 ? task1Text : task2Text;
  const setCurrentText = activeTask === 1 ? setTask1Text : setTask2Text;
  const wordCount = currentText.trim().split(/\s+/).filter(Boolean).length;
  const minWords = currentPrompt?.minWords ?? (activeTask === 1 ? 150 : 250);
  const wordPct = Math.min(100, (wordCount / minWords) * 100);
  const ChartComponent = activeTask === 1 && currentTask1?.chartId ? CHART_BY_ID[currentTask1.chartId] : null;
  const timePct = (timeLeft / TOTAL_TIME) * 100;
  const timeColor = timeLeft < 300 ? "#a81011" : timeLeft < 900 ? "#c9a227" : "#0d7c59";

  const submitForFeedback = async (taskNum) => {
    const text = taskNum === 1 ? task1Text : task2Text;
    const promptObj = taskNum === 1 ? currentTask1 : currentTask2;
    if (!text.trim() || text.trim().split(/\s+/).filter(Boolean).length < 30) {
      setAiError("Write at least 30 words before requesting feedback.");
      return;
    }
    setAiError("");
    setIsAnalyzing(true);
    setFeedbackTask(taskNum);
    try {
      const chartId = taskNum === 1 ? currentTask1?.chartId : null;
      const ctx = taskNum === 1 && chartId ? CHART_CONTEXT[chartId] || "" : "";
      const { evaluateWritingOffline } = await loadEvaluator();
      const result = evaluateWritingOffline(text, taskNum, promptObj, ctx);
      setFeedback(result);
    } catch (err) {
      console.error(err);
      setAiError(`Error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const finishTest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    submitForFeedback(activeTask);
  };

  const handleTask1Change = (idx) => {
    if (task1Text.trim() && !window.confirm("Changing the task will erase your current answer. Continue?")) return;
    setSelectedTask1Idx(idx);
    setTask1Text("");
    try {
      localStorage.removeItem(draftKey1);
    } catch {
      /* ignore */
    }
  };
  const handleTask2Change = (idx) => {
    if (task2Text.trim() && !window.confirm("Changing the task will erase your current answer. Continue?")) return;
    setSelectedTask2Idx(idx);
    setTask2Text("");
    try {
      localStorage.removeItem(draftKey2);
    } catch {
      /* ignore */
    }
  };

  // Состояния UI верхнего уровня
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 50, fontFamily: "'DM Sans', system-ui, sans-serif", color: "#64748b" }}>
        Loading test {testId}…
      </div>
    );
  }
  if (error) {
    return (
      <div
        style={{
          maxWidth: 520,
          margin: "60px auto",
          padding: 28,
          textAlign: "center",
          fontFamily: "'DM Sans', system-ui, sans-serif",
          background: "#fff7f7",
          border: "1px solid rgba(168,16,17,0.25)",
          borderRadius: 16,
          color: "#a81011",
        }}>
        <p style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: 10 }}>Test {testId} unavailable</p>
        <p style={{ fontSize: "0.88rem", color: "#7f1d1d", lineHeight: 1.6 }}>{error}</p>
      </div>
    );
  }
  if (!testMeta || !currentTask1 || !currentTask2) return null;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 20px 80px", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Верхняя панель */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fff",
          border: "1.5px solid #e2e8f0",
          borderRadius: 14,
          padding: "12px 18px",
          marginBottom: 16,
          position: "sticky",
          top: 8,
          zIndex: 20,
          boxShadow: "0 4px 14px rgba(0,0,0,0.04)",
        }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1,
              padding: "4px 10px",
              borderRadius: 99,
              background: testMeta.bg,
              color: testMeta.color,
              border: `1px solid ${testMeta.border}`,
            }}>
            {testMeta.level} · {testMeta.band}
          </span>
          {[1, 2].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTask(t)}
              style={{
                padding: "8px 16px",
                fontSize: "0.82rem",
                fontWeight: 700,
                background: activeTask === t ? "#0c1f4a" : "#f1f5f9",
                color: activeTask === t ? "#fff" : "#64748b",
                border: "none",
                borderRadius: 9,
                cursor: "pointer",
              }}>
              Task {t}
              <span style={{ marginLeft: 8, fontSize: "0.7rem", opacity: 0.7 }}>
                {(t === 1 ? task1Text : task2Text).trim().split(/\s+/).filter(Boolean).length}w
              </span>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 120, height: 6, background: "#f1f5f9", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${timePct}%`, height: "100%", background: timeColor, transition: "width 1s linear" }} />
          </div>
          <span style={{ fontFamily: "monospace", fontSize: "1.1rem", fontWeight: 700, color: timeColor, minWidth: 56 }}>
            {formatTime(timeLeft)}
          </span>
          <button
            onClick={finishTest}
            style={{
              padding: "8px 14px",
              fontSize: "0.8rem",
              fontWeight: 700,
              background: "#0c1f4a",
              color: "#fff",
              border: "none",
              borderRadius: 9,
              cursor: "pointer",
            }}>
            Finish & Feedback
          </button>
        </div>
      </div>

      {timeLeft === 0 && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid rgba(168,16,17,0.3)",
            color: "#a81011",
            padding: "10px 16px",
            borderRadius: 10,
            marginBottom: 14,
            fontSize: "0.85rem",
            fontWeight: 700,
          }}>
          Time's up! You can still submit each task for feedback.
        </div>
      )}
      {aiError && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid rgba(168,16,17,0.2)",
            color: "#a81011",
            padding: "10px 16px",
            borderRadius: 10,
            marginBottom: 14,
            fontSize: "0.82rem",
          }}>
          {aiError}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 18 }}>
        {/* Левая колонка – задание */}
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: 1,
                padding: "3px 10px",
                borderRadius: 99,
                background: activeTask === 1 ? "#eff4ff" : "#edfaf5",
                color: activeTask === 1 ? "#1e5dbf" : "#0d7c59",
              }}>
              Task {activeTask}
            </span>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: testMeta.bg, color: testMeta.color }}>
                {testMeta.level}
              </span>
              <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                ≥{minWords} words · ~{currentPrompt.sampleBands?.time || (activeTask === 1 ? "20 min" : "40 min")}
              </span>
            </div>
          </div>

          {/* Выбор варианта задания, если их несколько */}
          {activeTask === 1 && task1List.length > 1 && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: 4 }}>Choose variant:</label>
              <select
                value={selectedTask1Idx}
                onChange={(e) => handleTask1Change(parseInt(e.target.value, 10))}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: "0.85rem", background: "#fff" }}>
                {task1List.map((t, idx) => (
                  <option key={`${t.id || "t1"}-${idx}`} value={idx}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          )}
          {activeTask === 2 && task2List.length > 1 && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748b", display: "block", marginBottom: 4 }}>Choose variant:</label>
              <select
                value={selectedTask2Idx}
                onChange={(e) => handleTask2Change(parseInt(e.target.value, 10))}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: "0.85rem", background: "#fff" }}>
                {task2List.map((t, idx) => (
                  <option key={`${t.id || "t2"}-${idx}`} value={idx}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.15rem", color: "#0c1f4a", marginBottom: 10 }}>{currentPrompt.title}</h2>
          <p style={{ fontSize: "0.92rem", color: "#374151", lineHeight: 1.7, marginBottom: 14 }}>
            {activeTask === 1 ? currentPrompt.description : `"${currentPrompt.question}"`}
          </p>
          {activeTask === 1 && ChartComponent && (
            <div style={{ background: "#f8fafc", padding: 12, borderRadius: 12, border: "1px solid #f1f5f9", marginBottom: 16 }}>
              <Suspense fallback={<div style={{ padding: 20, textAlign: "center" }}>Loading chart…</div>}>
                <ChartComponent />
              </Suspense>
            </div>
          )}
          {activeTask === 1 && currentTask1?.chartId && !ChartComponent && (
            <div
              style={{
                background: "#fef9ec",
                border: "1px solid rgba(201,162,39,0.25)",
                borderRadius: 10,
                padding: "10px 14px",
                fontSize: "0.78rem",
                color: "#92400e",
                marginBottom: 16,
              }}>
              Chart "{currentTask1.chartId}" is not registered in CHART_BY_ID.
            </div>
          )}
          <div style={{ background: "#f8fafc", borderRadius: 12, padding: 14, border: "1px solid #f1f5f9", marginBottom: 12 }}>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>
              Recommended structure
            </p>
            {currentPrompt.structure?.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                <div
                  style={{
                    minWidth: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#0c1f4a,#a81011)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    flexShrink: 0,
                  }}>
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
            <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#c9a227", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
              Key tips
            </p>
            {currentPrompt.tips?.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                <span style={{ color: "#c9a227", fontWeight: 700 }}>·</span>
                <p style={{ fontSize: "0.78rem", color: "#92400e", lineHeight: 1.5 }}>{t}</p>
              </div>
            ))}
          </div>
          {activeTask === 2 && currentPrompt.keyPhrases && (
            <div style={{ background: "#f0fdf4", borderRadius: 12, padding: 14, border: "1px solid rgba(13,124,89,0.15)", marginTop: 10 }}>
              <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#0d7c59", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
                Useful phrases
              </p>
              {currentPrompt.keyPhrases.map((ph, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    borderRadius: 8,
                    padding: "5px 10px",
                    marginBottom: 5,
                    fontSize: "0.78rem",
                    color: "#166534",
                    fontStyle: "italic",
                    border: "1px solid rgba(13,124,89,0.1)",
                  }}>
                  {ph}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Правая колонка – поле ввода */}
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
            onChange={(e) => setCurrentText(e.target.value)}
            placeholder={`Start your Task ${activeTask} response here…\n\nUse double Enter for new paragraphs.`}
            style={{
              flex: 1,
              minHeight: 460,
              width: "100%",
              padding: "14px 16px",
              fontSize: "0.95rem",
              lineHeight: 1.75,
              fontFamily: "Georgia, serif",
              color: "#1e293b",
              border: "1.5px solid #e2e8f0",
              borderRadius: 12,
              resize: "vertical",
              outline: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#0c1f4a")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, flexWrap: "wrap", gap: 8 }}>
            <p style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
              {wordCount < minWords ? `${minWords - wordCount} more words needed.` : "Minimum reached ✓"}
            </p>
            <button
              onClick={() => submitForFeedback(activeTask)}
              disabled={wordCount < 30}
              style={{
                padding: "10px 20px",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#fff",
                background: wordCount < 30 ? "#94a3b8" : "linear-gradient(135deg,#0c1f4a,#1e3a6e)",
                border: "none",
                borderRadius: 10,
                cursor: wordCount < 30 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: wordCount < 30 ? "none" : "0 4px 14px rgba(12,31,74,0.25)",
              }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Get Feedback
            </button>
          </div>
        </div>
      </div>

      {feedback && <FeedbackPanel feedback={feedback} essay={feedbackTask === 1 ? task1Text : task2Text} onClose={() => setFeedback(null)} />}
      {isAnalyzing && <AnalyzingOverlay />}
    </div>
  );
}
