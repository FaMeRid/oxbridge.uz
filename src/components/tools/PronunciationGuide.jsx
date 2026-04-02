import React, { useState } from 'react';
import '../../styles/globals.css';

const PRONUNCIATION_DATA = [
  {
    id: 1,
    word: 'Accommodate',
    ipa: '/əˈkɒmədeɪt/',
    syllables: 'ac-com-mo-date (4 syllables)',
    stress: 'Second syllable (com)',
    tips: 'Start with schwa sound, then "kom", then "mode", then "ate"',
    audio: '🔊 Listen to native speaker',
    common_error: 'Mispronouncing with only 3 syllables',
  },
  {
    id: 2,
    word: 'Comfortable',
    ipa: '/ˈkʌmf(ə)rtəbl/',
    syllables: 'com-for-ta-ble (4 syllables)',
    stress: 'First syllable (com)',
    tips: 'Keep the "mf" together, not separate. Many speakers drop the "r".',
    audio: '🔊 Listen to native speaker',
    common_error: 'Pronouncing as "comfurable" with 3 syllables',
  },
  {
    id: 3,
    word: 'Entrepreneur',
    ipa: '/ˌɒntrəprəˈnɜː(r)/',
    syllables: 'en-tre-pre-neur (4 syllables)',
    stress: 'Last syllable (neur)',
    tips: 'French origin word. Focus on the "uh" sound in the middle.',
    audio: '🔊 Listen to native speaker',
    common_error: 'Stressing the first syllable instead of the last',
  },
];

export function PronunciationGuide() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showIPA, setShowIPA] = useState(false);

  const current = PRONUNCIATION_DATA[currentIndex];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '2rem',
          fontWeight: 800,
          color: '#0c1f4a',
          marginBottom: '12px',
        }}>
          🗣️ Pronunciation Guide
        </h1>
        <p style={{ color: '#475569', fontSize: '0.95rem' }}>
          Master British English pronunciation with audio and phonetic breakdowns
        </p>
      </div>

      {/* Main Card */}
      <div style={{
        background: 'linear-gradient(135deg, #0c1f4a 0%, #1e293b 100%)',
        borderRadius: '20px',
        padding: '48px 40px',
        color: '#fff',
        textAlign: 'center',
        marginBottom: '32px',
      }}>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '3rem',
          fontWeight: 800,
          marginBottom: '20px',
          letterSpacing: '1px',
        }}>
          {current.word}
        </h2>

        <p style={{
          fontSize: '1.3rem',
          marginBottom: '24px',
          opacity: 0.9,
        }}>
          {current.audio}
        </p>

        {/* IPA */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onClick={() => setShowIPA(!showIPA)}
        >
          <p style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '8px' }}>
            IPA PHONETIC SPELLING
          </p>
          <p style={{
            fontSize: '1.8rem',
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '2px',
          }}>
            {current.ipa}
          </p>
        </div>

        <button
          style={{
            padding: '14px 32px',
            background: '#a81011',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(168,16,17,0.4)',
            transition: 'all 0.2s',
          }}
        >
          Play Audio 🎧
        </button>
      </div>

      {/* Details Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        {/* Syllables */}
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#94a3b8',
            marginBottom: '12px',
          }}>
            Syllables
          </p>
          <p style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#0c1f4a',
            lineHeight: 1.6,
          }}>
            {current.syllables}
          </p>
        </div>

        {/* Stress */}
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: '#94a3b8',
            marginBottom: '12px',
          }}>
            Stress
          </p>
          <p style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#a81011',
            lineHeight: 1.6,
          }}>
            {current.stress}
          </p>
        </div>
      </div>

      {/* Tips */}
      <div style={{
        background: '#fdf0f0',
        border: '1px solid rgba(168,16,17,0.25)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
      }}>
        <p style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#a81011',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '12px',
        }}>
          💡 Pronunciation Tips
        </p>
        <p style={{
          color: '#7f1d1d',
          lineHeight: 1.8,
          fontSize: '0.95rem',
        }}>
          {current.tips}
        </p>
      </div>

      {/* Common Error */}
      <div style={{
        background: '#fef2f2',
        border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px',
      }}>
        <p style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#dc2626',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '12px',
        }}>
          ❌ Common Mistake
        </p>
        <p style={{
          color: '#7f1d1d',
          lineHeight: 1.8,
          fontSize: '0.95rem',
        }}>
          {current.common_error}
        </p>
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
      }}>
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + PRONUNCIATION_DATA.length) % PRONUNCIATION_DATA.length)}
          style={{
            padding: '12px 24px',
            border: '1.5px solid #d1d9e6',
            borderRadius: '10px',
            background: '#fff',
            color: '#0f172a',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          ← Previous
        </button>
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % PRONUNCIATION_DATA.length)}
          style={{
            padding: '12px 24px',
            border: '1.5px solid #d1d9e6',
            borderRadius: '10px',
            background: '#fff',
            color: '#0f172a',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}

export default PronunciationGuide;