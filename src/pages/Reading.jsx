// src/pages/Reading.jsx
import React, { useMemo, useCallback } from "react";
import { useLocation } from "wouter";
import TestEngine from "@/features/test/TestEngine";

/* ──────────────────────────────────────────────────────────────
   AUTO-LOAD ALL READING TESTS
   Drop a new JSON into src/data/test/reading/ → it just works.
   Naming: test1.json, test2.json, test3.json …
   ────────────────────────────────────────────────────────────── */
const RAW_TESTS = import.meta.glob("@/data/test/reading/*.json", {
  eager: true,
  import: "default",
});

const TEST_MAP = Object.entries(RAW_TESTS).reduce((acc, [path, data]) => {
  const match = path.match(/test(\d+)\.json$/i);
  if (match) acc[Number(match[1])] = data;
  return acc;
}, {});

const AVAILABLE_IDS = Object.keys(TEST_MAP)
  .map(Number)
  .sort((a, b) => a - b);

/* ──────────────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────────────── */
function readSession() {
  const raw = sessionStorage.getItem("current_session");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    sessionStorage.removeItem("current_session");
    return null;
  }
}

/** Pull testId from URL (?testId=2) first, then session. */
function resolveTestId(session) {
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("testId");
    if (fromUrl && /^\d+$/.test(fromUrl)) return Number(fromUrl);
  } catch {}
  if (session?.testId != null) return Number(session.testId);
  return null;
}

const PROGRESS_KEY = (id) => `reading_progress_${id}`;

function loadProgress(id) {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY(id));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveProgress(id, payload) {
  try {
    localStorage.setItem(
      PROGRESS_KEY(id),
      JSON.stringify({ ...payload, savedAt: Date.now() })
    );
  } catch {}
}

/* ──────────────────────────────────────────────────────────────
   Reading-specific transform (unchanged behaviour)
   ────────────────────────────────────────────────────────────── */
function transformReadingToParts(test) {
  if (!test || !Array.isArray(test.passages)) return test;

  const parts = test.passages.map((passage, index) => {
    const questions = (test.questions || []).filter(
      (q) => q.passageId === passage.id
    );

    return {
      title: `Part ${index + 1}`,
      passageTitle: passage.title,
      passageText: passage.text,
      questions: questions.map((q) => {
        if (
          q.type === "multiple_choice" ||
          q.type === "true_false_not_given"
        ) {
          return {
            id: `q${q.id}`,
            type: "radio",
            question: q.questionText,
            options: q.options || ["TRUE", "FALSE", "NOT GIVEN"],
            answer: q.correctAnswer,
          };
        }

        if (
          q.type === "matching_heading" ||
          q.type === "matching_person" ||
          q.type === "matching_condition"
        ) {
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
    };
  });

  return { ...test, type: "reading", parts };
}

/* ──────────────────────────────────────────────────────────────
   UI: shared empty-state shell
   ────────────────────────────────────────────────────────────── */
function EmptyShell({ emoji, title, children, actions }) {
  return (
    <div
      className="page-wrap"
      style={{ textAlign: "center", paddingTop: 80, maxWidth: 560, margin: "0 auto" }}
    >
      <p style={{ fontSize: "3rem", marginBottom: 16 }}>{emoji}</p>
      <h2
        style={{
          fontFamily: "'Playfair Display', serif",
          color: "var(--navy)",
          marginBottom: 10,
        }}
      >
        {title}
      </h2>
      <div style={{ color: "var(--text2)", marginBottom: 28, lineHeight: 1.55 }}>
        {children}
      </div>
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {actions}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   PAGE
   ────────────────────────────────────────────────────────────── */
export default function Reading() {
  const [, navigate] = useLocation();

  const session = useMemo(() => readSession(), []);
  const testId = useMemo(() => resolveTestId(session), [session]);

  /* ── 1. No session AND no ?testId in URL ───────────────────── */
  if (!session && testId == null) {
    return (
      <EmptyShell
        emoji="📖"
        title="No active session"
        actions={
          <>
            <button className="btn-primary" onClick={() => navigate("/practice")}>
              ← Go to Practice
            </button>
            <button className="btn-secondary" onClick={() => navigate("/jointest")}>
              Enter teacher code
            </button>
          </>
        }
      >
        Open <strong>Practice</strong> to start a full reading test, or use{" "}
        <strong>Join test</strong> if your teacher gave you a code.
      </EmptyShell>
    );
  }

  /* ── 2. Skill mismatch — bounce to the right page ──────────── */
  if (session) {
    const skillNorm = String(session.skill || "reading").toLowerCase();
    if (skillNorm !== "reading") {
      navigate(`/${skillNorm}`);
      return null;
    }

    /* Only teacher-assigned sessions may open a single part */
    if (session.mode === "single" && !session.assignedByTeacher) {
      sessionStorage.removeItem("current_session");
      navigate("/practice");
      return null;
    }
  }

  /* ── 3. Resolve the actual test ────────────────────────────── */
  const rawTest = testId != null ? TEST_MAP[testId] : null;

  if (!rawTest) {
    return (
      <EmptyShell
        emoji="😕"
        title="Test not found"
        actions={
          <button className="btn-primary" onClick={() => navigate("/practice")}>
            ← Go to Practice
          </button>
        }
      >
        <p style={{ marginBottom: 8 }}>
          Test #{testId ?? "—"} is not available yet.
        </p>
        {AVAILABLE_IDS.length > 0 ? (
          <p style={{ color: "var(--text3)", fontSize: "0.85rem", margin: 0 }}>
            Currently available:{" "}
            <strong>
              {AVAILABLE_IDS.map((id) => `Test ${id}`).join(", ")}
            </strong>
            . More coming soon!
          </p>
        ) : (
          <p style={{ color: "var(--text3)", fontSize: "0.85rem", margin: 0 }}>
            No reading tests are loaded yet. Drop a JSON file into{" "}
            <code>src/data/test/reading/</code> as <code>testN.json</code>.
          </p>
        )}
      </EmptyShell>
    );
  }

  /* ── 4. Transform + start TestEngine with autosave hooks ───── */
  const transformedTest = useMemo(
    () => transformReadingToParts(rawTest),
    [rawTest]
  );

  const initialProgress = loadProgress(testId);

  const handleProgress = useCallback(
    (payload) => saveProgress(testId, payload),
    [testId]
  );

  return (
    <TestEngine
      test={transformedTest}
      testId={testId}
      skill="reading"
      startPart={session?.startPart ?? 0}
      mode={session?.mode ?? "full"}
      initialAnswers={initialProgress?.answers}
      onProgress={handleProgress}
    />
  );
}
