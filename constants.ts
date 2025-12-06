
import { DrillContent, SpeedQuestion, WarmupExercise, ShadowingContent, KeywordChallenge, UserPersona, VocabCategory, AvatarConfig } from "./types";

export const PERSONAS: { id: string; label: string; labelAr: string; desc: string; descAr: string; avatar: AvatarConfig }[] = [
  { 
    id: 'business', 
    label: 'Business Professional', 
    labelAr: 'احترافي أعمال',
    desc: 'Negotiation, Leadership, & Diplomacy.', 
    descAr: 'التفاوض، القيادة، والدبلوماسية.',
    avatar: { style: 'avataaars', seed: 'BusinessMan' }
  },
  { 
    id: 'developer', 
    label: 'Software Developer', 
    labelAr: 'مطور برمجيات',
    desc: 'Standups, Tech Reviews, & Architecture.', 
    descAr: 'اجتماعات الفريق، المراجعات التقنية، والهيكلة.',
    avatar: { style: 'avataaars', seed: 'DevGeek' }
  },
  { 
    id: 'academic', 
    label: 'Academic/Researcher', 
    labelAr: 'باحث / أكاديمي',
    desc: 'Thesis Defense, Lectures, & Logic.', 
    descAr: 'مناقشة الرسائل، المحاضرات، والمنطق.',
    avatar: { style: 'avataaars', seed: 'Professor' }
  },
  { 
    id: 'kids', 
    label: 'Kids & Fun', 
    labelAr: 'أطفال ومرح',
    desc: 'Adventures, Animals, & Magic.', 
    descAr: 'مغامرات، حيوانات، وسحر.',
    avatar: { style: 'avataaars', seed: 'Kiddo' }
  }
];

export const AGENT_SYSTEM_PROMPT = `
You are "FluencyFlow Agent", a friendly, empathetic, and highly skilled linguistic therapist.
Your goal is to have a natural conversation with the user while subtly correcting their pronunciation and grammar.
- Start by asking how their day was or what they are working on (based on their persona).
- Listen to their input.
- Reply with empathy first (connect emotionally).
- Then, provide 1-2 specific, gentle corrections regarding their pronunciation or grammar.
- Keep responses short (under 40 words) to maintain flow.
`;

export const AGENT_PROMPTS = {
  GREETING: "Hello! How can I help you improve your English today?",
  GREETING_AR: "مرحباً! كيف يمكنني مساعدتك في تحسين لغتك الإنجليزية اليوم؟"
};

export const COACH_PERSONA = `
Role: You are an elite "Accent & Fluency Coach" specializing in correcting articulation mechanics (Phonetics), muscle memory, and English thinking speed.

Core Philosophy:
1. Articulation Weakness: Incorrect tongue/lip placement for specific phonemes (TH, R/L, V/W, MPT).
2. Weak Muscle Memory: Mouth not trained for English articulatory settings.
3. Slow English Thinking Speed: Translation gap.

Protocol:
- Be strict but encouraging.
- Focus heavily on the physical mechanics (e.g., "Your tongue wasn't between your teeth for the TH").
- Keep feedback concise and actionable.
- ADAPT OUTPUT LANGUAGE: If the user requests Arabic, provide the explanation in Arabic but keep English terms like "TH", "P", "R" in English.

Output Format:
- STRICTLY use Markdown.
- Use bullet points for specific corrections.
- Bold key terms.
`;

export const LEVELS = [
  { level: 1, minXp: 0, label: "Novice", labelAr: "مبتدئ" },
  { level: 5, minXp: 500, label: "Apprentice", labelAr: "متدرب" },
  { level: 10, minXp: 1500, label: "Master", labelAr: "محترف" },
  { level: 50, minXp: 10000, label: "Legend", labelAr: "أسطورة" }
];

export const DIAGNOSTIC_TEXT = "Please call Stella. Ask her to bring these things with her from the store: Six spoons of fresh snow peas, five thick slabs of blue cheese, and maybe a snack for her brother Bob. We also need a small plastic snake and a big toy frog for the kids. She can scoop these things into three red bags, and then we will go meet her at the train station.";

