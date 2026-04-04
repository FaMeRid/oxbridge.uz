import React, { useState, useCallback, useMemo } from 'react';
import '../../styles/globals.css';

// ============================================================================
// EXTENSIVE VOCABULARY DATABASE - BAND 7-8+ WORDS
// ============================================================================

const VOCABULARY_DATA = [
  // ========== ACADEMIC WORDS (Band 8+) ==========
  {
    id: 1,
    word: 'Ambiguous',
    pronunciation: '/æmˈbɪɡjuəs/',
    partOfSpeech: 'adjective',
    definition: 'Open to more than one interpretation; unclear or uncertain',
    example: 'The government\'s policy on education remains ambiguous, leaving many teachers confused about implementation.',
    collocations: ['ambiguous situation', 'ambiguous response', 'ambiguous language', 'ambiguous meaning'],
    synonyms: ['unclear', 'vague', 'equivocal', 'obscure', 'indefinite'],
    antonyms: ['clear', 'explicit', 'unambiguous'],
    category: 'Academic',
    level: 'Band 8',
    tips: 'Common in academic writing when discussing unclear meanings or conflicting interpretations.',
    relatedWords: ['ambiguity', 'ambiguously'],
  },
  {
    id: 2,
    word: 'Astute',
    pronunciation: '/əˈstjuːt/',
    partOfSpeech: 'adjective',
    definition: 'Having or showing good judgment, insight, or intelligence',
    example: 'The professor\'s astute observations about climate change policy demonstrated years of research expertise.',
    collocations: ['astute business person', 'astute analysis', 'astute observer', 'astute decision'],
    synonyms: ['clever', 'shrewd', 'intelligent', 'perceptive', 'keen'],
    antonyms: ['foolish', 'naive', 'unintelligent'],
    category: 'Academic',
    level: 'Band 8',
    tips: 'Excellent for describing someone with sharp intellect or keen observations in essays.',
    relatedWords: ['astutely', 'astuteness'],
  },
  {
    id: 3,
    word: 'Benign',
    pronunciation: '/bɪˈnaɪn/',
    partOfSpeech: 'adjective',
    definition: 'Not harmful or poisonous; gentle and kind; or (medical) not cancerous',
    example: 'The study found a benign tumor, so the patient did not require invasive surgery.',
    collocations: ['benign tumor', 'benign climate', 'benign influence', 'benign neglect'],
    synonyms: ['harmless', 'kind', 'friendly', 'gentle', 'innocuous'],
    antonyms: ['malignant', 'harmful', 'hostile'],
    category: 'Academic',
    level: 'Band 7',
    tips: 'Useful in medical, scientific, or descriptive contexts. Note the medical meaning.',
    relatedWords: ['benignly', 'benignity'],
  },
  {
    id: 4,
    word: 'Candid',
    pronunciation: '/ˈkændɪd/',
    partOfSpeech: 'adjective',
    definition: 'Truthful, straightforward, and honest in expression; frank',
    example: 'In her candid interview, the CEO discussed the company\'s failures openly and took personal responsibility.',
    collocations: ['candid camera', 'candid opinion', 'candid discussion', 'candid assessment'],
    synonyms: ['frank', 'honest', 'sincere', 'forthright', 'blunt'],
    antonyms: ['deceptive', 'dishonest', 'evasive'],
    category: 'Academic',
    level: 'Band 7',
    tips: 'Perfect for describing honest, direct communication in interviews or discussions.',
    relatedWords: ['candidly', 'candor'],
  },
  {
    id: 5,
    word: 'Cogent',
    pronunciation: '/ˈkoʊdʒənt/',
    partOfSpeech: 'adjective',
    definition: 'Clear, logical, and convincing; compelling in argument',
    example: 'The researcher presented cogent evidence proving that climate change impacts are accelerating rapidly.',
    collocations: ['cogent argument', 'cogent evidence', 'cogent reason', 'cogent case'],
    synonyms: ['compelling', 'convincing', 'forceful', 'persuasive', 'powerful'],
    antonyms: ['weak', 'unconvincing', 'feeble'],
    category: 'Academic',
    level: 'Band 8',
    tips: 'Ideal for describing strong, logical arguments in essays and academic writing.',
    relatedWords: ['cogently', 'cogency'],
  },
  {
    id: 6,
    word: 'Diligent',
    pronunciation: '/ˈdɪlɪdʒənt/',
    partOfSpeech: 'adjective',
    definition: 'Showing careful and persistent effort in work or duty',
    example: 'Her diligent research through archives uncovered previously unknown historical documents.',
    collocations: ['diligent work', 'diligent effort', 'diligent student', 'diligent investigation'],
    synonyms: ['hardworking', 'industrious', 'meticulous', 'careful', 'thorough'],
    antonyms: ['lazy', 'careless', 'negligent'],
    category: 'Academic',
    level: 'Band 7',
    tips: 'Commonly used to describe dedicated work ethic and thorough approaches.',
    relatedWords: ['diligently', 'diligence'],
  },
  {
    id: 7,
    word: 'Efficacious',
    pronunciation: '/ˌefɪˈkeɪʃəs/',
    partOfSpeech: 'adjective',
    definition: 'Successful in producing the desired result; effective',
    example: 'Studies show that combining exercise with diet changes is more efficacious than dieting alone.',
    collocations: ['efficacious treatment', 'efficacious method', 'efficacious solution', 'efficacious remedy'],
    synonyms: ['effective', 'successful', 'potent', 'efficient', 'productive'],
    antonyms: ['ineffective', 'inefficient', 'unsuccessful'],
    category: 'Academic',
    level: 'Band 8',
    tips: 'More formal than "effective." Used in scientific, medical, and technical contexts.',
    relatedWords: ['efficaciously', 'efficacy'],
  },
  {
    id: 8,
    word: 'Ephemeral',
    pronunciation: '/ɪˈfɛmərəl/',
    partOfSpeech: 'adjective',
    definition: 'Lasting for a very short time; transitory',
    example: 'Social media trends are often ephemeral, disappearing within weeks or months.',
    collocations: ['ephemeral nature', 'ephemeral beauty', 'ephemeral moment', 'ephemeral trend'],
    synonyms: ['temporary', 'transient', 'fleeting', 'brief', 'short-lived'],
    antonyms: ['permanent', 'lasting', 'enduring'],
    category: 'Academic',
    level: 'Band 8',
    tips: 'Great for discussing temporary phenomena or short-lived effects.',
    relatedWords: ['ephemerally'],
  },
  {
    id: 9,
    word: 'Fortuitous',
    pronunciation: '/fɔːrˈtuːɪtəs/',
    partOfSpeech: 'adjective',
    definition: 'Happening by chance; fortunate occurrence',
    example: 'The scientist\'s fortuitous discovery of penicillin happened when he forgot to clean a petri dish.',
    collocations: ['fortuitous event', 'fortuitous discovery', 'fortuitous meeting', 'fortuitous circumstance'],
    synonyms: ['lucky', 'fortunate', 'serendipitous', 'accidental', 'chance'],
    antonyms: ['deliberate', 'intentional', 'planned'],
    category: 'Academic',
    level: 'Band 8',
    tips: 'Use when describing luck or chance occurrences, not just good fortune.',
    relatedWords: ['fortuitously', 'fortuity'],
  },
  {
    id: 10,
    word: 'Gregarious',
    pronunciation: '/ɡrɪˈɡɛriəs/',
    partOfSpeech: 'adjective',
    definition: 'Fond of being in company; preferring to be with others; or living in groups',
    example: 'Humans are naturally gregarious creatures who thrive in social communities.',
    collocations: ['gregarious animal', 'gregarious nature', 'gregarious behavior', 'gregarious instinct'],
    synonyms: ['social', 'sociable', 'outgoing', 'communal', 'collective'],
    antonyms: ['solitary', 'unsocial', 'reclusive'],
    category: 'Academic',
    level: 'Band 8',
    tips: 'Useful in sociology, psychology, and biology discussions.',
    relatedWords: ['gregariously', 'gregariousness'],
  },
  {
    id: 11,
    word: 'Hedonistic',
    pronunciation: '/ˌhɛdəˈnɪstɪk/',
    partOfSpeech: 'adjective',
    definition: 'Devoted to the pursuit of pleasure; self-indulgent',
    example: 'Critics argue that modern consumer culture promotes hedonistic values over sustainability.',
    collocations: ['hedonistic lifestyle', 'hedonistic pleasure', 'hedonistic values', 'hedonistic society'],
    synonyms: ['pleasure-seeking', 'self-indulgent', 'indulgent', 'epicurean', 'luxurious'],
    antonyms: ['ascetic', 'austere', 'self-denying'],
    category: 'Academic',
    level: 'Band 8',
    tips: 'Useful in critical analysis of culture, ethics, and lifestyle discussions.',
    relatedWords: ['hedonism', 'hedonist'],
  },
  {
    id: 12,
    word: 'Implicit',
    pronunciation: '/ɪmˈplɪsɪt/',
    partOfSpeech: 'adjective',
    definition: 'Suggested or indicated indirectly rather than stated explicitly',
    example: 'The implicit message in the advertisement is that buying this product will make you happy.',
    collocations: ['implicit assumption', 'implicit meaning', 'implicit bias', 'implicit understanding'],
    synonyms: ['indirect', 'implied', 'suggested', 'inherent', 'unspoken'],
    antonyms: ['explicit', 'direct', 'stated'],
    category: 'Academic',
    level: 'Band 7',
    tips: 'Opposite of explicit. Important for analysis and interpretation.',
    relatedWords: ['implicitly', 'implicitness'],
  },
  {
    id: 13,
    word: 'Inane',
    pronunciation: '/ɪˈneɪn/',
    partOfSpeech: 'adjective',
    definition: 'Lacking sense or meaning; silly or senseless',
    example: 'The inane comments made during the serious debate only wasted everyone\'s time.',
    collocations: ['inane remark', 'inane comment', 'inane statement', 'inane behavior'],
    synonyms: ['silly', 'senseless', 'absurd', 'ridiculous', 'stupid'],
    antonyms: ['sensible', 'intelligent', 'meaningful'],
    category: 'Academic',
    level: 'Band 7',
    tips: 'Strong word for criticizing something as truly pointless.',
    relatedWords: ['inanely', 'inanity'],
  },
  {
    id: 14,
    word: 'Incongruous',
    pronunciation: '/ɪnˈkɒŋɡruəs/',
    partOfSpeech: 'adjective',
    definition: 'Not in harmony or agreement; not matching or suitable',
    example: 'The modern art installation seemed incongruous with the traditional museum setting.',
    collocations: ['incongruous element', 'incongruous behavior', 'incongruous mix', 'incongruous situation'],
    synonyms: ['incompatible', 'unsuitable', 'inconsistent', 'out of place', 'discordant'],
    antonyms: ['congruous', 'compatible', 'harmonious'],
    category: 'Academic',
    level: 'Band 8',
    tips: 'Perfect for describing things that don\'t fit or belong together.',
    relatedWords: ['incongruously', 'incongruity'],
  },
  {
    id: 15,
    word: 'Indifferent',
    pronunciation: '/ɪnˈdɪfərənt/',
    partOfSpeech: 'adjective',
    definition: 'Having no particular interest, concern, or sympathy; neutral',
    example: 'The government\'s indifferent response to environmental concerns shocked activists.',
    collocations: ['indifferent attitude', 'indifferent response', 'indifferent quality', 'indifferent performance'],
    synonyms: ['apathetic', 'disinterested', 'unconcerned', 'detached', 'neutral'],
    antonyms: ['interested', 'concerned', 'passionate'],
    category: 'Academic',
    level: 'Band 7',
    tips: 'Useful for describing lack of interest or concern in formal writing.',
    relatedWords: ['indifferently', 'indifference'],
  },

  // ========== ADVANCED VOCABULARY (Band 8) ==========
  {
    id: 16,
    word: 'Juxtapose',
    pronunciation: '/ˌdʒʌkstəˈpoʊz/',
    partOfSpeech: 'verb',
    definition: 'To place two things side by side, especially for comparison or contrast',
    example: 'The photographer juxtaposed images of nature and urban decay to highlight environmental destruction.',
    collocations: ['juxtapose with', 'juxtapose against', 'juxtapose images', 'juxtapose ideas'],
    synonyms: ['contrast', 'compare', 'place side by side', 'oppose'],
    antonyms: ['separate', 'combine', 'merge'],
    category: 'Academic',
    level: 'Band 8',
    tips: 'Excellent for academic and literary analysis when comparing contrasting elements.',
    relatedWords: ['juxtaposition', 'juxtaposed'],
  },
  {
    id: 17,
    word: 'Laconic',
    pronunciation: '/ləˈkɑːnɪk/',
    partOfSpeech: 'adjective',
    definition: 'Using very few words; brief and concise in speech or writing',
    example: 'His laconic response gave little detail, leaving the audience wanting more information.',
    collocations: ['laconic style', 'laconic comment', 'laconic response', 'laconic speaker'],
    synonyms: ['terse', 'brief', 'concise', 'succinct', 'short'],
    antonyms: ['verbose', 'loquacious', 'wordy'],
    category: 'Academic',
    level: 'Band 8',
    tips: 'Use to describe someone who speaks very little or writes concisely.',
    relatedWords: ['laconically', 'laconicism'],
  },
  {
    id: 18,
    word: 'Meager',
    pronunciation: '/ˈmiːɡər/',
    partOfSpeech: 'adjective',
    definition: 'Small in amount; not enough; scanty',
    example: 'Despite their meager resources, the organization managed to help thousands of refugees.',
    collocations: ['meager resources', 'meager income', 'meager evidence', 'meager diet'],
    synonyms: ['scanty', 'sparse', 'limited', 'inadequate', 'insufficient'],
    antonyms: ['abundant', 'plentiful', 'generous'],
    category: 'Academic',
    level: 'Band 7',
    tips: 'Good for describing insufficient or inadequate amounts.',
    relatedWords: ['meagerly', 'meagerness'],
  },
  {
    id: 19,
    word: 'Nebulous',
    pronunciation: '/ˈnɛbjələs/',
    partOfSpeech: 'adjective',
    definition: 'Not clearly defined or easily understood; vague and cloudy',
    example: 'The government\'s nebulous environmental policies failed to address specific climate concerns.',
    collocations: ['nebulous concept', 'nebulous idea', 'nebulous definition', 'nebulous strategy'],
    synonyms: ['vague', 'unclear', 'obscure', 'hazy', 'indefinite'],
    antonyms: ['clear', 'definite', 'concrete'],
    category: 'Academic',
    level: 'Band 8',
    tips: 'Perfect for criticizing vague or unclear ideas in academic work.',
    relatedWords: ['nebulously', 'nebulousness'],
  },
  {
    id: 20,
    word: 'Obstinate',
    pronunciation: '/ˈɑːbstɪnət/',
    partOfSpeech: 'adjective',
    definition: 'Firmly or stubbornly refusing to change opinion or behavior',
    example: 'The obstinate politician refused to consider alternative perspectives on the policy.',
    collocations: ['obstinate refusal', 'obstinate attitude', 'obstinate person', 'obstinate behavior'],
    synonyms: ['stubborn', 'headstrong', 'inflexible', 'unyielding', 'determined'],
    antonyms: ['flexible', 'open-minded', 'yielding'],
    category: 'Academic',
    level: 'Band 7',
    tips: 'Use to describe stubborn resistance to change or new ideas.',
    relatedWords: ['obstinately', 'obstinacy'],
  },
  {
    id: 21,
    word: 'Palpable',
    pronunciation: '/ˈpælpəbəl/',
    partOfSpeech: 'adjective',
    definition: 'Able to be touched or felt; obvious or easily perceived',
    example: 'The tension in the room was palpable as the two executives entered.',
    collocations: ['palpable tension', 'palpable fear', 'palpable relief', 'palpable effect'],
    synonyms: ['tangible', 'perceptible', 'noticeable', 'obvious', 'evident'],
    antonyms: ['imperceptible', 'subtle', 'invisible'],
    category: 'Academic',
    level: 'Band 8',
    tips: 'Excellent for describing something that can clearly be felt or perceived.',
    relatedWords: ['palpably', 'palpability'],
  },
  {
    id: 22,
    word: 'Pedestrian',
    pronunciation: '/pəˈdɛstriən/',
    partOfSpeech: 'adjective',
    definition: 'Ordinary, dull, or uninteresting; lacking imagination',
    example: 'Critics dismissed the film as pedestrian, lacking innovation or artistic merit.',
    collocations: ['pedestrian style', 'pedestrian approach', 'pedestrian thinking', 'pedestrian prose'],
    synonyms: ['ordinary', 'dull', 'commonplace', 'uninspired', 'mediocre'],
    antonyms: ['extraordinary', 'interesting', 'imaginative'],
    category: 'Academic',
    level: 'Band 8',
    tips: 'Use to describe something as boring or lacking in originality.',
    relatedWords: ['pedestrianism'],
  },
  {
    id: 23,
    word: 'Perspicacious',
    pronunciation: '/ˌpɜːrspɪˈkeɪʃəs/',
    partOfSpeech: 'adjective',
    definition: 'Having keen insight, discernment, or understanding',
    example: 'The perspicacious analyst identified market trends before they became obvious to competitors.',
    collocations: ['perspicacious observation', 'perspicacious analysis', 'perspicacious mind', 'perspicacious insight'],
    synonyms: ['insightful', 'discerning', 'perceptive', 'astute', 'sharp'],
    antonyms: ['dull', 'obtuse', 'unperceptive'],
    category: 'Academic',
    level: 'Band 8',
    tips: 'Sophisticated word for describing keen insight and sharp perception.',
    relatedWords: ['perspicacity', 'perspicaciously'],
  },
  {
    id: 24,
    word: 'Pragmatic',
    pronunciation: '/præɡˈmætɪk/',
    partOfSpeech: 'adjective',
    definition: 'Dealing with things in a practical, realistic way; concerned with practical consequences',
    example: 'The company took a pragmatic approach to cost reduction by focusing on efficiency.',
    collocations: ['pragmatic approach', 'pragmatic solution', 'pragmatic person', 'pragmatic decision'],
    synonyms: ['practical', 'realistic', 'down-to-earth', 'sensible', 'matter-of-fact'],
    antonyms: ['idealistic', 'theoretical', 'impractical'],
    category: 'Academic',
    level: 'Band 7',
    tips: 'Very useful for describing practical, realistic approaches in essays.',
    relatedWords: ['pragmatically', 'pragmatism'],
  },
  {
    id: 25,
    word: 'Quiescent',
    pronunciation: '/kwiˈɛsənt/',
    partOfSpeech: 'adjective',
    definition: 'In a state of rest or dormancy; inactive or quiet',
    example: 'The seemingly quiescent political situation exploded into revolution overnight.',
    collocations: ['quiescent period', 'quiescent state', 'quiescent volcano', 'quiescent phase'],
    synonyms: ['inactive', 'dormant', 'quiet', 'at rest', 'latent'],
    antonyms: ['active', 'turbulent', 'restless'],
    category: 'Academic',
    level: 'Band 8',
    tips: 'Used in scientific and political contexts to describe inactive or latent states.',
    relatedWords: ['quiescence', 'quiescently'],
  },
  {
    id: 26,
    word: 'Raconteur',
    pronunciation: '/ˌrækɑːnˈtɜːr/',
    partOfSpeech: 'noun',
    definition: 'A person who tells anecdotes and stories in an entertaining and skillful way',
    example: 'The famous raconteur captivated the audience with his vivid tales of adventure.',
    collocations: ['skilled raconteur', 'accomplished raconteur', 'natural raconteur', 'gifted raconteur'],
    synonyms: ['storyteller', 'narrator', 'anecdotist', 'entertainer'],
    antonyms: ['listener'],
    category: 'Advanced',
    level: 'Band 8',
    tips: 'Use when describing someone who tells stories masterfully.',
    relatedWords: ['raconteurship'],
  },
  {
    id: 27,
    word: 'Recalcitrant',
    pronunciation: '/rɪˈkælsɪtrənt/',
    partOfSpeech: 'adjective',
    definition: 'Stubbornly refusing to obey or cooperate; resistant to control',
    example: 'The recalcitrant student refused to follow school policies despite repeated warnings.',
    collocations: ['recalcitrant attitude', 'recalcitrant behavior', 'recalcitrant group', 'recalcitrant element'],
    synonyms: ['stubborn', 'defiant', 'rebellious', 'uncooperative', 'resistant'],
    antonyms: ['cooperative', 'obedient', 'compliant'],
    category: 'Academic',
    level: 'Band 8',
    tips: 'Stronger than stubborn. Use for open defiance or resistance.',
    relatedWords: ['recalcitrance', 'recalcitrantly'],
  },
  {
    id: 28,
    word: 'Sagacious',
    pronunciation: '/səˈɡeɪʃəs/',
    partOfSpeech: 'adjective',
    definition: 'Having good sound judgment and insight; wise and discerning',
    example: 'The sagacious leader made decisions that steered the company through difficult times.',
    collocations: ['sagacious advice', 'sagacious decision', 'sagacious wisdom', 'sagacious judgment'],
    synonyms: ['wise', 'insightful', 'discerning', 'perceptive', 'intelligent'],
    antonyms: ['foolish', 'unwise', 'ignorant'],
    category: 'Academic',
    level: 'Band 8',
    tips: 'Formal word for describing wisdom and good judgment.',
    relatedWords: ['sagacity', 'sagaciously'],
  },
  {
    id: 29,
    word: 'Sanguine',
    pronunciation: '/ˈsæŋɡwɪn/',
    partOfSpeech: 'adjective',
    definition: 'Optimistic and positive about the future; hopeful',
    example: 'Despite current challenges, economists remain sanguine about long-term economic growth.',
    collocations: ['sanguine outlook', 'sanguine mood', 'sanguine about', 'sanguine prediction'],
    synonyms: ['optimistic', 'hopeful', 'positive', 'confident', 'upbeat'],
    antonyms: ['pessimistic', 'negative', 'gloomy'],
    category: 'Academic',
    level: 'Band 8',
    tips: 'Use to describe optimistic attitudes or positive outlooks.',
    relatedWords: ['sanguinely', 'sanguinity'],
  },
  {
    id: 30,
    word: 'Terse',
    pronunciation: '/tɜːrs/',
    partOfSpeech: 'adjective',
    definition: 'Brief and concise, often to the point of being curt or abrupt',
    example: 'The CEO\'s terse comments at the press conference revealed his frustration.',
    collocations: ['terse reply', 'terse statement', 'terse response', 'terse manner'],
    synonyms: ['brief', 'concise', 'curt', 'short', 'laconic'],
    antonyms: ['verbose', 'lengthy', 'chatty'],
    category: 'Academic',
    level: 'Band 7',
    tips: 'Good for describing brief or abrupt communication.',
    relatedWords: ['tersely', 'terseness'],
  },
];

