// src/pages/Listening.jsx
import React from "react";
import { useLocation } from "wouter";
import TestEngine from "@/features/test/TestEngine";

// Импортируй сюда все тесты которые есть
import test1 from "@/data/test/listening/test1.json";

// Карта testId → данные теста
// Когда добавишь test2.json — просто допиши сюда
const TEST_MAP = {
  1: test1,
  // 2: test2,
  // 3: test3,
};

export default function Listening() {
  const [, navigate] = useLocation();

  // Читаем сессию
  const raw = sessionStorage.getItem("current_session");

  // Нет сессии — показываем заглушку
  if (!raw) {
    return (
      <div className="page-wrap" style={{ textAlign: "center", paddingTop: 80 }}>
        <p style={{ fontSize: "3rem", marginBottom: 16 }}>🎧</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--navy)", marginBottom: 10 }}>
          No active session
        </h2>
        <p style={{ color: "var(--text2)", marginBottom: 28 }}>
          Open <strong>Practice</strong> to start a full listening test, or use <strong>Join test</strong> if your teacher gave you a code.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={() => navigate("/practice")}>
            ← Go to Practice
          </button>
          <button className="btn-secondary" onClick={() => navigate("/jointest")}>
            Enter teacher code
          </button>
        </div>
      </div>
    );
  }

  let session;
  try {
    session = JSON.parse(raw);
  } catch {
    sessionStorage.removeItem("current_session");
    navigate("/practice");
    return null;
  }

  const skillNorm = String(session.skill || "listening").toLowerCase();
  if (skillNorm !== "listening") {
    navigate(`/${skillNorm}`);
    return null;
  }

  /* Только учительский код может открыть один part; с Practice — всегда full */
  if (session.mode === "single" && !session.assignedByTeacher) {
    sessionStorage.removeItem("current_session");
    navigate("/practice");
    return null;
  }

  // Находим тест по id
  const test = TEST_MAP[session.testId];

  if (!test) {
    return (
      <div className="page-wrap" style={{ textAlign: "center", paddingTop: 80 }}>
        <p style={{ fontSize: "3rem", marginBottom: 16 }}>😕</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--navy)", marginBottom: 10 }}>
          Test not found
        </h2>
        <p style={{ color: "var(--text2)", marginBottom: 8 }}>
          Test #{session.testId} is not available yet.
        </p>
        <p style={{ color: "var(--text3)", fontSize: "0.85rem", marginBottom: 28 }}>
          Only Test 1 is currently available. More coming soon!
        </p>
        <button className="btn-primary" onClick={() => navigate("/practice")}>
          ← Go to Practice
        </button>
      </div>
    );
  }

  return (
    <TestEngine
      test={test}
      startPart={session.startPart ?? 0}
      mode={session.mode ?? "full"}
    />
  );
}
