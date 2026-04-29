// src/features/about/tabs/AboutTab.jsx
import React from "react";
import { AWARDS } from "../data/awards";
import { SectionTitle } from "../ui/SectionTitle";

const VALUES = [
  {
    icon: "🚀",
    title: "Our Mission",
    text: "Deliver world-class IELTS preparation combining modern pedagogy, experienced educators, and adaptive learning paths that mirror real exam conditions.",
  },
  {
    icon: "🔭",
    title: "Our Vision",
    text: "To become the most trusted IELTS institution in Central Asia, with graduates thriving at top global universities.",
  },
  {
    icon: "💡",
    title: "Our Values",
    text: "Excellence in teaching, honesty in assessment, and respect for each learner's unique pace. Consistent effort plus expert guidance transforms bands.",
  },
];

const FEATURES = [
  {
    icon: "🎧",
    title: "Full Mock Tests",
    desc: "Complete Listening & Reading with authentic timing and scoring",
  },
  {
    icon: "👨‍🏫",
    title: "Teacher Integration",
    desc: "Join assigned tests via code — classroom and platform in sync",
  },
  {
    icon: "📊",
    title: "Progress Analytics",
    desc: "Band tracking, skill breakdowns, and full attempt history",
  },
  {
    icon: "🛠️",
    title: "Study Tools",
    desc: "Additional materials and simulators for daily targeted practice",
  },
];

export const AboutTab = () => (
  <div className="ab-tab-content">
    <div className="ab-about-grid">
      {/* Story */}
      <div className="ab-story">
        <SectionTitle subtitle="A decade transforming English education in Uzbekistan">
          Our Story
        </SectionTitle>
        <p className="ab-story-lead">
          Founded in 2014, Oxbridge English Academy has become the premier IELTS
          preparation centre in the Surkhandarya region.
        </p>
        <p style={{ marginBottom: 16 }}>
          Our methodology combines rigorous academic standards with personalised
          attention. We focus on building genuine language competency that serves
          students long after they've achieved their target scores.
        </p>
        <p style={{ marginBottom: 24 }}>
          The Oxbridge platform extends our classroom excellence into the digital
          realm, offering full-length practice tests, detailed analytics, and
          seamless integration with our in-person curriculum.
        </p>
        <blockquote className="ab-quote">
          "The highest results in Surkhandarya — our students set ambitious goals and
          achieve them step by step."
        </blockquote>
      </div>

      {/* Values */}
      <div className="ab-values">
        {VALUES.map((v) => (
          <div key={v.title} className="ab-value-card">
            <span className="ab-value-icon">{v.icon}</span>
            <h3>{v.title}</h3>
            <p>{v.text}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Awards */}
    <div className="ab-awards-section">
      <SectionTitle subtitle="Recognition from industry leaders" centered>
        Awards & Recognition
      </SectionTitle>
      <div className="ab-awards-grid">
        {AWARDS.map((award, idx) => (
          <div key={idx} className="ab-award-card">
            <div className="ab-award-icon">{award.icon}</div>
            <h4>{award.title}</h4>
            <p>{award.org}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Platform features */}
    <div className="ab-features-wrap">
      <SectionTitle
        subtitle="Everything designed around authentic IELTS experience"
        centered
      >
        Platform Features
      </SectionTitle>
      <div className="ab-features-grid">
        {FEATURES.map((f) => (
          <div key={f.title} className="ab-feature-card">
            <div className="ab-feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
