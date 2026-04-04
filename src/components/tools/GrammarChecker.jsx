import React, { useState, useMemo, useEffect } from 'react';
import '../../styles/globals.css';

// ============================================================================
// COMPREHENSIVE GRAMMAR RULES WITH MULTIPLE PRACTICE EXERCISES
// ============================================================================

const GRAMMAR_RULES = [
  // ========== BEGINNER LEVEL ==========
  {
    id: 1,
    rule: 'Subject-Verb Agreement',
    category: 'Sentence Structure',
    error: 'The team are playing well.',
    correct: 'The team is playing well.',
    explanation: 'Collective nouns like "team," "group," "family," and "class" are singular and take a singular verb.',
    tips: 'Treat collective nouns as single units. Example: "The committee has decided" (not "have decided").',
    examples: [
      'The jury is still deliberating.',
      'My family loves camping.',
      'The staff has been working overtime.',
    ],
    difficulty: 'Beginner',
    level: 'beginner',
    commonMistakes: ['The audience are waiting', 'The government have announced', 'The team have won'],
    icon: '👥',
    practiceExercises: [
      { error: 'The group are working together.', correct: 'The group is working together.' },
      { error: 'The committee have made their decision.', correct: 'The committee has made its decision.' },
      { error: 'The choir are singing beautifully.', correct: 'The choir is singing beautifully.' },
      { error: 'The audience are enjoying the show.', correct: 'The audience is enjoying the show.' },
      { error: 'Our team are winning the championship.', correct: 'Our team is winning the championship.' },
      { error: 'The jury have reached a verdict.', correct: 'The jury has reached a verdict.' },
      { error: 'The class are ready for the exam.', correct: 'The class is ready for the exam.' },
      { error: 'The company are expanding globally.', correct: 'The company is expanding globally.' },
      { error: 'The band are recording a new album.', correct: 'The band is recording a new album.' },
      { error: 'The government are proposing new laws.', correct: 'The government is proposing new laws.' },
    ],
  },

  {
    id: 2,
    rule: 'Article Usage (A, An, The)',
    category: 'Articles',
    error: 'I went to university yesterday.',
    correct: 'I went to the university yesterday.',
    explanation: 'Use "the" when referring to a specific place. Use "a" before consonant sounds and "an" before vowel sounds.',
    tips: 'Use "the" for specific things, "a/an" for general things.',
    examples: [
      'I need a pen. (general)',
      'I need the pen you lent me. (specific)',
      'She is an engineer.',
      'He is a doctor.',
    ],
    difficulty: 'Beginner',
    level: 'beginner',
    commonMistakes: ['I went to the shop', 'She went to school', 'I saw the movie'],
    icon: '🔤',
    practiceExercises: [
      { error: 'He works at the hospital as a nurse.', correct: 'He works at a hospital as a nurse.' },
      { error: 'I saw an excellent movie yesterday.', correct: 'I saw an excellent movie yesterday.' },
      { error: 'She is a honest person.', correct: 'She is an honest person.' },
      { error: 'I need a umbrella.', correct: 'I need an umbrella.' },
      { error: 'The book on the shelf is mine.', correct: 'The book on the shelf is mine.' },
      { error: 'He is a engineer.', correct: 'He is an engineer.' },
      { error: 'I visited a museum last week.', correct: 'I visited a museum last week.' },
      { error: 'She is the best student in the class.', correct: 'She is the best student in the class.' },
      { error: 'I have a apple.', correct: 'I have an apple.' },
      { error: 'He went to the bank this morning.', correct: 'He went to the bank this morning.' },
    ],
  },

  {
    id: 3,
    rule: 'Plural Forms',
    category: 'Nouns',
    error: 'She has three childs and two mouses.',
    correct: 'She has three children and two mice.',
    explanation: 'Some nouns have irregular plural forms.',
    tips: 'Memorize irregular plurals as you encounter them.',
    examples: [
      'One man, two men',
      'One woman, two women',
      'One fish, two fish',
      'One box, two boxes',
    ],
    difficulty: 'Beginner',
    level: 'beginner',
    commonMistakes: ['mans', 'womans', 'deers', 'sheeps', 'tooths'],
    icon: '🔢',
    practiceExercises: [
      { error: 'I saw three oxen in the field.', correct: 'I saw three oxen in the field.' },
      { error: 'The mans are playing football.', correct: 'The men are playing football.' },
      { error: 'Those womans work here.', correct: 'Those women work here.' },
      { error: 'I have two footsies.', correct: 'I have two feet.' },
      { error: 'The sheeps are grazing.', correct: 'The sheep are grazing.' },
      { error: 'I lost two tooths.', correct: 'I lost two teeth.' },
      { error: 'The gooses flew south.', correct: 'The geese flew south.' },
      { error: 'I caught three fishs.', correct: 'I caught three fish.' },
      { error: 'The deers ran away.', correct: 'The deer ran away.' },
      { error: 'The mouses are in the kitchen.', correct: 'The mice are in the kitchen.' },
    ],
  },

  {
    id: 4,
    rule: 'Present Simple Tense Formation',
    category: 'Verb Tenses',
    error: 'He go to school every day.',
    correct: 'He goes to school every day.',
    explanation: 'In present simple, add "-s" or "-es" to the verb when the subject is third person singular.',
    tips: 'I/you/we/they + base verb; he/she/it + verb+s.',
    examples: [
      'She watches television.',
      'The cat sleeps on the sofa.',
      'It rains frequently.',
      'He does his homework.',
    ],
    difficulty: 'Beginner',
    level: 'beginner',
    commonMistakes: ['He watch', 'She go', 'It rain', 'He do'],
    icon: '⏰',
    practiceExercises: [
      { error: 'She watch movies every night.', correct: 'She watches movies every night.' },
      { error: 'He go to work at 8 AM.', correct: 'He goes to work at 8 AM.' },
      { error: 'The dog run in the park.', correct: 'The dog runs in the park.' },
      { error: 'She study hard for exams.', correct: 'She studies hard for exams.' },
      { error: 'It rain a lot in winter.', correct: 'It rains a lot in winter.' },
      { error: 'He do his homework every day.', correct: 'He does his homework every day.' },
      { error: 'The cat sleep on the bed.', correct: 'The cat sleeps on the bed.' },
      { error: 'She play tennis on Sundays.', correct: 'She plays tennis on Sundays.' },
      { error: 'He fix cars in his garage.', correct: 'He fixes cars in his garage.' },
      { error: 'It happen every year.', correct: 'It happens every year.' },
    ],
  },

  {
    id: 5,
    rule: 'Pronoun-Antecedent Agreement',
    category: 'Pronouns',
    error: 'Each student should submit their homework.',
    correct: 'Each student should submit his or her homework.',
    explanation: 'Pronouns must agree with their antecedents in number and gender.',
    tips: 'Indefinite pronouns are singular and require singular pronouns.',
    examples: [
      'Everyone has their own opinion.',
      'Neither of the boys has his phone.',
      'Each team member completed their task.',
    ],
    difficulty: 'Beginner',
    level: 'beginner',
    commonMistakes: ['Each person have their books', 'Everyone are here'],
    icon: '🎯',
    practiceExercises: [
      { error: 'Each student must bring their own lunch.', correct: 'Each student must bring his or her own lunch.' },
      { error: 'Everyone should complete their assignments.', correct: 'Everyone should complete his or her assignments.' },
      { error: 'Neither of the girls forgot their backpack.', correct: 'Neither of the girls forgot her backpack.' },
      { error: 'Every person has their own dreams.', correct: 'Every person has his or her own dreams.' },
      { error: 'Anyone can come if they want.', correct: 'Anyone can come if he or she wants.' },
      { error: 'Each team brought their supplies.', correct: 'Each team brought its supplies.' },
      { error: 'Nobody should lose their temper.', correct: 'Nobody should lose his or her temper.' },
      { error: 'Either child can choose their prize.', correct: 'Either child can choose his or her prize.' },
      { error: 'Every dog should have their shots.', correct: 'Every dog should have its shots.' },
      { error: 'Someone left their umbrella here.', correct: 'Someone left his or her umbrella here.' },
    ],
  },

  // ========== INTERMEDIATE LEVEL ==========
  {
    id: 6,
    rule: 'Tense Consistency',
    category: 'Verb Tenses',
    error: 'She was walking to school and sees her friend.',
    correct: 'She was walking to school and saw her friend.',
    explanation: 'Maintain the same tense throughout a sentence when describing simultaneous events.',
    tips: 'Plan your timeline: past, present, or future. Avoid mixing tenses.',
    examples: [
      'She opened the door and looked outside.',
      'I am reading the book and enjoying it.',
      'She studied and understands the material now.',
    ],
    difficulty: 'Intermediate',
    level: 'intermediate',
    commonMistakes: ['He walked in and sits down', 'They were playing and laugh'],
    icon: '⌚',
    practiceExercises: [
      { error: 'He opened the door and enters the room.', correct: 'He opened the door and entered the room.' },
      { error: 'She writes the letter and mails it.', correct: 'She wrote the letter and mailed it.' },
      { error: 'They were eating dinner and watch TV.', correct: 'They were eating dinner and watching TV.' },
      { error: 'I went to the store and bought groceries.', correct: 'I went to the store and bought groceries.' },
      { error: 'She is studying hard and hopes to pass.', correct: 'She is studying hard and hopes to pass.' },
      { error: 'He was late to work and miss the meeting.', correct: 'He was late to work and missed the meeting.' },
      { error: 'They run in the park and play games.', correct: 'They ran in the park and played games.' },
      { error: 'I am cooking dinner and set the table.', correct: 'I am cooking dinner and setting the table.' },
      { error: 'She washed the car and wax it.', correct: 'She washed the car and waxed it.' },
      { error: 'He takes a walk and sees a dog.', correct: 'He took a walk and saw a dog.' },
    ],
  },

  {
    id: 7,
    rule: 'Parallel Structure',
    category: 'Sentence Structure',
    error: 'She likes reading, writing, and to paint.',
    correct: 'She likes reading, writing, and painting.',
    explanation: 'Use the same grammatical form for all items in a list.',
    tips: 'When listing, keep structures consistent.',
    examples: [
      'He enjoys running, swimming, and biking.',
      'The job requires organization, efficiency, and creativity.',
      'She can dance, sing, and draw.',
    ],
    difficulty: 'Intermediate',
    level: 'intermediate',
    commonMistakes: ['Reading books, playing games, and to watch movies'],
    icon: '📝',
    practiceExercises: [
      { error: 'She enjoys swimming, dancing, and to run.', correct: 'She enjoys swimming, dancing, and running.' },
      { error: 'He likes coffee, tea, and drinking water.', correct: 'He likes coffee, tea, and water.' },
      { error: 'The team focuses on speed, accuracy, and to win.', correct: 'The team focuses on speed, accuracy, and winning.' },
      { error: 'I can cook, clean, and doing laundry.', correct: 'I can cook, clean, and do laundry.' },
      { error: 'He enjoys reading, writing, and to travel.', correct: 'He enjoys reading, writing, and traveling.' },
      { error: 'The school values education, respect, and being honest.', correct: 'The school values education, respect, and honesty.' },
      { error: 'She wants to paint, sculpt, and to create.', correct: 'She wants to paint, sculpt, and create.' },
      { error: 'They studied math, science, and to learn history.', correct: 'They studied math, science, and history.' },
      { error: 'He is tall, smart, and have dark hair.', correct: 'He is tall, smart, and has dark hair.' },
      { error: 'The recipe requires flour, sugar, and to add eggs.', correct: 'The recipe requires flour, sugar, and eggs.' },
    ],
  },

  {
    id: 8,
    rule: 'Dangling Modifiers',
    category: 'Modifiers',
    error: 'While walking to the store, the rain started.',
    correct: 'While I was walking to the store, the rain started.',
    explanation: 'A dangling modifier doesn\'t clearly refer to the word it\'s supposed to modify.',
    tips: 'Make sure the introductory phrase refers to the subject of the main clause.',
    examples: [
      'As I ran quickly, the door hit me.',
      'After we finished dinner, the movie started.',
      'Having finished dinner, we watched the movie.',
    ],
    difficulty: 'Intermediate',
    level: 'intermediate',
    commonMistakes: ['Sleeping late, my breakfast was missed'],
    icon: '🎪',
    practiceExercises: [
      { error: 'Driving to school, the car broke down.', correct: 'While driving to school, my car broke down.' },
      { error: 'Looking at the map, the city seemed small.', correct: 'Looking at the map, I thought the city seemed small.' },
      { error: 'Running to catch the bus, my shoe fell off.', correct: 'Running to catch the bus, I lost my shoe.' },
      { error: 'Preparing for the exam, the material was difficult.', correct: 'As I prepared for the exam, the material seemed difficult.' },
      { error: 'Eating lunch, my phone rang.', correct: 'While eating lunch, my phone rang.' },
      { error: 'Walking in the park, the trees were beautiful.', correct: 'Walking in the park, I noticed the beautiful trees.' },
      { error: 'Finishing the project, the deadline was tomorrow.', correct: 'After finishing the project, I realized the deadline was tomorrow.' },
      { error: 'Speaking to the audience, the presentation was nervous.', correct: 'Speaking to the audience, I was nervous about the presentation.' },
      { error: 'Flying over the ocean, the clouds were magnificent.', correct: 'Flying over the ocean, I saw magnificent clouds.' },
      { error: 'Reviewing the notes, the concepts became clear.', correct: 'Reviewing the notes, I understood the concepts.' },
    ],
  },

  {
    id: 9,
    rule: 'Misplaced Modifiers',
    category: 'Modifiers',
    error: 'I saw the dog playing in the park with a smile on my face.',
    correct: 'With a smile on my face, I saw the dog playing in the park.',
    explanation: 'Place modifiers close to the word they describe to avoid confusion.',
    tips: 'Keep descriptive phrases near the noun they modify.',
    examples: [
      'I have only two dollars.',
      'She ate nearly the entire cake.',
      'In the classroom, the teacher explained the theory.',
    ],
    difficulty: 'Intermediate',
    level: 'intermediate',
    commonMistakes: ['The scientist observed the rats running quickly under a microscope'],
    icon: '🔭',
    practiceExercises: [
      { error: 'I only have ten dollars.', correct: 'I have only ten dollars.' },
      { error: 'She nearly ate the entire pizza.', correct: 'She ate nearly the entire pizza.' },
      { error: 'The man saw the accident driving down the street.', correct: 'Driving down the street, the man saw the accident.' },
      { error: 'I found the keys looking under the couch.', correct: 'Looking under the couch, I found the keys.' },
      { error: 'The teacher explained the concept to the class clearly.', correct: 'The teacher clearly explained the concept to the class.' },
      { error: 'We noticed the bird watching from the window.', correct: 'Watching from the window, we noticed the bird.' },
      { error: 'He ate the sandwich sitting on the bench.', correct: 'Sitting on the bench, he ate the sandwich.' },
      { error: 'The scientist observed the cells using a microscope.', correct: 'Using a microscope, the scientist observed the cells.' },
      { error: 'I saw the movie sitting in the theater yesterday.', correct: 'Sitting in the theater yesterday, I saw the movie.' },
      { error: 'She found the book searching through the library.', correct: 'Searching through the library, she found the book.' },
    ],
  },

  {
    id: 10,
    rule: 'Fragment vs. Run-on Sentences',
    category: 'Sentence Structure',
    error: 'Fragment: Because she was late. Run-on: She was late the meeting started without her.',
    correct: 'Because she was late, she missed the meeting. / She was late, so the meeting started without her.',
    explanation: 'Fragments are incomplete thoughts. Run-ons join clauses without proper punctuation.',
    tips: 'Fragments: add a main clause. Run-ons: add punctuation or conjunctions.',
    difficulty: 'Intermediate',
    level: 'intermediate',
    commonMistakes: ['Although she studied hard', 'I love reading books it is my favorite hobby'],
    icon: '🔗',
    practiceExercises: [
      { error: 'Although it was raining.', correct: 'Although it was raining, we went outside.' },
      { error: 'I went to the store I bought milk.', correct: 'I went to the store and bought milk.' },
      { error: 'Because the weather was nice.', correct: 'Because the weather was nice, we played outside.' },
      { error: 'She was tired she took a nap.', correct: 'She was tired, so she took a nap.' },
      { error: 'While watching the movie.', correct: 'While watching the movie, I fell asleep.' },
      { error: 'He studied hard he passed the test.', correct: 'He studied hard, and he passed the test.' },
      { error: 'Since it was late.', correct: 'Since it was late, we decided to go home.' },
      { error: 'The dog was hungry it ate its food.', correct: 'The dog was hungry, so it ate its food.' },
      { error: 'Running through the park.', correct: 'Running through the park, I saw my friends.' },
      { error: 'I like coffee I drink it every morning.', correct: 'I like coffee, and I drink it every morning.' },
    ],
  },

  {
    id: 11,
    rule: 'Conditional Sentences (If Clauses)',
    category: 'Verb Tenses',
    error: 'If I will have time, I will go to the movie.',
    correct: 'If I have time, I will go to the movie.',
    explanation: 'In first conditional, use present tense in the "if" clause, not future.',
    tips: 'First: If + present, will + verb. Second: If + past, would + verb.',
    examples: [
      'If you study hard, you will pass.',
      'If I were rich, I would travel.',
      'If I had studied, I would have passed.',
    ],
    difficulty: 'Intermediate',
    level: 'intermediate',
    commonMistakes: ['If I will go', 'If you would come'],
    icon: '❓',
    practiceExercises: [
      { error: 'If you will come, we will have fun.', correct: 'If you come, we will have fun.' },
      { error: 'If I will finish early, I will call you.', correct: 'If I finish early, I will call you.' },
      { error: 'If he will study, he will pass.', correct: 'If he studies, he will pass.' },
      { error: 'If she will arrive on time, we can start.', correct: 'If she arrives on time, we can start.' },
      { error: 'If it will rain, we will cancel the picnic.', correct: 'If it rains, we will cancel the picnic.' },
      { error: 'If we will work together, we will succeed.', correct: 'If we work together, we will succeed.' },
      { error: 'If they will come, I will be happy.', correct: 'If they come, I will be happy.' },
      { error: 'If you will practice, you will improve.', correct: 'If you practice, you will improve.' },
      { error: 'If I will have money, I will travel.', correct: 'If I have money, I will travel.' },
      { error: 'If she will ask, I will help.', correct: 'If she asks, I will help.' },
    ],
  },

  {
    id: 12,
    rule: 'Apostrophe Usage',
    category: 'Punctuation',
    error: 'The book\'s is on the table. Its a beautiful day.',
    correct: 'The books are on the table. It\'s a beautiful day.',
    explanation: 'Apostrophes show possession or create contractions.',
    tips: 'Possession: noun + \'s. Contraction: it\'s (it is), they\'re (they are).',
    examples: [
      'Mary\'s pencil, the dogs\' toys',
      'Can\'t, won\'t, shouldn\'t, they\'re',
      'The apples are red.',
    ],
    difficulty: 'Intermediate',
    level: 'intermediate',
    commonMistakes: ['Its mine', 'apple\'s for sale'],
    icon: '\'',
    practiceExercises: [
      { error: 'The cat has lost its collar.', correct: 'The cat has lost its collar.' },
      { error: 'It\'s a beautiful day.', correct: 'It\'s a beautiful day.' },
      { error: 'John\'s book is on the table.', correct: 'John\'s book is on the table.' },
      { error: 'The dog\'s tail is wagging.', correct: 'The dog\'s tail is wagging.' },
      { error: 'They\'re going to the store.', correct: 'They\'re going to the store.' },
      { error: 'The girls\' uniforms are clean.', correct: 'The girls\' uniforms are clean.' },
      { error: 'Its raining outside.', correct: 'It\'s raining outside.' },
      { error: 'The book\'s pages are torn.', correct: 'The book\'s pages are torn.' },
      { error: 'We\'re excited about the trip.', correct: 'We\'re excited about the trip.' },
      { error: 'The students\' grades are improving.', correct: 'The students\' grades are improving.' },
    ],
  },

  // ========== ADVANCED LEVEL ==========
  {
    id: 13,
    rule: 'Subjunctive Mood',
    category: 'Verb Moods',
    error: 'I wish I was taller. If he was here, he would help.',
    correct: 'I wish I were taller. If he were here, he would help.',
    explanation: 'Use subjunctive mood in hypothetical situations and wishes.',
    tips: 'Use subjunctive in: wishes, hypotheticals, and formal requests.',
    examples: [
      'I wish I were a singer.',
      'If I were you, I would apologize.',
      'I suggest that she be given another chance.',
    ],
    difficulty: 'Advanced',
    level: 'advanced',
    commonMistakes: ['I wish I was rich', 'If it was possible'],
    icon: '🌙',
    practiceExercises: [
      { error: 'If I was you, I would say yes.', correct: 'If I were you, I would say yes.' },
      { error: 'I wish I was able to help.', correct: 'I wish I were able to help.' },
      { error: 'If she was here, everything would be better.', correct: 'If she were here, everything would be better.' },
      { error: 'I suggest that he was told immediately.', correct: 'I suggest that he be told immediately.' },
      { error: 'If it was possible, I would go.', correct: 'If it were possible, I would go.' },
      { error: 'I wish I was taller.', correct: 'I wish I were taller.' },
      { error: 'If he was honest, I would trust him.', correct: 'If he were honest, I would trust him.' },
      { error: 'She demanded that he was fired.', correct: 'She demanded that he be fired.' },
      { error: 'If I was in your position, I would leave.', correct: 'If I were in your position, I would leave.' },
      { error: 'I recommend that she was considered.', correct: 'I recommend that she be considered.' },
    ],
  },

  {
    id: 14,
    rule: 'Active vs. Passive Voice',
    category: 'Voice',
    error: 'The letter was written by her.',
    correct: 'She wrote the letter.',
    explanation: 'Use active voice more often. Active is clearer and more direct.',
    tips: 'Active: subject + verb + object. Passive: object + was/were + past participle.',
    examples: [
      'The children ate the cake.',
      'The scientist discovered a new species.',
      'Acceptable passive: The house was destroyed.',
    ],
    difficulty: 'Advanced',
    level: 'advanced',
    commonMistakes: ['The book was read by many people'],
    icon: '🎬',
    practiceExercises: [
      { error: 'The cake was baked by my mother.', correct: 'My mother baked the cake.' },
      { error: 'The song was sung beautifully by the choir.', correct: 'The choir sang the song beautifully.' },
      { error: 'The report was written by the team.', correct: 'The team wrote the report.' },
      { error: 'The project was completed by John.', correct: 'John completed the project.' },
      { error: 'The painting was created by Picasso.', correct: 'Picasso created the painting.' },
      { error: 'The movie was directed by Steven Spielberg.', correct: 'Steven Spielberg directed the movie.' },
      { error: 'The house was built by the contractor.', correct: 'The contractor built the house.' },
      { error: 'The problem was solved by the engineers.', correct: 'The engineers solved the problem.' },
      { error: 'The book was published by a famous author.', correct: 'A famous author published the book.' },
      { error: 'The decision was made by the board.', correct: 'The board made the decision.' },
    ],
  },

  {
    id: 15,
    rule: 'Reported Speech',
    category: 'Advanced Structures',
    error: 'She said that she is leaving tomorrow.',
    correct: 'She said that she was leaving the next day.',
    explanation: 'In reported speech, shift tenses to reflect the past reporting verb.',
    tips: 'Backshift: present→past, past→past perfect, is→was.',
    examples: [
      'She said she loved the book.',
      'He said he would come the next day.',
      'Scientists know that the earth is round.',
    ],
    difficulty: 'Advanced',
    level: 'advanced',
    commonMistakes: ['He said that he comes tomorrow'],
    icon: '💬',
    practiceExercises: [
      { error: 'He said he is busy.', correct: 'He said he was busy.' },
      { error: 'She told me that she likes pizza.', correct: 'She told me that she liked pizza.' },
      { error: 'They said they will come later.', correct: 'They said they would come later.' },
      { error: 'He mentioned that he has finished the work.', correct: 'He mentioned that he had finished the work.' },
      { error: 'She explained that she can\'t attend.', correct: 'She explained that she couldn\'t attend.' },
      { error: 'They reported that the project is on track.', correct: 'They reported that the project was on track.' },
      { error: 'He said he wants to travel.', correct: 'He said he wanted to travel.' },
      { error: 'She told them she needs help.', correct: 'She told them she needed help.' },
      { error: 'The teacher said that the test is tomorrow.', correct: 'The teacher said that the test was tomorrow.' },
      { error: 'He mentioned that he drives to work.', correct: 'He mentioned that he drove to work.' },
    ],
  },

  {
    id: 16,
    rule: 'Complex Sentence Structure',
    category: 'Sentence Structure',
    error: 'Although she studied hard but she failed the exam.',
    correct: 'Although she studied hard, she failed the exam.',
    explanation: 'Don\'t use coordinating conjunctions after subordinating conjunctions.',
    tips: 'Choose either subordinating or coordinating conjunction, not both.',
    examples: [
      'Because it was raining, we stayed home.',
      'Although he was sick, he came.',
      'It was raining, so we stayed home.',
    ],
    difficulty: 'Advanced',
    level: 'advanced',
    commonMistakes: ['Because I was tired but I went'],
    icon: '🌳',
    practiceExercises: [
      { error: 'Because it was raining but we went out.', correct: 'Although it was raining, we went out.' },
      { error: 'Since he was late so we started without him.', correct: 'Since he was late, we started without him.' },
      { error: 'Although she tried hard but she failed.', correct: 'Although she tried hard, she failed.' },
      { error: 'If you study hard but you still fail.', correct: 'If you study hard and still fail.' },
      { error: 'While they were working but they got tired.', correct: 'While they were working, they got tired.' },
      { error: 'Because the weather was nice but we stayed inside.', correct: 'Although the weather was nice, we stayed inside.' },
      { error: 'Unless he calls yet we will leave.', correct: 'Unless he calls, we will leave.' },
      { error: 'Whenever you visit so we are happy.', correct: 'Whenever you visit, we are happy.' },
      { error: 'Though she was young but she was wise.', correct: 'Though she was young, she was wise.' },
      { error: 'Since they arrived and we started the meeting.', correct: 'Since they arrived, we started the meeting.' },
    ],
  },

  {
    id: 17,
    rule: 'Relative Clauses',
    category: 'Clauses',
    error: 'The person which I talked to was helpful.',
    correct: 'The person whom I talked to was helpful.',
    explanation: 'Use "who" for people, "which" for things. Use "whom" for objects.',
    tips: 'Who = subject, whom = object. That = restrictive, which = non-restrictive.',
    examples: [
      'The student who scored highest won.',
      'The car that I bought is red.',
      'Jane, who is my friend, is coming over.',
    ],
    difficulty: 'Advanced',
    level: 'advanced',
    commonMistakes: ['The boy which is tall'],
    icon: '🔗',
    practiceExercises: [
      { error: 'The woman which lives here is nice.', correct: 'The woman who lives here is nice.' },
      { error: 'The book that I read it was interesting.', correct: 'The book that I read was interesting.' },
      { error: 'The man who I met him yesterday is here.', correct: 'The man whom I met yesterday is here.' },
      { error: 'The house which we bought it is large.', correct: 'The house that we bought is large.' },
      { error: 'The teacher which taught me was great.', correct: 'The teacher who taught me was great.' },
      { error: 'The car what I drive is new.', correct: 'The car that I drive is new.' },
      { error: 'The students who they study hard pass.', correct: 'The students who study hard pass.' },
      { error: 'The city which we visited it was beautiful.', correct: 'The city that we visited was beautiful.' },
      { error: 'The person which helped me was kind.', correct: 'The person who helped me was kind.' },
      { error: 'The movie that I watched it was good.', correct: 'The movie that I watched was good.' },
    ],
  },

  {
    id: 18,
    rule: 'Agreement with Indefinite Pronouns',
    category: 'Pronouns',
    error: 'Everyone are happy.',
    correct: 'Everyone is happy.',
    explanation: 'Singular pronouns take singular verbs. Plural pronouns take plural verbs.',
    tips: 'Singular: each, every, either, neither, anyone, someone, everybody.',
    examples: [
      'Each student submits one assignment.',
      'Everyone has their opinion.',
      'Neither of the solutions is perfect.',
    ],
    difficulty: 'Advanced',
    level: 'advanced',
    commonMistakes: ['Each have arrived', 'Everyone are ready'],
    icon: '🎓',
    practiceExercises: [
      { error: 'Everyone are here.', correct: 'Everyone is here.' },
      { error: 'Each student have their assignment.', correct: 'Each student has his or her assignment.' },
      { error: 'Nobody know the answer.', correct: 'Nobody knows the answer.' },
      { error: 'Something are wrong.', correct: 'Something is wrong.' },
      { error: 'Either option are possible.', correct: 'Either option is possible.' },
      { error: 'Everybody have finished.', correct: 'Everybody has finished.' },
      { error: 'Someone are waiting for you.', correct: 'Someone is waiting for you.' },
      { error: 'Nothing are impossible.', correct: 'Nothing is impossible.' },
      { error: 'Both students have submitted their work.', correct: 'Both students have submitted their work.' },
      { error: 'Many of them are absent.', correct: 'Many of them are absent.' },
    ],
  },

  {
    id: 19,
    rule: 'Comma Splices',
    category: 'Punctuation',
    error: 'She finished her homework, she went to bed.',
    correct: 'She finished her homework, and she went to bed.',
    explanation: 'Don\'t join two independent clauses with just a comma.',
    tips: 'Use a conjunction, semicolon, or period to fix comma splices.',
    examples: [
      'I love reading; it\'s my favorite hobby.',
      'She was tired, so she fell asleep.',
    ],
    difficulty: 'Advanced',
    level: 'advanced',
    commonMistakes: ['The class ended, everyone left'],
    icon: '🚫',
    practiceExercises: [
      { error: 'I like pizza, it is my favorite food.', correct: 'I like pizza; it is my favorite food.' },
      { error: 'He studied hard, he passed the exam.', correct: 'He studied hard, so he passed the exam.' },
      { error: 'She is intelligent, she always gets good grades.', correct: 'She is intelligent, so she always gets good grades.' },
      { error: 'The sun was shining, the birds were singing.', correct: 'The sun was shining, and the birds were singing.' },
      { error: 'I was tired, I went to bed early.', correct: 'I was tired, so I went to bed early.' },
      { error: 'The movie was boring, I fell asleep.', correct: 'The movie was boring, so I fell asleep.' },
      { error: 'She loves dancing, she dances every day.', correct: 'She loves dancing; she dances every day.' },
      { error: 'The weather is nice, let\'s go outside.', correct: 'The weather is nice, so let\'s go outside.' },
      { error: 'He forgot his keys, he had to go back home.', correct: 'He forgot his keys, so he had to go back home.' },
      { error: 'I enjoy reading, it relaxes me.', correct: 'I enjoy reading; it relaxes me.' },
    ],
  },

  {
    id: 20,
    rule: 'Double Negatives',
    category: 'Sentence Structure',
    error: 'I don\'t have no money.',
    correct: 'I don\'t have any money.',
    explanation: 'Avoid using two negative words in the same clause.',
    tips: 'Choose either a negative word (not, don\'t, no) OR a negative construction.',
    examples: [
      'I don\'t want anything.',
      'He didn\'t see anybody.',
      'She could barely speak.',
    ],
    difficulty: 'Advanced',
    level: 'advanced',
    commonMistakes: ['I didn\'t do nothing', 'She wasn\'t nowhere'],
    icon: '⚡',
    practiceExercises: [
      { error: 'I don\'t have nothing to say.', correct: 'I don\'t have anything to say.' },
      { error: 'She didn\'t go nowhere yesterday.', correct: 'She didn\'t go anywhere yesterday.' },
      { error: 'He won\'t eat no vegetables.', correct: 'He won\'t eat any vegetables.' },
      { error: 'I can\'t see nobody.', correct: 'I can\'t see anybody.' },
      { error: 'They don\'t want no help.', correct: 'They don\'t want any help.' },
      { error: 'She isn\'t doing nothing.', correct: 'She isn\'t doing anything.' },
      { error: 'I didn\'t never see him.', correct: 'I never saw him.' },
      { error: 'He won\'t never forgive me.', correct: 'He will never forgive me.' },
      { error: 'They don\'t know nobody.', correct: 'They don\'t know anybody.' },
      { error: 'I didn\'t do nothing wrong.', correct: 'I didn\'t do anything wrong.' },
    ],
  },
];

