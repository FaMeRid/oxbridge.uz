import React, { useState, useEffect, useMemo } from 'react';
import '../../styles/globals.css';

// ============================================================================
// COMPREHENSIVE READING PASSAGES DATABASE
// ============================================================================

const PASSAGES = [
  // ========== EASY LEVEL ==========
  {
    id: 1,
    title: 'The Benefits of Exercise',
    difficulty: 'Easy',
    wordCount: 185,
    category: 'Health & Wellness',
    text: `Regular exercise is one of the most important activities for maintaining good health. Physical activity strengthens muscles, improves cardiovascular function, and boosts mental health. People who exercise regularly experience lower stress levels, better sleep quality, and increased energy throughout the day. Exercise also reduces the risk of chronic diseases like diabetes, heart disease, and obesity. Beyond physical benefits, exercise improves mood by releasing endorphins, chemicals that promote happiness and reduce depression.

The World Health Organization recommends at least 150 minutes of moderate exercise per week for adults. This can include activities like brisk walking, swimming, or cycling. Even small amounts of physical activity are better than none. Starting an exercise routine doesn't require expensive equipment or gym membership. Simple activities like walking, gardening, or playing sports can provide significant health benefits. The key is consistency and finding activities you enjoy so you're more likely to continue.`,
    questions: [
      {
        id: 1,
        question: 'How many minutes of exercise does WHO recommend per week?',
        options: ['100 minutes', '150 minutes', '200 minutes', '250 minutes'],
        correct: 1,
      },
      {
        id: 2,
        question: 'Which chemical is released during exercise that improves mood?',
        options: ['Adrenaline', 'Serotonin', 'Endorphins', 'Dopamine'],
        correct: 2,
      },
      {
        id: 3,
        question: 'What is the main message of the passage?',
        options: ['Gyms are necessary for health', 'Exercise provides multiple health benefits', 'Walking is better than other exercises', 'Exercise is expensive'],
        correct: 1,
      },
    ],
  },

  {
    id: 2,
    title: 'Social Media and Young People',
    difficulty: 'Easy',
    wordCount: 172,
    category: 'Technology & Society',
    text: `Social media has become a major part of young people's lives. Platforms like Instagram, TikTok, and Snapchat allow teenagers to connect with friends and share experiences instantly. However, excessive social media use can have negative effects on mental health and academic performance. Studies show that spending too much time on social media can increase anxiety and depression among young people. Additionally, cyberbullying through social media platforms has become a serious concern for parents and educators.

Young people should learn to balance social media use with other important activities like studying, sports, and face-to-face interactions. Parents and schools play an important role in teaching digital literacy and healthy online habits. Setting time limits on social media use, taking breaks, and maintaining real-world friendships are essential strategies. While social media can be a useful tool for communication and creativity, moderation is key to maintaining mental health and well-being.`,
    questions: [
      {
        id: 1,
        question: 'What is the main concern about social media for young people?',
        options: ['They use it too often', 'It can affect mental health negatively', 'It is too expensive', 'It is too complicated'],
        correct: 1,
      },
      {
        id: 2,
        question: 'Who plays an important role in teaching digital literacy?',
        options: ['Only parents', 'Only schools', 'Parents and schools', 'Tech companies'],
        correct: 2,
      },
    ],
  },

  {
    id: 3,
    title: 'The Future of Remote Work',
    difficulty: 'Easy',
    wordCount: 158,
    category: 'Business & Economy',
    text: `Remote work has transformed the way people work around the world. The COVID-19 pandemic accelerated this change, forcing companies to implement work-from-home policies. Many organizations discovered that remote work increases productivity while reducing overhead costs. Employees enjoy flexibility, saving time and money on commuting, and achieving better work-life balance. However, remote work also presents challenges such as isolation, difficulty collaborating with colleagues, and blurred boundaries between work and personal life.

The future of work likely involves a hybrid model, combining remote and office-based work. Companies are investing in technology and tools to support remote collaboration. Virtual meetings, cloud storage, and project management software have become essential. Despite the benefits, many people miss face-to-face interaction and the social aspects of traditional offices. The key to successful remote work is finding the right balance that works for both employees and employers.`,
    questions: [
      {
        id: 1,
        question: 'What accelerated the adoption of remote work?',
        options: ['Employee requests', 'COVID-19 pandemic', 'Government policy', 'Technological innovation'],
        correct: 1,
      },
    ],
  },

  // ========== MEDIUM LEVEL ==========
  {
    id: 4,
    title: 'Climate Change and Biodiversity',
    difficulty: 'Medium',
    wordCount: 298,
    category: 'Environment & Science',
    text: `Climate change represents one of the most significant threats to global biodiversity in the 21st century. Rising global temperatures alter ecosystems in profound ways, affecting the survival and migration patterns of countless species. Coral reefs, often referred to as the rainforests of the sea, face bleaching events as ocean temperatures increase. Polar regions experience accelerated ice melt, threatening species like polar bears, seals, and Arctic foxes that depend on sea ice for survival and hunting grounds.

The interconnectedness of ecosystems means that species loss in one area can trigger cascading effects throughout food webs. When keystone species face decline, entire ecosystems can collapse. For instance, the decline of bee populations due to habitat loss and changing climate patterns threatens food security globally, as many crops depend on pollination. Furthermore, climate change exacerbates existing conservation challenges by destroying critical habitats at an unprecedented pace.

Conservation efforts must evolve to address climate change challenges comprehensively. Protected areas need to be expanded and connected to allow species migration corridors. Additionally, reducing greenhouse gas emissions remains paramount to mitigating the worst impacts of climate change on biodiversity. International cooperation and sustainable practices are essential for protecting the planet's remaining natural heritage. Investment in renewable energy, reforestation, and habitat restoration provides hope for reversing some of these trends.`,
    questions: [
      {
        id: 1,
        question: 'What are coral reefs compared to in the passage?',
        options: ['Mountains', 'Rainforests of the sea', 'Desert oases', 'Urban gardens'],
        correct: 1,
      },
      {
        id: 2,
        question: 'What is a keystone species?',
        options: ['A rare species', 'A species whose presence affects many others', 'The most common species', 'An extinct species'],
        correct: 1,
      },
      {
        id: 3,
        question: 'Why are bee populations important according to the passage?',
        options: ['They produce honey', 'They pollinate crops', 'They control pests', 'They clean the air'],
        correct: 1,
      },
    ],
  },

  {
    id: 5,
    title: 'Artificial Intelligence in Healthcare',
    difficulty: 'Medium',
    wordCount: 276,
    category: 'Technology & Science',
    text: `Artificial intelligence is revolutionizing the healthcare industry by enhancing diagnostic accuracy and treatment outcomes. Machine learning algorithms can analyze medical imaging data, identifying patterns that might escape human observation, enabling early disease detection. AI-powered diagnostic tools have demonstrated comparable or superior performance to experienced radiologists in detecting certain cancers and cardiovascular conditions. This technological advancement potentially democratizes access to expert-level diagnostics in regions with limited medical resources.

Beyond diagnostics, AI assists in drug discovery and development, significantly reducing both time and costs associated with bringing new pharmaceuticals to market. Virtual health assistants powered by natural language processing can provide patients with preliminary symptom assessment and health information, reducing unnecessary hospital visits. Robot-assisted surgery systems enhance precision, enabling surgeons to perform minimally invasive procedures with greater accuracy, resulting in faster recovery times and reduced complications.

However, implementing AI in healthcare raises important concerns regarding data privacy, algorithmic bias, and the role of human judgment in medicine. Medical data is highly sensitive, requiring robust security measures and regulatory compliance. Furthermore, AI systems trained on biased datasets may perpetuate existing healthcare disparities, leading to inferior outcomes for underrepresented populations. Despite these challenges, the potential benefits of AI in healthcare are substantial, provided implementation prioritizes ethical considerations and maintains human oversight in critical decision-making processes.`,
    questions: [
      {
        id: 1,
        question: 'How does AI improve drug discovery?',
        options: ['By replacing human researchers', 'By reducing time and costs', 'By eliminating side effects', 'By making drugs cheaper'],
        correct: 1,
      },
      {
        id: 2,
        question: 'What is a concern mentioned about AI in healthcare?',
        options: ['It is too expensive', 'Algorithmic bias', 'It works too slowly', 'Doctors won\'t accept it'],
        correct: 1,
      },
    ],
  },

  {
    id: 6,
    title: 'The Psychology of Motivation',
    difficulty: 'Medium',
    wordCount: 264,
    category: 'Psychology & Education',
    text: `Motivation is a fundamental psychological concept that drives behavior and influences success in academic, professional, and personal pursuits. Psychologists distinguish between intrinsic motivation, which originates from internal desires and interests, and extrinsic motivation, driven by external rewards or punishments. Research suggests that intrinsic motivation typically produces more sustained engagement and higher quality outcomes compared to extrinsic motivation.

Self-determination theory, developed by Deci and Ryan, identifies three basic psychological needs that foster intrinsic motivation: autonomy, competence, and relatedness. Autonomy refers to the sense of control over one's actions and choices. Competence involves feeling capable and effective in accomplishing tasks. Relatedness represents the human need for connection and belonging within social groups. When these needs are satisfied, individuals demonstrate greater persistence, creativity, and overall well-being.

Environmental factors significantly influence motivation levels. Supportive environments that provide clear goals, constructive feedback, and recognition of achievements enhance motivation. Conversely, overly controlling or critical environments suppress intrinsic motivation, leading to learned helplessness and disengagement. Parents, educators, and managers must cultivate environments that nurture intrinsic motivation while avoiding excessive reliance on external incentives. Understanding these psychological principles enables more effective approaches to education, workplace management, and personal development.`,
    questions: [
      {
        id: 1,
        question: 'What are the three basic psychological needs according to self-determination theory?',
        options: ['Speed, strength, skill', 'Autonomy, competence, relatedness', 'Money, fame, status', 'Food, shelter, safety'],
        correct: 1,
      },
    ],
  },

  // ========== HARD LEVEL ==========
  {
    id: 7,
    title: 'Linguistic Relativity and Cognition',
    difficulty: 'Hard',
    wordCount: 340,
    category: 'Linguistics & Philosophy',
    text: `The Sapir-Whorf hypothesis, also known as linguistic relativity, posits that the structure and lexicon of a language profoundly influence its speakers' perception of reality and cognition. This influential theory suggests that language does not merely serve as a neutral medium for expressing pre-existing thoughts; rather, it actively shapes the very nature of thought itself. Proponents argue that speakers of languages with rich vocabularies describing particular phenomena develop correspondingly nuanced cognitive categories for conceptualizing those phenomena.

Empirical support for linguistic relativity emerges from cross-linguistic research examining color perception, spatial reasoning, and temporal concepts. Studies reveal that languages encoding different numbers of basic color terms influence speakers' color discrimination abilities. For instance, the Himba language of Namibia distinguishes fewer basic colors than English, and Himba speakers demonstrate correspondingly reduced performance in color differentiation tasks. Similarly, languages employing different systems for spatial reference—absolute, relative, or intrinsic—correlate with distinct navigational and spatial reasoning patterns among speakers.

However, contemporary linguistic research suggests the relationship between language and thought is bidirectional and more nuanced than the strong version of Sapir-Whorf hypothesis proposes. While language undoubtedly influences cognition, cognitive universals transcend linguistic boundaries. Critics argue that many cognitive capabilities, such as basic number sense and object recognition, appear independent of linguistic structure. The current consensus favors a moderate position: language and thought interact dynamically, with language facilitating certain cognitive operations while constraining others, yet fundamental cognitive processes remain substantially universal across human populations.

This debate has profound implications for understanding human cognition, cross-cultural psychology, and the nature of reality itself. Recognizing language's influence on thought illuminates why cultural and linguistic diversity constitutes invaluable cognitive resources for humanity.`,
    questions: [
      {
        id: 1,
        question: 'What does the Sapir-Whorf hypothesis primarily argue?',
        options: ['Language is universal', 'Language shapes perception and thought', 'All languages are equally complex', 'Thought is independent of language'],
        correct: 1,
      },
      {
        id: 2,
        question: 'What evidence is mentioned about color perception?',
        options: ['All languages name colors the same way', 'Languages with fewer color terms affect color discrimination', 'Color perception is identical across cultures', 'The Himba see all colors equally'],
        correct: 1,
      },
      {
        id: 3,
        question: 'What is the current consensus about language and thought?',
        options: ['Language determines everything', 'They interact dynamically', 'They are completely separate', 'Thought is entirely universal'],
        correct: 1,
      },
    ],
  },

  {
    id: 8,
    title: 'Quantum Mechanics and Reality',
    difficulty: 'Hard',
    wordCount: 356,
    category: 'Physics & Science',
    text: `Quantum mechanics has fundamentally challenged our intuitive understanding of physical reality, revealing a universe that operates according to probabilistic principles rather than classical determinism. At the quantum scale, particles exhibit wave-particle duality, simultaneously demonstrating characteristics of both waves and particles depending on the measurement methodology employed. The double-slit experiment exemplifies this phenomenon: when electrons pass through two slits without observation, they create an interference pattern typical of waves; however, when detectors monitor which slit each electron passes through, the pattern becomes distinctly particulate.

The measurement problem represents one of quantum mechanics' most philosophically profound challenges. The act of measurement fundamentally alters quantum systems, collapsing wave functions from superposition into definite states. This observation-dependence fundamentally distinguishes quantum mechanics from classical physics, where measurements reveal pre-existing properties without affecting them. The Copenhagen interpretation suggests that quantum systems exist in superposition until observed, raising unsettling questions about reality's nature and consciousness's role in constituting physical reality.

Entanglement further complicates our understanding of locality and causality. Quantum entanglement enables particles to exhibit correlated properties instantaneously across arbitrary distances, seemingly violating locality principles and relativistic constraints. Experiments by Bell and subsequent refinements conclusively demonstrate that no local hidden variable theory can adequately explain quantum phenomena, fundamentally challenging our conceptions of reality's fundamental structure.

Contemporary quantum field theory synthesizes quantum mechanics with relativity, providing extraordinary predictive precision for particle physics phenomena. However, interpretive questions persist: does quantum mechanics describe reality itself or merely our knowledge of reality? Different interpretations—Copenhagen, many-worlds, pilot-wave—offer competing philosophical frameworks while maintaining identical empirical predictions. These philosophical ambiguities underscore that despite quantum mechanics' extraordinary empirical success, fundamental questions regarding reality's ultimate nature remain profoundly unresolved.`,
    questions: [
      {
        id: 1,
        question: 'What does wave-particle duality mean?',
        options: ['Particles always behave like waves', 'Particles always behave like particles', 'Particles exhibit wave or particle characteristics depending on measurement', 'Particles have both properties simultaneously'],
        correct: 2,
      },
      {
        id: 2,
        question: 'What is the measurement problem in quantum mechanics?',
        options: ['Instruments are too imprecise', 'Measurement alters the quantum system', 'Quantum particles are too small', 'All of the above'],
        correct: 1,
      },
    ],
  },

  {
    id: 9,
    title: 'Economic Inequality and Social Mobility',
    difficulty: 'Hard',
    wordCount: 328,
    category: 'Economics & Society',
    text: `Economic inequality has reached unprecedented levels in developed economies, fundamentally challenging foundational assumptions about meritocratic societies and equal opportunity. Intergenerational wealth transfer mechanisms and systematic disadvantages for low-income populations create persistent poverty cycles that transcend individual agency and effort. Research from economists like Thomas Piketty demonstrates that, absent significant redistributive policies, wealth concentration inevitably accelerates due to differential returns on capital compared to labor income.

Social mobility—the ability for individuals to improve their economic status relative to their parents—has dramatically declined in many wealthy nations over recent decades. Empirical evidence reveals that children born to low-income parents face substantially reduced probabilities of achieving middle-class status, regardless of educational attainment. Educational systems, ostensibly designed to equalize opportunity, often perpetuate existing inequalities through mechanisms such as resource disparities between affluent and disadvantaged districts, differential access to enrichment programs, and systemic biases affecting underrepresented populations.

The consequences of constrained social mobility extend beyond individual hardship, encompassing broad societal implications. Persistent inequality correlates with elevated crime rates, diminished public health outcomes, reduced social cohesion, and political polarization. When substantial populations perceive diminishing opportunities for advancement, social contracts weaken, and faith in democratic institutions erodes. Furthermore, efficiency arguments suggest that society wastes considerable human potential by failing to develop talents among disadvantaged populations, resulting in reduced economic productivity and innovation.

Addressing inequality necessitates multifaceted interventions spanning progressive taxation, enhanced educational investment in disadvantaged communities, healthcare accessibility, and deliberate effort to eliminate systemic discrimination. Scandinavian economies demonstrate that robust social safety nets and redistributive policies compatible with dynamic capitalism can substantially enhance social mobility while maintaining economic prosperity. Nevertheless, political resistance to substantive inequality reduction reflects ideological divisions regarding government's appropriate role, suggesting that addressing entrenched inequality remains one of contemporary society's most formidable challenges.`,
    questions: [
      {
        id: 1,
        question: 'What does Thomas Piketty demonstrate in his research?',
        options: ['Equality always increases', 'Wealth concentration accelerates without intervention', 'Labor income exceeds capital returns', 'Taxes solve all inequality'],
        correct: 1,
      },
      {
        id: 2,
        question: 'How do educational systems sometimes perpetuate inequality?',
        options: ['They teach too much', 'Resource disparities between districts', 'They are too expensive', 'Teachers are incompetent'],
        correct: 1,
      },
    ],
  },
];

