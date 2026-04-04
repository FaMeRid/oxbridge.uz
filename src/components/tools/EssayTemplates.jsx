import React, { useState, useMemo } from 'react';
import '../../styles/globals.css';

const ESSAY_TEMPLATES = [
  // ========== TASK 1 ESSAYS (Informal Letters) ==========
  {
    id: 1,
    type: 'Task 1',
    category: 'Informal Letter',
    title: 'Letter to a Friend',
    difficulty: 'Easy',
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
      'Use contractions and casual language',
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
    type: 'Task 1',
    category: 'Informal Letter',
    title: 'Letter of Complaint',
    difficulty: 'Medium',
    structure: ['Opening', 'Problem Description', 'What went wrong', 'Request for action', 'Closing'],
    template: `Dear [Name],

I'm writing to complain about [issue/problem]. I purchased/experienced [details] on [date], and I'm extremely disappointed.

[Explain what happened and why it's problematic]

This has caused me significant inconvenience because [explain impact]. I had expected much better service, especially considering [relevant details].

I would appreciate if you could [state what you want done] as soon as possible. I look forward to hearing from you.

Yours,
[Your Name]`,
    tips: [
      'Be polite but firm',
      'Clearly state the problem',
      'Explain the impact on you',
      'Suggest a reasonable solution',
      'Use formal but friendly tone',
    ],
    band8Sample: `Dear Manager,

I'm writing to complain about my recent stay at your hotel from March 15-18. While the location was excellent, I experienced several significant issues during my visit.

Firstly, the room had a broken air conditioning unit, which made it extremely uncomfortable in the hot weather. Secondly, the promised complimentary breakfast was unavailable on two of my three nights. Finally, despite requesting extra towels multiple times, they never arrived during my entire stay.

This has significantly affected my experience and I feel entitled to compensation. I have been a loyal customer for five years, and this standard of service is far below what I expected from your establishment.

I would appreciate a partial refund of my stay or a complimentary upgrade on my next visit. I look forward to your prompt response.

Yours sincerely,
James Wilson`,
  },

  {
    id: 3,
    type: 'Task 1',
    category: 'Informal Letter',
    title: 'Letter Requesting Information',
    difficulty: 'Easy',
    structure: ['Opening', 'Information needed', 'Why you need it', 'Request for timely response', 'Closing'],
    template: `Dear [Name],

I hope you are well. I am writing to request some information about [topic].

I am currently [explain situation] and I need to know [specific information]. Could you please provide details about [specific points]?

This information is important to me because [reason]. I would be grateful if you could send this at your earliest convenience.

Thank you for your help. I look forward to hearing from you soon.

Best regards,
[Your Name]`,
    tips: [
      'Be specific about what you need',
      'Explain why you need it',
      'Keep it concise and clear',
      'Express gratitude',
      'Give a reasonable deadline',
    ],
    band8Sample: `Dear Dr. Johnson,

I hope this letter finds you well. I am writing to request information about the Master's program in Environmental Science at your university.

I am currently working as an environmental consultant and am considering pursuing further education to advance my career. I would greatly appreciate information about the program structure, entry requirements, application deadlines, and whether scholarships are available for international students like myself.

This information is crucial as I am planning to apply this year. I would be extremely grateful if you could send these details within the next two weeks, as I need to prepare my application documents.

Thank you very much for your assistance. I look forward to hearing from you soon.

Best regards,
Maria Chen`,
  },

  // ========== TASK 2 ESSAYS (Opinion Essays) ==========
  {
    id: 4,
    type: 'Task 2',
    category: 'Opinion Essay',
    title: 'Opinion Essay - Social Media',
    difficulty: 'Medium',
    structure: ['Introduction', 'Body 1 (Advantages)', 'Body 2 (Disadvantages)', 'Conclusion'],
    template: `[Introduction - state the question and your opinion clearly]

On one hand, [first advantage]. [Explanation and example]. Furthermore, [second advantage] because [reason].

On the other hand, [first disadvantage]. [Explanation and example]. Additionally, [second disadvantage] can lead to [consequence].

In conclusion, [restate your opinion]. Although [acknowledge opposing view], I believe that [your main argument] because [reason].`,
    tips: [
      'Have a clear thesis statement',
      'Use topic sentences in each paragraph',
      'Support arguments with relevant examples',
      'Maintain formal academic tone',
      'Keep within 250-300 words',
    ],
    band8Sample: `Some argue that social media has negatively impacted society, while others contend it brings substantial benefits. While social media has drawbacks, its positive contributions to communication and business outweigh the negatives.

On one hand, social media has revolutionized global communication. People can maintain relationships across continents instantly, which was previously impossible. Furthermore, social media has become a powerful platform for social movements. The #MeToo movement and climate activism demonstrate how these platforms mobilize people for positive change. Additionally, businesses leverage social media cost-effectively to reach millions of customers and build brand loyalty.

On the other hand, critics raise valid concerns about mental health issues. Research shows excessive social media use correlates with anxiety and depression, particularly among adolescents. Moreover, misinformation spreads rapidly on these platforms, influencing public opinion and democratic processes dangerously. However, these issues stem partly from poor digital literacy rather than the platforms themselves.

In conclusion, while social media presents legitimate challenges, its benefits in facilitating communication and enabling social change are substantial. Although regulation is necessary, I believe properly managed social media significantly enhances modern society because it connects humanity in unprecedented ways.`,
  },

  {
    id: 5,
    type: 'Task 2',
    category: 'Opinion Essay',
    title: 'Opinion Essay - Technology & Work',
    difficulty: 'Hard',
    structure: ['Introduction', 'Body 1', 'Body 2', 'Conclusion'],
    template: `Some people believe [positive view], whereas others argue [negative view]. I tend to agree with the former view for several reasons.

First, [reason 1 with explanation]. For instance, [specific example]. This demonstrates that [consequence].

Second, [reason 2 with explanation]. Consider [specific example]. As a result, [consequence].

However, it is true that [acknowledge counterargument]. Nevertheless, [refute the counterargument] because [reason].

In conclusion, [restate position] because [main reason]. As society progresses, [future implication].`,
    tips: [
      'Use sophisticated vocabulary',
      'Include a counterargument',
      'Use signposting phrases',
      'Provide specific, detailed examples',
      'Show balanced consideration',
    ],
    band8Sample: `Some believe that remote working arrangements will eventually replace traditional office environments, whereas others argue that physical offices remain essential. I tend to agree with the latter view, although I acknowledge that hybrid models will likely dominate.

First, face-to-face collaboration drives innovation more effectively than remote communication. Research from leading tech companies demonstrates that breakthrough ideas often emerge from spontaneous conversations and brainstorming sessions in physical spaces. For instance, Google's office design deliberately promotes colleague interactions, and this strategy directly correlates with their innovative products. This suggests that in-person environments catalyze creative thinking more effectively than digital platforms.

Second, workplace relationships and company culture suffer in fully remote settings. Building trust, mentoring junior employees, and fostering organizational loyalty require physical presence and informal interactions. Consider the onboarding experience for new employees, which proves significantly less effective remotely. As a result, employee retention rates typically decline in fully remote organizations.

However, it is true that remote work offers flexibility and work-life balance benefits that many employees value. Nevertheless, the loss of organizational cohesion ultimately undermines long-term productivity because collaboration remains fundamental to human success.

In conclusion, whilst remote work suits certain roles, I believe physical offices remain crucial because innovation and culture thrive through human interaction. As society progresses, hybrid models will likely emerge as optimal solutions balancing flexibility with collaboration.`,
  },

  {
    id: 6,
    type: 'Task 2',
    category: 'Opinion Essay',
    title: 'Opinion Essay - Education',
    difficulty: 'Medium',
    structure: ['Introduction', 'Body 1', 'Body 2', 'Conclusion'],
    template: `There is considerable debate about [issue]. While [one perspective], I firmly believe that [your position] for the following reasons.

[Reason 1]: [Explanation]. For example, [specific case/statistic]. This shows that [consequence].

[Reason 2]: [Explanation]. To illustrate, [specific example]. Consequently, [result].

Some may argue that [counterargument]. However, [refutation] because [reason].

To summarize, [restate main argument] because [key reasons]. I am convinced that [conclusion].`,
    tips: [
      'Address the counterargument',
      'Use transitional phrases',
      'Include specific examples',
      'Show cause and effect',
      'Use parallel structures',
    ],
    band8Sample: `There is considerable debate about whether universities should prioritize practical skills training or theoretical knowledge. While some argue for skill-based education, I firmly believe that universities should maintain strong emphasis on theoretical understanding for the following reasons.

Theoretical knowledge provides the foundation for lifelong learning: Rapidly changing job markets require adaptability, which theoretical understanding enables better than narrow skill training. For example, engineers with strong theoretical physics backgrounds easily transition into emerging technologies like renewable energy. This demonstrates that foundational knowledge creates versatile professionals who adapt to future industries.

Critical thinking and problem-solving stem from deep theoretical understanding: Practical skills have limited applications, whereas analytical thinking transcends disciplines. To illustrate, computer scientists with strong mathematics backgrounds innovate more effectively than those trained solely in programming syntax. Consequently, employers increasingly value graduates with solid theoretical foundations.

Some may argue that universities should directly prepare students for employment. However, employers themselves often state they prefer hiring graduates who think critically because they can be trained in specific skills quickly. Moreover, professional skills evolve rapidly, while foundational theory remains relevant throughout careers.

To summarize, universities should prioritize theoretical knowledge because it develops adaptable, innovative professionals capable of navigating unpredictable futures. I am convinced that balancing theory with practical experience creates the most valuable graduates.`,
  },

  // ========== TASK 2 ESSAYS (Two-sided Arguments) ==========
  {
    id: 7,
    type: 'Task 2',
    category: 'Two-sided Argument',
    title: 'Discuss Both Views',
    difficulty: 'Hard',
    structure: ['Introduction', 'View 1 + examples', 'View 2 + examples', 'Conclusion'],
    template: `There are two contrasting views regarding [issue]. While some people believe [view A], others argue that [view B]. Both perspectives have merits worth considering.

Those who support [view A] contend that [reason 1]. They argue that [reason 2]. For instance, [specific example]. This perspective suggests that [implication].

Conversely, those who believe [view B] maintain that [reason 1]. They point out that [reason 2]. For example, [specific example]. This viewpoint highlights that [implication].

While both views have validity, I believe [your position] because [reason]. In conclusion, [summary of both views] and society must consider [balanced perspective].`,
    tips: [
      'Present both views fairly',
      'Use balanced language',
      'Support each view with examples',
      'Show understanding of complexity',
      'Conclude with a balanced stance',
    ],
    band8Sample: `There are two contrasting perspectives regarding whether governments should prioritize environmental protection over economic development. While some believe environmental protection is paramount, others argue economic development is more pressing. Both perspectives merit serious consideration.

Those supporting environmental prioritization contend that planetary damage is irreversible and threatens human survival. They argue that climate change and biodiversity loss demand immediate drastic action. For instance, the 2023 climate crisis resulted in unprecedented natural disasters costing economies trillions in damages. This perspective suggests that preventing environmental catastrophe is ultimately more economically sound than short-term development.

Conversely, those prioritizing economic development maintain that growth alleviates poverty and improves living standards for billions. They point out that developed nations historically prioritized growth before addressing environmental concerns. For example, Asian economies have lifted hundreds of millions from poverty through industrialization. This viewpoint highlights that economic strength enables investment in environmental solutions.

While both views contain validity, I believe balanced integration is essential because neither absolute prioritization works. Sustainable development models demonstrate that economic growth and environmental protection are complementary, not contradictory. In conclusion, both environmental protection and economic development matter critically, and modern societies must pursue progress that serves both simultaneously through innovative, sustainable approaches.`,
  },

  // ========== TASK 2 ESSAYS (Problem-Solution) ==========
  {
    id: 8,
    type: 'Task 2',
    category: 'Problem-Solution',
    title: 'Problem and Solution',
    difficulty: 'Medium',
    structure: ['Introduction', 'Problem explanation', 'Solutions', 'Conclusion'],
    template: `[Problem statement]. This is a serious issue that requires immediate attention.

The main causes of [problem] are [reason 1] and [reason 2]. Consequently, [negative effects]. For example, [specific case]. This demonstrates that [impact].

Several solutions can address this problem effectively. First, [solution 1] would [benefit]. For instance, [specific example]. Second, [solution 2] could [benefit]. To illustrate, [specific case].

In conclusion, while [problem] is challenging, implementing [solutions] can significantly improve the situation. If [action], [positive result].`,
    tips: [
      'Clearly identify the problem',
      'Explain causes and effects',
      'Propose realistic solutions',
      'Show how solutions address causes',
      'Be specific with examples',
    ],
    band8Sample: `Urban traffic congestion is increasingly prevalent in major cities worldwide, causing significant economic losses and environmental damage. This problem requires comprehensive solutions combining multiple approaches.

The primary causes of traffic congestion are inadequate public transportation infrastructure and excessive private vehicle use. Consequently, commuting times have tripled in major cities over two decades. For example, Bangkok residents spend approximately 44 hours annually stuck in traffic. This demonstrates that congestion devastates productivity and increases pollution substantially.

Several solutions can effectively address this critical problem. First, governments should invest heavily in public transportation systems including metros, trains, and bus networks. For instance, Singapore's comprehensive public transport system reduced private vehicle use by 25% within a decade. Second, city planners should implement congestion pricing, charging drivers for entering city centers during peak hours. To illustrate, London's congestion charge reduced traffic by 21% while funding sustainable transportation improvements.

In conclusion, while urban traffic congestion challenges modern cities, implementing integrated public transportation systems and congestion pricing can significantly improve conditions. If governments prioritize sustainable mobility infrastructure, cities will experience improved air quality, reduced commuting stress, and enhanced economic productivity.`,
  },

  // ========== TASK 2 ESSAYS (Advantages-Disadvantages) ==========
  {
    id: 9,
    type: 'Task 2',
    category: 'Advantages-Disadvantages',
    title: 'Advantages and Disadvantages',
    difficulty: 'Medium',
    structure: ['Introduction', 'Advantages', 'Disadvantages', 'Conclusion'],
    template: `[Topic] has become increasingly common. While this trend offers certain advantages, it also presents significant disadvantages.

The primary advantages are [advantage 1] and [advantage 2]. For instance, [example 1]. Additionally, [benefit]. For example, [example 2].

However, the disadvantages are equally important to consider. First, [disadvantage 1] because [reason]. Second, [disadvantage 2] can lead to [negative result]. To illustrate, [specific case].

In conclusion, although [topic] has benefits, the disadvantages outweigh the advantages because [reason]. Therefore, [recommendation or balanced conclusion].`,
    tips: [
      'List 2+ advantages clearly',
      'List 2+ disadvantages clearly',
      'Support with specific examples',
      'Decide whether advantages or disadvantages outweigh',
      'Be clear in conclusion',
    ],
    band8Sample: `Online shopping has transformed consumer behavior dramatically. While this trend offers undeniable conveniences, the disadvantages ultimately outweigh the benefits.

The primary advantages are substantial. First, online shopping provides unmatched convenience, allowing purchases anytime from anywhere. Additionally, consumers access incomparably wider product selections and can compare prices instantly across hundreds of retailers. For instance, searching for specialized equipment that might take weeks in physical stores takes minutes online. Furthermore, online retailers typically offer faster delivery and easier return processes.

However, the disadvantages are equally significant. First, excessive online shopping contributes to environmental degradation through increased packaging waste and carbon emissions from shipping. Second, the sector encourages overconsumption and impulse buying, creating financial strain for vulnerable consumers. To illustrate, studies show online shoppers spend 40% more annually than traditional shoppers. Moreover, the rise of online retail has devastated traditional retail, causing widespread unemployment in communities dependent on shopping districts.

In conclusion, although online shopping offers convenience and selection, the environmental damage, consumer debt increases, and job losses outweigh these benefits. Therefore, consumers should balance online and traditional shopping while governments should implement sustainability regulations for e-commerce companies to minimize negative consequences.`,
  },

  // ========== Additional TASK 1 variations ==========
  {
    id: 10,
    type: 'Task 1',
    category: 'Informal Letter',
    title: 'Letter Accepting/Declining Invitation',
    difficulty: 'Easy',
    structure: ['Opening', 'Your response', 'Reasoning', 'Closing'],
    template: `Dear [Name],

Thank you so much for inviting me to [event]. I'm honored that you thought of me.

I'm delighted to accept/I regret that I must decline your invitation because [reason]. [Explanation of circumstances].

[Additional sentence about your excitement/disappointment]. I hope we can [alternative suggestion].

I look forward to seeing you soon/to catching up soon.

Best wishes,
[Your Name]`,
    tips: [
      'Respond promptly',
      'Express gratitude',
      'Provide clear reasons',
      'Suggest alternative if declining',
      'Keep warm and friendly tone',
    ],
    band8Sample: `Dear Marcus,

Thank you so much for inviting me to your birthday celebration next month. I'm truly honored that you thought of me, especially given how busy you've been lately.

I'm delighted to accept your invitation! I've been looking forward to catching up with everyone, and this sounds like it will be a fantastic celebration. However, I wanted to check whether you need me to bring anything or contribute towards the party expenses.

I'll be bringing a bottle of your favorite wine and perhaps some dessert. I can't wait to celebrate this milestone with you and reminisce about old times with the group.

I look forward to seeing you and everyone else then. It'll be wonderful!

Best wishes,
Catherine`,
  },

  {
    id: 11,
    type: 'Task 2',
    category: 'Cause and Effect',
    title: 'Causes and Effects Essay',
    difficulty: 'Hard',
    structure: ['Introduction', 'Causes', 'Effects', 'Conclusion'],
    template: `[Issue] has become a significant concern in modern society. Understanding its causes and effects is essential for addressing this problem comprehensively.

The primary causes of [issue] include [cause 1], [cause 2], and [cause 3]. First, [explanation of cause 1]. For instance, [specific example]. Second, [explanation of cause 2]. To illustrate, [specific case].

These causes produce serious effects on [audience/society]. The most significant effect is [effect 1], which leads to [consequence]. Additionally, [effect 2] results in [negative impact]. For example, [specific case].

In conclusion, addressing [issue] requires understanding both its causes and effects. If [action], then [potential improvement].`,
    tips: [
      'Clearly identify 2-3 causes',
      'Explain the link between causes and effects',
      'Use causative language',
      'Include specific examples',
      'Show logical progression',
    ],
    band8Sample: `Youth unemployment has become a significant concern in developed nations. Understanding its causes and effects is essential for developing effective solutions.

The primary causes of youth unemployment include insufficient practical skills, technological displacement, and economic inequality. First, educational systems often emphasize theoretical knowledge over practical skills employers demand. For instance, graduates lack experience in digital tools that companies require. Second, automation increasingly replaces entry-level jobs traditionally filled by young workers. To illustrate, manufacturing sectors have eliminated thousands of junior positions through mechanization.

These causes produce serious effects on both individuals and society. The most significant effect is delayed financial independence, preventing young people from achieving life milestones like homeownership. Additionally, prolonged unemployment leads to mental health issues including depression and anxiety. For example, studies from Europe show youth unemployment correlates directly with increased suicide rates among the 15-25 age group.

In conclusion, addressing youth unemployment requires understanding both its causes and effects. If governments invested in vocational training programs and created incentives for businesses hiring young people, then youth employment rates would improve significantly, benefiting society economically and socially.`,
  },
];

