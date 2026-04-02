import React, { useState, useEffect } from 'react';
import '../../styles/globals.css';

const FLASHCARD_DATA = [
  {
    id: 1,
    front: 'Collocation: "Take into account"',
    back: 'To consider something as a factor when making a decision',
    example: 'When planning your schedule, you should take into account the commute time.',
    difficulty: 'intermediate',
  },
  {
    id: 2,
    front: 'Idiom: "Break the ice"',
    back: 'To initiate conversation in a social situation to relieve awkwardness',
    example: 'The teacher used a game to break the ice on the first day of class.',
    difficulty: 'intermediate',
  },
  {
    id: 3,
    front: 'Collocation: "Make a difference"',
    back: 'To have a significant effect or impact on something',
    example: 'Volunteering can make a real difference in people\'s lives.',
    difficulty: 'beginner',
  },
  {
    id: 4,
    front: 'Phrase: "At the end of the day"',
    back: 'When everything is considered; ultimately; in conclusion',
    example: 'At the end of the day, what matters most is your effort and dedication.',
    difficulty: 'intermediate',
  },
];

export function FlashcardDeck() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learned, setLearned] = useState(new Set());
  const [needsReview, setNeedsReview] = useState(new Set());
  const [stats, setStats] = useState({ learned: 0, total: FLASHCARD_DATA.length });

  const current = FLASHCARD_DATA[currentIndex];

  const handleMarkLearned = () => {
    setLearned((prev) => {
      const newSet = new Set(prev);
      newSet.add(current.id);
      setStats({ learned: newSet.size, total: FLASHCARD_DATA.length });
      return newSet;
    });
    handleNext();
  };

  const handleMarkForReview = () => {
    setNeedsReview((prev) => {
      const newSet = new Set(prev);
      newSet.add(current.id);
      return newSet;
    });
    handleNext();
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % FLASHCARD_DATA.length);
    setIsFlipped(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + FLASHCARD_DATA.length) % FLASHCARD_DATA.length);
    setIsFlipped(false);
  };

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
          🃏 Flashcard Deck
        </h1>
        <p style={{ color: '#475569', fontSize: '0.95rem' }}>
          Learn collocations, idioms, and topic-specific vocabulary
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <div style={{
          background: '#f4f6fb',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>
            LEARNED
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#16a34a' }}>
            {stats.learned}
          </p>
        </div>
        <div style={{
          background: '#fef3c7',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 700, marginBottom: '8px' }}>
            TO REVIEW
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#b45309' }}>
            {needsReview.size}
          </p>
        </div>
        <div style={{
          background: '#f4f6fb',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>
            TOTAL
          </p>
          <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0c1f4a' }}>
            {stats.total}
          </p>
        </div>
      </div>

      {/* Card */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          background: isFlipped
            ? 'linear-gradient(135deg, #a81011 0%, #d42022 100%)'
            : 'linear-gradient(135deg, #0c1f4a 0%, #1e293b 100%)',
          color: '#fff',
          borderRadius: '16px',
          padding: '48px 40px',
          minHeight: '280px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          marginBottom: '28px',
          textAlign: 'center',
          boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
        }}
      >
        <p style={{
          fontSize: '0.8rem',
          fontWeight: 700,
          opacity: 0.8,
          marginBottom: '16px',
          textTransform: 'uppercase',
          letterSpacing: '1px',
        }}>
          {isFlipped ? 'ANSWER' : 'QUESTION'}
        </p>
        <p style={{
          fontSize: isFlipped ? '1.2rem' : '1.8rem',
          fontWeight: 800,
          lineHeight: 1.6,
          marginBottom: '20px',
        }}>
          {isFlipped ? current.back : current.front}
        </p>
        {isFlipped && (
          <p style={{
            fontSize: '0.95rem',
            opacity: 0.9,
            fontStyle: 'italic',
            marginTop: '20px',
          }}>
            {current.example}
          </p>
        )}
        <p style={{
          fontSize: '0.8rem',
          opacity: 0.7,
          marginTop: '28px',
        }}>
          Click to {isFlipped ? 'reveal question' : 'reveal answer'}
        </p>
      </div>

      {/* Buttons */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '24px',
      }}>
        <button
          onClick={handlePrev}
          style={{
            padding: '12px',
            border: '1.5px solid #d1d9e6',
            borderRadius: '10px',
            background: '#fff',
            color: '#0f172a',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ← Prev
        </button>
        <button
          onClick={handleMarkForReview}
          style={{
            padding: '12px',
            border: '1.5px solid #f59e0b',
            borderRadius: '10px',
            background: '#fff',
            color: '#b45309',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          ⚠️ Review Later
        </button>
        <button
          onClick={handleNext}
          style={{
            padding: '12px',
            border: '1.5px solid #d1d9e6',
            borderRadius: '10px',
            background: '#fff',
            color: '#0f172a',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Next →
        </button>
      </div>

      {/* Mark Learned Button */}
      <button
        onClick={handleMarkLearned}
        style={{
          width: '100%',
          padding: '14px',
          background: 'linear-gradient(135deg, #16a34a, #22c55e)',
          color: '#fff',
          border: 'none',
          borderRadius: '10px',
          fontWeight: 700,
          fontSize: '0.95rem',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
        }}
      >
        ✓ I Know This!
      </button>
    </div>
  );
}

export default FlashcardDeck;