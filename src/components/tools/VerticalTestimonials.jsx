import React, { useState } from "react";

const TESTIMONIALS = [
  { name: "Aziza", avatar: "👩‍🎓", text: "I jumped from 6.0 to 7.5 in 3 weeks 😳" },
  { name: "Jasur", avatar: "👨‍🎓", text: "Real exam felt easier than this platform 😂" },
  { name: "Madina", avatar: "👩", text: "Vocabulary tool is addictive 🔥" },
  { name: "Sardor", avatar: "🧑", text: "Speaking became super easy after practice" },
  { name: "Dilnoza", avatar: "👩‍💻", text: "Writing feedback is INSANE" },
  { name: "Bekzod", avatar: "👨‍💻", text: "Only platform that actually works" },

  { name: "Sarah Johnson", avatar: "👩‍🎓", text: "Oxbridge changed my life! I went from 6.5 to 8.5 in 3 months." },
  { name: "Ahmed Hassan", avatar: "👨‍🎓", text: "The personalised study plan helped me focus on weak areas." },
  { name: "Maria Garcia", avatar: "👩", text: "Practice tests are so realistic. Essay templates gave me confidence." },
  { name: "Hiroshi Tanaka", avatar: "👨", text: "Listening improved massively. Everything is well structured." },

  // ➕ новые отзывы
  { name: "Ali", avatar: "🧑‍🎓", text: "Band 7.0 finally 😭 thank you guys!" },
  { name: "Zarina", avatar: "👩‍🎓", text: "Flashcards helped me remember everything faster" },
  { name: "Timur", avatar: "👨", text: "Score predictor is actually accurate 😳" },
  { name: "Laylo", avatar: "👩", text: "I love the UI, feels like a real product" },
  { name: "John", avatar: "🧑", text: "Better than expensive IELTS courses honestly" },
  { name: "Fatima", avatar: "👩‍💻", text: "Daily practice built my confidence a lot" },
];

function Column({ reverse, speed }) {
  const [paused, setPaused] = useState(false);

  return (
    <div
      className={`vt-column ${reverse ? "reverse" : ""}`}
      style={{
        animationDuration: speed,
        animationPlayState: paused ? "paused" : "running",
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
        <div key={i} className="vt-card">
          
          {/* 👤 Header */}
          <div className="vt-user">
            <div className="vt-avatar">{t.avatar}</div>
            <span className="vt-name">{t.name}</span>
          </div>

          {/* 💬 Text */}
          <p className="vt-text">"{t.text}"</p>

        </div>
      ))}
    </div>
  );
}

export default function VerticalTestimonials() {
  return (
    <div className="vt-wrapper">
      <Column speed="28s" />
      <Column reverse speed="32s" />
      <Column speed="29s" />
    </div>
  );
}