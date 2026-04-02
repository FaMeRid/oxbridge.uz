// src/pages/About.jsx
import React, { useState, useMemo } from "react";
import "@/styles/globals.css";
import "@/styles/aboutPage.css";

// ============================================
// CONSTANTS
// ============================================
const ACADEMY_INFO = {
  name:        "Oxbridge English Academy",
  established: 2014,
  location:    "Termez, Surkhandarya Region, Uzbekistan",
  tagline:     "Where Excellence Meets IELTS Success",
};

const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/oxbridgeuz/",
  telegram:  "https://t.me/oxbridgeuz",
  youtube:   "https://youtube.com/@oxbridgeuz",
  email:     "info@oxbridgeuz.com",
  phone:     "+998 99 999 99 99",
};

// ============================================
// MOCK DATA — FACULTY
// ============================================
const FACULTY_MEMBERS = [
  {
    id: 1,
    name:           "Dr. Sarah Mitchell",
    role:           "Head of IELTS Preparation",
    credentials:    "PhD in Applied Linguistics, Cambridge CELTA",
    experience:     "12+ years",
    specialization: "Academic Writing & Speaking",
    bio:            "Former IELTS examiner with expertise in band 7+ strategies. Published researcher in second language acquisition.",
    image:          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    achievements:   ["500+ students achieved Band 7+", "IELTS Examiner 2015-2020", "Cambridge Assessment Expert"],
    social: { linkedin: "#", email: "s.mitchell@oxbridgeuz.com" },
  },
  {
    id: 2,
    name:           "James Anderson",
    role:           "Senior IELTS Instructor",
    credentials:    "MA TESOL, British Council Certified",
    experience:     "8 years",
    specialization: "Listening & Reading Strategies",
    bio:            "Specializes in rapid score improvement techniques. Expert in IELTS computer-delivered test preparation.",
    image:          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    achievements:   ["Average student improvement: 1.5 bands", "British Council Trainer 2019-2022"],
    social: { linkedin: "#", email: "j.anderson@oxbridgeuz.com" },
  },
  {
    id: 3,
    name:           "Dr. Fatima Karimova",
    role:           "Academic Director",
    credentials:    "PhD in Education, DELTA Certified",
    experience:     "15 years",
    specialization: "Curriculum Development",
    bio:            "Leads curriculum design ensuring alignment with latest IELTS assessment criteria. Expert in bilingual education.",
    image:          "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    achievements:   ["Developed 3 IELTS preparation programs", "Ministry of Education Consultant"],
    social: { linkedin: "#", email: "f.karimova@oxbridgeuz.com" },
  },
  {
    id: 4,
    name:           "Michael Chen",
    role:           "IELTS Speaking Specialist",
    credentials:    "Cambridge DELTA, TESL Canada",
    experience:     "6 years",
    specialization: "Speaking Fluency & Pronunciation",
    bio:            "Native speaker from Canada. Expert in pronunciation coaching and speaking confidence building.",
    image:          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    achievements:   ["100% student satisfaction rate", "Created pronunciation app used by 2000+ students"],
    social: { linkedin: "#", email: "m.chen@oxbridgeuz.com" },
  },
  {
    id: 5,
    name:           "Dr. Elena Petrova",
    role:           "Writing Task 2 Expert",
    credentials:    "PhD in English Literature, IELTS 9.0",
    experience:     "10 years",
    specialization: "Essay Writing & Grammar",
    bio:            "Expert in academic writing structures. Author of 'IELTS Writing Mastery' textbook.",
    image:          "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&h=400&fit=crop",
    achievements:   ["Published author", "90% of students achieve Band 6.5+ in Writing"],
    social: { linkedin: "#", email: "e.petrova@oxbridgeuz.com" },
  },
  {
    id: 6,
    name:           "David Thompson",
    role:           "Listening & Reading Coach",
    credentials:    "MA Applied Linguistics, Trinity CertTESOL",
    experience:     "7 years",
    specialization: "Test Strategies & Time Management",
    bio:            "Expert in IELTS question pattern analysis. Developed unique speed-reading techniques for IELTS.",
    image:          "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
    achievements:   ["Created 50+ practice tests", "Average reading score improvement: 2 bands"],
    social: { linkedin: "#", email: "d.thompson@oxbridgeuz.com" },
  },
];

// ============================================
// MOCK DATA — EVENTS (dynamic dates)
// ============================================
function makeDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

