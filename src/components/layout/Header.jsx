import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/features/auth/authStore";
import "../../styles/globals.css";

export function Header() {
  const [location, setLocation] = useLocation();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
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
    setProfileMenuOpen(false);
  };

  const navigationLinks = [
    { label: "Home", href: "/" },
    { label: "Study Tools", href: "/study-tools" },
    { label: "Practice", href: "/practice" },
    { label: "About", href: "/about" },
  ];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: scrolled
          ? "rgba(255, 255, 255, 0.95)"
          : "linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.98) 100%)",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(226,232,240,0.5)" : "none",
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
        }}
      >
        {/* Logo */}
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
            cursor: "pointer",
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
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            🎓
          </div>
          <div>
            <h1
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "1.4rem",
                fontWeight: 800,
                color: "#0f172a",
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

        {/* Desktop Navigation - НЕ видно на мобильных */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
            // Скрыто на мобильных - используйте CSS
          }}
          className="desktop-nav"
        >
          {navigationLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                setLocation(link.href);
              }}
              style={{
                color: location === link.href ? "#a81011" : "#475569",
                textDecoration: "none",
                fontWeight: location === link.href ? 700 : 500,
                fontSize: "0.95rem",
                transition: "color 0.2s",
                borderBottom:
                  location === link.href
                    ? "2px solid #a81011"
                    : "2px solid transparent",
                paddingBottom: "4px",
              }}
              onMouseEnter={(e) => {
                if (location !== link.href) {
                  e.target.style.color = "#0f172a";
                }
              }}
              onMouseLeave={(e) => {
                if (location !== link.href) {
                  e.target.style.color = "#475569";
                }
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {isAuthenticated ? (
            // User Menu
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  transition: "background 0.2s",
                  fontSize: "0.95rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f4f6fb";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <img
                  src={
                    user?.picture ||
                    `https://ui-avatars.com/api/?name=${user?.displayName || "User"}`
                  }
                  alt={user?.displayName || "User"}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "2px solid #a81011",
                  }}
                />
                <div style={{ textAlign: "left", display: "none" }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "#0f172a",
                    }}
                  >
                    {user?.displayName}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.7rem", color: "#94a3b8" }}>
                    {user?.provider === "google" ? "Google" : "Email"}
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {profileMenuOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: "8px",
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    boxShadow: "0 8px 24px rgba(15,23,42,0.12)",
                    minWidth: "220px",
                    zIndex: 1001,
                  }}
                >
                  {/* User Info */}
                  <div
                    style={{
                      padding: "16px",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.9rem",
                        fontWeight: 700,
                        color: "#0f172a",
                      }}
                    >
                      {user?.displayName || "User"}
                    </p>
                    <p
                      style={{
                        margin: "4px 0 0 0",
                        fontSize: "0.85rem",
                        color: "#94a3b8",
                      }}
                    >
                      {user?.email}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div style={{ padding: "8px" }}>
                    {[
                      { label: "Dashboard", href: "/dashboard", icon: "📊" },
                      { label: "Profile", href: "/profile", icon: "👤" },
                      { label: "Results", href: "/results", icon: "📈" },
                    ].map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={(e) => {
                          e.preventDefault();
                          setLocation(item.href);
                          setProfileMenuOpen(false);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px 12px",
                          color: "#475569",
                          textDecoration: "none",
                          fontSize: "0.9rem",
                          borderRadius: "8px",
                          transition: "all 0.2s",
                          cursor: "pointer",
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
                        <span>{item.icon}</span>
                        {item.label}
                      </a>
                    ))}
                  </div>

                  {/* Logout Button */}
                  <div style={{ padding: "8px", borderTop: "1px solid #e2e8f0" }}>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "#fff5f5",
                        color: "#dc2626",
                        border: "1px solid rgba(220,38,38,0.2)",
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
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
                      <span>🚪</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Auth Buttons
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => setLocation("/login")}
                style={{
                  padding: "10px 20px",
                  background: "transparent",
                  border: "1.5px solid #dde3ef",
                  borderRadius: "8px",
                  color: "#0f172a",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#a81011";
                  e.currentTarget.style.color = "#a81011";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#dde3ef";
                  e.currentTarget.style.color = "#0f172a";
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => setLocation("/register")}
                style={{
                  padding: "10px 20px",
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
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(168,16,17,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(168,16,17,0.25)";
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
              fontSize: "1.5rem",
              cursor: "pointer",
              padding: "8px",
              display: "none", // Скрыто по умолчанию
            }}
          >
            {mobileMenuOpen ? "✕" : "☰"}
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
            padding: "16px 28px",
            display: "block",
          }}
        >
          {navigationLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                setLocation(link.href);
              }}
              style={{
                display: "block",
                padding: "12px 0",
                color: location === link.href ? "#a81011" : "#475569",
                textDecoration: "none",
                fontWeight: location === link.href ? 700 : 500,
                fontSize: "0.95rem",
                borderBottom: "1px solid #f0f3f9",
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

export default Header;