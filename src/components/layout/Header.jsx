import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/features/auth/authStore";
import "../../styles/globals.css";

// ════════════════════════════════════════
// ICONS
// ════════════════════════════════════════
const Icons = {
  Menu: ({ size = 24 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  Close: ({ size = 24 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
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
  Bell: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Home: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  BookOpen: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Zap: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Info: ({ size = 20 }) => (
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
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  LogOut: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  Settings: ({ size = 20 }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
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
};

// ════════════════════════════════════════
// NAVIGATION ITEMS
// ════════════════════════════════════════
const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Icons.Home },
  { label: "Study Tools", href: "/study-tools", icon: Icons.BookOpen },
  { label: "Practice", href: "/practice", icon: Icons.Zap },
  { label: "About", href: "/about", icon: Icons.Info },
];

const USER_MENU_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "📊" },
  { label: "My Results", href: "/results", icon: "📈" },
  { label: "Profile", href: "/profile", icon: "👤" },
  { label: "Settings", href: "/settings", icon: "⚙️" },
  { label: "Help & Support", href: "/help", icon: "❓" },
];

// ════════════════════════════════════════
// NOTIFICATION BADGE
// ════════════════════════════════════════
function NotificationBell() {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications] = useState([
    {
      id: 1,
      title: "Practice Test Ready",
      message: "Your IELTS mock test is ready to take",
      time: "5 min ago",
      icon: "📝",
    },
    {
      id: 2,
      title: "Results Published",
      message: "Your listening test results are now available",
      time: "1 hour ago",
      icon: "✅",
    },
    {
      id: 3,
      title: "New Course Available",
      message: "Band 8+ Writing strategies course is now live",
      time: "2 hours ago",
      icon: "🎓",
    },
  ]);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setNotificationOpen(!notificationOpen)}
        style={{
          position: "relative",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "8px 12px",
          borderRadius: "10px",
          color: "#475569",
          transition: "all 0.2s",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#f4f6fb";
          e.currentTarget.style.color = "#0c1f4a";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#475569";
        }}
        aria-label="Notifications"
        title="View notifications"
      >
        <Icons.Bell size={20} />
        {notifications.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: "4px",
              right: "6px",
              width: "8px",
              height: "8px",
              background: "#dc2626",
              borderRadius: "50%",
            }}
          />
        )}
      </button>

      {notificationOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "12px",
            width: "360px",
            maxHeight: "400px",
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "14px",
            boxShadow: "0 12px 32px rgba(15,23,42,0.15)",
            zIndex: 1001,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "#0c1f4a",
                margin: 0,
              }}
            >
              Notifications
            </p>
            <span
              style={{
                background: "#fef3c7",
                color: "#92400e",
                padding: "2px 8px",
                borderRadius: "12px",
                fontSize: "0.7rem",
                fontWeight: 700,
              }}
            >
              {notifications.length}
            </span>
          </div>

          {/* Notifications List */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              maxHeight: "320px",
            }}
          >
            {notifications.map((notif) => (
              <div
                key={notif.id}
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid #f0f3f9",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f9fafb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <div style={{ display: "flex", gap: "12px" }}>
                  <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>
                    {notif.icon}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        color: "#0c1f4a",
                        margin: "0 0 4px 0",
                      }}
                    >
                      {notif.title}
                    </p>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: "#475569",
                        margin: "0 0 4px 0",
                        lineHeight: 1.5,
                      }}
                    >
                      {notif.message}
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#94a3b8",
                        margin: 0,
                      }}
                    >
                      {notif.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "12px 16px",
              borderTop: "1px solid #e2e8f0",
              textAlign: "center",
            }}
          >
            <a
              href="#view-all"
              style={{
                color: "#a81011",
                fontSize: "0.85rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              View all notifications →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// SEARCH BAR
// ════��═══════════════════════════════════
function SearchBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div
      style={{
        position: "relative",
        display: searchOpen ? "block" : "none",
      }}
      className="search-bar"
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          color: "#94a3b8",
        }}
      >
        <Icons.Search size={18} />
      </div>
      <input
        type="text"
        placeholder="Search courses, tests..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onBlur={() => {
          if (!searchQuery) setSearchOpen(false);
        }}
        autoFocus
        style={{
          width: "280px",
          paddingLeft: "40px",
          paddingRight: "14px",
          paddingTop: "10px",
          paddingBottom: "10px",
          border: "1.5px solid #e2e8f0",
          borderRadius: "10px",
          fontSize: "0.9rem",
          outline: "none",
          transition: "all 0.2s",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#a81011";
          e.target.style.boxShadow = "0 0 0 3px rgba(168,16,17,0.1)";
        }}
      />
    </div>
  );
}

