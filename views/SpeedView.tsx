
import React, { useState } from 'react';
import { Zap, Mic, Square, RotateCcw, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';
import { AudioPlayer } from '../components/AudioPlayer';
import { SessionState } from '../types';
import { SPEED_QUESTIONS } from '../constants';
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
}

export const SpeedView: React.FC<Props> = ({ t, sessionState, setSessionState, audioRecorder, setShowReward, lang, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!audioRecorder.audioBlob) return;
    setSessionState(SessionState.SPEED_PROCESSING);
    setIsAnalyzing(true);
    try {
      const base64 = await audioRecorder.blobToBase64(audioRecorder.audioBlob);
      const q = SPEED_QUESTIONS[currentIndex];
      const res = await analyzeSpeedDrill(base64, q.question, audioRecorder.audioBlob.type, lang);
      setFeedback(res);
      setSessionState(SessionState.SPEED_FEEDBACK);
      setShowReward(true);
    } catch (e) { console.error(e); }
    setIsAnalyzing(false);
  };

  const question = SPEED_QUESTIONS[currentIndex];
  return (
    <div className="max-w-2xl mx-auto w-full animate-float-up pt-10">
         <div className="mb-8 flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider font-mono text-cyan-500 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">{t.phase2} | {currentIndex + 1} / {SPEED_QUESTIONS.length}</span>
        </div>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-[2rem] p-8 md:p-10 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl mb-10 relative overflow-hidden">
          <h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] font-bold mb-4">{t.rapidQ}</h3>
          <p className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mb-8 leading-snug" dir="ltr">"{question.question}"</p>
          <div className="bg-slate-50/80 dark:bg-slate-950/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-800/50"><div className="flex items-center justify-between"><div className="flex items-center gap-3 text-yellow-500"><div className="p-2 bg-yellow-500/10 rounded-lg"><Zap className="w-5 h-5" /></div><span className="font-bold font-mono tracking-tight">{t.goalSpeed}</span></div><p className="text-xs text-slate-500 font-medium">{t.speedInstruction}</p></div></div>
        </div>

        <div className="flex flex-col items-center gap-6">
          {sessionState === SessionState.SPEED_INTRO && <Button variant="primary" onClick={async () => { const s = await audioRecorder.startRecording(); if (s) setSessionState(SessionState.SPEED_RECORDING); }} icon={<Mic className="w-5 h-5" />} className="w-full md:w-auto min-w-[220px] h-12 text-lg !bg-cyan-500">{t.recordAns}</Button>}
          {sessionState === SessionState.SPEED_RECORDING && <Button variant="danger" onClick={() => { audioRecorder.stopRecording(); setSessionState(SessionState.SPEED_PROCESSING); }} icon={<Square className="w-5 h-5 fill-current" />} className="w-full md:w-auto min-w-[220px] h-12">{t.stop}</Button>}
          {sessionState === SessionState.SPEED_PROCESSING && !isAnalyzing && <div className="flex flex-col items-center w-full"><AudioPlayer audioUrl={audioRecorder.audioUrl} label="Answer" visualizerLabel="" referenceLabel="" /><div className="flex gap-4"><Button variant="secondary" onClick={() => { audioRecorder.resetRecording(); setSessionState(SessionState.SPEED_INTRO); }} icon={<RotateCcw className="w-4 h-4" />}>{t.retry}</Button><Button variant="primary" onClick={handleAnalyze} icon={<Zap className="w-4 h-4" />} className="!bg-cyan-500">{t.analyzeSpeed}</Button></div></div>}
          {isAnalyzing && <p className="text-cyan-500 animate-pulse">Analyzing Speed...</p>}
          {sessionState === SessionState.SPEED_FEEDBACK && (
            <div className="w-full animate-float-up">
               <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-3xl p-8 mb-8"><h3 className="flex items-center text-cyan-500 font-bold mb-6"><CheckCircle2 className="w-5 h-5 mr-2" />{t.feedback}</h3><div className="prose prose-invert prose-sm"><ReactMarkdown>{feedback}</ReactMarkdown></div></div>
               <div className="flex flex-col items-center w-full"><AudioPlayer audioUrl={audioRecorder.audioUrl} label="Answer" visualizerLabel="" referenceLabel="" /><div className="flex gap-4 justify-center pb-8"><Button variant="secondary" onClick={() => { audioRecorder.resetRecording(); setSessionState(SessionState.SPEED_INTRO); }}>{t.retry}</Button><Button variant="primary" onClick={() => { if(currentIndex < SPEED_QUESTIONS.length-1) { setCurrentIndex(p=>p+1); setSessionState(SessionState.SPEED_INTRO); } else onComplete(); }} className="!bg-cyan-500">{currentIndex < SPEED_QUESTIONS.length - 1 ? t.nextRound : "Complete"}</Button></div></div>
            </div>
          )}
        </div>
      </div>
  );
};
