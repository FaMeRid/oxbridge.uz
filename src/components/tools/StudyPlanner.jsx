import React, { useState } from 'react';
import '../../styles/globals.css';

export function StudyPlanner() {
  const [inputs, setInputs] = useState({
    examDate: '2024-06-15',
    targetBand: 7.5,
    currentLevel: 5.5,
    hoursPerWeek: 15,
  });

  const [schedule, setSchedule] = useState(null);

  const generateSchedule = () => {
    const today = new Date();
    const examDate = new Date(inputs.examDate);
    const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
    const weeksLeft = Math.ceil(daysLeft / 7);

    const schedule = {
      daysLeft,
      weeksLeft,
      bandGap: (inputs.targetBand - inputs.currentLevel).toFixed(1),
      hoursPerWeek: inputs.hoursPerWeek,
      totalHours: (inputs.hoursPerWeek * weeksLeft).toFixed(0),
      phases: generatePhases(weeksLeft),
    };

    setSchedule(schedule);
  };

  const generatePhases = (weeks) => {
    const phase1End = Math.ceil(weeks * 0.4);
    const phase2End = Math.ceil(weeks * 0.7);

    return [
      {
        name: 'Foundation Building',
        weeks: `Week 1-${phase1End}`,
        focus: ['Vocabulary expansion', 'Grammar review', 'Basic practice tests'],
        distribution: '30% Vocab, 30% Grammar, 40% Practice',
      },
      {
        name: 'Intensive Training',
        weeks: `Week ${phase1End + 1}-${phase2End}`,
        focus: ['Advanced techniques', 'Timed practice', 'Band-specific strategies'],
        distribution: '20% Vocab, 20% Grammar, 60% Practice',
      },
      {
        name: 'Mastery & Refinement',
        weeks: `Week ${phase2End + 1}-${weeks}`,
        focus: ['Full mock exams', 'Weakness targeting', 'Confidence building'],
        distribution: '10% Vocab, 10% Grammar, 80% Practice',
      },
    ];
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
          🗓️ Study Planner
        </h1>
        <p style={{ color: '#475569', fontSize: '0.95rem' }}>
          Generate a personalized day-by-day study schedule for your exam date
        </p>
      </div>

      {/* Input Form */}
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
          Create Your Study Plan
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '24px',
          marginBottom: '28px',
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#94a3b8',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              Exam Date
            </label>
            <input
              type="date"
              value={inputs.examDate}
              onChange={(e) =>
                setInputs((prev) => ({ ...prev, examDate: e.target.value }))
              }
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid #dde3ef',
                borderRadius: '8px',
                fontSize: '0.95rem',
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#94a3b8',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              Target Band Score
            </label>
            <select
              value={inputs.targetBand}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  targetBand: parseFloat(e.target.value),
                }))
              }
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid #dde3ef',
                borderRadius: '8px',
                fontSize: '0.95rem',
              }}
            >
              {[5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((band) => (
                <option key={band} value={band}>
                  {band}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#94a3b8',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              Current Level
            </label>
            <select
              value={inputs.currentLevel}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  currentLevel: parseFloat(e.target.value),
                }))
              }
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid #dde3ef',
                borderRadius: '8px',
                fontSize: '0.95rem',
              }}
            >
              {[3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7].map((band) => (
                <option key={band} value={band}>
                  {band}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#94a3b8',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}>
              Hours Per Week
            </label>
            <input
              type="number"
              min="5"
              max="50"
              value={inputs.hoursPerWeek}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  hoursPerWeek: parseInt(e.target.value),
                }))
              }
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '1px solid #dde3ef',
                borderRadius: '8px',
                fontSize: '0.95rem',
              }}
            />
          </div>
        </div>

        <button
          onClick={generateSchedule}
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #a81011, #d42022)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(168,16,17,0.28)',
          }}
        >
          Generate My Study Plan
        </button>
      </div>

      {/* Generated Schedule */}
      {schedule && (
        <div>
          {/* Overview */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}>
            <div style={{
              background: '#f4f6fb',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>
                DAYS REMAINING
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0c1f4a' }}>
                {schedule.daysLeft}
              </p>
            </div>
            <div style={{
              background: '#f4f6fb',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>
                WEEKS TO STUDY
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0c1f4a' }}>
                {schedule.weeksLeft}
              </p>
            </div>
            <div style={{
              background: '#fef3c7',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 700, marginBottom: '8px' }}>
                BAND GAP
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#b45309' }}>
                {schedule.bandGap}
              </p>
            </div>
            <div style={{
              background: '#f0fdf4',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700, marginBottom: '8px' }}>
                TOTAL STUDY HOURS
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 800, color: '#16a34a' }}>
                {schedule.totalHours}
              </p>
            </div>
          </div>

          {/* Phases */}
          <div style={{
            display: 'grid',
            gap: '20px',
          }}>
            {schedule.phases.map((phase, idx) => (
              <div
                key={idx}
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '28px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#a81011',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.2rem',
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      color: '#0c1f4a',
                    }}>
                      {phase.name}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      {phase.weeks}
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <p style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}>
                    Focus Areas
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {phase.focus.map((item, i) => (
                      <span
                        key={i}
                        style={{
                          background: '#f4f6fb',
                          color: '#475569',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}>
                    Study Distribution
                  </p>
                  <p style={{
                    fontSize: '0.95rem',
                    color: '#0c1f4a',
                    fontWeight: 600,
                  }}>
                    {phase.distribution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StudyPlanner;