import { Category, DifficultyLevel, Language } from "../enums";

export const textSampleSeeds = [
  // BEGINNER LESSONS - Basic letter practice
  {
    title: "Basic Home Row Keys",
    content: "asdf jkl; asdf jkl; fff jjj aaa sss ddd lll kkk",
    category: Category.LESSON,
    difficulty_level: DifficultyLevel.BEGINNER,
    language: Language.ENGLISH,
    source: "Typing Fundamentals"
  },
  {
    title: "Top Row Introduction",
    content: "qwer tyui qwer tyui qqq www eee rrr ttt yyy uuu iii",
    category: Category.LESSON,
    difficulty_level: DifficultyLevel.BEGINNER,
    language: Language.ENGLISH,
    source: "Typing Fundamentals"
  },
  {
    title: "Bottom Row Practice",
    content: "zxcv bnm, zxcv bnm, zzz xxx ccc vvv bbb nnn mmm",
    category: Category.LESSON,
    difficulty_level: DifficultyLevel.BEGINNER,
    language: Language.ENGLISH,
    source: "Typing Fundamentals"
  },
  {
    title: "Simple Words",
    content: "the and for are but not you all can had her was one our out day get has him his how its may new now old see two way who boy did",
    category: Category.LESSON,
    difficulty_level: DifficultyLevel.BEGINNER,
    language: Language.ENGLISH,
    source: "Common English Words"
  },

  // BEGINNER DRILLS
  {
    title: "Common Letter Combinations",
    content: "ing tion ment able ness less full ship ward like wise over under",
    category: Category.DRILL,
    difficulty_level: DifficultyLevel.BEGINNER,
    language: Language.ENGLISH,
    source: "English Suffixes Practice"
  },
  {
    title: "Double Letters",
    content: "all add egg inn odd off seem need good book look cool food door noon seen",
    category: Category.DRILL,
    difficulty_level: DifficultyLevel.BEGINNER,
    language: Language.ENGLISH,
    source: "Double Letter Practice"
  },

  // INTERMEDIATE LESSONS
  {
    title: "Numbers and Symbols",
    content: "123 456 789 0 !@# $%^ &*() _+= {}[] |\\:; \"'<> ?/. 1234567890",
    category: Category.LESSON,
    difficulty_level: DifficultyLevel.INTERMEDIATE,
    language: Language.ENGLISH,
    source: "Symbol Practice"
  },
  {
    title: "Capitalization Practice",
    content: "The Quick Brown Fox Jumps Over The Lazy Dog. Every Good Boy Does Fine Always. Practice Makes Perfect Every Single Day.",
    category: Category.LESSON,
    difficulty_level: DifficultyLevel.INTERMEDIATE,
    language: Language.ENGLISH,
    source: "Capitalization Fundamentals"
  },
  {
    title: "Common Sentences",
    content: "I am learning to type faster every day. The computer is a powerful tool for communication. Practice typing regularly to improve your speed and accuracy.",
    category: Category.LESSON,
    difficulty_level: DifficultyLevel.INTERMEDIATE,
    language: Language.ENGLISH,
    source: "Sentence Practice"
  },

  // INTERMEDIATE DRILLS
  {
    title: "Speed Building Words",
    content: "quick brown fox jumps over lazy dog pack my box with five dozen liquor jugs amazingly few discotheques",
    category: Category.DRILL,
    difficulty_level: DifficultyLevel.INTERMEDIATE,
    language: Language.ENGLISH,
    source: "Speed Building Exercise"
  },
  {
    title: "Technical Terms",
    content: "algorithm database software programming javascript typescript python html css framework library repository",
    category: Category.DRILL,
    difficulty_level: DifficultyLevel.INTERMEDIATE,
    language: Language.ENGLISH,
    source: "Programming Vocabulary"
  },

  // EXPERT LESSONS
  {
    title: "Complex Punctuation",
    content: "\"Hello,\" she said; \"this is quite difficult!\" The ratio was 3:2, but the result (surprisingly) was 7.5%. Isn't that amazing?",
    category: Category.LESSON,
    difficulty_level: DifficultyLevel.EXPERT,
    language: Language.ENGLISH,
    source: "Advanced Punctuation"
  },
  {
    title: "Mixed Case Challenge",
    content: "JavaScript TypeScript SQL HTML CSS React Node.js MongoDB PostgreSQL API REST GraphQL JSON XML HTTP HTTPS",
    category: Category.LESSON,
    difficulty_level: DifficultyLevel.EXPERT,
    language: Language.ENGLISH,
    source: "Technical Acronyms"
  },

  // EXPERT DRILLS
  {
    title: "Code Snippets",
    content: "const handleSubmit = async (event) => { event.preventDefault(); const response = await fetch('/api/data'); return response.json(); };",
    category: Category.DRILL,
    difficulty_level: DifficultyLevel.EXPERT,
    language: Language.ENGLISH,
    source: "JavaScript Code Practice"
  },
  {
    title: "Special Characters",
    content: "~`!@#$%^&*()_+-={}[]|\\:;\"'<>?,./1234567890 ±§¬∞£™¢∞¥©®µπΩ∑´∂ƒ∆∫√ç≈≤≥÷",
    category: Category.DRILL,
    difficulty_level: DifficultyLevel.EXPERT,
    language: Language.ENGLISH,
    source: "Special Characters Practice"
  },

  // QUOTES - Various difficulties
  {
    title: "Einstein on Learning",
    content: "The only source of knowledge is experience.",
    category: Category.QUOTE,
    difficulty_level: DifficultyLevel.BEGINNER,
    language: Language.ENGLISH,
    source: "Albert Einstein"
  },
  {
    title: "Steve Jobs on Innovation",
    content: "Innovation distinguishes between a leader and a follower.",
    category: Category.QUOTE,
    difficulty_level: DifficultyLevel.INTERMEDIATE,
    language: Language.ENGLISH,
    source: "Steve Jobs"
  },
  {
    title: "Maya Angelou on Courage",
    content: "Courage is the most important of all the virtues because without courage, you can't practice any other virtue consistently.",
    category: Category.QUOTE,
    difficulty_level: DifficultyLevel.INTERMEDIATE,
    language: Language.ENGLISH,
    source: "Maya Angelou"
  },
  {
    title: "Churchill on Success",
    content: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    category: Category.QUOTE,
    difficulty_level: DifficultyLevel.INTERMEDIATE,
    language: Language.ENGLISH,
    source: "Winston Churchill"
  },
  {
    title: "Thoreau on Dreams",
    content: "If you have built castles in the air, your work need not be lost; that is where they should be. Now put the foundations under them.",
    category: Category.QUOTE,
    difficulty_level: DifficultyLevel.EXPERT,
    language: Language.ENGLISH,
    source: "Henry David Thoreau"
  },

  // GAMES - Fun typing challenges
  {
    title: "Animal Names Speed Test",
    content: "cat dog elephant tiger lion zebra giraffe monkey rabbit horse cow pig sheep goat chicken duck swan eagle hawk owl",
    category: Category.GAME,
    difficulty_level: DifficultyLevel.BEGINNER,
    language: Language.ENGLISH,
    source: "Animal Kingdom"
  },
  {
    title: "Color Rush",
    content: "red blue green yellow orange purple pink brown black white gray silver gold crimson azure emerald amber violet",
    category: Category.GAME,
    difficulty_level: DifficultyLevel.BEGINNER,
    language: Language.ENGLISH,
    source: "Color Spectrum"
  },
  {
    title: "Food Challenge",
    content: "pizza burger sandwich salad pasta sushi tacos ice cream chocolate cookies cake bread cheese milk eggs bacon",
    category: Category.GAME,
    difficulty_level: DifficultyLevel.INTERMEDIATE,
    language: Language.ENGLISH,
    source: "Food & Cuisine"
  },
  {
    title: "Geography Quiz",
    content: "Paris London Tokyo New York Sydney Moscow Beijing Cairo Mumbai Rio de Janeiro Istanbul Bangkok Singapore",
    category: Category.GAME,
    difficulty_level: DifficultyLevel.INTERMEDIATE,
    language: Language.ENGLISH,
    source: "World Capitals & Cities"
  },
  {
    title: "Science Terms",
    content: "photosynthesis electromagnetic deoxyribonucleic thermodynamics quantum mechanics relativity chromosome mitochondria",
    category: Category.GAME,
    difficulty_level: DifficultyLevel.EXPERT,
    language: Language.ENGLISH,
    source: "Scientific Terminology"
  },

  // FRENCH SAMPLES
  {
    title: "Mots de Base Français",
    content: "le la les un une des je tu il elle nous vous ils elles avoir être faire aller voir savoir pouvoir vouloir",
    category: Category.LESSON,
    difficulty_level: DifficultyLevel.BEGINNER,
    language: Language.FRENCH,
    source: "Français de Base"
  },
  {
    title: "Citation Française",
    content: "La vie est un sommeil, l'amour en est le rêve, et vous aurez vécu si vous avez aimé.",
    category: Category.QUOTE,
    difficulty_level: DifficultyLevel.INTERMEDIATE,
    language: Language.FRENCH,
    source: "Alfred de Musset"
  },

  // SPANISH SAMPLES
  {
    title: "Palabras Básicas Español",
    content: "el la los las un una unos unas yo tú él ella nosotros vosotros ellos ellas ser estar tener hacer ir ver saber poder querer",
    category: Category.LESSON,
    difficulty_level: DifficultyLevel.BEGINNER,
    language: Language.SPANISH,
    source: "Español Básico"
  },
  {
    title: "Cita Española",
    content: "En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo.",
    category: Category.QUOTE,
    difficulty_level: DifficultyLevel.INTERMEDIATE,
    language: Language.SPANISH,
    source: "Miguel de Cervantes"
  },

  // GERMAN SAMPLES
  {
    title: "Deutsche Grundwörter",
    content: "der die das ein eine ich du er sie es wir ihr sie haben sein werden können müssen wollen sollen dürfen",
    category: Category.LESSON,
    difficulty_level: DifficultyLevel.BEGINNER,
    language: Language.GERMAN,
    source: "Deutsche Grundlagen"
  },
  {
    title: "Deutsches Zitat",
    content: "Zwei Dinge sind unendlich, das Universum und die menschliche Dummheit, aber bei dem Universum bin ich mir noch nicht ganz sicher.",
    category: Category.QUOTE,
    difficulty_level: DifficultyLevel.INTERMEDIATE,
    language: Language.GERMAN,
    source: "Albert Einstein"
  }
];