export const MINIMAL_PAIRS_DRILLS: DrillContent[] = [
  {
    id: 'p_b',
    title: 'P vs B',
    titleAr: 'الفرق بين P و B',
    text: "Pack the bags before back tracking.",
    focus: "Explosive 'P' (Air puff) vs Voiced 'B' (Vibration).",
    focusAr: "الـ P انفجارية (هواء) والـ B مهتزة.",
    guide: "Hold a paper. P moves it, B doesn't.",
    type: 'MINIMAL_PAIR',
    category: 'general',
    viseme: 'p'
  },
  {
    id: 'f_v',
    title: 'F vs V',
    titleAr: 'الفرق بين F و V',
    text: "Five vines flourish very fast.",
    focus: "Top teeth on bottom lip. F is silent, V vibrates.",
    focusAr: "الأسنان العليا على الشفة السفلى. F صامتة، V مهتزة.",
    guide: "Feel the buzz on your lip for V.",
    type: 'MINIMAL_PAIR',
    category: 'general',
    viseme: 'f'
  },
  {
    id: 'th_s',
    title: 'TH vs S',
    titleAr: 'الفرق بين TH و S',
    text: "Thinking of sinking in the thick sea.",
    focus: "Tongue OUT for TH. Tongue IN for S.",
    focusAr: "اللسان خارج الأسنان للـ TH، وداخلها للـ S.",
    guide: "Don't hide your tongue for TH.",
    type: 'MINIMAL_PAIR',
    category: 'general',
    viseme: 'th'
  }
];

export const PRONUNCIATION_DRILLS: DrillContent[] = [
  // Developer Scenarios
  {
    id: 'dev_1',
    title: 'Scenario: Daily Standup',
    titleAr: 'سيناريو: الاجتماع اليومي',
    text: "I patched the bug, deployed the fix, and updated the ticket.",
    focus: "Past tense endings (-ed) and clarity.",
    focusAr: "نهايات الماضي (-ed) والوضوح.",
    guide: "Patched (t), Deployed (d), Updated (id).",
    category: 'developer',
    viseme: 'p'
  },
  {
    id: 'dev_2',
    title: 'Scenario: Architecture Defense',
    titleAr: 'سيناريو: مناقشة الهيكلة',
    text: "We chose PostgreSQL for data integrity regarding ACID compliance.",
    focus: "Tech acronyms and flow.",
    focusAr: "المصطلحات التقنية والانسيابية.",
    guide: "Stress 'Post', 'SQL', and 'ACID'.",
    category: 'developer',
    viseme: 's'
  },
  // Business Scenarios
  {
    id: 'bus_1',
    title: 'Scenario: Negotiation',
    titleAr: 'سيناريو: التفاوض',
    text: "I see your point, however, we need to consider the ROI first.",
    focus: "Polite pushback tone and R sounds.",
    focusAr: "نبرة الاعتراض المؤدب ومخارج الـ R.",
    guide: "Soft R in 'However', Strong R in 'ROI'.",
    category: 'business',
    viseme: 'r'
  },
  // Academic Scenarios
  {
    id: 'acad_1',
    title: 'Scenario: Methodology',
    titleAr: 'سيناريو: المنهجية',
    text: "The qualitative data suggests a strong correlation, not causality.",
    focus: "Multi-syllabic words and rhythm.",
    focusAr: "الكلمات متعددة المقاطع والإيقاع.",
    guide: "Tap the rhythm: Qua-li-ta-tive.",
    category: 'academic',
    viseme: 'l'
  },
  // Kids
  {
    id: 'kid_1',
    title: 'Scenario: Jungle Adventure',
    titleAr: 'سيناريو: مغامرة الغابة',
    text: "The snake says Ssss and the bee says Zzzz!",
    focus: "S vs Z sounds.",
    focusAr: "الفرق بين صوت الثعبان والنحلة.",
    guide: "S is hiss, Z is buzz.",
    category: 'kids',
    viseme: 's'
  }
];

export const SPEED_QUESTIONS: SpeedQuestion[] = [
  { id: 'q1', question: "How do you handle a serious bug in production?", category: 'developer' },
  { id: 'q2', question: "Why should we choose your company?", category: 'business' },
  { id: 'q3', question: "Explain your research hypothesis.", category: 'academic' },
  { id: 'q4', question: "What is your favorite animal and why?", category: 'kids' },
  { id: 'q5', question: "Tell me about yourself in one sentence.", category: 'general' }
];

