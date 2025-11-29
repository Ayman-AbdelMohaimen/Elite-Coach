
import React, { useEffect, useRef } from 'react';
import { Play, Activity } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

interface AudioPlayerProps {
  audioUrl: string | null;
  label: string;
  visualizerScore?: number;
  visualizerLabel: string;
  referenceLabel: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, label, visualizerScore, visualizerLabel, referenceLabel }) => {
  const audioPlayerRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioPlayerRef.current && audioUrl) {
      audioPlayerRef.current.load();
    }
  }, [audioUrl]);

  if (!audioUrl) return null;

  return (
    <div className="w-full max-w-md mb-6 bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50 shadow-inner">
      <div className="flex items-center gap-3 mb-2 rtl:gap-3">
        <div className="p-1.5 bg-emerald-500/10 rounded-full">
          <Play className="w-3 h-3 text-emerald-500 fill-current rtl:rotate-180" />
        </div>
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
          {label}
        </span>
      </div>
      
      {visualizerScore !== undefined ? (
        <AudioVisualizer audioUrl={audioUrl} score={visualizerScore} label={visualizerLabel} referenceLabel={referenceLabel} />
      ) : (
        <div className="h-8 w-full bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse flex items-center justify-center">
            <Activity className="w-4 h-4 text-slate-400" />
        </div>
      )}

      <audio ref={audioPlayerRef} src={audioUrl} controls className="w-full h-8 accent-emerald-500 mt-2" />
    </div>
  );
};
