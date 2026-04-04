import React, { useState, useEffect, useMemo } from 'react';
import '../../styles/globals.css';

// ============================================================================
// COMPREHENSIVE FLASHCARD DATABASE
// ============================================================================

const FLASHCARD_DATA = [
  // ========== COLLOCATIONS ==========
  {
    id: 1,
    category: 'Collocations',
    front: 'Collocation: "Take into account"',
    back: 'To consider something as a factor when making a decision',
    example: 'When planning your schedule, you should take into account the commute time.',
    difficulty: 'Intermediate',
    type: 'Collocation',
    relatedPhrases: ['consider', 'factor in', 'bear in mind'],
    tags: ['Business', 'Planning', 'Decision-making'],
  },

  {
    id: 2,
    category: 'Collocations',
    front: 'Collocation: "Make a difference"',
    back: 'To have a significant effect or impact on something',
    example: 'Volunteering can make a real difference in people\'s lives.',
    difficulty: 'Beginner',
    type: 'Collocation',
    relatedPhrases: ['impact', 'affect', 'influence'],
    tags: ['Impact', 'Change', 'Contribution'],
  },

  {
    id: 3,
    category: 'Collocations',
    front: 'Collocation: "Bring about"',
    back: 'To cause something to happen; to result in',
    example: 'The new policy brought about significant changes in the organization.',
    difficulty: 'Intermediate',
    type: 'Collocation',
    relatedPhrases: ['cause', 'lead to', 'result in'],
    tags: ['Cause', 'Effect', 'Change'],
  },

  {
    id: 4,
    category: 'Collocations',
    front: 'Collocation: "Point out"',
    back: 'To draw attention to something; to mention something important',
    example: 'The teacher pointed out the grammatical errors in the essay.',
    difficulty: 'Beginner',
    type: 'Collocation',
    relatedPhrases: ['highlight', 'indicate', 'mention'],
    tags: ['Communication', 'Attention', 'Grammar'],
  },

  {
    id: 5,
    category: 'Collocations',
    front: 'Collocation: "Come across"',
    back: 'To encounter by chance; to find unexpectedly',
    example: 'I came across an interesting article about climate change.',
    difficulty: 'Intermediate',
    type: 'Collocation',
    relatedPhrases: ['encounter', 'find', 'discover'],
    tags: ['Discovery', 'Chance', 'Finding'],
  },

  {
    id: 6,
    category: 'Collocations',
    front: 'Collocation: "Set aside"',
    back: 'To save or reserve something for a specific purpose',
    example: 'You should set aside time each day for reading and study.',
    difficulty: 'Intermediate',
    type: 'Collocation',
    relatedPhrases: ['reserve', 'allocate', 'dedicate'],
    tags: ['Planning', 'Time-management', 'Resources'],
  },

  {
    id: 7,
    category: 'Collocations',
    front: 'Collocation: "Deal with"',
    back: 'To handle or manage a situation, problem, or person',
    example: 'The government must deal with environmental pollution urgently.',
    difficulty: 'Beginner',
    type: 'Collocation',
    relatedPhrases: ['handle', 'manage', 'tackle'],
    tags: ['Management', 'Problems', 'Handling'],
  },

  {
    id: 8,
    category: 'Collocations',
    front: 'Collocation: "Put forward"',
    back: 'To propose or suggest an idea, theory, or plan',
    example: 'The researcher put forward a new hypothesis to explain the phenomenon.',
    difficulty: 'Intermediate',
    type: 'Collocation',
    relatedPhrases: ['propose', 'suggest', 'present'],
    tags: ['Ideas', 'Proposals', 'Theories'],
  },

  // ========== IDIOMS ==========
  {
    id: 9,
    category: 'Idioms',
    front: 'Idiom: "Break the ice"',
    back: 'To initiate conversation or make people feel comfortable in a social situation',
    example: 'The teacher used a game to break the ice on the first day of class.',
    difficulty: 'Intermediate',
    type: 'Idiom',
    relatedPhrases: ['start conversation', 'relieve tension', 'initiate'],
    tags: ['Social', 'Communication', 'Interaction'],
  },

  {
    id: 10,
    category: 'Idioms',
    front: 'Idiom: "Get the ball rolling"',
    back: 'To start something; to initiate a process or activity',
    example: 'Let\'s get the ball rolling with the new project by tomorrow.',
    difficulty: 'Intermediate',
    type: 'Idiom',
    relatedPhrases: ['start', 'begin', 'initiate'],
    tags: ['Beginning', 'Starting', 'Initiative'],
  },

  {
    id: 11,
    category: 'Idioms',
    front: 'Idiom: "Think outside the box"',
    back: 'To think creatively or unconventionally; to consider unusual solutions',
    example: 'To solve this problem, we need to think outside the box.',
    difficulty: 'Intermediate',
    type: 'Idiom',
    relatedPhrases: ['be creative', 'innovate', 'brainstorm'],
    tags: ['Creativity', 'Innovation', 'Problem-solving'],
  },

  {
    id: 12,
    category: 'Idioms',
    front: 'Idiom: "Under the weather"',
    back: 'To feel sick or unwell; to be in poor health temporarily',
    example: 'I\'m feeling under the weather today, so I\'ll stay home.',
    difficulty: 'Beginner',
    type: 'Idiom',
    relatedPhrases: ['sick', 'unwell', 'ill'],
    tags: ['Health', 'Feeling', 'Condition'],
  },

  {
    id: 13,
    category: 'Idioms',
    front: 'Idiom: "Piece of cake"',
    back: 'Something that is very easy to do; an easy task',
    example: 'For an experienced programmer, writing that code was a piece of cake.',
    difficulty: 'Beginner',
    type: 'Idiom',
    relatedPhrases: ['easy', 'simple', 'effortless'],
    tags: ['Difficulty', 'Ease', 'Task'],
  },

  {
    id: 14,
    category: 'Idioms',
    front: 'Idiom: "Hit the nail on the head"',
    back: 'To identify the exact problem or truth; to be absolutely right',
    example: 'Your analysis hit the nail on the head regarding the company\'s issues.',
    difficulty: 'Intermediate',
    type: 'Idiom',
    relatedPhrases: ['be correct', 'identify exactly', 'be right'],
    tags: ['Accuracy', 'Correctness', 'Truth'],
  },

  {
    id: 15,
    category: 'Idioms',
    front: 'Idiom: "Burn the midnight oil"',
    back: 'To work very late into the night; to study or work hard',
    example: 'Students burn the midnight oil before exams to prepare.',
    difficulty: 'Intermediate',
    type: 'Idiom',
    relatedPhrases: ['work hard', 'study late', 'stay up'],
    tags: ['Hard work', 'Dedication', 'Effort'],
  },

  {
    id: 16,
    category: 'Idioms',
    front: 'Idiom: "The ball is in your court"',
    back: 'It\'s now someone\'s responsibility to take action or make a decision',
    example: 'I\'ve made my offer; the ball is in your court now.',
    difficulty: 'Intermediate',
    type: 'Idiom',
    relatedPhrases: ['your turn', 'your responsibility', 'your decision'],
    tags: ['Responsibility', 'Action', 'Decision'],
  },

  // ========== PHRASES ==========
  {
    id: 17,
    category: 'Phrases',
    front: 'Phrase: "At the end of the day"',
    back: 'When everything is considered; ultimately; in conclusion',
    example: 'At the end of the day, what matters most is your effort and dedication.',
    difficulty: 'Intermediate',
    type: 'Phrase',
    relatedPhrases: ['ultimately', 'finally', 'in conclusion'],
    tags: ['Conclusion', 'Summary', 'Overall'],
  },

  {
    id: 18,
    category: 'Phrases',
    front: 'Phrase: "In the long run"',
    back: 'In the end; ultimately; when considering a long period of time',
    example: 'Investing in education is beneficial in the long run.',
    difficulty: 'Intermediate',
    type: 'Phrase',
    relatedPhrases: ['eventually', 'ultimately', 'over time'],
    tags: ['Time', 'Future', 'Perspective'],
  },

  {
    id: 19,
    category: 'Phrases',
    front: 'Phrase: "In fact"',
    back: 'Used to emphasize a statement or provide factual information; actually',
    example: 'The project was difficult, but in fact, we completed it on time.',
    difficulty: 'Beginner',
    type: 'Phrase',
    relatedPhrases: ['actually', 'really', 'indeed'],
    tags: ['Emphasis', 'Fact', 'Information'],
  },

  {
    id: 20,
    category: 'Phrases',
    front: 'Phrase: "By and large"',
    back: 'In general; on the whole; mostly',
    example: 'By and large, the conference was well-organized and informative.',
    difficulty: 'Intermediate',
    type: 'Phrase',
    relatedPhrases: ['generally', 'mostly', 'overall'],
    tags: ['General', 'Summary', 'Overall'],
  },

  {
    id: 21,
    category: 'Phrases',
    front: 'Phrase: "All things considered"',
    back: 'Taking all factors into account; considering everything',
    example: 'All things considered, the plan seems viable and worth pursuing.',
    difficulty: 'Intermediate',
    type: 'Phrase',
    relatedPhrases: ['considering everything', 'taking into account', 'overall'],
    tags: ['Consideration', 'Summary', 'Analysis'],
  },

  {
    id: 22,
    category: 'Phrases',
    front: 'Phrase: "To put it simply"',
    back: 'To express something in simple, easy-to-understand terms',
    example: 'To put it simply, climate change is caused by human activities.',
    difficulty: 'Beginner',
    type: 'Phrase',
    relatedPhrases: ['basically', 'in short', 'essentially'],
    tags: ['Simplification', 'Explanation', 'Clarity'],
  },

  {
    id: 23,
    category: 'Phrases',
    front: 'Phrase: "As a matter of fact"',
    back: 'Used to emphasize a statement or correct a misconception; in fact',
    example: 'As a matter of fact, the new regulations have improved efficiency.',
    difficulty: 'Intermediate',
    type: 'Phrase',
    relatedPhrases: ['actually', 'in fact', 'indeed'],
    tags: ['Emphasis', 'Correction', 'Fact'],
  },

  {
    id: 24,
    category: 'Phrases',
    front: 'Phrase: "To make matters worse"',
    back: 'To make a bad situation even more difficult or complicated',
    example: 'The meeting was cancelled, and to make matters worse, no one was informed.',
    difficulty: 'Intermediate',
    type: 'Phrase',
    relatedPhrases: ['unfortunately', 'additionally', 'compounding'],
    tags: ['Negation', 'Complication', 'Worsening'],
  },

  // ========== TOPIC-SPECIFIC VOCABULARY ==========
  {
    id: 25,
    category: 'Academic',
    front: 'Academic Term: "Substantiate"',
    back: 'To provide evidence or proof for; to support with facts',
    example: 'The researcher needed to substantiate her claims with empirical data.',
    difficulty: 'Advanced',
    type: 'Academic Vocabulary',
    relatedPhrases: ['prove', 'evidence', 'support'],
    tags: ['Academic', 'Evidence', 'Research'],
  },

  {
    id: 26,
    category: 'Business',
    front: 'Business Term: "Leverage"',
    back: 'To use something to maximum advantage; to use a resource strategically',
    example: 'The company leveraged its brand reputation to enter new markets.',
    difficulty: 'Intermediate',
    type: 'Business Vocabulary',
    relatedPhrases: ['utilize', 'exploit', 'harness'],
    tags: ['Business', 'Strategy', 'Advantage'],
  },

  {
    id: 27,
    category: 'Environmental',
    front: 'Environmental Term: "Carbon footprint"',
    back: 'The total amount of greenhouse gases produced by human activities',
    example: 'Reducing your carbon footprint starts with making sustainable choices.',
    difficulty: 'Intermediate',
    type: 'Thematic Vocabulary',
    relatedPhrases: ['emissions', 'greenhouse gases', 'pollution'],
    tags: ['Environment', 'Climate', 'Sustainability'],
  },

  {
    id: 28,
    category: 'Technology',
    front: 'Tech Term: "Algorithm"',
    back: 'A step-by-step procedure or formula for solving a problem, especially by computer',
    example: 'Machine learning algorithms can analyze vast amounts of data quickly.',
    difficulty: 'Advanced',
    type: 'Thematic Vocabulary',
    relatedPhrases: ['procedure', 'process', 'computation'],
    tags: ['Technology', 'Computer Science', 'Data'],
  },

  {
    id: 29,
    category: 'Social Science',
    front: 'Social Science Term: "Demographic"',
    back: 'Statistical data relating to the population and society',
    example: 'Demographic trends show an aging population in developed countries.',
    difficulty: 'Advanced',
    type: 'Thematic Vocabulary',
    relatedPhrases: ['population', 'statistics', 'census'],
    tags: ['Social Science', 'Population', 'Statistics'],
  },

  {
    id: 30,
    category: 'Medicine',
    front: 'Medical Term: "Diagnosis"',
    back: 'The identification of a disease or condition based on symptoms and tests',
    example: 'The doctor\'s diagnosis revealed a treatable condition.',
    difficulty: 'Intermediate',
    type: 'Thematic Vocabulary',
    relatedPhrases: ['assessment', 'identification', 'condition'],
    tags: ['Medicine', 'Health', 'Healthcare'],
  },

  {
    id: 31,
    category: 'Academic',
    front: 'Academic Term: "Methodology"',
    back: 'The system of methods and principles used in a particular research or study',
    example: 'The research methodology was based on quantitative analysis.',
    difficulty: 'Advanced',
    type: 'Academic Vocabulary',
    relatedPhrases: ['method', 'approach', 'procedure'],
    tags: ['Academic', 'Research', 'Science'],
  },

  {
    id: 32,
    category: 'Legal',
    front: 'Legal Term: "Liability"',
    back: 'Legal responsibility for something; the state of being responsible',
    example: 'The company faced liability for the product\'s safety issues.',
    difficulty: 'Advanced',
    type: 'Thematic Vocabulary',
    relatedPhrases: ['responsibility', 'obligation', 'accountability'],
    tags: ['Legal', 'Business', 'Responsibility'],
  },
];