export const WARMUP_EXERCISES: WarmupExercise[] = [
  { id: 'w1', title: 'Jaw Drop', titleAr: 'تحرير الفك', instruction: 'Open your mouth wide as if yawning, then relax. Repeat slowly.', instructionAr: 'افتح فمك كأنك تتثاءب ثم استرخ.', duration: 15, icon: 'jaw' },
  { id: 'w2', title: 'Lip Trills', titleAr: 'اهتزاز الشفاه', instruction: 'Blow air through your lips to make them vibrate (Brrrr sound).', instructionAr: 'انفخ الهواء عبر شفتيك لتهتز (صوت برررر).', duration: 15, icon: 'lips' },
  { id: 'w3', title: 'Tongue Stretch', titleAr: 'إطالة اللسان', instruction: 'Stick your tongue out as far as possible, then pull it back.', instructionAr: 'أخرج لسانك لأقصى حد ثم اسحبه للداخل.', duration: 15, icon: 'tongue' }
];

export const SHADOWING_DRILLS: ShadowingContent[] = [
  { id: 's1', text: "Success is not final, failure is not fatal.", visemeFocus: 'f', guide: "Focus on F/V vibration." },
  { id: 's2', text: "The quick brown fox jumps over the lazy dog.", visemeFocus: 'th', guide: "Classic pangram for all sounds." },
  { id: 's3', text: "She sells seashells by the seashore.", visemeFocus: 's', guide: "S vs SH distinction." }
];

export const GAME_WORDS = [
  { id: '1', word: 'Think', match: 'Thought' },
  { id: '2', word: 'Speak', match: 'Spoke' },
  { id: '3', word: 'Write', match: 'Wrote' },
  { id: '4', word: 'Read', match: 'Read' },
  { id: '5', word: 'Teach', match: 'Taught' },
  { id: '6', word: 'Buy', match: 'Bought' }
];

export const KEYWORD_CHALLENGES: Record<string, KeywordChallenge[]> = {
  developer: [
    { 
      id: 'k1', word: 'Kubernetes', phonetics: '/ˌkjuːbərˈnɛtiz/', 
      definition: 'Container orchestration system.', definitionAr: 'نظام تنسيق الحاويات.',
      context: "We deploy our microservices on a Kubernetes cluster.", contextAr: "ننشر خدماتنا المصغرة على مجموعة Kubernetes.",
      difficulty: 'Elite' 
    },
    { 
      id: 'k2', word: 'Idempotency', phonetics: '/ˌaɪdəmˈpoʊtənsi/', 
      definition: 'Property of certain operations.', definitionAr: 'خاصية لبعض العمليات تضمن نفس النتيجة عند التكرار.',
      context: "Ensure the API endpoint guarantees idempotency to prevent duplicate charges.", contextAr: "تأكد من أن نقطة نهاية API تضمن التكرار لمنع الرسوم المكررة.",
      difficulty: 'Master' 
    }
  ],
  business: [
    { 
      id: 'k3', word: 'Entrepreneurship', phonetics: '/ˌɒntrəprəˈnɜːʃɪp/', 
      definition: 'Setting up a business.', definitionAr: 'ريادة الأعمال.',
      context: "Entrepreneurship requires resilience and vision.", contextAr: "تتطلب ريادة الأعمال المرونة والرؤية.",
      difficulty: 'Legend' 
    },
    { 
      id: 'k4', word: 'Synergy', phonetics: '/ˈsɪnərdʒi/', 
      definition: 'Cooperation of two or more agents.', definitionAr: 'تضافر الجهود.',
      context: "The synergy between the two teams improved efficiency.", contextAr: "أدى التآزر بين الفريقين إلى تحسين الكفاءة.",
      difficulty: 'Master' 
    }
  ],
  academic: [
    { 
      id: 'k5', word: 'Methodology', phonetics: '/ˌmɛθəˈdɒlədʒi/', 
      definition: 'System of methods used in a particular area.', definitionAr: 'المنهجية.',
      context: "The research methodology was rigorously peer-reviewed.", contextAr: "تمت مراجعة منهجية البحث بدقة من قبل النظراء.",
      difficulty: 'Elite' 
    }
  ],
  kids: [
    { 
      id: 'k6', word: 'Tyrannosaurus', phonetics: '/tɪˌrænəˈsɔːrəs/', 
      definition: 'A large dinosaur.', definitionAr: 'ديناصور ضخم.',
      context: "The Tyrannosaurus Rex is the king of dinosaurs.", contextAr: "الديناصور ريكس هو ملك الديناصورات.",
      difficulty: 'Legend' 
    }
  ]
};

