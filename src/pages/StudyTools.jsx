// src/pages/StudyTools.jsx
import React, { useState } from "react";
import "../styles/globals.css";

// Import all tool components
import VocabularyBuilder from "../components/tools/VocabularyBuilder";
import GrammarChecker from "../components/tools/GrammarChecker";
import PronunciationGuide from "../components/tools/PronunciationGuide";
import ReadingSpeedTrainer from "../components/tools/ReadingSpeedTrainer";
import ListeningLab from "../components/tools/ListeningLab";
import EssayTemplates from "../components/tools/EssayTemplates";
import FlashcardDeck from "../components/tools/FlashcardDeck";
import ScorePredictor from "../components/tools/ScorePredictor";
import StudyPlanner from "../components/tools/StudyPlanner";

const tools = [
  {
    id: "vocabulary",
    icon: "📝",
    name: "Vocabulary Builder",
    desc: "Expand your academic word list with spaced-repetition flashcards and context-based exercises.",
    badge: "Core Tool",
    component: VocabularyBuilder,
  },
  {
    id: "grammar",
    icon: "🔍",
    name: "Grammar Checker",
    desc: "Identify and correct common IELTS writing errors — punctuation, tense, and sentence structure.",
    badge: "Writing Aid",
    component: GrammarChecker,
  },
  {
    id: "pronunciation",
    icon: "🗣️",
    name: "Pronunciation Guide",
    desc: "Master British English pronunciation with phonetic breakdowns and audio examples.",
    badge: "Speaking Aid",
    component: PronunciationGuide,
  },
  {
    id: "reading",
    icon: "📖",
    name: "Reading Speed Trainer",
    desc: "Develop skimming and scanning techniques to complete Reading passages faster and more accurately.",
    badge: "Reading Aid",
    component: ReadingSpeedTrainer,
  },
  {
    id: "listening",
    icon: "🎧",
    name: "Listening Lab",
    desc: "Practise with real IELTS-style audio clips at varying accents and speeds with transcripts.",
    badge: "Listening Aid",
    component: ListeningLab,
  },
  {
    id: "essays",
    icon: "✍️",
    name: "Essay Templates",
    desc: "Access proven Task 1 and Task 2 essay templates, model answers, and annotated band 8+ samples.",
    badge: "Writing Aid",
    component: EssayTemplates,
  },
  {
    id: "flashcards",
    icon: "🃏",
    name: "Flashcard Deck",
    desc: "Review key collocations, idioms, and topic-specific vocabulary using smart repetition scheduling.",
    badge: "Vocabulary",
    component: FlashcardDeck,
  },
  {
    id: "predictor",
    icon: "📊",
    name: "Score Predictor",
    desc: "Estimate your current band score based on practice test performance and track improvement over time.",
    badge: "Analytics",
    component: ScorePredictor,
  },
  {
    id: "planner",
    icon: "🗓️",
    name: "Study Planner",
    desc: "Generate a personalised day-by-day study schedule based on your exam date and target band score.",
    badge: "Productivity",
    component: StudyPlanner,
  },
];

const BADGE_COLORS = {
  "Core Tool": { bg: "#eff4ff", color: "#1e5dbf", border: "rgba(30,93,191,0.2)" },
  "Writing Aid": { bg: "#fdf6dc", color: "#c9a227", border: "rgba(201,162,39,0.3)" },
  "Speaking Aid": { bg: "#edfaf5", color: "#0d7c59", border: "rgba(13,124,89,0.2)" },
  "Reading Aid": { bg: "#fdf6dc", color: "#c9a227", border: "rgba(201,162,39,0.3)" },
  "Listening Aid": { bg: "#eff4ff", color: "#1e5dbf", border: "rgba(30,93,191,0.2)" },
  "Vocabulary": { bg: "#f5eeff", color: "#6d28d9", border: "rgba(109,40,217,0.2)" },
  "Analytics": { bg: "#fdecea", color: "#c0392b", border: "rgba(192,57,43,0.2)" },
  "Productivity": { bg: "#edfaf5", color: "#0d7c59", border: "rgba(13,124,89,0.2)" },
};