// ============================================================================
// FLASHCARD DECK COMPONENT
// ============================================================================

export function FlashcardDeck() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learned, setLearned] = useState(new Set());
  const [needsReview, setNeedsReview] = useState(new Set());
  const [stats, setStats] = useState({ learned: 0, total: FLASHCARD_DATA.length });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [studyMode, setStudyMode] = useState('normal'); // normal, review-only
  const [showStats, setShowStats] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    studied: 0,
    reviewed: 0,
    startTime: Date.now(),
  });

  // Get unique categories and difficulties
  const categories = ['All', ...new Set(FLASHCARD_DATA.map(card => card.category))];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Filter flashcards
  const filteredCards = useMemo(() => {
    let filtered = FLASHCARD_DATA;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(card =>
        card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.back.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(card => card.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(card => card.difficulty === selectedDifficulty);
    }

    // Filter by study mode
    if (studyMode === 'review-only') {
      filtered = filtered.filter(card => needsReview.has(card.id) && !learned.has(card.id));
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedDifficulty, studyMode, needsReview, learned]);

  const current = filteredCards[currentIndex] || FLASHCARD_DATA[0];
  const isCardLearned = learned.has(current.id);
  const isCardForReview = needsReview.has(current.id);

  const handleMarkLearned = () => {
    setLearned((prev) => {
      const newSet = new Set(prev);
      newSet.add(current.id);
      setStats({ learned: newSet.size, total: FLASHCARD_DATA.length });
      return newSet;
    });

    setNeedsReview((prev) => {
      const newSet = new Set(prev);
      newSet.delete(current.id);
      return newSet;
    });

    setSessionStats(prev => ({ ...prev, studied: prev.studied + 1 }));
    handleNext();
  };

  const handleMarkForReview = () => {
    setNeedsReview((prev) => {
      const newSet = new Set(prev);
      newSet.add(current.id);
      return newSet;
    });

    setSessionStats(prev => ({ ...prev, reviewed: prev.reviewed + 1 }));
    handleNext();
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    setIsFlipped(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    setIsFlipped(false);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleClearStats = () => {
    setLearned(new Set());
    setNeedsReview(new Set());
    setStats({ learned: 0, total: FLASHCARD_DATA.length });
    setSessionStats({ studied: 0, reviewed: 0, startTime: Date.now() });
    setCurrentIndex(0);
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Collocations': '#3b82f6',
      'Idioms': '#8b5cf6',
      'Phrases': '#ec4899',
      'Academic': '#10b981',
      'Business': '#f59e0b',
      'Environmental': '#06b6d4',
      'Technology': '#6366f1',
      'Social Science': '#d946ef',
      'Medicine': '#ef4444',
      'Legal': '#64748b',
    };
    return colors[category] || '#6b7280';
  };

  const sessionTime = Math.floor((Date.now() - sessionStats.startTime) / 1000);
  const sessionMinutes = Math.floor(sessionTime / 60);
  const sessionSeconds = sessionTime % 60;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
      {/* ========== HEADER ========== */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '2.2rem',
          fontWeight: 800,
          color: '#0c1f4a',
          marginBottom: '12px',
        }}>
          🃏 Interactive Flashcard Deck
        </h1>
        <p style={{ color: '#475569', fontSize: '0.95rem', maxWidth: '700px' }}>
          Master collocations, idioms, phrases, and topic-specific vocabulary through active recall and spaced repetition.
        </p>
      </div>

      {/* ========== CONTROLS & FILTERS ========== */}
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '28px',
      }}>
        {/* Search Bar */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'block',
            marginBottom: '10px',
          }}>
            🔍 Search Flashcards
          </label>
          <input
            type="text"
            placeholder="Search by term or definition..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentIndex(0);
            }}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1.5px solid #dde3ef',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#a81011'}
            onBlur={(e) => e.target.style.borderColor = '#dde3ef'}
          />
        </div>

        {/* Filters Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '16px',
        }}>
          {/* Category Filter */}
          <div>
            <p style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '10px',
            }}>
              Category
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentIndex(0);
                  }}
                  style={{
                    padding: '8px 14px',
                    border: selectedCategory === cat ? `2px solid ${getCategoryColor(cat)}` : '1px solid #dde3ef',
                    borderRadius: '8px',
                    background: selectedCategory === cat ? `${getCategoryColor(cat)}15` : '#fff',
                    color: selectedCategory === cat ? getCategoryColor(cat) : '#475569',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div>
            <p style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '10px',
            }}>
              Difficulty
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {difficulties.map(diff => (
                <button
                  key={diff}
                  onClick={() => {
                    setSelectedDifficulty(diff);
                    setCurrentIndex(0);
                  }}
                  style={{
                    padding: '8px 14px',
                    border: selectedDifficulty === diff ? `2px solid ${getDifficultyColor(diff)}` : '1px solid #dde3ef',
                    borderRadius: '8px',
                    background: selectedDifficulty === diff ? `${getDifficultyColor(diff)}15` : '#fff',
                    color: selectedDifficulty === diff ? getDifficultyColor(diff) : '#475569',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Study Mode & Stats Buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => {
              setStudyMode('normal');
              setCurrentIndex(0);
            }}
            style={{
              padding: '10px 16px',
              background: studyMode === 'normal' ? '#a81011' : '#fff',
              color: studyMode === 'normal' ? '#fff' : '#475569',
              border: studyMode === 'normal' ? 'none' : '1px solid #dde3ef',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            📚 Normal Mode
          </button>

          <button
            onClick={() => {
              setStudyMode('review-only');
              setCurrentIndex(0);
            }}
            style={{
              padding: '10px 16px',
              background: studyMode === 'review-only' ? '#f59e0b' : '#fff',
              color: studyMode === 'review-only' ? '#fff' : '#475569',
              border: studyMode === 'review-only' ? 'none' : '1px solid #dde3ef',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            ⚠️ Review Only ({needsReview.size})
          </button>

          <button
            onClick={() => setShowStats(!showStats)}
            style={{
              padding: '10px 16px',
              background: showStats ? '#a81011' : '#fff',
              color: showStats ? '#fff' : '#475569',
              border: showStats ? 'none' : '1px solid #dde3ef',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginLeft: 'auto',
            }}
          >
            📊 Statistics
          </button>
        </div>
      </div>

      {/* ========== STATISTICS PANEL ========== */}
      {showStats && (
        <div style={{
          background: '#f4f6fb',
          border: '1px solid #dde3ef',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '16px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>
              Learned
            </p>
            <p style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10b981' }}>
              {learned.size}
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>
              To Review
            </p>
            <p style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f59e0b' }}>
              {needsReview.size}
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>
              Total
            </p>
            <p style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0c1f4a' }}>
              {FLASHCARD_DATA.length}
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>
              Session Time
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0c1f4a' }}>
              {sessionMinutes}:{sessionSeconds.toString().padStart(2, '0')}
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>
              Studied
            </p>
            <p style={{ fontSize: '2.2rem', fontWeight: 800, color: '#3b82f6' }}>
              {sessionStats.studied}
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>
              Marked for Review
            </p>
            <p style={{ fontSize: '2.2rem', fontWeight: 800, color: '#8b5cf6' }}>
              {sessionStats.reviewed}
            </p>
          </div>
        </div>
      )}

      {filteredCards.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 24px',
          background: '#fff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
        }}>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '12px' }}>
            No flashcards found
          </p>
          <p style={{ fontSize: '0.9rem', color: '#d1d5db' }}>
            Try adjusting your filters or search term
          </p>
        </div>
      ) : (
        <>
          {/* ========== MAIN FLASHCARD ========== */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
              background: isFlipped
                ? 'linear-gradient(135deg, #a81011 0%, #d42022 100%)'
                : 'linear-gradient(135deg, #0c1f4a 0%, #1e293b 100%)',
              color: '#fff',
              borderRadius: '16px',
              padding: '56px 40px',
              minHeight: '320px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '24px',
              textAlign: 'center',
              boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 12px 60px rgba(0,0,0,0.3)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {/* Card Status Indicators */}
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              display: 'flex',
              gap: '8px',
            }}>
              {isCardLearned && (
                <span style={{
                  background: 'rgba(34,197,94,0.3)',
                  color: '#86efac',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}>
                  ✓ Learned
                </span>
              )}
              {isCardForReview && !isCardLearned && (
                <span style={{
                  background: 'rgba(217,119,6,0.3)',
                  color: '#fbbf24',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}>
                  ⚠️ Review
                </span>
              )}
            </div>

            {/* Card Label */}
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

            {/* Card Content */}
            <p style={{
              fontSize: isFlipped ? '1.3rem' : '1.9rem',
              fontWeight: 800,
              lineHeight: 1.6,
              marginBottom: '24px',
              maxWidth: '100%',
            }}>
              {isFlipped ? current.back : current.front}
            </p>

            {/* Example and Related Info (shown when flipped) */}
            {isFlipped && (
              <>
                <p style={{
                  fontSize: '0.95rem',
                  opacity: 0.9,
                  fontStyle: 'italic',
                  marginTop: '16px',
                  marginBottom: '20px',
                  borderTop: '1px solid rgba(255,255,255,0.3)',
                  borderBottom: '1px solid rgba(255,255,255,0.3)',
                  paddingTop: '16px',
                  paddingBottom: '16px',
                }}>
                  "{current.example}"
                </p>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  marginTop: '16px',
                }}>
                  <div style={{
                    background: 'rgba(255,255,255,0.15)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                  }}>
                    <strong>Category:</strong> {current.category}
                  </div>
                  <div style={{
                    background: 'rgba(255,255,255,0.15)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                  }}>
                    <strong>Level:</strong> {current.difficulty}
                  </div>
                </div>

                {current.relatedPhrases && (
                  <div style={{
                    marginTop: '16px',
                    fontSize: '0.85rem',
                  }}>
                    <p style={{ opacity: 0.8, marginBottom: '8px' }}>
                      Related: {current.relatedPhrases.join(', ')}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Click Hint */}
            <p style={{
              fontSize: '0.8rem',
              opacity: 0.7,
              marginTop: '28px',
            }}>
              Click to {isFlipped ? 'reveal question' : 'reveal answer'}
            </p>
          </div>

          {/* ========== CARD INFO ========== */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}>
            {/* Metadata Card */}
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px',
            }}>
              <p style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#94a3b8',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                Type
              </p>
              <p style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#0c1f4a',
              }}>
                {current.type}
              </p>
            </div>

            {/* Tags Card */}
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px',
            }}>
              <p style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#94a3b8',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                Tags
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {current.tags.map((tag, idx) => (
                  <span key={idx} style={{
                    background: '#f4f6fb',
                    color: '#0c1f4a',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Progress Card */}
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px',
            }}>
              <p style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#94a3b8',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                Card Progress
              </p>
              <p style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: '#0c1f4a',
              }}>
                {currentIndex + 1} of {filteredCards.length}
              </p>
            </div>
          </div>

          {/* ========== CONTROL BUTTONS ========== */}
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
                fontSize: '0.9rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#a81011';
                e.target.style.color = '#a81011';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#d1d9e6';
                e.target.style.color = '#0f172a';
              }}
            >
              ← Previous
            </button>

            <button
              onClick={handleMarkForReview}
              style={{
                padding: '12px',
                border: '1.5px solid #f59e0b',
                borderRadius: '10px',
                background: '#fff',
                color: isCardForReview ? '#fff' : '#b45309',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s',
                background: isCardForReview ? '#f59e0b' : '#fff',
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
                fontSize: '0.9rem',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#a81011';
                e.target.style.color = '#a81011';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#d1d9e6';
                e.target.style.color = '#0f172a';
              }}
            >
              Next →
            </button>
          </div>

          {/* ========== MAIN ACTION BUTTON ========== */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <button
              onClick={handleMarkLearned}
              style={{
                width: '100%',
                padding: '14px',
                background: isCardLearned
                  ? 'linear-gradient(135deg, #10b981, #22c55e)'
                  : 'linear-gradient(135deg, #16a34a, #22c55e)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(34,197,94,0.3)',
                transition: 'all 0.2s',
                opacity: isCardLearned ? 0.8 : 1,
              }}
            >
              {isCardLearned ? '✓ Already Learned' : '✓ I Know This!'}
            </button>

            <button
              onClick={handleClearStats}
              style={{
                width: '100%',
                padding: '14px',
                background: '#fff',
                color: '#ef4444',
                border: '1.5px solid #fca5a5',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#fef2f2';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#fff';
              }}
            >
              ↺ Reset Progress
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default FlashcardDeck;