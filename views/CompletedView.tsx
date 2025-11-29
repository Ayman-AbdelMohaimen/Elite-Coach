
import React from 'react';
import { CheckCircle2, Home } from 'lucide-react';
import { Button } from '../components/Button';

interface Props {
  t: any;
  onHome: () => void;
}

export const CompletedView: React.FC<Props> = ({ t, onHome }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-float-up text-center pt-10">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-emerald-500/30 blur-[80px] rounded-full animate-pulse-slow"></div>
        <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full p-8 relative z-10 shadow-[0_0_50px_rgba(16,185,129,0.5)]">
           <CheckCircle2 className="w-20 h-20 text-white" />
        </div>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Session Complete!</h2>
      <p className="text-slate-600 dark:text-slate-400 mb-12 max-w-md text-lg leading-relaxed">
        Excellent work. Your brain is adapting to the new articulation patterns and recall speed. Rest your articulators.
      </p>
      <Button variant="primary" onClick={onHome} icon={<Home className="w-5 h-5" />} className="h-14 px-10 text-lg">
        {t.backHome}
      </Button>
    </div>
  );
};
