
import { DrillContent, SpeedQuestion, WarmupExercise, ShadowingContent } from "./types";

export const PERSONAS = [
  { 
    id: 'business', 
    label: 'Business Professional', 
    labelAr: 'احترافي أعمال',
    desc: 'Focus on clear, confident articulation for meetings.', 
    descAr: 'التركيز على النطق الواضح والثقة للاجتماعات.' 
  },
  { 
    id: 'developer', 
    label: 'Software Developer', 
    labelAr: 'مطور برمجيات',
    desc: 'Focus on technical terms (API, Cache, SQL).', 
    descAr: 'التركيز على المصطلحات التقنية (API, Cache, SQL).' 
  },
  { 
    id: 'academic', 
    label: 'Academic/Researcher', 
    labelAr: 'باحث / أكاديمي',
    desc: 'Focus on complex vocabulary and formal tone.', 
    descAr: 'التركيز على المفردات المعقدة والنبرة الرسمية.' 
  },
  { 
    id: 'kids', 
    label: 'Kids & Fun', 
    labelAr: 'أطفال ومرح',
    desc: 'Simple sounds, fun tongue twisters.', 
    descAr: 'أصوات بسيطة وجمل ممتعة.' 
  }
];

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

Output Format:
- STRICTLY use Markdown.
- Use bullet points for specific corrections.
- Bold key terms.
`;

export const LEVELS = [
  { level: 1, minXp: 0, label: "Novice Speaker", labelAr: "متحدث مبتدئ" },
  { level: 5, minXp: 500, label: "Articulation Apprentice", labelAr: "متدرب مخارج" },
  { level: 10, minXp: 1500, label: "Fluency Master", labelAr: "سيد الطلاقة" },
  { level: 50, minXp: 10000, label: "Native-Like Legend", labelAr: "أسطورة" }
];

export const TRANSLATIONS = {
  en: {
    title: "FluencyFlow",
    subtitle: "Elite Coach v3.1",
    slogan: "Master the Art of Speech",
    exit: "Exit Session",
    heroTitle: "Master Your",
    heroFlow: "Flow",
    heroDesc: "Combine precise Articulation Mechanics with Cognitive Recall speed training. Your elite AI coach is ready to analyze your muscle memory and thinking speed.",
    startBtn: "Start Training Session",
    phase1: "Phase 1: Articulation Lab",
    phase2: "Phase 2: Speed & Cognitive Recall",
    targetPhrase: "Target Phrase",
    mechFocus: "Articulation Focus",
    recordDrill: "Record Drill",
    recording: "Recording...",
    stop: "Stop Recording",
    retry: "Retry",
    analyze: "Analyze Mechanics",
    feedback: "Coach's Feedback",
    nextPhase: "Phase 2: Cognitive Recall",
    rapidQ: "Rapid Fire Question",
    goalSpeed: "Goal: < 5 Seconds",
    speedInstruction: "Answer in a full sentence immediately. Don't translate.",
    recordAns: "Record Answer",
    analyzeSpeed: "Analyze Speed",
    nextRound: "Next Drill",
    readyRecord: "Ready to record",
    readyAns: "Ready to answer",
    navHome: "Home",
    navDrill: "Drills",
    navSettings: "Profile",
    coach: "Coach",
    // Transcription
    transcribeBtn: "Speech to Text",
    transcribeTitle: "AI Transcription",
    transcribeDesc: "Convert speech to text instantly.",
    startTranscribe: "Start Recording",
    transcribing: "Transcribing...",
    transcriptionResult: "Transcription Result",
    copy: "Copy Text",
    copied: "Copied!",
    listen: "Listen to Example",
    accuracyScore: "Phonetic Accuracy",
    intonationScore: "Intonation & Stress",
    // Modules
    modMPT: "Articulation Lab",
    modMuscle: "Muscle Memory",
    modSpeed: "Thinking Speed",
    modDescMPT: "Phonetics & Diagnostics",
    modDescMuscle: "Gym for your Mouth",
    modDescSpeed: "Cognitive Recall",
    // Articulation Menu
    artMenuTitle: "Articulation Lab",
    artDiagnostic: "AI Diagnostic Test",
    artDiagnosticDesc: "Identify your weak points (TH, R/L, V/W) in one go.",
    artPairs: "Minimal Pairs",
    artPairsDesc: "Fix P/B, F/V, S/Z.",
    artDrills: "Standard Drills",
    artDrillsDesc: "Practice core phonemes.",
    diagnosticText: "Please call Stella. Ask her to bring these things with her from the store: Six spoons of fresh snow peas, five thick slabs of blue cheese, and maybe a snack for her brother Bob. We also need a small plastic snake and a big toy frog for the kids. She can scoop these things into three red bags, and then we will go meet her at the train station.",
    diagnosticPrompt: "Read the text below naturally. The AI will analyze every sound.",
    diagnosticResult: "Diagnostic Results",
    weaknesses: "Detected Weaknesses",
    recPlan: "Recommended Plan",
    startPlan: "Start Customized Plan",
    // Muscle Memory
    muscleMenuTitle: "Muscle Memory Gym",
    warmupBtn: "Warm-up Circuit",
    warmupDesc: "Loosen jaw & tongue before training.",
    shadowingBtn: "Shadowing (Visemes)",
    shadowingDesc: "Listen, See, and Repeat instantly.",
    gameBtn: "Cognitive Warm-up",
    gameDesc: "Memory Match Game",
    startWarmup: "Start Warm-up",
    startShadowing: "Start Shadowing",
    startGame: "Start Game",
    nextEx: "Next Exercise",
    finishWarmup: "Finish Warm-up",
    shadowingInst: "Listen to the audio, observe the mouth shape, and repeat immediately.",
    visemeGuide: "Visual Guide",
    sideView: "Side View",
    listenNative: "Listen to Native Audio",
    backMenu: "Back to Menu",
    backHome: "Back to Home",
    waveformTitle: "Your Waveform",
    referenceWave: "Ideal Pattern",
    // Settings
    settingsTitle: "Settings",
    audioPref: "Audio Preferences",
    voiceGender: "Voice Gender",
    voiceMale: "Male",
    voiceFemale: "Female",
    voiceClone: "My Voice Clone",
    comingSoon: "Soon",
    playbackSpeed: "Playback Speed",
    speedSlow: "Slow (0.75x)",
    speedNormal: "Normal (1.0x)",
    speedFast: "Fast (1.25x)",
    testVoice: "Test Voice",
    trainingPersona: "Training Persona",
    selectPersona: "Select Persona",
    savePref: "Save Preferences",
    saved: "Saved!",
    // Footer
    footerText: "FluencyFlow AI. Elite Coaching System.",
    footerPrivacy: "Privacy Protocol",
    footerStatus: "System Status",
    footerSettings: "Settings",
    builtWith: "Built with ❤️ and AI",
    // Gamification
    level: "Level",
    streak: "Streak",
    day: "Day",
    points: "XP",
    nextLevel: "Next Level",
    // Game
    gameTitle: "Memory Match",
    moves: "Moves",
    pairs: "Pairs",
    gameComplete: "Level Complete!"
  },
  ar: {
    title: "FluencyFlow",
    subtitle: "المدرب المتقدم v3.1",
    slogan: "أتقن فن الكلام",
    exit: "إنهاء الجلسة",
    heroTitle: "أتقن",
    heroFlow: "طلاقتك",
    heroDesc: "اجمع بين دقة مخارج الحروف (Articulation) وتدريب سرعة الاستدعاء الذهني. مدرب الذكاء الاصطناعي جاهز لتحليل ذاكرتك العضلية وسرعة تفكيرك.",
    startBtn: "ابدأ التدريب",
    phase1: "المرحلة 1: مختبر النطق",
    phase2: "المرحلة 2: السرعة والاستدعاء الذهني",
    targetPhrase: "العبارة المستهدفة",
    mechFocus: "التركيز الحركي",
    recordDrill: "سجل الآن",
    recording: "جاري التسجيل...",
    stop: "إيقاف التسجيل",
    retry: "إعادة المحاولة",
    analyze: "تحليل الأداء",
    feedback: "تقرير المدرب",
    nextPhase: "المرحلة 2: الاستدعاء الذهني",
    rapidQ: "سؤال سريع",
    goalSpeed: "الهدف: أقل من 5 ثوانٍ",
    speedInstruction: "أجب بجملة كاملة فوراً. لا تترجم في عقلك.",
    recordAns: "سجل الإجابة",
    analyzeSpeed: "تحليل السرعة",
    nextRound: "التالي",
    readyRecord: "جاهز للتسجيل",
    readyAns: "جاهز للتسجيل",
    navHome: "الرئيسية",
    navDrill: "المختبر",
    navSettings: "حسابي",
    coach: "المدرب",
    // Transcription
    transcribeBtn: "تحويل الكلام لنص",
    transcribeTitle: "النسخ الذكي",
    transcribeDesc: "حول كلامك إلى نص فوري.",
    startTranscribe: "ابدأ التسجيل",
    transcribing: "جاري النسخ...",
    transcriptionResult: "النص المستخرج",
    copy: "نسخ النص",
    copied: "تم النسخ!",
    listen: "استمع للمثال",
    accuracyScore: "دقة المخارج",
    intonationScore: "التنغيم والنبر",
    // Modules
    modMPT: "مختبر النطق",
    modMuscle: "الذاكرة العضلية",
    modSpeed: "سرعة التفكير",
    modDescMPT: "التشخيص والصوتيات",
    modDescMuscle: "جيم للفم واللسان",
    modDescSpeed: "الاستدعاء الذهني",
    // Articulation Menu
    artMenuTitle: "مختبر النطق",
    artDiagnostic: "الاختبار التشخيصي",
    artDiagnosticDesc: "حدد نقاط ضعفك (TH, R/L, V/W) في اختبار واحد.",
    artPairs: "الأزواج الصغرى",
    artPairsDesc: "عالج الخلط بين P/B, F/V, S/Z.",
    artDrills: "التمارين الأساسية",
    artDrillsDesc: "تدرب على الأصوات الرئيسية.",
    diagnosticText: "Please call Stella. Ask her to bring these things with her from the store: Six spoons of fresh snow peas, five thick slabs of blue cheese, and maybe a snack for her brother Bob. We also need a small plastic snake and a big toy frog for the kids. She can scoop these things into three red bags, and then we will go meet her at the train station.",
    diagnosticPrompt: "اقرأ النص أدناه بشكل طبيعي. سيقوم الذكاء الاصطناعي بتحليل كل صوت.",
    diagnosticResult: "نتيجة التشخيص",
    weaknesses: "نقاط الضعف",
    recPlan: "الخطة المقترحة",
    startPlan: "ابدأ الخطة المخصصة",
    // Muscle Memory
    muscleMenuTitle: "نادي الذاكرة العضلية",
    warmupBtn: "تمارين الإحماء",
    warmupDesc: "تليين الفك واللسان قبل التدريب.",
    shadowingBtn: "المحاكاة (Visemes)",
    shadowingDesc: "اسمع، شاهد، وردد فوراً.",
    gameBtn: "تنشيط ذهني",
    gameDesc: "لعبة تطابق الذاكرة",
    startWarmup: "ابدأ الإحماء",
    startShadowing: "ابدأ المحاكاة",
    startGame: "ابدأ اللعبة",
    nextEx: "التمرين التالي",
    finishWarmup: "إنهاء الإحماء",
    shadowingInst: "استمع للصوت، لاحظ شكل الفم، وردد فوراً.",
    visemeGuide: "الدليل البصري",
    sideView: "منظور جانبي",
    listenNative: "استمع للنطق الصحيح",
    backMenu: "القائمة",
    backHome: "الرئيسية",
    waveformTitle: "الموجة الصوتية",
    referenceWave: "النمط المثالي",
     // Settings
    settingsTitle: "الإعدادات",
    audioPref: "تفضيلات الصوت",
    voiceGender: "صوت القارئ",
    voiceMale: "رجل",
    voiceFemale: "امرأة",
    voiceClone: "استنساخ صوتي",
    comingSoon: "قريباً",
    playbackSpeed: "سرعة القراءة",
    speedSlow: "بطيء (0.75x)",
    speedNormal: "طبيعي (1.0x)",
    speedFast: "سريع (1.25x)",
    testVoice: "تجربة الصوت",
    trainingPersona: "شخصية التدريب",
    selectPersona: "اختر الشخصية",
    savePref: "حفظ الإعدادات",
    saved: "تم الحفظ!",
    // Footer
    footerText: "نظام التدريب المتقدم FluencyFlow AI",
    footerPrivacy: "الخصوصية",
    footerStatus: "حالة النظام",
    footerSettings: "الإعدادات",
    builtWith: "صُنع بـ ❤️ والذكاء الاصطناعي",
    // Gamification
    level: "المستوى",
    streak: "أيام متتالية",
    day: "يوم",
    points: "نقاط",
    nextLevel: "المستوى التالي",
    // Game
    gameTitle: "تطابق الذاكرة",
    moves: "حركات",
    pairs: "أزواج",
    gameComplete: "اكتمل المستوى!"
  }
};

export const DIAGNOSTIC_TEXT = "Please call Stella. Ask her to bring these things with her from the store: Six spoons of fresh snow peas, five thick slabs of blue cheese, and maybe a snack for her brother Bob. We also need a small plastic snake and a big toy frog for the kids. She can scoop these things into three red bags, and then we will go meet her at the train station.";

export const MINIMAL_PAIRS_DRILLS: DrillContent[] = [
  {
    id: 'mp-pb',
    text: "Pat put a big blue pen back in the bag.",
    focus: "P (Puff of air) vs B (Vocal vibration)",
    focusAr: "الفرق بين P (دفعة هواء) و B (اهتزاز الحبال الصوتية)",
    guide: "Hold a tissue in front of your mouth. It should move for 'Pat/Pen' (P), but NOT for 'Big/Bag' (B).",
    guideAr: "ضع منديلاً أمام فمك. يجب أن يتحرك عند نطق 'Pat' (هواء)، ولكن لا يتحرك عند 'Bag' (اهتزاز).",
    type: 'MINIMAL_PAIR',
    category: 'general',
    viseme: 'p'
  },
  {
    id: 'mp-fv',
    text: "Five fans view the vast valley.",
    focus: "F (Air only) vs V (Buzzing)",
    focusAr: "الفرق بين F (هواء فقط) و V (أزيز/اهتزاز)",
    guide: "Top teeth on bottom lip for BOTH. 'F' is just air. 'V' makes your lip tickle/buzz.",
    guideAr: "الأسنان العلوية على الشفة السفلية للاثنين. 'F' مجرد هواء. 'V' يجب أن تشعر بدغدغة في شفتك.",
    type: 'MINIMAL_PAIR',
    category: 'general',
    viseme: 'f'
  },
  {
    id: 'mp-sz',
    text: "Sue sees the zoo zebra.",
    focus: "S (Snake hiss) vs Z (Bee buzz)",
    focusAr: "الفرق بين S (فحيح الأفعى) و Z (طنين النحلة)",
    guide: "Tongue touches nothing. 'S' is whispered. 'Z' vibrates your throat.",
    guideAr: "اللسان لا يلمس شيئاً. 'S' هو همس. 'Z' يجعل حنجرتك تهتز.",
    type: 'MINIMAL_PAIR',
    category: 'general',
    viseme: 's'
  }
];

export const PRONUNCIATION_DRILLS: DrillContent[] = [
  // --- BUSINESS PERSONA DRILLS ---
  {
    id: 'bus-1',
    text: "Let's touch base offline regarding the quarterly deliverables.",
    focus: "Clear enunciation of multi-syllable words (Deliverables)",
    focusAr: "نطق واضح للكلمات متعددة المقاطع",
    guide: "Focus on the 'L' in deliverables and the 'S' at the end.",
    guideAr: "ركز على حرف L في deliverables وحرف S في النهاية.",
    category: 'business',
    type: 'STANDARD',
    viseme: 'l'
  },
  {
    id: 'bus-2',
    text: "We need to leverage our strategic advantages.",
    focus: "V vs W (Leverage), Str- cluster (Strategic)",
    focusAr: "الفرق بين V/W ومخارج Str",
    guide: "Bite lip for 'Leverage'. Strong 'R' in Strategic.",
    guideAr: "عض الشفة في Leverage. نطق R قوي في Strategic.",
    category: 'business',
    type: 'STANDARD',
    viseme: 'f'
  },

  // --- DEVELOPER PERSONA DRILLS ---
  {
    id: 'dev-1',
    text: "I need to debug this asynchronous function before deployment.",
    focus: "Hard G (Debug), S-clusters (Async, Deploy)",
    focusAr: "حرف G القوي (Debug) ومخارج S",
    guide: "Don't rush 'Asynchronous'. Pronounce every syllable: A-syn-chro-nous.",
    guideAr: "لا تتسرع في Asynchronous. انطق كل مقطع.",
    category: 'developer',
    type: 'STANDARD',
    viseme: 'p'
  },
  {
    id: 'dev-2',
    text: "The API latency is causing a bottleneck in the backend.",
    focus: "Acronyms (API), T sounds (Latency, Bottle)",
    focusAr: "الاختصارات (API) وحرف T",
    guide: "Say 'A-P-I' clearly. 'Bottleneck' has a sharp T (or glottal stop).",
    guideAr: "قل A-P-I بوضوح. Bottleneck بها T حادة.",
    category: 'developer',
    type: 'STANDARD',
    viseme: 'p'
  },

  // --- ACADEMIC PERSONA DRILLS ---
  {
    id: 'aca-1',
    text: "The hypothesis was validated by empirical data.",
    focus: "TH (Hypothesis), V (Validated), P (Empirical)",
    focusAr: "مخارج TH, V, P",
    guide: "Soft TH in Hypothesis. Explode the P in Empirical.",
    guideAr: "TH ناعمة في Hypothesis. فجر حرف P في Empirical.",
    category: 'academic',
    type: 'STANDARD',
    viseme: 'th'
  },
  {
    id: 'aca-2',
    text: "Significant correlation does not imply causation.",
    focus: "S/Z sounds, Tion endings",
    focusAr: "أصوات S/Z ونهايات Tion",
    guide: "Sharp 'S' sounds. 'Tion' sounds like 'Shun'.",
    guideAr: "أصوات S حادة. Tion تنطق Shun.",
    category: 'academic',
    type: 'STANDARD',
    viseme: 's'
  },

  // --- KIDS PERSONA DRILLS ---
  {
    id: 'kid-1',
    text: "The fluffy cat jumped over the moon.",
    focus: "F (Fluffy), J (Jumped)",
    focusAr: "حرف F وحرف J",
    guide: "Blow air like a bunny for Fluffy. Jump your jaw for Jumped!",
    guideAr: "انفخ الهواء مثل الأرنب في Fluffy. حرك فكك بقوة في Jumped.",
    category: 'kids',
    type: 'STANDARD',
    viseme: 'f'
  },
  {
    id: 'kid-2',
    text: "Sally sells seashells by the seashore.",
    focus: "S vs SH (The Snake and the Quiet Sound)",
    focusAr: "الفرق بين S و SH",
    guide: "Smile for S (Sally). Pucker lips for SH (Shells).",
    guideAr: "ابتسم لحرف S. ضم شفتيك لحرف SH.",
    category: 'kids',
    type: 'STANDARD',
    viseme: 's'
  },

  // --- GENERAL DRILLS ---
  {
    id: 'th-1',
    text: "Thinking about those three things.",
    focus: "TH Sound (Voiceless & Voiced)",
    focusAr: "صوت الـ TH (المهموس والمجهور)",
    guide: "Stick your tongue OUT between your teeth. Bite it gently.",
    guideAr: "أخرج طرف لسانك بين أسنانك وعضه بلطف.",
    type: 'STANDARD',
    category: 'general',
    viseme: 'th'
  },
  {
    id: 'rl-1',
    text: "The red lorry rolled down the yellow lane.",
    focus: "R (Retroflex) vs L (Alveolar)",
    focusAr: "الفرق بين R (اللسان للخلف) و L (اللسان للأمام)",
    guide: "For 'R': Curl tongue BACK. For 'L': Tip of tongue touches behind teeth.",
    guideAr: "لحرف R: لف لسانك للخلف. لحرف L: طرف اللسان يلمس خلف الأسنان.",
    type: 'STANDARD',
    category: 'general',
    viseme: 'r'
  }
];

export const SPEED_QUESTIONS: SpeedQuestion[] = [
  // GENERAL
  { id: 'sq-1', question: "What is the last thing you bought and why?", questionAr: "ما هو آخر شيء اشتريته ولماذا؟", category: 'general' },
  { id: 'sq-2', question: "Describe your morning routine in three sentences.", questionAr: "صف روتينك الصباحي في ثلاث جمل.", category: 'general' },
  
  // BUSINESS
  { id: 'sq-bus-1', question: "How would you handle a missed deadline?", questionAr: "كيف تتصرف إذا فاتك موعد نهائي؟", category: 'business' },
  { id: 'sq-bus-2', question: "Pitch your current project in 10 seconds.", questionAr: "اعرض مشروعك الحالي في 10 ثوانٍ.", category: 'business' },

  // DEVELOPER
  { id: 'sq-dev-1', question: "Explain the difference between SQL and NoSQL.", questionAr: "اشرح الفرق بين SQL و NoSQL.", category: 'developer' },
  { id: 'sq-dev-2', question: "How do you handle a serious bug in production?", questionAr: "كيف تتعامل مع خطأ برمجي خطير في الإنتاج؟", category: 'developer' },

  // ACADEMIC
  { id: 'sq-aca-1', question: "Summarize the main argument of the last article you read.", questionAr: "لخص الحجة الرئيسية لآخر مقال قرأته.", category: 'academic' },
  
  // KIDS
  { id: 'sq-kid-1', question: "If you could have any superpower, what would it be?", questionAr: "لو كان عندك قوة خارقة، ماذا ستكون؟", category: 'kids' },
  { id: 'sq-kid-2', question: "Tell me about your favorite animal.", questionAr: "اخبرني عن حيوانك المفضل.", category: 'kids' }
];

export const WARMUP_EXERCISES: WarmupExercise[] = [
  {
    id: 'w-1',
    title: "The Jaw Drop",
    titleAr: "تمرين الفك",
    instruction: "Place palms on cheeks. Massage gently. Open mouth wide (say 'Ahhh') and close slowly. Repeat.",
    instructionAr: "ضع راحة يدك على خديك. دلك بلطف. افتح فمك واسعاً (قل 'آآآه') وأغلقه ببطء. كرر.",
    duration: 15,
    icon: 'jaw'
  },
  {
    id: 'w-2',
    title: "Lip Trills",
    titleAr: "ارتجاف الشفاه",
    instruction: "Relax your lips and blow air through them to make a 'Brrr' sound like a horse. Keep the vibration steady.",
    instructionAr: "ارخِ شفتيك وانفخ الهواء خلالهما لتصدر صوت 'بررر' (مثل الحصان). حافظ على ثبات الاهتزاز.",
    duration: 15,
    icon: 'lips'
  },
  {
    id: 'w-3',
    title: "Tongue Circles",
    titleAr: "دوائر اللسان",
    instruction: "Push your tongue into your cheek. Move it in a circle between your teeth and lips. 5 times clockwise, 5 counter-clockwise.",
    instructionAr: "ادفع لسانك داخل خدك. حركه في دائرة بين أسنانك وشفتيك. 5 مرات مع عقارب الساعة و 5 عكسها.",
    duration: 20,
    icon: 'tongue'
  },
  {
    id: 'w-4',
    title: "The 'Q-X' Stretch",
    titleAr: "تمرين Q-X",
    instruction: "Say 'Q' (pucker lips tight) then 'X' (smile extremely wide). Alternate rapidly.",
    instructionAr: "قل 'Q' (ضم شفتيك بقوة) ثم 'X' (ابتسم باتساع شديد). بدل بينهما بسرعة.",
    duration: 15,
    icon: 'lips'
  }
];

export const SHADOWING_DRILLS: ShadowingContent[] = [
  {
    id: 'sh-1',
    text: "The thirty-three thieves thought that they thrilled the throne throughout Thursday.",
    visemeFocus: 'th',
    guide: "Stick tongue OUT past teeth.",
    guideAr: "أخرج لسانك خارج الأسنان."
  },
  {
    id: 'sh-2',
    text: "Red lorry, yellow lorry, red lorry, yellow lorry.",
    visemeFocus: 'r',
    guide: "Curl tongue BACK, lips square.",
    guideAr: "لف اللسان للخلف، الشفاه مربعة."
  },
  {
    id: 'sh-3',
    text: "Fresh fried fish, fish fresh fried, fried fish fresh, fish fried fresh.",
    visemeFocus: 'f',
    guide: "Top teeth on bottom lip.",
    guideAr: "الأسنان العلوية على الشفة السفلية."
  },
  {
    id: 'sh-4',
    text: "She sells seashells by the seashore.",
    visemeFocus: 's',
    guide: "Tongue behind teeth, lips spread.",
    guideAr: "اللسان خلف الأسنان، الشفاه مفرودة."
  }
];

export const GAME_WORDS = [
  { id: 'g1', word: 'Thorough', match: 'Careful', type: 'meaning' },
  { id: 'g2', word: 'Rough', match: 'Not Smooth', type: 'meaning' },
  { id: 'g3', word: 'Though', match: 'Although', type: 'meaning' },
  { id: 'g4', word: 'Thought', match: 'Idea', type: 'meaning' },
];
