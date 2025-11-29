
import React from 'react';
import { Home, Activity, Dumbbell, BrainCircuit, Settings } from 'lucide-react';
import { SessionState } from '../../types';

interface MobileNavProps {
  sessionState: SessionState;
  onNav: (target: 'HOME' | 'ARTICULATION' | 'MUSCLE' | 'SPEED' | 'SETTINGS') => void;
  labels: {
    home: string;
    drills: string;
    muscle: string;
    speed: string;
    settings: string;
  };
}

export const MobileNav: React.FC<MobileNavProps> = ({ sessionState, onNav, labels }) => {
  const navItems = [
    { id: 'HOME', icon: Home, label: labels.home, active: sessionState === SessionState.IDLE },
    { id: 'ARTICULATION', icon: Activity, label: labels.drills, active: sessionState.includes('DRILL') || sessionState.includes('ARTICULATION') || sessionState.includes('DIAGNOSTIC') },
    { id: 'MUSCLE', icon: Dumbbell, label: labels.muscle, active: sessionState.includes('MUSCLE') || sessionState.includes('WARMUP') || sessionState.includes('SHADOWING') },
    { id: 'SPEED', icon: BrainCircuit, label: labels.speed, active: sessionState.includes('SPEED') },
    { id: 'SETTINGS', icon: Settings, label: labels.settings, active: sessionState === SessionState.SETTINGS },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-white/20 dark:border-slate-800 pb-safe pt-2 px-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
      <div className="flex justify-between items-center">
        {navItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => onNav(item.id as any)}
            className={`flex flex-col items-center p-2 transition-all duration-300 flex-1 ${item.active ? '-translate-y-2' : ''}`}
          >
            <div className={`
              relative p-3 rounded-2xl mb-1 transition-all duration-500 ease-out
              ${item.active 
                ? 'bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 shadow-[0_10px_20px_-5px_rgba(16,185,129,0.4)] scale-110 ring-1 ring-white/20' 
                : 'bg-slate-100 dark:bg-slate-900 text-slate-400 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-800'}
            `}>
              {item.active && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/20 to-transparent opacity-50 pointer-events-none" />
              )}
              <item.icon className={`w-5 h-5 relative z-10 ${item.active ? 'text-white drop-shadow-md' : ''}`} strokeWidth={item.active ? 2.5 : 2} />
            </div>
            {item.active && (
              <span className="text-[9px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 animate-pulse truncate max-w-[60px]">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
