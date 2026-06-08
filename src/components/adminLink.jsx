// src/components/AdminLink.jsx
import React from "react";
import { Link } from "wouter";

function getRoleFromToken() {
  try {
    const tok = localStorage.getItem("oxbridge_token");
    if (!tok) return null;
    const payload = JSON.parse(atob(tok.split(".")[1]));
    return payload.user_metadata?.role || payload.role || null;
  } catch {
    return null;
  }
}

export default function AdminLink() {
  const role = getRoleFromToken();
  if (role !== "admin") return null;

  return (
    <Link href="/admin">
      <a
        title="Админ-панель"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 16px",
          background: "linear-gradient(135deg, #c0003c, #e63659)",
          color: "#fff",
          borderRadius: 999,
          fontWeight: 700,
          fontSize: "0.85rem",
          textDecoration: "none",
          letterSpacing: "0.3px",
          boxShadow: "0 2px 8px rgba(192, 0, 60, 0.25)",
          whiteSpace: "nowrap",
        }}
      >
        🛡️ Админка
      </a>
    </Link>
  );
}