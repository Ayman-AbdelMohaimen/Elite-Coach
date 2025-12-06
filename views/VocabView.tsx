
import React, { useState } from 'react';
import { Sparkles, ArrowLeft, Volume2, Mic, Square, CheckCircle2, RotateCcw, Zap } from 'lucide-react';
import { Button } from '../components/Button';
import { SessionState } from '../types';
import { VOCAB_CATEGORIES } from '../constants';
import { analyzeArticulationDrill } from '../services/geminiService';

interface Props {
  t: any;
  sessionState: SessionState;
  setSessionState: (s: SessionState) => void;
  audioRecorder: any;
  setShowReward: (b: boolean) => void;
  onPlayTTS: (text: string) => void;
  isPlayingTTS: boolean;
  lang: 'en' | 'ar';
  onUpdateStats: (xp: number) => void;
  onBack: () => void;
  onConsumeEnergy: (amount: number) => boolean;
}

export const VocabView: React.FC<Props> = ({
  t, sessionState, setSessionState, audioRecorder, setShowReward, onPlayTTS, isPlayingTTS, lang, onUpdateStats, onBack, onConsumeEnergy
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const category = VOCAB_CATEGORIES.find(c => c.id === selectedCategory);
  const currentWord = category ? category.words[currentWordIndex] : null;

  const handleStartDrill = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentWordIndex(0);
    setScore(null);
    setSessionState(SessionState.VOCAB_DRILL);
  };

  const handleRecord = async () => {
    if (!onConsumeEnergy(2)) return; // Low cost for beginner
    const started = await audioRecorder.startRecording();
    // Force rerender or state update handled by App's audioRecorder state
  };

  const handleAnalyze = async () => {
    if (!audioRecorder.audioBlob || !currentWord) return;
    setIsProcessing(true);
    
    try {
      const base64 = await audioRecorder.blobToBase64(audioRecorder.audioBlob);
      // Reuse the existing analysis service but we'll ignore complex feedback
      const result = await analyzeArticulationDrill(base64, currentWord.text, "General pronunciation", audioRecorder.audioBlob.type, lang);
      setScore(result.score);
      onUpdateStats(5);
      if(result.score > 70) setShowReward(true);
    } catch (e) {
      console.error(e);
      setScore(0); // Fallback
    }
    setIsProcessing(false);
  };

  const handleNextWord = () => {
     if (category && currentWordIndex < category.words.length - 1) {
       setCurrentWordIndex(prev => prev + 1);
       setScore(null);
       audioRecorder.resetRecording();
     } else {
       setSessionState(SessionState.VOCAB_MENU);
     }
  };

  // --- MENU ---
  if (sessionState === SessionState.VOCAB_MENU) {
    return (
      <div className="max-w-3xl mx-auto w-full animate-float-up pt-10">
         <div className="mb-8 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <Button variant="ghost" onClick={onBack} className="!p-2 mr-2"><ArrowLeft className="w-5 h-5 text-slate-500 rtl:rotate-180" /></Button>
             <div className="p-3 bg-violet-500/10 rounded-xl border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
               <Sparkles className="w-8 h-8 text-violet-500" />
             </div>
             <div>
               <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.vocabTitle}</h2>
               <p className="text-xs text-slate-500 uppercase tracking-widest">{t.vocabDesc}</p>
             </div>
           </div>
           <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 flex items-center gap-1"><Zap className="w-3 h-3" /> Cost: 2</span>
         </div>

         <div className="grid grid-cols-2 gap-4">
            {VOCAB_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleStartDrill(cat.id)}
                className="group relative overflow-hidden bg-slate-900 border border-slate-800 hover:border-violet-500/50 rounded-[2rem] p-6 text-center transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                 <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
                 <h3 className="text-xl font-bold text-white mb-1">{lang === 'ar' ? cat.titleAr : cat.title}</h3>
                 <span className="text-xs text-violet-400 font-medium">{cat.words.length} Words</span>
              </button>
            ))}
         </div>
      </div>
    );
  }

  // --- DRILL ---
  if (!currentWord) return null;

  return (
    <div className="max-w-lg mx-auto w-full animate-float-up pt-10 flex flex-col items-center">
       <div className="w-full flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => setSessionState(SessionState.VOCAB_MENU)}><ArrowLeft className="w-5 h-5 mr-2" /> {t.backMenu}</Button>
          <span className="text-violet-400 font-bold font-mono">{currentWordIndex + 1} / {category?.words.length}</span>
       </div>

       {/* Flashcard */}
       <div className="w-full bg-slate-900 rounded-[3rem] p-8 border border-violet-500/30 shadow-[0_0_50px_rgba(139,92,246,0.2)] text-center relative overflow-hidden mb-8">
           <div className="absolute -top-20 -left-20 w-40 h-40 bg-violet-500/20 rounded-full blur-[60px]"></div>
           <div className="absolute bottom-0 right-0 w-40 h-40 bg-purple-500/20 rounded-full blur-[60px]"></div>
           
           <div className="relative z-10">
               <div className="text-8xl mb-6 animate-bounce">{currentWord.emoji}</div>
               <h2 className="text-4xl font-bold text-white mb-2">{currentWord.text}</h2>
               <p className="text-xl text-violet-300 mb-8">{currentWord.translation}</p>
               
               <button 
                  onClick={() => onPlayTTS(currentWord.text)} 
                  disabled={isPlayingTTS}
                  className="mx-auto w-16 h-16 rounded-full bg-violet-500/20 text-violet-400 hover:bg-violet-500 hover:text-white transition-all flex items-center justify-center border border-violet-500/30 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
               >
                  <Volume2 className={`w-8 h-8 ${isPlayingTTS ? 'animate-pulse' : ''}`} />
               </button>
           </div>
       </div>

       {/* Score Display */}
       {score !== null && (
         <div className="mb-6 flex flex-col items-center animate-burst">
             <div className="flex items-center gap-2 text-2xl font-bold text-emerald-400 mb-2">
                <CheckCircle2 className="w-8 h-8" /> 
                {score}% Accuracy
             </div>
             <p className="text-slate-400 text-sm">{score > 80 ? "Amazing work! 🌟" : "Keep practicing!"}</p>
         </div>
       )}

       {/* Controls */}
       <div className="flex gap-4">
           {score === null ? (
               !audioRecorder.isRecording ? (
                 <Button variant="primary" onClick={handleRecord} className="!bg-violet-600 hover:!bg-violet-500 h-16 px-10 rounded-2xl text-lg shadow-lg" icon={<Mic className="w-6 h-6" />}>Record</Button>
               ) : (
                 <Button variant="danger" onClick={async () => { audioRecorder.stopRecording(); await new Promise(r => setTimeout(r, 500)); handleAnalyze(); }} className="h-16 px-10 rounded-2xl text-lg animate-pulse" icon={<Square className="w-6 h-6 fill-current" />}>Stop</Button>
               )
           ) : (
             <>
               <Button variant="secondary" onClick={() => { setScore(null); audioRecorder.resetRecording(); }} icon={<RotateCcw className="w-5 h-5" />}>Retry</Button>
               <Button variant="primary" onClick={handleNextWord} className="!bg-violet-600 shadow-lg">Next Word</Button>
             </>
           )}
           
           {isProcessing && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"><Zap className="w-10 h-10 text-violet-500 animate-spin" /></div>}
       </div>
    </div>
  );
};
