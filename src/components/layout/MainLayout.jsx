import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function MainLayout() {
  return (
    <div style={styles.wrapper}>

      {/* 🔥 HEADER (один на все страницы) */}
      <Header />

      {/* 🔥 CONTENT */}
      <main style={styles.main}>
        <Outlet />
      </main>

    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "#f9fafb",
  },

  main: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "24px 20px",
    marginTop: "10px", // 👈 добавь это
  },
};