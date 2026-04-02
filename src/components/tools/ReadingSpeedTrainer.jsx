import React, { useState, useEffect } from 'react';
import '../../styles/globals.css';

const PASSAGES = [
  {
    id: 1,
    title: 'Climate Change Impact',
    text: `Climate change represents one of the most significant challenges facing humanity in the 21st century. Rising global temperatures have led to increasingly frequent and severe weather events, from devastating hurricanes to prolonged droughts. The impacts extend far beyond meteorological phenomena; they fundamentally threaten food security, water availability, and economic stability for billions of people worldwide. Scientists agree that human activities, particularly the emission of greenhouse gases, are the primary driver of recent warming trends. The consequences are already visible: glaciers are melting, sea levels are rising, and ecosystems are being disrupted at an alarming rate.`,
    wordCount: 120,
  },
];

export function ReadingSpeedTrainer() {
  const [passage, setPassage] = useState(PASSAGES[0]);
  const [startTime, setStartTime] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  const handleStart = () => {
    setHasStarted(true);
    setStartTime(Date.now());
    setHasFinished(false);
    setWordsPerMinute(0);
    setAccuracy(0);
  };

  const handleFinish = () => {
    const endTime = Date.now();
    const timeInMinutes = (endTime - startTime) / 1000 / 60;
    const wpm = Math.round(passage.wordCount / timeInMinutes);
    setWordsPerMinute(wpm);
    setAccuracy(Math.round(Math.random() * 30 + 70)); // Simulation
    setHasFinished(true);
  };

  const handleReset = () => {
    setHasStarted(false);
    setHasFinished(false);
    setStartTime(null);
    setWordsPerMinute(0);
    setAccuracy(0);
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
          📖 Reading Speed Trainer
        </h1>
        <p style={{ color: '#475569', fontSize: '0.95rem' }}>
          Practice skimming and scanning techniques to improve your reading speed
        </p>
      </div>

      {/* Passage */}
      <div style={{
        background: hasStarted ? '#f4f6fb' : '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '28px',
        minHeight: '300px',
      }}>
        <h2 style={{
          fontSize: '1.3rem',
          fontWeight: 700,
          color: '#0c1f4a',
          marginBottom: '20px',
        }}>
          {passage.title}
        </h2>
        <p style={{
          fontSize: '1rem',
          lineHeight: 1.8,
          color: '#475569',
          opacity: hasStarted ? 1 : 0.5,
        }}>
          {passage.text}
        </p>
        <p style={{
          fontSize: '0.85rem',
          color: '#94a3b8',
          marginTop: '20px',
        }}>
          Word count: {passage.wordCount} words
        </p>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        marginBottom: '32px',
      }}>
        {!hasStarted && !hasFinished && (
          <button
            onClick={handleStart}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #a81011, #d42022)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(168,16,17,0.28)',
            }}
          >
            Start Reading
          </button>
        )}

        {hasStarted && !hasFinished && (
          <button
            onClick={handleFinish}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #0c1f4a, #1e3a7a)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Finished Reading
          </button>
        )}

        {hasFinished && (
          <button
            onClick={handleReset}
            style={{
              padding: '14px 32px',
              background: '#fff',
              color: '#0f172a',
              border: '1.5px solid #d1d9e6',
              borderRadius: '10px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try Another
          </button>
        )}
      </div>

      {/* Results */}
      {hasFinished && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          <div style={{
            background: '#f0fdf4',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: '12px',
            padding: '28px',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#16a34a',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              Reading Speed
            </p>
            <p style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#166534',
            }}>
              {wordsPerMinute}
            </p>
            <p style={{ color: '#16a34a', fontSize: '0.85rem' }}>words per minute</p>
          </div>

          <div style={{
            background: '#fef3c7',
            border: '1px solid rgba(217,119,6,0.3)',
            borderRadius: '12px',
            padding: '28px',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#b45309',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}>
              Accuracy
            </p>
            <p style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: '#92400e',
            }}>
              {accuracy}%
            </p>
            <p style={{ color: '#b45309', fontSize: '0.85rem' }}>comprehension</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReadingSpeedTrainer;