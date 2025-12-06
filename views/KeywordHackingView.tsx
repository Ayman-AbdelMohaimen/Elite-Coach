
import React, { useState } from 'react';
import { Terminal, Lock, Unlock, ShieldAlert, Cpu, Mic, Square, Volume2, ChevronRight, ArrowLeft, PlayCircle, Zap } from 'lucide-react';
import { Button } from '../components/Button';
import { SessionState, UserPersona, KeywordChallenge } from '../types';
import { KEYWORD_CHALLENGES } from '../constants';
import { analyzeArticulationDrill } from '../services/geminiService';

interface Props {
  t: any;
  sessionState: SessionState;
  setSessionState: (s: SessionState) => void;
  audioRecorder: any;
  setShowReward: (b: boolean) => void;
  onPlayTTS: (text: string) => void;
  lang: 'en' | 'ar';
  selectedPersona: UserPersona | null;
  onUpdateStats: (xp: number) => void;
  onBack: () => void;
  onConsumeEnergy: (amount: number) => boolean;
}

export const KeywordHackingView: React.FC<Props> = ({ 
  t, sessionState, setSessionState, audioRecorder, setShowReward, onPlayTTS, lang, selectedPersona, onUpdateStats, onBack, onConsumeEnergy
}) => {
  const [currentKeywordIndex, setCurrentKeywordIndex] = useState(0);
  const [hackStatus, setHackStatus] = useState<'LOCKED' | 'DECRYPTING' | 'ACCESS_GRANTED' | 'ACCESS_DENIED'>('LOCKED');
  const [score, setScore] = useState(0);

  const challenges = KEYWORD_CHALLENGES[selectedPersona || 'business'] || KEYWORD_CHALLENGES['business'];
  const currentKeyword = challenges[currentKeywordIndex];
  const isRecorded = audioRecorder.isRecording;

  const handleRecord = async () => {
    if (!onConsumeEnergy(10)) return;
    const started = await audioRecorder.startRecording();
    // Force UI update if needed
  };

  const handleAnalyzeHack = async () => {
    if (!audioRecorder.audioBlob) return;
    setHackStatus('DECRYPTING');
    
    // Slight artificial delay for effect
    await new Promise(r => setTimeout(r, 1500));

    try {
      const base64 = await audioRecorder.blobToBase64(audioRecorder.audioBlob);
      const result = await analyzeArticulationDrill(base64, currentKeyword.word, "Perfect technical pronunciation", audioRecorder.audioBlob.type, lang);
      
      setScore(result.score);
      if (result.score >= 80) {
          setHackStatus('ACCESS_GRANTED');
          onUpdateStats(50); // High reward
          setShowReward(true);
      } else {
          setHackStatus('ACCESS_DENIED');
      }
    } catch (e) { 
        console.error(e);
        setHackStatus('ACCESS_DENIED');
    }
  };

  // --- MENU VIEW (LIST) ---
  if (sessionState === SessionState.KEYWORD_MENU) {
    return (
      <div className="max-w-3xl mx-auto w-full animate-float-up pt-10">
        <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={onBack} className="!p-2 mr-2"><ArrowLeft className="w-5 h-5 text-slate-500 rtl:rotate-180" /></Button>
              <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                <Terminal className="w-8 h-8 text-rose-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.artHacking}</h2>
                <p className="text-xs text-slate-500 uppercase tracking-widest">{t.artHackingDesc}</p>
              </div>
            </div>
            <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 flex items-center gap-1"><Zap className="w-3 h-3" /> Cost: 10</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {challenges.map((challenge, index) => (
             <button 
                key={challenge.id}
                onClick={() => { setCurrentKeywordIndex(index); setHackStatus('LOCKED'); setSessionState(SessionState.KEYWORD_DRILL); }}
                className="group relative overflow-hidden bg-slate-900 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 text-left transition-all hover:-translate-y-1 hover:shadow-xl"
             >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
                <div className="absolute right-0 top-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
                   <Lock className="w-5 h-5 text-emerald-500" />
                </div>
                
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md mb-3 inline-block
                  ${challenge.difficulty === 'Legend' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-emerald-500/20 text-emerald-500'}
                `}>
                  {challenge.difficulty}
                </span>
                
                <h3 className="text-xl font-bold text-white font-mono mb-1 group-hover:text-emerald-400 transition-colors">
                   {challenge.word}
                </h3>
                <p className="text-xs text-slate-500 truncate">{lang === 'ar' ? challenge.definitionAr : challenge.definition}</p>
             </button>
           ))}
        </div>
      </div>
    );
  }

  // --- DRILL VIEW (TERMINAL) ---
  return (
    <div className="min-h-[80vh] flex flex-col w-full max-w-2xl mx-auto font-mono animate-float-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 p-4 bg-black border border-emerald-500/30 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <div className="flex items-center gap-3 text-emerald-500">
                <Terminal className="w-5 h-5" />
                <span className="text-xs font-bold tracking-widest uppercase">Elite Keyword Hacking // {selectedPersona}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 animate-pulse rounded-full"></span>
                <span className="text-xs text-emerald-700">SYSTEM ONLINE</span>
                <button onClick={() => setSessionState(SessionState.KEYWORD_MENU)} className="ml-4 text-emerald-800 hover:text-emerald-500 transition-colors text-xs">[EXIT]</button>
            </div>
        </div>

        {/* Main Terminal Screen */}
        <div className="relative bg-black rounded-xl border-2 border-emerald-500/50 p-8 md:p-12 shadow-[0_0_40px_rgba(16,185,129,0.15)] flex flex-col items-center justify-center min-h-[400px] overflow-hidden">
            {/* Scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 pointer-events-none bg-[length:100%_4px,3px_100%]"></div>
            <div className="absolute inset-0 bg-emerald-500/5 animate-pulse-slow z-0 pointer-events-none"></div>

            <div className="relative z-10 w-full text-center">
                <div className="mb-2 text-emerald-800 text-xs tracking-[0.3em] uppercase">Target Parameter</div>
                
                <h2 className={`text-4xl md:text-6xl font-bold mb-4 tracking-tighter ${hackStatus === 'ACCESS_DENIED' ? 'text-red-500' : hackStatus === 'ACCESS_GRANTED' ? 'text-emerald-400' : 'text-white'}`}>
                    {currentKeyword.word}
                </h2>
                
                <div className="flex items-center justify-center gap-4 mb-8">
                      <span className="text-emerald-600 text-lg">[{currentKeyword.phonetics}]</span>
                      <button onClick={() => onPlayTTS(currentKeyword.word)} className="p-2 bg-emerald-900/30 rounded hover:bg-emerald-500/20 text-emerald-400 transition-colors"><Volume2 className="w-4 h-4" /></button>
                </div>

                <div className="bg-emerald-950/40 border border-emerald-500/20 p-4 rounded-lg max-w-md mx-auto mb-6 text-left">
                    <p className="text-emerald-300/80 text-sm mb-2">
                        <span className="text-emerald-600 font-bold mr-2">&gt; DEF:</span> 
                        {lang === 'ar' ? currentKeyword.definitionAr : currentKeyword.definition}
                    </p>
                    {/* NEW CONTEXT SECTION */}
                    <div className="border-t border-emerald-500/20 pt-2 mt-2">
                        <span className="text-emerald-600 font-bold mr-2 text-xs uppercase">&gt; Context Usage:</span>
                        <div className="flex items-start gap-2 mt-1">
                             <p className="text-emerald-100 italic text-sm">"{currentKeyword.context}"</p>
                             <button onClick={() => onPlayTTS(currentKeyword.context)} className="text-emerald-500 hover:text-white"><PlayCircle className="w-4 h-4" /></button>
                        </div>
                    </div>
                </div>

                {/* STATUS DISPLAY */}
                <div className="h-20 flex items-center justify-center">
                    {hackStatus === 'LOCKED' && !isRecorded && (
                        <div className="flex flex-col items-center gap-2 text-emerald-700 animate-pulse">
                            <Lock className="w-6 h-6" />
                            <span className="text-xs tracking-widest">AWAITING AUDIO INPUT...</span>
                        </div>
                    )}
                    {hackStatus === 'LOCKED' && isRecorded && (
                          <div className="flex flex-col items-center gap-2 text-red-500 animate-pulse">
                            <div className="w-12 h-12 rounded-full border-4 border-red-500/30 border-t-red-500 animate-spin"></div>
                            <span className="text-xs tracking-widest">RECORDING...</span>
                        </div>
                    )}
                    {hackStatus === 'DECRYPTING' && (
                        <div className="flex flex-col items-center gap-2 text-yellow-400">
                            <Cpu className="w-8 h-8 animate-bounce" />
                            <span className="font-mono text-sm">DECRYPTING VOICE SIGNATURE...</span>
                        </div>
                    )}
                    {hackStatus === 'ACCESS_GRANTED' && (
                          <div className="flex flex-col items-center gap-2 text-emerald-400 animate-float-up">
                            <Unlock className="w-10 h-10" />
                            <span className="font-bold text-xl tracking-widest border-b-2 border-emerald-400 pb-1">ACCESS GRANTED</span>
                            <span className="text-xs text-emerald-600">MATCH: {score}%</span>
                        </div>
                    )}
                    {hackStatus === 'ACCESS_DENIED' && (
                          <div className="flex flex-col items-center gap-2 text-red-500 animate-burst">
                            <ShieldAlert className="w-10 h-10" />
                            <span className="font-bold text-xl tracking-widest border-b-2 border-red-500 pb-1">ACCESS DENIED</span>
                            <span className="text-xs text-red-700">MATCH: {score}% // RETRY REQUIRED</span>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* CONTROLS */}
        <div className="mt-8 flex justify-center gap-4">
            {hackStatus === 'LOCKED' && !isRecorded && (
                <button 
                    onClick={handleRecord}
                    className="group relative px-8 py-4 bg-emerald-950 border border-emerald-500/50 hover:bg-emerald-900/50 transition-all rounded-lg overflow-hidden"
                >
                    <div className="absolute inset-0 bg-emerald-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative z-10 flex items-center gap-2 text-emerald-400 font-bold tracking-widest">
                        <Mic className="w-5 h-5" /> INITIATE HACK
                    </span>
                </button>
            )}
            
            {hackStatus === 'LOCKED' && isRecorded && (
                <button 
                    onClick={() => { audioRecorder.stopRecording(); handleAnalyzeHack(); }}
                    className="px-8 py-4 bg-red-950 border border-red-500/50 hover:bg-red-900/50 transition-all rounded-lg text-red-400 font-bold tracking-widest flex items-center gap-2"
                >
                    <Square className="w-4 h-4 fill-current" /> EXECUTE
                </button>
            )}

            {(hackStatus === 'ACCESS_GRANTED' || hackStatus === 'ACCESS_DENIED') && (
                <>
                    <button onClick={() => { setHackStatus('LOCKED'); audioRecorder.resetRecording(); }} className="px-6 py-3 border border-emerald-800 text-emerald-600 hover:bg-emerald-950 rounded-lg text-xs font-bold tracking-wider">
                        RETRY
                    </button>
                    {hackStatus === 'ACCESS_GRANTED' && (
                          <button onClick={() => { if(currentKeywordIndex < challenges.length-1) { setCurrentKeywordIndex(p=>p+1); setHackStatus('LOCKED'); } else { setSessionState(SessionState.KEYWORD_MENU); } }} className="px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.4)] tracking-widest flex items-center gap-2">
                            NEXT TARGET <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </>
            )}
        </div>
    </div>
  );
};
