
import React, { useState, useEffect, useRef } from 'react';
import { Dumbbell, Timer, Speaker, Home, Check, Mic, Square, RotateCcw, Zap, CheckCircle2, Volume2, Puzzle, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { AudioPlayer } from '../components/AudioPlayer';
import { VisemeGuide } from '../components/VisemeGuide';
import { SessionState } from '../types';
import { WARMUP_EXERCISES, SHADOWING_DRILLS, GAME_WORDS } from '../constants';
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
}

export const MuscleView: React.FC<Props> = ({ t, sessionState, setSessionState, audioRecorder, setShowReward, onPlayTTS, isPlayingTTS, lang }) => {
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

  useEffect(() => {
    if (sessionState === SessionState.WARMUP_ACTIVE && warmupTimer > 0) {
      warmupInterval.current = window.setInterval(() => setWarmupTimer(p => p > 0 ? p - 1 : 0), 1000);
    } else if (warmupTimer === 0) clearInterval(warmupInterval.current);
    return () => clearInterval(warmupInterval.current);
  }, [sessionState, warmupTimer]);

  const handleStartWarmup = () => {
    setCurrentWarmupIndex(0);
    setWarmupTimer(WARMUP_EXERCISES[0].duration);
    setSessionState(SessionState.WARMUP_ACTIVE);
  };

  const handleStartGame = () => {
    // Initialize Game
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
              setMatchedIds(prev => [...prev, gameCards[idx1].id]);
              setFlippedIndices([]);
              if (matchedIds.length + 1 === GAME_WORDS.length) {
                  setTimeout(() => {
                      setSessionState(SessionState.GAME_COMPLETED);
                      setShowReward(true);
                  }, 500);
              }
          } else {
              setTimeout(() => setFlippedIndices([]), 1000);
          }
      }
  };

  const handleAnalyzeShadowing = async () => {
    if (!audioRecorder.audioBlob) return;
    setSessionState(SessionState.SHADOWING_PROCESSING);
    setIsAnalyzing(true);
    try {
      const base64 = await audioRecorder.blobToBase64(audioRecorder.audioBlob);
      const drill = SHADOWING_DRILLS[currentShadowingIndex];
      const res = await analyzeShadowing(base64, drill.text, audioRecorder.audioBlob.type, lang);
      setFeedback(res.feedback);
      setScore(res.score);
      setSessionState(SessionState.SHADOWING_FEEDBACK);
      setShowReward(true);
    } catch (e) { console.error(e); }
    setIsAnalyzing(false);
  };

  if (sessionState === SessionState.MUSCLE_MENU) {
    return (
      <div className="flex flex-col items-center justify-center max-w-3xl mx-auto animate-float-up pt-10 w-full">
        <div className="mb-8 flex items-center gap-3"><div className="p-3 bg-amber-500/10 rounded-xl"><Dumbbell className="w-8 h-8 text-amber-500" /></div><h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t.muscleMenuTitle}</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <button onClick={handleStartWarmup} className="flex flex-col p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:shadow-lg transition-all group text-left rtl:text-right"><div className="p-3 bg-amber-500/10 w-fit rounded-xl mb-4 text-amber-500"><Timer className="w-6 h-6" /></div><h3 className="text-lg font-bold mb-2 dark:text-white">{t.warmupBtn}</h3><p className="text-xs text-slate-500">{t.warmupDesc}</p></button>
          <button onClick={() => { setCurrentShadowingIndex(0); setSessionState(SessionState.SHADOWING_INTRO); }} className="flex flex-col p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:shadow-lg transition-all group text-left rtl:text-right"><div className="p-3 bg-amber-500/10 w-fit rounded-xl mb-4 text-amber-500"><Speaker className="w-6 h-6" /></div><h3 className="text-lg font-bold mb-2 dark:text-white">{t.shadowingBtn}</h3><p className="text-xs text-slate-500">{t.shadowingDesc}</p></button>
          <button 
             onClick={handleStartGame} 
             className="relative flex flex-col p-6 rounded-3xl bg-gradient-to-br from-purple-500/5 to-fuchsia-500/5 dark:from-purple-900/20 dark:to-fuchsia-900/20 border border-purple-200 dark:border-purple-800 hover:border-purple-500 hover:shadow-purple-500/20 hover:-translate-y-1 transition-all group text-left rtl:text-right overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl -mr-8 -mt-8"></div>
             <div className="p-3 bg-gradient-to-br from-purple-500 to-fuchsia-600 w-fit rounded-xl mb-4 text-white shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform"><Puzzle className="w-6 h-6" /></div>
             <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{t.gameBtn}</h3>
             <p className="text-xs text-slate-500 relative z-10">{t.gameDesc}</p>
          </button>
        </div>
        <Button variant="ghost" onClick={() => setSessionState(SessionState.IDLE)} className="mt-12" icon={<Home className="w-4 h-4" />}>{t.backHome}</Button>
      </div>
    );
  }

  if (sessionState === SessionState.WARMUP_ACTIVE) {
    const ex = WARMUP_EXERCISES[currentWarmupIndex];
    return (
      <div className="max-w-xl mx-auto w-full animate-float-up pt-10 text-center">
        <h2 className="text-3xl font-bold mb-10 dark:text-white">{lang === 'ar' ? ex.titleAr : ex.title}</h2>
        <div className="bg-white/80 dark:bg-slate-900/80 rounded-full w-64 h-64 mx-auto flex items-center justify-center border-4 border-amber-500/20 relative mb-10 shadow-2xl">
           <span className="text-6xl font-bold font-mono dark:text-white">{warmupTimer}</span>
        </div>
        <div className="bg-amber-500/10 rounded-2xl p-6 mb-8"><p className="text-lg font-medium text-slate-800 dark:text-slate-200">{lang === 'ar' ? ex.instructionAr : ex.instruction}</p></div>
        <div className="flex justify-center gap-4">
           <Button variant="secondary" onClick={() => setSessionState(SessionState.MUSCLE_MENU)}>{t.exit}</Button>
           {warmupTimer === 0 && <Button variant="primary" onClick={() => { if(currentWarmupIndex < WARMUP_EXERCISES.length -1) { setCurrentWarmupIndex(p=>p+1); setWarmupTimer(WARMUP_EXERCISES[currentWarmupIndex+1].duration); } else setSessionState(SessionState.WARMUP_COMPLETED); }} className="!bg-amber-500">{t.nextEx}</Button>}
        </div>
      </div>
    );
  }

  if (sessionState === SessionState.WARMUP_COMPLETED) {
    return (
       <div className="flex flex-col items-center justify-center min-h-[50vh] animate-float-up text-center pt-10">
         <div className="bg-amber-500/20 p-6 rounded-full mb-6"><Check className="w-12 h-12 text-amber-500" /></div>
         <h2 className="text-3xl font-bold mb-4 dark:text-white">Warm-up Complete!</h2>
         <Button variant="primary" onClick={() => setSessionState(SessionState.MUSCLE_MENU)} className="!bg-amber-500">{t.backMenu}</Button>
       </div>
    );
  }

  if (sessionState === SessionState.GAME_ACTIVE) {
      return (
          <div className="max-w-3xl mx-auto w-full animate-float-up pt-10">
              <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-purple-500 flex items-center gap-2"><Puzzle className="w-6 h-6" /> {t.gameTitle}</h2>
                  <div className="flex gap-4 text-sm font-bold text-slate-500">
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
                              disabled={isFlipped || isMatched}
                              className={`
                                  aspect-[3/4] rounded-2xl text-lg font-bold transition-all duration-300 transform perspective-1000
                                  ${isFlipped 
                                      ? (isMatched ? 'bg-emerald-500 text-white rotate-y-180' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white rotate-y-180 border-2 border-purple-500') 
                                      : 'bg-purple-500/20 border-2 border-purple-500/30 hover:bg-purple-500/30 text-transparent'}
                              `}
                          >
                              {isFlipped ? card.text : '?'}
                          </button>
                      );
                  })}
              </div>
              <div className="mt-8 flex justify-center">
                  <Button variant="secondary" onClick={() => setSessionState(SessionState.MUSCLE_MENU)}>{t.exit}</Button>
              </div>
          </div>
      );
  }

  if (sessionState === SessionState.GAME_COMPLETED) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] animate-float-up text-center pt-10">
          <div className="bg-purple-500/20 p-6 rounded-full mb-6 relative">
              <Sparkles className="w-12 h-12 text-purple-500 absolute top-0 right-0 animate-ping" />
              <Puzzle className="w-12 h-12 text-purple-500" />
          </div>
          <h2 className="text-3xl font-bold mb-4 dark:text-white">{t.gameComplete}</h2>
          <p className="text-slate-500 mb-8">{t.moves}: {moves}</p>
          <Button variant="primary" onClick={() => setSessionState(SessionState.MUSCLE_MENU)} className="!bg-purple-500">{t.backMenu}</Button>
        </div>
      );
  }

  // Shadowing Logic
  const drill = SHADOWING_DRILLS[currentShadowingIndex];
  return (
      <div className="max-w-3xl mx-auto w-full animate-float-up pt-10">
         <div className="mb-8 flex items-center justify-between"><div className="flex items-center gap-2 text-amber-500"><Speaker className="w-5 h-5" /><span className="font-bold uppercase tracking-wider text-sm">{t.shadowingBtn}</span></div><Button variant="ghost" onClick={() => setSessionState(SessionState.MUSCLE_MENU)} className="!px-3 !py-1 h-8 text-xs">{t.exit}</Button></div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center text-center">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{t.visemeGuide}</span>
               <VisemeGuide focus={drill.visemeFocus} className="mb-6 scale-125" />
               <p className="text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl">{lang === 'ar' && drill.guideAr ? drill.guideAr : drill.guide}</p>
            </div>
            <div className="flex flex-col justify-center">
               <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-[2rem] p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-xl mb-6"><p className="text-2xl font-bold mb-4 dark:text-white" dir="ltr">"{drill.text}"</p><button onClick={() => onPlayTTS(drill.text)} disabled={isPlayingTTS} className="w-full py-3 rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white transition-all font-bold flex items-center justify-center gap-2"><Volume2 className={`w-5 h-5 ${isPlayingTTS ? 'animate-pulse' : ''}`} />{t.listenNative}</button></div>
            </div>
         </div>
         <div className="flex flex-col items-center gap-6">
          {sessionState === SessionState.SHADOWING_INTRO && <Button variant="primary" onClick={async () => { const s = await audioRecorder.startRecording(); if (s) setSessionState(SessionState.SHADOWING_RECORDING); }} icon={<Mic className="w-5 h-5" />} className="w-full md:w-auto min-w-[220px] h-12 text-lg !bg-amber-500">{t.startShadowing}</Button>}
          {sessionState === SessionState.SHADOWING_RECORDING && <Button variant="danger" onClick={() => { audioRecorder.stopRecording(); setSessionState(SessionState.SHADOWING_PROCESSING); }} icon={<Square className="w-5 h-5 fill-current" />} className="w-full md:w-auto min-w-[220px] h-12">{t.stop}</Button>}
          {sessionState === SessionState.SHADOWING_PROCESSING && !isAnalyzing && <div className="flex flex-col items-center w-full"><AudioPlayer audioUrl={audioRecorder.audioUrl} label="Record" visualizerLabel="" referenceLabel="" /><div className="flex gap-4"><Button variant="secondary" onClick={() => { audioRecorder.resetRecording(); setSessionState(SessionState.SHADOWING_INTRO); }} icon={<RotateCcw className="w-4 h-4" />}>{t.retry}</Button><Button variant="primary" onClick={handleAnalyzeShadowing} icon={<Zap className="w-4 h-4" />} className="!bg-amber-500">{t.analyze}</Button></div></div>}
          {isAnalyzing && <p className="text-amber-500 animate-pulse">Analyzing...</p>}
          {sessionState === SessionState.SHADOWING_FEEDBACK && (
            <div className="w-full animate-float-up">
               <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-8 mb-8"><div className="flex justify-between mb-4"><h3 className="flex items-center text-amber-500 font-bold"><CheckCircle2 className="w-5 h-5 mr-2" />{t.feedback}</h3><span className="text-2xl font-bold text-amber-500">{score}/100</span></div><div className="prose prose-invert prose-sm"><ReactMarkdown>{feedback}</ReactMarkdown></div></div>
               <div className="flex flex-col items-center w-full"><AudioPlayer audioUrl={audioRecorder.audioUrl} label="Result" visualizerScore={score} visualizerLabel="Score" referenceLabel="" /><div className="flex gap-4 mt-4"><Button variant="secondary" onClick={() => { audioRecorder.resetRecording(); setSessionState(SessionState.SHADOWING_INTRO); }}>{t.retry}</Button><Button variant="primary" onClick={() => { if(currentShadowingIndex < SHADOWING_DRILLS.length-1) { setCurrentShadowingIndex(p=>p+1); setSessionState(SessionState.SHADOWING_INTRO); } else setSessionState(SessionState.MUSCLE_MENU); }} className="!bg-amber-500">{t.nextRound}</Button></div></div>
            </div>
          )}
        </div>
      </div>
  );
};
