// src/components/ui/TestModal.jsx
import React from "react";

export default function TestModal({ isOpen, onClose, testName }) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose} // закрытие при клике вне окна
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          width: "500px",
          maxWidth: "90%",
          padding: "24px",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()} // чтобы клик внутри не закрывал
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            border: "none",
            background: "transparent",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ×
        </button>

        {/* Modal content */}
        <h2>{testName} Instructions</h2>
        <p>Please read the instructions carefully before continuing.</p>

        <ul style={{ marginTop: "12px", marginBottom: "12px" }}>
          <li>Test duration: 28 minutes</li>
          <li>You will read multiple passages</li>
          <li>No extra time will be given at the end</li>
          <li>Answer all questions within the time limit</li>
          <li>Manage your time carefully</li>
        </ul>

        <h3>Test Parts</h3>
        <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
          {["All", "Part 1", "Part 2", "Part 3", "Part 4"].map((part) => (
            <button
              key={part}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                cursor: "pointer",
                background: "#f1f5f9",
                fontWeight: "600",
                flex: "1",
                minWidth: "80px",
              }}
              onClick={() => alert(`Start ${testName} - ${part}`)}
            >
              {part}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}