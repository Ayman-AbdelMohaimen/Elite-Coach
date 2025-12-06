
export enum SessionState {
  IDLE = 'IDLE',
  SETTINGS = 'SETTINGS',
  // Articulation Specific States
  ARTICULATION_MENU = 'ARTICULATION_MENU',
  DIAGNOSTIC_INTRO = 'DIAGNOSTIC_INTRO',
  DIAGNOSTIC_RECORDING = 'DIAGNOSTIC_RECORDING',
  DIAGNOSTIC_PROCESSING = 'DIAGNOSTIC_PROCESSING',
  DIAGNOSTIC_RESULT = 'DIAGNOSTIC_RESULT',
  
  // Keyword Hacking States
  KEYWORD_MENU = 'KEYWORD_MENU',
  KEYWORD_DRILL = 'KEYWORD_DRILL',
  KEYWORD_SUCCESS = 'KEYWORD_SUCCESS',
  
  // Muscle Memory States
  MUSCLE_MENU = 'MUSCLE_MENU',
  WARMUP_INTRO = 'WARMUP_INTRO',
  WARMUP_ACTIVE = 'WARMUP_ACTIVE',
  WARMUP_COMPLETED = 'WARMUP_COMPLETED',
  SHADOWING_INTRO = 'SHADOWING_INTRO',
  SHADOWING_CHAT = 'SHADOWING_CHAT', // Changed from generic recording
  
  // Drill States (Shared)
  DRILL_INTRO = 'DRILL_INTRO',
  DRILL_RECORDING = 'DRILL_RECORDING',
  DRILL_PROCESSING = 'DRILL_PROCESSING',
  DRILL_FEEDBACK = 'DRILL_FEEDBACK',
  
  // Speed States
  SPEED_INTRO = 'SPEED_INTRO',
  SPEED_RECORDING = 'SPEED_RECORDING',
  SPEED_PROCESSING = 'SPEED_PROCESSING',
  SPEED_FEEDBACK = 'SPEED_FEEDBACK',
  
  // Transcription States
  TRANSCRIPTION_INTRO = 'TRANSCRIPTION_INTRO',
  TRANSCRIPTION_RECORDING = 'TRANSCRIPTION_RECORDING',
  TRANSCRIPTION_PROCESSING = 'TRANSCRIPTION_PROCESSING',
  TRANSCRIPTION_RESULT = 'TRANSCRIPTION_RESULT',
  
  // Study Lab States
  STUDY_LAB_INTRO = 'STUDY_LAB_INTRO',
  STUDY_LAB_ANALYSIS = 'STUDY_LAB_ANALYSIS',
  STUDY_LAB_PRACTICE = 'STUDY_LAB_PRACTICE',
  
  // Vocab/Foundations States (NEW)
  VOCAB_MENU = 'VOCAB_MENU',
  VOCAB_DRILL = 'VOCAB_DRILL',

  // Game States
  GAME_INTRO = 'GAME_INTRO',
  GAME_ACTIVE = 'GAME_ACTIVE',
  GAME_COMPLETED = 'GAME_COMPLETED',
  
  COMPLETED = 'COMPLETED',
}

export type UserPersona = 'business' | 'developer' | 'academic' | 'kids';
export type VisemeType = 'th' | 'r' | 'l' | 'f' | 's' | 'p' | 'w';

export interface FeedbackData {
  rawText: string;
  score?: number;
}

export interface DiagnosticResult {
  score: number;
  weaknesses: string[];
  plan: string;
  feedback: string;
}

export interface DrillContent {
  id: string;
  title?: string;
  titleAr?: string;
  text: string;
  focus: string;
  focusAr?: string;
  guide: string;
  guideAr?: string;
  type?: 'STANDARD' | 'MINIMAL_PAIR';
  category?: UserPersona | 'general';
  viseme?: VisemeType;
}

export interface KeywordChallenge {
  id: string;
  word: string;
  phonetics: string;
  definition: string;
  definitionAr: string;
  context: string;
  contextAr: string;
  difficulty: 'Elite' | 'Master' | 'Legend';
}

export interface VocabWord {
  id: string;
  text: string;
  translation: string;
  emoji: string;
}

export interface VocabCategory {
  id: string;
  title: string;
  titleAr: string;
  icon: string;
  words: VocabWord[];
}

export interface StudyLabResult {
  segments: {
    text: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    focus: string;
  }[];
  overallFeedback: string;
}

export interface SpeedQuestion {
  id: string;
  question: string;
  questionAr?: string;
  category?: UserPersona | 'general';
}

export interface WarmupExercise {
  id: string;
  title: string;
  titleAr?: string;
  instruction: string;
  instructionAr?: string;
  duration: number;
  icon: 'jaw' | 'tongue' | 'lips' | 'breath';
}

export interface ShadowingContent {
  id: string;
  text: string;
  visemeFocus: VisemeType; 
  guide: string;
  guideAr?: string;
}

export interface UserStats {
  xp: number;
  streak: number;
  level: number;
  lastTrainingDate: string | null;
  energy: number;
  maxEnergy: number;
}

export interface Badge {
  id: string;
  label: string;
  icon: string;
  unlocked: boolean;
}

export interface AvatarConfig {
  style: 'avataaars' | 'bottts' | 'fun-emoji';
  seed: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text?: string;
  audioUrl?: string;
  type: 'text' | 'audio';
  timestamp: number;
}
