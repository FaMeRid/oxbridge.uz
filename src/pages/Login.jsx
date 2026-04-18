import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useGoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "@/features/auth/authStore";

export function Login() {
  const [, setLocation] = useLocation();

  const {
    emailLogin,
    googleLogin,
    telegramLogin, // 🔥 ДОБАВИЛИ
    isLoading,
    error,
    isAuthenticated,
  } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [telegramLoading, setTelegramLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/profile");
    }
  }, [isAuthenticated, setLocation]);

  // ---------------- TELEGRAM LOGIN ----------------
  const handleTelegramLogin = async () => {
    try {
      setLocalError("");
      setTelegramLoading(true);

      const tg = window.Telegram?.WebApp;

      if (!tg) {
        setLocalError("Откройте приложение через Telegram");
        return;
      }

      tg.ready();
      tg.expand();

      const user = tg.initDataUnsafe?.user;
      const initData = tg.initData;

      if (!user) {
        setLocalError("Telegram user не найден");
        return;
      }

      await telegramLogin({
        telegramId: user.id,
        first_name: user.first_name,
        username: user.username,
        initData,
      });

    } catch (err) {
      setLocalError(err.message || "Telegram login failed");
    } finally {
      setTelegramLoading(false);
    }
  };

  // ---------------- GOOGLE LOGIN ----------------
  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        setGoogleLoading(true);
        setLocalError("");

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

        await googleLogin({
          credential: codeResponse.access_token,
          ...googleUser,
        });

      } catch (err) {
        setLocalError(err.message || "Google login failed");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setLocalError("Failed to login with Google");
      setGoogleLoading(false);
    },
    flow: "implicit",
  });

  // ---------------- EMAIL LOGIN ----------------
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    try {
      setLocalError("");

      if (!email || !password) {
        setLocalError("Please fill in all fields");
        return;
      }

      await emailLogin(email, password);
    } catch (err) {
      setLocalError(err.message || "Login failed");
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
        background:
          "linear-gradient(135deg, #fdf0f0 0%, #f4f6fb 50%, #fdf0f0 100%)",
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
        }}
      >

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "2rem" }}>🎓</div>
          <h1 style={{ fontSize: "1.9rem", fontWeight: 800 }}>
            Sign In
          </h1>
          <p style={{ color: "#475569" }}>
            Welcome back
          </p>
        </div>

        {/* ERROR */}
        {displayError && (
          <div
            style={{
              background: "#fff5f5",
              border: "1px solid #fca5a5",
              padding: "12px",
              borderRadius: "8px",
              color: "#dc2626",
              marginBottom: "15px",
              textAlign: "center",
            }}
          >
            ❌ {displayError}
          </div>
        )}

        {/* 🔵 TELEGRAM BUTTON */}
        <button
          onClick={handleTelegramLogin}
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

        {/* 🔵 GOOGLE */}
        <button
          onClick={() => googleLoginHandler()}
          disabled={googleLoading || isLoading}
          style={{
            width: "100%",
            padding: "14px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            background: "#fff",
            fontWeight: 600,
            marginBottom: "20px",
          }}
        >
          {googleLoading ? "Loading..." : "Continue with Google"}
        </button>

        {/* OR */}
        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          OR
        </div>

        {/* EMAIL */}
        <form onSubmit={handleEmailLogin}>
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
            style={{ width: "100%", padding: "12px", marginBottom: "12px" }}
          />

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "14px",
              background: "#a81011",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontWeight: 700,
            }}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* FOOTER */}
        <div style={{ textAlign: "center", marginTop: "18px" }}>
          <a href="/register" style={{ color: "#a81011", fontWeight: 700 }}>
            Create account
          </a>
        </div>
      </div>
    </div>
  );
}

export default Login;