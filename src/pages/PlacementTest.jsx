import { buildQuizSet, getLevel, getSectionScores, shuffle } from '@/data/placementBank.js';
import "../styles/PlacementTest.css";
/* ─── Constants ──────────────────────────────────── */
const LETTERS    = ['A', 'B', 'C', 'D'];
const TAG_CLASS  = {
  Grammar:    'pt-tag--grammar',
  Vocabulary: 'pt-tag--vocabulary',
  Reading:    'pt-tag--reading',
  Writing:    'pt-tag--writing',
  Listening:  'pt-tag--listening',
};

const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';

/* ─── Icons ──────────────────────────────────────── */
const ICON = {
  arrow: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
  back:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>`,
  retry: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
  book:  `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>`,
};

/* ═══════════════════════════════════════════════════
   PlacementTest class
═══════════════════════════════════════════════════ */
export class PlacementTest {
constructor(selector) {
  this._root =
    typeof selector === "string"
      ? document.querySelector(selector)
      : selector;
    if (!this._root) { console.error(`PlacementTest: "${selector}" not found`); return; }

    this._questions = [];
    this._answers   = [];
    this._cur       = 0;
    this._phase     = 'start';

    this._injectStyles();
    this._mount();
    this._render();
  }

  /* ─── Setup ────────────────────────────────────── */
  _injectStyles() {
    if (document.getElementById('pt-styles')) return;
    const s = document.createElement('style');
    s.id = 'pt-styles';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  _mount() {
    this._root.className = 'pt-page';
    this._root.innerHTML = `
      <div class="pt-shell">
        <header class="pt-topbar">
          <a href="/" class="pt-logo">
            <img src="public/assets/icons/logo2.png" style="height:38px" />
            </a>
          <span class="pt-step-label" id="ptTopStep">Placement Test</span>
        </header>
        <div class="pt-progress-wrap" id="ptProgressWrap" style="display:none">
          <div class="pt-progress-track">
            <div class="pt-progress-fill" id="ptProgressFill" style="width:0%"></div>
          </div>
          <div class="pt-progress-meta">
            <span id="ptProgressLabel"></span>
            <span id="ptProgressSec"></span>
          </div>
        </div>
        <main id="ptMain"></main>
      </div>`;

    this.$main     = this._root.querySelector('#ptMain');
    this.$fill     = this._root.querySelector('#ptProgressFill');
    this.$label    = this._root.querySelector('#ptProgressLabel');
    this.$sec      = this._root.querySelector('#ptProgressSec');
    this.$topStep  = this._root.querySelector('#ptTopStep');
    this.$progWrap = this._root.querySelector('#ptProgressWrap');
  }

  _render() {
    if      (this._phase === 'start')  this._renderStart();
    else if (this._phase === 'quiz')   this._renderQuestion();
    else if (this._phase === 'result') this._renderResult();
  }

  /* ─── Start screen ─────────────────────────────── */
  _renderStart() {
    this.$progWrap.style.display = 'none';
    this.$topStep.textContent    = 'Placement Test';

    this.$main.innerHTML = `
      <div class="pt-start">
        <div class="pt-start-icon">${ICON.book}</div>
        <h1>Find Your IELTS Level</h1>
        <p>15 questions across Grammar, Vocabulary, Reading, Writing and Listening. Questions are randomised every attempt so no two tests are the same.</p>
        <div class="pt-start-meta">
          <div class="pt-meta-item"><div class="pt-meta-num">15</div><div class="pt-meta-lbl">Questions</div></div>
          <div class="pt-meta-item"><div class="pt-meta-num">~5</div><div class="pt-meta-lbl">Minutes</div></div>
          <div class="pt-meta-item"><div class="pt-meta-num">5</div><div class="pt-meta-lbl">Skill areas</div></div>
        </div>
        <button class="pt-btn primary" id="ptStartBtn" style="font-size:15px;padding:13px 36px">
          Start Test ${ICON.arrow}
        </button>
      </div>`;

    this.$main.querySelector('#ptStartBtn').addEventListener('click', () => this._startQuiz());
  }

  _startQuiz() {
    this._questions = buildQuizSet();
    this._answers   = new Array(this._questions.length).fill(-1);
    this._cur       = 0;
    this._phase     = 'quiz';
    this.$progWrap.style.display = 'block';
    this._render();
  }

  /* ─── Question screen ──────────────────────────── */
  _renderQuestion() {
    const q   = this._questions[this._cur];
    const pct = (this._cur / this._questions.length) * 100;

    this.$fill.style.width        = pct + '%';
    this.$label.textContent       = `Question ${this._cur + 1} of ${this._questions.length}`;
    this.$sec.textContent         = q.section;
    this.$topStep.textContent     = `${this._cur + 1} / ${this._questions.length}`;

    const tagClass = TAG_CLASS[q.section] || 'pt-tag--grammar';

    this.$main.innerHTML = `
      <div class="pt-tag ${tagClass}">${q.section}</div>
      <div class="pt-card">
        <p class="pt-question-text">${q.q}</p>
        <div class="pt-options" id="ptOpts">
          ${q.opts.map((o, i) => `
            <label class="pt-option${this._answers[this._cur] === i ? ' selected' : ''}" data-i="${i}">
              <input type="radio" name="ptq" value="${i}" ${this._answers[this._cur] === i ? 'checked' : ''}/>
              <span class="pt-opt-dot"></span>
              <span class="pt-opt-letter">${LETTERS[i]}</span>
              <span>${o}</span>
            </label>`).join('')}
        </div>
        <div class="pt-nav">
          <button class="pt-btn" id="ptBack" ${this._cur === 0 ? 'disabled' : ''}>
            ${ICON.back} Back
          </button>
          <button class="pt-btn primary" id="ptNext" ${this._answers[this._cur] === -1 ? 'disabled' : ''}>
            ${this._cur < this._questions.length - 1 ? 'Next' : 'Finish'} ${ICON.arrow}
          </button>
        </div>
      </div>`;

    this.$main.querySelectorAll('.pt-option').forEach(label => {
      label.addEventListener('click', () => {
        const i = parseInt(label.dataset.i, 10);
        this._answers[this._cur] = i;
        this.$main.querySelectorAll('.pt-option').forEach(l => l.classList.remove('selected'));
        label.classList.add('selected');
        this.$main.querySelector('#ptNext').disabled = false;
      });
    });

    this.$main.querySelector('#ptBack').addEventListener('click', () => { this._cur--; this._render(); });
    this.$main.querySelector('#ptNext').addEventListener('click', () => {
      if (this._cur < this._questions.length - 1) { this._cur++; this._render(); }
      else { this._phase = 'result'; this._renderResult(); }
    });
  }

  /* ─── Result screen ────────────────────────────── */
  _renderResult() {
    const { _questions: qs, _answers: ans } = this;
    const score    = ans.reduce((s, a, i) => s + (a === qs[i].ans ? 1 : 0), 0);
    const pct      = Math.round((score / qs.length) * 100);
    const level    = getLevel(score);
    const sections = getSectionScores(qs, ans);
    const deg      = Math.round((pct / 100) * 360);

    this.$fill.style.width    = '100%';
    this.$label.textContent   = 'Complete';
    this.$sec.textContent     = '';
    this.$topStep.textContent = 'Your Results';

    this.$main.innerHTML = `
      <div class="pt-result">
        <div class="pt-result-hero">
          <div class="pt-score-ring" style="--deg:${deg}deg">
            <div class="pt-score-inner">
              <span class="pt-score-num">${score}/${qs.length}</span>
              <span class="pt-score-pct">${pct}%</span>
            </div>
          </div>
          <div class="pt-level-pill" style="background:${level.bg};color:${level.fg}">${level.label}</div>
          <p class="pt-result-ielts">Estimated IELTS Band: <strong>${level.ielts}</strong></p>
        </div>

        <div class="pt-breakdown">
          ${sections.map(s => `
            <div class="pt-break-item">
              <div class="pt-break-name">${s.sec}</div>
              <div class="pt-break-pct">${s.pct}%</div>
              <div class="pt-break-bar"><div class="pt-break-fill" style="width:${s.pct}%"></div></div>
            </div>`).join('')}
        </div>

        <div class="pt-ai-box">
          <div class="pt-ai-header">
            <div class="pt-ai-dot"></div>
            <span>AI Tutor — Personalised Feedback</span>
          </div>
          <div class="pt-ai-body" id="ptAiFeedback">
            <span class="pt-typing-cursor"></span>
          </div>
        </div>

        <div class="pt-result-actions">
          <button class="pt-btn" id="ptRetake">${ICON.retry} Retake test</button>
          <button class="pt-btn primary" id="ptStudy">Get Study Plan ${ICON.arrow}</button>
        </div>
      </div>`;

    this.$main.querySelector('#ptRetake').addEventListener('click', () => {
      this._phase = 'start';
      this.$progWrap.style.display = 'none';
      this._render();
    });

    this.$main.querySelector('#ptStudy').addEventListener('click', () => {
      const weakest = [...sections].sort((a, b) => a.pct - b.pct)[0];
      alert(`Focus on ${weakest.sec} first (${weakest.pct}%). Use the Tools section for targeted practice.`);
    });

    this._fetchAIFeedback(score, qs.length, level, sections);
  }

  /* ─── AI Feedback ──────────────────────────────── */
  async _fetchAIFeedback(score, total, level, sections) {
    const weak   = [...sections].sort((a, b) => a.pct - b.pct).slice(0, 2).map(s => `${s.sec} (${s.pct}%)`).join(' and ');
    const strong = [...sections].sort((a, b) => b.pct - a.pct)[0];
    const prompt = `You are a friendly, expert IELTS tutor. A student just completed a placement test.

Results:
- Score: ${score}/${total} (${Math.round(score/total*100)}%)
- Level: ${level.label}
- Estimated IELTS Band: ${level.ielts}
- Strongest area: ${strong.sec} (${strong.pct}%)
- Weakest areas: ${weak}
- Section breakdown: ${sections.map(s => `${s.sec}: ${s.pct}%`).join(', ')}

Write 3–4 sentences of warm, specific, actionable feedback. Acknowledge their level, highlight what to improve, and give one concrete study tip for their weakest skill. Be encouraging and direct. No bullet points — flowing prose only.`;

    const $box = this.$main.querySelector('#ptAiFeedback');
    if (!$box) return;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const text = data.content?.map(b => b.text || '').join('') || '';

      // Typewriter effect
      $box.innerHTML = '';
      const cursor = document.createElement('span');
      cursor.className = 'pt-typing-cursor';
      let i = 0;

      const type = () => {
        if (!this.$main.querySelector('#ptAiFeedback')) return;
        if (i < text.length) {
          $box.textContent = text.slice(0, ++i);
          $box.appendChild(cursor);
          setTimeout(type, 18);
        } else {
          cursor.remove();
        }
      };
      type();

    } catch (err) {
      console.error('AI feedback error:', err);
      if ($box) {
        $box.innerHTML = `<em style="color:var(--pt-ink-3)">AI feedback unavailable. Based on your score, you are at <strong>${level.label}</strong> level (IELTS ${level.ielts}). ${level.desc}</em>`;
      }
    }
  }
}
import { useEffect, useRef } from "react";

export default function PlacementWrapper() {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      new PlacementTest(ref.current);
    }
  }, []);

  return <div ref={ref} />;
}