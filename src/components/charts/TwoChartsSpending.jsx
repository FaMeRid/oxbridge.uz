import React from "react";

export default function TwoChartsSpending() {
  return (
    <div style={{ padding: 20, background: "#f8fafc", borderRadius: 10, textAlign: "center" }}>
      🥧 Two charts: Household expenditure 1980 vs 2020
      <br />
      <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
        Housing ↑25%→32%, Food ↓20%→14%, Leisure ↑8%→14%
      </span>
    </div>
  );
}