const ACADEMY_EVENTS = [
  {
    id: 1, title: "IELTS Mock Test Day",
    date: makeDate(5),  time: "09:00 - 13:00",
    type: "Exam Simulation", location: "Main Campus, Room 301",
    description: "Full IELTS simulation under real exam conditions. Detailed feedback within 48 hours.",
    spots: 20, spotsLeft: 8, featured: true,
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=300&fit=crop",
  },
  {
    id: 2, title: "Speaking Masterclass: Band 7+ Strategies",
    date: makeDate(10), time: "15:00 - 17:00",
    type: "Workshop", location: "Conference Hall B",
    description: "Intensive speaking practice with Dr. Mitchell. Focus on Part 2 long turns and Part 3 discussion.",
    spots: 25, spotsLeft: 12, featured: false,
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=300&fit=crop",
  },
  {
    id: 3, title: "Writing Task 2: Essay Structures",
    date: makeDate(14), time: "14:00 - 16:30",
    type: "Workshop", location: "Room 205",
    description: "Learn proven structures for Opinion, Discussion, and Problem-Solution essays.",
    spots: 30, spotsLeft: 5, featured: true,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=300&fit=crop",
  },
  {
    id: 4, title: "University Application Workshop",
    date: makeDate(18), time: "16:00 - 18:00",
    type: "Seminar", location: "Main Auditorium",
    description: "Guidance on UK, US, and Australian university applications. Personal statement writing tips.",
    spots: 50, spotsLeft: 23, featured: false,
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=300&fit=crop",
  },
  {
    id: 5, title: "Listening: Advanced Strategies",
    date: makeDate(22), time: "10:00 - 12:00",
    type: "Workshop", location: "Room 302",
    description: "Master Section 3 and 4 with prediction techniques and note-taking strategies.",
    spots: 20, spotsLeft: 15, featured: false,
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=300&fit=crop",
  },
  {
    id: 6, title: "Graduation Ceremony: Spring 2026",
    date: makeDate(35), time: "18:00 - 20:00",
    type: "Ceremony", location: "Grand Hall",
    description: "Celebrating students who achieved their target bands. Awards and certificates presentation.",
    spots: 100, spotsLeft: 45, featured: true,
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=300&fit=crop",
  },
];

// ============================================
// UTILITY
// ============================================
const getDaysUntil = (dateString) => {
  const diff = new Date(dateString) - new Date();
  return Math.ceil(diff / 86400000);
};

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });

