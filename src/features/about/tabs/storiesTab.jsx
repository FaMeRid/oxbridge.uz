// src/features/about/tabs/StoriesTab.jsx
import React from "react";
import { SUCCESS_STORIES } from "../data/stories";
import { TESTIMONIALS } from "../data/testimonials";
import { Icons } from "../ui/Icons";
import { SectionTitle } from "../ui/SectionTitle";
import { ABadge } from "../ui/ABadge";
import { ABtn } from "../ui/ABtn";

export const StoriesTab = () => (
  <div className="ab-tab-content">
    <SectionTitle
      subtitle="Real stories from students who achieved their IELTS dreams"
      centered
    >
      Success Stories
    </SectionTitle>

    <div className="ab-stories-grid">
      {SUCCESS_STORIES.map((story) => (
        <article key={story.id} className="ab-story-card">
          <div className="ab-story-img-wrap">
            <img
              src={story.image}
              alt={story.title}
              className="ab-story-img"
              loading="lazy"
            />
            <ABadge type="secondary">{story.category}</ABadge>
          </div>
          <div className="ab-story-body">
            <p className="ab-story-date">{story.date}</p>
            <h3 className="ab-story-title">{story.title}</h3>
            <p className="ab-story-excerpt">{story.excerpt}</p>
            <ABtn variant="outline" size="sm" href="#read-more">
              Read More <Icons.ArrowRight />
            </ABtn>
          </div>
        </article>
      ))}
    </div>

    {/* Testimonials */}
    <div style={{ marginTop: "60px" }}>
      <SectionTitle subtitle="What our students say about their experience" centered>
        Student Testimonials
      </SectionTitle>
      <div className="ab-testimonials-grid">
        {TESTIMONIALS.map((t, idx) => (
          <div key={idx} className="ab-testimonial-card">
            <div className="ab-testimonial-stars">{"★".repeat(5)}</div>
            <p className="ab-testimonial-text">"{t.text}"</p>
            <div className="ab-testimonial-author">
              <img
                src={t.image}
                alt={t.name}
                className="ab-testimonial-avatar"
              />
              <div>
                <p className="ab-testimonial-name">{t.name}</p>
                <p className="ab-testimonial-details">
                  Band {t.band} • {t.university}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
