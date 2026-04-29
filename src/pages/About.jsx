// src/features/about/About.jsx
import React, { useState } from "react";
import "@/styles/globals.css";
import "@/styles/aboutPage.css";

import { HeroSection } from "@/features/about/sections/HeroSection";
import { TabNavigation } from "@/features/about/sections/TabNavigation";
import { ConnectSection } from "@/features/about/sections/ConnectSection";

import { AboutTab } from "@/features/about/tabs/AboutTab";
import { FacultyTab } from "@/features/about/tabs/FacultyTab";
import { EventsTab } from "@/features/about/tabs/EventsTab";
import { StoriesTab } from "@/features/about/tabs/StoriesTab";

const TAB_COMPONENTS = {
  about: AboutTab,
  faculty: FacultyTab,
  events: EventsTab,
  stories: StoriesTab,
};

export default function About() {
  const [activeTab, setActiveTab] = useState("about");
  const ActiveComponent = TAB_COMPONENTS[activeTab] || AboutTab;

  return (
    <div className="ab-page">
      <HeroSection />
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="ab-main">
        <ActiveComponent />
      </main>
      <ConnectSection />
    </div>
  );
}
