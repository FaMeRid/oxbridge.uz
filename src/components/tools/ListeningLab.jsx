import React, { useState } from 'react';
import '../../styles/globals.css';

const LISTENING_EXERCISES = [
  {
    id: 1,
    title: 'Academic Lecture - Biology',
    duration: '4:32',
    level: 'Advanced',
    accent: 'British',
    transcript: `Today we\'ll explore photosynthesis, the process by which plants convert sunlight into chemical energy. This fundamental process sustains virtually all life on Earth. Plants absorb light using chlorophyll, a green pigment located in chloroplasts...`,
    questions: [
      'What is the main topic of the lecture?',
      'Which color pigment is mentioned?',
      'Where is chlorophyll located?',
    ],
  },
  {
    id: 2,
    title: 'Conversation - University Admission',
    duration: '3:15',
    level: 'Intermediate',
    accent: 'Australian',
    transcript: `Student: Good morning, I\'d like to inquire about the application process for postgraduate studies. Advisor: Of course! We\'re delighted you\'re interested. Could you tell me which program you\'re considering?...`,
    questions: [
      'What is the student inquiring about?',
      'Who is the student speaking with?',
      'What program does the student want to know about?',
    ],
  },
];

export function ListeningLab() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  const current = LISTENING_EXERCISES[currentIndex];

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
          🎧 Listening Lab
        </h1>
        <p style={{ color: '#475569', fontSize: '0.95rem' }}>
          Practice with authentic IELTS-style listening exercises from various accents
        </p>
      </div>

      {/* Exercise Info */}
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '28px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '16px',
        }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
              TITLE
            </p>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: '#0c1f4a' }}>
              {current.title}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
              DURATION
            </p>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: '#0c1f4a' }}>
              {current.duration}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
              LEVEL
            </p>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: '#a81011' }}>
              {current.level}
            </p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, marginBottom: '6px' }}>
              ACCENT
            </p>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: '#0c1f4a' }}>
              {current.accent}
            </p>
          </div>
        </div>
      </div>

      {/* Audio Player */}
      <div style={{
        background: 'linear-gradient(135deg, #0c1f4a 0%, #1e293b 100%)',
        borderRadius: '16px',
        padding: '40px',
        textAlign: 'center',
        marginBottom: '28px',
        color: '#fff',
      }}>
        <p style={{ fontSize: '3rem', marginBottom: '20px' }}>🎙️</p>
        <p style={{ fontSize: '0.95rem', marginBottom: '24px', opacity: 0.9 }}>
          Click the button below to play the audio
        </p>
        <button
          style={{
            padding: '16px 48px',
            background: '#a81011',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(168,16,17,0.4)',
            transition: 'all 0.2s',
          }}
        >
          Play Audio ▶️
        </button>
      </div>

      {/* Questions */}
      <div style={{
        background: '#f4f6fb',
        borderRadius: '12px',
        padding: '28px',
        marginBottom: '28px',
      }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          color: '#0c1f4a',
          marginBottom: '20px',
        }}>
          Answer the Questions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {current.questions.map((question, idx) => (
            <div key={idx}>
              <p style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#0f172a',
                marginBottom: '10px',
              }}>
                {idx + 1}. {question}
              </p>
              <input
                type="text"
                placeholder="Your answer..."
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '1.5px solid #dde3ef',
                  borderRadius: '8px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Transcript */}
      <div style={{
        background: '#fdf0f0',
        border: '1px solid rgba(168,16,17,0.25)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '28px',
      }}>
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          style={{
            width: '100%',
            padding: '14px',
            background: '#fff',
            border: '1px solid rgba(168,16,17,0.25)',
            borderRadius: '8px',
            color: '#a81011',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: showTranscript ? '16px' : 0,
            transition: 'all 0.2s',
          }}
        >
          {showTranscript ? '▼ Hide Transcript' : '▶ Show Transcript'}
        </button>
        {showTranscript && (
          <p style={{
            color: '#7f1d1d',
            lineHeight: 1.8,
            fontSize: '0.95rem',
            fontStyle: 'italic',
          }}>
            {current.transcript}
          </p>
        )}
      </div>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
      }}>
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + LISTENING_EXERCISES.length) % LISTENING_EXERCISES.length)}
          style={{
            padding: '12px 24px',
            border: '1.5px solid #d1d9e6',
            borderRadius: '10px',
            background: '#fff',
            color: '#0f172a',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ← Previous
        </button>
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % LISTENING_EXERCISES.length)}
          style={{
            padding: '12px 24px',
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
    </div>
  );
}

export default ListeningLab;