// ============================================================================
// READING SPEED TRAINER COMPONENT
// ============================================================================

export function ReadingSpeedTrainer() {
  const [currentPassageIndex, setCurrentPassageIndex] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [startTime, setStartTime] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);
  const [currentAnswers, setCurrentAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [readingHistory, setReadingHistory] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Filter passages by difficulty
  const filteredPassages = useMemo(() => {
    if (selectedDifficulty === 'All') return PASSAGES;
    return PASSAGES.filter(p => p.difficulty === selectedDifficulty);
  }, [selectedDifficulty]);

  const currentPassage = filteredPassages[currentPassageIndex] || PASSAGES[0];

  // Timer effect
  useEffect(() => {
    let interval;
    if (hasStarted && !hasFinished) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [hasStarted, hasFinished]);

  const handleStart = () => {
    setHasStarted(true);
    setStartTime(Date.now());
    setHasFinished(false);
    setWordsPerMinute(0);
    setCurrentAnswers({});
    setShowResults(false);
    setElapsedTime(0);
  };

  const handleFinish = () => {
    if (!startTime) return;

    const endTime = Date.now();
    const timeInMinutes = (endTime - startTime) / 1000 / 60;
    const wpm = Math.round(currentPassage.wordCount / timeInMinutes);

    setWordsPerMinute(wpm);
    setHasFinished(true);
  };

  const handleAnswerChange = (questionId, answerIndex) => {
    setCurrentAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleSubmitAnswers = () => {
    let correct = 0;
    currentPassage.questions.forEach(question => {
      if (currentAnswers[question.id] === question.correct) {
        correct++;
      }
    });

    setCorrectCount(correct);
    const accuracy = Math.round((correct / currentPassage.questions.length) * 100);

    const historyItem = {
      id: Date.now(),
      title: currentPassage.title,
      difficulty: currentPassage.difficulty,
      wpm: wordsPerMinute,
      accuracy: accuracy,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    setReadingHistory(prev => [historyItem, ...prev].slice(0, 20));
    setShowResults(true);
  };

  const handleNextPassage = () => {
    const nextIndex = (currentPassageIndex + 1) % filteredPassages.length;
    setCurrentPassageIndex(nextIndex);
    setHasStarted(false);
    setHasFinished(false);
    setShowResults(false);
    setCurrentAnswers({});
    setElapsedTime(0);
  };

  const handleReset = () => {
    setHasStarted(false);
    setHasFinished(false);
    setShowResults(false);
    setCurrentAnswers({});
    setWordsPerMinute(0);
    setElapsedTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const averageWPM = readingHistory.length > 0
    ? Math.round(readingHistory.reduce((sum, item) => sum + item.wpm, 0) / readingHistory.length)
    : 0;

  const averageAccuracy = readingHistory.length > 0
    ? Math.round(readingHistory.reduce((sum, item) => sum + item.accuracy, 0) / readingHistory.length)
    : 0;

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
          📖 Reading Speed Trainer
        </h1>
        <p style={{ color: '#475569', fontSize: '0.95rem', maxWidth: '700px' }}>
          Improve your reading speed and comprehension with authentic passages. Track your progress and achieve your reading goals.
        </p>
      </div>

      {/* ========== DIFFICULTY FILTER ========== */}
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
      }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {['All', 'Easy', 'Medium', 'Hard'].map(difficulty => (
            <button
              key={difficulty}
              onClick={() => {
                setSelectedDifficulty(difficulty);
                setCurrentPassageIndex(0);
                handleReset();
              }}
              style={{
                padding: '10px 18px',
                border: selectedDifficulty === difficulty ? `2px solid ${getDifficultyColor(difficulty)}` : '1px solid #dde3ef',
                borderRadius: '8px',
                background: selectedDifficulty === difficulty ? `${getDifficultyColor(difficulty)}15` : '#fff',
                color: selectedDifficulty === difficulty ? getDifficultyColor(difficulty) : '#475569',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {difficulty}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowStats(!showStats)}
          style={{
            padding: '10px 18px',
            border: showStats ? '2px solid #a81011' : '1px solid #dde3ef',
            borderRadius: '8px',
            background: showStats ? '#fff0f0' : '#fff',
            color: showStats ? '#a81011' : '#475569',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          📊 Statistics
        </button>
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>
              Total Passages Read
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#0c1f4a' }}>
              {readingHistory.length}
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>
              Average WPM
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>
              {averageWPM}
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>
              Average Accuracy
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>
              {averageAccuracy}%
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, marginBottom: '8px' }}>
              Best Performance
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#a81011' }}>
              {readingHistory.length > 0 ? Math.max(...readingHistory.map(h => h.wpm)) : 0}
            </p>
          </div>
        </div>
      )}

      {/* ========== READING HISTORY ========== */}
      {showStats && readingHistory.length > 0 && (
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '28px',
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0c1f4a', marginBottom: '16px' }}>
            Recent Reading Sessions
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.85rem',
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 700, color: '#94a3b8' }}>Passage</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 700, color: '#94a3b8' }}>Difficulty</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: 700, color: '#94a3b8' }}>WPM</th>
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: 700, color: '#94a3b8' }}>Accuracy</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: 700, color: '#94a3b8' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {readingHistory.slice(0, 10).map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #eef1f8' }}>
                    <td style={{ padding: '12px', color: '#475569' }}>{item.title}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: `${getDifficultyColor(item.difficulty)}15`,
                        color: getDifficultyColor(item.difficulty),
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontWeight: 600,
                      }}>
                        {item.difficulty}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 700, color: '#10b981' }}>
                      {item.wpm}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: 700, color: '#f59e0b' }}>
                      {item.accuracy}%
                    </td>
                    <td style={{ padding: '12px', color: '#94a3b8' }}>
                      {item.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========== PASSAGE DISPLAY ========== */}
      <div style={{
        background: hasStarted && !hasFinished ? '#f4f6fb' : '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '24px',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Passage Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#0c1f4a',
              marginBottom: '8px',
            }}>
              {currentPassage.title}
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              {currentPassage.category}
            </p>
          </div>

          <div style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
          }}>
            <span style={{
              background: `${getDifficultyColor(currentPassage.difficulty)}15`,
              color: getDifficultyColor(currentPassage.difficulty),
              padding: '8px 14px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}>
              {currentPassage.difficulty}
            </span>
            <span style={{
              background: '#f4f6fb',
              padding: '8px 14px',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: '#0c1f4a',
            }}>
              {currentPassage.wordCount} words
            </span>
            {hasStarted && !hasFinished && (
              <div style={{
                background: '#fff0f0',
                padding: '8px 14px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: '#a81011',
              }}>
                ⏱️ {formatTime(elapsedTime)}
              </div>
            )}
          </div>
        </div>

        {/* Passage Text */}
        {!hasFinished ? (
          <>
            <p style={{
              fontSize: '1rem',
              lineHeight: 1.85,
              color: hasStarted ? '#0f172a' : '#94a3b8',
              opacity: hasStarted ? 1 : 0.6,
              marginBottom: '24px',
              flex: 1,
              textAlign: 'justify',
            }}>
              {currentPassage.text}
            </p>

            {!hasStarted && (
              <div style={{
                background: '#fef3f3',
                border: '1px solid rgba(168,16,17,0.25)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px',
              }}>
                <p style={{
                  fontSize: '0.85rem',
                  color: '#7f1d1d',
                  lineHeight: 1.6,
                }}>
                  <strong>💡 Tips:</strong> Start the timer to begin. Read at your natural pace. Focus on understanding the main ideas. You'll answer comprehension questions after reading.
                </p>
              </div>
            )}
          </>
        ) : null}
      </div>

      {/* ========== COMPREHENSION QUESTIONS ========== */}
      {hasFinished && !showResults && (
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
        }}>
          <h3 style={{
            fontSize: '1.3rem',
            fontWeight: 700,
            color: '#0c1f4a',
            marginBottom: '28px',
          }}>
            📋 Comprehension Questions
          </h3>

          {currentPassage.questions.map((question, qIdx) => (
            <div key={question.id} style={{
              marginBottom: '28px',
              paddingBottom: '28px',
              borderBottom: qIdx < currentPassage.questions.length - 1 ? '1px solid #e2e8f0' : 'none',
            }}>
              <p style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#0c1f4a',
                marginBottom: '16px',
              }}>
                {qIdx + 1}. {question.question}
              </p>

              <div style={{ display: 'grid', gap: '10px' }}>
                {question.options.map((option, optIdx) => (
                  <label key={optIdx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    background: currentAnswers[question.id] === optIdx ? '#fff0f0' : '#f9fafb',
                    border: currentAnswers[question.id] === optIdx ? '2px solid #a81011' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}>
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      checked={currentAnswers[question.id] === optIdx}
                      onChange={() => handleAnswerChange(question.id, optIdx)}
                      style={{ marginRight: '12px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '0.95rem', color: '#475569' }}>
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========== RESULTS ========== */}
      {showResults && (
        <div style={{
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px',
        }}>
          <h3 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#0c1f4a',
            marginBottom: '28px',
            textAlign: 'center',
          }}>
            ✅ Results
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '32px',
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
                fontSize: '2.8rem',
                fontWeight: 800,
                color: '#166534',
                marginBottom: '4px',
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
                Comprehension
              </p>
              <p style={{
                fontSize: '2.8rem',
                fontWeight: 800,
                color: '#92400e',
                marginBottom: '4px',
              }}>
                {Math.round((correctCount / currentPassage.questions.length) * 100)}%
              </p>
              <p style={{ color: '#b45309', fontSize: '0.85rem' }}>
                {correctCount} of {currentPassage.questions.length} correct
              </p>
            </div>

            <div style={{
              background: '#f5f3ff',
              border: '1px solid rgba(139,92,246,0.3)',
              borderRadius: '12px',
              padding: '28px',
              textAlign: 'center',
            }}>
              <p style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#7c3aed',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}>
                Time Taken
              </p>
              <p style={{
                fontSize: '2.8rem',
                fontWeight: 800,
                color: '#5b21b6',
                marginBottom: '4px',
              }}>
                {formatTime(elapsedTime)}
              </p>
              <p style={{ color: '#7c3aed', fontSize: '0.85rem' }}>
                {(currentPassage.wordCount / ((elapsedTime || 1) / 60)).toFixed(0)} WPM
              </p>
            </div>
          </div>

          {/* Answer Review */}
          <div style={{
            background: '#f9fafb',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
          }}>
            <p style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#0c1f4a',
              marginBottom: '16px',
            }}>
              📝 Answer Review
            </p>

            {currentPassage.questions.map((question, idx) => {
              const isCorrect = currentAnswers[question.id] === question.correct;
              return (
                <div key={question.id} style={{
                  padding: '12px',
                  marginBottom: '12px',
                  background: isCorrect ? '#f0fdf4' : '#fef2f2',
                  borderLeft: `4px solid ${isCorrect ? '#10b981' : '#ef4444'}`,
                  borderRadius: '6px',
                }}>
                  <p style={{
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#0c1f4a',
                    marginBottom: '4px',
                  }}>
                    {idx + 1}. {question.question}
                  </p>
                  <p style={{
                    fontSize: '0.8rem',
                    color: isCorrect ? '#16a34a' : '#dc2626',
                  }}>
                    {isCorrect ? '✓ Correct' : '✗ Incorrect'}: {question.options[currentAnswers[question.id] !== undefined ? currentAnswers[question.id] : 0]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========== CONTROLS ========== */}
      <div style={{
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        {!hasStarted && !hasFinished && !showResults && (
          <button
            onClick={handleStart}
            style={{
              padding: '14px 32px',
              background: 'linear-gradient(135deg, #a81011, #d42022)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(168,16,17,0.28)',
              transition: 'all 0.2s',
            }}
          >
            ▶️ Start Reading
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
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(12,31,74,0.28)',
              transition: 'all 0.2s',
            }}
          >
            ⏹️ Finish Reading
          </button>
        )}

        {hasFinished && !showResults && (
          <>
            <button
              onClick={handleSubmitAnswers}
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 24px rgba(16,185,129,0.28)',
              }}
            >
              ✓ Submit Answers
            </button>

            <button
              onClick={handleReset}
              style={{
                padding: '14px 32px',
                background: '#fff',
                color: '#0f172a',
                border: '1.5px solid #d1d9e6',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              ↺ Start Over
            </button>
          </>
        )}

        {showResults && (
          <>
            <button
              onClick={handleNextPassage}
              style={{
                padding: '14px 32px',
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
              ➜ Next Passage
            </button>

            <button
              onClick={handleReset}
              style={{
                padding: '14px 32px',
                background: '#fff',
                color: '#0f172a',
                border: '1.5px solid #d1d9e6',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
              }}
            >
              ↺ Try Same Passage
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ReadingSpeedTrainer;