// ============================================
// ICONS (SVG inline — no external deps)
// ============================================
const Icons = {
  Instagram: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  ),
  Telegram: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  ),
  Youtube: ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  Mail: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  LinkedIn: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  Clock:    ({ size = 15 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>,
  MapPin:   ({ size = 15 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Users:    ({ size = 15 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Award:    ({ size = 14 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  ChevronRight: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="9,18 15,12 9,6"/></svg>,
};

// ============================================
// SHARED UI COMPONENTS
// ============================================
const SectionTitle = ({ children, subtitle, centered = false }) => (
  <div className={`ab-section-header${centered ? " centered" : ""}`}>
    <h2 className="ab-section-title">{children}</h2>
    {subtitle && <p className="ab-section-subtitle">{subtitle}</p>}
  </div>
);

const ABadge = ({ children, type = "default" }) => (
  <span className={`ab-badge ab-badge-${type}`}>{children}</span>
);

const ABtn = ({ children, variant = "primary", size = "md", href, onClick }) => {
  const cls = `ab-btn ab-btn-${variant} ab-btn-${size}`;
  if (href) return <a href={href} className={cls} target="_blank" rel="noopener noreferrer">{children}</a>;
  return <button className={cls} onClick={onClick}>{children}</button>;
};

// ============================================
// HERO SECTION
// ============================================
const HeroSection = () => (
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
        Empowering students across Surkhandarya and beyond to achieve confident IELTS scores
        and unlock global academic opportunities through expert instruction and cutting-edge practice.
      </p>
      <div className="ab-hero-cta">
        <ABtn variant="primary" size="lg" href="#events">Explore Events</ABtn>
        <ABtn variant="outline" size="lg" href="#faculty">Meet Our Faculty</ABtn>
      </div>
      <div className="ab-hero-stats">
        {[
          { num: "2,500+", label: "Students Trained" },
          { num: "90%",    label: "Band 7+ Rate" },
          { num: "12+",    label: "Years Excellence" },
          { num: "40+",    label: "Universities" },
        ].map((s) => (
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
            <p>"Thanks to Oxbridge, I achieved Band 8.0 and got into my dream university!"</p>
            <span>— Alisher K., Cambridge University '24</span>
          </div>
        </div>
        {/* floating band card */}
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

// ============================================
// TAB NAVIGATION
// ============================================
const TABS = [
  { id: "about",    label: "About Us",          icon: "🏛️" },
  { id: "faculty",  label: "Our Faculty",        icon: "👨‍🏫" },
  { id: "events",   label: "Events",             icon: "📅" },
  { id: "platform", label: "Platform",           icon: "💻" },
];

const TabNavigation = ({ activeTab, setActiveTab }) => (
  <nav className="ab-tabs" aria-label="Main sections">
    <div className="ab-tab-list">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`ab-tab-btn${activeTab === tab.id ? " active" : ""}`}
          onClick={() => setActiveTab(tab.id)}
          aria-selected={activeTab === tab.id}
          role="tab"
        >
          <span className="ab-tab-icon">{tab.icon}</span>
          <span className="ab-tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  </nav>
);

// ============================================
// ABOUT TAB
// ============================================
const AboutTab = () => (
  <div className="ab-tab-content">

    <div className="ab-about-grid">
      {/* Story */}
      <div className="ab-story">
        <SectionTitle subtitle="A decade transforming English education in Uzbekistan">
          Our Story
        </SectionTitle>
        <p className="ab-story-lead">
          Founded in 2014, Oxbridge English Academy has become the premier IELTS preparation
          centre in the Surkhandarya region.
        </p>
        <p style={{ marginBottom: 16 }}>
          Our methodology combines rigorous academic standards with personalised attention.
          We focus on building genuine language competency that serves students long after
          they've achieved their target scores.
        </p>
        <p style={{ marginBottom: 24 }}>
          The Oxbridge platform extends our classroom excellence into the digital realm,
          offering full-length practice tests, detailed analytics, and seamless integration
          with our in-person curriculum.
        </p>
        <blockquote className="ab-quote">
          "The highest results in Surkhandarya — our students set ambitious goals and achieve them step by step."
        </blockquote>
      </div>

      {/* Values */}
      <div className="ab-values">
        {[
          { icon: "🚀", title: "Our Mission", text: "Deliver world-class IELTS preparation combining modern pedagogy, experienced educators, and adaptive learning paths that mirror real exam conditions." },
          { icon: "🔭", title: "Our Vision",  text: "To become the most trusted IELTS institution in Central Asia, with graduates thriving at top global universities." },
          { icon: "💡", title: "Our Values",  text: "Excellence in teaching, honesty in assessment, and respect for each learner's unique pace. Consistent effort plus expert guidance transforms bands." },
        ].map((v) => (
          <div key={v.title} className="ab-value-card">
            <span className="ab-value-icon">{v.icon}</span>
            <h3>{v.title}</h3>
            <p>{v.text}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Platform features */}
    <div className="ab-features-wrap">
      <SectionTitle subtitle="Everything designed around authentic IELTS experience" centered>
        Platform Features
      </SectionTitle>
      <div className="ab-features-grid">
        {[
          { icon: "🎧", title: "Full Mock Tests",      desc: "Complete Listening & Reading with authentic timing and scoring" },
          { icon: "👨‍🏫", title: "Teacher Integration", desc: "Join assigned tests via code — classroom and platform in sync" },
          { icon: "📊", title: "Progress Analytics",   desc: "Band tracking, skill breakdowns, and full attempt history" },
          { icon: "🛠️", title: "Study Tools",          desc: "Additional materials and simulators for daily targeted practice" },
        ].map((f) => (
          <div key={f.title} className="ab-feature-card">
            <div className="ab-feature-icon">{f.icon}</div>
            <h4>{f.title}</h4>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>

  </div>
);

// ============================================
// FACULTY TAB
// ============================================
const FacultyCard = ({ member }) => (
  <article className="ab-faculty-card">
    <div className="ab-faculty-img-wrap">
      <img src={member.image} alt={member.name} className="ab-faculty-img" loading="lazy" />
      <div className="ab-faculty-overlay">
        <div className="ab-faculty-social">
          <a href={`mailto:${member.social.email}`} className="ab-social-btn" aria-label={`Email ${member.name}`}>
            <Icons.Mail />
          </a>
          <a href={member.social.linkedin} className="ab-social-btn" aria-label={`${member.name} on LinkedIn`}>
            <Icons.LinkedIn />
          </a>
        </div>
      </div>
    </div>
    <div className="ab-faculty-body">
      <div className="ab-faculty-head">
        <h3 className="ab-faculty-name">{member.name}</h3>
        <ABadge type="primary">{member.role}</ABadge>
      </div>
      <p className="ab-faculty-creds">{member.credentials}</p>
      <div className="ab-faculty-meta">
        <span><Icons.Award /> {member.experience}</span>
        <span>{member.specialization}</span>
      </div>
      <p className="ab-faculty-bio">{member.bio}</p>
      <div className="ab-achievements">
        {member.achievements.map((a) => (
          <span key={a} className="ab-achievement">{a}</span>
        ))}
      </div>
    </div>
  </article>
);

const FacultyTab = () => (
  <div className="ab-tab-content" id="faculty">
    <SectionTitle subtitle="Learn from certified IELTS experts with decades of combined experience" centered>
      Meet Our Faculty
    </SectionTitle>
    <div className="ab-faculty-grid">
      {FACULTY_MEMBERS.map((m) => <FacultyCard key={m.id} member={m} />)}
    </div>
    <div className="ab-faculty-cta">
      <p>Interested in joining our world-class team?</p>
      <ABtn variant="outline" href={`mailto:${SOCIAL_LINKS.email}`}>View Career Opportunities</ABtn>
    </div>
  </div>
);

// ============================================
// EVENTS TAB
// ============================================
const EventCard = ({ event }) => {
  const days   = getDaysUntil(event.date);
  const isSoon = days <= 7 && days > 0;
  const isFull = event.spotsLeft === 0;
  const month  = new Date(event.date).toLocaleString("en-US", { month: "short" });
  const day    = new Date(event.date).getDate();

  return (
    <article className={`ab-event-card${event.featured ? " featured" : ""}`}>
      {event.featured && <div className="ab-event-featured">Featured</div>}
      <div className="ab-event-img-wrap">
        <img src={event.image} alt={event.title} className="ab-event-img" loading="lazy" />
        <div className="ab-event-date">
          <span className="ab-event-month">{month}</span>
          <span className="ab-event-day">{day}</span>
        </div>
      </div>
      <div className="ab-event-body">
        <div className="ab-event-head">
          <ABadge type={event.type === "Exam Simulation" ? "accent" : "secondary"}>{event.type}</ABadge>
          {isSoon && <ABadge type="urgent">In {days} days!</ABadge>}
        </div>
        <h3 className="ab-event-title">{event.title}</h3>
        <p className="ab-event-desc">{event.description}</p>
        <div className="ab-event-details">
          <span><Icons.Clock /> {event.time}</span>
          <span><Icons.MapPin /> {event.location}</span>
          <span className={isFull ? "ab-full" : ""}><Icons.Users /> {isFull ? "Fully Booked" : `${event.spotsLeft}/${event.spots} spots left`}</span>
        </div>
        <div className="ab-event-actions">
          <ABtn
            variant={isFull ? "disabled" : "primary"}
            size="sm"
            onClick={() => !isFull && alert(`Registering for: ${event.title}`)}
          >
            {isFull ? "Join Waitlist" : "Register Now"}
          </ABtn>
          <button className="ab-event-more">
            View Details <Icons.ChevronRight />
          </button>
        </div>
      </div>
    </article>
  );
};

const EventsTab = () => {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all")      return ACADEMY_EVENTS;
    if (filter === "featured") return ACADEMY_EVENTS.filter((e) => e.featured);
    return ACADEMY_EVENTS.filter((e) => e.type.toLowerCase().includes(filter));
  }, [filter]);

  const FILTERS = [
    { id: "all",      label: "All Events" },
    { id: "featured", label: "Featured"   },
    { id: "workshop", label: "Workshops"  },
    { id: "exam",     label: "Mock Tests" },
  ];

  return (
    <div className="ab-tab-content" id="events">
      <SectionTitle subtitle={`${ACADEMY_EVENTS.length} upcoming events to accelerate your IELTS journey`} centered>
        Events & Workshops
      </SectionTitle>

      <div className="ab-events-filter">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`ab-filter-btn${filter === f.id ? " active" : ""}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="ab-events-grid">
        {filtered.map((e) => <EventCard key={e.id} event={e} />)}
      </div>
    </div>
  );
};

// ============================================
// PLATFORM TAB
// ============================================
const PlatformTab = () => (
  <div className="ab-tab-content">
    <SectionTitle subtitle="Experience IELTS preparation reimagined for the digital age" centered>
      The Oxbridge Platform
    </SectionTitle>

    <div className="ab-platform-grid">
      {/* Browser mockup — flat design, no skew */}
      <div className="ab-mockup">
        <div className="ab-mockup-bar">
          <div className="ab-mockup-dots">
            <span style={{ background: "#ff5f57" }} />
            <span style={{ background: "#febc2e" }} />
            <span style={{ background: "#28c840" }} />
          </div>
          <div className="ab-mockup-url">app.oxbridgeuz.com</div>
        </div>
        <div className="ab-mockup-body">
          <div className="ab-mockup-sidebar">
            <div className="ab-mockup-avatar" />
            <div className="ab-mockup-nav">
              <div style={{ background: "var(--gold)", width: "100%" }} />
              <div style={{ width: "70%" }} />
              <div style={{ width: "55%" }} />
              <div style={{ width: "65%" }} />
            </div>
          </div>
          <div className="ab-mockup-main">
            <div className="ab-mockup-stat-row">
              {["#c9a227", "#0d7c59", "#1e5dbf"].map((c) => (
                <div key={c} className="ab-mockup-stat" style={{ borderTop: `3px solid ${c}` }} />
              ))}
            </div>
            <div className="ab-mockup-card" />
            <div className="ab-mockup-chart">
              {[60, 75, 65, 85, 80, 90].map((h, i) => (
                <div key={i} className="ab-mockup-bar-item" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="ab-platform-features">
        <h3>Why Our Platform Stands Out</h3>
        <ul className="ab-platform-list">
          {[
            { title: "Authentic Exam Interface",         desc: "Practice with the exact layout and timing of computer-delivered IELTS." },
            { title: "Instant Detailed Feedback",        desc: "Know exactly why each answer was right or wrong." },
            { title: "Teacher Dashboard Integration",    desc: "Your instructor assigns sections and tracks progress in real-time." },
            { title: "Band Score Predictor",             desc: "Our algorithm analyses patterns to predict your exam band accurately." },
          ].map((item) => (
            <li key={item.title}>
              <strong>{item.title}</strong>
              <p>{item.desc}</p>
            </li>
          ))}
        </ul>
        <ABtn variant="primary" size="lg" href="/practice">Start Free Practice</ABtn>
      </div>
    </div>
  </div>
);

// ============================================
// CONNECT SECTION
// ============================================
const ConnectSection = () => (
  <section className="ab-connect" aria-labelledby="connect-title">
    <div className="ab-connect-inner">
      <h2 id="connect-title">Connect With Us</h2>
      <p>Questions about courses, scheduling, or IELTS strategies? We're here to help.</p>
      <div className="ab-connect-grid">
        {[
          { href: SOCIAL_LINKS.instagram, Icon: Icons.Instagram, label: "Instagram", sub: "@oxbridgeuz",         cls: "instagram" },
          { href: SOCIAL_LINKS.telegram,  Icon: Icons.Telegram,  label: "Telegram",  sub: "Join our community", cls: "telegram"  },
          { href: SOCIAL_LINKS.youtube,   Icon: Icons.Youtube,   label: "YouTube",   sub: "Free IELTS tips",    cls: "youtube"   },
          { href: `mailto:${SOCIAL_LINKS.email}`, Icon: Icons.Mail, label: "Email", sub: SOCIAL_LINKS.email,   cls: "email"     },
        ].map((c) => (
          <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
            className={`ab-connect-card ${c.cls}`}>
            <div className="ab-connect-icon"><c.Icon size={24} /></div>
            <div>
              <strong>{c.label}</strong>
              <span>{c.sub}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// MAIN COMPONENT
// ============================================
export default function About() {
  const [activeTab, setActiveTab] = useState("about");

  const renderTab = () => {
    switch (activeTab) {
      case "about":    return <AboutTab />;
      case "faculty":  return <FacultyTab />;
      case "events":   return <EventsTab />;
      case "platform": return <PlatformTab />;
      default:         return <AboutTab />;
    }
  };

  return (
    <div className="ab-page">
      <HeroSection />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="ab-main">{renderTab()}</main>
      <ConnectSection />
    </div>
  );
}
