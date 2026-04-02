import React, { useState } from 'react';
import '../../styles/globals.css';

const GRAMMAR_RULES = [
  {
    id: 1,
    rule: 'Subject-Verb Agreement',
    error: 'The team are playing well.',
    correct: 'The team is playing well.',
    explanation: 'Collective nouns like "team" are singular and take a singular verb.',
    level: 'beginner',
  },
  {
    id: 2,
    rule: 'Tense Consistency',
    error: 'She was walking to school and sees her friend.',
    correct: 'She was walking to school and saw her friend.',
    explanation: 'Maintain the same tense throughout a sentence when describing simultaneous events.',
    level: 'intermediate',
  },
  {
    id: 3,
    rule: 'Article Usage',
    error: 'I went to university yesterday.',
    correct: 'I went to the university yesterday.',
    explanation: 'Use "the" when referring to a specific place you went to.',
    level: 'intermediate',
  },
  {
    id: 4,
    rule: 'Parallel Structure',
    error: 'She likes reading, writing, and to paint.',
    correct: 'She likes reading, writing, and painting.',
    explanation: 'Use the same grammatical form for all items in a list.',
    level: 'intermediate',
  },
];

export function GrammarChecker() {
  const [selectedRule, setSelectedRule] = useState(GRAMMAR_RULES[0]);
  const [userText, setUserText] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleCheckGrammar = () => {
    if (userText.toLowerCase().trim() === selectedRule.error.toLowerCase().trim()) {
      setFeedback('❌ This is the INCORRECT version. Try writing the correct version.');
    } else if (userText.toLowerCase().trim() === selectedRule.correct.toLowerCase().trim()) {
      setFeedback('✅ Correct! Well done.');
    } else if (userText.trim().length === 0) {
      setFeedback('');
    } else {
      setFeedback('⚠️ Not quite right. Check the correct version above.');
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '2rem',
          fontWeight: 800,
          color: '#0c1f4a',
          marginBottom: '12px',
        }}>
          🔍 Grammar Checker
        </h1>
        <p style={{ color: '#475569', fontSize: '0.95rem' }}>
          Learn common grammar mistakes and master correct English writing
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '28px' }}>
        {/* Rules List */}
        <div>
          <p style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '16px',
          }}>
            Grammar Rules
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {GRAMMAR_RULES.map((rule) => (
              <button
                key={rule.id}
                onClick={() => {
                  setSelectedRule(rule);
                  setUserText('');
                  setFeedback('');
                }}
                style={{
                  padding: '12px 16px',
                  border: selectedRule.id === rule.id ? '2px solid #a81011' : '1px solid #dde3ef',
                  borderRadius: '10px',
                  background: selectedRule.id === rule.id ? '#fff0f0' : '#fff',
                  color: selectedRule.id === rule.id ? '#a81011' : '#475569',
                  fontWeight: selectedRule.id === rule.id ? 600 : 500,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {rule.rule}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          {/* Rule Title */}
          <h2 style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: '1.6rem',
            fontWeight: 800,
            color: '#0c1f4a',
            marginBottom: '24px',
          }}>
            {selectedRule.rule}
          </h2>

          {/* Error Example */}
          <div style={{
            background: '#fff5f5',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
          }}>
            <p style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#dc2626',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              ❌ Incorrect
            </p>
            <p style={{
              fontSize: '1.05rem',
              color: '#7f1d1d',
              lineHeight: 1.7,
              fontStyle: 'italic',
            }}>
              "{selectedRule.error}"
            </p>
          </div>

          {/* Correct Example */}
          <div style={{
            background: '#f0fdf4',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
          }}>
            <p style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#16a34a',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              ✅ Correct
            </p>
            <p style={{
              fontSize: '1.05rem',
              color: '#166534',
              lineHeight: 1.7,
            }}>
              "{selectedRule.correct}"
            </p>
          </div>

          {/* Explanation */}
          <div style={{
            background: '#f4f6fb',
            border: '1px solid #dde3ef',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '28px',
          }}>
            <p style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#94a3b8',
              textTransform: 'uppercase',
              marginBottom: '10px',
            }}>
              Explanation
            </p>
            <p style={{
              color: '#475569',
              lineHeight: 1.7,
              fontSize: '0.95rem',
            }}>
              {selectedRule.explanation}
            </p>
          </div>

          {/* Practice */}
          <div>
            <p style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '12px',
            }}>
              Practice: Try writing the correct sentence
            </p>
            <textarea
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              onBlur={handleCheckGrammar}
              placeholder="Type the correct sentence here..."
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1.5px solid #dde3ef',
                borderRadius: '10px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.95rem',
                color: '#0f172a',
                minHeight: '100px',
                resize: 'vertical',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: '12px',
              }}
            />
            {feedback && (
              <p style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: feedback.includes('✅') ? '#16a34a' : feedback.includes('❌') ? '#dc2626' : '#f59e0b',
                padding: '12px',
                background: feedback.includes('✅')
                  ? '#f0fdf4'
                  : feedback.includes('❌')
                  ? '#fef2f2'
                  : '#fffbeb',
                borderRadius: '8px',
              }}>
                {feedback}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GrammarChecker;