
import React, { useState, useEffect } from 'react';
import { Activity, Zap, Dumbbell, User, Star, Flame, Trophy, BookOpen, Crown, ChevronRight, Gamepad2, Briefcase, Code, GraduationCap, Terminal, Sparkles } from 'lucide-react';
import { PERSONAS, LEVELS } from '../constants';
import { UserPersona, UserStats } from '../types';

interface HomeViewProps {
  t: any;
  lang: 'en' | 'ar';
  selectedPersona: UserPersona | null;
  stats: UserStats;
  onSelectPersona: (p: UserPersona) => void;
  onStartTranscribe: () => void;
  onStartModule: (mod: 'ARTICULATION' | 'MUSCLE' | 'SPEED' | 'STUDY' | 'KEYWORD' | 'VOCAB') => void;
  onStartFull: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  t, lang, selectedPersona, stats, onSelectPersona, onStartTranscribe, onStartModule, onStartFull 
}) => {
  const [step, setStep] = useState<'WIZARD' | 'DASHBOARD'>('WIZARD');

  useEffect(() => {
    if (selectedPersona) {
      setStep('DASHBOARD');
    } else {
      setStep('WIZARD');
    }
  }, [selectedPersona]);

  const currentLevel = LEVELS.slice().reverse().find(l => stats.xp >= l.minXp) || LEVELS[0];
  const dateStr = new Date().toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // --- STYLES HELPER ---
  const getPersonaStyle = (id: string) => {
    switch(id) {
      case 'kids': return {
        bg: 'bg-slate-900/70',
        border: 'border-amber-500/50 hover:border-amber-400',
        glow: 'shadow-[0_0_30px_rgba(245,158,11,0.2)]',
        iconBg: 'bg-gradient-to-br from-amber-400 to-red-500',
        textGradient: 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-red-400',
        icon: <Gamepad2 className="w-6 h-6 text-white animate-pulse" />
      };
      case 'business': return {
        bg: 'bg-slate-900/70',
        border: 'border-emerald-500/50 hover:border-emerald-400',
        glow: 'shadow-[0_0_30px_rgba(16,185,129,0.2)]',
        iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-600',
        textGradient: 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-400',
        icon: <Briefcase className="w-6 h-6 text-white" />
      };
      case 'developer': return {
        bg: 'bg-slate-900/70',
        border: 'border-cyan-500/50 hover:border-cyan-400',
        glow: 'shadow-[0_0_30px_rgba(6,182,212,0.2)]',
        iconBg: 'bg-gradient-to-br from-cyan-400 to-blue-600',
        textGradient: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400',
        icon: <Code className="w-6 h-6 text-white" />
      };
      case 'academic': return {
        bg: 'bg-slate-900/70',
        border: 'border-indigo-500/50 hover:border-indigo-400',
        glow: 'shadow-[0_0_30px_rgba(99,102,241,0.2)]',
        iconBg: 'bg-gradient-to-br from-indigo-400 to-violet-600',
        textGradient: 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-violet-400',
        icon: <GraduationCap className="w-6 h-6 text-white" />
      };
      default: return { bg: '', border: '', glow: '', iconBg: '', textGradient: '', icon: <User /> };
    }
  };

  const getNeonGridStyle = (color: string) => {
      switch(color) {
          case 'emerald': return { border: 'border-emerald-500/30 group-hover:border-emerald-400', glow: 'bg-emerald-500', gradient: 'from-emerald-400 to-green-600', text: 'text-emerald-400' };
          case 'amber': return { border: 'border-amber-500/30 group-hover:border-amber-400', glow: 'bg-amber-500', gradient: 'from-amber-400 to-orange-600', text: 'text-amber-400' };
          case 'cyan': return { border: 'border-cyan-500/30 group-hover:border-cyan-400', glow: 'bg-cyan-500', gradient: 'from-cyan-400 to-blue-600', text: 'text-cyan-400' };
          case 'indigo': return { border: 'border-indigo-500/30 group-hover:border-indigo-400', glow: 'bg-indigo-500', gradient: 'from-indigo-400 to-purple-600', text: 'text-indigo-400' };
          case 'rose': return { border: 'border-rose-500/30 group-hover:border-rose-400', glow: 'bg-rose-500', gradient: 'from-rose-400 to-pink-600', text: 'text-rose-400' };
          case 'violet': return { border: 'border-violet-500/30 group-hover:border-violet-400', glow: 'bg-violet-500', gradient: 'from-violet-400 to-fuchsia-600', text: 'text-violet-400' };
          default: return { border: '', glow: 'bg-slate-500', gradient: '', text: '' };
      }
  };

  const getHeroCardStyle = () => {
    switch(selectedPersona) {
      case 'kids': return {
        gradient: 'from-amber-500/20 to-red-600/20',
        blobs: 'bg-amber-500/40',
        blobs2: 'bg-red-500/40',
        text: 'text-amber-300',
        border: 'border-amber-500/50',
        shadow: 'shadow-[0_0_50px_rgba(245,158,11,0.25)]',
        btn: 'bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-amber-500/20'
      };
      case 'developer': return {
        gradient: 'from-cyan-500/20 to-blue-600/20',
        blobs: 'bg-cyan-500/30',
        blobs2: 'bg-blue-500/30',
        text: 'text-cyan-300',
        border: 'border-cyan-500/50',
        shadow: 'shadow-[0_0_50px_rgba(6,182,212,0.25)]',
        btn: 'bg-cyan-500 text-slate-900 hover:bg-cyan-400 shadow-cyan-500/20'
      };
      case 'academic': return {
        gradient: 'from-indigo-500/20 to-violet-600/20',
        blobs: 'bg-indigo-500/30',
        blobs2: 'bg-violet-500/30',
        text: 'text-indigo-300',
        border: 'border-indigo-500/50',
        shadow: 'shadow-[0_0_50px_rgba(99,102,241,0.25)]',
        btn: 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-indigo-500/20'
      };
      // Business & Default
      default: return {
        gradient: 'from-emerald-500/20 to-teal-600/20',
        blobs: 'bg-emerald-500/20',
        blobs2: 'bg-teal-500/20',
        text: 'text-emerald-300',
        border: 'border-emerald-500/50',
        shadow: 'shadow-[0_0_50px_rgba(16,185,129,0.25)]',
        btn: 'bg-emerald-500 text-slate-900 hover:bg-emerald-400 shadow-emerald-500/20'
      };
    }
  };

  const heroStyle = getHeroCardStyle();

  // --- WIZARD VIEW ---
  if (step === 'WIZARD') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 max-w-4xl mx-auto animate-float-up pt-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
          {t.heroTitle} <span className="text-emerald-500">{t.heroFlow}</span>
        </h1>
        <p className="text-xl text-slate-500 mb-12 text-center max-w-2xl">
          Who are you training to be today?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Persona Cards */}
          {PERSONAS.map((persona) => {
            const s = getPersonaStyle(persona.id);
            return (
              <button
                key={persona.id}
                onClick={() => onSelectPersona(persona.id as UserPersona)}
                className={`
                  relative group p-6 rounded-[2rem] border-2 transition-all duration-300 hover:-translate-y-2 text-left rtl:text-right overflow-hidden backdrop-blur-xl
                  ${s.bg} ${s.border} ${s.glow}
                `}
              >
                 {/* Inner Glow */}
                 <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
                 
                 <div className="relative z-10 flex items-center gap-4">
                    <div className={`p-4 rounded-full shadow-lg ${s.iconBg} transform group-hover:scale-110 transition-transform`}>
                      {s.icon}
                    </div>
                    <div>
                      <h3 className={`text-xl font-bold ${s.textGradient} drop-shadow-sm`}>
                          {lang === 'ar' ? persona.labelAr : persona.label}
                      </h3>
                       <p className="text-xs text-slate-400 font-medium mt-1">
                          {lang === 'ar' ? persona.descAr : persona.desc}
                      </p>
                    </div>
                 </div>
              </button>
            );
          })}
          
          {/* Study Lab Card (Free Mode) */}
           <button
                onClick={() => onStartModule('STUDY')}
                className="col-span-1 md:col-span-2 relative group p-6 rounded-[2rem] border-2 border-indigo-500/50 hover:border-indigo-400 bg-slate-900/70 backdrop-blur-xl shadow-[0_0_40px_rgba(99,102,241,0.15)] hover:-translate-y-2 transition-all text-left rtl:text-right overflow-hidden"
              >
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                 <div className="relative z-10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg text-white group-hover:scale-110 transition-transform">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 drop-shadow-sm">
                              {t.modStudy}
                          </h3>
                          <p className="text-xs text-slate-400 font-medium mt-1">
                              {t.modDescStudy}
                          </p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
                        <Zap className="w-3 h-3 text-indigo-400" />
                        <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">Free Mode</span>
                    </div>
                 </div>
              </button>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto animate-float-up pt-0 pb-20 px-4">
      
      {/* 1. TOP GAMIFICATION BAR WITH ENERGY */}
      <div className="w-full bg-slate-900/95 backdrop-blur-md text-white rounded-2xl p-3 shadow-lg mb-6 flex items-center justify-between border border-slate-800/50 relative overflow-hidden z-20">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none"></div>
          
          <div className="flex items-center gap-3 divide-x divide-slate-700 rtl:divide-x-reverse px-2 w-full relative z-10">
              {/* Level */}
              <div className="flex items-center gap-2 pr-2 rtl:pl-2">
                  <div className="relative"><Crown className="w-4 h-4 text-yellow-400" /></div>
                  <div className="flex flex-col"><span className="text-[9px] text-slate-400 font-bold uppercase leading-none">{t.level}</span><span className="text-xs font-bold text-white leading-none">{currentLevel.level}</span></div>
              </div>

              {/* Energy (NEW) */}
              <div className="flex items-center gap-2 px-2">
                   <div className="relative">
                      <Zap className={`w-4 h-4 ${stats.energy < 20 ? 'text-rose-500 animate-pulse' : 'text-blue-400'}`} />
                   </div>
                   <div className="flex flex-col min-w-[50px]">
                      <span className="text-[9px] text-slate-400 font-bold uppercase leading-none">{t.energy}</span>
                      <div className="flex items-center gap-1">
                          <span className={`text-xs font-bold leading-none ${stats.energy < 20 ? 'text-rose-400' : 'text-blue-400'}`}>{stats.energy}</span>
                          <span className="text-[9px] text-slate-500">/{stats.maxEnergy}</span>
                      </div>
                   </div>
              </div>

              {/* XP */}
              <div className="flex items-center gap-2 px-2">
                   <Star className="w-4 h-4 text-emerald-400" />
                   <div className="flex flex-col"><span className="text-[9px] text-slate-400 font-bold uppercase leading-none">{t.points}</span><span className="text-xs font-bold text-emerald-400 leading-none">{stats.xp}</span></div>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-2 px-2">
                   <Flame className="w-4 h-4 text-orange-500" />
                   <div className="flex flex-col"><span className="text-[9px] text-slate-400 font-bold uppercase leading-none">{t.streak}</span><span className="text-xs font-bold text-orange-500 leading-none">{stats.streak}</span></div>
              </div>
          </div>
      </div>

      {/* 2. HERO CARD (Neon / Glass) */}
      <div className={`
        w-full rounded-[2.5rem] p-8 text-white relative overflow-hidden mb-6 group transition-all duration-500
        bg-slate-900/80 backdrop-blur-xl border border-white/10
        ${heroStyle.border} ${heroStyle.shadow}
      `}>
          {/* Dynamic Background based on Persona */}
          <div className={`absolute inset-0 bg-gradient-to-br ${heroStyle.gradient}`}></div>
          <div className={`absolute -top-20 -left-20 w-64 h-64 rounded-full blur-[80px] animate-pulse-slow pointer-events-none ${heroStyle.blobs}`}></div>
          <div className={`absolute bottom-10 right-10 w-40 h-40 rounded-full blur-[60px] animate-pulse-slow delay-1000 pointer-events-none ${heroStyle.blobs2}`}></div>

          <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                  <div>
                      <p className="text-xs font-medium mb-1 uppercase tracking-wider opacity-70">{dateStr}</p>
                      <h2 className="text-3xl font-bold flex items-center gap-2">
                          {lang === 'ar' ? "أهلاً بك" : "Welcome"}
                      </h2>
                  </div>
                  <div className="p-2 bg-white/10 rounded-2xl backdrop-blur-md cursor-pointer hover:bg-white/20 transition-colors border border-white/10" onClick={() => onSelectPersona(null as any)}>
                      <User className="w-5 h-5 text-white" />
                  </div>
              </div>

              <div className="flex items-end justify-between">
                  <div>
                      <div className="text-xs mb-1 uppercase tracking-widest opacity-70">{t.trainingPersona}</div>
                      <div className={`text-2xl font-bold flex items-center gap-2 ${heroStyle.text}`}>
                        {lang === 'ar' ? PERSONAS.find(p => p.id === selectedPersona)?.labelAr : PERSONAS.find(p => p.id === selectedPersona)?.label}
                      </div>
                  </div>
                  <button onClick={onStartFull} className={`
                    px-5 py-3 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-2 transform hover:scale-105 border border-white/10
                    ${heroStyle.btn}
                  `}>
                      {t.startBtn} <ChevronRight className="w-3 h-3 rtl:rotate-180" />
                  </button>
              </div>
          </div>
      </div>

      {/* 3. GRID (NEON GLASS) - 2x2 Layout with Full Width Top */}
      <div className="grid grid-cols-2 gap-4 w-full mb-8">
          {[
              { id: 'vocab', icon: Sparkles, title: t.modVocab, desc: t.modDescVocab, color: "violet", action: () => onStartModule('VOCAB'), fullWidth: true },
              { id: 'articulation', icon: Activity, title: t.modMPT, desc: t.modDescMPT, color: "emerald", action: () => onStartModule('ARTICULATION') },
              { id: 'muscle', icon: Dumbbell, title: t.modMuscle, desc: t.modDescMuscle, color: "amber", action: () => onStartModule('MUSCLE') },
              { id: 'speed', icon: Zap, title: t.modSpeed, desc: t.modDescSpeed, color: "cyan", action: () => onStartModule('SPEED') },
              { id: 'hacking', icon: Terminal, title: t.artHacking, desc: t.artHackingDesc, color: "rose", action: () => onStartModule('KEYWORD') },
          ].map((item, index) => {
              const neon = getNeonGridStyle(item.color);
              
              return (
                <button 
                    key={item.id}
                    onClick={item.action}
                    className={`
                      relative overflow-hidden p-5 rounded-[2rem] border transition-all duration-300 flex flex-col items-center text-center group
                      bg-slate-900/70 backdrop-blur-xl hover:-translate-y-1 hover:shadow-2xl
                      ${neon.border}
                      ${item.fullWidth ? 'col-span-2 flex-row gap-6 justify-start text-left rtl:text-right pl-8' : ''}
                    `}
                >
                    {/* Background Texture Overlay */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                    
                    {/* Neon Glow Blobs */}
                    <div className={`absolute -top-10 -left-10 w-24 h-24 ${neon.glow} opacity-20 rounded-full blur-[50px] group-hover:opacity-40 transition-opacity`}></div>
                    <div className={`absolute bottom-0 right-0 w-20 h-20 ${neon.glow} opacity-10 rounded-full blur-[40px] group-hover:opacity-30 transition-opacity`}></div>

                    {/* Content */}
                    <div className={`relative z-10 flex ${item.fullWidth ? 'flex-row items-center gap-6' : 'flex-col items-center'}`}>
                        <div className={`
                            p-3.5 rounded-2xl ${item.fullWidth ? '' : 'mb-3'} shadow-lg transform group-hover:scale-110 transition-transform duration-300
                            bg-gradient-to-br ${neon.gradient}
                        `}>
                            <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                           <h3 className={`font-bold text-white ${item.fullWidth ? 'text-xl' : 'text-sm mb-1'}`}>{item.title}</h3>
                           <p className={`text-[10px] leading-tight font-medium opacity-80 ${neon.text} ${item.fullWidth ? 'text-sm' : ''}`}>{item.desc}</p>
                        </div>
                    </div>
                </button>
              );
          })}
      </div>
    </div>
  );
};
