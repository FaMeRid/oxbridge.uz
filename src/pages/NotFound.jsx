import React from "react";
import { Link } from "wouter";
import "../styles/globals.css";

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-number">404</div>
      <h2>Page Not Found 😕</h2>
      <p>Looks like this page went missing. Let's get you back on track!</p>
      <Link to="/">
        <button className="btn-primary">🏠 Go to Dashboard</button>
      </Link>
    </div>
  );
}
