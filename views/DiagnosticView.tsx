
import React, { useState } from 'react';
import { Stethoscope, Volume2, Mic, Square, RotateCcw, Zap, Dumbbell } from 'lucide-react';
import { Button } from '../components/Button';
import { AudioPlayer } from '../components/AudioPlayer';
import { DIAGNOSTIC_TEXT } from '../constants';
import { analyzeDiagnostic } from '../services/geminiService';
import { SessionState, DiagnosticResult } from '../types';
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
  onBack: () => void;
  onStartPlan: () => void;
}

export const DiagnosticView: React.FC<Props> = ({ 
  t, sessionState, setSessionState, audioRecorder, setShowReward, onPlayTTS, isPlayingTTS, lang, onBack, onStartPlan 
}) => {
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!audioRecorder.audioBlob) return;
    setSessionState(SessionState.DIAGNOSTIC_PROCESSING);
    setIsAnalyzing(true);
    try {
      const base64 = await audioRecorder.blobToBase64(audioRecorder.audioBlob);
      const res = await analyzeDiagnostic(base64, audioRecorder.audioBlob.type, lang);
      setResult(res);
      setSessionState(SessionState.DIAGNOSTIC_RESULT);
      setShowReward(true);
    } catch (e) { console.error(e); }
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-2xl mx-auto w-full animate-float-up pt-10">
      <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-500"><Stethoscope className="w-5 h-5" /><span className="font-bold uppercase tracking-wider text-sm">{t.artDiagnostic}</span></div>
          {sessionState === SessionState.DIAGNOSTIC_INTRO && <Button variant="ghost" onClick={onBack} className="!px-3 !py-1 h-8 text-xs">{t.backMenu}</Button>}
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-[2rem] p-8 md:p-10 border border-slate-200/50 dark:border-slate-700/50 shadow-xl mb-10">
        {sessionState !== SessionState.DIAGNOSTIC_RESULT ? (
          <>
             <p className="text-sm text-slate-400 font-bold mb-4 uppercase tracking-widest">{t.diagnosticPrompt}</p>
             <div className="prose prose-lg dark:prose-invert leading-relaxed font-serif text-slate-800 dark:text-slate-200" dir="ltr">"{DIAGNOSTIC_TEXT}"</div>
             <button onClick={() => onPlayTTS(DIAGNOSTIC_TEXT)} disabled={isPlayingTTS} className="mt-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white transition-all text-slate-400 disabled:opacity-50 inline-flex items-center gap-2 px-4 text-xs font-bold"><Volume2 className={`w-4 h-4 ${isPlayingTTS ? 'animate-pulse' : ''}`} />{t.listenNative}</button>
          </>
        ) : (
          <div className="animate-float-up">
             <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-slate-800 pb-4"><h3 className="text-xl font-bold">{t.diagnosticResult}</h3><span className={`text-3xl font-bold ${result?.score! > 80 ? 'text-emerald-500' : 'text-yellow-500'}`}>{result?.score}</span></div>
             <div className="mb-6"><h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-3">{t.weaknesses}</h4><div className="flex flex-wrap gap-2">{result?.weaknesses.map((w, i) => (<span key={i} className="px-3 py-1 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-full text-sm font-bold">{w}</span>))}</div></div>
             <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 mb-6"><h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2">{t.recPlan}</h4><p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{result?.plan}</p></div>
             <div className="prose prose-sm dark:prose-invert"><ReactMarkdown>{result?.feedback || ''}</ReactMarkdown></div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-6">
        {sessionState === SessionState.DIAGNOSTIC_INTRO && <Button variant="primary" onClick={async () => { const s = await audioRecorder.startRecording(); if (s) setSessionState(SessionState.DIAGNOSTIC_RECORDING); }} icon={<Mic className="w-5 h-5" />} className="w-full md:w-auto min-w-[220px] h-12 text-lg">{t.startBtn}</Button>}
        {sessionState === SessionState.DIAGNOSTIC_RECORDING && <Button variant="danger" onClick={() => { audioRecorder.stopRecording(); setSessionState(SessionState.DIAGNOSTIC_PROCESSING); }} icon={<Square className="w-5 h-5 fill-current" />} className="w-full md:w-auto min-w-[220px] h-12">{t.stop}</Button>}
        {sessionState === SessionState.DIAGNOSTIC_PROCESSING && !isAnalyzing && <div className="flex flex-col items-center w-full"><AudioPlayer audioUrl={audioRecorder.audioUrl} label="Recording" visualizerLabel="" referenceLabel="" /><div className="flex gap-4"><Button variant="secondary" onClick={() => { audioRecorder.resetRecording(); setSessionState(SessionState.DIAGNOSTIC_INTRO); }} icon={<RotateCcw className="w-4 h-4" />}>{t.retry}</Button><Button variant="primary" onClick={handleAnalyze} icon={<Zap className="w-4 h-4" />}>{t.analyze}</Button></div></div>}
        {isAnalyzing && <p className="text-emerald-500 animate-pulse">Running Diagnostics...</p>}
        {sessionState === SessionState.DIAGNOSTIC_RESULT && <div className="flex flex-col gap-4"><Button variant="primary" onClick={onStartPlan} icon={<Dumbbell className="w-4 h-4" />}>{t.startPlan}</Button><Button variant="ghost" onClick={onBack}>{t.backMenu}</Button></div>}
      </div>
    </div>
  );
};
