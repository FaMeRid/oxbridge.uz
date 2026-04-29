import React from "react";

export default function LineChartCO2() {
  const years = [1990, 1995, 2000, 2005, 2010, 2015, 2020];
  const series = [
    { name: "USA", color: "#a81011", data: [19.5, 19.8, 20.5, 19.6, 17.4, 16.0, 14.2] },
    { name: "China", color: "#f59e0b", data: [2.1, 2.7, 2.9, 4.5, 6.7, 7.4, 7.9] },
    { name: "UK", color: "#1e5dbf", data: [9.8, 9.5, 9.4, 9.0, 7.8, 6.4, 4.8] },
    { name: "India", color: "#0d7c59", data: [0.7, 0.9, 1.0, 1.2, 1.5, 1.7, 1.9] },
  ];
  const W = 540,
    H = 290,
    P = 44,
    max = 22;
  const xS = (i) => P + ((W - P * 2) * i) / (years.length - 1);
  const yS = (v) => H - P - ((H - P * 2) * v) / max;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ background: "#fff", borderRadius: 10 }}>
      <text x={W / 2} y={20} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700, fill: "#0c1f4a" }}>
        CO₂ Emissions per Capita (tonnes), 1990–2020
      </text>
      {[0, 5, 10, 15, 20].map((g) => {
        const py = yS(g);
        return (
          <g key={g}>
            <line x1={P} y1={py} x2={W - P} y2={py} stroke="#e2e8f0" />
            <text x={P - 6} y={py + 3} textAnchor="end" style={{ fontSize: 9, fill: "#94a3b8" }}>
              {g}
            </text>
          </g>
        );
      })}
      {years.map((y, i) => (
        <text key={y} x={xS(i)} y={H - P + 14} textAnchor="middle" style={{ fontSize: 10, fill: "#64748b" }}>
          {y}
        </text>
      ))}
      {series.map((s) => {
        const path = s.data.map((v, i) => `${i === 0 ? "M" : "L"} ${xS(i)} ${yS(v)}`).join(" ");
        return (
          <g key={s.name}>
            <path d={path} fill="none" stroke={s.color} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
            {s.data.map((v, i) => (
              <circle key={i} cx={xS(i)} cy={yS(v)} r={3} fill={s.color} />
            ))}
          </g>
        );
      })}
      <g transform={`translate(${W - P - 90}, 36)`}>
        {series.map((s, i) => (
          <g key={s.name} transform={`translate(0, ${i * 16})`}>
            <rect width={10} height={10} fill={s.color} rx={2} />
            <text x={14} y={9} style={{ fontSize: 10, fill: "#374151", fontWeight: 600 }}>
              {s.name}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}