export default function StudyTools() {
  const [search, setSearch] = useState("");
  const [selectedTool, setSelectedTool] = useState(null);

  // Get hash from URL on mount
  React.useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const tool = tools.find((t) => t.id === hash);
      if (tool) {
        setSelectedTool(tool);
      }
    }
  }, []);

  const filtered = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.desc.toLowerCase().includes(search.toLowerCase())
  );

  // If a tool is selected, show its component
  if (selectedTool) {
    const ToolComponent = selectedTool.component;
    return (
      <div>
        {/* Back Button */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "20px 28px" }}>
          <button
            onClick={() => {
              setSelectedTool(null);
              window.location.hash = "";
            }}
            style={{
              padding: "12px 24px",
              background: "#fff",
              border: "1.5px solid #d1d9e6",
              borderRadius: "10px",
              color: "#0f172a",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            ← Back to Tools
          </button>
        </div>
        <ToolComponent />
      </div>
    );
  }

  // Show tools grid
  return (
    <div className="tools-page">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <p
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "#c9a227",
            marginBottom: 10,
          }}
        >
          <span style={{ display: "block", width: 20, height: 2, background: "#c9a227" }} />
          Academic Resources
        </p>
        <h1
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(1.8rem,4vw,2.6rem)",
            fontWeight: 800,
            color: "#0c1f4a",
            lineHeight: 1.15,
            marginBottom: "0.6rem",
          }}
        >
          Study Tools & Resources
        </h1>
        <p style={{ color: "#4a5878", maxWidth: 520, fontSize: "0.97rem" }}>
          Everything you need to reach your target band score — fully interactive tools for vocabulary,
          grammar, pronunciation, reading, listening, writing, and more.
        </p>
      </div>

      {/* Search */}
      <div
        style={{
          position: "relative",
          maxWidth: 440,
          marginBottom: 28,
        }}
      >
        <span
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "1rem",
            pointerEvents: "none",
          }}
        >
          🔎
        </span>
        <input
          type="text"
          placeholder="Search tools…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "11px 14px 11px 40px",
            border: "1.5px solid #dde3ef",
            borderRadius: 10,
            fontFamily: "Inter, sans-serif",
            fontSize: "0.9rem",
            background: "#fff",
            color: "#0c1f4a",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#c9a227")}
          onBlur={(e) => (e.target.style.borderColor = "#dde3ef")}
        />
      </div>

      {/* Grid */}
      <div className="tools-grid">
        {filtered.map((tool, i) => {
          const dc =
            BADGE_COLORS[tool.badge] || {
              bg: "#f0f3f9",
              color: "#4a5878",
              border: "#dde3ef",
            };
          return (
            <button
              key={tool.id}
              onClick={() => {
                setSelectedTool(tool);
                window.location.hash = tool.id;
              }}
              className="tool-card"
              style={{
                textDecoration: "none",
                animationDelay: `${i * 0.05}s`,
                background: "#fff",
                border: "1.5px solid #e2e8f0",
                borderRadius: "16px",
                padding: "26px 24px",
                color: "inherit",
                display: "block",
                transition: "all 0.25s",
                boxShadow: "0 2px 8px rgba(15,23,42,0.07)",
                animation: "fadeUp 0.4s ease-out both",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.borderColor = "rgba(168,16,17,0.25)";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(15,23,42,0.11)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(15,23,42,0.07)";
              }}
            >
              <div className="tool-icon" style={{ fontSize: "2.2rem", marginBottom: 14 }}>
                {tool.icon}
              </div>
              <div className="tool-name" style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a", marginBottom: 8 }}>
                {tool.name}
              </div>
              <div
                className="tool-desc"
                style={{
                  fontSize: "0.82rem",
                  color: "#475569",
                  lineHeight: 1.6,
                  marginBottom: 14,
                }}
              >
                {tool.desc}
              </div>
              <span
                className="tool-badge"
                style={{
                  display: "inline-block",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  padding: "4px 11px",
                  borderRadius: "999px",
                  border: `1px solid ${dc.border}`,
                  background: dc.bg,
                  color: dc.color,
                }}
              >
                {tool.badge}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#8494b0" }}>
          <p style={{ fontSize: "2rem", marginBottom: 12 }}>🔍</p>
          <p style={{ fontWeight: 600 }}>No tools match "{search}"</p>
        </div>
      )}
    </div>
  );
}