export const courseSeeds = [
  {
    name: "Beginner Typing Fundamentals",
    description: "Learn the basics of touch typing with proper finger placement and build muscle memory for the keyboard."
  },
  {
    name: "Intermediate Speed Building",
    description: "Improve your typing speed and accuracy with more complex texts and common word patterns."
  },
  {
    name: "Advanced Technical Typing",
    description: "Master advanced typing with technical terms, code snippets, and complex punctuation."
  },
  {
    name: "Typing Games & Challenges",
    description: "Fun and engaging typing games to practice while having fun with different themes."
  },
  {
    name: "Multilingual Practice",
    description: "Practice typing in different languages including French, Spanish, and German."
  }
];

/** Resolved at seed time via course name + text sample title (stable UUIDs). */
export const lessonSeeds = [
  // BEGINNER COURSE LESSONS
  {
    courseName: "Beginner Typing Fundamentals",
    textSampleTitle: "Basic Home Row Keys",
    title: "Home Row Foundation",
    description:
      "Master the home row keys (ASDF JKL;) with proper finger placement",
    order_index: 1,
  },
  {
    courseName: "Beginner Typing Fundamentals",
    textSampleTitle: "Top Row Introduction",
    title: "Top Row Introduction",
    description: "Learn the QWER TYUI keys above the home row",
    order_index: 2,
  },
  {
    courseName: "Beginner Typing Fundamentals",
    textSampleTitle: "Bottom Row Practice",
    title: "Bottom Row Practice",
    description: "Practice the ZXCV BNM, keys below the home row",
    order_index: 3,
  },
  {
    courseName: "Beginner Typing Fundamentals",
    textSampleTitle: "Simple Words",
    title: "Simple Word Practice",
    description: "Combine letters into common English words",
    order_index: 4,
  },
  {
    courseName: "Beginner Typing Fundamentals",
    textSampleTitle: "Common Letter Combinations",
    title: "Common Suffixes",
    description: "Practice common letter combinations and word endings",
    order_index: 5,
  },

  // INTERMEDIATE COURSE LESSONS
  {
    courseName: "Intermediate Speed Building",
    textSampleTitle: "Numbers and Symbols",
    title: "Numbers & Symbols",
    description: "Master numbers and special characters on the keyboard",
    order_index: 1,
  },
  {
    courseName: "Intermediate Speed Building",
    textSampleTitle: "Capitalization Practice",
    title: "Capitalization Skills",
    description: "Practice proper capitalization and shift key usage",
    order_index: 2,
  },
  {
    courseName: "Intermediate Speed Building",
    textSampleTitle: "Common Sentences",
    title: "Sentence Practice",
    description: "Type complete sentences with proper punctuation",
    order_index: 3,
  },
  {
    courseName: "Intermediate Speed Building",
    textSampleTitle: "Speed Building Words",
    title: "Speed Building",
    description: "Increase your speed with common word patterns",
    order_index: 4,
  },
  {
    courseName: "Intermediate Speed Building",
    textSampleTitle: "Technical Terms",
    title: "Technical Vocabulary",
    description: "Practice typing common programming and technical terms",
    order_index: 5,
  },

  // ADVANCED COURSE LESSONS
  {
    courseName: "Advanced Technical Typing",
    textSampleTitle: "Complex Punctuation",
    title: "Advanced Punctuation",
    description: "Master complex punctuation and special characters",
    order_index: 1,
  },
  {
    courseName: "Advanced Technical Typing",
    textSampleTitle: "Mixed Case Challenge",
    title: "Mixed Case Challenge",
    description: "Practice with technical acronyms and mixed capitalization",
    order_index: 2,
  },
  {
    courseName: "Advanced Technical Typing",
    textSampleTitle: "Code Snippets",
    title: "Code Typing Practice",
    description:
      "Type actual code snippets to build programming typing skills",
    order_index: 3,
  },
  {
    courseName: "Advanced Technical Typing",
    textSampleTitle: "Special Characters",
    title: "Special Characters Mastery",
    description: "Practice with extended character sets and symbols",
    order_index: 4,
  },

  // GAMES COURSE LESSONS
  {
    courseName: "Typing Games & Challenges",
    textSampleTitle: "Animal Names Speed Test",
    title: "Animal Kingdom Challenge",
    description: "Fun typing game with animal names",
    order_index: 1,
  },
  {
    courseName: "Typing Games & Challenges",
    textSampleTitle: "Color Rush",
    title: "Color Rush",
    description: "Type color names as fast as you can",
    order_index: 2,
  },
  {
    courseName: "Typing Games & Challenges",
    textSampleTitle: "Food Challenge",
    title: "Food Challenge",
    description: "Practice with food-related vocabulary",
    order_index: 3,
  },
  {
    courseName: "Typing Games & Challenges",
    textSampleTitle: "Geography Quiz",
    title: "Geography Quiz",
    description: "Learn geography while practicing typing",
    order_index: 4,
  },
  {
    courseName: "Typing Games & Challenges",
    textSampleTitle: "Science Terms",
    title: "Science Terminology",
    description: "Challenge yourself with scientific terms",
    order_index: 5,
  },

  // MULTILINGUAL COURSE LESSONS
  {
    courseName: "Multilingual Practice",
    textSampleTitle: "Mots de Base Français",
    title: "French Basics",
    description: "Practice typing basic French vocabulary",
    order_index: 1,
  },
  {
    courseName: "Multilingual Practice",
    textSampleTitle: "Citation Française",
    title: "French Quote Practice",
    description: "Type a beautiful French quotation",
    order_index: 2,
  },
  {
    courseName: "Multilingual Practice",
    textSampleTitle: "Palabras Básicas Español",
    title: "Spanish Basics",
    description: "Practice typing basic Spanish vocabulary",
    order_index: 3,
  },
  {
    courseName: "Multilingual Practice",
    textSampleTitle: "Cita Española",
    title: "Spanish Quote Practice",
    description: "Type a classic Spanish literary quote",
    order_index: 4,
  },
  {
    courseName: "Multilingual Practice",
    textSampleTitle: "Deutsche Grundwörter",
    title: "German Basics",
    description: "Practice typing basic German vocabulary",
    order_index: 5,
  },
  {
    courseName: "Multilingual Practice",
    textSampleTitle: "Deutsches Zitat",
    title: "German Quote Practice",
    description: "Type a famous German quotation",
    order_index: 6,
  },
] as const;
