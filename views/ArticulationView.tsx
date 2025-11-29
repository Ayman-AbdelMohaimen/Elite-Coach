
import React, { useState } from 'react';
import { Activity, Stethoscope, LayoutGrid, Dumbbell, ChevronRight, RotateCcw, Zap, Mic, Square, CheckCircle2, ArrowLeft, Volume2 } from 'lucide-react';
import { Button } from '../components/Button';
import { AudioPlayer } from '../components/AudioPlayer';
import { VisemeGuide } from '../components/VisemeGuide';
import { DrillContent, SessionState, UserPersona } from '../types';
import { MINIMAL_PAIRS_DRILLS, PRONUNCIATION_DRILLS } from '../constants';
import { analyzeArticulationDrill } from '../services/geminiService';
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
  activeDrillList: DrillContent[];
  setActiveDrillList: (list: DrillContent[]) => void;
  trainingMode: 'FULL' | 'SINGLE';
  onBackMenu: () => void;
  onComplete: () => void;
  selectedPersona: UserPersona | null;
}

export const ArticulationView: React.FC<Props> = ({
  t, sessionState, setSessionState, audioRecorder, setShowReward, onPlayTTS, isPlayingTTS, lang,
  activeDrillList, setActiveDrillList, trainingMode, onBackMenu, onComplete, selectedPersona
}) => {
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [intonationScore, setIntonationScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  // --- Handlers ---
  const handleStartDrillSet = (drills: DrillContent[]) => {
    setActiveDrillList(drills);
    setCurrentDrillIndex(0);
    setSessionState(SessionState.DRILL_INTRO);
  };

  const handleNextDrill = () => {
    if (currentDrillIndex < activeDrillList.length - 1) {
      setCurrentDrillIndex(prev => prev + 1);
      setSessionState(SessionState.DRILL_INTRO);
      audioRecorder.resetRecording();
    } else {
      onComplete();
    }
  };

  const handleRecord = async () => {
    const started = await audioRecorder.startRecording();
    if (started) setSessionState(SessionState.DRILL_RECORDING);
    else setMicError(audioRecorder.error);
  };

  const handleAnalyze = async () => {
    if (!audioRecorder.audioBlob) return;
    setSessionState(SessionState.DRILL_PROCESSING);
    setIsAnalyzing(true);
    try {
      const base64 = await audioRecorder.blobToBase64(audioRecorder.audioBlob);
      const drill = activeDrillList[currentDrillIndex];
      const result = await analyzeArticulationDrill(base64, drill.text, drill.focus, audioRecorder.audioBlob.type, lang);
      setFeedback(result.feedback);
      setScore(result.score);
      setIntonationScore(result.intonationScore);
      setSessionState(SessionState.DRILL_FEEDBACK);
      setShowReward(true);
    } catch (e) { console.error(e); }
    setIsAnalyzing(false);
  };

  // --- Render Menu ---
  if (sessionState === SessionState.ARTICULATION_MENU) {
    return (
      <div className="flex flex-col items-center justify-center max-w-3xl mx-auto animate-float-up pt-10 w-full">
        <div className="mb-8 flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-xl"><Activity className="w-8 h-8 text-emerald-500" /></div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t.artMenuTitle}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <button onClick={() => setSessionState(SessionState.DIAGNOSTIC_INTRO)} className="col-span-1 md:col-span-3 flex items-center p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-lg hover:scale-[1.02] transition-all group text-left rtl:text-right">
             <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl mr-5 rtl:ml-5 shadow-md group-hover:bg-emerald-500 group-hover:text-white transition-colors"><Stethoscope className="w-8 h-8 text-emerald-500 group-hover:text-white" /></div>
             <div><h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t.artDiagnostic}</h3><p className="text-sm text-slate-500 dark:text-slate-400">{t.artDiagnosticDesc}</p></div>
             <ChevronRight className="w-6 h-6 text-slate-400 ml-auto rtl:mr-auto rtl:rotate-180" />
          </button>
          <button onClick={() => handleStartDrillSet(MINIMAL_PAIRS_DRILLS)} className="flex flex-col p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 hover:shadow-lg transition-all text-left rtl:text-right">
             <div className="p-3 bg-emerald-500/10 w-fit rounded-xl mb-4 text-emerald-500"><LayoutGrid className="w-6 h-6" /></div>
             <h3 className="text-lg font-bold dark:text-white mb-2">{t.artPairs}</h3><p className="text-xs text-slate-500">{t.artPairsDesc}</p>
          </button>
          <button onClick={() => handleStartDrillSet(PRONUNCIATION_DRILLS)} className="flex flex-col p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/30 hover:shadow-lg transition-all text-left rtl:text-right">
             <div className="p-3 bg-cyan-500/10 w-fit rounded-xl mb-4 text-cyan-500"><Dumbbell className="w-6 h-6" /></div>
             <h3 className="text-lg font-bold dark:text-white mb-2">{t.artDrills}</h3><p className="text-xs text-slate-500">{t.artDrillsDesc}</p>
          </button>
        </div>
      </div>
    );
  }

  // --- Render Drill ---
  const drill = activeDrillList[currentDrillIndex];
  return (
    <div className="max-w-3xl mx-auto w-full animate-float-up pt-10">
      <div className="mb-8 flex items-center justify-between">
         <div className="flex items-center gap-3">
           {trainingMode === 'SINGLE' && <button onClick={onBackMenu}><ArrowLeft className="w-5 h-5 text-slate-500 rtl:rotate-180" /></button>}
           <span className="text-xs font-bold font-mono text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full">{t.phase1} | {currentDrillIndex+1}/{activeDrillList.length}</span>
         </div>
      </div>
      
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-[2rem] p-8 border border-slate-200/50 dark:border-slate-700/50 shadow-2xl mb-10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1">
             <p className="text-3xl font-bold dark:text-white mb-8 leading-tight flex items-center gap-4" dir="ltr">
                "{drill.text}"
                <button onClick={() => onPlayTTS(drill.text)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-white transition-all text-slate-400"><Volume2 className={`w-6 h-6 ${isPlayingTTS ? 'animate-pulse' : ''}`} /></button>
             </p>
             <div className="bg-slate-50/80 dark:bg-slate-950/50 rounded-2xl p-5 border border-slate-200 dark:border-slate-800/50">
                <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-wider block mb-1.5">{t.mechFocus}</span>
                <p className="text-slate-600 dark:text-slate-300 text-sm font-medium">{lang === 'ar' && drill.focusAr ? drill.focusAr : drill.focus}</p>
             </div>
          </div>
          
          {/* Viseme Guide */}
          {drill.viseme && (
             <div className="flex-shrink-0 bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-lg flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{t.visemeGuide}</span>
                <VisemeGuide focus={drill.viseme} className="scale-110" />
             </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        {sessionState === SessionState.DRILL_INTRO && (
           <Button variant="primary" onClick={handleRecord} icon={<Mic className="w-5 h-5" />} className="w-full md:w-auto min-w-[220px] h-12 text-lg">{t.recordDrill}</Button>
        )}
        {sessionState === SessionState.DRILL_RECORDING && (
           <Button variant="danger" onClick={() => { audioRecorder.stopRecording(); setSessionState(SessionState.DRILL_PROCESSING); }} icon={<Square className="w-5 h-5 fill-current" />} className="w-full md:w-auto min-w-[220px] h-12">{t.stop}</Button>
        )}
        {sessionState === SessionState.DRILL_PROCESSING && !isAnalyzing && (
           <div className="flex flex-col items-center w-full">
             <AudioPlayer audioUrl={audioRecorder.audioUrl} label="Your Recording" visualizerLabel="" referenceLabel="" />
             <div className="flex gap-4"><Button variant="secondary" onClick={() => { audioRecorder.resetRecording(); setSessionState(SessionState.DRILL_INTRO); }} icon={<RotateCcw className="w-4 h-4" />}>{t.retry}</Button><Button variant="primary" onClick={handleAnalyze} icon={<Zap className="w-4 h-4" />}>{t.analyze}</Button></div>
           </div>
        )}
        {isAnalyzing && <p className="text-emerald-500 animate-pulse font-mono">AI Analyzing Mechanics...</p>}
        {sessionState === SessionState.DRILL_FEEDBACK && (
           <div className="w-full animate-float-up">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 mb-8">
                <div className="flex justify-between mb-4"><h3 className="flex items-center text-emerald-500 font-bold uppercase"><CheckCircle2 className="w-5 h-5 mr-2" />{t.feedback}</h3><span className="text-2xl font-bold text-emerald-500">{score}/100</span></div>
                <div className="prose prose-invert prose-sm"><ReactMarkdown>{feedback}</ReactMarkdown></div>
              </div>
              <div className="flex flex-col items-center gap-4">
                 <AudioPlayer audioUrl={audioRecorder.audioUrl} label="Result" visualizerScore={score} visualizerLabel={t.accuracyScore} referenceLabel={t.referenceWave} />
                 <div className="flex gap-4"><Button variant="secondary" onClick={() => { audioRecorder.resetRecording(); setSessionState(SessionState.DRILL_INTRO); }} icon={<RotateCcw className="w-4 h-4" />}>{t.retry}</Button><Button variant="primary" onClick={handleNextDrill} icon={<ChevronRight className="w-4 h-4 rtl:rotate-180" />}>{t.nextRound}</Button></div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};
