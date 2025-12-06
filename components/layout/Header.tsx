
import React from 'react';
import { Activity, Sun } from 'lucide-react';
import { TRANSLATIONS } from '../../constants';

interface HeaderProps {
  title: string;
  subtitle: string;
  lang: 'en' | 'ar';
  theme: 'dark' | 'light';
  onToggleLang: () => void;
  onToggleTheme: () => void;
  onHome: () => void;
  onExit?: () => void;
  showExit: boolean;
  exitLabel: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, subtitle, lang, theme, onToggleLang, onToggleTheme, onHome, onExit, showExit, exitLabel 
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/60 dark:bg-slate-950/60 border-b border-white/20 dark:border-slate-800/50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse group cursor-pointer" onClick={onHome}>
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 blur-md opacity-40 group-hover:opacity-70 transition-opacity rounded-full animate-pulse-slow"></div>
            <Activity className="w-7 h-7 text-emerald-600 dark:text-emerald-400 relative z-10 transform group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none font-sans">
                {title}
                </span>
                <span className="hidden sm:inline-block text-[10px] text-slate-400 font-medium italic">
                    {TRANSLATIONS[lang].slogan}
                </span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
              {subtitle}
            </span>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-4 rtl:gap-4">
          
          {/* Language & Theme Controls */}
          <div className="flex items-center gap-3">
             {/* Language Switch */}
            <button 
              onClick={onToggleLang} 
              className="relative overflow-hidden px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 transition-all group w-10 h-9 flex items-center justify-center"
            >
              <span className={`relative z-10 text-slate-600 dark:text-slate-300 group-hover:text-emerald-500 transition-colors ${lang === 'en' ? 'font-serif text-lg leading-none pt-1' : 'font-sans text-xs font-bold'}`}>
                {lang === 'en' ? '؏' : 'EN'}
              </span>
            </button>

            {/* 3D Theme Toggle */}
            <button 
              onClick={onToggleTheme}
              className="relative w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950 border border-slate-300 dark:border-slate-700 shadow-inner flex items-center justify-center overflow-hidden group perspective-500"
              aria-label="Toggle Theme"
            >
              <div className={`absolute inset-0 bg-sky-300/20 dark:bg-indigo-950/40 transition-colors duration-500`}></div>
              
              {/* Sun (Day) */}
              <div className={`absolute transform transition-all duration-700 ease-in-out origin-center ${theme === 'dark' ? 'rotate-180 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}>
                <Sun className="w-5 h-5 text-amber-500 fill-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              </div>
              
              {/* Metallic Moon (Night) */}
              <div className={`absolute transform transition-all duration-700 ease-in-out origin-center ${theme === 'light' ? '-rotate-180 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]">
                    <defs>
                        <linearGradient id="moonGradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#FFF7D1" /> 
                            <stop offset="50%" stopColor="#FACC15" />
                            <stop offset="100%" stopColor="#B45309" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                           <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                           <feMerge>
                               <feMergeNode in="coloredBlur"/>
                               <feMergeNode in="SourceGraphic"/>
                           </feMerge>
                        </filter>
                    </defs>
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="url(#moonGradient)" stroke="#B45309" strokeWidth="0.5" filter="url(#glow)" />
                </svg>
              </div>
            </button>
          </div>

          {showExit && onExit && (
            <button 
              onClick={onExit} 
              className="hidden md:block px-5 py-1.5 text-xs font-bold text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 rounded-full transition-all border border-rose-500/20 hover:border-rose-500/40 hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]"
            >
              {exitLabel}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
