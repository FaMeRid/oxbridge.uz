// src/components/ui/Loader.jsx
import React from "react";

/**
 * variant: "spinner" | "dots" | "bar"
 * size:    "sm" | "md" | "lg"
 * fullPage: true — центрирует на весь экран
 * text:    подпись под лоадером
 */
export default function Loader({
  variant  = "spinner",
  size     = "md",
  fullPage = false,
  text,
}) {
  const sizes = { sm: 24, md: 40, lg: 56 };
  const px    = sizes[size];

  const wrapper = {
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    justifyContent: "center",
    gap:            12,
    ...(fullPage && {
      position:   "fixed",
      inset:      0,
      background: "rgba(244,246,251,0.85)",
      zIndex:     9999,
    }),
  };

  return (
    <div style={wrapper}>
      {variant === "spinner" && (
        <>
          <style>{`
            @keyframes ox-spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <div style={{
            width:        px,
            height:       px,
            border:       `${px * 0.1}px solid #e2e8f0`,
            borderTop:    `${px * 0.1}px solid #a81011`,
            borderRadius: "50%",
            animation:    "ox-spin 0.75s linear infinite",
          }} />
        </>
      )}

      {variant === "dots" && (
        <>
          <style>{`
            @keyframes ox-bounce {
              0%, 80%, 100% { transform: scale(0); opacity: 0.4; }
              40%            { transform: scale(1); opacity: 1;   }
            }
          `}</style>
          <div style={{ display: "flex", gap: px * 0.3 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{
                width:        px * 0.3,
                height:       px * 0.3,
                background:   "#a81011",
                borderRadius: "50%",
                animation:    `ox-bounce 1.2s ease-in-out ${i * 0.16}s infinite`,
              }} />
            ))}
          </div>
        </>
      )}

      {variant === "bar" && (
        <>
          <style>{`
            @keyframes ox-bar {
              0%   { left: -40%; width: 40%; }
              50%  { left: 20%;  width: 60%; }
              100% { left: 100%; width: 40%; }
            }
          `}</style>
          <div style={{
            width:        "100%",
            maxWidth:     200,
            height:       4,
            background:   "#e2e8f0",
            borderRadius: 999,
            overflow:     "hidden",
            position:     "relative",
          }}>
            <div style={{
              position:     "absolute",
              top:          0,
              height:       "100%",
              background:   "linear-gradient(90deg, #a81011, #d42022)",
              borderRadius: 999,
              animation:    "ox-bar 1.4s ease-in-out infinite",
            }} />
          </div>
        </>
      )}

      {text && (
        <p style={{
          fontSize:   "0.85rem",
          color:      "#94a3b8",
          fontWeight: 500,
        }}>
          {text}
        </p>
      )}
    </div>
  );
}