export const VOCAB_CATEGORIES: VocabCategory[] = [
  {
    id: 'greetings',
    title: 'Greetings',
    titleAr: 'التحيات',
    icon: '👋',
    words: [
      { id: 'v1', text: 'Hello', translation: 'مرحباً', emoji: '👋' },
      { id: 'v2', text: 'Good Morning', translation: 'صباح الخير', emoji: '☀️' },
      { id: 'v3', text: 'How are you?', translation: 'كيف حالك؟', emoji: '🤝' },
      { id: 'v4', text: 'Nice to meet you', translation: 'تشرفت بلقائك', emoji: '😊' }
    ]
  },
  {
    id: 'travel',
    title: 'Travel',
    titleAr: 'السفر',
    icon: '✈️',
    words: [
      { id: 'v5', text: 'Airport', translation: 'مطار', emoji: '🛫' },
      { id: 'v6', text: 'Ticket', translation: 'تذكرة', emoji: '🎫' },
      { id: 'v7', text: 'Hotel', translation: 'فندق', emoji: '🏨' },
      { id: 'v8', text: 'Passport', translation: 'جواز سفر', emoji: '🛂' }
    ]
  },
  {
    id: 'food',
    title: 'Food',
    titleAr: 'الطعام',
    icon: '🍔',
    words: [
      { id: 'v9', text: 'Restaurant', translation: 'مطعم', emoji: '🍽️' },
      { id: 'v10', text: 'Water', translation: 'ماء', emoji: '💧' },
      { id: 'v11', text: 'Delicious', translation: 'لذيذ', emoji: '😋' },
      { id: 'v12', text: 'Menu', translation: 'قائمة طعام', emoji: '📜' }
    ]
  },
  {
    id: 'body',
    title: 'Body Parts',
    titleAr: 'أعضاء الجسم',
    icon: '💪',
    words: [
      { id: 'v13', text: 'Head', translation: 'رأس', emoji: '🙂' },
      { id: 'v14', text: 'Arm', translation: 'ذراع', emoji: '💪' },
      { id: 'v15', text: 'Leg', translation: 'ساق', emoji: '🦵' },
      { id: 'v16', text: 'Hand', translation: 'يد', emoji: '✋' }
    ]
  },
  {
    id: 'pronouns',
    title: 'Pronouns',
    titleAr: 'الضمائر',
    icon: '👉',
    words: [
      { id: 'v17', text: 'I', translation: 'أنا', emoji: '🙋' },
      { id: 'v18', text: 'You', translation: 'أنت', emoji: '🫵' },
      { id: 'v19', text: 'He', translation: 'هو', emoji: '👨' },
      { id: 'v20', text: 'She', translation: 'هي', emoji: '👩' }
    ]
  },
  {
    id: 'prepositions',
    title: 'Prepositions',
    titleAr: 'حروف الجر',
    icon: '📦',
    words: [
      { id: 'v21', text: 'In', translation: 'في', emoji: '📥' },
      { id: 'v22', text: 'On', translation: 'على', emoji: '🔛' },
      { id: 'v23', text: 'Under', translation: 'تحت', emoji: '⬇️' },
      { id: 'v24', text: 'Next to', translation: 'بجانب', emoji: '➡️' }
    ]
  }
];

