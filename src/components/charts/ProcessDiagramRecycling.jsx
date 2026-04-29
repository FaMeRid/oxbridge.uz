import React from "react";

export default function ProcessDiagramRecycling() {
  const stages = [
    { x: 60, y: 90, label: "1. Used paper\ncollected" },
    { x: 200, y: 90, label: "2. Sorted by\ntype" },
    { x: 340, y: 90, label: "3. Shredded\n& cleaned" },
    { x: 480, y: 90, label: "4. Pulped\nwith water" },
    { x: 480, y: 220, label: "5. Bleached &\nde-inked" },
    { x: 340, y: 220, label: "6. Pressed\n& dried" },
    { x: 200, y: 220, label: "7. Rolled into\nnew sheets" },
    { x: 60, y: 220, label: "8. New paper\nproducts" },
  ];

  return (
    <svg viewBox="0 0 560 320" width="100%" style={{ background: "#fff", borderRadius: 10 }}>
      <text x={280} y={22} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700, fill: "#0c1f4a" }}>
        The Paper Recycling Process
      </text>
      <defs>
        <marker id="arrow" markerWidth={8} markerHeight={8} refX={7} refY={4} orient="auto">
          <path d="M0,0 L8,4 L0,8 z" fill="#0d7c59" />
        </marker>
      </defs>
      {stages.map((s, i) => {
        const next = stages[i + 1];
        return (
          <g key={i}>
            <rect x={s.x - 50} y={s.y - 28} width={100} height={56} rx={8} fill="#edfaf5" stroke="#0d7c59" strokeWidth={1.4} />
            {s.label.split("\n").map((l, j) => (
              <text key={j} x={s.x} y={s.y - 4 + j * 13} textAnchor="middle" style={{ fontSize: 10, fontWeight: 600, fill: "#0c1f4a" }}>
                {l}
              </text>
            ))}
            {next && i !== 3 && <line x1={s.x + 50} y1={s.y} x2={next.x - 50} y2={next.y} stroke="#0d7c59" strokeWidth={1.5} markerEnd="url(#arrow)" />}
            {i === 3 && (
              <path
                d={`M ${s.x} ${s.y + 28} Q ${s.x + 60} ${(s.y + next.y) / 2} ${next.x} ${next.y - 28}`}
                fill="none"
                stroke="#0d7c59"
                strokeWidth={1.5}
                markerEnd="url(#arrow)"
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}