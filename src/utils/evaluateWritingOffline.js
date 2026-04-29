// src/utils/evaluateWritingOffline.js

const L_CC = [
  "furthermore", "however", "in addition", "moreover", "on the other hand",
  "by contrast", "consequently", "nevertheless", "as a result", "therefore",
  "additionally", "nonetheless", "despite this", "in contrast", "similarly",
  "likewise", "alternatively", "although", "even though", "despite"
];

const L_SEQ = [
  "firstly", "secondly", "finally", "to begin with", "following this",
  "subsequently", "thereafter", "next", "lastly", "in conclusion",
  "to summarise", "to conclude"
];

const ADV = [
  "significant", "considerable", "substantial", "remarkable", "notable",
  "evident", "apparent", "prevalent", "crucial", "fundamental", "comprehensive",
  "predominant", "extensive", "emerging", "sustained", "gradual", "dramatic",
  "consistent", "proportional", "illustrate", "demonstrate", "highlight",
  "indicate", "reveal", "whereas", "acknowledge", "facilitate", "constitute",
  "contribute", "implement"
];

const ACADEMIC = [
  "it is clear that", "as can be seen", "it is evident that", "this suggests that",
  "this indicates that", "in terms of", "with regard to", "in comparison",
  "relative to", "most notably", "as a whole"
];

const WEAK = ["good", "bad", "nice", "big", "small", "very", "things", "stuff", "lots", "got", "get"];

const COMPLEX_G = [
  /\bif\s+\w+\s+(would|could|had|were)\b/i,
  /\bwhich\s+(is|are|has|have|was)\b/i,
  /\bnot only\b.*\bbut also\b/i,
  /\b(despite|in spite of)\b/i,
  /\bwould have\b/i,
  /\bhaving\s+\w+ed\b/i,
  /\balthough\b/i,
  /\bwhereas\b/i,
  /\bsince\s+\w+\s+(has|have|had)\b/i,
  /\b(who|that)\s+\w+(s|ed|ing)\b/i
];

const OVERVIEW_P = [
  /\boverall\b/i, /\bin general\b/i, /\bit is (clear|evident|apparent|notable)\b/i,
  /\bthe most (striking|notable|significant)\b/i, /\bas (a whole|can be seen)\b/i
];

const DATA_P = [
  /\d+\s*(%|per cent|percent)/i,
  /\d+(\.\d+)?\s*(tonnes?|million|billion|thousand)/i,
  /approximately\s+\d+/i,
  /around\s+\d+/i,
  /roughly\s+\d+/i,
  /nearly\s+\d+/i
];

const TREND_P = [
  /\b(rose|fallen|fell|declined|increased|decreased|surged|dropped|grew|remained|plateaued|peaked)\b/i,
  /\b(sharply|steeply|dramatically|significantly|gradually|steadily|slightly|rapidly)\b/i
];

const THESIS_P = [
  /\bi (strongly )?(believe|think|argue|contend|maintain)\b/i,
  /\bin my (view|opinion|judgement)\b/i,
  /\bfrom my perspective\b/i,
  /\bi would (argue|suggest|contend)\b/i
];

const EXAMPLE_P = [
  /\bfor (example|instance)\b/i,
  /\bsuch as\b/i,
  /\bto illustrate\b/i,
  /\ba case in point\b/i
];

const CONCL_P = [
  /\bin conclusion\b/i,
  /\bto conclude\b/i,
  /\bto summarise\b/i,
  /\bin summary\b/i,
  /\bto sum up\b/i
];

const PASSIVE_P = [/\b(is|are|was|were|has been|have been|had been)\s+\w+(ed|en)\b/gi];

function halfBand(v) {
  return Math.round(Math.min(9, Math.max(4, v)) * 2) / 2;
}

function hasAny(text, patterns) {
  return patterns.some(p => p.test ? p.test(text) : text.toLowerCase().includes(p));
}

function countHas(text, patterns) {
  return patterns.filter(p => (p.test ? p.test(text) : text.toLowerCase().includes(p))).length;
}

