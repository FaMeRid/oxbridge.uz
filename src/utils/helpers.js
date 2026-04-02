// src/utils/helpers.js

/**
 * Генерирует уникальный код сессии
 * single: L1P2-XYZ = Listening test 1, part 2 only
 * full:   L1FULL-XYZ = full test (all parts)
 */
export function generateCode(skill, testId, partNumber, mode = "single") {
  const skillLetter = (skill || "L")[0].toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  if (mode === "full") {
    return `${skillLetter}${testId}FULL-${random}`;
  }
  return `${skillLetter}${testId}P${partNumber}-${random}`;
}

/**
 * Форматирует секунды в MM:SS
 */
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Баллы за вопрос (для пар «выберите ДВА» — 2). */
export function questionMaxPoints(q) {
  return q.points ?? 1;
}

/** Достаточно ли ответа для засчёта «отвечено» в прогрессе. */
export function isQuestionAnswered(q, answers) {
  const v = answers[q.id];
  if (v === undefined || v === null) return false;
  if (q.type === "checkbox" && Array.isArray(q.answer)) {
    return Array.isArray(v) && v.length === q.answer.length;
  }
  if (typeof v === "string") return v.trim() !== "";
  if (Array.isArray(v)) return v.length > 0;
  return Boolean(v);
}

/**
 * Считает IELTS band по кол-ву правильных ответов (из 40)
 */
export function getBand(score) {
  if (score >= 39) return 9;
  if (score >= 37) return 8.5;
  if (score >= 35) return 8;
  if (score >= 32) return 7.5;
  if (score >= 30) return 7;
  if (score >= 26) return 6.5;
  if (score >= 23) return 6;
  if (score >= 18) return 5.5;
  if (score >= 15) return 5;
  return 4.5;
}
