// src/features/about/sections/ConnectSection.jsx
import React from "react";
import { ACADEMY_INFO, SOCIAL_LINKS } from "../data/academyInfo";
import { Icons } from "../ui/Icons";
import { ABtn } from "../ui/ABtn";

const SOCIAL_CARDS = [
  {
    href: SOCIAL_LINKS.instagram,
    Icon: Icons.Instagram,
    label: "Instagram",
    sub: "@oxbridgeuz",
    cls: "instagram",
  },
  {
    href: SOCIAL_LINKS.telegram,
    Icon: Icons.Telegram,
    label: "Telegram",
    sub: "Join our community",
    cls: "telegram",
  },
  {
    href: SOCIAL_LINKS.youtube,
    Icon: Icons.Youtube,
    label: "YouTube",
    sub: "Free IELTS tips",
    cls: "youtube",
  },
  {
    href: `mailto:${SOCIAL_LINKS.email}`,
    Icon: Icons.Mail,
    label: "Email",
    sub: SOCIAL_LINKS.email,
    cls: "email",
  },
];

export const ConnectSection = () => (
  <section className="ab-connect" aria-labelledby="connect-title">
    <div className="ab-connect-inner">
      <h2 id="connect-title">Connect With Us</h2>
      <p>Questions about courses, scheduling, or IELTS strategies? We're here to help.</p>

      {/* Contact Info */}
      <div className="ab-contact-info" style={{ marginBottom: "40px" }}>
        <div className="ab-contact-item">
          <Icons.Location size={20} />
          <div>
            <strong>Visit Us</strong>
            <p>{ACADEMY_INFO.address}</p>
          </div>
        </div>
        <div className="ab-contact-item">
          <Icons.Phone size={20} />
          <div>
            <strong>Call Us</strong>
            <p>{ACADEMY_INFO.phone}</p>
          </div>
        </div>
        <div className="ab-contact-item">
          <Icons.Mail size={20} />
          <div>
            <strong>Email Us</strong>
            <p>{SOCIAL_LINKS.email}</p>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="ab-connect-grid">
        {SOCIAL_CARDS.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`ab-connect-card ${c.cls}`}
          >
            <div className="ab-connect-icon">
              <c.Icon size={24} />
            </div>
            <div>
              <strong>{c.label}</strong>
              <span>{c.sub}</span>
            </div>
          </a>
        ))}
      </div>

      {/* CTA */}
      <div className="ab-connect-cta" style={{ marginTop: "40px", textAlign: "center" }}>
        <ABtn variant="primary" size="lg" href="/contact">
          Get in Touch
        </ABtn>
      </div>
    </div>
  </section>
);
