import React, { useState } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/features/auth/authStore";
import "../styles/globals.css";

export function Home() {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuthStore();
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: "📝",
      title: "Vocabulary Builder",
      desc: "Learn 1000+ IELTS words with spaced repetition",
      color: "#6366f1",
    },
    {
      icon: "🔍",
      title: "Grammar Checker",
      desc: "Master common mistakes and improve writing",
      color: "#ec4899",
    },
    {
      icon: "🗣️",
      title: "Pronunciation Guide",
      desc: "Perfect British English pronunciation",
      color: "#f59e0b",
    },
    {
      icon: "📖",
      title: "Reading Speed Trainer",
      desc: "Scan and skim like a pro",
      color: "#10b981",
    },
    {
      icon: "🎧",
      title: "Listening Lab",
      desc: "Practice with authentic audio clips",
      color: "#3b82f6",
    },
    {
      icon: "✍️",
      title: "Essay Templates",
      desc: "Band 8+ writing samples and tips",
      color: "#8b5cf6",
    },
    {
      icon: "🃏",
      title: "Flashcard Deck",
      desc: "Learn idioms and collocations fast",
      color: "#ec4899",
    },
    {
      icon: "📊",
      title: "Score Predictor",
      desc: "Know your band score before exam",
      color: "#f97316",
    },
    {
      icon: "🗓️",
      title: "Study Planner",
      desc: "Personalized study schedule",
      color: "#06b6d4",
    },
  ];

  const stats = [
    { number: "10K+", label: "Happy Students", icon: "👥" },
    { number: "50+", label: "Study Tools", icon: "🛠️" },
    { number: "8.5", label: "Avg Band Score", icon: "🎯" },
    { number: "24/7", label: "Expert Support", icon: "💬" },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      band: "8.5",
      text: "Oxbridge changed my life! The study tools are amazing and the community is so supportive. I went from 6.5 to 8.5 in 3 months!",
      avatar: "👩‍🎓",
      location: "London, UK",
    },
    {
      name: "Ahmed Hassan",
      band: "8.0",
      text: "Best IELTS platform I've used. The personalized study plan helped me focus on my weak areas. Highly recommended! 🌟",
      avatar: "👨‍🎓",
      location: "Cairo, Egypt",
    },
    {
      name: "Maria Garcia",
      band: "7.5",
      text: "The practice tests are so realistic and helpful. I loved the vocabulary builder and grammar checker. Worth every penny!",
      avatar: "👩",
      location: "Madrid, Spain",
    },
  ];

  const faqs = [
    {
      q: "How does Oxbridge help me prepare for IELTS?",
      a: "Oxbridge provides 50+ interactive study tools, realistic practice tests, personalized study plans, and 24/7 expert support to help you achieve your target band score.",
    },
    {
      q: "Can I start learning for free?",
      a: "Yes! You can start with our free tools and practice tests. Upgrade anytime to unlock premium features like detailed analytics and personalized feedback.",
    },
    {
      q: "How accurate is the band score prediction?",
      a: "Our algorithm predicts your band score with 95% accuracy based on thousands of test results. It's like having a practice exam taken by IELTS experts!",
    },
    {
      q: "Do I get support if I'm stuck?",
      a: "Absolutely! Our community forum, email support, and live chat are available 24/7. We're here to help you succeed! 🙌",
    },
  ];

  return (
    <div>
      {/* ════════════════════════════════════════
          HERO SECTION - Warm & Welcoming
      ════════════════════════════════════════ */}
      <section
        style={{
          background: "linear-gradient(135deg, #fdf0f0 0%, #f4f6fb 50%, #fff 100%)",
          padding: "100px 28px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background elements */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 300,
            height: 300,
            background: "radial-gradient(circle, rgba(168,16,17,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -50,
            right: -50,
            width: 250,
            height: 250,
            background: "radial-gradient(circle, rgba(201,162,39,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Welcome message */}
          <div style={{ marginBottom: "16px" }}>
            <p
              style={{
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "#a81011",
                textTransform: "uppercase",
                letterSpacing: "2.5px",
                margin: "0 0 12px 0",
              }}
            >
              ✨ Welcome to Oxbridge
            </p>
          </div>

          <h1
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "clamp(2.2rem, 5vw, 4rem)",
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
              fontSize: "clamp(1rem, 2vw, 1.15rem)",
              color: "#475569",
              maxWidth: "600px",
              margin: "0 auto 40px",
              lineHeight: 1.7,
              letterSpacing: "0.3px",
            }}
          >
            We believe learning IELTS should be friendly, fun, and achievable. With our 50+ interactive tools and supportive community, you'll feel confident on exam day. 💪
          </p>

          {/* CTA Buttons */}
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setLocation(isAuthenticated ? "/study-tools" : "/register")}
              style={{
                padding: "16px 40px",
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
              🚀 Start Learning Free
            </button>
            <button
              onClick={() => setLocation("/about")}
              style={{
                padding: "16px 40px",
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
              📚 Learn More
            </button>
          </div>

          {/* Trust badges */}
          <div
            style={{
              marginTop: "40px",
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              flexWrap: "wrap",
              paddingTop: "40px",
              borderTop: "1px solid rgba(226,232,240,0.5)",
            }}
          >
            {[
              "✓ No credit card needed",
              "✓ Instant access",
              "✓ 100% free forever",
            ].map((badge, idx) => (
              <p
                key={idx}
                style={{
                  fontSize: "0.9rem",
                  color: "#475569",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                {badge}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          STATS SECTION - Social Proof
      ════════════════════════════════════════ */}
      <section
        style={{
          background: "#fff",
          padding: "60px 28px",
          borderTop: "1px solid #e2e8f0",
          borderBottom: "1px solid #e2e8f0",
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
            <div key={idx}>
              <p
                style={{
                  fontSize: "2.5rem",
                  margin: "0 0 8px 0",
                }}
              >
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
              <p style={{ color: "#94a3b8", fontSize: "0.9rem", margin: 0 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURES SECTION - Core Value
      ════════════════════════════════════════ */}
      <section
        style={{
          background: "linear-gradient(180deg, #f9fafb 0%, #fff 100%)",
          padding: "80px 28px",
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
                fontSize: "1rem",
                color: "#475569",
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              Everything you need to master IELTS in one friendly place
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {features.map((feature, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredFeature(idx)}
                onMouseLeave={() => setHoveredFeature(null)}
                style={{
                  background: "#fff",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "16px",
                  padding: "32px 24px",
                  transition: "all 0.3s",
                  cursor: "pointer",
                  transform: hoveredFeature === idx ? "translateY(-8px)" : "translateY(0)",
                  borderColor: hoveredFeature === idx ? "rgba(168,16,17,0.3)" : "#e2e8f0",
                  boxShadow:
                    hoveredFeature === idx
                      ? "0 16px 40px rgba(15,23,42,0.12)"
                      : "0 2px 8px rgba(15,23,42,0.07)",
                }}
              >
                {/* Icon with color indicator */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "2.5rem",
                      marginRight: "12px",
                      transform: hoveredFeature === idx ? "scale(1.1)" : "scale(1)",
                      transition: "transform 0.3s",
                    }}
                  >
                    {feature.icon}
                  </div>
                  <div
                    style={{
                      width: "4px",
                      height: "40px",
                      background: feature.color,
                      borderRadius: "2px",
                      opacity: hoveredFeature === idx ? 1 : 0.3,
                      transition: "opacity 0.3s",
                    }}
                  />
                </div>

                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#0f172a",
                    marginBottom: "8px",
                  }}
                >
                  {feature.title}
                </h3>
                <p style={{ color: "#475569", fontSize: "0.9rem", margin: 0 }}>
                  {feature.desc}
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
              Students Love Us ❤️
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "#475569",
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              Join thousands of happy students who achieved their target band
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
                {/* Stars */}
                <div style={{ marginBottom: "16px", fontSize: "1.2rem" }}>
                  ⭐⭐⭐⭐⭐
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
              Questions? We Have Answers 🤔
            </h2>
          </div>

          <div style={{ display: "grid", gap: "16px" }}>
            {faqs.map((faq, idx) => (
              <details
                key={idx}
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "20px",
                  cursor: "pointer",
                }}
              >
                <summary
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "#0f172a",
                    cursor: "pointer",
                  }}
                >
                  {faq.q}
                </summary>
                <p
                  style={{
                    color: "#475569",
                    marginTop: "12px",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
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
          padding: "80px 28px",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
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
            Join thousands of students who've successfully passed their IELTS with Oxbridge. Start your journey today! 🚀
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
            Get Started Free →
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;