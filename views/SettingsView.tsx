
import React from 'react';
import { Settings, Sliders, User, Gauge, Volume2, Mic } from 'lucide-react';
import { Button } from '../components/Button';

interface SettingsViewProps {
  t: any;
  ttsGender: 'male' | 'female';
  ttsSpeed: number;
  onSetGender: (g: 'male' | 'female') => void;
  onSetSpeed: (s: number) => void;
  onTestVoice: () => void;
  onHome: () => void;
  isPlayingTTS: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  t, ttsGender, ttsSpeed, onSetGender, onSetSpeed, onTestVoice, onHome, isPlayingTTS 
}) => {
  return (
    <div className="max-w-2xl mx-auto w-full animate-float-up pt-10">
      <div className="mb-10 flex items-center gap-3">
        <div className="p-3 bg-slate-500/10 rounded-xl">
          <Settings className="w-8 h-8 text-slate-500 dark:text-slate-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t.settingsTitle}</h2>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-lg mb-8">
         <div className="flex items-center gap-2 mb-6 text-emerald-500">
           <Sliders className="w-5 h-5" />
           <h3 className="text-sm font-bold uppercase tracking-widest">{t.audioPref}</h3>
         </div>

         <div className="space-y-8">
           {/* Voice Gender */}
           <div>
             <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">{t.voiceGender}</label>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
               <button 
                  onClick={() => onSetGender('male')}
                  className={`flex items-center justify-center px-4 py-3 rounded-xl border transition-all ${ttsGender === 'male' 
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold ring-2 ring-emerald-500/20' 
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
               >
                 <User className="w-4 h-4 mr-2" /> {t.voiceMale}
               </button>
               
               <button 
                  onClick={() => onSetGender('female')}
                  className={`flex items-center justify-center px-4 py-3 rounded-xl border transition-all ${ttsGender === 'female' 
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold ring-2 ring-emerald-500/20' 
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
               >
                 <User className="w-4 h-4 mr-2" /> {t.voiceFemale}
               </button>

               <button 
                  disabled
                  className="flex items-center justify-between px-4 py-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-400 opacity-75 cursor-not-allowed"
               >
                 <div className="flex items-center">
                    <Mic className="w-4 h-4 mr-2" /> {t.voiceClone}
                 </div>
                 <span className="text-[9px] font-bold bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">{t.comingSoon}</span>
               </button>
             </div>
           </div>

           {/* Playback Speed */}
           <div>
             <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">{t.playbackSpeed}</label>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
               <button 
                  onClick={() => onSetSpeed(0.75)}
                  className={`flex items-center justify-center px-4 py-3 rounded-xl border transition-all ${ttsSpeed === 0.75 
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400 font-bold ring-2 ring-cyan-500/20' 
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
               >
                 <Gauge className="w-4 h-4 mr-2" /> {t.speedSlow}
               </button>
               
               <button 
                  onClick={() => onSetSpeed(1.0)}
                  className={`flex items-center justify-center px-4 py-3 rounded-xl border transition-all ${ttsSpeed === 1.0 
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400 font-bold ring-2 ring-cyan-500/20' 
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
               >
                 <Gauge className="w-4 h-4 mr-2" /> {t.speedNormal}
               </button>
               
               <button 
                  onClick={() => onSetSpeed(1.25)}
                  className={`flex items-center justify-center px-4 py-3 rounded-xl border transition-all ${ttsSpeed === 1.25 
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400 font-bold ring-2 ring-cyan-500/20' 
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
               >
                 <Gauge className="w-4 h-4 mr-2" /> {t.speedFast}
               </button>
             </div>
           </div>
           
           <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
             <Button 
                variant="secondary" 
                onClick={onTestVoice}
                icon={<Volume2 className={`w-4 h-4 ${isPlayingTTS ? 'animate-pulse' : ''}`} />}
                className="w-full"
                disabled={isPlayingTTS}
             >
               {t.testVoice}
             </Button>
           </div>
         </div>
      </div>
      
      <Button variant="ghost" onClick={onHome} className="w-full">{t.backHome}</Button>
    </div>
  );
};
