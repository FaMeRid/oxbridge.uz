// src/features/about/ui/ABadge.jsx
import React from "react";

export const ABadge = ({ children, type = "default" }) => (
  <span className={`ab-badge ab-badge-${type}`}>{children}</span>
);
