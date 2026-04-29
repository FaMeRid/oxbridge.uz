// src/components/StudyBuddy.jsx
import { useEffect, useState, useRef } from "react";

// Если положил гифку в public/assets/buddy.gif:
const buddyGif = "/assets/buddy.gif";
// Если положил в src/assets/, замени строку выше на:
// import buddyGif from "@/assets/buddy.gif";

/* ──────────────── ФРАЗЫ ──────────────── */
const PHRASES = [
  "You've got this! Keep going 💪",
  "Every word brings you closer to Band 8!",
  "Take a breath. You're doing great.",
  "One paragraph at a time — easy 🔥",
  "Remember why you started.",
  "Even Band 9 students rest. Stretch a bit!",
  "Small steps today, big results tomorrow.",
  "Mistakes are part of the journey. Push on!",
  "You're closer to your goal than yesterday.",
  "Discipline beats talent. Look at you go!",
  "Deep breath, straight back — let's go 🚀",
  "IELTS is a marathon, not a sprint. Keep pace!",
  "Your future self is cheering for you.",
  "Progress, not perfection. Keep writing.",
  "One more sentence. Then one more. You can do it.",
];

/* ──────────────── ТАЙМИНГИ ──────────────── */
const FIRST_DELAY = 3000;            // первое появление через 3 сек
const MIN_INTERVAL = 2 * 60 * 1000;  // 2 мин
const MAX_INTERVAL = 3 * 60 * 1000;  // 3 мин
const VISIBLE_TIME = 8000;           // висит 8 сек

const BUDDY_W = 140;
const BUDDY_H = 105;

/* ──────────────── ПОЗИЦИЯ ──────────────── */
function randomPosition() {
  const maxX = Math.max(10, window.innerWidth - BUDDY_W - 20);
  const maxY = Math.max(10, window.innerHeight - BUDDY_H - 20);
  return {
    x: Math.max(10, Math.floor(Math.random() * maxX)),
    y: Math.max(10, Math.floor(Math.random() * maxY)),
  };
}

/* ──────────────── ОЗВУЧКА ──────────────── */
let currentUtterance = null;

function speak(text) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    if (currentUtterance) synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.95;
    u.pitch = 1.1;
    u.volume = 1;
    currentUtterance = u;
    synth.speak(u);
  } catch {}
}

function stopSpeaking() {
  try {
    if (currentUtterance) {
      window.speechSynthesis.cancel();
      currentUtterance = null;
    }
  } catch {}
}

/* ──────────────── РЕЧЕВОЕ ОБЛАЧКО ──────────────── */
function SpeechBubble({ text, side }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: BUDDY_H - 4,
        ...(side === "left" ? { left: BUDDY_W - 20 } : { right: BUDDY_W - 20 }),
        background: "#fff",
        color: "#0c1f4a",
        padding: "10px 14px",
        borderRadius: 14,
        fontFamily: "'Segoe UI', 'DM Sans', system-ui, sans-serif",
        fontSize: "0.85rem",
        fontWeight: 600,
        lineHeight: 1.45,
        maxWidth: 220,
        boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
        border: "1px solid #e2e8f0",
        whiteSpace: "normal",
        animation: "buddyBubble 0.35s cubic-bezier(0.34,1.4,0.64,1) both",
      }}
    >
      {text}
      <span
        style={{
          position: "absolute",
          bottom: -7,
          ...(side === "left" ? { left: 18 } : { right: 18 }),
          width: 12,
          height: 12,
          background: "#fff",
          borderRight: "1px solid #e2e8f0",
          borderBottom: "1px solid #e2e8f0",
          transform: "rotate(45deg)",
        }}
      />
    </div>
  );
}

