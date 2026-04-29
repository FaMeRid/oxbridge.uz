import React from "react";

export default function BarChartDegrees() {
  return (
    <div style={{ padding: 20, background: "#f8fafc", borderRadius: 10, textAlign: "center" }}>
      📊 Bar Chart: University Degrees by Gender (2019)
      <br />
      <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
        Education: 78% F, 22% M | Engineering: 85% M, 15% F
      </span>
    </div>
  );
}