// src/app/Modules.jsx
import React from "react";

export default function Modules() {
  return (
    <section className="modules">
      <h2>Choose Your Module</h2>
      <div className="module-cards">
        <div className="module-card">
          <i className="fas fa-headphones"></i>
          <h3>Listening</h3>
          <p>Practice with real exam audio</p>
        </div>

        <div className="module-card">
          <i className="fas fa-book"></i>
          <h3>Reading</h3>
          <p>Academic IELTS passages</p>
        </div>
      </div>
    </section>
  );
}