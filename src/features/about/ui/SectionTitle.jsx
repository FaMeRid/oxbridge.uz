// src/features/about/ui/SectionTitle.jsx
import React from "react";

export const SectionTitle = ({ children, subtitle, centered = false }) => (
  <div className={`ab-section-header${centered ? " centered" : ""}`}>
    <h2 className="ab-section-title">{children}</h2>
    {subtitle && <p className="ab-section-subtitle">{subtitle}</p>}
  </div>
);