function pickWeakSentence(sentences) {
  return sentences.filter(s => s.trim().length > 15).sort((a, b) => {
    const aw = WEAK.filter(w => a.toLowerCase().includes(w)).length;
    const bw = WEAK.filter(w => b.toLowerCase().includes(w)).length;
    return bw - aw || a.split(/\s+/).length - b.split(/\s+/).length;
  })[0] || sentences[0] || "The response addresses the task.";
}

function upgradePhrase(s) {
  let r = s.trim()
    .replace(/\bvery good\b/gi, "exceptionally strong")
    .replace(/\bvery bad\b/gi, "profoundly detrimental")
    .replace(/\bvery (\w+)\b/gi, (_, a) => `remarkably ${a}`)
    .replace(/\bgood\b/gi, "beneficial")
    .replace(/\bnice\b/gi, "commendable")
    .replace(/\bbig\b/gi, "substantial")
    .replace(/\bsmall\b/gi, "modest")
    .replace(/\ba lot of\b/gi, "a considerable number of")
    .replace(/\bthings\b/gi, "factors")
    .replace(/\bstuff\b/gi, "elements")
    .replace(/\bI think\b/gi, "It can be argued that")
    .replace(/\bI believe\b/gi, "It is my contention that")
    .replace(/\b\bbut\b\b/gi, "however,")
    .replace(/\balso\b/gi, "furthermore,")
    .replace(/\bgot\b/gi, "experienced");
  if (r === s.trim()) {
    r = s.trim().replace(/\.?$/, ", which has significant implications for the broader context.");
  }
  return r;
}

