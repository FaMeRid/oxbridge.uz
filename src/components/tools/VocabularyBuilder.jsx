import React, { useState, useCallback } from 'react';
import '../../styles/globals.css';

const VOCABULARY_DATA = [
  {
    id: 1,
    word: 'Ambiguous',
    pronunciation: '/æmˈbɪɡjuəs/',
    partOfSpeech: 'adjective',
    definition: 'Open to more than one interpretation; unclear',
    example: 'The instructions were ambiguous and confused many students.',
    collocations: ['ambiguous situation', 'ambiguous response'],
    synonyms: ['unclear', 'vague', 'equivocal'],
  },
  {
    id: 2,
    word: 'Astute',
    pronunciation: '/əˈstjuːt/',
    partOfSpeech: 'adjective',
    definition: 'Having or showing good judgment or insight',
    example: 'Her astute observations helped solve the problem.',
    collocations: ['astute business person', 'astute analysis'],
    synonyms: ['clever', 'shrewd', 'intelligent'],
  },
  {
    id: 3,
    word: 'Benign',
    pronunciation: '/bɪˈnaɪn/',
    partOfSpeech: 'adjective',
    definition: 'Not harmful or poisonous; gentle',
    example: 'The doctor confirmed the tumor was benign.',
    collocations: ['benign tumor', 'benign climate'],
    synonyms: ['harmless', 'kind', 'friendly'],
  },
  {
    id: 4,
    word: 'Candid',
    pronunciation: '/ˈkændɪd/',
    partOfSpeech: 'adjective',
    definition: 'Truthful and straightforward in expression',
    example: 'She gave a candid interview about her experiences.',
    collocations: ['candid camera', 'candid opinion'],
    synonyms: ['frank', 'honest', 'sincere'],
  },
];

export function VocabularyBuilder() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learned, setLearned] = useState(new Set());
  const [progress, setProgress] = useState(0);

  const current = VOCABULARY_DATA[currentIndex];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % VOCABULARY_DATA.length);
    setIsFlipped(false);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + VOCABULARY_DATA.length) % VOCABULARY_DATA.length);
    setIsFlipped(false);
  }, []);

  const handleMarkLearned = useCallback(() => {
    setLearned((prev) => {
      const newSet = new Set(prev);
      newSet.add(current.id);
      const newProgress = (newSet.size / VOCABULARY_DATA.length) * 100;
      setProgress(newProgress);
      return newSet;
    });
    handleNext();
  }, [current.id, handleNext]);

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
          📝 Vocabulary Builder
        </h1>
        <p style={{ color: '#475569', fontSize: '0.95rem' }}>
          Learn academic vocabulary with spaced repetition and contextual examples
        </p>
      </div>

      {/* Progress */}
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontWeight: 600, color: '#0f172a' }}>Progress</span>
          <span style={{ color: '#94a3b8' }}>{learned.size} / {VOCABULARY_DATA.length} learned</span>
        </div>
        <div style={{
          height: '8px',
          background: '#eef1f8',
          borderRadius: '999px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #0c1f4a, #a81011)',
            transition: 'width 0.6s ease',
          }} />
        </div>
      </div>

      {/* Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          background: '#fff',
          border: '2px solid #a81011',
          borderRadius: '16px',
          padding: '48px 40px',
          minHeight: '320px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          marginBottom: '24px',
          textAlign: 'center',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 40px rgba(168,16,17,0.16)';
          e.currentTarget.style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(15,23,42,0.07)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {isFlipped ? (
          <div>
            <h3 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '2.2rem',
              fontWeight: 800,
              color: '#a81011',
              marginBottom: '20px',
            }}>
              {current.word}
            </h3>
            <p style={{ fontSize: '1.1rem', color: '#475569', marginBottom: '16px' }}>
              {current.pronunciation}
            </p>
            <p style={{
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '20px',
            }}>
              {current.partOfSpeech}
            </p>
            <p style={{ fontSize: '0.95rem', color: '#0f172a', lineHeight: 1.7 }}>
              {current.definition}
            </p>
          </div>
        ) : (
          <div>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '12px' }}>MEANING</p>
            <p style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#0c1f4a',
              lineHeight: 1.4,
            }}>
              {current.definition}
            </p>
            <p style={{
              color: '#d42022',
              fontSize: '0.85rem',
              marginTop: '32px',
              fontStyle: 'italic',
            }}>
              Click to reveal
            </p>
          </div>
        )}
      </div>

      {/* Example */}
      <div style={{
        background: '#fdf0f0',
        border: '1px solid rgba(168,16,17,0.25)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
      }}>
        <p style={{
          fontSize: '0.85rem',
          fontWeight: 700,
          color: '#a81011',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '8px',
        }}>
          Example
        </p>
        <p style={{ color: '#475569', lineHeight: 1.7 }}>"{current.example}"</p>
      </div>

      {/* Additional Info */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{
          background: '#f4f6fb',
          borderRadius: '12px',
          padding: '16px',
        }}>
          <p style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}>
            Synonyms
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {current.synonyms.map((syn) => (
              <span
                key={syn}
                style={{
                  background: '#fff',
                  border: '1px solid #dde3ef',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.8rem',
                  color: '#475569',
                }}
              >
                {syn}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        marginBottom: '24px',
      }}>
        <button
          onClick={handlePrev}
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
          onClick={handleMarkLearned}
          style={{
            padding: '12px 24px',
            background: 'linear-gradient(135deg, #a81011, #d42022)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(168,16,17,0.28)',
            transition: 'all 0.2s',
          }}
        >
          ✓ Mark as Learned
        </button>
        <button
          onClick={handleNext}
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

      {/* Stats */}
      <div style={{
        background: '#f4f6fb',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
      }}>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '8px' }}>
          Card {currentIndex + 1} of {VOCABULARY_DATA.length}
        </p>
        <p style={{
          fontSize: '1.8rem',
          fontWeight: 700,
          color: '#a81011',
        }}>
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}

export default VocabularyBuilder;