/* ──────────────── СТИЛИ ──────────────── */
function StyleTag() {
  return (
    <style>{`
      @keyframes buddyPop {
        0%   { transform: scale(0.4); opacity: 0; }
        70%  { transform: scale(1.08); opacity: 1; }
        100% { transform: scale(1);   opacity: 1; }
      }
      @keyframes buddyFadeOut {
        0%   { transform: scale(1);   opacity: 1; }
        100% { transform: scale(0.6); opacity: 0; }
      }
      @keyframes buddyBubble {
        0%   { transform: scale(0.6) translateY(8px); opacity: 0; }
        100% { transform: scale(1)   translateY(0);   opacity: 1; }
      }
      @keyframes buddyBob {
        0%, 100% { transform: translateY(0); }
        50%      { transform: translateY(-3px); }
      }
    `}</style>
  );
}

/* ──────────────── ОСНОВНОЙ КОМПОНЕНТ ──────────────── */
export default function StudyBuddy() {
  const [visible, setVisible] = useState(false);
  const [phrase, setPhrase] = useState(PHRASES[0]);
  const [pos, setPos] = useState({ x: 20, y: 20 });
  const [bubbleSide, setBubbleSide] = useState("left");
  const [leaving, setLeaving] = useState(false);

  const isActiveRef = useRef(false);
  const scheduleRef = useRef(null);
  const hideRef = useRef(null);
  const exitRef = useRef(null);

  const removeBuddy = () => {
    setVisible(false);
    setLeaving(false);
    isActiveRef.current = false;
    stopSpeaking();
  };

  const startExit = () => {
    setLeaving(true);
    if (exitRef.current) clearTimeout(exitRef.current);
    exitRef.current = setTimeout(() => {
      removeBuddy();
      scheduleNext();
    }, 350);
  };

  const showBuddy = () => {
    if (isActiveRef.current) return;
    isActiveRef.current = true;

    const newPhrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    const newPos = randomPosition();
    const side = Math.random() < 0.5 ? "left" : "right";

    // если буди слева у края — облачко справа, и наоборот
    const safeSide =
      newPos.x < 240 ? "right" : newPos.x > window.innerWidth - 380 ? "left" : side;

    setPhrase(newPhrase);
    setPos(newPos);
    setBubbleSide(safeSide);
    setLeaving(false);
    setVisible(true);
    speak(newPhrase);

    if (hideRef.current) clearTimeout(hideRef.current);
    hideRef.current = setTimeout(startExit, VISIBLE_TIME);
  };

  const scheduleNext = () => {
    if (scheduleRef.current) clearTimeout(scheduleRef.current);
    const delay = MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL);
    scheduleRef.current = setTimeout(showBuddy, delay);
  };

  useEffect(() => {
    const firstTimer = setTimeout(showBuddy, FIRST_DELAY);
    return () => {
      clearTimeout(firstTimer);
      if (scheduleRef.current) clearTimeout(scheduleRef.current);
      if (hideRef.current) clearTimeout(hideRef.current);
      if (exitRef.current) clearTimeout(exitRef.current);
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!isActiveRef.current) return;
    if (hideRef.current) clearTimeout(hideRef.current);
    startExit();
  };

  if (!visible) return <StyleTag />;

  // если облачко справа от лисы — лиса смотрит вправо (на текст), и наоборот
  const flipScale = bubbleSide === "right" ? 1 : -1;

  return (
    <>
      <StyleTag />
      <div
        onClick={handleClick}
        title="Click to dismiss"
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          width: BUDDY_W,
          height: BUDDY_H,
          zIndex: 10000,
          cursor: "pointer",
          pointerEvents: "auto",
          borderRadius: 16,
          filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.18))",
          animation: leaving
            ? "buddyFadeOut 0.35s ease-in both"
            : "buddyPop 0.45s cubic-bezier(0.34,1.5,0.64,1) both, buddyBob 2.4s ease-in-out 0.45s infinite",
        }}
      >
        <SpeechBubble text={phrase} side={bubbleSide} />
        <img
          src={buddyGif}
          alt="Study buddy"
          width={BUDDY_W}
          height={BUDDY_H}
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            borderRadius: 16,
            objectFit: "cover",
            transform: `scaleX(${flipScale})`,
            userSelect: "none",
            pointerEvents: "none",
          }}
        />
      </div>
    </>
  );
}