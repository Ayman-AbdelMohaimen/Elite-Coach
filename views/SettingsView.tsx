
import React, { useState } from 'react';
import { Settings, Sliders, User, Gauge, Volume2, Save, Check, Zap, Cpu } from 'lucide-react';
import { Button } from '../components/Button';
import { PERSONAS } from '../constants';
import { UserPersona } from '../types';

interface SettingsViewProps {
  t: any;
  lang: 'en' | 'ar';
  ttsGender: 'male' | 'female';
  ttsSpeed: number;
  ttsEngine: 'browser' | 'gemini';
  selectedPersona: UserPersona | null;
  onSetGender: (g: 'male' | 'female') => void;
  onSetSpeed: (s: number) => void;
  onSetEngine: (e: 'browser' | 'gemini') => void;
  onSetPersona: (p: UserPersona) => void;
  onTestVoice: () => void;
  onHome: () => void;
  isPlayingTTS: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  t, lang, ttsGender, ttsSpeed, ttsEngine, selectedPersona, onSetGender, onSetSpeed, onSetEngine, onSetPersona, onTestVoice, onHome, isPlayingTTS 
}) => {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('fluency_gender', ttsGender);
    localStorage.setItem('fluency_speed', ttsSpeed.toString());
    localStorage.setItem('fluency_engine', ttsEngine);
    if (selectedPersona) localStorage.setItem('fluency_persona', selectedPersona);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto w-full animate-float-up pt-10">
      <div className="mb-10 flex items-center gap-3">
        <div className="p-3 bg-slate-500/10 rounded-xl">
          <Settings className="w-8 h-8 text-slate-500 dark:text-slate-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t.settingsTitle}</h2>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-lg mb-8">
         
         {/* Persona Selection */}
         <div className="mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">{t.trainingPersona}</label>
            <select 
              value={selectedPersona || ''}
              onChange={(e) => onSetPersona(e.target.value as UserPersona)}
              className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-lg dark:text-white"
            >
              <option value="" disabled>{t.selectPersona}</option>
              {PERSONAS.map(p => (
                <option key={p.id} value={p.id}>{lang === 'ar' ? p.labelAr : p.label}</option>
              ))}
            </select>
         </div>

         <div className="flex items-center gap-2 mb-6 text-emerald-500">
           <Sliders className="w-5 h-5" />
           <h3 className="text-sm font-bold uppercase tracking-widest">{t.audioPref}</h3>
         </div>

         <div className="space-y-8">
           
           {/* Audio Engine */}
           <div>
             <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">{t.engineType}</label>
             <div className="grid grid-cols-2 gap-3">
               <button 
                  onClick={() => onSetEngine('browser')}
                  className={`flex flex-col items-center justify-center px-4 py-4 rounded-xl border transition-all gap-2 ${ttsEngine === 'browser' 
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400 font-bold ring-2 ring-cyan-500/20' 
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
               >
                 <Zap className="w-5 h-5" /> 
                 <span className="text-xs">{t.engineBrowser}</span>
               </button>
               
               <button 
                  onClick={() => onSetEngine('gemini')}
                  className={`flex flex-col items-center justify-center px-4 py-4 rounded-xl border transition-all gap-2 ${ttsEngine === 'gemini' 
                    ? 'bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-400 font-bold ring-2 ring-purple-500/20' 
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
               >
                 <Cpu className="w-5 h-5" /> 
                 <span className="text-xs">{t.engineGemini}</span>
               </button>
             </div>
           </div>

           {/* Voice Gender */}
           <div>
             <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">{t.voiceGender}</label>
             <div className="grid grid-cols-2 gap-3">
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
             </div>
           </div>

           {/* Playback Speed */}
           <div>
             <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">{t.playbackSpeed}</label>
             <div className="grid grid-cols-3 gap-3">
               {[0.75, 1.0, 1.25].map(s => (
                 <button 
                    key={s}
                    onClick={() => onSetSpeed(s)}
                    className={`flex items-center justify-center px-4 py-3 rounded-xl border transition-all ${ttsSpeed === s 
                      ? 'bg-slate-200 dark:bg-slate-700 border-slate-400 text-slate-900 dark:text-white font-bold' 
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                 >
                   <Gauge className="w-4 h-4 mr-2" /> {s}x
                 </button>
               ))}
             </div>
           </div>
           
           <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
             <Button 
                variant="secondary" 
                onClick={onTestVoice}
                icon={<Volume2 className={`w-4 h-4 ${isPlayingTTS ? 'animate-pulse' : ''}`} />}
                className="w-full"
                disabled={isPlayingTTS}
             >
               {t.testVoice}
             </Button>

             <Button 
                variant="primary" 
                onClick={handleSave}
                icon={isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                className={`w-full ${isSaved ? '!bg-emerald-600' : ''}`}
             >
               {isSaved ? t.saved : t.savePref}
             </Button>
           </div>
         </div>
      </div>
      
      <Button variant="ghost" onClick={onHome} className="w-full">{t.backHome}</Button>
    </div>
  );
};
