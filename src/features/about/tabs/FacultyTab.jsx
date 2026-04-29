// src/features/about/tabs/FacultyTab.jsx
import React from "react";
import { FACULTY_MEMBERS } from "../data/faculty";
import { SOCIAL_LINKS } from "../data/academyInfo";
import { Icons } from "../ui/Icons";
import { SectionTitle } from "../ui/SectionTitle";
import { ABadge } from "../ui/ABadge";
import { ABtn } from "../ui/ABtn";

const FacultyCard = ({ member }) => (
  <article className="ab-faculty-card">
    <div className="ab-faculty-img-wrap">
      <img
        src={member.image}
        alt={member.name}
        className="ab-faculty-img"
        loading="lazy"
      />
      <div className="ab-faculty-overlay">
        <div className="ab-faculty-social">
          <a
            href={`mailto:${member.social.email}`}
            className="ab-social-btn"
            aria-label={`Email ${member.name}`}
            title="Send Email"
          >
            <Icons.Mail />
          </a>
          <a
            href={member.social.linkedin}
            className="ab-social-btn"
            aria-label={`${member.name} on LinkedIn`}
            title="LinkedIn Profile"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icons.LinkedIn />
          </a>
        </div>
      </div>
    </div>
    <div className="ab-faculty-body">
      <div className="ab-faculty-head">
        <h3 className="ab-faculty-name">{member.name}</h3>
        <ABadge type="primary">{member.role}</ABadge>
      </div>
      <p className="ab-faculty-creds">{member.credentials}</p>
      <div className="ab-faculty-meta">
        <span>
          <Icons.Award /> {member.experience}
        </span>
        <span>{member.specialization}</span>
      </div>
      <p className="ab-faculty-bio">{member.bio}</p>
      <div className="ab-achievements">
        {member.achievements.map((a) => (
          <span key={a} className="ab-achievement">
            {a}
          </span>
        ))}
      </div>
    </div>
  </article>
);

export const FacultyTab = () => (
  <div className="ab-tab-content" id="faculty">
    <SectionTitle
      subtitle="Learn from certified IELTS experts with decades of combined experience"
      centered
    >
      Meet Our Faculty
    </SectionTitle>
    <div className="ab-faculty-grid">
      {FACULTY_MEMBERS.map((m) => (
        <FacultyCard key={m.id} member={m} />
      ))}
    </div>
    <div className="ab-faculty-cta">
      <p>Interested in joining our world-class team?</p>
      <ABtn variant="outline" href={`mailto:${SOCIAL_LINKS.email}`}>
        View Career Opportunities
      </ABtn>
    </div>
  </div>
);
