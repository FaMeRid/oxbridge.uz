import React, { useEffect, useRef, useState } from "react";
import "@/styles/VerticalTesting.css";

const TESTIMONIALS = [
  { name:"Aziza M.",    country:"Tashkent, UZ",  avatar:"👩‍🎓", band:"7.5", text:"Jumped from 6.0 to 7.5 in 3 weeks. The spaced repetition vocab system is a game changer!", color:"red"    },
  { name:"Jasur K.",    country:"Samarkand, UZ", avatar:"👨‍🎓", band:"7.0", text:"Real exam felt easier than this platform 😂 Honestly the best prep I've done.",              color:"blue"   },
  { name:"Zarina T.",   country:"Almaty, KZ",    avatar:"👩‍🎓", band:"6.5", text:"Flashcards helped me remember everything faster. I was struggling with vocabulary before.", color:"green"  },
  { name:"Timur B.",    country:"Samarkand, UZ",      avatar:"👨",   band:"8.0", text:"Score predictor was spot on 😳 Predicted 7.5 and I got exactly that.",                       color:"amber"  },
  { name:"Madina R.",   country:"Bishkek, KG",   avatar:"👩",   band:"6.0", text:"The vocabulary tool is actually addictive 🔥 I open it every morning before work.",          color:"purple" },
  { name:"Sardor N.",   country:"Namangan, UZ",  avatar:"🧑",   band:"7.5", text:"Speaking went from my weakest skill to my strongest. The cue card timer is brilliant.",      color:"red"    },
  { name:"Dilnoza A.",  country:"Fergana, UZ",   avatar:"👩‍💻", band:"8.5", text:"Writing feedback is insane. It caught errors my teacher of 2 years never noticed.",         color:"blue"   },
  { name:"Bekzod Y.",   country:"Nukus, UZ",     avatar:"👨‍💻", band:"7.0", text:"Only platform that actually works. I tried 4 others before finding Oxbridge.",              color:"green"  },
  { name:"Sardor J.",    country:"London, UK",    avatar:"👩‍🎓", band:"8.5", text:"Went from 6.5 to 8.5 in exactly 3 months. I got into my dream university because of this.", color:"amber"  },
  { name:"Ahmed H.",    country:"Termez, UZ",     avatar:"👨‍🎓", band:"7.5", text:"Personalised study plan helped me focus on weak areas instead of wasting time.",            color:"purple" },
  { name:"Maria G.",    country:"Termez, UZ", avatar:"👩",   band:"7.0", text:"Practice tests are so realistic. Essay templates gave me a solid structure I still use.",   color:"red"    },
  { name:"Hiroshi T.",  country:"Termez, UZ",     avatar:"👨",   band:"7.5", text:"Listening improved massively. The 4-part mock tests feel identical to the real thing.",     color:"blue"   },
  { name:"Ali R.",      country:"Termez, UZ",    avatar:"🧑‍🎓", band:"7.0", text:"Band 7.0 finally 😭 Third attempt and this platform made the difference. Thank you!",       color:"green"  },
  { name:"Laylo S.",    country:"Tashkent, UZ",  avatar:"👩",   band:"6.5", text:"I love the UI, feels like a real premium product not a free tool. Study feels enjoyable.",  color:"amber"  },
  { name:"Zuxra Z.",     country:"Termez, UZ",     avatar:"🧑",   band:"8.0", text:"Better than the expensive IELTS course I paid £400 for. No comparison honestly.",           color:"purple" },
  { name:"Fatima Z.",   country:"Termez, UZ",     avatar:"👩‍💻", band:"6.5", text:"Daily practice built my confidence step by step. Never felt overwhelmed.",                  color:"red"    },
  { name:"Chen W.",     country:"Russia, RU",  avatar:"👨‍💼", band:"7.5", text:"The grammar checker found patterns in my mistakes I had no idea about. Very smart tool.",  color:"blue"   },
  { name:"Priya K.",    country:"Mumbai, IN",    avatar:"👩‍💼", band:"8.0", text:"Academic Writing Task 1 was my nightmare. The templates fixed it in two weeks.",            color:"green"  },
  { name:"Umar F.",     country:"Dubai, AE",     avatar:"👨",   band:"7.0", text:"The study planner kept me on track. Without it I would have procrastinated for months.",    color:"amber"  },
  { name:"Aisha B.",    country:"Tashkent, UZ",   avatar:"👩",   band:"7.5", text:"Reading trainer with timed exercises is perfect. My scan speed doubled in three weeks.",   color:"purple" },
  { name:"Lena V.",     country:"Namangan, UZ",      avatar:"👩‍🎓", band:"8.0", text:"Never thought I'd enjoy studying for IELTS. The gamified flashcards made it fun.",         color:"red"    },
  { name:"Shohruh S.",     country:"Tashkent, UZ",     avatar:"👨‍🎓", band:"7.5", text:"Mock listening tests are incredibly accurate. My score jumped a full band.",               color:"blue"   },
  { name:"Behruz A.",     country:"Tashkent, UZ",     avatar:"👩",   band:"6.5", text:"The community forum is so supportive. Got tips from students who just passed.",             color:"green"  },
  { name:"Damir J.",    country:"Tashkent, UZ",    avatar:"👨",   band:"7.0", text:"Progress charts kept me motivated. Seeing the trend go up every week was everything.",      color:"amber"  },
];

const ACCENTS = ["red","blue","green","amber","purple"];
const SLOW_SPEED = 0.06;

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function Column({ items, speed, reverse }) {
  const trackRef  = useRef(null);
  const posRef    = useRef(0);
  const hoveredRef = useRef(false);
  const tripled   = [...items, ...items, ...items];

  useEffect(() => {
    let raf;
    const step = () => {
      const el = trackRef.current;
      if (!el) return;
      const half = el.scrollHeight / 3;
      const spd = hoveredRef.current ? SLOW_SPEED : speed;
      posRef.current += spd * (reverse ? -1 : 1);
      if (!reverse && posRef.current >= half)  posRef.current -= half;
      if (reverse  && posRef.current <= -half) posRef.current += half;
      const ty = reverse ? posRef.current : -posRef.current;
      el.style.transform = `translateY(${ty}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [speed, reverse]);

  return (
    <div
      className="vt-column"
      onMouseEnter={() => { hoveredRef.current = true; }}
      onMouseLeave={() => { hoveredRef.current = false; }}
    >
      <div ref={trackRef} className="vt-track">
        {tripled.map((t, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          return (
            <div key={i} className={`vt-card accent-${accent}`}>
              <div className="vt-header">
                <div className="vt-user">
                  <div className={`vt-avatar av-${accent}`}>{t.avatar}</div>
                  <div className="vt-meta">
                    <span className="vt-name">{t.name}</span>
                    <span className="vt-country">{t.country}</span>
                  </div>
                </div>
                <span className={`vt-badge ${accent}`}>Band {t.band}</span>
              </div>
              <div className="vt-stars">{"★★★★★".split("").map((s,j)=><span key={j} className="vt-star">{s}</span>)}</div>
              <p className="vt-text">"{t.text}"</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function VerticalTestimonials() {
  const [cols] = useState(() => {
    const s = shuffle(TESTIMONIALS);
    return [s.slice(0, 8), s.slice(8, 16), s.slice(16)];
  });
  return (
    <div className="vt-wrapper">
      <Column items={cols[0]} speed={0.38} />
      <Column items={cols[1]} speed={0.58} reverse />
      <Column items={cols[2]} speed={0.46} />
    </div>
  );
}