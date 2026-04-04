import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/features/auth/authStore";
import "../styles/globals.css";

// ════════════════════════════════════════
// ICONS
// ════════════════════════════════════════
const Icons = {
  Search: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
  MessageSquare: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Mail: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Phone: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  HelpCircle: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4m0-4h.01" />
    </svg>
  ),
  CheckCircle: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  AlertCircle: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  Clock: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  ),
  ChevronDown: ({ size = 18 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  Send: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16886899 C3.34915502,0.9117716 2.40734225,1.0218784 1.77946707,1.4931706 C0.994623095,2.12923461 0.837654326,3.34915502 1.15159189,4.13399899 L3.03521743,10.5751122 C3.03521743,10.7322096 3.03521743,10.8423165 3.50612381,10.8423165 L16.6915026,11.5178034 C16.6915026,11.5178034 17.1624089,11.5178034 17.1624089,12.0891277 C17.1624089,12.3462251 17.1624089,12.4744748 16.6915026,12.4744748 Z" />
    </svg>
  ),
  ArrowRight: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Star: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 10.26 24 10.26 17.55 16.5 19.64 24.76 12 18.5 4.36 24.76 6.45 16.5 0 10.26 8.91 10.26" />
    </svg>
  ),
};

// ════════════════════════════════════════
// FAQ DATA
// ════════════════════════════════════════
const FAQ_CATEGORIES = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: "🚀",
    faqs: [
      {
        q: "How do I create an account?",
        a: "Click the 'Sign Up' button on the homepage, enter your email, create a password, and verify your email. You can also sign up with Google or other providers.",
      },
      {
        q: "What's the difference between free and premium plans?",
        a: "Free plan includes basic practice tests and community access. Premium includes unlimited tests, personalized study plans, 1-on-1 coaching, and detailed analytics.",
      },
      {
        q: "Can I change my plan anytime?",
        a: "Yes! You can upgrade or downgrade your plan anytime. Changes take effect at the end of your billing cycle.",
      },
      {
        q: "Is there a trial period?",
        a: "Yes, we offer a 14-day free trial for Premium plans. No credit card required to start.",
      },
    ],
  },
  {
    id: "practice-tests",
    title: "Practice Tests",
    icon: "📝",
    faqs: [
      {
        q: "How many practice tests can I take?",
        a: "With free plan: 5 tests/month. With Premium: Unlimited tests. You can retake tests anytime.",
      },
      {
        q: "Are the tests similar to real IELTS?",
        a: "Yes! Our tests are designed by IELTS experts and match the exact format, timing, and difficulty of the official exam.",
      },
      {
        q: "How long do tests take?",
        a: "Full test takes approximately 3 hours (matching real IELTS timing). You can take individual sections separately.",
      },
      {
        q: "When do I get my results?",
        a: "Listening and Reading results are instant. Writing and Speaking are reviewed by experts within 48 hours.",
      },
    ],
  },
  {
    id: "account-security",
    title: "Account & Security",
    icon: "🔒",
    faqs: [
      {
        q: "How do I reset my password?",
        a: "Click 'Forgot Password' on the login page, enter your email, and follow the reset link sent to your inbox.",
      },
      {
        q: "Is my personal data safe?",
        a: "Yes, we use SSL encryption and GDPR-compliant data protection. Your data is never shared with third parties.",
      },
      {
        q: "Can I delete my account?",
        a: "Yes, go to Settings > Data & Privacy > Delete Account. This action is permanent and cannot be undone.",
      },
      {
        q: "How do I enable two-factor authentication?",
        a: "Go to Settings > Security > Two-Factor Authentication. Follow the setup steps with your authenticator app.",
      },
    ],
  },
  {
    id: "technical-issues",
    title: "Technical Issues",
    icon: "💻",
    faqs: [
      {
        q: "The website is loading slowly",
        a: "Try clearing your browser cache, disabling extensions, or using a different browser. If issues persist, contact support.",
      },
      {
        q: "I'm having audio issues in listening tests",
        a: "Check your speaker volume, try a different browser, or update your audio drivers. Use Firefox or Chrome for best results.",
      },
      {
        q: "My test results disappeared",
        a: "Results are automatically saved. Try refreshing the page or logging out and back in. Contact support if not found.",
      },
      {
        q: "The app crashes on mobile",
        a: "Update the app from App Store/Google Play, clear app cache, or try on WiFi. Report crashes to support with error details.",
      },
    ],
  },
  {
    id: "billing",
    title: "Billing & Payments",
    icon: "💳",
    faqs: [
      {
        q: "What payment methods do you accept?",
        a: "We accept credit/debit cards (Visa, Mastercard), PayPal, Google Pay, and Apple Pay.",
      },
      {
        q: "When will I be charged?",
        a: "Immediately upon subscription. Renewals are charged 1 day before your plan expires.",
      },
      {
        q: "Can I get a refund?",
        a: "Yes, within 14 days of purchase. After 14 days, contact support for case-by-case review.",
      },
      {
        q: "Do you offer invoice/receipts?",
        a: "Yes, all invoices are available in your account under Billing. You can download or email receipts anytime.",
      },
    ],
  },
  {
    id: "learning-path",
    title: "Learning & Progress",
    icon: "📚",
    faqs: [
      {
        q: "How do I choose my learning path?",
        a: "Take our diagnostic test to assess your level. We'll create a personalized path based on your goals and current band.",
      },
      {
        q: "Can I change my target band score?",
        a: "Yes, anytime in Settings > Learning > Target Band. Your study plan will adjust automatically.",
      },
      {
        q: "How accurate is the band score predictor?",
        a: "Our AI predicts band scores with 95% accuracy based on thousands of test results and patterns.",
      },
      {
        q: "What if I'm not making progress?",
        a: "Contact our tutors for personalized coaching. Premium members get 1-on-1 sessions included.",
      },
    ],
  },
];

