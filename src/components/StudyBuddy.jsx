// src/components/StudyBuddy.jsx
import React, { useState, useEffect, useRef } from "react";

const MESSAGES = [
  "👋 Hey buddy! Keep going!",
  "💪 You're doing great!",
  "📚 Remember to take short breaks.",
  "🎯 Focus! You can do this.",
  "🤗 Need a coffee? I'll wait.",
  "🧠 Your brain is getting stronger!",
  "✨ One step at a time, friend.",
  "⏰ 5 more minutes of deep work?",
  "🎧 You hear, buddy? Stay awesome!",
  "🌟 Proud of your effort!",
  "💡 Tip: Review what you just wrote.",
  "🗣️ Practice out loud – it helps!",
];

export default function StudyBuddy({ position = "bottom-right", intervalMinutes = 5, autoShow = true }) {
  const [message, setMessage] = useState("");
  const [isVisible, setIsVisible] = useState(autoShow);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const timeoutRef = useRef(null);

  // Выбор случайной фразы
  const getRandomMessage = () => {
    const randomIndex = Math.floor(Math.random() * MESSAGES.length);
    return MESSAGES[randomIndex];
  };

  // Показать сообщение с анимацией
  const speak = () => {
    const newMessage = getRandomMessage();
    setMessage(newMessage);
    setIsSpeaking(true);
    // Скрыть сообщение через 4 секунды
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsSpeaking(false);
      setMessage("");
    }, 4000);
  };

  // Запуск интервала
  useEffect(() => {
    if (!autoShow) return;
    const interval = setInterval(() => {
      speak();
    }, intervalMinutes * 60 * 1000);
    // Первое появление через 3 секунды после монтирования
    const firstSpeak = setTimeout(speak, 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(firstSpeak);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [autoShow, intervalMinutes]);

  // Если компонент скрыт вручную, не показываем ничего
  if (!isVisible) return null;

  // Позиционирование
  const positionStyles = {
    "bottom-right": { bottom: 24, right: 24 },
    "bottom-left": { bottom: 24, left: 24 },
    "top-right": { top: 24, right: 24 },
    "top-left": { top: 24, left: 24 },
  };

  return (
    <div
      style={{
        position: "fixed",
        ...positionStyles[position],
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        pointerEvents: "none", // чтобы не мешать кликам по странице
      }}
    >
      {/* Облачко с сообщением */}
      {isSpeaking && (
        <div
          style={{
            background: "var(--navy)",
            color: "white",
            padding: "10px 18px",
            borderRadius: "30px",
            marginBottom: "12px",
            maxWidth: "240px",
            fontSize: "0.9rem",
            fontWeight: 500,
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
            animation: "bubblePop 0.3s ease-out",
            fontFamily: "'Inter', system-ui, sans-serif",
            border: "1px solid rgba(255,255,255,0.2)",
            backdropFilter: "blur(4px)",
            whiteSpace: "pre-line",
          }}
        >
          {message}
          <div
            style={{
              position: "absolute",
              bottom: "-8px",
              right: "20px",
              width: "16px",
              height: "16px",
              background: "var(--navy)",
              transform: "rotate(45deg)",
              borderRight: "1px solid rgba(255,255,255,0.2)",
              borderBottom: "1px solid rgba(255,255,255,0.2)",
            }}
          />
        </div>
      )}

      {/* Анимированный персонаж (круглая иконка с глазками) */}
      <div
        style={{
          width: "64px",
          height: "64px",
          background: "linear-gradient(145deg, #a81011, #8b0e0f)",
          borderRadius: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)",
          cursor: "pointer",
          pointerEvents: "auto", // чтобы можно было кликнуть
          transition: "transform 0.2s, box-shadow 0.2s",
          animation: isSpeaking ? "bounce 0.5s ease" : "float 3s ease-in-out infinite",
        }}
        onClick={() => speak()} // по клику тоже говорит
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <div style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
          <div style={{ width: "10px", height: "10px", background: "white", borderRadius: "50%", opacity: 0.9 }} />
          <div style={{ width: "10px", height: "10px", background: "white", borderRadius: "50%", opacity: 0.9 }} />
        </div>
        <div
          style={{
            width: "28px",
            height: "12px",
            background: "#f5c542",
            borderRadius: "20px",
            marginTop: "2px",
            transition: "all 0.2s",
            transform: isSpeaking ? "scaleX(1.2)" : "scaleX(1)",
          }}
        />
      </div>

      {/* Стили анимаций */}
      <style>{`
        @keyframes bubblePop {
          0% { opacity: 0; transform: translateY(20px) scale(0.8); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}