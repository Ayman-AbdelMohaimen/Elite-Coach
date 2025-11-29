
import React, { useState, useEffect } from 'react';
import { Sparkles, AlertCircle } from 'lucide-react';
import { SessionState, DiagnosticResult, DrillContent } from './types';
import { TRANSLATIONS, PRONUNCIATION_DRILLS, MINIMAL_PAIRS_DRILLS } from './constants';
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
    <div className="absolute animate-burst delay-150 text-cyan-400 opacity-0 -translate-x-12 translate-y-8"><Sparkles size={80} /></div>
  </div>
);

const App: React.FC = () => {
  // --- Global Config ---
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [sessionState, setSessionState] = useState<SessionState>(SessionState.IDLE);
  const t = TRANSLATIONS[lang];

  // --- TTS State (Gemini) ---
  const [ttsGender, setTTSGender] = useState<'male' | 'female'>('female');
  const [ttsSpeed, setTTSSpeed] = useState(1.0);
  const { play: playTTS, isPlaying: isPlayingTTS } = useGeminiTTS();

  // --- Session Data ---
  const [activeDrillList, setActiveDrillList] = useState<DrillContent[]>(PRONUNCIATION_DRILLS);
  const [trainingMode, setTrainingMode] = useState<'FULL' | 'SINGLE'>('FULL');
  const [showReward, setShowReward] = useState(false);

  // --- Hooks ---
  const audioRecorder = useAudioRecorder();

  // --- Effects ---
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

  // --- Helper Wrappers ---
  const handlePlayTTS = (text: string) => {
    playTTS(text, ttsGender, ttsSpeed);
  };

  const handleStartModule = (mod: 'ARTICULATION' | 'MUSCLE' | 'SPEED') => {
    setTrainingMode('SINGLE');
    if (mod === 'ARTICULATION') setSessionState(SessionState.ARTICULATION_MENU);
    else if (mod === 'MUSCLE') setSessionState(SessionState.MUSCLE_MENU);
    else setSessionState(SessionState.SPEED_INTRO);
  };

  const renderCurrentView = () => {
    const commonProps = {
      t,
      sessionState,
      setSessionState,
      audioRecorder,
      setShowReward,
      onPlayTTS: handlePlayTTS,
      isPlayingTTS,
      lang
    };

    switch (sessionState) {
      case SessionState.IDLE:
        return (
          <HomeView 
            t={t}
            onStartFull={() => {
              setTrainingMode('FULL');
              setActiveDrillList(PRONUNCIATION_DRILLS);
              setSessionState(SessionState.DRILL_INTRO);
            }}
            onStartTranscribe={() => setSessionState(SessionState.TRANSCRIPTION_INTRO)}
            onStartModule={handleStartModule}
          />
        );

      case SessionState.SETTINGS:
        return (
          <SettingsView 
            t={t}
            ttsGender={ttsGender}
            ttsSpeed={ttsSpeed}
            onSetGender={setTTSGender}
            onSetSpeed={setTTSSpeed}
            onTestVoice={() => handlePlayTTS(lang === 'ar' ? "هذا اختبار للصوت" : "This is a voice test.")}
            onHome={() => setSessionState(SessionState.IDLE)}
            isPlayingTTS={isPlayingTTS}
          />
        );

      // --- Articulation Module ---
      case SessionState.ARTICULATION_MENU:
      case SessionState.DRILL_INTRO:
      case SessionState.DRILL_RECORDING:
      case SessionState.DRILL_PROCESSING:
      case SessionState.DRILL_FEEDBACK:
        return (
          <ArticulationView 
            {...commonProps}
            activeDrillList={activeDrillList}
            setActiveDrillList={setActiveDrillList}
            trainingMode={trainingMode}
            onBackMenu={() => setSessionState(SessionState.ARTICULATION_MENU)}
            onComplete={() => {
               if (trainingMode === 'FULL') setSessionState(SessionState.SPEED_INTRO);
               else setSessionState(SessionState.COMPLETED);
            }}
          />
        );

      case SessionState.DIAGNOSTIC_INTRO:
      case SessionState.DIAGNOSTIC_RECORDING:
      case SessionState.DIAGNOSTIC_PROCESSING:
      case SessionState.DIAGNOSTIC_RESULT:
        return (
          <DiagnosticView 
             {...commonProps}
             onBack={() => setSessionState(SessionState.ARTICULATION_MENU)}
             onStartPlan={() => {
               setActiveDrillList(PRONUNCIATION_DRILLS); // In real app, filter based on result
               setSessionState(SessionState.DRILL_INTRO);
             }}
          />
        );

      // --- Muscle Module ---
      case SessionState.MUSCLE_MENU:
      case SessionState.WARMUP_ACTIVE:
      case SessionState.WARMUP_COMPLETED:
      case SessionState.SHADOWING_INTRO:
      case SessionState.SHADOWING_RECORDING:
      case SessionState.SHADOWING_PROCESSING:
      case SessionState.SHADOWING_FEEDBACK:
        return <MuscleView {...commonProps} />;

      // --- Speed Module ---
      case SessionState.SPEED_INTRO:
      case SessionState.SPEED_RECORDING:
      case SessionState.SPEED_PROCESSING:
      case SessionState.SPEED_FEEDBACK:
        return (
          <SpeedView 
             {...commonProps}
             onComplete={() => setSessionState(SessionState.COMPLETED)}
          />
        );

      case SessionState.TRANSCRIPTION_INTRO:
      case SessionState.TRANSCRIPTION_RECORDING:
      case SessionState.TRANSCRIPTION_PROCESSING:
      case SessionState.TRANSCRIPTION_RESULT:
        return <TranscriptionView {...commonProps} />;

      case SessionState.COMPLETED:
        return <CompletedView t={t} onHome={() => setSessionState(SessionState.IDLE)} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans overflow-x-hidden">
      {showReward && <RewardAnimation />}
      
      <Header 
        title={t.title} subtitle={t.subtitle}
        lang={lang} theme={theme}
        onToggleLang={() => setLang(l => l === 'en' ? 'ar' : 'en')}
        onToggleTheme={() => setTheme(th => th === 'dark' ? 'light' : 'dark')}
        onHome={() => setSessionState(SessionState.IDLE)}
        showExit={sessionState !== SessionState.IDLE}
        onExit={() => setSessionState(SessionState.IDLE)}
        exitLabel={t.exit}
      />

      <main className="flex-grow container mx-auto px-4 pt-20 pb-32 md:py-24 flex items-center justify-center relative z-10">
        <div className="fixed top-20 left-0 right-0 h-screen overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"></div>
        </div>
        {renderCurrentView()}
      </main>
      
      <Footer 
        text={t.footerText} 
        settingsLabel={t.footerSettings} 
        statusLabel={t.footerStatus}
        onOpenSettings={() => setSessionState(SessionState.SETTINGS)}
      />
      <MobileNav 
        sessionState={sessionState} 
        onNav={(target) => {
           if (target === 'HOME') setSessionState(SessionState.IDLE);
           else if (target === 'SETTINGS') setSessionState(SessionState.SETTINGS);
           else handleStartModule(target as any);
        }}
        labels={{
           home: t.navHome, drills: t.navDrill, muscle: t.modMuscle, speed: t.modSpeed, settings: t.footerSettings
        }}
      />
    </div>
  );
};

export default App;
