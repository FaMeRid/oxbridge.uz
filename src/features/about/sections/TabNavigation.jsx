// src/features/about/sections/TabNavigation.jsx
import React from "react";

export const TABS = [
  { id: "about", label: "About Us", icon: "🏛️" },
  { id: "faculty", label: "Our Faculty", icon: "👨‍🏫" },
  { id: "events", label: "Events", icon: "📅" },
  { id: "stories", label: "Stories", icon: "📖" },
];

export const TabNavigation = ({ activeTab, setActiveTab }) => (
  <nav className="ab-tabs" aria-label="Main sections">
    <div className="ab-tab-list">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`ab-tab-btn${activeTab === tab.id ? " active" : ""}`}
          onClick={() => setActiveTab(tab.id)}
          aria-selected={activeTab === tab.id}
          role="tab"
        >
          <span className="ab-tab-icon">{tab.icon}</span>
          <span className="ab-tab-label">{tab.label}</span>
        </button>
      ))}
    </div>
  </nav>
);
