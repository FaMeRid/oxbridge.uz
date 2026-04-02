// src/components/test/Answer.jsx
import React from "react";

/**
 * Показывает правильный/неправильный ответ после завершения теста.
 *
 * q:          объект вопроса { id, question, answer }
 * userAnswer: ответ студента
 */
export default function Answer({ q, userAnswer }) {
  if (!q) return null;

  const isCorrect = checkAnswer(q.answer, userAnswer);

  return (
    <div style={{
      padding:      "14px 18px",
      borderRadius: 12,
      border:       `1.5px solid ${isCorrect ? "rgba(13,124,89,0.3)" : "rgba(168,16,17,0.25)"}`,
      background:   isCorrect ? "#edfaf5" : "#fff0f0",
      marginBottom: 12,
    }}>
      {/* Question */}
      <p style={{ fontSize: "0.9rem", color: "#0f172a", marginBottom: 10, fontWeight: 500 }}>
        {q.question}
      </p>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", fontSize: "0.82rem" }}>
        {/* User answer */}
        <div>
          <span style={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px" }}>
            Your answer:{" "}
          </span>
          <span style={{
            fontWeight: 700,
            color: isCorrect ? "#0d7c59" : "#a81011",
          }}>
            {formatAnswer(userAnswer) || <em style={{ opacity: 0.5 }}>— no answer —</em>}
          </span>
        </div>

        {/* Correct answer (only if wrong) */}
        {!isCorrect && (
          <div>
            <span style={{ color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px" }}>
              Correct:{" "}
            </span>
            <span style={{ fontWeight: 700, color: "#0d7c59" }}>
              {formatAnswer(q.answer)}
            </span>
          </div>
        )}

        {/* Badge */}
        <span style={{
          marginLeft:   "auto",
          fontWeight:   800,
          fontSize:     "0.78rem",
          padding:      "3px 12px",
          borderRadius: 999,
          background:   isCorrect ? "#0d7c59" : "#a81011",
          color:        "#fff",
          flexShrink:   0,
        }}>
          {isCorrect ? "✓ Correct" : "✗ Wrong"}
        </span>
      </div>
    </div>
  );
}

/* ── helpers ── */
function checkAnswer(correct, user) {
  if (!user) return false;

  if (Array.isArray(correct)) {
    return (
      Array.isArray(user) &&
      correct.length === user.length &&
      correct.every((a) => user.includes(a))
    );
  }

  return (
    correct.toString().toLowerCase().trim() ===
    user.toString().toLowerCase().trim()
  );
}

function formatAnswer(val) {
  if (!val) return "";
  if (Array.isArray(val)) return val.join(", ");
  return val.toString();
}