// ════════════════════════════════════════
// USER PROFILE DROPDOWN
// ════════════════════════════════════════
function UserProfileDropdown({ user, onLogout }) {
  const [, setLocation] = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleNavigation = (href) => {
    setLocation(href);
    setProfileOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setProfileOpen(!profileOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "6px 8px",
          borderRadius: "10px",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#f4f6fb";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
        aria-label={`${user?.displayName} profile menu`}
        title={`${user?.displayName} (${user?.email})`}
      >
        <img
          src={
            user?.picture ||
            `https://ui-avatars.com/api/?name=${user?.displayName || "User"}&background=a81011&color=fff&bold=true`
          }
          alt={user?.displayName || "User"}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            border: "2px solid #a81011",
            objectFit: "cover",
          }}
        />
        <Icons.ChevronDown size={16} />
      </button>

      {profileOpen && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999,
            }}
            onClick={() => setProfileOpen(false)}
          />

          {/* Dropdown Menu */}
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: "12px",
              width: "280px",
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              boxShadow: "0 12px 32px rgba(15,23,42,0.15)",
              zIndex: 1001,
              overflow: "hidden",
              animation: "slideDown 0.2s ease",
            }}
          >
            {/* User Info Section */}
            <div
              style={{
                padding: "20px 16px",
                background: "linear-gradient(135deg, #f9fafb, #fff)",
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img
                  src={
                    user?.picture ||
                    `https://ui-avatars.com/api/?name=${user?.displayName || "User"}&background=a81011&color=fff&bold=true`
                  }
                  alt={user?.displayName || "User"}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "10px",
                    border: "2px solid #a81011",
                    objectFit: "cover",
                  }}
                />
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      color: "#0c1f4a",
                      margin: 0,
                    }}
                  >
                    {user?.displayName || "User"}
                  </p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "#94a3b8",
                      margin: "4px 0 0 0",
                    }}
                  >
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div style={{ padding: "8px" }}>
              {USER_MENU_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    background: "transparent",
                    border: "none",
                    color: "#475569",
                    textAlign: "left",
                    cursor: "pointer",
                    borderRadius: "8px",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f4f6fb";
                    e.currentTarget.style.color = "#a81011";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#475569";
                  }}
                >
                  <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div
              style={{
                height: "1px",
                background: "#e2e8f0",
              }}
            />

            {/* Logout Button */}
            <div style={{ padding: "8px" }}>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  onLogout();
                }}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  background: "#fff5f5",
                  border: "1px solid rgba(220,38,38,0.2)",
                  borderRadius: "8px",
                  color: "#dc2626",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fef2f2";
                  e.currentTarget.style.borderColor = "rgba(220,38,38,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff5f5";
                  e.currentTarget.style.borderColor = "rgba(220,38,38,0.2)";
                }}
              >
                <Icons.LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ════════════════════════════════════════
