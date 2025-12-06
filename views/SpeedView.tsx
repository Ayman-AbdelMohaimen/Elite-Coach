
import React, { useState } from 'react';
import { Zap, Mic, Square, RotateCcw, ChevronRight, CheckCircle2, Volume2 } from 'lucide-react';
import { Button } from '../components/Button';
import { AudioPlayer } from '../components/AudioPlayer';
import { SessionState, SpeedQuestion, UserPersona } from '../types';
import { analyzeSpeedDrill } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface Props {
  t: any;
  sessionState: SessionState;
  setSessionState: (s: SessionState) => void;
  audioRecorder: any;
  setShowReward: (b: boolean) => void;
  lang: 'en' | 'ar';
  onComplete: () => void;
  activeQuestions: SpeedQuestion[];
  selectedPersona: UserPersona | null;
  onUpdateStats: (xp: number) => void;
  onPlayTTS: (text: string) => void;
  isPlayingTTS?: boolean;
  onConsumeEnergy: (amount: number) => boolean;
}

export const SpeedView: React.FC<Props> = ({ t, sessionState, setSessionState, audioRecorder, setShowReward, lang, onComplete, activeQuestions, selectedPersona, onUpdateStats, onPlayTTS, isPlayingTTS, onConsumeEnergy }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleRecord = async () => {
     if (!onConsumeEnergy(5)) return;
     const s = await audioRecorder.startRecording();
     if (s) setSessionState(SessionState.SPEED_RECORDING);
  }

  const handleAnalyze = async () => {
    if (!audioRecorder.audioBlob) return;
    setSessionState(SessionState.SPEED_PROCESSING);
    setIsAnalyzing(true);
    try {
      const base64 = await audioRecorder.blobToBase64(audioRecorder.audioBlob);
      const q = activeQuestions[currentIndex];
      const res = await analyzeSpeedDrill(base64, q.question, audioRecorder.audioBlob.type, lang);
      setFeedback(res.feedback);
      setScore(res.score);
      setSessionState(SessionState.SPEED_FEEDBACK);
      onUpdateStats(15);
      setShowReward(true);
    } catch (e) { console.error(e); }
    setIsAnalyzing(false);
  };

  const question = activeQuestions[currentIndex];
  return (
    <div className="max-w-2xl mx-auto w-full animate-float-up pt-10">
         <div className="mb-8 flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider font-mono text-cyan-500 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.2)]">
            {t.phase2} | {currentIndex + 1} / {activeQuestions.length}
          </span>
          <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 flex items-center gap-1"><Zap className="w-3 h-3" /> Cost: 5</span>
        </div>
        
        {/* CYAN NEON HERO CARD */}
        <div className="relative bg-slate-900/90 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 border border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.15)] mb-10 overflow-hidden group">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] -mr-16 -mt-16 animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -ml-16 -mb-16 animate-pulse-slow delay-1000"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

          <div className="relative z-10">
            <h3 className="text-xs text-cyan-400 uppercase tracking-[0.2em] font-bold mb-6 flex items-center gap-2">
               <div className="p-1.5 bg-cyan-500 rounded text-slate-900"><Zap className="w-3 h-3 fill-current" /></div> 
               {t.rapidQ}
            </h3>
            
            <div className="flex flex-col gap-4 mb-8">
                <p className="text-2xl md:text-4xl font-bold text-white leading-snug drop-shadow-lg" dir="ltr">
                "{question.question}"
                </p>
                
                <button 
                    onClick={() => onPlayTTS(question.question)} 
                    disabled={isPlayingTTS}
                    className="self-start px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all font-bold flex items-center gap-2 text-sm border border-cyan-500/30 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                >
                    <Volume2 className={`w-4 h-4 ${isPlayingTTS ? 'animate-pulse' : ''}`} />
                    {t.listenNative}
                </button>
            </div>
            
            <div className="bg-cyan-950/50 rounded-2xl p-5 border border-cyan-500/20 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-3 text-cyan-400">
                  <div className="p-2 bg-cyan-500/10 rounded-lg"><Zap className="w-5 h-5" /></div>
                  <span className="font-bold font-mono tracking-tight text-lg shadow-cyan-500/50">{t.goalSpeed}</span>
                </div>
                <p className="text-xs text-cyan-200/70 font-medium max-w-[150px] text-right leading-tight">{t.speedInstruction}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          {sessionState === SessionState.SPEED_INTRO && (
            <Button variant="primary" onClick={handleRecord} icon={<Mic className="w-5 h-5" />} className="w-full md:w-auto min-w-[240px] h-14 text-lg !bg-cyan-500 hover:!bg-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.4)] border border-cyan-400/50">
              {t.recordAns}
            </Button>
          )}
          {sessionState === SessionState.SPEED_RECORDING && (
            <Button variant="danger" onClick={() => { audioRecorder.stopRecording(); setSessionState(SessionState.SPEED_PROCESSING); }} icon={<Square className="w-5 h-5 fill-current" />} className="w-full md:w-auto min-w-[240px] h-14 shadow-[0_0_30px_rgba(244,63,94,0.4)] animate-pulse">{t.stop}</Button>
          )}
          {sessionState === SessionState.SPEED_PROCESSING && !isAnalyzing && (
            <div className="flex flex-col items-center w-full">
              <AudioPlayer audioUrl={audioRecorder.audioUrl} label="Answer" visualizerLabel="" referenceLabel="" />
              <div className="flex gap-4 mt-4">
                <Button variant="secondary" onClick={() => { audioRecorder.resetRecording(); setSessionState(SessionState.SPEED_INTRO); }} icon={<RotateCcw className="w-4 h-4" />}>{t.retry}</Button>
                <Button variant="primary" onClick={handleAnalyze} icon={<Zap className="w-4 h-4" />} className="!bg-cyan-500 hover:!bg-cyan-400 shadow-lg">{t.analyzeSpeed}</Button>
              </div>
            </div>
          )}
          {isAnalyzing && <p className="text-cyan-500 animate-pulse font-bold flex items-center gap-2"><Zap className="w-4 h-4" /> Analyzing Reaction...</p>}
          {sessionState === SessionState.SPEED_FEEDBACK && (
            <div className="w-full animate-float-up">
               <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-3xl p-8 mb-8 relative overflow-hidden backdrop-blur-sm">
                 <div className="flex justify-between items-start mb-6 relative z-10">
                    <h3 className="flex items-center text-cyan-600 dark:text-cyan-400 font-bold">
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        {t.feedback}
                    </h3>
                    {/* Score Circle */}
                    <div className={`
                        flex items-center justify-center w-16 h-16 rounded-full border-4 font-bold text-2xl shadow-lg
                        ${score >= 80 ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10' : score >= 50 ? 'border-yellow-500 text-yellow-500 bg-yellow-500/10' : 'border-rose-500 text-rose-500 bg-rose-500/10'}
                    `}>
                        {score}
                    </div>
                 </div>
                 <div className="prose prose-sm prose-slate dark:prose-invert relative z-10 leading-relaxed"><ReactMarkdown>{feedback}</ReactMarkdown></div>
               </div>
               <div className="flex flex-col items-center w-full">
                 <AudioPlayer audioUrl={audioRecorder.audioUrl} label="Answer" visualizerScore={score} visualizerLabel="Score" referenceLabel="" />
                 <div className="flex gap-4 justify-center pb-8 mt-4">
                   <Button variant="secondary" onClick={() => { audioRecorder.resetRecording(); setSessionState(SessionState.SPEED_INTRO); }}>{t.retry}</Button>
                   <Button variant="primary" onClick={() => { if(currentIndex < activeQuestions.length-1) { setCurrentIndex(p=>p+1); setSessionState(SessionState.SPEED_INTRO); } else onComplete(); }} className="!bg-cyan-500 hover:!bg-cyan-400 shadow-lg">{currentIndex < activeQuestions.length - 1 ? t.nextRound : "Complete Phase"}</Button>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
  );
};