// ============================================================================
// VOCABULARY BUILDER COMPONENT
// ============================================================================

export function VocabularyBuilder() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [learned, setLearned] = useState(new Set());
  const [progress, setProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [showDefinition, setShowDefinition] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [reviewMode, setReviewMode] = useState(false);

  // Get unique categories and levels
  const categories = ['All', ...new Set(VOCABULARY_DATA.map(v => v.category))];
  const levels = ['All', 'Band 7', 'Band 8'];

  // Filter vocabulary
  const filteredVocab = useMemo(() => {
    return VOCABULARY_DATA.filter(vocab => {
      const matchesSearch = vocab.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           vocab.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || vocab.category === selectedCategory;
      const matchesLevel = selectedLevel === 'All' || vocab.level === selectedLevel;
      
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [searchTerm, selectedCategory, selectedLevel]);

  const current = filteredVocab[currentIndex] || VOCABULARY_DATA[0];

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredVocab.length);
    setIsFlipped(false);
    setShowDefinition(false);
  }, [filteredVocab.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + filteredVocab.length) % filteredVocab.length);
    setIsFlipped(false);
    setShowDefinition(false);
  }, [filteredVocab.length]);

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

  const handleQuizCorrect = () => {
    setQuizScore(prev => prev + 1);
    handleNext();
  };

  const getLevelColor = (level) => {
    switch(level) {
      case 'Band 7': return '#3b82f6';
      case 'Band 8': return '#a81011';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Academic': '#10b981',
      'Advanced': '#f59e0b',
      'Business': '#8b5cf6',
      'Literary': '#ec4899',
    };
    return colors[category] || '#6b7280';
  };

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
          📚 Vocabulary Builder - Band 7-8+
        </h1>
        <p style={{ color: '#475569', fontSize: '0.95rem', maxWidth: '700px' }}>
          Master advanced academic vocabulary through spaced repetition, interactive flashcards, and contextual examples. Build your IELTS vocabulary systematically.
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
            🔍 Search Vocabulary
          </label>
          <input
            type="text"
            placeholder="Search by word or definition..."
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

        {/* Filter Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '16px' }}>
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
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Level Filter */}
          <div>
            <p style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '10px',
            }}>
              Level
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {levels.map(level => (
                <button
                  key={level}
                  onClick={() => {
                    setSelectedLevel(level);
                    setCurrentIndex(0);
                  }}
                  style={{
                    padding: '8px 14px',
                    border: selectedLevel === level ? `2px solid ${getLevelColor(level)}` : '1px solid #dde3ef',
                    borderRadius: '8px',
                    background: selectedLevel === level ? `${getLevelColor(level)}15` : '#fff',
                    color: selectedLevel === level ? getLevelColor(level) : '#475569',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mode Buttons */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setQuizMode(false); setReviewMode(false); }}
            style={{
              padding: '10px 16px',
              background: !quizMode && !reviewMode ? '#a81011' : '#fff',
              color: !quizMode && !reviewMode ? '#fff' : '#475569',
              border: !quizMode && !reviewMode ? 'none' : '1px solid #dde3ef',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            📖 Study Mode
          </button>
          <button
            onClick={() => { setQuizMode(true); setReviewMode(false); setQuizScore(0); }}
            style={{
              padding: '10px 16px',
              background: quizMode ? '#a81011' : '#fff',
              color: quizMode ? '#fff' : '#475569',
              border: quizMode ? 'none' : '1px solid #dde3ef',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            ✅ Quiz Mode
          </button>
          <button
            onClick={() => { setReviewMode(!reviewMode); setQuizMode(false); }}
            style={{
              padding: '10px 16px',
              background: reviewMode ? '#a81011' : '#fff',
              color: reviewMode ? '#fff' : '#475569',
              border: reviewMode ? 'none' : '1px solid #dde3ef',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            ⭐ Review Learned
          </button>
        </div>
      </div>

      {filteredVocab.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '80px 24px',
          background: '#fff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
        }}>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '12px' }}>
            No vocabulary found matching your search
          </p>
          <p style={{ fontSize: '0.9rem', color: '#d1d5db' }}>
            Try adjusting your filters or search term
          </p>
        </div>
      ) : (
        <>
          {/* ========== PROGRESS BAR ========== */}
          <div style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>📊 Learning Progress</span>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                {learned.size} / {VOCABULARY_DATA.length} mastered
              </span>
            </div>
            <div style={{
              height: '10px',
              background: '#eef1f8',
              borderRadius: '999px',
              overflow: 'hidden',
              marginBottom: '12px',
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #0c1f4a, #a81011)',
                transition: 'width 0.6s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
              <span>0%</span>
              <span style={{ fontWeight: 700, color: '#a81011' }}>{Math.round(progress)}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* ========== MAIN FLASHCARD ========== */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            style={{
              background: '#fff',
              border: '2px solid #a81011',
              borderRadius: '16px',
              padding: '48px 40px',
              minHeight: '360px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '24px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(15,23,42,0.07)',
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
              // Front of card - Definition
              <div style={{ width: '100%' }}>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  flexWrap: 'wrap',
                }}>
                  <span style={{
                    background: `${getLevelColor(current.level)}15`,
                    color: getLevelColor(current.level),
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}>
                    {current.level}
                  </span>
                  <span style={{
                    background: `${getCategoryColor(current.category)}15`,
                    color: getCategoryColor(current.category),
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}>
                    {current.category}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '2.4rem',
                  fontWeight: 800,
                  color: '#a81011',
                  marginBottom: '12px',
                }}>
                  {current.word}
                </h3>

                <p style={{ fontSize: '1rem', color: '#0c1f4a', marginBottom: '20px', fontWeight: 500 }}>
                  {current.pronunciation}
                </p>

                <p style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#94a3b8',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  marginBottom: '16px',
                }}>
                  {current.partOfSpeech.toUpperCase()}
                </p>

                <p style={{
                  fontSize: '1.05rem',
                  color: '#0f172a',
                  lineHeight: 1.8,
                  marginBottom: '28px',
                  maxWidth: '600px',
                  margin: '0 auto 28px',
                }}>
                  {current.definition}
                </p>

                <p style={{
                  color: '#d42022',
                  fontSize: '0.8rem',
                  fontStyle: 'italic',
                }}>
                  ← Click to see example
                </p>
              </div>
            ) : (
              // Back of card - Example
              <div style={{ width: '100%' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px', fontWeight: 700, textTransform: 'uppercase' }}>
                  EXAMPLE IN CONTEXT
                </p>
                <p style={{
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  color: '#0c1f4a',
                  lineHeight: 1.8,
                  marginBottom: '32px',
                  fontStyle: 'italic',
                }}>
                  "{current.example}"
                </p>

                <div style={{
                  background: '#f4f6fb',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '20px',
                }}>
                  <p style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '8px',
                  }}>
                    Common Collocations
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {current.collocations.map((collocate, idx) => (
                      <span
                        key={idx}
                        style={{
                          background: '#fff',
                          border: '1px solid #dde3ef',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          fontSize: '0.8rem',
                          color: '#475569',
                        }}
                      >
                        {collocate}
                      </span>
                    ))}
                  </div>
                </div>

                <p style={{
                  color: '#d42022',
                  fontSize: '0.8rem',
                  fontStyle: 'italic',
                }}>
                  Click to see definition →
                </p>
              </div>
            )}
          </div>

          {/* ========== WORD INFO ========== */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {/* Synonyms */}
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
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
                      background: '#fef3f3',
                      border: '1px solid rgba(168,16,17,0.25)',
                      borderRadius: '6px',
                      padding: '5px 11px',
                      fontSize: '0.8rem',
                      color: '#7f1d1d',
                      fontWeight: 500,
                    }}
                  >
                    {syn}
                  </span>
                ))}
              </div>
            </div>

            {/* Antonyms */}
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
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
                Antonyms
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {current.antonyms.map((ant) => (
                  <span
                    key={ant}
                    style={{
                      background: '#f0f9ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '6px',
                      padding: '5px 11px',
                      fontSize: '0.8rem',
                      color: '#1e40af',
                      fontWeight: 500,
                    }}
                  >
                    {ant}
                  </span>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
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
                💡 Study Tip
              </p>
              <p style={{
                fontSize: '0.85rem',
                color: '#475569',
                lineHeight: 1.6,
              }}>
                {current.tips}
              </p>
            </div>

            {/* Related Words */}
            <div style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
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
                Related Forms
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {current.relatedWords.map((related) => (
                  <span
                    key={related}
                    style={{
                      background: '#fef3f3',
                      border: '1px solid rgba(168,16,17,0.25)',
                      borderRadius: '6px',
                      padding: '5px 11px',
                      fontSize: '0.8rem',
                      color: '#7f1d1d',
                      fontWeight: 500,
                    }}
                  >
                    {related}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ========== CONTROL BUTTONS ========== */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '28px',
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
                fontSize: '0.9rem',
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

            {quizMode ? (
              <>
                <button
                  onClick={() => handleNext()}
                  style={{
                    padding: '12px 24px',
                    background: '#ef4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 24px rgba(239,68,68,0.28)',
                    transition: 'all 0.2s',
                    fontSize: '0.9rem',
                  }}
                >
                  ✗ Incorrect
                </button>
                <button
                  onClick={handleQuizCorrect}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 24px rgba(16,185,129,0.28)',
                    transition: 'all 0.2s',
                    fontSize: '0.9rem',
                  }}
                >
                  ✓ Correct
                </button>
              </>
            ) : (
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
                  fontSize: '0.9rem',
                }}
              >
                ✓ Mark as Learned
              </button>
            )}

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
                fontSize: '0.9rem',
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

          {/* ========== STATS ========== */}
          <div style={{
            background: 'linear-gradient(135deg, #0c1f4a 0%, #1e3a7a 100%)',
            borderRadius: '16px',
            padding: '32px',
            color: '#fff',
            textAlign: 'center',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '24px',
          }}>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                Current Card
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 800 }}>
                {currentIndex + 1} / {filteredVocab.length}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                Progress
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 800 }}>
                {Math.round(progress)}%
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                Learned
              </p>
              <p style={{ fontSize: '2rem', fontWeight: 800 }}>
                {learned.size}
              </p>
            </div>
            {quizMode && (
              <div>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
                  Quiz Score
                </p>
                <p style={{ fontSize: '2rem', fontWeight: 800 }}>
                  {quizScore}
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default VocabularyBuilder;