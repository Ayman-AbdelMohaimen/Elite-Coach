
import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, Timer, Speaker, Home, Check, Mic, Square, RotateCcw, Zap, CheckCircle2, Volume2, Puzzle, Sparkles, BrainCircuit, User } from 'lucide-react';
import { Button } from '../components/Button';
import { AudioPlayer } from '../components/AudioPlayer';
import { VisemeGuide } from '../components/VisemeGuide';
import { SessionState, UserPersona } from '../types';
import { WARMUP_EXERCISES, SHADOWING_DRILLS, GAME_WORDS, PERSONAS } from '../constants';
import { analyzeShadowing } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

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
  onConsumeEnergy: (amount: number) => boolean;
  selectedPersona: UserPersona | null;
}

export const MuscleView: React.FC<Props> = ({ t, sessionState, setSessionState, audioRecorder, setShowReward, onPlayTTS, isPlayingTTS, lang, onUpdateStats, onConsumeEnergy, selectedPersona }) => {
  const [currentWarmupIndex, setCurrentWarmupIndex] = useState(0);
  const [warmupTimer, setWarmupTimer] = useState(0);
  const [currentShadowingIndex, setCurrentShadowingIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const warmupInterval = useRef<number | undefined>(undefined);

  // Game State
  const [gameCards, setGameCards] = useState<any[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);

  const personaConfig = PERSONAS.find(p => p.id === selectedPersona) || PERSONAS[0];
  const avatarUrl = `https://api.dicebear.com/9.x/${personaConfig.avatar.style}/svg?seed=${personaConfig.avatar.seed}`;

  useEffect(() => {
    if (sessionState === SessionState.WARMUP_ACTIVE && warmupTimer > 0) {
      warmupInterval.current = window.setInterval(() => setWarmupTimer(p => p > 0 ? p - 1 : 0), 1000);
    } else if (warmupTimer === 0) clearInterval(warmupInterval.current);
    return () => clearInterval(warmupInterval.current);
  }, [sessionState, warmupTimer]);

  const handleStartWarmup = () => {
    if (!onConsumeEnergy(5)) return; // Energy cost for warmup
    setCurrentWarmupIndex(0);
    setWarmupTimer(WARMUP_EXERCISES[0].duration);
    setSessionState(SessionState.WARMUP_ACTIVE);
  };

  const handleStartGame = () => {
    if (!onConsumeEnergy(10)) return; // Energy cost for game
    const cards = [...GAME_WORDS.map(w => ({ id: w.id, text: w.word, type: 'word' })), ...GAME_WORDS.map(w => ({ id: w.id, text: w.match, type: 'match' }))];
    // Shuffle
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    setGameCards(cards);
    setFlippedIndices([]);
    setMatchedIds([]);
    setMoves(0);
    setSessionState(SessionState.GAME_ACTIVE);
  };

  const handleCardClick = (index: number) => {
      if (flippedIndices.length === 2 || flippedIndices.includes(index) || matchedIds.includes(gameCards[index].id)) return;
      
      const newFlipped = [...flippedIndices, index];
      setFlippedIndices(newFlipped);

      if (newFlipped.length === 2) {
          setMoves(m => m + 1);
          const [idx1, idx2] = newFlipped;
          
          if (gameCards[idx1].id === gameCards[idx2].id) {
              // Match found
              setMatchedIds(prev => [...prev, gameCards[idx1].id]);
              setFlippedIndices([]);
              
              if (matchedIds.length + 1 === GAME_WORDS.length) {
                  setTimeout(() => {
                      setSessionState(SessionState.GAME_COMPLETED);
                      onUpdateStats(50);
                      setShowReward(true);
                  }, 500);
              }
          } else {
              // No match
              setTimeout(() => setFlippedIndices([]), 1000);
          }
      }
  };

  const handleAnalyzeShadowing = async () => {
    if (!audioRecorder.audioBlob) return;
    setIsAnalyzing(true);
    try {
      const base64 = await audioRecorder.blobToBase64(audioRecorder.audioBlob);
      const drill = SHADOWING_DRILLS[currentShadowingIndex];
      const res = await analyzeShadowing(base64, drill.text, audioRecorder.audioBlob.type, lang);
      setFeedback(res.feedback);
      setScore(res.score);
      onUpdateStats(10); 
      setShowReward(true);
    } catch (e) { console.error(e); }
    setIsAnalyzing(false);
  };

  // --- MENU ---
  if (sessionState === SessionState.MUSCLE_MENU) {
    return (
      <div className="flex flex-col items-center justify-center max-w-3xl mx-auto animate-float-up pt-10 w-full">
        <div className="mb-8 flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Dumbbell className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t.muscleMenuTitle}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <button onClick={handleStartWarmup} className="flex flex-col p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-amber-500/20 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all group text-left rtl:text-right backdrop-blur-sm">
            <div className="p-3 bg-amber-500/10 w-fit rounded-xl mb-4 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors"><Timer className="w-6 h-6" /></div>
            <h3 className="text-lg font-bold mb-2 dark:text-white group-hover:text-amber-400">{t.warmupBtn}</h3><p className="text-xs text-slate-500">{t.warmupDesc}</p>
             <span className="mt-auto pt-4 text-[10px] font-bold text-blue-400 flex items-center gap-1"><Zap className="w-3 h-3" /> 5 Energy</span>
          </button>
          <button onClick={() => { setCurrentShadowingIndex(0); setSessionState(SessionState.SHADOWING_CHAT); }} className="flex flex-col p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-amber-500/20 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all group text-left rtl:text-right backdrop-blur-sm">
            <div className="p-3 bg-amber-500/10 w-fit rounded-xl mb-4 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors"><Speaker className="w-6 h-6" /></div>
            <h3 className="text-lg font-bold mb-2 dark:text-white group-hover:text-amber-400">{t.shadowingBtn}</h3><p className="text-xs text-slate-500">{t.shadowingDesc}</p>
            <span className="mt-auto pt-4 text-[10px] font-bold text-blue-400 flex items-center gap-1"><Zap className="w-3 h-3" /> 10 Energy</span>
          </button>
          <button onClick={handleStartGame} className="relative flex flex-col p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-amber-500/20 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] transition-all group text-left rtl:text-right backdrop-blur-sm overflow-hidden">
             <div className="relative z-10 p-3 bg-amber-500/10 w-fit rounded-xl mb-4 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors"><Puzzle className="w-6 h-6" /></div>
             <h3 className="relative z-10 text-lg font-bold mb-2 text-slate-900 dark:text-white group-hover:text-amber-400 transition-colors">{t.gameBtn}</h3><p className="relative z-10 text-xs text-slate-500 dark:text-slate-400 font-medium">{t.gameDesc}</p>
             <span className="relative z-10 mt-auto pt-4 text-[10px] font-bold text-blue-400 flex items-center gap-1"><Zap className="w-3 h-3" /> 10 Energy</span>
          </button>
        </div>
        <Button variant="ghost" onClick={() => setSessionState(SessionState.IDLE)} className="mt-12 text-amber-500 hover:bg-amber-500/10" icon={<Home className="w-4 h-4" />}>{t.backHome}</Button>
      </div>
    );
  }

  // --- WARMUP ---
  if (sessionState === SessionState.WARMUP_ACTIVE) {
    const ex = WARMUP_EXERCISES[currentWarmupIndex];
    return (
      <div className="max-w-xl mx-auto w-full animate-float-up pt-10 text-center">
        <h2 className="text-3xl font-bold mb-10 dark:text-white flex items-center justify-center gap-3">
          <span className="text-amber-500">{currentWarmupIndex + 1}/{WARMUP_EXERCISES.length}</span>
          {lang === 'ar' ? ex.titleAr : ex.title}
        </h2>
        <div className="bg-slate-900 rounded-full w-64 h-64 mx-auto flex items-center justify-center border-4 border-amber-500 relative mb-10 shadow-[0_0_60px_rgba(245,158,11,0.4)]">
           <div className="absolute inset-0 bg-amber-500/10 rounded-full animate-pulse-slow"></div>
           <span className="text-8xl font-bold font-mono text-amber-500 relative z-10 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]">{warmupTimer}</span>
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 mb-8"><p className="text-lg font-medium text-slate-800 dark:text-slate-200">{lang === 'ar' ? ex.instructionAr : ex.instruction}</p></div>
        <div className="flex justify-center gap-4">
           <Button variant="secondary" onClick={() => setSessionState(SessionState.MUSCLE_MENU)}>{t.exit}</Button>
           {warmupTimer === 0 && <Button variant="primary" onClick={() => { if(currentWarmupIndex < WARMUP_EXERCISES.length -1) { setCurrentWarmupIndex(p=>p+1); setWarmupTimer(WARMUP_EXERCISES[currentWarmupIndex+1].duration); } else { onUpdateStats(20); setSessionState(SessionState.WARMUP_COMPLETED); } }} className="!bg-amber-500 hover:!bg-amber-400 shadow-lg">{t.nextEx}</Button>}
        </div>
      </div>
    );
  }

  if (sessionState === SessionState.WARMUP_COMPLETED) {
    return (
      <div className="max-w-lg mx-auto w-full animate-float-up pt-20 text-center flex flex-col items-center">
         <div className="relative mb-8">
            <div className="absolute inset-0 bg-amber-500/30 blur-xl rounded-full"></div>
            <CheckCircle2 className="w-24 h-24 text-amber-500 relative z-10" />
         </div>
         <h2 className="text-3xl font-bold text-white mb-4">Warm-up Complete!</h2>
         <p className="text-slate-400 mb-8">Your articulators are now ready for precision training.</p>
         <Button variant="primary" onClick={() => setSessionState(SessionState.MUSCLE_MENU)} className="!bg-amber-500 w-full md:w-auto px-10">{t.backMenu}</Button>
      </div>
    );
  }

  // --- SHADOWING CHAT MODE ---
  const drill = SHADOWING_DRILLS[currentShadowingIndex];
  if (sessionState === SessionState.SHADOWING_CHAT || sessionState.includes('SHADOWING')) {
     return (
      <div className="max-w-md mx-auto w-full animate-float-up pt-4 min-h-[80vh] flex flex-col">
         {/* HEADER */}
         <div className="flex items-center justify-between mb-4">
             <Button variant="ghost" onClick={() => setSessionState(SessionState.MUSCLE_MENU)} className="!px-3 !py-1 h-8 text-xs text-slate-400 hover:text-white"><Home className="w-4 h-4 mr-1" /> Exit</Button>
             <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-1 rounded">LESSON {currentShadowingIndex + 1}/{SHADOWING_DRILLS.length}</span>
         </div>

         {/* 3D AVATAR HEADER */}
         <div className="flex flex-col items-center mb-6">
             <div className="relative w-24 h-24 rounded-full border-4 border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.3)] bg-slate-800 overflow-hidden">
                <img src={avatarUrl} alt="Coach Avatar" className="w-full h-full object-cover" />
             </div>
             <h3 className="text-amber-500 font-bold mt-2">{lang === 'ar' ? personaConfig.labelAr : personaConfig.label} AI</h3>
             <p className="text-xs text-slate-500">Live Shadowing Session</p>
         </div>
         
         {/* CHAT INTERFACE */}
         <div className="flex-grow bg-slate-900/80 rounded-t-[2rem] border-x border-t border-slate-700 p-4 pb-20 relative overflow-hidden flex flex-col gap-4">
             
             {/* AI BUBBLE */}
             <div className="self-start max-w-[85%] animate-float-up">
                 <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 shadow-lg border border-slate-700">
                    <p className="text-sm text-slate-200 mb-2 leading-relaxed font-medium">"{drill.text}"</p>
                    <button onClick={() => onPlayTTS(drill.text)} className="flex items-center gap-2 text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full hover:bg-amber-500 hover:text-white transition-colors">
                        <Volume2 className={`w-3 h-3 ${isPlayingTTS ? 'animate-pulse' : ''}`} /> {t.listenNative}
                    </button>
                 </div>
                 <span className="text-[10px] text-slate-500 ml-2 mt-1 block">AI Coach • Just now</span>
             </div>

             {/* USER BUBBLE (RECORDER) */}
             <div className="self-end max-w-[85%] animate-float-up delay-100 flex flex-col items-end">
                 <div className="bg-amber-600 rounded-2xl rounded-tr-none p-3 shadow-lg border border-amber-500 text-white min-w-[200px]">
                    {!audioRecorder.isRecording && !score ? (
                         <div className="flex items-center justify-between">
                            <span className="text-xs font-bold opacity-80">Your Turn...</span>
                            <button onClick={async () => { if(onConsumeEnergy(5)) await audioRecorder.startRecording(); }} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                                <Mic className="w-5 h-5" />
                            </button>
                         </div>
                    ) : audioRecorder.isRecording ? (
                        <div className="flex items-center justify-between">
                            <div className="flex gap-1 h-4 items-end">
                                <div className="w-1 bg-white animate-pulse h-2"></div>
                                <div className="w-1 bg-white animate-pulse delay-75 h-4"></div>
                                <div className="w-1 bg-white animate-pulse delay-150 h-3"></div>
                            </div>
                            <button onClick={() => { audioRecorder.stopRecording(); handleAnalyzeShadowing(); }} className="p-2 bg-white text-rose-500 rounded-full hover:bg-slate-200 transition-colors">
                                <Square className="w-4 h-4 fill-current" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                             <div className="flex items-center justify-between">
                                <span className="text-xs font-bold">Recording Sent</span>
                                <Check className="w-4 h-4" />
                             </div>
                             <AudioPlayer audioUrl={audioRecorder.audioUrl} label="" visualizerLabel="" referenceLabel="" className="!h-10 opacity-50" />
                        </div>
                    )}
                 </div>
                 <span className="text-[10px] text-slate-500 mr-2 mt-1 block">You</span>
             </div>

             {/* FEEDBACK BUBBLE */}
             {score > 0 && !isAnalyzing && (
                 <div className="self-start max-w-[90%] animate-float-up delay-200">
                    <div className="bg-slate-800 rounded-2xl rounded-tl-none p-4 shadow-lg border border-emerald-500/30">
                        <div className="flex items-center gap-2 mb-2">
                             <span className={`text-xl font-bold ${score > 80 ? 'text-emerald-400' : 'text-yellow-400'}`}>{score}%</span>
                             <span className="text-xs text-slate-400 uppercase font-bold">Match Score</span>
                        </div>
                        <div className="prose prose-sm prose-invert text-xs leading-relaxed mb-3">
                             <ReactMarkdown>{feedback}</ReactMarkdown>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button onClick={() => { setScore(0); audioRecorder.resetRecording(); }} className="flex-1 py-2 bg-slate-700 rounded-lg text-xs font-bold hover:bg-slate-600 transition-colors">Try Again</button>
                            <button onClick={() => { setScore(0); audioRecorder.resetRecording(); if(currentShadowingIndex < SHADOWING_DRILLS.length-1) setCurrentShadowingIndex(p=>p+1); else setSessionState(SessionState.MUSCLE_MENU); }} className="flex-1 py-2 bg-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-500 transition-colors">Next</button>
                        </div>
                    </div>
                     <span className="text-[10px] text-slate-500 ml-2 mt-1 block">AI Coach • Analysis</span>
                 </div>
             )}

             {isAnalyzing && (
                 <div className="self-start bg-slate-800 p-3 rounded-2xl rounded-tl-none animate-pulse">
                     <span className="text-xs text-slate-400">Analyzing speech patterns...</span>
                 </div>
             )}
         </div>
      </div>
     );
  }

  // --- GAME ACTIVE ---
  if (sessionState === SessionState.GAME_ACTIVE) {
    return (
      <div className="max-w-2xl mx-auto w-full animate-float-up pt-10">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2"><Puzzle className="w-6 h-6 text-amber-500" /> {t.gameTitle}</h2>
            <div className="flex items-center gap-4 text-sm font-mono text-slate-500">
               <span>{t.moves}: {moves}</span>
               <span>{t.pairs}: {matchedIds.length}/{GAME_WORDS.length}</span>
            </div>
         </div>
         
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gameCards.map((card, index) => {
               const isFlipped = flippedIndices.includes(index) || matchedIds.includes(card.id);
               const isMatched = matchedIds.includes(card.id);
               return (
                  <button 
                    key={index}
                    onClick={() => handleCardClick(index)}
                    disabled={isMatched || flippedIndices.length === 2}
                    className={`
                       h-32 rounded-xl flex items-center justify-center p-4 text-center text-sm font-bold transition-all duration-500 transform perspective-1000
                       ${isMatched ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' : 
                         isFlipped ? 'bg-amber-500 text-slate-900 shadow-[0_0_20px_rgba(245,158,11,0.4)] rotate-y-180' : 
                         'bg-slate-800 text-slate-400 border border-slate-700 hover:border-amber-500/50'}
                    `}
                  >
                     {isFlipped ? card.text : <BrainCircuit className="w-8 h-8 opacity-20" />}
                  </button>
               );
            })}
         </div>
         <div className="mt-8 flex justify-center">
             <Button variant="ghost" onClick={() => setSessionState(SessionState.MUSCLE_MENU)} className="text-xs">{t.exit}</Button>
         </div>
      </div>
    )
  }

  // --- GAME COMPLETED ---
  if (sessionState === SessionState.GAME_COMPLETED) {
     return (
        <div className="max-w-lg mx-auto w-full animate-float-up pt-20 text-center flex flex-col items-center">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-amber-500/30 blur-xl rounded-full"></div>
                <Sparkles className="w-24 h-24 text-amber-500 relative z-10 animate-pulse" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">{t.gameComplete}</h2>
            <p className="text-xl text-amber-400 font-mono mb-8">{moves} Moves</p>
            <Button variant="primary" onClick={() => setSessionState(SessionState.MUSCLE_MENU)} className="!bg-amber-500 w-full md:w-auto px-10">{t.backMenu}</Button>
        </div>
     )
  }

  return null;
};