export const TRANSLATIONS = {
  en: {
    title: "FluencyFlow",
    subtitle: "Elite Coach v3.1",
    slogan: "Master the Art of Speech",
    exit: "Exit",
    heroTitle: "Master Your",
    heroFlow: "Flow",
    heroDesc: "Combine precise Articulation Mechanics with Cognitive Recall speed training.",
    startBtn: "Start Daily Session",
    phase1: "Articulation Lab",
    phase2: "Speed & Recall",
    targetPhrase: "Target Phrase",
    mechFocus: "Articulation Focus",
    recordDrill: "Record Drill",
    recording: "Recording...",
    stop: "Stop",
    retry: "Retry",
    analyze: "Analyze",
    feedback: "Coach's Feedback",
    nextPhase: "Next Phase",
    rapidQ: "Rapid Fire Question",
    goalSpeed: "Goal: < 5 Seconds",
    speedInstruction: "Answer in a full sentence immediately.",
    recordAns: "Record Answer",
    analyzeSpeed: "Analyze Speed",
    nextRound: "Next Drill",
    readyRecord: "Ready to record",
    readyAns: "Ready to answer",
    navHome: "Home",
    navDrill: "Drills",
    navSettings: "Profile",
    coach: "Coach",
    transcribeBtn: "Speech to Text",
    transcribeTitle: "AI Transcription",
    transcribeDesc: "Convert speech to text instantly.",
    startTranscribe: "Start Recording",
    transcribing: "Transcribing...",
    transcriptionResult: "Transcription Result",
    copy: "Copy Text",
    copied: "Copied!",
    listen: "Listen to Example",
    accuracyScore: "Accuracy",
    intonationScore: "Intonation",
    modMPT: "Articulation",
    modMuscle: "Muscle Gym",
    modSpeed: "Speed",
    modStudy: "Study Lab",
    modVocab: "Foundations",
    modDescMPT: "Phonetics",
    modDescMuscle: "Warmup & Shadowing",
    modDescSpeed: "Cognitive Recall",
    modDescStudy: "Analyze Any Text",
    modDescVocab: "Zero-G (Beginners)",
    artMenuTitle: "Articulation Lab",
    artDiagnostic: "Diagnostic Test",
    artDiagnosticDesc: "Find weak points (TH, R/L, V/W).",
    artPairs: "Minimal Pairs",
    artPairsDesc: "Fix P/B, F/V, S/Z.",
    artDrills: "Scenario Drills",
    artDrillsDesc: "Real-world situations.",
    artHacking: "Keyword Hacking",
    artHackingDesc: "Master elite terminology.",
    diagnosticText: DIAGNOSTIC_TEXT,
    diagnosticPrompt: "Read the text below naturally. The AI will analyze every sound.",
    diagnosticResult: "Diagnostic Results",
    weaknesses: "Detected Weaknesses",
    recPlan: "Recommended Plan",
    startPlan: "Start Customized Plan",
    muscleMenuTitle: "Muscle Memory Gym",
    warmupBtn: "Warm-up Circuit",
    warmupDesc: "Loosen jaw & tongue.",
    shadowingBtn: "Chat Agent (Shadowing)",
    shadowingDesc: "Live conversation with AI.",
    gameBtn: "Cognitive Game",
    gameDesc: "Memory Match",
    startWarmup: "Start Warm-up",
    startShadowing: "Start Chat",
    startGame: "Start Game",
    nextEx: "Next",
    finishWarmup: "Finish",
    shadowingInst: "Listen, observe, and repeat.",
    visemeGuide: "Visual Guide",
    settingsTitle: "Settings",
    trainingPersona: "Training Persona",
    selectPersona: "Select Persona",
    audioPref: "Audio Preferences",
    engineType: "TTS Engine",
    engineBrowser: "Browser (Fast)",
    engineGemini: "Gemini (Realistic)",
    voiceGender: "Voice Gender",
    voiceMale: "Male",
    voiceFemale: "Female",
    playbackSpeed: "Playback Speed",
    testVoice: "Test Voice",
    savePref: "Save Preferences",
    saved: "Saved!",
    backHome: "Back to Home",
    backMenu: "Back to Menu",
    vocabTitle: "Foundations: Zero-G",
    vocabDesc: "Essential vocabulary for absolute beginners.",
    studyTitle: "Study Lab",
    studyDesc: "Visualize any text as an infographic.",
    pasteText: "Paste your text here...",
    gameTitle: "Memory Match",
    moves: "Moves",
    pairs: "Pairs",
    gameComplete: "Game Complete!",
    level: "Level",
    points: "Points",
    energy: "Energy",
    streak: "Streak",
    listenNative: "Listen to Native",
    referenceWave: "Reference Pattern",
    noEnergy: "Not enough energy! Wait for refill."
  },
  ar: {
    title: "FluencyFlow",
    subtitle: "المدرب المتقدم V3.1",
    slogan: "أتقن فن الحديث",
    exit: "خروج",
    heroTitle: "أتقن",
    heroFlow: "طلاقتك",
    heroDesc: "اجمع بين دقة مخارج الحروف وسرعة التفكير بالإنجليزية.",
    startBtn: "ابدأ الجلسة اليومية",
    phase1: "مختبر النطق",
    phase2: "السرعة والاستدعاء",
    targetPhrase: "الجملة المستهدفة",
    mechFocus: "التركيز الحركي",
    recordDrill: "سجل التدريب",
    recording: "جاري التسجيل...",
    stop: "توقف",
    retry: "إعادة المحاولة",
    analyze: "تحليل",
    feedback: "تقرير المدرب",
    nextPhase: "المرحلة التالية",
    rapidQ: "سؤال سرعة بديهة",
    goalSpeed: "الهدف: < 5 ثواني",
    speedInstruction: "أجب بجملة كاملة فوراً.",
    recordAns: "سجل الإجابة",
    analyzeSpeed: "تحليل السرعة",
    nextRound: "التدريب التالي",
    readyRecord: "جاهز للتسجيل",
    readyAns: "جاهز للإجابة",
    navHome: "الرئيسية",
    navDrill: "تدريبات",
    navSettings: "الملف الشخصي",
    coach: "المدرب",
    transcribeBtn: "تحويل الصوت لنص",
    transcribeTitle: "النسخ الذكي",
    transcribeDesc: "حول كلامك لنص فورا.",
    startTranscribe: "ابدأ التسجيل",
    transcribing: "جاري النسخ...",
    transcriptionResult: "نتيجة النسخ",
    copy: "نسخ النص",
    copied: "تم النسخ!",
    listen: "استمع للمثال",
    accuracyScore: "الدقة",
    intonationScore: "النغم",
    modMPT: "التركيز الحركي",
    modMuscle: "جيم اللسان",
    modSpeed: "سرعة التفكير",
    modStudy: "معمل الدراسة",
    modVocab: "التأسيس (Zero-G)",
    modDescMPT: "صوتيات (Phonetics)",
    modDescMuscle: "إحماء ومحاكاة",
    modDescSpeed: "الاستدعاء الذهني",
    modDescStudy: "حلل أي نص",
    modDescVocab: "للمبتدئين",
    artMenuTitle: "مختبر النطق",
    artDiagnostic: "اختبار تشخيصي",
    artDiagnosticDesc: "اكتشف نقاط الضعف (TH, R, S).",
    artPairs: "الأزواج الصغرى",
    artPairsDesc: "عالج خلط الحروف (P/B, F/V).",
    artDrills: "سيناريوهات",
    artDrillsDesc: "مواقف واقعية.",
    artHacking: "اختراق المصطلحات",
    artHackingDesc: "أتقن مصطلحات النخبة.",
    diagnosticText: DIAGNOSTIC_TEXT,
    diagnosticPrompt: "اقرأ النص بالأسفل بشكل طبيعي. الذكاء الاصطناعي سيحلل كل صوت.",
    diagnosticResult: "نتائج التشخيص",
    weaknesses: "نقاط الضعف المكتشفة",
    recPlan: "الخطة المقترحة",
    startPlan: "ابدأ الخطة المخصصة",
    muscleMenuTitle: "جيم الذاكرة العضلية",
    warmupBtn: "دائرة الإحماء",
    warmupDesc: "تليين الفك واللسان.",
    shadowingBtn: "محادثة (Shadowing)",
    shadowingDesc: "محادثة حية مع الذكاء الاصطناعي.",
    gameBtn: "لعبة ذهنية",
    gameDesc: "تطابق الذاكرة",
    startWarmup: "ابدأ الإحماء",
    startShadowing: "ابدأ المحادثة",
    startGame: "ابدأ اللعبة",
    nextEx: "التالي",
    finishWarmup: "إنهاء",
    shadowingInst: "استمع، لاحظ، وكرر.",
    visemeGuide: "الدليل البصري",
    settingsTitle: "الإعدادات",
    trainingPersona: "شخصية التدريب",
    selectPersona: "اختر الشخصية",
    audioPref: "تفضيلات الصوت",
    engineType: "محرك الصوت",
    engineBrowser: "المتصفح (سريع)",
    engineGemini: "جيمناي (واقعي)",
    voiceGender: "نوع الصوت",
    voiceMale: "رجل",
    voiceFemale: "أنثى",
    playbackSpeed: "سرعة التشغيل",
    testVoice: "اختبار الصوت",
    savePref: "حفظ التفضيلات",
    saved: "تم الحفظ!",
    backHome: "عودة للرئيسية",
    backMenu: "عودة للقائمة",
    vocabTitle: "التأسيس: Zero-G",
    vocabDesc: "كلمات أساسية للمبتدئين تماماً.",
    studyTitle: "معمل الدراسة",
    studyDesc: "حول أي نص لإنفوجرافيك بصري.",
    pasteText: "الصق النص هنا...",
    gameTitle: "تطابق الذاكرة",
    moves: "حركات",
    pairs: "أزواج",
    gameComplete: "اكتملت اللعبة!",
    level: "مستوى",
    points: "نقطة",
    energy: "طاقة",
    streak: "يوم",
    listenNative: "استمع للأصلي",
    referenceWave: "الموجة المثالية",
    noEnergy: "لا توجد طاقة كافية! انتظر إعادة الشحن."
  }
};
