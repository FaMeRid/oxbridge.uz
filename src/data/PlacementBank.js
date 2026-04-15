// src/data/placementBank.js
// Question bank — 40 questions, 8 per category.
// buildQuizSet() returns a fresh shuffled 15-question set each call.

export const BANK = {
  Grammar: [
    { q: "She ___ to work every day by bus.", opts: ["go", "goes", "going", "gone"], ans: 1 },
    { q: "If I ___ you, I would apologize immediately.", opts: ["am", "was", "were", "be"], ans: 2 },
    { q: "The report ___ by the committee before the deadline.", opts: ["was submitted", "submitted", "has submitted", "submitting"], ans: 0 },
    { q: "By the time we arrived, the film ___.", opts: ["already started", "had already started", "has already started", "was already starting"], ans: 1 },
    { q: "Neither the manager nor the employees ___ aware of the issue.", opts: ["was", "were", "is", "are"], ans: 1 },
    { q: "___ you rather stay in or go out tonight?", opts: ["Do", "Would", "Should", "Shall"], ans: 1 },
    { q: "He suggested that she ___ the proposal again.", opts: ["reconsider", "reconsiders", "reconsidered", "would reconsider"], ans: 0 },
    { q: "The data ___ been analysed thoroughly.", opts: ["has", "have", "had", "is"], ans: 0 },
  ],
  Vocabulary: [
    { q: "The negotiations reached a ___. Neither side would compromise.", opts: ["breakthrough", "deadlock", "consensus", "milestone"], ans: 1 },
    { q: "The scientist's findings were ___; no one expected such results.", opts: ["mundane", "groundbreaking", "trivial", "expected"], ans: 1 },
    { q: "The policy was met with ___; critics said it would worsen inequality.", opts: ["acclaim", "indifference", "condemnation", "bewilderment"], ans: 2 },
    { q: "The CEO's speech was deliberately ___; no clear decision was announced.", opts: ["candid", "ambiguous", "transparent", "decisive"], ans: 1 },
    { q: "Despite initial resistance, the idea eventually ___ among stakeholders.", opts: ["permeated", "gained traction", "fell flat", "backfired"], ans: 1 },
    { q: "The athlete's performance was ___; she broke three world records.", opts: ["mediocre", "lackluster", "phenomenal", "adequate"], ans: 2 },
    { q: "He was known for his ___ — always finding a solution where others saw none.", opts: ["tenacity", "ingenuity", "arrogance", "apathy"], ans: 1 },
    { q: "The report contained ___ evidence — enough to question the whole study.", opts: ["compelling", "spurious", "meticulous", "concurrent"], ans: 1 },
  ],
  Reading: [
    { q: '"Despite the economic downturn, the company maintained its market share." What does "despite" signal?', opts: ["A reason", "A contrast", "A result", "An addition"], ans: 1 },
    { q: "Which sentence uses a formal academic register?", opts: ["Things got really bad fast.", "The situation deteriorated rapidly.", "It was like, super terrible.", "Stuff went wrong quick."], ans: 1 },
    { q: "\"The author implies that modern cities are unsustainable.\" What does 'implies' mean here?", opts: ["states directly", "suggests indirectly", "denies", "proves"], ans: 1 },
    { q: "'The research is not without its limitations.' What does this mean?", opts: ["The research has no limitations", "The research is perfect", "The research has some limitations", "The research is useless"], ans: 2 },
    { q: "'Sales rose after the ad campaign launched.' Which is a valid inference?", opts: ["The ad campaign caused sales to rise", "Sales always rise in this industry", "The product improved", "The company lowered prices"], ans: 0 },
    { q: "'The findings corroborate earlier studies.' What does 'corroborate' mean?", opts: ["contradict", "support", "summarise", "replace"], ans: 1 },
    { q: "A paragraph begins: 'However, not all experts agree.' What is its purpose?", opts: ["To introduce a new topic", "To introduce a counterargument", "To conclude the essay", "To provide evidence"], ans: 1 },
    { q: "Which sentence best introduces a body paragraph in an academic essay?", opts: ["There are many reasons.", "One significant factor is the rise in urban migration.", "I think this is important.", "Lots of people believe this."], ans: 1 },
  ],
  Writing: [
    { q: "Which is the most appropriate topic sentence for a body paragraph?", opts: ["There are many reasons.", "One significant factor is the rise in urban migration.", "I think this is important.", "Lots of people believe this."], ans: 1 },
    { q: "Which linking phrase correctly introduces a contrasting idea?", opts: ["Furthermore", "In addition", "Nevertheless", "As a result"], ans: 2 },
    { q: "In IELTS Writing Task 2, the minimum word count is:", opts: ["150 words", "250 words", "300 words", "200 words"], ans: 1 },
    { q: "Which sentence is an example of passive voice?", opts: ["The committee reviewed the report.", "The report was reviewed by the committee.", "The committee will review the report.", "Reviewing the report took time."], ans: 1 },
    { q: "'The graph shows a significant increase in CO₂ levels between 2000 and 2020.' This is best described as:", opts: ["An opinion", "A trend description", "A prediction", "A comparison"], ans: 1 },
    { q: "Which word is NOT used to show a concessive relationship?", opts: ["although", "even though", "while", "therefore"], ans: 3 },
    { q: "A strong paragraph should contain: a topic sentence, supporting evidence, and ___.", opts: ["a new argument", "a concluding sentence", "a list of facts", "a counterargument"], ans: 1 },
    { q: "Which phrase avoids informal language in academic writing?", opts: ["a lot of", "a great deal of", "tons of", "loads of"], ans: 1 },
  ],
  Listening: [
    { q: "A speaker stresses 'NEVER' very strongly. This most likely signals:", opts: ["Uncertainty", "Emphasis and importance", "A question", "Politeness"], ans: 1 },
    { q: "In a lecture, the speaker says 'To summarise…'. What follows?", opts: ["New information", "A question", "A restatement of key points", "An example"], ans: 2 },
    { q: "A speaker uses rising intonation at the end of a statement. This usually indicates:", opts: ["Certainty", "A finished thought", "A question or uncertainty", "Boredom"], ans: 2 },
    { q: "In IELTS Listening, the recordings are played:", opts: ["twice", "three times", "once", "as many times as needed"], ans: 2 },
    { q: "The phrase 'That is to say…' signals:", opts: ["A contrast", "A clarification or rephrasing", "A conclusion", "An example"], ans: 1 },
    { q: "A speaker says 'Mind you, this is just my opinion.' This signals:", opts: ["A fact", "A personal caveat", "A statistic", "Agreement"], ans: 1 },
    { q: "In a conversation, 'Uh-huh' from a listener typically shows:", opts: ["Disagreement", "Active listening and acknowledgment", "Confusion", "Boredom"], ans: 1 },
    { q: "The phrase 'First and foremost' in a talk suggests:", opts: ["The last point", "The most important point", "A small detail", "A counterpoint"], ans: 1 },
  ],
};

