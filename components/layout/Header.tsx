
import React from 'react';
import { Activity, Moon, Sun } from 'lucide-react';
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
        <div className="flex items-center space-x-3 rtl:space-x-reverse group cursor-pointer" onClick={onHome}>
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 blur-md opacity-40 group-hover:opacity-70 transition-opacity rounded-full"></div>
            <Activity className="w-7 h-7 text-emerald-600 dark:text-emerald-400 relative z-10 transform group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
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

        <div className="flex items-center gap-3 rtl:gap-3">
          <div className="hidden md:flex items-center bg-slate-100/50 dark:bg-slate-900/50 rounded-full p-1 border border-slate-200 dark:border-slate-800">
            <button 
              onClick={onToggleLang} 
              className="px-3 py-1 rounded-full text-xs font-bold transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm text-slate-600 dark:text-slate-400"
            >
              {lang.toUpperCase()}
            </button>
            <div className="w-px h-3 bg-slate-300 dark:bg-slate-700 mx-1"></div>
            <button 
              onClick={onToggleTheme} 
              className="p-1.5 rounded-full hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all text-slate-600 dark:text-slate-400"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button onClick={onToggleLang} className="text-xs font-bold bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
              {lang === 'en' ? 'AR' : 'EN'}
            </button>
            <button onClick={onToggleTheme} className="bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {showExit && onExit && (
            <button 
              onClick={onExit} 
              className="hidden md:block px-4 py-1.5 text-xs font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 rounded-full transition-colors border border-rose-500/20"
            >
              {exitLabel}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
