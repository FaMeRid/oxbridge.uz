// src/features/about/tabs/EventsTab.jsx
import React, { useState, useMemo } from "react";
import { ACADEMY_EVENTS } from "../data/events";
import { getDaysUntil } from "../utils/date";
import { Icons } from "../ui/Icons";
import { SectionTitle } from "../ui/SectionTitle";
import { ABadge } from "../ui/ABadge";
import { ABtn } from "../ui/ABtn";

const FILTERS = [
  { id: "all", label: "All Events" },
  { id: "featured", label: "Featured" },
  { id: "workshop", label: "Workshops" },
  { id: "exam", label: "Mock Tests" },
];

const EventCard = ({ event }) => {
  const days = getDaysUntil(event.date);
  const isSoon = days <= 7 && days > 0;
  const isFull = event.spotsLeft === 0;
  const month = new Date(event.date).toLocaleString("en-US", { month: "short" });
  const day = new Date(event.date).getDate();

  return (
    <article className={`ab-event-card${event.featured ? " featured" : ""}`}>
      {event.featured && <div className="ab-event-featured">Featured</div>}
      <div className="ab-event-img-wrap">
        <img
          src={event.image}
          alt={event.title}
          className="ab-event-img"
          loading="lazy"
        />
        <div className="ab-event-date">
          <span className="ab-event-month">{month}</span>
          <span className="ab-event-day">{day}</span>
        </div>
      </div>
      <div className="ab-event-body">
        <div className="ab-event-head">
          <ABadge type={event.type === "Exam Simulation" ? "accent" : "secondary"}>
            {event.type}
          </ABadge>
          {isSoon && <ABadge type="urgent">In {days} days!</ABadge>}
        </div>
        <h3 className="ab-event-title">{event.title}</h3>
        <p className="ab-event-desc">{event.description}</p>
        <div className="ab-event-details">
          <span>
            <Icons.Clock /> {event.time}
          </span>
          <span>
            <Icons.MapPin /> {event.location}
          </span>
          <span className={isFull ? "ab-full" : ""}>
            <Icons.Users />{" "}
            {isFull ? "Fully Booked" : `${event.spotsLeft}/${event.spots} spots`}
          </span>
        </div>
        <div className="ab-event-actions">
          <ABtn
            variant={isFull ? "disabled" : "primary"}
            size="sm"
            onClick={() => !isFull && alert(`Registering for: ${event.title}`)}
          >
            {isFull ? "Join Waitlist" : "Register Now"}
          </ABtn>
          <button className="ab-event-more">
            View Details <Icons.ChevronRight />
          </button>
        </div>
      </div>
    </article>
  );
};

export const EventsTab = () => {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return ACADEMY_EVENTS;
    if (filter === "featured") return ACADEMY_EVENTS.filter((e) => e.featured);
    return ACADEMY_EVENTS.filter((e) => e.type.toLowerCase().includes(filter));
  }, [filter]);

  return (
    <div className="ab-tab-content" id="events">
      <SectionTitle
        subtitle={`${ACADEMY_EVENTS.length} upcoming events to accelerate your IELTS journey`}
        centered
      >
        Events & Workshops
      </SectionTitle>

      <div className="ab-events-filter">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`ab-filter-btn${filter === f.id ? " active" : ""}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="ab-events-grid">
        {filtered.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </div>
  );
};