export const LEVELS = [
  { max: 4,        label: "A2 — Elementary",        bg: "#fdebd0", fg: "#7d4c0a", ielts: "< 4.0",   desc: "You have foundational English. Focus on core grammar patterns, basic vocabulary and simple sentence structures." },
  { max: 7,        label: "B1 — Intermediate",       bg: "#d6eaf8", fg: "#1a4fa0", ielts: "4.5–5.5", desc: "You can handle familiar topics with reasonable accuracy. Work on complex grammar, cohesion and expanding vocabulary." },
  { max: 10,       label: "B2 — Upper Intermediate", bg: "#d5f5e3", fg: "#1a6b4a", ielts: "6.0–6.5", desc: "Strong English across the board. Refine precision in academic writing and expose yourself to native-speed listening." },
  { max: 13,       label: "C1 — Advanced",           bg: "#e8d8f8", fg: "#5b21b6", ielts: "7.0–8.0", desc: "Impressive command of English. Focus on nuance, idiomatic use and high-level academic writing to reach band 8+." },
  { max: Infinity, label: "C2 — Proficient",         bg: "#fef9c3", fg: "#78350f", ielts: "8.5–9.0", desc: "Near-native proficiency. Focus on exam strategy and perfecting writing coherence for a top band score." },
];

/** Fisher-Yates shuffle */
export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Returns a fresh 15-question set (3 per category), shuffled */
export function buildQuizSet() {
  return shuffle(
    Object.entries(BANK).flatMap(([section, qs]) =>
      shuffle(qs).slice(0, 3).map(q => ({ ...q, section }))
    )
  );
}

export function getLevel(score) {
  return LEVELS.find(l => score <= l.max);
}

export function getSectionScores(questions, answers) {
  return Object.keys(BANK).map(sec => {
    const qs = questions.filter(q => q.section === sec);
    const correct = qs.filter(q => answers[questions.indexOf(q)] === q.ans).length;
    return { sec, pct: qs.length ? Math.round((correct / qs.length) * 100) : 0 };
  });
}