// src/features/about/sections/HeroSection.jsx
import React from "react";
import { ACADEMY_INFO } from "../data/academyInfo";
import { ABtn } from "../ui/ABtn";

const HERO_STATS = [
  { num: "2,500+", label: "Students Trained" },
  { num: "90%", label: "Band 7+ Rate" },
  { num: "12+", label: "Years Excellence" },
  { num: "40+", label: "Universities" },
];

export const HeroSection = () => (
  <section className="ab-hero" aria-labelledby="hero-title">
    <div className="ab-hero-content">
      <div className="ab-hero-badge">
        <span className="ab-hero-est">Est. {ACADEMY_INFO.established}</span>
        <span className="ab-hero-loc">{ACADEMY_INFO.location}</span>
      </div>
      <h1 id="hero-title" className="ab-hero-title">
        {ACADEMY_INFO.name}
      </h1>
      <p className="ab-hero-tagline">{ACADEMY_INFO.tagline}</p>
      <p className="ab-hero-desc">
        Empowering students across Surkhandarya and beyond to achieve confident IELTS
        scores and unlock global academic opportunities through expert instruction and
        cutting-edge practice.
      </p>
      <div className="ab-hero-cta">
        <ABtn variant="primary" size="lg" href="#events">
          Explore Events
        </ABtn>
        <ABtn variant="outline" size="lg" href="#faculty">
          Meet Our Faculty
        </ABtn>
      </div>
      <div className="ab-hero-stats">
        {HERO_STATS.map((s) => (
          <div key={s.label} className="ab-hero-stat">
            <span className="ab-hero-stat-num">{s.num}</span>
            <span className="ab-hero-stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>

    <div className="ab-hero-visual">
      <div className="ab-hero-img-wrap">
        <img
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&q=85"
          alt="Oxbridge Academy students in modern classroom"
          className="ab-hero-img"
          loading="eager"
        />
        <div className="ab-hero-overlay">
          <div className="ab-testimonial">
            <p>
              "Thanks to Oxbridge, I achieved Band 8.0 and got into my dream university!"
            </p>
            <span>— Alisher K., Cambridge University '24</span>
          </div>
        </div>
        <div className="ab-hero-float-card">
          <div className="ab-hero-float-band">8.5</div>
          <div>
            <p className="ab-hero-float-label">Latest Graduate</p>
            <p className="ab-hero-float-sub">IELTS Band Score</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);
