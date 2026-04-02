import React, { useState } from 'react';
import '../../styles/globals.css';

const ESSAY_TEMPLATES = [
  {
    id: 1,
    type: 'Task 1',
    title: 'Letter to a Friend',
    structure: ['Opening', 'Main Content (2-3 paragraphs)', 'Closing'],
    template: `Dear [Friend's Name],

I hope this letter finds you well. I am writing to [state purpose].

[Main content paragraph 1 - elaborate on your point]

[Main content paragraph 2 - provide more details or examples]

I would appreciate your thoughts on this matter. Please let me know when we can discuss this further.

Best regards,
[Your Name]`,
    tips: [
      'Keep it personal and friendly',
      'Address 3-4 points mentioned in the task',
      'Use appropriate register for informal letter',
      'Keep within 150 words',
    ],
    band8Sample: `Dear Sarah,

I hope you're doing well! I'm writing to tell you about my upcoming trip to Japan in October. Since you've been there before, I was hoping you could share some recommendations.

I'm particularly interested in visiting Tokyo and Kyoto. Could you suggest the best time to visit each city and any must-see attractions? Additionally, I'd love to know about local restaurants where I can experience authentic Japanese cuisine.

I'm also planning to take a short course in Japanese language while I'm there. Would you recommend any specific schools or programs?

I would really appreciate your advice as your previous trip was fantastic. Let me know your thoughts, and perhaps we could have a video call to discuss this further.

Best wishes,
Emma`,
  },
  {
    id: 2,
    type: 'Task 2',
    title: 'Opinion Essay',
    structure: ['Introduction', 'Body 1', 'Body 2', 'Conclusion'],
    template: `[Introduction - state the question and your opinion clearly]

[Body paragraph 1 - first reason with explanation and example]

[Body paragraph 2 - second reason with explanation and example]

[Conclusion - restate your opinion and summarize main points]`,
    tips: [
      'Have a clear thesis statement',
      'Use topic sentences in each paragraph',
      'Support arguments with relevant examples',
      'Maintain formal academic tone',
      'Keep within 250-300 words',
    ],
    band8Sample: `Some people argue that social media has had a negative impact on society, while others believe it has brought significant benefits. In my opinion, although social media has some drawbacks, its positive contributions to communication and business outweigh the negatives.

On one hand, social media has undoubtedly enhanced global communication. People can now maintain relationships with friends and family across different continents instantaneously. Furthermore, social media has become a powerful tool for social movements and activism. The Arab Spring and #MeToo movement demonstrated how these platforms can mobilize people for positive social change. Additionally, businesses have leveraged social media to reach customers effectively and economically.

On the other hand, critics point out valid concerns about mental health and misinformation. Excessive social media use has been linked to anxiety and depression, particularly among young people. Moreover, the spread of false information can have serious consequences for public opinion and democratic processes. However, these issues can be addressed through digital literacy and appropriate regulation.

In conclusion, while social media presents challenges that society must address, its benefits in facilitating communication and enabling social change are substantial. I believe that with proper safeguards, we can maximize the benefits while minimizing the harms.`,
  },
];

export function EssayTemplates() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSample, setShowSample] = useState(false);

  const current = ESSAY_TEMPLATES[currentIndex];

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '2rem',
          fontWeight: 800,
          color: '#0c1f4a',
          marginBottom: '12px',
        }}>
          ✍️ Essay Templates
        </h1>
        <p style={{ color: '#475569', fontSize: '0.95rem' }}>
          Access proven essay templates and Band 8+ sample essays to improve your writing
        </p>
      </div>

      {/* Navigation Buttons */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '28px',
      }}>
        {ESSAY_TEMPLATES.map((essay, idx) => (
          <button
            key={essay.id}
            onClick={() => {
              setCurrentIndex(idx);
              setShowSample(false);
            }}
            style={{
              padding: '12px 20px',
              border: currentIndex === idx ? '2px solid #a81011' : '1px solid #dde3ef',
              borderRadius: '10px',
              background: currentIndex === idx ? '#fff0f0' : '#fff',
              color: currentIndex === idx ? '#a81011' : '#475569',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {essay.type}: {essay.title}
          </button>
        ))}
      </div>

      {/* Template */}
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '28px',
      }}>
        <h2 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '1.5rem',
          fontWeight: 800,
          color: '#0c1f4a',
          marginBottom: '20px',
        }}>
          {current.title} Template
        </h2>

        {/* Structure */}
        <div style={{ marginBottom: '24px' }}>
          <p style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '12px',
          }}>
            Structure
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            {current.structure.map((part, idx) => (
              <div
                key={idx}
                style={{
                  background: '#f4f6fb',
                  border: '1px solid #dde3ef',
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'center',
                  fontWeight: 600,
                  color: '#0c1f4a',
                  fontSize: '0.9rem',
                }}
              >
                {part}
              </div>
            ))}
          </div>
        </div>

        {/* Template Text */}
        <div style={{
          background: '#f9fafb',
          border: '1px solid #dde3ef',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
        }}>
          <pre style={{
            fontFamily: 'Inter, monospace',
            fontSize: '0.9rem',
            color: '#475569',
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
          }}>
            {current.template}
          </pre>
        </div>

        {/* Tips */}
        <div>
          <p style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '12px',
          }}>
            💡 Key Tips
          </p>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px',
          }}>
            {current.tips.map((tip, idx) => (
              <li
                key={idx}
                style={{
                  padding: '12px 16px',
                  background: '#fff0f0',
                  border: '1px solid rgba(168,16,17,0.25)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  color: '#7f1d1d',
                }}
              >
                ✓ {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Band 8 Sample */}
      <div style={{
        background: '#fff0f0',
        border: '2px solid #a81011',
        borderRadius: '16px',
        padding: '32px',
      }}>
        <button
          onClick={() => setShowSample(!showSample)}
          style={{
            width: '100%',
            padding: '16px',
            background: '#a81011',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 700,
            fontSize: '0.95rem',
            cursor: 'pointer',
            marginBottom: showSample ? '20px' : 0,
            transition: 'all 0.2s',
          }}
        >
          {showSample ? '▼ Hide Band 8+ Sample Essay' : '▶ View Band 8+ Sample Essay'}
        </button>

        {showSample && (
          <div>
            <p style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#a81011',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '16px',
            }}>
              ⭐ Band 8 Sample
            </p>
            <p style={{
              color: '#7f1d1d',
              lineHeight: 1.8,
              fontSize: '0.95rem',
              whiteSpace: 'pre-wrap',
            }}>
              {current.band8Sample}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EssayTemplates;