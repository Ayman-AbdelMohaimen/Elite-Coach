
import React, { useState } from 'react';
import { FileText, Copy, Check, Mic, Square, RotateCcw, Zap, Activity } from 'lucide-react';
import { Button } from '../components/Button';
import { AudioPlayer } from '../components/AudioPlayer';
import { SessionState } from '../types';
import { transcribeAudio } from '../services/geminiService';

interface Props {
  t: any;
  sessionState: SessionState;
  setSessionState: (s: SessionState) => void;
  audioRecorder: any;
  setShowReward: (b: boolean) => void;
}

export const TranscriptionView: React.FC<Props> = ({ t, sessionState, setSessionState, audioRecorder, setShowReward }) => {
  const [transcription, setTranscription] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleTranscribe = async () => {
    if (!audioRecorder.audioBlob) return;
    setSessionState(SessionState.TRANSCRIPTION_PROCESSING);
    setIsAnalyzing(true);
    try {
      const base64 = await audioRecorder.blobToBase64(audioRecorder.audioBlob);
      const res = await transcribeAudio(base64, audioRecorder.audioBlob.type);
      setTranscription(res);
      setSessionState(SessionState.TRANSCRIPTION_RESULT);
      setShowReward(true);
    } catch (e) { console.error(e); }
    setIsAnalyzing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcription).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  return (
    <div className="max-w-2xl mx-auto w-full animate-float-up pt-10">
        <div className="mb-8 flex items-center justify-center"><div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 px-6 py-2 rounded-full flex items-center gap-3"><FileText className="w-4 h-4" /><span className="font-mono text-xs font-bold tracking-widest uppercase">{t.transcribeTitle}</span></div></div>
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-[2rem] p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl mb-10 min-h-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-6"><h3 className="text-xs text-slate-400 uppercase tracking-[0.2em] font-bold">{t.transcriptionResult}</h3>{transcription && <button onClick={handleCopy} className="px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors">{copySuccess ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}{copySuccess ? t.copied : t.copy}</button>}</div>
          <div className="flex-grow bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800/50 font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-300 overflow-y-auto shadow-inner" dir="auto">
            {isAnalyzing ? <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4"><Activity className="w-8 h-8 animate-spin text-indigo-500" /><span className="animate-pulse font-mono text-xs">{t.transcribing}</span></div> : transcription ? transcription : <div className="flex flex-col items-center justify-center h-full text-slate-400/50 italic gap-2"><Mic className="w-8 h-8 mb-2 opacity-50" />{t.transcribeDesc}</div>}
          </div>
        </div>

        <div className="flex flex-col items-center gap-6">
          {sessionState === SessionState.TRANSCRIPTION_INTRO && <Button variant="primary" onClick={async () => { const s = await audioRecorder.startRecording(); if (s) setSessionState(SessionState.TRANSCRIPTION_RECORDING); }} icon={<Mic className="w-5 h-5" />} className="w-full md:w-auto min-w-[220px] h-12 text-lg !bg-indigo-500">{t.startTranscribe}</Button>}
          {sessionState === SessionState.TRANSCRIPTION_RECORDING && <Button variant="danger" onClick={() => { audioRecorder.stopRecording(); setSessionState(SessionState.TRANSCRIPTION_PROCESSING); }} icon={<Square className="w-5 h-5 fill-current" />} className="w-full md:w-auto min-w-[220px] h-12">{t.stop}</Button>}
          {sessionState === SessionState.TRANSCRIPTION_PROCESSING && !isAnalyzing && <div className="flex flex-col items-center w-full"><AudioPlayer audioUrl={audioRecorder.audioUrl} label="Recording" visualizerLabel="" referenceLabel="" /><div className="flex gap-4"><Button variant="secondary" onClick={() => { audioRecorder.resetRecording(); setSessionState(SessionState.TRANSCRIPTION_INTRO); }} icon={<RotateCcw className="w-4 h-4" />}>{t.retry}</Button><Button variant="primary" onClick={handleTranscribe} icon={<Zap className="w-4 h-4" />} className="!bg-indigo-500">Transcribe</Button></div></div>}
          {sessionState === SessionState.TRANSCRIPTION_RESULT && <div className="flex flex-col items-center w-full"><AudioPlayer audioUrl={audioRecorder.audioUrl} label="Recording" visualizerLabel="" referenceLabel="" /><div className="flex gap-4 justify-center pb-8"><Button variant="secondary" onClick={() => { audioRecorder.resetRecording(); setSessionState(SessionState.TRANSCRIPTION_INTRO); }} icon={<RotateCcw className="w-4 h-4" />}>New Recording</Button></div></div>}
        </div>
      </div>
  );
};
