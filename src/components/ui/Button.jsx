import React from "react";

export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  fullWidth = false,
  ...props
}) {
  const variantStyles = {
    primary: {
      background: "linear-gradient(135deg, #a81011, #d42022)",
      color: "#fff",
      border: "none",
      boxShadow: "0 4px 24px rgba(168,16,17,0.28)",
    },
    secondary: {
      background: "#fff",
      color: "#0f172a",
      border: "1.5px solid #dde3ef",
      boxShadow: "none",
    },
    ghost: {
      background: "transparent",
      color: "#a81011",
      border: "none",
      boxShadow: "none",
    },
    danger: {
      background: "#fff5f5",
      color: "#dc2626",
      border: "1px solid rgba(220,38,38,0.2)",
      boxShadow: "none",
    },
    success: {
      background: "#f0fdf4",
      color: "#16a34a",
      border: "1px solid rgba(22,163,74,0.2)",
      boxShadow: "none",
    },
  };

  const sizeStyles = {
    sm: { padding: "8px 14px", fontSize: "0.85rem" },
    md: { padding: "12px 24px", fontSize: "0.95rem" },
    lg: { padding: "16px 32px", fontSize: "1rem" },
    xl: { padding: "20px 40px", fontSize: "1.1rem" },
  };

  const currentVariant = variantStyles[variant] || variantStyles.primary;
  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={{
        ...currentVariant,
        ...currentSize,
        borderRadius: "10px",
        fontWeight: 700,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        transition: "all 0.2s",
        opacity: disabled || loading ? 0.6 : 1,
        width: fullWidth ? "100%" : "auto",
        display: fullWidth ? "block" : "inline-block",
        whiteSpace: "nowrap",
        fontFamily: "Inter, sans-serif",
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading && variant === "primary") {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 8px 40px rgba(168,16,17,0.4)";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading && variant === "primary") {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 24px rgba(168,16,17,0.28)";
        }
      }}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export default Button;