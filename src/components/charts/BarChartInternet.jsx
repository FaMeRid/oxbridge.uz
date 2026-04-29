// src/components/charts/BarChartInternet.jsx
import React from "react";

export default function BarChartInternet() {
  const data = [
    { label: "16–24", v: 99 },
    { label: "25–34", v: 98 },
    { label: "35–44", v: 96 },
    { label: "45–54", v: 92 },
    { label: "55–64", v: 83 },
    { label: "65–74", v: 64 },
    { label: "75+", v: 32 },
  ];
  const W = 520,
    H = 280,
    P = 40,
    max = 100;
  const bw = (W - P * 2) / data.length - 8;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ background: "#fff", borderRadius: 10 }}>
      <text x={W / 2} y={20} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700, fill: "#0c1f4a" }}>
        Daily Internet Use by Age Group, UK 2020 (%)
      </text>
      {[0, 25, 50, 75, 100].map((y) => {
        const py = H - P - ((H - P * 2) * y) / max;
        return (
          <g key={y}>
            <line x1={P} y1={py} x2={W - P} y2={py} stroke="#e2e8f0" />
            <text x={P - 6} y={py + 3} textAnchor="end" style={{ fontSize: 9, fill: "#94a3b8" }}>
              {y}%
            </text>
          </g>
        );
      })}
      {data.map((d, i) => {
        const x = P + i * (bw + 8) + 4;
        const h = ((H - P * 2) * d.v) / max;
        const y = H - P - h;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={bw} height={h} fill="#1e3a6e" rx={3} />
            <text x={x + bw / 2} y={y - 4} textAnchor="middle" style={{ fontSize: 10, fontWeight: 700, fill: "#0c1f4a" }}>
              {d.v}%
            </text>
            <text x={x + bw / 2} y={H - P + 14} textAnchor="middle" style={{ fontSize: 10, fill: "#64748b" }}>
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}