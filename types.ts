
export enum SessionState {
  IDLE = 'IDLE',
  SETTINGS = 'SETTINGS',
  // Articulation Specific States
  ARTICULATION_MENU = 'ARTICULATION_MENU',
  DIAGNOSTIC_INTRO = 'DIAGNOSTIC_INTRO',
  DIAGNOSTIC_RECORDING = 'DIAGNOSTIC_RECORDING',
  DIAGNOSTIC_PROCESSING = 'DIAGNOSTIC_PROCESSING',
  DIAGNOSTIC_RESULT = 'DIAGNOSTIC_RESULT',
  
  // Muscle Memory States
  MUSCLE_MENU = 'MUSCLE_MENU',
  WARMUP_INTRO = 'WARMUP_INTRO',
  WARMUP_ACTIVE = 'WARMUP_ACTIVE',
  WARMUP_COMPLETED = 'WARMUP_COMPLETED',
  SHADOWING_INTRO = 'SHADOWING_INTRO',
  SHADOWING_RECORDING = 'SHADOWING_RECORDING',
  SHADOWING_PROCESSING = 'SHADOWING_PROCESSING',
  SHADOWING_FEEDBACK = 'SHADOWING_FEEDBACK',

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
  
  COMPLETED = 'COMPLETED',
}

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
  text: string;
  focus: string;
  focusAr?: string; // Arabic translation
  guide: string;
  guideAr?: string; // Arabic translation
  type?: 'STANDARD' | 'MINIMAL_PAIR';
}

export interface SpeedQuestion {
  id: string;
  question: string;
  questionAr?: string;
}

export interface WarmupExercise {
  id: string;
  title: string;
  titleAr?: string;
  instruction: string;
  instructionAr?: string;
  duration: number; // seconds
  icon: 'jaw' | 'tongue' | 'lips' | 'breath';
}

export interface ShadowingContent {
  id: string;
  text: string;
  visemeFocus: 'th' | 'r' | 'f' | 'l' | 'm' | 's'; 
  guide: string;
  guideAr?: string;
}