import React, { useState } from 'react';
import '../../styles/globals.css';

const PRONUNCIATION_DATA = [
  {
    id: 1,
    word: 'Accommodate',
    ipa: '/əˈkɒmədeɪt/',
    syllables: ['ac', 'com', 'mo', 'date'],
    stressIdx: 1,
    stress: 'Second syllable (com)',
    pos: 'Verb',
    origin: 'Latin: accommodare',
    tips: 'Start with the weak schwa sound /ə/, then a strong "KOM", then "mo-DATE". Keep all four syllables — many learners drop one.',
    common_error: 'Saying "accomodate" with only 3 syllables, or stressing the first syllable.'
  },
  {
    id: 2,
    word: 'Comfortable',
    ipa: '/ˈkʌmf(ə)rtəbl/',
    syllables: ['com', 'for', 'ta', 'ble'],
    stressIdx: 0,
    stress: 'First syllable (com)',
    pos: 'Adjective',
    origin: 'Latin: confortare',
    tips: 'The "mf" stays together — say "KUMf". Many fluent speakers drop the middle vowel, saying "KUMF-tuh-bl".',
    common_error: 'Saying "comfur-able" with a clear /r/ or splitting it as "comfur-table".'
  },
  {
    id: 3,
    word: 'Entrepreneur',
    ipa: '/ˌɒntrəprəˈnɜː(r)/',
    syllables: ['en', 'tre', 'pre', 'neur'],
    stressIdx: 3,
    stress: 'Last syllable (neur)',
    pos: 'Noun',
    origin: 'French: entreprendre',
    tips: 'French loanword. Stress falls on the final syllable "NUR". The middle two syllables are very weak.',
    common_error: 'Stressing the first syllable, or saying "entre-PRE-neur".'
  },
  {
    id: 4,
    word: 'Pronunciation',
    ipa: '/prəˌnʌnsiˈeɪʃn/',
    syllables: ['pro', 'nun', 'ci', 'a', 'tion'],
    stressIdx: 4,
    stress: 'Fifth syllable (tion)',
    pos: 'Noun',
    origin: 'Latin: pronuntiare',
    tips: 'It is "pro-NUN-ci-A-tion" — NOT "pro-NOUN-ciation". The root changes from the verb "pronounce".',
    common_error: 'Saying "pro-NOUN-ciation" by analogy with the verb.'
  },
  {
    id: 5,
    word: 'Particularly',
    ipa: '/pəˈtɪkjʊləli/',
    syllables: ['par', 'tic', 'u', 'lar', 'ly'],
    stressIdx: 1,
    stress: 'Second syllable (tic)',
    pos: 'Adverb',
    origin: 'Latin: particularis',
    tips: 'The "tic" syllable carries the stress. In fast speech it often becomes "puh-TIK-yuh-li".',
    common_error: 'Stressing the first syllable "PAR".'
  },
  {
    id: 6,
    word: 'Wednesday',
    ipa: '/ˈwenzdeɪ/',
    syllables: ['Wednes', 'day'],
    stressIdx: 0,
    stress: 'First syllable (Wednes)',
    pos: 'Noun',
    origin: 'Old English: Wōdnesdæg',
    tips: 'The "d" is completely silent. Pronounce only "WENZ-day".',
    common_error: 'Pronouncing the silent "d" — saying "Wed-nes-day".'
  },
  {
    id: 7,
    word: 'Colonel',
    ipa: '/ˈkɜːnl/',
    syllables: ['col', 'o', 'nel'],
    stressIdx: 0,
    stress: 'First syllable (kur)',
    pos: 'Noun',
    origin: 'Italian: colonnello',
    tips: 'Spelled "colonel" but pronounced "KERNEL". Just memorise it.',
    common_error: 'Pronouncing it as "col-O-nel" following the spelling.'
  },
  {
    id: 8,
    word: 'Hierarchy',
    ipa: '/ˈhaɪərɑːki/',
    syllables: ['hi', 'er', 'ar', 'chy'],
    stressIdx: 0,
    stress: 'First syllable (hi)',
    pos: 'Noun',
    origin: 'Greek: hierarchia',
    tips: 'Say "HI-uh-rar-kee". The "ch" sounds like "k".',
    common_error: 'Saying "hi-RARK-ee" or pronouncing "ch" as in "church".'
  },
  {
    id: 9,
    word: 'Legislation',
    ipa: '/ˌledʒɪsˈleɪʃn/',
    syllables: ['leg', 'is', 'la', 'tion'],
    stressIdx: 2,
    stress: 'Third syllable (la)',
    pos: 'Noun',
    origin: 'Latin: legislatio',
    tips: '"leg-is-LAY-shun". The final "-tion" compresses to "shun".',
    common_error: 'Stressing "leg" or fully pronouncing "-tion" as two syllables.'
  },
  {
    id: 10,
    word: 'Conscientious',
    ipa: '/ˌkɒnʃiˈenʃəs/',
    syllables: ['con', 'sci', 'en', 'tious'],
    stressIdx: 2,
    stress: 'Third syllable (en)',
    pos: 'Adjective',
    origin: 'Latin: conscientia',
    tips: '"kon-shee-EN-shus". The "sci" sounds like "shee".',
    common_error: 'Pronouncing "sci" as "sy" or stressing wrong syllable.'
  },
  {
    id: 11,
    word: 'February',
    ipa: '/ˈfebrʊəri/',
    syllables: ['Feb', 'ru', 'ar', 'y'],
    stressIdx: 0,
    stress: 'First syllable (Feb)',
    pos: 'Noun',
    origin: 'Latin: februarius',
    tips: '"FEB-roo-uh-ree". Both with and without the first "r" are accepted.',
    common_error: 'Saying "Feb-yoo-air-ee" with wrong stress.'
  },
  {
    id: 12,
    word: 'Mischievous',
    ipa: '/ˈmɪstʃɪvəs/',
    syllables: ['mis', 'chie', 'vous'],
    stressIdx: 0,
    stress: 'First syllable (mis)',
    pos: 'Adjective',
    origin: 'Old French: meschief',
    tips: '"MIS-chi-vus". Only three syllables.',
    common_error: 'Saying "mis-CHEEV-ee-us" with four syllables.'
  }
];