// ════════════════════════════════════════
// CONTACT OPTIONS
// ════════════════════════════════════════
const CONTACT_OPTIONS = [
  {
    id: "live-chat",
    title: "Live Chat",
    description: "Chat with support team in real-time",
    icon: Icons.MessageSquare,
    time: "Available 9 AM - 9 PM (UTC+5)",
    action: "Start Chat",
    available: true,
  },
  {
    id: "email",
    title: "Email Support",
    description: "Send us a detailed message",
    icon: Icons.Mail,
    time: "Response within 24 hours",
    action: "Send Email",
    available: true,
  },
  {
    id: "phone",
    title: "Phone Support",
    description: "Call our support team",
    icon: Icons.Phone,
    time: "Mon-Fri, 9 AM - 6 PM (UTC+5)",
    action: "Call Us",
    available: false,
  },
  {
    id: "community",
    title: "Community Forum",
    description: "Get help from other students",
    icon: Icons.HelpCircle,
    time: "Active 24/7",
    action: "Visit Forum",
    available: true,
  },
];

// ════════════════════════════════════════
// FAQ ACCORDION ITEM
// ════════════════════════════════════════
function FAQAccordion({ q, a, isOpen, onClick }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1.5px solid #e2e8f0",
        borderRadius: "10px",
        overflow: "hidden",
        marginBottom: "12px",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        if (!isOpen) {
          e.currentTarget.style.borderColor = "#a81011";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(168,16,17,0.1)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isOpen) {
          e.currentTarget.style.borderColor = "#e2e8f0";
          e.currentTarget.style.boxShadow = "none";
        }
      }}
    >
      <button
        onClick={onClick}
        style={{
          width: "100%",
          padding: "16px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: "left",
          transition: "all 0.2s",
        }}
      >
        <p
          style={{
            fontWeight: 700,
            color: "#0c1f4a",
            fontSize: "0.95rem",
            margin: 0,
            flex: 1,
          }}
        >
          {q}
        </p>
        <Icons.ChevronDown
          size={20}
          style={{
            color: "#a81011",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s",
            flexShrink: 0,
            marginLeft: "12px",
          }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            padding: "0 16px 16px 16px",
            borderTop: "1px solid #e2e8f0",
            animation: "slideDown 0.2s ease",
          }}
        >
          <p style={{ color: "#475569", lineHeight: 1.7, margin: 0 }}>
            {a}
          </p>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// CONTACT FORM