// MAIN HEADER COMPONENT
// ════════════════════════════════════════
export function Header() {
  const [location, setLocation] = useLocation();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <>
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

        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          .search-bar {
            display: none !important;
          }
        }

        @media (min-width: 769px) {
          .mobile-menu-btn {
            display: none !important;
          }
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          background: scrolled
            ? "rgba(255, 255, 255, 0.98)"
            : "linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.98) 100%)",
          backdropFilter: "blur(10px)",
          borderBottom: scrolled ? "1px solid #e2e8f0" : "1px solid transparent",
          boxShadow: scrolled ? "0 2px 12px rgba(15,23,42,0.08)" : "none",
          transition: "all 0.3s ease",
          padding: "0",
        }}
      >
        <div
          style={{
            maxWidth: "1440px",
            margin: "0 auto",
            padding: "12px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setLocation("/");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
              cursor: "pointer",
              transition: "transform 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(145deg, #a81011, #d42022)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                boxShadow: "0 4px 16px rgba(168,16,17,0.25)",
                flexShrink: 0,
              }}
            >
              ���
            </div>
            <div style={{ minWidth: 0 }}>
              <h1
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  color: "#0c1f4a",
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                Oxbridge
              </h1>
              <p
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: "#a81011",
                  margin: "4px 0 0 0",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                }}
              >
                IELTS
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav
            className="desktop-nav"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              flex: 1,
            }}
          >
            {NAV_ITEMS.map((link) => {
              const isActive = location === link.href;
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setLocation(link.href);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 16px",
                    color: isActive ? "#a81011" : "#475569",
                    textDecoration: "none",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "0.9rem",
                    transition: "all 0.2s",
                    borderRadius: "8px",
                    background: isActive ? "#fff5f5" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#0c1f4a";
                      e.currentTarget.style.background = "#f4f6fb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "#475569";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                  title={link.label}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Right Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexShrink: 0,
            }}
          >
            {/* Search Bar (Desktop) */}
            <div
              className="search-bar"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  color: "#475569",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f4f6fb";
                  e.currentTarget.style.color = "#0c1f4a";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#475569";
                }}
                aria-label="Search"
                title="Search"
              >
                <Icons.Search size={20} />
              </button>
              {searchOpen && (
                <input
                  type="text"
                  placeholder="Search..."
                  autoFocus
                  style={{
                    position: "absolute",
                    right: 0,
                    width: "280px",
                    paddingLeft: "40px",
                    paddingRight: "14px",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    border: "1.5px solid #a81011",
                    borderRadius: "10px",
                    fontSize: "0.9rem",
                    outline: "none",
                    boxShadow: "0 0 0 3px rgba(168,16,17,0.1)",
                  }}
                  onBlur={(e) => {
                    if (!e.target.value) setSearchOpen(false);
                  }}
                />
              )}
            </div>

            {/* Notifications (Authenticated Only) */}
            {isAuthenticated && <NotificationBell />}

            {isAuthenticated ? (
              // User Profile Dropdown
              <UserProfileDropdown user={user} onLogout={handleLogout} />
            ) : (
              // Auth Buttons
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() => setLocation("/login")}
                  style={{
                    padding: "10px 20px",
                    background: "transparent",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "8px",
                    color: "#0c1f4a",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#a81011";
                    e.currentTarget.style.color = "#a81011";
                    e.currentTarget.style.background = "#fff5f5";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.color = "#0c1f4a";
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setLocation("/register")}
                  style={{
                    padding: "10px 22px",
                    background: "linear-gradient(135deg, #a81011, #d42022)",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: "0 4px 12px rgba(168,16,17,0.25)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 20px rgba(168,16,17,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(168,16,17,0.25)";
                  }}
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "8px",
                color: "#475569",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f4f6fb";
                e.currentTarget.style.color = "#0c1f4a";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#475569";
              }}
              aria-label="Toggle menu"
              title={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <Icons.Close size={24} />
              ) : (
                <Icons.Menu size={24} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            className="mobile-menu"
            style={{
              background: "#fff",
              borderTop: "1px solid #e2e8f0",
              padding: "12px 0",
              animation: "slideDown 0.2s ease",
            }}
          >
            {NAV_ITEMS.map((link) => {
              const isActive = location === link.href;
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setLocation(link.href);
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 28px",
                    color: isActive ? "#a81011" : "#475569",
                    textDecoration: "none",
                    fontWeight: isActive ? 700 : 600,
                    fontSize: "0.95rem",
                    borderLeft: isActive ? "4px solid #a81011" : "4px solid transparent",
                    transition: "all 0.2s",
                  }}
                >
                  <Icon size={18} />
                  {link.label}
                </a>
              );
            })}
          </div>
        )}
      </header>
    </>
  );
}

export default Header;