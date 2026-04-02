import React, { useState } from 'react';
import '../../styles/globals.css';

export function ScorePredictor() {
  const [scores, setScores] = useState({
    listening: 7,
    reading: 6.5,
    writing: 6,
    speaking: 6.5,
  });

  const averageScore = (
    (scores.listening + scores.reading + scores.writing + scores.speaking) / 4
  ).toFixed(1);

  const predictedBand = Math.round(averageScore * 2) / 2;

  const getBandDescription = (band) => {
    if (band >= 8) return 'Very Good User';
    if (band >= 7) return 'Good User';
    if (band >= 6) return 'Competent User';
    if (band >= 5) return 'Modest User';
    return 'Limited User';
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#16a34a';
    if (score >= 7) return '#3b82f6';
    if (score >= 6) return '#f59e0b';
    if (score >= 5) return '#ef4444';
    return '#8b5cf6';
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
          📊 Score Predictor
        </h1>
        <p style={{ color: '#475569', fontSize: '0.95rem' }}>
          Estimate your IELTS band score based on your practice test performance
        </p>
      </div>

      {/* Input Scores */}
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '32px',
      }}>
        <h2 style={{
          fontSize: '1.3rem',
          fontWeight: 700,
          color: '#0c1f4a',
          marginBottom: '28px',
        }}>
          Enter Your Section Scores
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
        }}>
          {Object.entries(scores).map(([section, score]) => (
            <div key={section}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#94a3b8',
                textTransform: 'uppercase',
                marginBottom: '12px',
                letterSpacing: '1px',
              }}>
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}>
                <input
                  type="range"
                  min="0"
                  max="9"
                  step="0.5"
                  value={score}
                  onChange={(e) =>
                    setScores((prev) => ({
                      ...prev,
                      [section]: parseFloat(e.target.value),
                    }))
                  }
                  style={{
                    flex: 1,
                    height: '6px',
                    cursor: 'pointer',
                  }}
                />
                <div
                  style={{
                    width: '50px',
                    padding: '8px 12px',
                    background: '#f4f6fb',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: getScoreColor(score),
                  }}
                >
                  {score}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prediction Result */}
      <div style={{
        background: 'linear-gradient(135deg, #0c1f4a 0%, #1e293b 100%)',
        borderRadius: '20px',
        padding: '48px 40px',
        color: '#fff',
        textAlign: 'center',
        marginBottom: '32px',
      }}>
        <p style={{
          fontSize: '0.85rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '2px',
          opacity: 0.8,
          marginBottom: '16px',
        }}>
          Your Predicted IELTS Band
        </p>
        <p style={{
          fontSize: '4rem',
          fontWeight: 800,
          marginBottom: '12px',
          color: getScoreColor(predictedBand),
        }}>
          {predictedBand}
        </p>
        <p style={{
          fontSize: '1.2rem',
          opacity: 0.9,
          marginBottom: '24px',
        }}>
          {getBandDescription(predictedBand)}
        </p>
        <p style={{
          fontSize: '0.9rem',
          opacity: 0.7,
        }}>
          Based on an average of {averageScore}
        </p>
      </div>

      {/* Detailed Breakdown */}
      <div style={{
        background: '#f4f6fb',
        borderRadius: '16px',
        padding: '32px',
      }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          color: '#0c1f4a',
          marginBottom: '24px',
        }}>
          Your Score Breakdown
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
        }}>
          {Object.entries(scores).map(([section, score]) => (
            <div
              key={section}
              style={{
                background: '#fff',
                border: '1px solid #dde3ef',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <p style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#94a3b8',
                marginBottom: '12px',
              }}>
                {section}
              </p>
              <p style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: getScoreColor(score),
                marginBottom: '8px',
              }}>
                {score}
              </p>
              <p style={{
                fontSize: '0.75rem',
                color: '#94a3b8',
                fontStyle: 'italic',
              }}>
                {score >= 7
                  ? '✓ Good'
                  : score >= 6
                  ? '○ Average'
                  : '⚠ Needs work'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ScorePredictor;