// ════════════════════════════════════════
function ContactForm() {
  const { user, isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    email: user?.email || "",
    subject: "",
    category: "general",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: user?.displayName || "",
        email: user?.email || "",
        subject: "",
        category: "general",
        message: "",
      });
    }, 3000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "block", fontWeight: 700, color: "#0c1f4a", marginBottom: "8px", fontSize: "0.9rem" }}>
          Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Your name"
          style={{
            width: "100%",
            padding: "12px 14px",
            border: errors.name ? "1.5px solid #dc2626" : "1.5px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "0.95rem",
            outline: "none",
            boxSizing: "border-box",
            transition: "all 0.2s",
          }}
          onFocus={(e) => {
            if (!errors.name) {
              e.target.style.borderColor = "#a81011";
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.name ? "#dc2626" : "#e2e8f0";
          }}
        />
        {errors.name && (
          <p style={{ color: "#dc2626", fontSize: "0.8rem", marginTop: "4px" }}>
            {errors.name}
          </p>
        )}
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "block", fontWeight: 700, color: "#0c1f4a", marginBottom: "8px", fontSize: "0.9rem" }}>
          Email
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="your@email.com"
          style={{
            width: "100%",
            padding: "12px 14px",
            border: errors.email ? "1.5px solid #dc2626" : "1.5px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "0.95rem",
            outline: "none",
            boxSizing: "border-box",
            transition: "all 0.2s",
          }}
          onFocus={(e) => {
            if (!errors.email) {
              e.target.style.borderColor = "#a81011";
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.email ? "#dc2626" : "#e2e8f0";
          }}
        />
        {errors.email && (
          <p style={{ color: "#dc2626", fontSize: "0.8rem", marginTop: "4px" }}>
            {errors.email}
          </p>
        )}
      </div>

      <div style={{ marginBottom: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div>
          <label style={{ display: "block", fontWeight: 700, color: "#0c1f4a", marginBottom: "8px", fontSize: "0.9rem" }}>
            Subject
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
            placeholder="Your subject"
            style={{
              width: "100%",
              padding: "12px 14px",
              border: errors.subject ? "1.5px solid #dc2626" : "1.5px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "0.95rem",
              outline: "none",
              boxSizing: "border-box",
              transition: "all 0.2s",
            }}
            onFocus={(e) => {
              if (!errors.subject) {
                e.target.style.borderColor = "#a81011";
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = errors.subject ? "#dc2626" : "#e2e8f0";
            }}
          />
          {errors.subject && (
            <p style={{ color: "#dc2626", fontSize: "0.8rem", marginTop: "4px" }}>
              {errors.subject}
            </p>
          )}
        </div>

        <div>
          <label style={{ display: "block", fontWeight: 700, color: "#0c1f4a", marginBottom: "8px", fontSize: "0.9rem" }}>
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            style={{
              width: "100%",
              padding: "12px 14px",
              border: "1.5px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "0.95rem",
              outline: "none",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#a81011";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e2e8f0";
            }}
          >
            <option value="general">General Inquiry</option>
            <option value="technical">Technical Issue</option>
            <option value="billing">Billing</option>
            <option value="content">Content Question</option>
            <option value="feedback">Feedback</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label style={{ display: "block", fontWeight: 700, color: "#0c1f4a", marginBottom: "8px", fontSize: "0.9rem" }}>
          Message
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder="Please describe your issue or question in detail..."
          rows="6"
          style={{
            width: "100%",
            padding: "12px 14px",
            border: errors.message ? "1.5px solid #dc2626" : "1.5px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "0.95rem",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
            resize: "vertical",
            transition: "all 0.2s",
          }}
          onFocus={(e) => {
            if (!errors.message) {
              e.target.style.borderColor = "#a81011";
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors.message ? "#dc2626" : "#e2e8f0";
          }}
        />
        {errors.message && (
          <p style={{ color: "#dc2626", fontSize: "0.8rem", marginTop: "4px" }}>
            {errors.message}
          </p>
        )}
      </div>

      {submitted && (
        <div
          style={{
            padding: "14px 16px",
            background: "#d1fae5",
            border: "1.5px solid #6ee7b7",
            borderRadius: "8px",
            color: "#065f46",
            fontWeight: 600,
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Icons.CheckCircle size={18} />
          Message sent successfully! We'll get back to you soon.
        </div>
      )}

      <button
        type="submit"
        style={{
          padding: "12px 32px",
          background: "linear-gradient(135deg, #a81011, #d42022)",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          fontWeight: 700,
          fontSize: "0.95rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <Icons.Send size={18} />
        Send Message
      </button>
    </form>
  );
}

// ════════════════════════════════════════
// MAIN SUPPORT PAGE
// ════════════════════════════════════════
export default function Support() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [openFAQ, setOpenFAQ] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("getting-started");
  const [activeTab, setActiveTab] = useState("faq");

  // Filter FAQs based on search
  const currentCategory = FAQ_CATEGORIES.find((cat) => cat.id === selectedCategory);
  const filteredFAQs = currentCategory?.faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div style={{ background: "#f9fafb", minHeight: "100vh", paddingBottom: "80px" }}>
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #a81011, #d42022)",
          color: "#fff",
          padding: "60px 28px",
          marginBottom: "60px",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              marginBottom: "16px",
            }}
          >
            How Can We Help?
          </h1>
          <p
            style={{
              fontSize: "1.05rem",
              opacity: 0.95,
              marginBottom: "32px",
              lineHeight: 1.6,
            }}
          >
            Find answers to common questions or reach out to our support team
          </p>

          {/* Search Bar */}
          <div
            style={{
              position: "relative",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
              }}
            >
              <Icons.Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                paddingLeft: "48px",
                paddingRight: "16px",
                paddingTop: "12px",
                paddingBottom: "12px",
                border: "none",
                borderRadius: "10px",
                fontSize: "1rem",
                outline: "none",
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = "0 0 0 3px rgba(255,255,255,0.3)";
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 28px" }}>
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "40px",
            borderBottom: "2px solid #e2e8f0",
            paddingBottom: "0",
          }}
        >
          {[
            { id: "faq", label: "📚 FAQs" },
            { id: "contact", label: "💬 Contact Us" },
            { id: "status", label: "📊 System Status" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "14px 24px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontWeight: activeTab === tab.id ? 700 : 600,
                fontSize: "0.95rem",
                color: activeTab === tab.id ? "#a81011" : "#475569",
                borderBottom: activeTab === tab.id ? "3px solid #a81011" : "3px solid transparent",
                transition: "all 0.2s",
                marginBottom: "-2px",
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = "#0c1f4a";
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = "#475569";
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* FAQ Tab */}
        {activeTab === "faq" && (
          <div style={{ display: "grid", gridTemplateColumns: "250px 1fr", gap: "40px" }}>
            {/* Categories Sidebar */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                height: "fit-content",
                position: "sticky",
                top: "100px",
              }}
            >
              {FAQ_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setOpenFAQ(null);
                  }}
                  style={{
                    padding: "12px 16px",
                    background: selectedCategory === category.id ? "#fff5f5" : "transparent",
                    border: "none",
                    borderLeft: selectedCategory === category.id ? "4px solid #a81011" : "4px solid transparent",
                    borderRadius: "0 8px 8px 0",
                    cursor: "pointer",
                    textAlign: "left",
                    fontWeight: selectedCategory === category.id ? 700 : 600,
                    color: selectedCategory === category.id ? "#a81011" : "#475569",
                    fontSize: "0.9rem",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category.id) {
                      e.currentTarget.style.background = "#f9fafb";
                      e.currentTarget.style.color = "#0c1f4a";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category.id) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#475569";
                    }
                  }}
                >
                  <span style={{ marginRight: "8px" }}>{category.icon}</span>
                  {category.title}
                </button>
              ))}
            </div>

            {/* FAQs Content */}
            <div>
              <h2
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "1.8rem",
                  fontWeight: 800,
                  color: "#0c1f4a",
                  marginBottom: "8px",
                }}
              >
                {currentCategory?.title}
              </h2>
              <p
                style={{
                  color: "#94a3b8",
                  marginBottom: "28px",
                  fontSize: "0.95rem",
                }}
              >
                {filteredFAQs.length} questions found
              </p>

              <div>
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((faq, idx) => (
                    <FAQAccordion
                      key={idx}
                      q={faq.q}
                      a={faq.a}
                      isOpen={openFAQ === `${selectedCategory}-${idx}`}
                      onClick={() =>
                        setOpenFAQ(
                          openFAQ === `${selectedCategory}-${idx}`
                            ? null
                            : `${selectedCategory}-${idx}`
                        )
                      }
                    />
                  ))
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      background: "#f9fafb",
                      borderRadius: "10px",
                      border: "1.5px dashed #e2e8f0",
                    }}
                  >
                    <p
                      style={{
                        color: "#94a3b8",
                        fontSize: "0.95rem",
                        margin: 0,
                      }}
                    >
                      No questions found matching your search
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <div>
            {/* Contact Options */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "24px",
                marginBottom: "60px",
              }}
            >
              {CONTACT_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <div
                    key={option.id}
                    style={{
                      padding: "28px",
                      background: "#fff",
                      border: "1.5px solid #e2e8f0",
                      borderRadius: "14px",
                      transition: "all 0.2s",
                      opacity: option.available ? 1 : 0.6,
                    }}
                    onMouseEnter={(e) => {
                      if (option.available) {
                        e.currentTarget.style.borderColor = "#a81011";
                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(168,16,17,0.12)";
                        e.currentTarget.style.transform = "translateY(-4px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (option.available) {
                        e.currentTarget.style.borderColor = "#e2e8f0";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.transform = "translateY(0)";
                      }
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "12px",
                        background: "#fff5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "16px",
                        color: "#a81011",
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <h3
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 700,
                        color: "#0c1f4a",
                        marginBottom: "6px",
                      }}
                    >
                      {option.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#94a3b8",
                        marginBottom: "12px",
                      }}
                    >
                      {option.description}
                    </p>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "#a81011",
                        fontWeight: 600,
                        marginBottom: "16px",
                      }}
                    >
                      <Icons.Clock size={14} style={{ display: "inline", marginRight: "4px" }} />
                      {option.time}
                    </p>
                    <button
                      style={{
                        width: "100%",
                        padding: "10px",
                        background: option.available
                          ? "linear-gradient(135deg, #a81011, #d42022)"
                          : "#cbd5e1",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        cursor: option.available ? "pointer" : "not-allowed",
                        transition: "all 0.2s",
                      }}
                      disabled={!option.available}
                      onMouseEnter={(e) => {
                        if (option.available) {
                          e.currentTarget.style.transform = "scale(1.02)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      {option.action}
                    </button>
                    {!option.available && (
                      <p
                        style={{
                          fontSize: "0.75rem",
                          color: "#94a3b8",
                          marginTop: "8px",
                        }}
                      >
                        Coming soon
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Contact Form */}
            <div
              style={{
                background: "#fff",
                border: "1.5px solid #e2e8f0",
                borderRadius: "14px",
                padding: "40px",
              }}
            >
              <h2
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "1.6rem",
                  fontWeight: 800,
                  color: "#0c1f4a",
                  marginBottom: "8px",
                }}
              >
                Send us a Message
              </h2>
              <p
                style={{
                  color: "#94a3b8",
                  marginBottom: "32px",
                  fontSize: "0.95rem",
                }}
              >
                Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.
              </p>
              <ContactForm />
            </div>
          </div>
        )}

        {/* System Status Tab */}
        {activeTab === "status" && (
          <div>
            <h2
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "1.8rem",
                fontWeight: 800,
                color: "#0c1f4a",
                marginBottom: "28px",
              }}
            >
              System Status
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
                marginBottom: "40px",
              }}
            >
              {[
                { name: "Web Platform", status: "Operational", color: "#10b981" },
                { name: "Mobile App", status: "Operational", color: "#10b981" },
                { name: "API", status: "Operational", color: "#10b981" },
                { name: "Database", status: "Operational", color: "#10b981" },
                { name: "CDN", status: "Operational", color: "#10b981" },
                { name: "Payment System", status: "Operational", color: "#10b981" },
              ].map((service) => (
                <div
                  key={service.name}
                  style={{
                    padding: "20px",
                    background: "#fff",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontWeight: 700,
                        color: "#0c1f4a",
                        fontSize: "0.95rem",
                        margin: 0,
                      }}
                    >
                      {service.name}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: service.color,
                      fontWeight: 700,
                      fontSize: "0.85rem",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: service.color,
                      }}
                    />
                    {service.status}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                padding: "24px",
                background: "#f0fdf4",
                border: "1.5px solid #86efac",
                borderRadius: "10px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  color: "#166534",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                ✅ All systems operational. Last updated: Just now
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}