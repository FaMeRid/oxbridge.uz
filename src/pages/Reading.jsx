// src/pages/Reading.jsx
import React from "react";
import { useLocation } from "wouter";
import TestEngine from "@/features/test/TestEngine";

// Импорт тестов
import test1 from "@/data/test/reading/test1.json";

// Карта testId → данные теста
const TEST_MAP = {
  1: test1,
  // 2: test2,
};

export default function Reading() {
  const [, navigate] = useLocation();

  // Читаем сессию
  const raw = sessionStorage.getItem("current_session");

  // Нет сессии
  if (!raw) {
    return (
      <div className="page-wrap" style={{ textAlign: "center", paddingTop: 80 }}>
        <p style={{ fontSize: "3rem", marginBottom: 16 }}>📖</p>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--navy)", marginBottom: 10 }}>
          No active session
        </h2>
        <p style={{ color: "var(--text2)", marginBottom: 28 }}>
          Open <strong>Practice</strong> to start a full reading test, or use <strong>Join test</strong> if your teacher gave you a code.
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

  // 🔥 ВАЖНО: проверяем что это reading
  const skillNorm = String(session.skill || "reading").toLowerCase();

  if (skillNorm !== "reading") {
    navigate(`/${skillNorm}`);
    return null;
  }

  /* Только учительский код может открыть один part */
  if (session.mode === "single" && !session.assignedByTeacher) {
    sessionStorage.removeItem("current_session");
    navigate("/practice");
    return null;
  }

  // Получаем тест
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
          Only Reading Test 1 is currently available.
        </p>

        <button className="btn-primary" onClick={() => navigate("/practice")}>
          ← Go to Practice
        </button>
      </div>
    );
  }

  const transformedTest = transformReadingToParts(test);

return (
  <TestEngine
    test={transformedTest}
    startPart={session.startPart ?? 0}
    mode={session.mode ?? "full"}
  />
);
}
// 👇 ДОБАВЬ ЭТУ ФУНКЦИЮ
function transformReadingToParts(test) {
  const parts = [];

  test.passages.forEach((passage, index) => {
    const questions = test.questions.filter(
      (q) => q.passageId === passage.id
    );

    parts.push({
      title: `Part ${index + 1}`,
      passageTitle: passage.title,
      passageText: passage.text,
      questions: questions.map((q) => {
        // преобразуем типы под TestEngine
        if (q.type === "multiple_choice" || q.type === "true_false_not_given") {
          return {
            id: `q${q.id}`,
            type: "radio",
            question: q.questionText,
            options: q.options || ["TRUE", "FALSE", "NOT GIVEN"],
            answer: q.correctAnswer,
          };
        }

        if (q.type === "matching_heading" || q.type === "matching_person" || q.type === "matching_condition") {
          return {
            id: `q${q.id}`,
            type: "input",
            question: q.questionText || q.behavior || q.personName,
            answer: q.correctAnswer,
          };
        }

        if (q.type === "fill_gap") {
          return {
            id: `q${q.id}`,
            type: "input",
            question: q.questionText,
            answer: q.correctAnswer,
          };
        }

        return q;
      }),
    });
  });

  return {
    ...test,
    type: "reading",
    parts,
  };
}