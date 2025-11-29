
import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { SessionState, DrillContent, UserPersona, SpeedQuestion } from './types';
import { TRANSLATIONS, PRONUNCIATION_DRILLS, SPEED_QUESTIONS } from './constants';
import { useAudioRecorder } from './hooks/useAudioRecorder';
import { useGeminiTTS } from './hooks/useGeminiTTS';

// Views
import { HomeView } from './views/HomeView';
import { SettingsView } from './views/SettingsView';
import { ArticulationView } from './views/ArticulationView';
import { MuscleView } from './views/MuscleView';
import { SpeedView } from './views/SpeedView';
import { TranscriptionView } from './views/TranscriptionView';
import { DiagnosticView } from './views/DiagnosticView';
import { CompletedView } from './views/CompletedView';

// Components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';

const RewardAnimation: React.FC = () => (
  <div className="fixed inset-0 pointer-events-none z-[60] flex items-center justify-center overflow-hidden">
    <div className="absolute animate-burst text-emerald-400 opacity-0"><Sparkles size={100} /></div>
    <div className="absolute animate-burst delay-75 text-yellow-400 opacity-0 translate-x-12 -translate-y-12"><Sparkles size={60} /></div>
  </div>
);

const App: React.FC = () => {
  // Global
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [sessionState, setSessionState] = useState<SessionState>(SessionState.IDLE);
  const t = TRANSLATIONS[lang];

  // Settings / Persistence
  const [ttsGender, setTTSGender] = useState<'male' | 'female'>('female');
  const [ttsSpeed, setTTSSpeed] = useState(1.0);
  const [selectedPersona, setSelectedPersona] = useState<UserPersona | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    const savedGender = localStorage.getItem('fluency_gender') as 'male' | 'female';
    const savedSpeed = localStorage.getItem('fluency_speed');
    const savedPersona = localStorage.getItem('fluency_persona') as UserPersona;
    
    if (savedGender) setTTSGender(savedGender);
    if (savedSpeed) setTTSSpeed(parseFloat(savedSpeed));
    if (savedPersona) setSelectedPersona(savedPersona);
  }, []);

  const { play: playTTS, isPlaying: isPlayingTTS } = useGeminiTTS();

  // Session Data
  const [activeDrillList, setActiveDrillList] = useState<DrillContent[]>(PRONUNCIATION_DRILLS);
  const [activeSpeedQuestions, setActiveSpeedQuestions] = useState<SpeedQuestion[]>(SPEED_QUESTIONS);
  const [trainingMode, setTrainingMode] = useState<'FULL' | 'SINGLE'>('FULL');
  const [showReward, setShowReward] = useState(false);
  
  // Audio Hooks
  const audioRecorder = useAudioRecorder();

  // Filter Content based on Persona
  useEffect(() => {
    // 1. Filter Drills
    let filteredDrills = PRONUNCIATION_DRILLS;
    if (selectedPersona) {
      const personaDrills = PRONUNCIATION_DRILLS.filter(d => d.category === selectedPersona);
      if (personaDrills.length > 0) {
        // Prioritize persona drills but keep general ones as backup
        filteredDrills = [...personaDrills, ...PRONUNCIATION_DRILLS.filter(d => !d.category || d.category === 'general')];
      }
    }
    setActiveDrillList(filteredDrills);

    // 2. Filter Speed Questions
    let filteredQuestions = SPEED_QUESTIONS;
    if (selectedPersona) {
      const personaQuestions = SPEED_QUESTIONS.filter(q => q.category === selectedPersona);
       if (personaQuestions.length > 0) {
        filteredQuestions = [...personaQuestions, ...SPEED_QUESTIONS.filter(q => !q.category || q.category === 'general')];
      }
    }
    setActiveSpeedQuestions(filteredQuestions);

  }, [selectedPersona]);

  // Layout Effects
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    if (showReward) {
      const timer = setTimeout(() => setShowReward(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showReward]);

  const handlePlayTTS = (text: string) => playTTS(text, ttsGender, ttsSpeed);

  const handleStartModule = (mod: 'ARTICULATION' | 'MUSCLE' | 'SPEED') => {
    setTrainingMode('SINGLE');
    if (mod === 'ARTICULATION') setSessionState(SessionState.ARTICULATION_MENU);
    else if (mod === 'MUSCLE') setSessionState(SessionState.MUSCLE_MENU);
    else setSessionState(SessionState.SPEED_INTRO);
  };

  const renderCurrentView = () => {
    const props = {
      t, sessionState, setSessionState, audioRecorder, setShowReward, 
      onPlayTTS: handlePlayTTS, isPlayingTTS, lang
    };

    switch (sessionState) {
      case SessionState.IDLE:
        return (
          <HomeView 
            t={t}
            lang={lang} // Fix: Pass lang explicitly
            selectedPersona={selectedPersona}
            onSelectPersona={(p) => {
              setSelectedPersona(p);
              localStorage.setItem('fluency_persona', p); // Auto save selection
            }}
            onStartTranscribe={() => setSessionState(SessionState.TRANSCRIPTION_INTRO)}
            onStartModule={handleStartModule}
            onStartFull={() => {
              setTrainingMode('FULL');
              setSessionState(SessionState.DRILL_INTRO);
            }}
          />
        );

      case SessionState.SETTINGS:
        return (
          <SettingsView 
            t={t} ttsGender={ttsGender} ttsSpeed={ttsSpeed} selectedPersona={selectedPersona}
            onSetGender={setTTSGender} onSetSpeed={setTTSSpeed} onSetPersona={setSelectedPersona}
            onTestVoice={() => handlePlayTTS(lang === 'ar' ? "هذا اختبار للصوت" : "This is a voice test.")}
            onHome={() => setSessionState(SessionState.IDLE)} isPlayingTTS={isPlayingTTS}
          />
        );

      case SessionState.ARTICULATION_MENU:
      case SessionState.DRILL_INTRO:
      case SessionState.DRILL_RECORDING:
      case SessionState.DRILL_PROCESSING:
      case SessionState.DRILL_FEEDBACK:
        return (
          <ArticulationView 
            {...props}
            activeDrillList={activeDrillList} setActiveDrillList={setActiveDrillList}
            trainingMode={trainingMode}
            onBackMenu={() => setSessionState(SessionState.ARTICULATION_MENU)}
            onComplete={() => trainingMode === 'FULL' ? setSessionState(SessionState.SPEED_INTRO) : setSessionState(SessionState.COMPLETED)}
            selectedPersona={selectedPersona}
          />
        );

      case SessionState.DIAGNOSTIC_INTRO:
      case SessionState.DIAGNOSTIC_RECORDING:
      case SessionState.DIAGNOSTIC_PROCESSING:
      case SessionState.DIAGNOSTIC_RESULT:
        return (
          <DiagnosticView 
             {...props}
             onBack={() => setSessionState(SessionState.ARTICULATION_MENU)}
             onStartPlan={() => {
               // Logic to filter drills based on weak points would go here
               setSessionState(SessionState.DRILL_INTRO);
             }}
          />
        );

      case SessionState.MUSCLE_MENU:
      case SessionState.WARMUP_ACTIVE:
      case SessionState.WARMUP_COMPLETED:
      case SessionState.SHADOWING_INTRO:
      case SessionState.SHADOWING_RECORDING:
      case SessionState.SHADOWING_PROCESSING:
      case SessionState.SHADOWING_FEEDBACK:
      case SessionState.GAME_INTRO:
      case SessionState.GAME_ACTIVE:
      case SessionState.GAME_COMPLETED:
        return <MuscleView {...props} />;

      case SessionState.SPEED_INTRO:
      case SessionState.SPEED_RECORDING:
      case SessionState.SPEED_PROCESSING:
      case SessionState.SPEED_FEEDBACK:
        return (
          <SpeedView 
            {...props} 
            activeQuestions={activeSpeedQuestions}
            onComplete={() => setSessionState(SessionState.COMPLETED)} 
            selectedPersona={selectedPersona}
          />
        );

      case SessionState.TRANSCRIPTION_INTRO:
      case SessionState.TRANSCRIPTION_RECORDING:
      case SessionState.TRANSCRIPTION_PROCESSING:
      case SessionState.TRANSCRIPTION_RESULT:
        return <TranscriptionView {...props} />;

      case SessionState.COMPLETED:
        return <CompletedView t={t} onHome={() => setSessionState(SessionState.IDLE)} />;

      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans overflow-x-hidden">
      {showReward && <RewardAnimation />}
      <Header 
        title={t.title} subtitle={t.subtitle} lang={lang} theme={theme}
        onToggleLang={() => setLang(l => l === 'en' ? 'ar' : 'en')}
        onToggleTheme={() => setTheme(th => th === 'dark' ? 'light' : 'dark')}
        onHome={() => setSessionState(SessionState.IDLE)}
        showExit={sessionState !== SessionState.IDLE}
        onExit={() => setSessionState(SessionState.IDLE)} exitLabel={t.exit}
      />
      <main className="flex-grow container mx-auto px-4 pt-20 pb-32 md:py-24 relative z-10">
        <div className="fixed top-20 left-0 right-0 h-screen overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"></div>
        </div>
        {renderCurrentView()}
      </main>
      <Footer 
        text={t.footerText} settingsLabel={t.footerSettings} statusLabel={t.footerStatus}
        onOpenSettings={() => setSessionState(SessionState.SETTINGS)}
      />
      <MobileNav 
        sessionState={sessionState} 
        onNav={(t) => t === 'HOME' ? setSessionState(SessionState.IDLE) : t === 'SETTINGS' ? setSessionState(SessionState.SETTINGS) : handleStartModule(t as any)}
        labels={{ home: t.navHome, drills: t.navDrill, muscle: t.modMuscle, speed: t.modSpeed, settings: t.footerSettings }}
      />
    </div>
  );
};

export default App;
