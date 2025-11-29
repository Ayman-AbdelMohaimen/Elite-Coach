
import React from 'react';
import { Activity, Zap, FileText, Dumbbell, BrainCircuit } from 'lucide-react';
import { Button } from '../components/Button';

interface HomeViewProps {
  t: any;
  onStartFull: () => void;
  onStartTranscribe: () => void;
  onStartModule: (mod: 'ARTICULATION' | 'MUSCLE' | 'SPEED') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ t, onStartFull, onStartTranscribe, onStartModule }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center max-w-4xl mx-auto animate-float-up pt-10">
      <div className="relative mb-12 group">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity duration-1000"></div>
        <div className="relative z-10 bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 ring-1 ring-slate-200 dark:ring-slate-800">
          <Activity className="w-20 h-20 text-emerald-500 animate-pulse-slow" />
        </div>
      </div>
      
      <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight">
        {t.heroTitle} <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 drop-shadow-lg">
          {t.heroFlow}
        </span>
      </h1>
      
      <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed max-w-2xl font-light">
        {t.heroDesc}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-lg mb-16">
        <Button 
          variant="primary" 
          className="w-full text-lg h-14 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all duration-300"
          onClick={onStartFull}
          icon={<Zap className="w-5 h-5" />}
        >
          {t.startBtn}
        </Button>
        
        <Button 
          variant="secondary" 
          className="w-full text-lg h-14 hover:-translate-y-1 transition-all duration-300"
          onClick={onStartTranscribe}
          icon={<FileText className="w-5 h-5" />}
        >
          {t.transcribeBtn}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
        {[
          { id: 'articulation', icon: Activity, title: t.modMPT, desc: t.modDescMPT, color: "emerald", action: () => onStartModule('ARTICULATION') },
          { id: 'muscle', icon: Dumbbell, title: t.modMuscle, desc: t.modDescMuscle, color: "amber", action: () => onStartModule('MUSCLE') }, 
          { id: 'speed', icon: BrainCircuit, title: t.modSpeed, desc: t.modDescSpeed, color: "cyan", action: () => onStartModule('SPEED') },
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
             <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 group-hover:text-${mod.color}-500">{mod.title}</h4>
             <span className="text-[10px] text-slate-500 font-mono group-hover:text-slate-400">{mod.desc}</span>
           </button>
        ))}
      </div>
    </div>
  );
};
