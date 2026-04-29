import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/features/auth/authStore";
import { useTelegramLogin } from "@/features/auth/TelegramLogin";
import "../styles/globals.css";

export function Register() {
  const [, setLocation] = useLocation();

  const {
    emailRegister,
    googleLogin,
    telegramLogin,
    isLoading,
    error,
    isAuthenticated,
  } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    if (isAuthenticated) setLocation("/profile");
  }, [isAuthenticated, setLocation]);

  // ---------------- TELEGRAM (умный, через хук) ----------------
  const triggerTelegram = useTelegramLogin({
    botId: import.meta.env.VITE_TELEGRAM_BOT_ID,
    onAuth: async (user) => {
      try {
        setTelegramLoading(true);
        setLocalError("");
        await telegramLogin(user);
      } catch (err) {
        setLocalError(err.message || "Telegram registration failed");
      } finally {
        setTelegramLoading(false);
      }
    },
    onError: (msg) => {
      setTelegramLoading(false);
      setLocalError(msg);
    },
  });

  const handleTelegramRegister = () => {
    setLocalError("");
    setTelegramLoading(true);
    triggerTelegram();
  };

  // ---------------- GOOGLE ----------------
  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        setGoogleLoading(true);
        setLocalError("");
        const response = await fetch(
          "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" +
            codeResponse.access_token
        );
        const googleUser = await response.json();
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

  // ---------------- EMAIL ----------------
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    try {
      setLocalError("");

      if (!email || !password || !confirmPassword) {
        setLocalError("Please fill all fields");
        return;
      }
      if (!agreeTerms) {
        setLocalError("Please agree to terms and conditions");
        return;
      }
      if (password !== confirmPassword) {
        setLocalError("Passwords do not match");
        return;
      }
      if (password.length < 6) {
        setLocalError("Password must be at least 6 characters");
        return;
      }

      await emailRegister(email, password, confirmPassword);
    } catch (err) {
      setLocalError(err.message || "Registration failed");
    }
  };

  const displayError = localError || error;

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
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #a81011, #d42022)",
          }}
        />

        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div
            style={{
              width: "60px", height: "60px",
              background: "linear-gradient(145deg, #a81011, #d42022)",
              borderRadius: "14px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.8rem", margin: "0 auto 12px",
              boxShadow: "0 4px 24px rgba(168,16,17,0.28)",
            }}
          >
            🎓
          </div>
          <h1 style={{ fontSize: "1.9rem", fontWeight: 800 }}>Create Account</h1>
          <p style={{ color: "#475569", fontSize: "0.9rem" }}>
            Join Oxbridge IELTS today
          </p>
        </div>

        {displayError && (
          <div
            style={{
              background: "#fff5f5",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "8px",
              padding: "12px",
              color: "#dc2626",
              fontSize: "0.85rem",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            ❌ {displayError}
          </div>
        )}

        <button
          onClick={handleTelegramRegister}
          disabled={isLoading || telegramLoading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "none",
            background: "#229ED9",
            color: "#fff",
            fontWeight: 700,
            marginBottom: "12px",
            cursor: "pointer",
            opacity: telegramLoading ? 0.7 : 1,
          }}
        >
          {telegramLoading ? "Connecting..." : "✈️ Continue with Telegram"}
        </button>

        <button
          onClick={() => googleLoginHandler()}
          disabled={googleLoading || isLoading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "10px",
            border: "1px solid #e2e8f0",
            background: "#fff",
            fontWeight: 600,
            marginBottom: "18px",
            cursor: "pointer",
          }}
        >
          Continue with Google
        </button>

        <div style={{ textAlign: "center", marginBottom: "18px" }}>OR</div>

        <form onSubmit={handleEmailRegister}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "12px", marginBottom: "10px" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "12px", marginBottom: "10px" }}
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ width: "100%", padding: "12px", marginBottom: "10px" }}
          />

          <label>
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            {" "}I agree to terms
          </label>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "14px",
              marginTop: "15px",
              background: "#a81011",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontWeight: 700,
            }}
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