export default function PronunciationGuide() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showIPA, setShowIPA] = useState(false);

  const current = PRONUNCIATION_DATA[currentIndex];

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(current.word);
      utterance.lang = 'en-GB';
      utterance.rate = 0.82;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.4rem', fontWeight: 800, color: '#0c1f4a', marginBottom: '12px' }}>
          🗣️ Pronunciation Guide
        </h1>
        <p style={{ color: '#475569', fontSize: '1rem' }}>
          Master difficult British English words with audio and detailed breakdown
        </p>
      </div>

      {/* Main Word Card */}
      <div style={{
        background: 'linear-gradient(135deg, #0c1f4a 0%, #1e293b 100%)',
        borderRadius: '24px',
        padding: '52px 40px',
        color: '#fff',
        textAlign: 'center',
        marginBottom: '32px',
        boxShadow: '0 20px 40px rgba(12, 31, 74, 0.15)'
      }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3.2rem', fontWeight: 800, marginBottom: '24px', letterSpacing: '0.5px' }}>
          {current.word}
        </h2>

        <div 
          style={{
            background: 'rgba(255,255,255,0.12)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '28px',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
          onClick={() => setShowIPA(!showIPA)}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
        >
          <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '8px' }}>IPA PHONETIC SPELLING</p>
          <p style={{ fontSize: '2.1rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '3px' }}>
            {current.ipa}
          </p>
        </div>

        <button
          onClick={speakWord}
          style={{
            padding: '16px 40px',
            background: '#a81011',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: '0 8px 25px rgba(168,16,17,0.35)',
            transition: 'all 0.2s'
          }}
        >
          🔊 Play Audio — Listen to Native Speaker
        </button>
      </div>

      {/* Syllables Visual */}
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '20px',
        padding: '32px',
        textAlign: 'center',
        marginBottom: '28px'
      }}>
        <p style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '16px' }}>
          SYLLABLES & STRESS
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {current.syllables.map((syl, i) => (
            <span
              key={i}
              style={{
                padding: '14px 22px',
                borderRadius: '12px',
                fontSize: '1.25rem',
                fontWeight: 600,
                background: i === current.stressIdx ? '#a81011' : '#f1f5f9',
                color: i === current.stressIdx ? '#fff' : '#0f172a',
                boxShadow: i === current.stressIdx ? '0 4px 15px rgba(168,16,17,0.3)' : 'none',
                transform: i === current.stressIdx ? 'scale(1.08)' : 'scale(1)'
              }}
            >
              {syl}
            </span>
          ))}
        </div>
      </div>

      {/* Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>STRESS</p>
          <p style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0c1f4a' }}>{current.stress}</p>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>PART OF SPEECH</p>
          <p style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0c1f4a' }}>{current.pos}</p>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>ORIGIN</p>
          <p style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0c1f4a' }}>{current.origin}</p>
        </div>
      </div>

      {/* Tips */}
      <div style={{ background: '#fdf0f0', border: '1px solid #fecaca', borderRadius: '20px', padding: '32px', marginBottom: '20px' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#b91c1c', marginBottom: '12px' }}>💡 PRONUNCIATION TIPS</p>
        <p style={{ lineHeight: '1.75', color: '#7f1d1d' }}>{current.tips}</p>
      </div>

      {/* Common Error */}
      <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '20px', padding: '32px' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#dc2626', marginBottom: '12px' }}>❌ COMMON MISTAKE</p>
        <p style={{ lineHeight: '1.75', color: '#7f1d1d' }}>{current.common_error}</p>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '50px' }}>
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + PRONUNCIATION_DATA.length) % PRONUNCIATION_DATA.length)}
          style={{ padding: '14px 32px', border: '2px solid #cbd5e1', borderRadius: '12px', background: '#fff', fontWeight: 600, cursor: 'pointer' }}
        >
          ← Previous
        </button>

        <div style={{ textAlign: 'center' }}>
          <p style={{ fontWeight: 600, color: '#0c1f4a' }}>
            {currentIndex + 1} / {PRONUNCIATION_DATA.length}
          </p>
        </div>

        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % PRONUNCIATION_DATA.length)}
          style={{ padding: '14px 32px', border: '2px solid #cbd5e1', borderRadius: '12px', background: '#fff', fontWeight: 600, cursor: 'pointer' }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}