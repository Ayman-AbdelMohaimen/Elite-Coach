
import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { SessionState, DrillContent, UserPersona, SpeedQuestion, UserStats } from './types';
import { TRANSLATIONS, PRONUNCIATION_DRILLS, SPEED_QUESTIONS, LEVELS } from './constants';
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
import { StudyLabView } from './views/StudyLabView';
import { KeywordHackingView } from './views/KeywordHackingView';
import { VocabView } from './views/VocabView';

// Components
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { AgentOverlay } from './components/AgentOverlay'; // NEW

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
  const [ttsEngine, setTTSEngine] = useState<'browser' | 'gemini'>('browser');
  const [selectedPersona, setSelectedPersona] = useState<UserPersona | null>(null);

  // User Stats (Gamification & Energy)
  const [stats, setStats] = useState<UserStats>({ 
    xp: 0, streak: 0, level: 1, lastTrainingDate: null, 
    energy: 100, maxEnergy: 100 
  });

  // Initialize from LocalStorage
  useEffect(() => {
    const savedGender = localStorage.getItem('fluency_gender') as 'male' | 'female';
    const savedSpeed = localStorage.getItem('fluency_speed');
    const savedEngine = localStorage.getItem('fluency_engine') as 'browser' | 'gemini';
    const savedPersona = localStorage.getItem('fluency_persona') as UserPersona;
    const savedStats = localStorage.getItem('fluency_stats');
    
    if (savedGender) setTTSGender(savedGender);
    if (savedSpeed) setTTSSpeed(parseFloat(savedSpeed));
    if (savedEngine) setTTSEngine(savedEngine);
    if (savedPersona) setSelectedPersona(savedPersona);
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  // Energy System Logic: Refill
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => {
        if (prev.energy < prev.maxEnergy) {
          const newStats = { ...prev, energy: prev.energy + 1 };
          localStorage.setItem('fluency_stats', JSON.stringify(newStats));
          return newStats;
        }
        return prev;
      });
    }, 60000 * 5); // Refill 1 energy every 5 minutes

    return () => clearInterval(timer);
  }, []);

  const handleUpdateStats = (xpGained: number) => {
    setStats(prev => {
      const today = new Date().toISOString().split('T')[0];
      let newStreak = prev.streak;
      
      if (prev.lastTrainingDate !== today) {
        newStreak += 1;
      }
      
      // Level Up Logic
      const newXp = prev.xp + xpGained;
      const newLevel = LEVELS.slice().reverse().find(l => newXp >= l.minXp)?.level || prev.level;

      const newStats = {
        ...prev,
        xp: newXp,
        streak: newStreak === 0 ? 1 : newStreak,
        level: newLevel,
        lastTrainingDate: today
      };
      
      localStorage.setItem('fluency_stats', JSON.stringify(newStats));
      return newStats;
    });
  };

  const handleConsumeEnergy = (amount: number): boolean => {
    if (stats.energy >= amount) {
      setStats(prev => {
        const newStats = { ...prev, energy: prev.energy - amount };
        localStorage.setItem('fluency_stats', JSON.stringify(newStats));
        return newStats;
      });
      return true;
    }
    alert(t.noEnergy);
    return false;
  };

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

  const handlePlayTTS = (text: string) => playTTS(text, ttsGender, ttsSpeed, ttsEngine);

  const handleStartModule = (mod: 'ARTICULATION' | 'MUSCLE' | 'SPEED' | 'STUDY' | 'KEYWORD' | 'VOCAB') => {
    setTrainingMode('SINGLE');
    if (mod === 'ARTICULATION') setSessionState(SessionState.ARTICULATION_MENU);
    else if (mod === 'MUSCLE') setSessionState(SessionState.MUSCLE_MENU);
    else if (mod === 'SPEED') setSessionState(SessionState.SPEED_INTRO);
    else if (mod === 'STUDY') setSessionState(SessionState.STUDY_LAB_INTRO);
    else if (mod === 'KEYWORD') setSessionState(SessionState.KEYWORD_MENU);
    else if (mod === 'VOCAB') setSessionState(SessionState.VOCAB_MENU);
  };

  // SMART NAVIGATION LOGIC
  const handleLogoClick = () => {
    if (sessionState !== SessionState.IDLE) {
      setSessionState(SessionState.IDLE);
    } else {
      // If already at Home Dashboard, reset persona to go back to Wizard
      setSelectedPersona(null);
      localStorage.removeItem('fluency_persona');
    }
  };

  const renderCurrentView = () => {
    const props = {
      t, sessionState, setSessionState, audioRecorder, setShowReward, 
      onPlayTTS: handlePlayTTS, isPlayingTTS, lang,
      onConsumeEnergy: handleConsumeEnergy 
    };

    switch (sessionState) {
      case SessionState.IDLE:
        return (
          <HomeView 
            t={t}
            lang={lang}
            selectedPersona={selectedPersona}
            stats={stats}
            onSelectPersona={(p) => {
              setSelectedPersona(p);
              localStorage.setItem('fluency_persona', p);
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
            t={t} 
            lang={lang} 
            ttsGender={ttsGender} ttsSpeed={ttsSpeed} ttsEngine={ttsEngine} selectedPersona={selectedPersona}
            onSetGender={setTTSGender} onSetSpeed={setTTSSpeed} onSetEngine={setTTSEngine} onSetPersona={setSelectedPersona}
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
            onUpdateStats={handleUpdateStats}
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
               setSessionState(SessionState.DRILL_INTRO);
             }}
             onUpdateStats={handleUpdateStats}
          />
        );

      case SessionState.MUSCLE_MENU:
      case SessionState.WARMUP_ACTIVE:
      case SessionState.WARMUP_COMPLETED:
      case SessionState.SHADOWING_INTRO:
      case SessionState.SHADOWING_CHAT: // Replaces old SHADOWING_RECORDING logic
      case SessionState.GAME_INTRO:
      case SessionState.GAME_ACTIVE:
      case SessionState.GAME_COMPLETED:
        return <MuscleView {...props} selectedPersona={selectedPersona} onUpdateStats={handleUpdateStats} />;

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
            onUpdateStats={handleUpdateStats}
          />
        );

      case SessionState.STUDY_LAB_INTRO:
      case SessionState.STUDY_LAB_ANALYSIS:
      case SessionState.STUDY_LAB_PRACTICE:
         return (
           <StudyLabView 
             {...props}
             onBack={() => setSessionState(SessionState.IDLE)}
             onUpdateStats={handleUpdateStats}
           />
         );
      
      case SessionState.KEYWORD_MENU:
      case SessionState.KEYWORD_DRILL:
      case SessionState.KEYWORD_SUCCESS:
          return (
            <KeywordHackingView 
              {...props}
              selectedPersona={selectedPersona}
              onUpdateStats={handleUpdateStats}
              onBack={() => setSessionState(SessionState.IDLE)}
            />
          );

      case SessionState.VOCAB_MENU:
      case SessionState.VOCAB_DRILL:
        return (
           <VocabView 
              {...props}
              onUpdateStats={handleUpdateStats}
              onBack={() => setSessionState(SessionState.IDLE)}
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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans overflow-x-hidden transition-colors duration-500">
      {showReward && <RewardAnimation />}
      
      {/* GLOBAL AGENT OVERLAY */}
      {selectedPersona && (
        <AgentOverlay 
          selectedPersona={selectedPersona} 
          audioRecorder={audioRecorder}
          lang={lang}
        />
      )}

      <Header 
        title={t.title} subtitle={t.subtitle} lang={lang} theme={theme}
        onToggleLang={() => setLang(l => l === 'en' ? 'ar' : 'en')}
        onToggleTheme={() => setTheme(th => th === 'dark' ? 'light' : 'dark')}
        onHome={handleLogoClick}
        showExit={sessionState !== SessionState.IDLE}
        onExit={() => setSessionState(SessionState.IDLE)} exitLabel={t.exit}
      />
      <main className="flex-grow container mx-auto px-4 pt-20 pb-32 md:py-24 relative z-10">
        <div className="fixed top-20 left-0 right-0 h-screen overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-float delay-1000"></div>
        </div>
        {renderCurrentView()}
      </main>
      <Footer 
        text={t.footerText} settingsLabel={t.footerSettings} statusLabel={t.footerStatus}
        onOpenSettings={() => setSessionState(SessionState.SETTINGS)}
      />
      <MobileNav 
        sessionState={sessionState} 
        onNav={(t) => t === 'HOME' ? handleLogoClick() : t === 'SETTINGS' ? setSessionState(SessionState.SETTINGS) : handleStartModule(t as any)}
        labels={{ home: t.navHome, drills: t.navDrill, muscle: t.modMuscle, speed: t.modSpeed, settings: t.footerSettings }}
      />
    </div>
  );
};

export default App;
