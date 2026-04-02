import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/features/auth/authStore";
import "../styles/globals.css";

export function Register() {
  const [, setLocation] = useLocation();
  const { emailRegister, googleLogin, isLoading, error, isAuthenticated } =
    useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/profile");
    }
  }, [isAuthenticated, setLocation]);

  // Google Login Hook
  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        setGoogleLoading(true);
        setLocalError("");

        // Get user info from Google
        const response = await fetch(
          "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" +
            codeResponse.access_token,
          {
            headers: {
              Authorization: `Bearer ${codeResponse.access_token}`,
            },
          }
        );
        const googleUser = await response.json();

        // Register with Google
        await googleLogin({
          credential: codeResponse.access_token,
          ...googleUser,
        });
      } catch (err) {
        setLocalError(err.message || "Google registration failed");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setLocalError("Failed to register with Google");
      setGoogleLoading(false);
    },
    flow: "implicit",
  });

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    try {
      setLocalError("");

      if (!agreeTerms) {
        setLocalError("Please agree to terms and conditions");
        return;
      }

      await emailRegister(email, password, confirmPassword);
    } catch (err) {
      setLocalError(err.message || "Registration failed");
    }
  };

  const displayError = localError || error;
  const passwordsMatch = password === confirmPassword;
  const passwordValid = password.length >= 6;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #fdf0f0 0%, #f4f6fb 50%, #fdf0f0 100%)",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "44px 40px",
          borderRadius: "20px",
          boxShadow: "0 16px 60px rgba(15,23,42,0.2)",
          width: "100%",
          maxWidth: "440px",
          border: "1px solid rgba(168,16,17,0.1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #a81011, #d42022)",
          }}
        />

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              background: "linear-gradient(145deg, #a81011, #d42022)",
              borderRadius: "14px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.8rem",
              boxShadow: "0 4px 24px rgba(168,16,17,0.28)",
              marginBottom: "12px",
            }}
          >
            🎓
          </div>
          <h1
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "1.9rem",
              fontWeight: 800,
              color: "#0f172a",
              textAlign: "center",
              marginBottom: "6px",
            }}
          >
            Create Account
          </h1>
          <p style={{ textAlign: "center", color: "#475569", fontSize: "0.9rem" }}>
            Join Oxbridge IELTS today
          </p>
        </div>

        {/* Error Message */}
        {displayError && (
          <div
            style={{
              background: "#fff5f5",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "8px",
              padding: "12px 16px",
              color: "#dc2626",
              fontSize: "0.875rem",
              textAlign: "center",
              marginBottom: "16px",
              animation: "slideDown 0.3s ease",
            }}
          >
            ❌ {displayError}
          </div>
        )}

        {/* Google Sign-Up Button */}
        <button
          onClick={() => googleLoginHandler()}
          disabled={googleLoading || isLoading}
          style={{
            width: "100%",
            padding: "14px",
            border: "1.5px solid #dde3ef",
            borderRadius: "10px",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            fontWeight: 600,
            fontSize: "0.95rem",
            color: "#0f172a",
            cursor: googleLoading || isLoading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            marginBottom: "20px",
            opacity: googleLoading || isLoading ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!googleLoading && !isLoading) {
              e.currentTarget.style.background = "#f4f6fb";
              e.currentTarget.style.borderColor = "#a81011";
            }
          }}
          onMouseLeave={(e) => {
            if (!googleLoading && !isLoading) {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.borderColor = "#dde3ef";
            }
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          {googleLoading ? "Connecting..." : "Sign Up with Google"}
        </button>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
          <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>OR</span>
          <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailRegister} style={{ marginBottom: "24px" }}>
          {/* Email Field */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#475569",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
              }}
            >
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isLoading}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "1.5px solid #dde3ef",
                borderRadius: "10px",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.95rem",
                color: "#0f172a",
                background: "#fff",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
                boxSizing: "border-box",
                opacity: isLoading ? 0.6 : 1,
              }}
              onFocus={(e) => {
                if (!isLoading) {
                  e.target.style.borderColor = "#a81011";
                  e.target.style.boxShadow = "0 0 0 3px rgba(168,16,17,0.18)";
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#dde3ef";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#475569",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
              }}
            >
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "1.5px solid #dde3ef",
                borderRadius: "10px",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.95rem",
                color: "#0f172a",
                background: "#fff",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
                boxSizing: "border-box",
                opacity: isLoading ? 0.6 : 1,
              }}
              onFocus={(e) => {
                if (!isLoading) {
                  e.target.style.borderColor = "#a81011";
                  e.target.style.boxShadow = "0 0 0 3px rgba(168,16,17,0.18)";
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#dde3ef";
                e.target.style.boxShadow = "none";
              }}
            />
            <p
              style={{
                fontSize: "0.75rem",
                color: passwordValid ? "#16a34a" : "#dc2626",
                marginTop: "6px",
              }}
            >
              {passwordValid ? "✓" : "✕"} At least 6 characters
            </p>
          </div>

          {/* Confirm Password Field */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#475569",
                marginBottom: "6px",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
              }}
            >
              CONFIRM PASSWORD
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              required
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "1.5px solid #dde3ef",
                borderRadius: "10px",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.95rem",
                color: "#0f172a",
                background: "#fff",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
                boxSizing: "border-box",
                opacity: isLoading ? 0.6 : 1,
              }}
              onFocus={(e) => {
                if (!isLoading) {
                  e.target.style.borderColor = "#a81011";
                  e.target.style.boxShadow = "0 0 0 3px rgba(168,16,17,0.18)";
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#dde3ef";
                e.target.style.boxShadow = "none";
              }}
            />
            <p
              style={{
                fontSize: "0.75rem",
                color: passwordsMatch ? "#16a34a" : "#dc2626",
                marginTop: "6px",
              }}
            >
              {passwordsMatch ? "✓" : "✕"} Passwords match
            </p>
          </div>

          {/* Terms Checkbox */}
          <div style={{ marginBottom: "24px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              disabled={isLoading}
              style={{
                width: "18px",
                height: "18px",
                cursor: "pointer",
                marginTop: "3px",
              }}
            />
            <label
              htmlFor="terms"
              style={{
                fontSize: "0.85rem",
                color: "#475569",
                cursor: "pointer",
                lineHeight: 1.4,
              }}
            >
              I agree to the{" "}
              <a
                href="#terms"
                style={{
                  color: "#a81011",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Terms and Conditions
              </a>{" "}
              and{" "}
              <a
                href="#privacy"
                style={{
                  color: "#a81011",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || googleLoading || !agreeTerms}
            style={{
              width: "100%",
              padding: "15px",
              background:
                isLoading || googleLoading || !agreeTerms
                  ? "#cbd5e1"
                  : "linear-gradient(135deg, #a81011, #d42022)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: 700,
              cursor:
                isLoading || googleLoading || !agreeTerms
                  ? "not-allowed"
                  : "pointer",
              transition: "all 0.2s",
              boxShadow:
                isLoading || googleLoading
                  ? "none"
                  : "0 4px 24px rgba(168,16,17,0.28)",
              letterSpacing: "0.3px",
            }}
            onMouseEnter={(e) => {
              if (!isLoading && !googleLoading && agreeTerms) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 40px rgba(168,16,17,0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading && !googleLoading && agreeTerms) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 24px rgba(168,16,17,0.28)";
              }
            }}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <div style={{ textAlign: "center", color: "#475569", fontSize: "0.9rem" }}>
          <p>
            Already have an account?{" "}
            <a
              href="/login"
              style={{
                color: "#a81011",
                fontWeight: 700,
                textDecoration: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;