export function EssayTemplates() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSample, setShowSample] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get unique categories and difficulties
  const categories = ['All', ...new Set(ESSAY_TEMPLATES.map(e => e.category))];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return ESSAY_TEMPLATES.filter(essay => {
      const matchesSearch = essay.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           essay.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || essay.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || essay.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  const current = filteredTemplates[currentIndex] || ESSAY_TEMPLATES[0];

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy': return '#10b981';
      case 'Medium': return '#f59e0b';
      case 'Hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleTemplateSelect = (index) => {
    setCurrentIndex(index);
    setShowSample(false);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '2.2rem',
          fontWeight: 800,
          color: '#0c1f4a',
          marginBottom: '12px',
        }}>
          ✍️ Essay Templates & Samples
        </h1>
        <p style={{ color: '#475569', fontSize: '0.95rem', maxWidth: '600px' }}>
          Master IELTS Writing Task 1 & 2 with our comprehensive templates, proven structures, and Band 8+ sample essays. Learn from real examples and apply them to your practice.
        </p>
      </div>

      {/* Filters Section */}
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '32px',
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'block',
            marginBottom: '8px',
          }}>
            🔍 Search Templates
          </label>
          <input
            type="text"
            placeholder="Search by title, type, or category..."
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
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
                    padding: '8px 16px',
                    border: selectedCategory === cat ? '2px solid #a81011' : '1px solid #dde3ef',
                    borderRadius: '8px',
                    background: selectedCategory === cat ? '#fff0f0' : '#fff',
                    color: selectedCategory === cat ? '#a81011' : '#475569',
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
                    padding: '8px 16px',
                    border: selectedDifficulty === diff ? `2px solid ${getDifficultyColor(diff)}` : '1px solid #dde3ef',
                    borderRadius: '8px',
                    background: selectedDifficulty === diff ? `${getDifficultyColor(diff)}15` : '#fff',
                    color: selectedDifficulty === diff ? getDifficultyColor(diff) : '#475569',
                    fontWeight: 600,
                    fontSize: '0.85rem',
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
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '10px',
        marginBottom: '28px',
      }}>
        {filteredTemplates.map((essay, idx) => (
          <button
            key={essay.id}
            onClick={() => handleTemplateSelect(idx)}
            style={{
              padding: '12px 14px',
              border: currentIndex === idx ? '2px solid #a81011' : '1px solid #dde3ef',
              borderRadius: '10px',
              background: currentIndex === idx ? '#fff0f0' : '#fff',
              color: currentIndex === idx ? '#a81011' : '#475569',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontSize: '0.85rem',
              textAlign: 'left',
            }}
            title={essay.title}
          >
            <div style={{ fontWeight: 700, marginBottom: '2px' }}>{essay.type}</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{essay.category}</div>
          </button>
        ))}
      </div>

      {filteredTemplates.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 24px',
          background: '#fff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
        }}>
          <p style={{ fontSize: '1.1rem', color: '#94a3b8' }}>
            No templates found matching your filters. Try adjusting your search.
          </p>
        </div>
      ) : (
        <>
          {/* Main Template Display */}
          <div style={{
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '28px',
          }}>
            {/* Header Info */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '24px',
            }}>
              <div>
                <h2 style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  color: '#0c1f4a',
                  marginBottom: '8px',
                }}>
                  {current.title}
                </h2>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{
                    background: '#f4f6fb',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#0c1f4a',
                  }}>
                    {current.type}
                  </span>
                  <span style={{
                    background: `${getDifficultyColor(current.difficulty)}15`,
                    color: getDifficultyColor(current.difficulty),
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}>
                    {current.difficulty}
                  </span>
                  <span style={{
                    background: '#f4f6fb',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#0c1f4a',
                  }}>
                    {current.category}
                  </span>
                </div>
              </div>
            </div>

            {/* Structure */}
            <div style={{ marginBottom: '28px' }}>
              <p style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
              }}>
                📋 Essay Structure
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px',
              }}>
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
                    <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{idx + 1}️⃣</div>
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
              marginBottom: '28px',
            }}>
              <p style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '12px',
              }}>
                📝 Template
              </p>
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
                marginBottom: '14px',
              }}>
                💡 Key Tips for Success
              </p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '12px',
              }}>
                {current.tips.map((tip, idx) => (
                  <li
                    key={idx}
                    style={{
                      padding: '12px 16px',
                      background: '#fef3f3',
                      border: '1px solid rgba(168,16,17,0.25)',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      color: '#7f1d1d',
                      lineHeight: 1.6,
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
                fontSize: '1rem',
                cursor: 'pointer',
                marginBottom: showSample ? '20px' : 0,
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => e.target.style.background = '#7a0b0c'}
              onMouseOut={(e) => e.target.style.background = '#a81011'}
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
                  ⭐ Real Band 8 Sample
                </p>
                <p style={{
                  color: '#7f1d1d',
                  lineHeight: 1.9,
                  fontSize: '0.98rem',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {current.band8Sample}
                </p>
                <div style={{
                  marginTop: '20px',
                  padding: '16px',
                  background: 'rgba(255,255,255,0.5)',
                  borderRadius: '8px',
                  borderLeft: '3px solid #a81011',
                }}>
                  <p style={{
                    fontSize: '0.85rem',
                    color: '#7f1d1d',
                    margin: 0,
                  }}>
                    <strong>Why is this Band 8?</strong> This essay demonstrates excellent vocabulary, varied sentence structures, clear organization, and sophisticated arguments with specific examples. The writer maintains formal tone while addressing the question directly and comprehensively.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div style={{
            textAlign: 'center',
            marginTop: '32px',
            padding: '16px',
            background: '#f4f6fb',
            borderRadius: '10px',
            fontSize: '0.9rem',
            color: '#475569',
          }}>
            Showing {currentIndex + 1} of {filteredTemplates.length} templates
          </div>
        </>
      )}
    </div>
  );
}

export default EssayTemplates;