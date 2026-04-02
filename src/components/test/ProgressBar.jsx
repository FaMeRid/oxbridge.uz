// src/components/test/ProgressBar.jsx
import React from "react";

/**
 * current: текущий вопрос (1-based)
 * total:   всего вопросов
 * part:    номер части (опционально)
 */
export default function ProgressBar({ current, total, part }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        display:        "flex",
        justifyContent: "space-between",
        alignItems:     "center",
        marginBottom:   8,
      }}>
        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>
          {part !== undefined ? `Part ${part + 1} · ` : ""}Answered {current} / {total}
        </span>
        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#a81011" }}>
          {pct}%
        </span>
      </div>

      <div style={{
        height:       8,
        background:   "#eef1f8",
        borderRadius: 999,
        overflow:     "hidden",
        border:       "1px solid #e2e8f0",
      }}>
        <div style={{
          height:     "100%",
          width:      `${pct}%`,
          background: "linear-gradient(90deg, #0c1f4a, #a81011)",
          borderRadius: 999,
          transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }} />
      </div>
    </div>
  );
}