export function evaluateWritingOffline(text, taskNum, prompt, chartContext) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wc = words.length;
  const lower = text.toLowerCase();
  const sents = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 8);
  const paras = text.split(/\n\n+/).map(p => p.trim()).filter(p => p.length > 20);
  const sc = Math.max(sents.length, 1);
  const avgLen = wc / sc;
  const uniq = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, ""))).size;
  const ttr = uniq / Math.max(wc, 1);

  const lccCnt = L_CC.filter(l => lower.includes(l)).length;
  const lseqCnt = L_SEQ.filter(l => lower.includes(l)).length;
  const advCnt = ADV.filter(w => lower.includes(w)).length;
  const acaCnt = ACADEMIC.filter(p => lower.includes(p)).length;
  const weakArr = WEAK.filter(w => new RegExp(`\\b${w}\\b`, "i").test(text));
  const passCnt = PASSIVE_P.reduce((n, p) => n + (text.match(p) || []).length, 0);
  const compCnt = COMPLEX_G.filter(p => p.test(text)).length;
  const hasOv = hasAny(text, OVERVIEW_P);
  const dataCnt = countHas(text, DATA_P);
  const trendCnt = countHas(text, TREND_P);
  const hasThes = hasAny(text, THESIS_P);
  const exCnt = countHas(text, EXAMPLE_P);
  const hasConcl = hasAny(text, CONCL_P);

  const usedCC = L_CC.filter(l => lower.includes(l)).slice(0, 4);
  const usedAdv = ADV.filter(w => lower.includes(w)).slice(0, 4);
  const freq = {};
  words.forEach(w => {
    const k = w.toLowerCase();
    if (k.length > 4) freq[k] = (freq[k] || 0) + 1;
  });
  const repWords = Object.entries(freq)
    .filter(([, v]) => v >= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([w, c]) => `"${w}"(×${c})`);

  let ta = 5, cc = 5, lr = 5, gr = 5;
  const minW = taskNum === 1 ? 150 : 250;
  if (wc >= minW) ta += 0.5;
  if (wc >= minW + 30) ta += 0.25;
  if (wc < minW) ta -= 0.5;

  if (taskNum === 1) {
    if (hasOv) ta += 0.75;
    if (dataCnt >= 4) ta += 0.75;
    else if (dataCnt >= 2) ta += 0.4;
    if (trendCnt >= 3) ta += 0.5;
    if (paras.length >= 3) ta += 0.25;
  } else {
    if (hasThes) ta += 0.5;
    if (exCnt >= 2) ta += 0.5;
    else if (exCnt === 1) ta += 0.25;
    if (hasConcl) ta += 0.5;
    if (paras.length >= 4) ta += 0.25;
  }

  if (lccCnt >= 5) cc += 1;
  else if (lccCnt >= 3) cc += 0.6;
  else if (lccCnt >= 1) cc += 0.25;

  if (lseqCnt >= 2) cc += 0.4;
  if (paras.length >= 3) cc += 0.5;
  if (paras.length >= 4) cc += 0.25;
  if (avgLen >= 12 && avgLen <= 28) cc += 0.4;
  if (acaCnt >= 2) cc += 0.3;

  if (ttr >= 0.70) lr += 1;
  else if (ttr >= 0.60) lr += 0.6;
  else if (ttr >= 0.50) lr += 0.3;

  if (advCnt >= 5) lr += 0.75;
  else if (advCnt >= 3) lr += 0.5;
  else if (advCnt >= 1) lr += 0.25;

  if (passCnt >= 2) lr += 0.4;
  if (taskNum === 1 && trendCnt >= 3) lr += 0.4;
  if (weakArr.length === 0) lr += 0.25;
  else if (weakArr.length >= 4) lr -= 0.3;

  if (compCnt >= 5) gr += 1;
  else if (compCnt >= 3) gr += 0.6;
  else if (compCnt >= 1) gr += 0.3;

  const compRatio = sents.filter(s => s.split(/\s+/).length > 18 || COMPLEX_G.some(p => p.test(s))).length / sc;
  if (compRatio >= 0.5) gr += 0.5;
  else if (compRatio >= 0.3) gr += 0.25;

  if (avgLen >= 14) gr += 0.3;
  if (passCnt >= 2) gr += 0.3;
  if (sc >= 8) gr += 0.25;

  const taScore = halfBand(ta);
  const ccScore = halfBand(cc);
  const lrScore = halfBand(lr);
  const grScore = halfBand(gr);
  const overall = halfBand((taScore + ccScore + lrScore + grScore) / 4);

  const taskComment = taskNum === 1
    ? hasOv
      ? `Overview present. ${dataCnt >= 3 ? `${dataCnt} specific data references found.` : "More precise figures from the chart are needed."}`
      : "No overview sentence detected — this is the most critical missing element for Task 1."
    : hasThes
      ? `Position is clearly stated. ${exCnt >= 1 ? `${exCnt} example(s) identified.` : "Each body paragraph needs a concrete example."}`
      : "No clear thesis statement detected — the examiner cannot identify your position.";

  const taskDetail = taskNum === 1
    ? `Words: ${wc}/${minW}. ${hasOv ? "Overview ✓." : "Overview missing — add: 'Overall, it is clear that …'."}  Data references: ${dataCnt} (need ≥3). ${trendCnt >= 2 ? "Trend language adequate ✓." : "Add: rose sharply, declined steadily, remained stable."} ${paras.length >= 3 ? "Paragraphing ✓." : ""}`
    : `Words: ${wc}/${minW}. ${hasThes ? "Thesis ✓." : "Add 'In my view, …' to introduction."} Examples: ${exCnt} (need ≥2 for Band 6+). ${hasConcl ? "Conclusion ✓." : "Add conclusion starting 'In conclusion, …'."} Paragraphs: ${paras.length}.`;

  const ccComment = usedCC.length >= 3
    ? `Good cohesive devices: ${usedCC.join(", ")}.`
    : usedCC.length >= 1
      ? `Limited linking language: ${usedCC.join(", ")}. More variety needed.`
      : "Very few cohesive devices — ideas appear disconnected.";

  const ccDetail = `${paras.length} paragraph(s). ${paras.length >= 3 ? "Structure adequate." : "Needs clearer paragraphing — use double line breaks."} Avg sentence: ${Math.round(avgLen)} words. ${avgLen > 30 ? "Sentences too long — split them." : avgLen < 8 ? "Sentences too short — combine ideas." : "Sentence length reasonable."} ${acaCnt >= 2 ? `Academic framing used (${ACADEMIC.filter(p => lower.includes(p)).slice(0, 2).join("; ")}).` : "Add: 'It is evident that…', 'As can be seen…'."}`;

  const lrComment = usedAdv.length >= 3
    ? `Academic vocabulary: ${usedAdv.slice(0, 3).join(", ")}.`
    : weakArr.length > 0
      ? `Weak words overused: ${weakArr.slice(0, 3).map(w => `"${w}"`).join(", ")}.`
      : "Vocabulary is functional but lacks academic sophistication.";

  const lrDetail = `Type-Token Ratio: ${(ttr * 100).toFixed(0)}% unique words. ${ttr >= 0.6 ? "Good variety ✓." : "High repetition — use synonyms."} ${repWords.length ? `Repeated: ${repWords.join(", ")}.` : ""} Advanced vocab (${advCnt}): ${usedAdv.join(", ") || "none detected"}. ${passCnt >= 2 ? `Passive voice: ${passCnt} uses ✓.` : "Use more passive for academic register."}`;

  const grComment = compCnt >= 3
    ? `Complex structures present: ${compCnt} instances (conditionals, relative clauses, subordination).`
    : compCnt >= 1
      ? "Some complex structures attempted but response relies mainly on simple sentences."
      : "Grammar mainly limited to simple sentences — no complex structures detected.";

  const grDetail = `${compCnt} complex structures found. ${compRatio >= 0.4 ? "Good mix of sentence types." : "Mostly simple sentences — practise 'Although…', 'Despite…', 'which has…'."} ${passCnt} passive(s). Avg length: ${Math.round(avgLen)} words.`;

  const strengths = [];
  if (hasOv && taskNum === 1) strengths.push("Overview sentence identifies the main trend — key requirement for Band 6+ in Task 1.");
  if (dataCnt >= 3 && taskNum === 1) strengths.push(`${dataCnt} specific data references used — precise figures strengthen Task Achievement.`);
  if (hasThes && taskNum === 2) strengths.push("Clear thesis in introduction — examiner can immediately identify your position.");
  if (exCnt >= 2) strengths.push(`${exCnt} supporting examples used — directly boosts Task Response and Coherence scores.`);
  if (lccCnt >= 3) strengths.push(`Cohesive devices used effectively: ${usedCC.slice(0, 3).join(", ")}.`);
  if (usedAdv.length >= 3) strengths.push(`Academic vocabulary range: ${usedAdv.slice(0, 3).join(", ")}.`);
  if (ttr >= 0.60) strengths.push(`Good lexical variety — ${(ttr * 100).toFixed(0)}% unique words.`);
  if (hasConcl && taskNum === 2) strengths.push("Conclusion restates position — important for Task Response score.");
  if (compCnt >= 3) strengths.push(`${compCnt} complex grammatical structures demonstrate range.`);
  if (wc >= minW) strengths.push(`Word count (${wc}) meets the minimum ✓.`);
  if (strengths.length === 0) strengths.push("Response stays on topic and addresses the task requirements.");

  const improvements = [];
  if (wc < minW) improvements.push(`Word count (${wc}) is below the ${minW}-word minimum — this causes a band penalty regardless of quality.`);
  if (!hasOv && taskNum === 1) improvements.push("Add an overview: 'Overall, it is clear that … , while … ' — this alone can raise Task Achievement by 0.5–1.0 bands.");
  if (dataCnt < 3 && taskNum === 1) improvements.push(`Only ${dataCnt} data reference(s). Cite at least 3-4 specific figures from the chart with exact percentages or values.`);
  if (!hasThes && taskNum === 2) improvements.push("State your position in the introduction: 'I strongly believe that…' or 'In my view, …' — examiners look for this immediately.");
  if (exCnt < 2 && taskNum === 2) improvements.push(`Only ${exCnt} example(s). Add 'For example, …' in each body paragraph — unsupported claims lose Task Response marks.`);
  if (!hasConcl && taskNum === 2) improvements.push("No conclusion found. End with 'In conclusion, …' restating your position — do not introduce new ideas.");
  if (lccCnt < 3) improvements.push(`Only ${lccCnt} cohesive device(s). Add: 'Furthermore, …', 'By contrast, …', 'As a result, …' between paragraphs.`);
  if (weakArr.length >= 3) improvements.push(`Overused basic words: ${weakArr.slice(0, 4).map(w => `"${w}"`).join(", ")}. Replace: good→beneficial, big→substantial, things→factors.`);
  if (repWords.length > 0) improvements.push(`Word repetition: ${repWords.join(", ")}. Use synonyms or pronoun references.`);
  if (compCnt < 2) improvements.push("Limited grammar range. Practice: 'Although … , …', 'Despite … , …', 'which has led to …', 'If … were to …'.");
  if (trendCnt < 2 && taskNum === 1) improvements.push("Trend language is weak. Use: rose sharply, declined steadily, remained stable, peaked at, fluctuated.");
  if (improvements.length === 0) improvements.push("Strong essay — focus on polishing accuracy and varying sentence openers for the next half-band.");

  const weakSent = pickWeakSentence(sents);
  const upgraded = upgradePhrase(weakSent);
  const upgradeWhy = weakArr.some(w => weakSent.toLowerCase().includes(w))
    ? `Replaced basic vocabulary (${weakArr.filter(w => weakSent.toLowerCase().includes(w)).slice(0, 2).join(", ")}) with precise academic alternatives — improves Lexical Resource score.`
    : compCnt < 2
      ? "Added subordinate clause — simple sentences alone limit Grammar score to Band 5–6."
      : "Upgraded sentence structure and vocabulary to match Band 7 expectations.";

  const missing = [];
  if (taskNum === 1) {
    if (!hasOv) missing.push("Overview paragraph — summarise the most significant feature and any notable exception.");
    if (dataCnt < 3) missing.push(`Specific data — only ${dataCnt} figure(s); cite ≥3 exact values from the chart.`);
    if (trendCnt < 2) missing.push("Trend vocabulary — rose, fell, peaked, remained stable, fluctuated.");
  } else {
    if (!hasThes) missing.push("Thesis statement — clearly state your overall position in the introduction.");
    if (exCnt < 2) missing.push(`Supporting examples — only ${exCnt} found; each body paragraph needs at least one.`);
    if (!hasConcl) missing.push("Conclusion — restate your position without introducing new ideas.");
  }

  const lv = overall >= 7.5 ? "very competent" : overall >= 6.5 ? "competent" : overall >= 5.5 ? "developing" : "limited";
  const examinerNote = `This is a ${lv} response at Band ${overall.toFixed(1)}. ${taskNum === 1
    ? (hasOv ? "The overview is a positive feature." : "The most critical issue is the missing overview.") + " " + (dataCnt >= 3 ? "Data references are adequate." : "Specific figures from the chart are needed.")
    : (hasThes ? "The position is clearly stated." : "The examiner cannot identify a clear position.") + " " + (hasConcl ? "The essay reaches a conclusion." : "A conclusion is missing, which penalises Task Response.")
  } Most impactful improvement: ${improvements[0] || "review IELTS Band Descriptors."}.`;

  const bandJustification = `Band ${overall.toFixed(1)} = average of Task ${taScore.toFixed(1)}, Coherence ${ccScore.toFixed(1)}, Lexical ${lrScore.toFixed(1)}, Grammar ${grScore.toFixed(1)}. ${overall < 7 ? `To reach Band ${(overall + 0.5).toFixed(1)}: ${improvements[0]?.toLowerCase() || "address gaps above"}.` : "The main barrier to a higher band is polishing accuracy and adding more sophisticated structures."} Stats: ${wc} words, TTR ${(ttr * 100).toFixed(0)}%, ${lccCnt} cohesive devices, ${compCnt} complex structures.`;

  return {
    overall,
    criteria: {
      task: {
        label: taskNum === 1 ? "Task Achievement" : "Task Response",
        score: taScore,
        comment: taskComment,
        detail: taskDetail
      },
      coherence: {
        label: "Coherence & Cohesion",
        score: ccScore,
        comment: ccComment,
        detail: ccDetail
      },
      lexical: {
        label: "Lexical Resource",
        score: lrScore,
        comment: lrComment,
        detail: lrDetail
      },
      grammar: {
        label: "Grammatical Range & Accuracy",
        score: grScore,
        comment: grComment,
        detail: grDetail
      }
    },
    strengths: strengths.slice(0, 5),
    improvements: improvements.slice(0, 5),
    phraseUpgrade: {
      original: weakSent.slice(0, 120),
      improved: upgraded.slice(0, 200),
      why: upgradeWhy
    },
    missingElements: missing.slice(0, 3),
    examinerNote,
    bandJustification
  };
}