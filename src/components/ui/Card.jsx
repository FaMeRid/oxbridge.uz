import React from "react";

export function Card({
  children,
  hoverable = true,
  bordered = true,
  clickable = false,
  onClick,
  padding = "24px",
  ...props
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff",
        border: bordered ? "1.5px solid #e2e8f0" : "none",
        borderRadius: "16px",
        padding: padding,
        transition: "all 0.3s ease",
        cursor: clickable ? "pointer" : "default",
        boxShadow: "0 2px 8px rgba(15,23,42,0.07)",
      }}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.borderColor = "rgba(168,16,17,0.2)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,23,42,0.12)";
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "#e2e8f0";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(15,23,42,0.07)";
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export default Card;