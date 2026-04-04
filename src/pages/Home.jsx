import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/features/auth/authStore";
import "../styles/globals.css";

export function Home() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuthStore();
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll progress tracker
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (scrollTop / docHeight) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: "📝",
      title: "Vocabulary Builder",
      desc: "Learn 1000+ IELTS words with spaced repetition & context",
      color: "#6366f1",
      highlights: ["Flashcards", "Audio", "Quizzes"],
      link: "/vocabulary-builder",
    },
    {
      icon: "🔍",
      title: "Grammar Checker",
      desc: "Master 200+ exercises across 20 grammar rules",
      color: "#ec4899",
      highlights: ["Interactive", "100+ Exercises", "Instant Feedback"],
      link: "/grammar-checker",
    },
    {
      icon: "✍️",
      title: "Essay Templates",
      desc: "Band 8+ writing samples with proven structures",
      color: "#8b5cf6",
      highlights: ["Task 1 & 2", "Real Samples", "Practice Tasks"],
      link: "/essay-templates",
    },
    {
      icon: "📖",
      title: "Reading Speed Trainer",
      desc: "Scan and skim with 9 authentic passages",
      color: "#10b981",
      highlights: ["Timed Practice", "Comprehension Tests", "Analytics"],
      link: "/reading-speed-trainer",
    },
    {
      icon: "🃏",
      title: "Flashcard Deck",
      desc: "32+ flashcards for idioms, phrases & collocations",
      color: "#ec4899",
      highlights: ["Gamified", "Multiple Modes", "Progress Tracking"],
      link: "/flashcard-deck",
    },
    {
      icon: "🎯",
      title: "Score Predictor",
      desc: "Predict your band score with 95% accuracy",
      color: "#f97316",
      highlights: ["AI-Powered", "Real-Time", "Detailed Analysis"],
      link: "/score-predictor",
    },
    {
      icon: "📊",
      title: "Progress Dashboard",
      desc: "Track learning with detailed analytics",
      color: "#06b6d4",
      highlights: ["Real-time Stats", "Goal Tracking", "Insights"],
      link: "/dashboard",
    },
    {
      icon: "🗓️",
      title: "Study Planner",
      desc: "Personalized 30/60/90 day study schedule",
      color: "#f59e0b",
      highlights: ["AI-Powered", "Adaptive", "Reminders"],
      link: "/study-planner",
    },
    {
      icon: "💬",
      title: "Community Forum",
      desc: "Connect with 10,000+ students globally",
      color: "#14b8a6",
      highlights: ["Q&A", "Tips", "Motivation"],
      link: "/community",
    },
  ];

  const stats = [
    { number: "10K+", label: "Happy Students", icon: "👥", detail: "Worldwide" },
    { number: "50+", label: "Study Tools", icon: "🛠️", detail: "Interactive" },
    { number: "8.5", label: "Avg Band Score", icon: "🎯", detail: "Achieved" },
    { number: "24/7", label: "Expert Support", icon: "💬", detail: "Available" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      band: "8.5",
      text: "Oxbridge changed my life! The study tools are amazing and the community is so supportive. I went from 6.5 to 8.5 in just 3 months! The Grammar Checker alone helped me fix so many mistakes I didn't even know I was making.",
      avatar: "👩‍🎓",
      location: "London, UK",
      improvement: "+2.0",
      time: "3 months",
    },
    {
      name: "Ahmed Hassan",
      band: "8.0",
      text: "Best IELTS platform I've used. The personalized study plan helped me focus on my weak areas. The Vocabulary Builder made learning so fun and effective. I actually looked forward to studying every day!",
      avatar: "👨‍🎓",
      location: "Cairo, Egypt",
      improvement: "+1.5",
      time: "2 months",
    },
    {
      name: "Maria Garcia",
      band: "7.5",
      text: "The practice tests are so realistic and helpful. I loved the vocabulary builder and grammar checker. The essay templates gave me confidence for writing task. Worth every penny and highly recommended!",
      avatar: "👩",
      location: "Madrid, Spain",
      improvement: "+1.2",
      time: "2.5 months",
    },
    {
      name: "Hiroshi Tanaka",
      band: "8.0",
      text: "As a Japanese speaker, I struggled with pronunciation and listening. This platform has everything I needed. The community support was incredible and motivating. Thank you Oxbridge!",
      avatar: "👨",
      location: "Tokyo, Japan",
      improvement: "+1.8",
      time: "3 months",
    },
  ];

  const pricingPlans = [
    {
      id: "free",
      name: "Starter",
      price: "FREE",
      period: "Forever",
      description: "Perfect to get started",
      features: [
        { text: "5 Practice Tests", icon: "✓" },
        { text: "Basic Vocabulary (100 words)", icon: "✓" },
        { text: "Grammar Basics", icon: "✓" },
        { text: "Community Forum", icon: "✓" },
        { text: "Premium Tools", icon: "✗" },
        { text: "Expert Support", icon: "✗" },
        { text: "Personalized Plan", icon: "✗" },
        { text: "Score Predictor", icon: "✗" },
      ],
      cta: "Get Started",
      ctaStyle: "secondary",
    },
    {
      id: "pro",
      name: "Pro",
      price: "$29",
      period: "/month",
      description: "Most popular choice",
      features: [
        { text: "Unlimited Tests", icon: "✓" },
        { text: "Full Vocabulary (1000+ words)", icon: "✓" },
        { text: "200+ Grammar Exercises", icon: "✓" },
        { text: "Essay Templates & Samples", icon: "✓" },
        { text: "All Premium Tools", icon: "✓" },
        { text: "Email Support", icon: "✓" },
        { text: "Personalized Study Plan", icon: "✓" },
        { text: "Score Predictor (95% Accurate)", icon: "✓" },
      ],
      cta: "Start Free Trial",
      ctaStyle: "primary",
      badge: "MOST POPULAR",
      popular: true,
    },
    {
      id: "premium",
      name: "Premium+",
      price: "$59",
      period: "/month",
      description: "Maximum results",
      features: [
        { text: "Everything in Pro", icon: "✓" },
        { text: "1-on-1 Expert Coaching", icon: "✓" },
        { text: "Live Group Classes (2x/week)", icon: "✓" },
        { text: "Priority Support (24/7)", icon: "✓" },
        { text: "Advanced Analytics", icon: "✓" },
        { text: "Custom Study Plans", icon: "✓" },
        { text: "Mock Interview Practice", icon: "✓" },
        { text: "Certificate of Completion", icon: "✓" },
      ],
      cta: "Schedule Demo",
      ctaStyle: "secondary",
    },
  ];

  const faqs = [
    {
      q: "How does Oxbridge help me prepare for IELTS?",
      a: "Oxbridge provides 50+ interactive study tools including vocabulary builders, grammar checkers, essay templates, reading speed trainers, and more. Our AI-powered score predictor gives you a realistic band score estimate with 95% accuracy. Combined with personalized study plans and 24/7 expert support, you'll have everything needed to achieve your target band.",
    },
    {
      q: "Can I start learning for free?",
      a: "Absolutely! Our free Starter plan includes 5 practice tests, basic vocabulary (100 words), grammar fundamentals, and access to our community forum. You can experience the platform completely free. Upgrade to Pro anytime to unlock premium features like unlimited tests, 1000+ vocabulary words, 200+ grammar exercises, and expert support.",
    },
    {
      q: "How accurate is the band score prediction?",
      a: "Our algorithm predicts your band score with 95% accuracy based on analysis from thousands of test results. It analyzes your performance across all skills (Reading, Writing, Listening, Speaking) and provides detailed insights. It's like having a practice exam evaluated by IELTS experts. The more you practice, the more accurate the prediction becomes.",
    },
    {
      q: "Do I get support if I'm stuck?",
      a: "Yes! Our community forum has 10,000+ active students sharing tips daily. Pro members get email support, and Premium+ members get 24/7 priority support from IELTS experts. We also offer 1-on-1 coaching for Premium+ members. You're never alone in your IELTS journey with us!",
    },
    {
      q: "What's the difference between plans?",
      a: "Starter (Free): 5 tests, basic vocabulary, community access. Pro ($29/mo): Unlimited tests, 1000+ words, 200+ exercises, essay templates, all tools, personalized plan. Premium+ ($59/mo): Everything in Pro + 1-on-1 coaching, live classes, priority support, advanced analytics, mock interviews.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes! You can cancel your subscription anytime with no questions asked. No hidden fees, no long-term contracts. If you're not satisfied with Pro or Premium+, we offer a 14-day money-back guarantee. Your satisfaction is our priority!",
    },
    {
      q: "How long does it take to see results?",
      a: "Most students see improvement in 4-6 weeks with consistent practice (30 mins/day). Average band score improvement is +1.5 in 2-3 months. Sarah improved from 6.5 to 8.5 in 3 months. Results depend on starting level and practice consistency. Our personalized study plan optimizes your prep timeline.",
    },
    {
      q: "What if I'm a complete beginner?",
      a: "Perfect! Oxbridge is designed for all levels from beginners to advanced. Start with our Starter plan to build fundamentals. Our tools have adaptive difficulty that adjusts based on your performance. The community forum has thousands of beginners sharing their journey. You'll feel supported every step of the way!",
    },
  ];

  const benefits = [
    {
      icon: "⚡",
      title: "Save Time",
      desc: "Focused learning with no wasted effort. Our AI identifies your weak areas.",
      detail: "Average student saves 50 hours compared to traditional tutoring",
    },
    {
      icon: "💰",
      title: "Save Money",
      desc: "99% cheaper than private tutoring with equal or better results.",
      detail: "Tutoring costs $40-100/hour. We're $29/month for unlimited access",
    },
    {
      icon: "🎯",
      title: "Guaranteed Results",
      desc: "Our success rate is 94%. Most students achieve their target band.",
      detail: "Join 10,000+ happy students who've succeeded with Oxbridge",
    },
    {
      icon: "📚",
      title: "Learn Anywhere",
      desc: "Study on your phone, tablet, or desktop. 100% accessible offline.",
      detail: "Practice on your commute, during lunch, or before bed",
    },
  ];

  const trustSignals = [
    { emoji: "📜", text: "IELTS British Council Verified", desc: "Aligned with official standards" },
    { emoji: "🏆", text: "Award-Winning Platform", desc: "Best EdTech 2024" },
    { emoji: "🔒", text: "100% Secure & Private", desc: "SSL encrypted, GDPR compliant" },
    { emoji: "👨‍🏫", text: "Expert Team", desc: "Former IELTS examiners" },
  ];

  return (
    <div style={{ overflowX: "hidden" }}>
      {/* Scroll Progress Bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "4px",
          background: `linear-gradient(90deg, #a81011, #d42022)`,
          width: `${scrollProgress}%`,
          zIndex: 1000,
          transition: "width 0.1s linear",
        }}
      />

      {/* ════════════════════════════════════════
          NAVIGATION NOTIFICATION BAR
      ════════════════════════════════════════ */}
      <div
        style={{
          background: "linear-gradient(90deg, #a81011, #d42022)",
          color: "#fff",
          padding: "12px 24px",
          textAlign: "center",
          fontSize: "0.9rem",
          fontWeight: 600,
        }}
      >
        🎉 New: 200+ Grammar Exercises & 9 Reading Passages Just Added! Limited Time: 50% Off Premium+
      </div>

      {/* ════════════════════════════════════════
          HERO SECTION - Premium First Impression
      ════════════════════════════════════════ */}
      <section
        style={{
          background: "linear-gradient(135deg, #fdf0f0 0%, #f4f6fb 50%, #fff 100%)",
          padding: "100px 28px 80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated background elements */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 300,
            height: 300,
            background: "radial-gradient(circle, rgba(168,16,17,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
            animation: "float 6s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -50,
            right: -50,
            width: 250,
            height: 250,
            background: "radial-gradient(circle, rgba(201,162,39,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
            animation: "float 8s ease-in-out infinite reverse",
          }}
        />

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(20px); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
            animation: "slideIn 0.6s ease-out",
          }}
        >
          {/* Welcome badge */}
          <div
            style={{
              display: "inline-block",
              background: "#fff",
              border: "1px solid rgba(168,16,17,0.2)",
              borderRadius: "50px",
              padding: "10px 20px",
              marginBottom: "24px",
              fontSize: "0.85rem",
              fontWeight: 700,
              color: "#a81011",
            }}
          >
            ✨ Join 10,000+ Students Succeeding in IELTS
          </div>

          <h1
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "clamp(2.2rem, 6vw, 4rem)",
              fontWeight: 800,
              color: "#0c1f4a",
              marginBottom: "20px",
              lineHeight: 1.2,
              letterSpacing: "-0.5px",
            }}
          >
            Your Friendly IELTS <br />
            <span style={{ color: "#a81011" }}>Study Companion</span>
          </h1>

          <p
            style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "#475569",
              maxWidth: "600px",
              margin: "0 auto 40px",
              lineHeight: 1.8,
              letterSpacing: "0.3px",
            }}
          >
            Master IELTS with 50+ interactive tools, expert-designed courses, and a supportive global community. Learn at your own pace, track your progress, and achieve your target band score with confidence.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "40px" }}>
            <button
              onClick={() => setLocation(isAuthenticated ? "/study-tools" : "/register")}
              style={{
                padding: "16px 48px",
                background: "linear-gradient(135deg, #a81011, #d42022)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 8px 24px rgba(168,16,17,0.3)",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 36px rgba(168,16,17,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(168,16,17,0.3)";
              }}
            >
              🚀 Start Free
            </button>
            <button
              onClick={() => setLocation("/about")}
              style={{
                padding: "16px 48px",
                background: "#fff",
                color: "#a81011",
                border: "2px solid #a81011",
                borderRadius: "12px",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fdf0f0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fff";
              }}
            >
              📚 Explore More
            </button>
          </div>

          {/* Trust badges */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              flexWrap: "wrap",
              paddingTop: "32px",
              borderTop: "1px solid rgba(226,232,240,0.5)",
            }}
          >
            {[
              { icon: "✓", text: "No credit card needed" },
              { icon: "✓", text: "Instant access" },
              { icon: "✓", text: "14-day money-back guarantee" },
            ].map((badge, idx) => (
              <p
                key={idx}
                style={{
                  fontSize: "0.9rem",
                  color: "#475569",
                  fontWeight: 600,
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ color: "#10b981", fontSize: "1.1rem" }}>{badge.icon}</span>
                {badge.text}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TRUST SIGNALS SECTION
      ════════════════════════════════════════ */}
      <section
        style={{
          background: "#fff",
          padding: "40px 28px",
          borderTop: "1px solid #e2e8f0",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "32px",
          }}
        >
          {trustSignals.map((signal, idx) => (
            <div key={idx} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "2rem", margin: "0 0 8px 0" }}>
                {signal.emoji}
              </p>
              <p style={{
                fontWeight: 700,
                color: "#0f172a",
                fontSize: "0.9rem",
                margin: "0 0 4px 0",
              }}>
                {signal.text}
              </p>
              <p style={{
                fontSize: "0.8rem",
                color: "#94a3b8",
                margin: 0,
              }}>
                {signal.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          STATS SECTION - Social Proof
      ════════════════════════════════════════ */}
      <section
        style={{
          background: "#fff",
          padding: "60px 28px",
        }}
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "32px",
            textAlign: "center",
          }}
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              style={{
                padding: "20px",
                borderRadius: "12px",
                background: "#f9fafb",
              }}
            >
              <p style={{ fontSize: "2.5rem", margin: "0 0 8px 0" }}>
                {stat.icon}
              </p>
              <p
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 800,
                  color: "#a81011",
                  margin: "0 0 8px 0",
                }}
              >
                {stat.number}
              </p>
              <p
                style={{
                  color: "#475569",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  margin: "0 0 4px 0",
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  color: "#94a3b8",
                  fontSize: "0.8rem",
                  margin: 0,
                }}
              >
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURES SECTION - Complete Toolkit
      ════════════════════════════════════════ */}
      <section
        style={{
          background: "linear-gradient(180deg, #f9fafb 0%, #fff 100%)",
          padding: "80px 28px",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                color: "#0c1f4a",
                marginBottom: "16px",
              }}
            >
              Your Complete Learning Toolkit 🛠️
            </h2>
            <p
              style={{
                fontSize: "1.05rem",
                color: "#475569",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Everything you need to master IELTS in one friendly, intuitive platform
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {features.map((feature, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredFeature(idx)}
                onMouseLeave={() => setHoveredFeature(null)}
                onClick={() => setLocation(feature.link)}
                style={{
                  background: "#fff",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "28px 24px",
                  transition: "all 0.3s",
                  cursor: "pointer",
                  transform: hoveredFeature === idx ? "translateY(-8px)" : "translateY(0)",
                  borderColor: hoveredFeature === idx ? `${feature.color}40` : "#e2e8f0",
                  boxShadow:
                    hoveredFeature === idx
                      ? `0 16px 40px ${feature.color}25`
                      : "0 2px 8px rgba(15,23,42,0.07)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2.2rem",
                      transform: hoveredFeature === idx ? "scale(1.15)" : "scale(1)",
                      transition: "transform 0.3s",
                    }}
                  >
                    {feature.icon}
                  </div>
                  <div
                    style={{
                      width: "3px",
                      height: "40px",
                      background: feature.color,
                      borderRadius: "2px",
                      opacity: hoveredFeature === idx ? 1 : 0.2,
                      transition: "opacity 0.3s",
                    }}
                  />
                </div>

                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "#0f172a",
                    marginBottom: "8px",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    color: "#475569",
                    fontSize: "0.9rem",
                    marginBottom: "16px",
                    lineHeight: 1.6,
                  }}
                >
                  {feature.desc}
                </p>

                {/* Highlights */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {feature.highlights.map((highlight, hIdx) => (
                    <span
                      key={hIdx}
                      style={{
                        background: `${feature.color}15`,
                        color: feature.color,
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          BENEFITS SECTION
      ════════════════════════════════════════ */}
      <section
        style={{
          background: "#fff",
          padding: "80px 28px",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                color: "#0c1f4a",
                marginBottom: "16px",
              }}
            >
              Why Oxbridge? 💡
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "28px",
            }}
          >
            {benefits.map((benefit, idx) => (
              <div
                key={idx}
                style={{
                  padding: "28px",
                  background: "linear-gradient(145deg, #f9fafb, #fff)",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: "2.5rem", margin: "0 0 12px 0" }}>
                  {benefit.icon}
                </p>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#0f172a",
                    marginBottom: "8px",
                  }}
                >
                  {benefit.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#475569",
                    marginBottom: "12px",
                    lineHeight: 1.6,
                  }}
                >
                  {benefit.desc}
                </p>
                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#a81011",
                    fontWeight: 600,
                    margin: 0,
                  }}
                >
                  {benefit.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TESTIMONIALS - Community Love
      ════════════════════════════════════════ */}
      <section
        style={{
          background: "linear-gradient(180deg, #fff 0%, #f9fafb 100%)",
          padding: "80px 28px",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                color: "#0c1f4a",
                marginBottom: "16px",
              }}
            >
              Our Students Love Us ❤️
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "#475569",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Join thousands of happy students who've successfully achieved their target band
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                style={{
                  background: "linear-gradient(145deg, #fdf0f0, #fff)",
                  border: "1px solid rgba(168,16,17,0.2)",
                  borderRadius: "16px",
                  padding: "28px 24px",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(168,16,17,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Stars & Improvement */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ fontSize: "1rem" }}>⭐⭐⭐⭐⭐</div>
                  <div
                    style={{
                      background: "#f0fdf4",
                      color: "#16a34a",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                    }}
                  >
                    {testimonial.improvement} in {testimonial.time}
                  </div>
                </div>

                {/* Quote */}
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "#475569",
                    lineHeight: 1.6,
                    marginBottom: "20px",
                    fontStyle: "italic",
                  }}
                >
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      fontSize: "2rem",
                      width: "48px",
                      height: "48px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#fdf0f0",
                      borderRadius: "50%",
                    }}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        color: "#0f172a",
                        margin: 0,
                      }}
                    >
                      {testimonial.name}
                    </p>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#a81011",
                        fontWeight: 700,
                        margin: "4px 0 0 0",
                      }}
                    >
                      Band {testimonial.band} • {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PRICING SECTION
      ════════════════════════════════════════ */}
      <section
        style={{
          background: "#fff",
          padding: "80px 28px",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                color: "#0c1f4a",
                marginBottom: "16px",
              }}
            >
              Simple, Transparent Pricing 💰
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "#475569",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Choose the plan that fits your needs. All plans include community access and basic tools.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "24px",
              marginBottom: "40px",
            }}
          >
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                style={{
                  background: "#fff",
                  border: plan.popular ? "2px solid #a81011" : "1px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "32px 24px",
                  position: "relative",
                  transition: "all 0.3s",
                  transform: plan.popular ? "scale(1.02)" : "scale(1)",
                }}
                onMouseEnter={(e) => {
                  if (!plan.popular) {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 16px 40px rgba(15,23,42,0.12)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!plan.popular) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                {plan.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-12px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "#a81011",
                      color: "#fff",
                      padding: "6px 16px",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      letterSpacing: "1px",
                    }}
                  >
                    {plan.badge}
                  </div>
                )}

                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: "#0f172a",
                    marginBottom: "8px",
                  }}
                >
                  {plan.name}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#94a3b8",
                    marginBottom: "20px",
                  }}
                >
                  {plan.description}
                </p>

                <div style={{ marginBottom: "28px" }}>
                  <span
                    style={{
                      fontSize: "2.8rem",
                      fontWeight: 800,
                      color: "#0f172a",
                    }}
                  >
                    {plan.price}
                  </span>
                  <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
                    {plan.period}
                  </span>
                </div>

                <button
                  onClick={() => setLocation(plan.id === "free" ? "/register" : "/checkout")}
                  style={{
                    width: "100%",
                    padding: "14px",
                    background:
                      plan.ctaStyle === "primary"
                        ? "linear-gradient(135deg, #a81011, #d42022)"
                        : "#fff",
                    color:
                      plan.ctaStyle === "primary" ? "#fff" : "#a81011",
                    border:
                      plan.ctaStyle === "primary"
                        ? "none"
                        : "2px solid #a81011",
                    borderRadius: "10px",
                    fontWeight: 700,
                    cursor: "pointer",
                    marginBottom: "24px",
                    transition: "all 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    if (plan.ctaStyle === "primary") {
                      e.target.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  {plan.cta}
                </button>

                {/* Features list */}
                <div style={{ display: "grid", gap: "12px" }}>
                  {plan.features.map((feature, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "0.9rem",
                        color: feature.icon === "✓" ? "#475569" : "#cbd5e1",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "1.2rem",
                          color:
                            feature.icon === "✓" ? "#10b981" : "#cbd5e1",
                        }}
                      >
                        {feature.icon}
                      </span>
                      {feature.text}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Money-back guarantee */}
          <div
            style={{
              textAlign: "center",
              padding: "28px",
              background: "#f9fafb",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}
          >
            <p style={{ fontSize: "1rem", color: "#0f172a", fontWeight: 700, margin: 0 }}>
              💰 14-Day Money-Back Guarantee
            </p>
            <p style={{ color: "#475569", fontSize: "0.9rem", margin: "8px 0 0 0" }}>
              Not satisfied? Get a full refund within 14 days. No questions asked. Your satisfaction is our priority!
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FAQ SECTION - Answers & Trust
      ════════════════════════════════════════ */}
      <section
        style={{
          background: "linear-gradient(135deg, #f9fafb 0%, #fff 100%)",
          padding: "80px 28px",
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                color: "#0c1f4a",
                marginBottom: "16px",
              }}
            >
              Frequently Asked Questions 🤔
            </h2>
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                open={expandedFaq === idx}
                onClick={() => setExpandedFaq(expandedFaq === idx ? -1 : idx)}
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "20px 24px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                <summary
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#0f172a",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    userSelect: "none",
                  }}
                >
                  {faq.q}
                  <span
                    style={{
                      transform:
                        expandedFaq === idx ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s",
                      fontSize: "1.2rem",
                    }}
                  >
                    ▼
                  </span>
                </summary>
                <p
                  style={{
                    color: "#475569",
                    marginTop: "12px",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    margin: "12px 0 0 0",
                  }}
                >
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA SECTION - Final Push
      ════════════════════════════════════════ */}
      <section
        style={{
          background: "linear-gradient(135deg, #a81011 0%, #d42022 100%)",
          padding: "100px 28px 80px",
          color: "#fff",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -50,
            right: -50,
            width: 300,
            height: 300,
            background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h2
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 800,
              marginBottom: "16px",
            }}
          >
            Ready to Achieve Your Target Band? 🎯
          </h2>
          <p
            style={{
              fontSize: "1.05rem",
              marginBottom: "32px",
              opacity: 0.95,
              lineHeight: 1.6,
            }}
          >
            Join thousands of successful students who've mastered IELTS with Oxbridge. Start your 14-day free trial today—no credit card required. Limited time: Get 50% off Premium+ with code IELTS50! 🚀
          </p>
          <button
            onClick={() => setLocation(isAuthenticated ? "/study-tools" : "/register")}
            style={{
              padding: "16px 48px",
              background: "#fff",
              color: "#a81011",
              border: "none",
              borderRadius: "12px",
              fontSize: "1rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.3s",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
            }}
          >
            Start Your Free Trial →
          </button>
        </div>
      </section>

    </div>
  );
}

export default Home;