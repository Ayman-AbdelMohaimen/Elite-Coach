
import React, { useState, useEffect } from 'react';
import { Activity, Zap, Dumbbell, BrainCircuit, User, Star, Flame, Trophy } from 'lucide-react';
import { Button } from '../components/Button';
import { PERSONAS, LEVELS } from '../constants';
import { UserPersona, UserStats } from '../types';

interface HomeViewProps {
  t: any;
  lang: 'en' | 'ar';
  selectedPersona: UserPersona | null;
  onSelectPersona: (p: UserPersona) => void;
  onStartTranscribe: () => void;
  onStartModule: (mod: 'ARTICULATION' | 'MUSCLE' | 'SPEED') => void;
  onStartFull: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  t, lang, selectedPersona, onSelectPersona, onStartTranscribe, onStartModule, onStartFull 
}) => {
  const [step, setStep] = useState<'WIZARD' | 'DASHBOARD'>('WIZARD');
  const [stats, setStats] = useState<UserStats>({ xp: 0, streak: 0, level: 1, lastTrainingDate: null });

  useEffect(() => {
    // Load Stats
    const savedStats = localStorage.getItem('fluency_stats');
    if (savedStats) setStats(JSON.parse(savedStats));

    if (selectedPersona) {
      setStep('DASHBOARD');
    } else {
      setStep('WIZARD');
    }
  }, [selectedPersona]);

  const currentLevel = LEVELS.slice().reverse().find(l => stats.xp >= l.minXp) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.minXp > stats.xp);
  
  // Helper to get artistic styles for personas
  const getPersonaStyle = (id: string) => {
    switch(id) {
      case 'business':
        return "bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:border-indigo-500 text-white";
      case 'developer':
        return "bg-gradient-to-br from-indigo-900 to-purple-900 border-indigo-800 shadow-purple-500/20 hover:shadow-purple-500/40 hover:border-purple-500 text-white";
      case 'academic':
        return "bg-gradient-to-br from-emerald-900 to-teal-900 border-emerald-800 shadow-teal-500/20 hover:shadow-teal-500/40 hover:border-teal-500 text-white";
      case 'kids':
        return "bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300 shadow-yellow-500/30 hover:shadow-yellow-500/50 hover:border-white text-yellow-950";
      default:
        return "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800";
    }
  };

  const getIconBg = (id: string) => {
     switch(id) {
       case 'business': return "bg-indigo-500/20 text-indigo-300";
       case 'developer': return "bg-purple-500/20 text-purple-300";
       case 'academic': return "bg-teal-500/20 text-teal-300";
       case 'kids': return "bg-white/40 text-yellow-900";
       default: return "bg-slate-100 dark:bg-slate-800";
     }
  };

  const isKidsMode = selectedPersona === 'kids';
  const kidsText = isKidsMode ? 'font-comic tracking-wide' : '';

  // --- WIZARD STEP ---
  if (step === 'WIZARD') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 max-w-4xl mx-auto animate-float-up pt-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
          {t.heroTitle} <span className="text-emerald-500">{t.heroFlow}</span>
        </h1>
        <p className="text-xl text-slate-500 mb-12 text-center max-w-2xl">
          Who are you training to be? Select your persona to customize your drills.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {PERSONAS.map((persona) => (
            <button
              key={persona.id}
              onClick={() => onSelectPersona(persona.id as UserPersona)}
              className={`relative group p-6 rounded-[2rem] border-2 transition-all duration-300 hover:-translate-y-2 text-left rtl:text-right overflow-hidden ${getPersonaStyle(persona.id)}`}
            >
              {/* Artistic Background blobs */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-2xl -ml-5 -mb-5 pointer-events-none"></div>

              <div className={`absolute top-6 right-6 rtl:right-auto rtl:left-6 p-3 rounded-full backdrop-blur-sm transition-transform group-hover:scale-110 ${getIconBg(persona.id)}`}>
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-3 relative z-10">
                {lang === 'ar' ? persona.labelAr : persona.label}
              </h3>
              <p className={`text-sm relative z-10 opacity-80 ${persona.id === 'kids' ? 'text-yellow-900 font-bold' : 'text-slate-300'}`}>
                {lang === 'ar' ? persona.descAr : persona.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- DASHBOARD STEP ---
  return (
    <div className={`flex flex-col items-center justify-center min-h-[70vh] px-4 text-center max-w-4xl mx-auto animate-float-up pt-10 ${kidsText}`}>
      
      {/* GAMIFICATION STATS BAR */}
      <div className={`w-full max-w-2xl grid grid-cols-3 gap-2 md:gap-4 mb-8 p-3 rounded-2xl border ${isKidsMode ? 'bg-white border-yellow-300 shadow-yellow-200' : 'bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'} shadow-sm`}>
         <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider"><Trophy className="w-3 h-3 text-yellow-500" /> {t.level} {currentLevel.level}</div>
            <div className={`font-bold text-sm ${isKidsMode ? 'text-yellow-600' : 'text-slate-700 dark:text-slate-200'}`}>{lang === 'ar' ? currentLevel.labelAr : currentLevel.label}</div>
         </div>
         <div className="flex flex-col items-center border-x border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider"><Star className="w-3 h-3 text-emerald-500" /> {t.points}</div>
            <div className="font-bold text-xl text-emerald-500">{stats.xp}</div>
         </div>
         <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-wider"><Flame className="w-3 h-3 text-orange-500" /> {t.streak}</div>
            <div className="font-bold text-xl text-orange-500">{stats.streak} <span className="text-xs text-slate-400 font-normal">{t.day}</span></div>
         </div>
      </div>

      <div className="mb-8 flex items-center gap-3 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
         <User className="w-4 h-4 text-emerald-500" />
         <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
           {lang === 'ar' ? PERSONAS.find(p => p.id === selectedPersona)?.labelAr : PERSONAS.find(p => p.id === selectedPersona)?.label}
         </span>
         <button onClick={() => setStep('WIZARD')} className="ml-2 text-xs underline text-slate-500 hover:text-emerald-500">Change</button>
      </div>

      <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
        {t.heroTitle} <br />
        <span className={`text-transparent bg-clip-text ${isKidsMode ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500'} drop-shadow-lg`}>
          {t.heroFlow}
        </span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-lg mb-16">
        <Button 
          variant="primary" 
          className={`w-full text-lg h-14 shadow-lg hover:-translate-y-1 transition-all duration-300 ${isKidsMode ? '!bg-yellow-400 !text-yellow-900 shadow-yellow-500/20' : 'shadow-emerald-500/20'}`}
          onClick={onStartFull}
          icon={<Zap className="w-5 h-5" />}
        >
          {t.startBtn}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
        {[
          { id: 'articulation', icon: Activity, title: t.modMPT, desc: t.modDescMPT, color: isKidsMode ? "orange" : "emerald", action: () => onStartModule('ARTICULATION') },
          { id: 'muscle', icon: Dumbbell, title: t.modMuscle, desc: t.modDescMuscle, color: isKidsMode ? "yellow" : "amber", action: () => onStartModule('MUSCLE') }, 
          { id: 'speed', icon: BrainCircuit, title: t.modSpeed, desc: t.modDescSpeed, color: isKidsMode ? "pink" : "cyan", action: () => onStartModule('SPEED') },
        ].map((mod, i) => (
           <button 
             key={i} 
             onClick={mod.action}
             className={`
              flex flex-col items-center p-4 rounded-2xl bg-white/50 dark:bg-slate-900/50 
              border border-slate-200 dark:border-slate-800 backdrop-blur-sm
              hover:bg-white dark:hover:bg-slate-800 hover:scale-105 hover:shadow-xl hover:border-${mod.color}-500/30
              transition-all duration-300 group cursor-pointer
           `}>
             <div className={`p-2 rounded-lg bg-${mod.color}-500/10 text-${mod.color}-500 mb-3 group-hover:bg-${mod.color}-500 group-hover:text-white transition-colors duration-300`}>
               <mod.icon className="w-5 h-5" />
             </div>
             <h4 className={`text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 group-hover:text-${mod.color}-500`}>{mod.title}</h4>
             <span className="text-[10px] text-slate-500 font-mono group-hover:text-slate-400">{mod.desc}</span>
           </button>
        ))}
      </div>
    </div>
  );
};
