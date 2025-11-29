
import { DrillContent, SpeedQuestion, WarmupExercise, ShadowingContent } from "./types";

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

export const TRANSLATIONS = {
  en: {
    title: "FluencyFlow",
    subtitle: "Elite Coach v3.1",
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
    artPairsDesc: "Fix P/B, F/V, S/Z confusion.",
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
    startWarmup: "Start Warm-up",
    startShadowing: "Start Shadowing",
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
    // Footer
    footerText: "FluencyFlow AI. Elite Coaching System.",
    footerPrivacy: "Privacy Protocol",
    footerStatus: "System Status",
    footerSettings: "Settings"
  },
  ar: {
    title: "FluencyFlow",
    subtitle: "المدرب المتقدم v3.1",
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
    startWarmup: "ابدأ الإحماء",
    startShadowing: "ابدأ المحاكاة",
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
    // Footer
    footerText: "نظام التدريب المتقدم FluencyFlow AI",
    footerPrivacy: "الخصوصية",
    footerStatus: "حالة النظام",
    footerSettings: "الإعدادات"
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
    type: 'MINIMAL_PAIR'
  },
  {
    id: 'mp-fv',
    text: "Five fans view the vast valley.",
    focus: "F (Air only) vs V (Buzzing)",
    focusAr: "الفرق بين F (هواء فقط) و V (أزيز/اهتزاز)",
    guide: "Top teeth on bottom lip for BOTH. 'F' is just air. 'V' makes your lip tickle/buzz.",
    guideAr: "الأسنان العلوية على الشفة السفلية للاثنين. 'F' مجرد هواء. 'V' يجب أن تشعر بدغدغة في شفتك.",
    type: 'MINIMAL_PAIR'
  },
  {
    id: 'mp-sz',
    text: "Sue sees the zoo zebra.",
    focus: "S (Snake hiss) vs Z (Bee buzz)",
    focusAr: "الفرق بين S (فحيح الأفعى) و Z (طنين النحلة)",
    guide: "Tongue touches nothing. 'S' is whispered. 'Z' vibrates your throat.",
    guideAr: "اللسان لا يلمس شيئاً. 'S' هو همس. 'Z' يجعل حنجرتك تهتز.",
    type: 'MINIMAL_PAIR'
  },
  {
    id: 'mp-th-s',
    text: "I think the sink will sink.",
    focus: "TH (Tongue out) vs S (Tongue in)",
    focusAr: "الفرق بين TH (اللسان خارجاً) و S (اللسان بالداخل)",
    guide: "Stick tongue OUT for 'Think'. Keep tongue IN behind teeth for 'Sink'.",
    guideAr: "أخرج لسانك للخارج في 'Think'. ابقه خلف الأسنان في 'Sink'.",
    type: 'MINIMAL_PAIR'
  }
];

export const PRONUNCIATION_DRILLS: DrillContent[] = [
  // Group 1: TH Sounds (The Lisp Check)
  {
    id: 'th-1',
    text: "Thinking about those three things.",
    focus: "TH Sound (Voiceless & Voiced)",
    focusAr: "صوت الـ TH (المهموس والمجهور)",
    guide: "Stick your tongue OUT between your teeth. Bite it gently. Blow air for 'Thinking/Three' (Unvoiced). Vibrate vocal cords for 'Those' (Voiced). Do NOT use 'S' or 'Z'.",
    guideAr: "أخرج طرف لسانك بين أسنانك وعضه بلطف. انفخ الهواء في 'Thinking'. اجعل الحبال الصوتية تهتز في 'Those'. لا تستخدم S أو Z.",
    type: 'STANDARD'
  },
  // Group 2: R vs L (The Tongue Curl)
  {
    id: 'rl-1',
    text: "The red lorry rolled down the yellow lane.",
    focus: "R (Retroflex) vs L (Alveolar)",
    focusAr: "الفرق بين R (اللسان للخلف) و L (اللسان للأمام)",
    guide: "For 'R': Curl tongue BACK, sides touching upper molars, tip touching NOTHING. For 'L': Tip of tongue touches just BEHIND the upper front teeth.",
    guideAr: "لحرف R: لف لسانك للخلف دون لمس السقف. لحرف L: طرف اللسان يلمس المنطقة خلف الأسنان الأمامية العلوية مباشرة.",
    type: 'STANDARD'
  },
  // Group 3: V vs W (The Lip Buzz)
  {
    id: 'vw-1',
    text: "Very well, we will visit the village.",
    focus: "V (Fricative) vs W (Glide)",
    focusAr: "الفرق بين V (الأسنان على الشفة) و W (تدوير الشفاه)",
    guide: "For 'V': Top teeth MUST bite bottom lip (Buzz). For 'W': Make a tight 'O' circle with lips, do NOT touch teeth to lip.",
    guideAr: "لحرف V: عض الشفة السفلية بأسنانك (أزيز). لحرف W: دور شفتيك دائرة ضيقة (O) ولا تلمس الأسنان.",
    type: 'STANDARD'
  },
  // Group 4: MPT (The Explosives)
  {
    id: 'mpt-1',
    text: "Map the path to the top.",
    focus: "M (Nasal), P (Plosive), T (Alveolar Stop)",
    focusAr: "الأصوات الانفجارية (P, T) والأنفية (M)",
    guide: "Press lips firmly for 'Map'. For 'Path', build air pressure behind lips and release explosively. For 'Top', tap tongue tip against the ridge behind upper teeth.",
    guideAr: "اضغط الشفاه بقوة في 'Map'. في 'Path' اجمع الهواء خلف الشفاه وأطلقه بقوة (انفجار). في 'Top' اضرب طرف اللسان خلف الأسنان.",
    type: 'STANDARD'
  },
  // Group 5: S vs Z (The Hiss vs Buzz)
  {
    id: 'sz-1',
    text: "Lazy zebras sleep on soft grass.",
    focus: "Z (Vibration) vs S (Hiss)",
    focusAr: "الفرق بين Z (الاهتزاز) و S (الفحيح)",
    guide: "Tongue position is identical for both. 'S' is silent air (Snake). 'Z' uses vocal cords (Bee buzzing). Feel your throat vibrate on 'Lazy' and 'Zebras'.",
    guideAr: "وضعية اللسان متطابقة. 'S' هواء صامت. 'Z' يستخدم الحبال الصوتية. تحسس اهتزاز حنجرتك في 'Lazy'.",
    type: 'STANDARD'
  }
];

export const SPEED_QUESTIONS: SpeedQuestion[] = [
  { id: 'sq-1', question: "What is the last thing you bought and why?", questionAr: "ما هو آخر شيء اشتريته ولماذا؟" },
  { id: 'sq-2', question: "Describe your morning routine in three sentences.", questionAr: "صف روتينك الصباحي في ثلاث جمل." },
  { id: 'sq-3', question: "If you could travel anywhere right now, where would you go?", questionAr: "إذا كان بإمكانك السفر لأي مكان الآن، أين ستذهب؟" },
  { id: 'sq-4', question: "What is your favorite way to relax after work?", questionAr: "ما هي طريقتك المفضلة للاسترخاء بعد العمل؟" },
  { id: 'sq-5', question: "Tell me about a skill you want to learn.", questionAr: "أخبرني عن مهارة ترغب في تعلمها." }
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