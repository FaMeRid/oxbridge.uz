// src/features/about/ui/ABtn.jsx
import React from "react";

export const ABtn = ({ children, variant = "primary", size = "md", href, onClick }) => {
  const cls = `ab-btn ab-btn-${variant} ab-btn-${size}`;

  if (href) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <button className={cls} onClick={onClick}>
      {children}
    </button>
  );
};