// ============================================================================
// ENHANCED GRAMMAR CHECKER WITH PRACTICE MODE
// ============================================================================

export function GrammarChecker() {
  const [selectedRuleId, setSelectedRuleId] = useState(GRAMMAR_RULES[0].id);
  const [userText, setUserText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCorrection, setShowCorrection] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [correctAttempts, setCorrectAttempts] = useState(0);
  const [practicedRules, setPracticedRules] = useState(new Set());
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState('');
  const [quizMode, setQuizMode] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizRound, setQuizRound] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [practiceMode, setPracticeMode] = useState('main'); // main, exercises
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseScore, setExerciseScore] = useState(0);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get unique categories and difficulties
  const categories = ['All', ...new Set(GRAMMAR_RULES.map(rule => rule.category))];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Filter rules
  const filteredRules = useMemo(() => {
    let filtered = GRAMMAR_RULES;

    if (searchTerm) {
      filtered = filtered.filter(rule =>
        rule.rule.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rule.explanation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(rule => rule.category === selectedCategory);
    }

    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(rule => rule.difficulty === selectedDifficulty);
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  const selectedRule = GRAMMAR_RULES.find(r => r.id === selectedRuleId) || GRAMMAR_RULES[0];
  const currentExercise = selectedRule.practiceExercises[currentExerciseIndex] || selectedRule.practiceExercises[0];

  const handleCheckGrammar = () => {
    if (userText.trim().length === 0) {
      setFeedback('');
      return;
    }

    setAttempts(prev => prev + 1);
    const userInput = userText.toLowerCase().trim();
    const correctVersion = selectedRule.correct.toLowerCase().trim();
    const errorVersion = selectedRule.error.toLowerCase().trim();

    if (userInput === errorVersion) {
      setFeedback('❌ This is the INCORRECT version. Try writing the correct version.');
      setStreak(0);
      setAnimationType('wrong');
      setShowAnimation(true);
    } else if (userInput === correctVersion) {
      setFeedback('✅ Perfect! You\'ve mastered this rule!');
      setCorrectAttempts(prev => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      setPracticedRules(prev => new Set([...prev, selectedRule.id]));
      setAnimationType('correct');
      setShowAnimation(true);
      if (quizMode) setQuizScore(prev => prev + 1);
    } else {
      setFeedback('⚠️ Not quite right. Check the explanation and try again.');
      setStreak(0);
      setAnimationType('partial');
      setShowAnimation(true);
    }

    setTimeout(() => setShowAnimation(false), 2000);
  };

  const handleCheckExercise = () => {
    if (userText.trim().length === 0) {
      setFeedback('');
      return;
    }

    const userInput = userText.toLowerCase().trim();
    const correctVersion = currentExercise.correct.toLowerCase().trim();

    if (userInput === correctVersion) {
      setFeedback('✅ Excellent! Your answer is correct!');
      setExerciseScore(prev => prev + 1);
      setAnimationType('correct');
      setShowAnimation(true);
    } else {
      setFeedback(`⚠️ Not quite right. The correct answer is: "${currentExercise.correct}"`);
      setAnimationType('partial');
      setShowAnimation(true);
    }

    setTimeout(() => setShowAnimation(false), 2000);
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < selectedRule.practiceExercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setUserText('');
      setFeedback('');
    } else {
      alert(`🎉 You've completed all ${selectedRule.practiceExercises.length} exercises for this rule!`);
      setCurrentExerciseIndex(0);
      setUserText('');
      setFeedback('');
      setPracticeMode('main');
    }
  };

  const handleSelectRule = (ruleId) => {
    setSelectedRuleId(ruleId);
    setUserText('');
    setFeedback('');
    setPracticeMode('main');
    setCurrentExerciseIndex(0);
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
      'Sentence Structure': '#3b82f6',
      'Verb Tenses': '#8b5cf6',
      'Articles': '#ec4899',
      'Nouns': '#06b6d4',
      'Pronouns': '#10b981',
      'Modifiers': '#f59e0b',
      'Punctuation': '#6366f1',
      'Clauses': '#d946ef',
      'Voice': '#ef4444',
      'Verb Moods': '#64748b',
      'Advanced Structures': '#a16207',
    };
    return colors[category] || '#6b7280';
  };

  const accuracyPercentage = attempts > 0 ? Math.round((correctAttempts / attempts) * 100) : 0;
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAchievementLevel = () => {
    if (practicedRules.size === 0) return { level: 'Beginner', icon: '🌱', color: '#94a3b8' };
    if (practicedRules.size < 5) return { level: 'Student', icon: '📚', color: '#10b981' };
    if (practicedRules.size < 10) return { level: 'Scholar', icon: '🎓', color: '#f59e0b' };
    if (practicedRules.size < 15) return { level: 'Master', icon: '👑', color: '#a81011' };
    return { level: 'Linguist', icon: '🌟', color: '#6366f1' };
  };

  const achievement = getAchievementLevel();

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px' }}>
      {/* ========== ANIMATION OVERLAYS ========== */}
      {showAnimation && (
        <>
          {animationType === 'correct' && (
            <>
              <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '4rem',
                animation: 'bounce 0.6s ease-in-out',
                zIndex: 9999,
                pointerEvents: 'none',
              }}>
                🎉
              </div>
              <div style={{
                position: 'fixed',
                top: '50%',
                left: '30%',
                fontSize: '3rem',
                animation: 'float 1s ease-in-out',
                zIndex: 9999,
                pointerEvents: 'none',
              }}>
                ⭐
              </div>
              <div style={{
                position: 'fixed',
                top: '50%',
                right: '30%',
                fontSize: '3rem',
                animation: 'float 1s ease-in-out',
                zIndex: 9999,
                pointerEvents: 'none',
              }}>
                ✨
              </div>
            </>
          )}

          {animationType === 'wrong' && (
            <div style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '3rem',
              animation: 'shake 0.5s ease-in-out',
              zIndex: 9999,
              pointerEvents: 'none',
            }}>
              😅
            </div>
          )}
        </>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -70%) scale(1.2); }
        }
        @keyframes float {
          0% { opacity: 0; transform: translateY(0); }
          50% { opacity: 1; }
          100% { opacity: 0; transform: translateY(-100px); }
        }
        @keyframes shake {
          0%, 100% { transform: translate(-50%, -50%) rotateZ(0deg); }
          25% { transform: translate(-50%, -50%) rotateZ(-5deg); }
          75% { transform: translate(-50%, -50%) rotateZ(5deg); }
        }
      `}</style>

      {/* ========== HEADER ========== */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
          <div>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '2.4rem',
              fontWeight: 800,
              color: '#0c1f4a',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              🔍 Grammar Master Pro
            </h1>
            <p style={{ color: '#475569', fontSize: '0.95rem', maxWidth: '600px' }}>
              Master 200+ grammar exercises with 20 rules. Interactive practice, quizzes, and instant feedback!
            </p>
          </div>

          {/* Achievement Badge */}
          <div style={{
            background: `${achievement.color}15`,
            border: `2px solid ${achievement.color}`,
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            minWidth: '150px',
          }}>
            <p style={{ fontSize: '2.5rem', margin: '0 0 8px 0' }}>
              {achievement.icon}
            </p>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, color: achievement.color, margin: 0 }}>
              {achievement.level}
            </p>
          </div>
        </div>

        {/* ========== STATS DASHBOARD ========== */}
        <div style={{
          background: 'linear-gradient(135deg, #0c1f4a 0%, #1e293b 100%)',
          borderRadius: '16px',
          padding: '28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '20px',
          color: '#fff',
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase' }}>
              🔥 Streak
            </p>
            <p style={{ fontSize: '2.8rem', fontWeight: 800, margin: 0 }}>
              {streak}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', margin: '4px 0 0 0' }}>
              Best: {maxStreak}
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase' }}>
              ✅ Correct
            </p>
            <p style={{ fontSize: '2.8rem', fontWeight: 800, color: '#10b981', margin: 0 }}>
              {correctAttempts}/{attempts || 0}
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase' }}>
              📊 Accuracy
            </p>
            <p style={{ fontSize: '2.8rem', fontWeight: 800, color: '#f59e0b', margin: 0 }}>
              {accuracyPercentage}%
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase' }}>
              🏆 Mastered
            </p>
            <p style={{ fontSize: '2.8rem', fontWeight: 800, color: '#06b6d4', margin: 0 }}>
              {practicedRules.size}/{GRAMMAR_RULES.length}
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase' }}>
              📝 Exercises
            </p>
            <p style={{ fontSize: '2.8rem', fontWeight: 800, color: '#ec4899', margin: 0 }}>
              {exerciseScore}+
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', fontWeight: 700, marginBottom: '10px', textTransform: 'uppercase' }}>
              ⏱️ Time
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: '#ec4899', margin: 0 }}>
              {formatTime(timeSpent)}
            </p>
          </div>
        </div>
      </div>

      {/* ========== FILTERS & CONTROLS ========== */}
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '28px',
        marginBottom: '28px',
      }}>
        {/* Search Bar */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#94a3b8',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'block',
            marginBottom: '10px',
          }}>
            🔍 Search Grammar Rules (200+ Exercises Available!)
          </label>
          <input
            type="text"
            placeholder="Find a rule by name or keyword..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (filteredRules.length > 0) {
                setSelectedRuleId(filteredRules[0].id);
              }
            }}
            style={{
              width: '100%',
              padding: '14px 18px',
              border: '1.5px solid #dde3ef',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#a81011'}
            onBlur={(e) => e.target.style.borderColor = '#dde3ef'}
          />
        </div>

        {/* Filter Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '20px',
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
                    if (filteredRules.length > 0) {
                      setSelectedRuleId(filteredRules[0].id);
                    }
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
                    if (filteredRules.length > 0) {
                      setSelectedRuleId(filteredRules[0].id);
                    }
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

        {/* Mode Selection */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setPracticeMode('main')}
            style={{
              padding: '12px 24px',
              background: practiceMode === 'main' ? 'linear-gradient(135deg, #a81011, #d42022)' : '#fff',
              color: practiceMode === 'main' ? '#fff' : '#475569',
              border: practiceMode === 'main' ? 'none' : '1.5px solid #dde3ef',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: practiceMode === 'main' ? '0 4px 12px rgba(168,16,17,0.3)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            📖 Learn & Practice
          </button>

          <button
            onClick={() => {
              setPracticeMode('exercises');
              setCurrentExerciseIndex(0);
              setUserText('');
              setFeedback('');
            }}
            style={{
              padding: '12px 24px',
              background: practiceMode === 'exercises' ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' : '#fff',
              color: practiceMode === 'exercises' ? '#fff' : '#475569',
              border: practiceMode === 'exercises' ? 'none' : '1.5px solid #dde3ef',
              borderRadius: '10px',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: practiceMode === 'exercises' ? '0 4px 12px rgba(245,158,11,0.3)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            ✏️ 200+ Exercises ({selectedRule.practiceExercises.length} per rule)
          </button>

          <button
            onClick={() => {
              setAttempts(0);
              setCorrectAttempts(0);
              setStreak(0);
              setUserText('');
              setFeedback('');
              setExerciseScore(0);
            }}
            style={{
              padding: '12px 24px',
              background: '#fff',
              color: '#475569',
              border: '1.5px solid #dde3ef',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            🔄 Reset All
          </button>
        </div>
      </div>

      {filteredRules.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '100px 24px',
          background: '#fff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
        }}>
          <p style={{ fontSize: '3rem', marginBottom: '12px' }}>🔎</p>
          <p style={{ fontSize: '1.2rem', color: '#94a3b8', marginBottom: '12px', fontWeight: 700 }}>
            No grammar rules found
          </p>
          <p style={{ fontSize: '0.95rem', color: '#d1d5db' }}>
            Try adjusting your filters or search term
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '320px 1fr',
          gap: '32px',
        }}>
          {/* ========== RULES LIST SIDEBAR ========== */}
          <div style={{
            display: 'grid',
            gridTemplateRows: 'auto 1fr',
            gap: '16px',
            height: 'fit-content',
          }}>
            <div>
              <p style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '16px',
              }}>
                Rules ({filteredRules.length})
              </p>
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              maxHeight: '800px',
              overflowY: 'auto',
            }}>
              {filteredRules.map((rule) => (
                <button
                  key={rule.id}
                  onClick={() => handleSelectRule(rule.id)}
                  style={{
                    padding: '14px 16px',
                    border: selectedRuleId === rule.id ? '2px solid #a81011' : '1px solid #dde3ef',
                    borderRadius: '10px',
                    background: selectedRuleId === rule.id ? '#fff0f0' : '#fff',
                    color: selectedRuleId === rule.id ? '#a81011' : '#475569',
                    fontWeight: selectedRuleId === rule.id ? 600 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '0.9rem',
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  title={rule.rule}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '4px' }}>
                      {rule.icon} {rule.rule}
                    </div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: selectedRuleId === rule.id ? '#c01314' : '#94a3b8',
                    }}>
                      {rule.difficulty} • {rule.practiceExercises.length} ex
                    </div>
                  </div>
                  {practicedRules.has(rule.id) && (
                    <span style={{ fontSize: '1.2rem', marginLeft: '8px' }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ========== MAIN CONTENT ========== */}
          <div>
            {practiceMode === 'main' ? (
              <>
                {/* Rule Title and Metadata */}
                <div style={{ marginBottom: '32px' }}>
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center',
                    marginBottom: '16px',
                    flexWrap: 'wrap',
                  }}>
                    <span style={{ fontSize: '2.5rem' }}>{selectedRule.icon}</span>
                    <div style={{ flex: 1 }}>
                      <h2 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '2rem',
                        fontWeight: 800,
                        color: '#0c1f4a',
                        margin: 0,
                        marginBottom: '8px',
                      }}>
                        {selectedRule.rule}
                      </h2>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{
                          background: `${getCategoryColor(selectedRule.category)}15`,
                          color: getCategoryColor(selectedRule.category),
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                        }}>
                          {selectedRule.category}
                        </span>
                        <span style={{
                          background: `${getDifficultyColor(selectedRule.difficulty)}15`,
                          color: getDifficultyColor(selectedRule.difficulty),
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                        }}>
                          {selectedRule.difficulty}
                        </span>
                        <span style={{
                          background: '#f4f6fb',
                          color: '#0c1f4a',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                        }}>
                          {selectedRule.practiceExercises.length} Exercises
                        </span>
                        {practicedRules.has(selectedRule.id) && (
                          <span style={{
                            background: '#f0fdf4',
                            color: '#16a34a',
                            padding: '6px 14px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                          }}>
                            ✓ Mastered
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Example */}
                <div style={{
                  background: '#fff5f5',
                  border: '2px solid rgba(239,68,68,0.3)',
                  borderRadius: '12px',
                  padding: '28px',
                  marginBottom: '24px',
                }}>
                  <p style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#dc2626',
                    textTransform: 'uppercase',
                    marginBottom: '12px',
                    letterSpacing: '1px',
                  }}>
                    ❌ Incorrect Version
                  </p>
                  <p style={{
                    fontSize: '1.15rem',
                    color: '#7f1d1d',
                    lineHeight: 1.8,
                    fontStyle: 'italic',
                    fontFamily: 'monospace',
                    margin: 0,
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    padding: '12px',
                    borderRadius: '6px',
                  }}>
                    "{selectedRule.error}"
                  </p>
                </div>

                {/* Correct Example */}
                {showCorrection && (
                  <div style={{
                    background: '#f0fdf4',
                    border: '2px solid rgba(34,197,94,0.3)',
                    borderRadius: '12px',
                    padding: '28px',
                    marginBottom: '24px',
                  }}>
                    <p style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#16a34a',
                      textTransform: 'uppercase',
                      marginBottom: '12px',
                      letterSpacing: '1px',
                    }}>
                      ✅ Correct Version
                    </p>
                    <p style={{
                      fontSize: '1.15rem',
                      color: '#166534',
                      lineHeight: 1.8,
                      fontFamily: 'monospace',
                      margin: 0,
                      backgroundColor: 'rgba(0,0,0,0.05)',
                      padding: '12px',
                      borderRadius: '6px',
                    }}>
                      "{selectedRule.correct}"
                    </p>
                  </div>
                )}

                {/* Explanation */}
                <div style={{
                  background: '#f4f6fb',
                  border: '1px solid #dde3ef',
                  borderRadius: '12px',
                  padding: '28px',
                  marginBottom: '24px',
                }}>
                  <p style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    marginBottom: '16px',
                    letterSpacing: '1px',
                  }}>
                    📖 Rule Explanation
                  </p>
                  <p style={{
                    color: '#475569',
                    lineHeight: 1.8,
                    fontSize: '0.98rem',
                    margin: 0,
                    marginBottom: '20px',
                  }}>
                    {selectedRule.explanation}
                  </p>

                  <div style={{
                    background: '#fff',
                    borderLeft: '4px solid #0c1f4a',
                    padding: '14px 18px',
                    borderRadius: '4px',
                    marginBottom: '16px',
                  }}>
                    <p style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#0c1f4a',
                      margin: '0 0 8px 0',
                    }}>
                      💡 Quick Tip
                    </p>
                    <p style={{
                      fontSize: '0.95rem',
                      color: '#475569',
                      lineHeight: 1.7,
                      margin: 0,
                    }}>
                      {selectedRule.tips}
                    </p>
                  </div>
                </div>

                {/* Common Mistakes */}
                {selectedRule.commonMistakes && selectedRule.commonMistakes.length > 0 && (
                  <div style={{
                    background: '#fef3c7',
                    border: '2px solid rgba(217,119,6,0.3)',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '24px',
                  }}>
                    <p style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#b45309',
                      textTransform: 'uppercase',
                      marginBottom: '14px',
                      letterSpacing: '1px',
                    }}>
                      ⚠️ Common Mistakes to Avoid
                    </p>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {selectedRule.commonMistakes.map((mistake, idx) => (
                        <div key={idx} style={{
                          background: 'rgba(255,255,255,0.7)',
                          padding: '12px 14px',
                          borderRadius: '8px',
                          color: '#92400e',
                          fontSize: '0.9rem',
                          fontStyle: 'italic',
                          borderLeft: '3px solid #b45309',
                        }}>
                          ❌ "{mistake}"
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* More Examples */}
                {selectedRule.examples && selectedRule.examples.length > 0 && (
                  <div style={{
                    background: '#fff',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '28px',
                    marginBottom: '28px',
                  }}>
                    <p style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      marginBottom: '18px',
                      letterSpacing: '1px',
                    }}>
                      📚 Additional Examples
                    </p>
                    <div style={{ display: 'grid', gap: '14px' }}>
                      {selectedRule.examples.map((example, idx) => (
                        <div key={idx} style={{
                          background: '#f9fafb',
                          padding: '14px 16px',
                          borderRadius: '8px',
                          borderLeft: '4px solid #0c1f4a',
                          fontSize: '0.95rem',
                          color: '#475569',
                          lineHeight: 1.7,
                        }}>
                          ✓ "{example}"
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Practice Section */}
                <div style={{
                  background: '#fff',
                  border: '2px solid #dde3ef',
                  borderRadius: '12px',
                  padding: '28px',
                }}>
                  <p style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    marginBottom: '20px',
                  }}>
                    ✏️ Practice Exercise
                  </p>

                  <div style={{
                    background: '#fff5f5',
                    border: '2px solid rgba(168,16,17,0.2)',
                    borderRadius: '10px',
                    padding: '18px',
                    marginBottom: '20px',
                  }}>
                    <p style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#7f1d1d',
                      marginBottom: '12px',
                    }}>
                      Rewrite this sentence correctly:
                    </p>
                    <p style={{
                      fontSize: '1rem',
                      color: '#a81011',
                      fontStyle: 'italic',
                      fontWeight: 600,
                      margin: 0,
                      background: 'rgba(0,0,0,0.03)',
                      padding: '10px',
                      borderRadius: '6px',
                    }}>
                      "{selectedRule.error}"
                    </p>
                  </div>

                  <textarea
                    value={userText}
                    onChange={(e) => setUserText(e.target.value)}
                    onBlur={handleCheckGrammar}
                    placeholder="Type your correction here and click Check or click away..."
                    style={{
                      width: '100%',
                      padding: '16px 18px',
                      border: '1.5px solid #dde3ef',
                      borderRadius: '10px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.98rem',
                      color: '#0f172a',
                      minHeight: '140px',
                      resize: 'vertical',
                      outline: 'none',
                      boxSizing: 'border-box',
                      marginBottom: '16px',
                      transition: 'all 0.2s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#a81011'}
                  />

                  {/* Feedback */}
                  {feedback && (
                    <div style={{
                      fontSize: '0.98rem',
                      fontWeight: 600,
                      color: feedback.includes('✅') ? '#16a34a' : feedback.includes('❌') ? '#dc2626' : '#b45309',
                      padding: '18px',
                      background: feedback.includes('✅')
                        ? '#f0fdf4'
                        : feedback.includes('❌')
                        ? '#fef2f2'
                        : '#fffbeb',
                      borderRadius: '10px',
                      border: feedback.includes('✅')
                        ? '2px solid rgba(34,197,94,0.3)'
                        : feedback.includes('❌')
                        ? '2px solid rgba(239,68,68,0.3)'
                        : '2px solid rgba(217,119,6,0.3)',
                      marginBottom: '20px',
                      lineHeight: 1.8,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}>
                      <span style={{ fontSize: '1.5rem' }}>
                        {feedback.includes('✅') ? '✅' : feedback.includes('❌') ? '❌' : '⚠️'}
                      </span>
                      <span>{feedback.replace(/^[✅❌⚠️]\s*/, '')}</span>
                    </div>
                  )}

                  {/* Control Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    <button
                      onClick={handleCheckGrammar}
                      style={{
                        padding: '14px',
                        background: 'linear-gradient(135deg, #a81011, #d42022)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(168,16,17,0.3)',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      ✓ Check Answer
                    </button>

                    <button
                      onClick={() => {
                        setShowCorrection(!showCorrection);
                      }}
                      style={{
                        padding: '14px',
                        background: '#fff',
                        color: '#0c1f4a',
                        border: '2px solid #dde3ef',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => e.target.style.borderColor = '#a81011'}
                      onMouseLeave={(e) => e.target.style.borderColor = '#dde3ef'}
                    >
                      {showCorrection ? '👁️ Hide' : '👁️ Show'}
                    </button>

                    <button
                      onClick={() => {
                        setUserText('');
                        setFeedback('');
                      }}
                      style={{
                        padding: '14px',
                        background: '#fff',
                        color: '#475569',
                        border: '2px solid #dde3ef',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => e.target.style.borderColor = '#94a3b8'}
                      onMouseLeave={(e) => e.target.style.borderColor = '#dde3ef'}
                    >
                      🔄 Clear
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // ========== PRACTICE EXERCISES MODE ========== 
              <>
                <div style={{ marginBottom: '32px' }}>
                  <div style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center',
                    marginBottom: '16px',
                    flexWrap: 'wrap',
                  }}>
                    <span style={{ fontSize: '2.5rem' }}>{selectedRule.icon}</span>
                    <div style={{ flex: 1 }}>
                      <h2 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '2rem',
                        fontWeight: 800,
                        color: '#0c1f4a',
                        margin: 0,
                        marginBottom: '8px',
                      }}>
                        {selectedRule.rule} - Practice Exercises
                      </h2>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <span style={{
                          background: '#f4f6fb',
                          color: '#0c1f4a',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                        }}>
                          Exercise {currentExerciseIndex + 1} of {selectedRule.practiceExercises.length}
                        </span>
                        <span style={{
                          background: '#f0fdf4',
                          color: '#16a34a',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                        }}>
                          ✓ {exerciseScore} Correct
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{
                    height: '8px',
                    background: '#eef1f8',
                    borderRadius: '999px',
                    overflow: 'hidden',
                    marginTop: '16px',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${((currentExerciseIndex + 1) / selectedRule.practiceExercises.length) * 100}%`,
                      background: 'linear-gradient(90deg, #0c1f4a, #a81011)',
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                </div>

                {/* Exercise Content */}
                <div style={{
                  background: '#fff5f5',
                  border: '2px solid rgba(239,68,68,0.3)',
                  borderRadius: '12px',
                  padding: '28px',
                  marginBottom: '24px',
                }}>
                  <p style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#dc2626',
                    textTransform: 'uppercase',
                    marginBottom: '12px',
                    letterSpacing: '1px',
                  }}>
                    ❌ Incorrect Version (Fix This)
                  </p>
                  <p style={{
                    fontSize: '1.2rem',
                    color: '#7f1d1d',
                    lineHeight: 1.8,
                    fontStyle: 'italic',
                    fontFamily: 'monospace',
                    margin: 0,
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    padding: '16px',
                    borderRadius: '8px',
                  }}>
                    "{currentExercise.error}"
                  </p>
                </div>

                {/* Input Area */}
                <textarea
                  value={userText}
                  onChange={(e) => setUserText(e.target.value)}
                  placeholder="Write the correct version here..."
                  style={{
                    width: '100%',
                    padding: '16px 18px',
                    border: '1.5px solid #dde3ef',
                    borderRadius: '10px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.98rem',
                    color: '#0f172a',
                    minHeight: '140px',
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                    marginBottom: '16px',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#a81011'}
                />

                {/* Feedback */}
                {feedback && (
                  <div style={{
                    fontSize: '0.98rem',
                    fontWeight: 600,
                    color: feedback.includes('✅') ? '#16a34a' : '#dc2626',
                    padding: '18px',
                    background: feedback.includes('✅')
                      ? '#f0fdf4'
                      : '#fef2f2',
                    borderRadius: '10px',
                    border: feedback.includes('✅')
                      ? '2px solid rgba(34,197,94,0.3)'
                      : '2px solid rgba(239,68,68,0.3)',
                    marginBottom: '20px',
                    lineHeight: 1.8,
                  }}>
                    {feedback}
                  </div>
                )}

                {/* Control Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '20px' }}>
                  <button
                    onClick={handleCheckExercise}
                    style={{
                      padding: '14px',
                      background: 'linear-gradient(135deg, #a81011, #d42022)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(168,16,17,0.3)',
                      transition: 'all 0.2s',
                    }}
                  >
                    ✓ Submit Answer
                  </button>

                  <button
                    onClick={() => {
                      setUserText('');
                      setFeedback('');
                    }}
                    style={{
                      padding: '14px',
                      background: '#fff',
                      color: '#475569',
                      border: '2px solid #dde3ef',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    🔄 Clear
                  </button>
                </div>

                {/* Correct Answer Display */}
                {feedback && (
                  <div style={{
                    background: '#f0fdf4',
                    border: '2px solid rgba(34,197,94,0.3)',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px',
                  }}>
                    <p style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#16a34a',
                      textTransform: 'uppercase',
                      marginBottom: '12px',
                      letterSpacing: '1px',
                    }}>
                      ✅ Correct Answer
                    </p>
                    <p style={{
                      fontSize: '1.1rem',
                      color: '#166534',
                      lineHeight: 1.8,
                      fontFamily: 'monospace',
                      margin: 0,
                      backgroundColor: 'rgba(0,0,0,0.05)',
                      padding: '12px',
                      borderRadius: '6px',
                    }}>
                      "{currentExercise.correct}"
                    </p>
                  </div>
                )}

                {/* Next Button */}
                <button
                  onClick={handleNextExercise}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: feedback ? 'linear-gradient(135deg, #0c1f4a, #1e293b)' : '#e2e8f0',
                    color: feedback ? '#fff' : '#94a3b8',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: feedback ? 'pointer' : 'not-allowed',
                    boxShadow: feedback ? '0 4px 12px rgba(12,31,74,0.3)' : 'none',
                    transition: 'all 0.2s',
                  }}
                  disabled={!feedback}
                >
                  {currentExerciseIndex < selectedRule.practiceExercises.length - 1
                    ? '➜ Next Exercise'
                    : '🏁 Complete This Rule'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GrammarChecker;