// src/components/ui/Input.jsx
import React, { useState } from "react";

/**
 * type:  "text" | "email" | "password" | "number" | "search"
 * label: строка над полем
 * error: строка с ошибкой под полем
 * icon:  эмодзи/символ слева
 */
export default function Input({
  label,
  error,
  icon,
  type        = "text",
  placeholder = "",
  value,
  onChange,
  disabled    = false,
  required    = false,
  style,
  inputStyle,
  ...rest
}) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? "#ef4444"
    : focused
    ? "#a81011"
    : "#e2e8f0";

  const boxShadow = error
    ? "0 0 0 3px rgba(239,68,68,0.15)"
    : focused
    ? "0 0 0 3px rgba(168,16,17,0.18)"
    : "none";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && (
        <label style={{
          fontSize:      "0.78rem",
          fontWeight:    700,
          textTransform: "uppercase",
          letterSpacing: "0.8px",
          color:         "#475569",
        }}>
          {label}{required && <span style={{ color: "#a81011", marginLeft: 3 }}>*</span>}
        </label>
      )}

      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{
            position:       "absolute",
            left:           14,
            top:            "50%",
            transform:      "translateY(-50%)",
            fontSize:       "1rem",
            pointerEvents:  "none",
          }}>
            {icon}
          </span>
        )}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width:        "100%",
            padding:      icon ? "13px 16px 13px 42px" : "13px 16px",
            border:       `1.5px solid ${borderColor}`,
            borderRadius: 10,
            fontFamily:   "Inter, sans-serif",
            fontSize:     "0.95rem",
            color:        "#0f172a",
            background:   disabled ? "#f4f6fb" : "#fff",
            outline:      "none",
            transition:   "border-color 0.2s, box-shadow 0.2s",
            boxShadow,
            cursor:       disabled ? "not-allowed" : "text",
            opacity:      disabled ? 0.6 : 1,
            ...inputStyle,
          }}
          {...rest}
        />
      </div>

      {error && (
        <span style={{ fontSize: "0.8rem", color: "#dc2626", fontWeight: 600 }}>
          {error}
        </span>
      )}
    </div>
  );
}
