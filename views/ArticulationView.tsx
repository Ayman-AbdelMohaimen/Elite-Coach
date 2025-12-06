
import React, { useState, useEffect } from 'react';
import { Activity, Stethoscope, LayoutGrid, Dumbbell, ChevronRight, RotateCcw, Zap, Mic, Square, CheckCircle2, ArrowLeft, Volume2, Eye } from 'lucide-react';
import { Button } from '../components/Button';
import { AudioPlayer } from '../components/AudioPlayer';
import { VisemeGuide } from '../components/VisemeGuide';
import { DrillContent, SessionState, UserPersona, VisemeType } from '../types';
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
  onUpdateStats: (xp: number) => void;
  onConsumeEnergy: (amount: number) => boolean;
}

export const ArticulationView: React.FC<Props> = ({
  t, sessionState, setSessionState, audioRecorder, setShowReward, onPlayTTS, isPlayingTTS, lang,
  activeDrillList, setActiveDrillList, trainingMode, onBackMenu, onComplete, selectedPersona, onUpdateStats, onConsumeEnergy
}) => {
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [intonationScore, setIntonationScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [selectedCatalogViseme, setSelectedCatalogViseme] = useState<VisemeType | null>(null);

  const ALL_VISEMES: VisemeType[] = ['th', 'r', 'l', 'f', 's', 'p', 'w'];

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
    if (!onConsumeEnergy(10)) return; // Energy Cost Check

    const started = await audioRecorder.startRecording();
    if (started) {
        setSessionState(SessionState.DRILL_RECORDING);
    }
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
      onUpdateStats(10); 
      setShowReward(true);
    } catch (e) { console.error(e); }
    setIsAnalyzing(false);
  };


  // --- Render Menu ---
  if (sessionState === SessionState.ARTICULATION_MENU) {
    return (
      <div className="flex flex-col items-center justify-center max-w-3xl mx-auto animate-float-up pt-10 w-full">
        <div className="mb-8 flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Activity className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{t.artMenuTitle}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <button onClick={() => setSessionState(SessionState.DIAGNOSTIC_INTRO)} className="col-span-1 md:col-span-2 flex items-center p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 to-emerald-900/10 border border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:scale-[1.02] transition-all group text-left rtl:text-right">
             <div className="p-4 bg-white dark:bg-emerald-950 rounded-2xl mr-5 rtl:ml-5 shadow-md group-hover:bg-emerald-500 group-hover:text-white transition-colors border border-emerald-500/20"><Stethoscope className="w-8 h-8 text-emerald-500 group-hover:text-white" /></div>
             <div><h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-emerald-500 transition-colors">{t.artDiagnostic}</h3><p className="text-sm text-slate-500 dark:text-slate-400">{t.artDiagnosticDesc}</p></div>
             <ChevronRight className="w-6 h-6 text-emerald-500/50 ml-auto rtl:mr-auto rtl:rotate-180 group-hover:text-emerald-500" />
          </button>
          
          <button onClick={() => handleStartDrillSet(MINIMAL_PAIRS_DRILLS)} className="flex flex-col p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-lg transition-all text-left rtl:text-right group backdrop-blur-sm">
             <div className="p-3 bg-emerald-500/10 w-fit rounded-xl mb-4 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors"><LayoutGrid className="w-6 h-6" /></div>
             <h3 className="text-lg font-bold dark:text-white mb-2 group-hover:text-emerald-400">{t.artPairs}</h3><p className="text-xs text-slate-500">{t.artPairsDesc}</p>
          </button>
          
          <button onClick={() => handleStartDrillSet(PRONUNCIATION_DRILLS)} className="flex flex-col p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-emerald-500/20 hover:border-emerald-500/50 hover:shadow-lg transition-all text-left rtl:text-right group backdrop-blur-sm">
             <div className="p-3 bg-emerald-500/10 w-fit rounded-xl mb-4 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors"><Dumbbell className="w-6 h-6" /></div>
             <h3 className="text-lg font-bold dark:text-white mb-2 group-hover:text-emerald-400">{t.artDrills}</h3><p className="text-xs text-slate-500">{t.artDrillsDesc}</p>
          </button>
        </div>
      </div>
    );
  }

  // --- Render Standard Drill ---
  const drill = activeDrillList[currentDrillIndex];
  const drillTitle = lang === 'ar' && drill.titleAr ? drill.titleAr : drill.title;

  return (
    <div className="max-w-3xl mx-auto w-full animate-float-up pt-10">
      <div className="mb-4 flex items-center justify-between">
         <div className="flex items-center gap-3">
           {trainingMode === 'SINGLE' && <button onClick={onBackMenu}><ArrowLeft className="w-5 h-5 text-emerald-500 rtl:rotate-180" /></button>}
           <span className="text-xs font-bold font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">{t.phase1} | {currentDrillIndex+1}/{activeDrillList.length}</span>
         </div>
         <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 flex items-center gap-1"><Zap className="w-3 h-3" /> Cost: 10</span>
      </div>

      {/* --- VISUAL MECHANICS CATALOG (SLIDER) --- */}
      <div className="mb-8 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-emerald-500/10 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-4 h-4 text-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Visual Mechanics Catalog</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {ALL_VISEMES.map(v => (
             <button 
               key={v}
               onClick={() => setSelectedCatalogViseme(selectedCatalogViseme === v ? null : v)}
               className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold uppercase transition-all ${selectedCatalogViseme === v ? 'bg-emerald-500 text-white shadow-lg scale-110' : drill.viseme === v ? 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/50' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-slate-700'}`}
             >{v}</button>
          ))}
        </div>
        {selectedCatalogViseme && (
           <div className="mt-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-emerald-500/20 animate-float-up flex items-center gap-6 shadow-xl">
               <VisemeGuide focus={selectedCatalogViseme} className="flex-shrink-0 w-24 h-24 border-emerald-500/30" />
               <div>
                  <h4 className="font-bold text-lg text-emerald-500 uppercase mb-1">Sound: /{selectedCatalogViseme.toUpperCase()}/</h4>
                  <p className="text-xs text-slate-500">Anatomical guide for tongue and lip placement.</p>
                  <button onClick={() => setSelectedCatalogViseme(null)} className="text-xs text-emerald-500 underline mt-2">Close</button>
               </div>
           </div>
        )}
      </div>
      
      {/* MAIN NEON HERO CARD */}
      <div className="relative bg-slate-900/90 rounded-[2.5rem] p-8 md:p-10 border border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.2)] mb-10 overflow-hidden group">
        {/* Breathing Glow Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] -mr-16 -mt-16 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px] -ml-16 -mb-16 animate-pulse-slow delay-1000"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>

        <div className="flex flex-col gap-6 items-center md:items-start relative z-10">
          <div className="w-full">
             {drillTitle && (
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">{drillTitle}</span>
                </div>
             )}

             <p className="text-3xl md:text-4xl font-bold text-white mb-8 leading-tight flex flex-col md:flex-row md:items-center gap-4 text-center md:text-left drop-shadow-lg" dir="ltr">
                <span>"{drill.text}"</span>
                <button onClick={() => onPlayTTS(drill.text)} className="self-center md:self-auto p-3 rounded-full bg-emerald-500/20 hover:bg-emerald-500 text-emerald-400 hover:text-white transition-all border border-emerald-500/30 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                   <Volume2 className={`w-6 h-6 ${isPlayingTTS ? 'animate-pulse' : ''}`} />
                </button>
             </p>

             <div className="bg-emerald-950/50 rounded-2xl p-5 border border-emerald-500/20 backdrop-blur-md">
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1"><Zap className="w-3 h-3" /> {t.mechFocus}</span>
                <p className="text-emerald-100 text-sm font-medium leading-relaxed">{lang === 'ar' && drill.focusAr ? drill.focusAr : drill.focus}</p>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        {sessionState === SessionState.DRILL_INTRO && (
           <Button variant="primary" onClick={handleRecord} icon={<Mic className="w-5 h-5" />} className="w-full md:w-auto min-w-[240px] h-14 text-lg !bg-emerald-500 hover:!bg-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)] border border-emerald-400/50">{t.recordDrill}</Button>
        )}
        {sessionState === SessionState.DRILL_RECORDING && (
           <Button variant="danger" onClick={() => { audioRecorder.stopRecording(); setSessionState(SessionState.DRILL_PROCESSING); }} icon={<Square className="w-5 h-5 fill-current" />} className="w-full md:w-auto min-w-[240px] h-14 shadow-[0_0_30px_rgba(244,63,94,0.4)] animate-pulse">{t.stop}</Button>
        )}
        {sessionState === SessionState.DRILL_PROCESSING && !isAnalyzing && (
           <div className="flex flex-col items-center w-full">
             <AudioPlayer audioUrl={audioRecorder.audioUrl} label="Your Recording" visualizerLabel="" referenceLabel="" />
             <div className="flex gap-4 mt-4"><Button variant="secondary" onClick={() => { audioRecorder.resetRecording(); setSessionState(SessionState.DRILL_INTRO); }} icon={<RotateCcw className="w-4 h-4" />}>{t.retry}</Button><Button variant="primary" onClick={handleAnalyze} icon={<Zap className="w-4 h-4" />} className="!bg-emerald-500 hover:!bg-emerald-400 shadow-lg">{t.analyze}</Button></div>
           </div>
        )}
        {isAnalyzing && <p className="text-emerald-500 animate-pulse font-mono flex items-center gap-2"><Zap className="w-4 h-4" /> AI Analyzing Mechanics...</p>}
        {sessionState === SessionState.DRILL_FEEDBACK && (
           <div className="w-full animate-float-up">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-8 mb-8 relative overflow-hidden backdrop-blur-sm">
                <div className="flex justify-between mb-4 relative z-10"><h3 className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold uppercase"><CheckCircle2 className="w-5 h-5 mr-2" />{t.feedback}</h3><span className="text-3xl font-bold text-emerald-500">{score}</span></div>
                <div className="prose prose-sm prose-slate dark:prose-invert relative z-10"><ReactMarkdown>{feedback}</ReactMarkdown></div>
              </div>
              <div className="flex flex-col items-center gap-4">
                 <AudioPlayer audioUrl={audioRecorder.audioUrl} label="Result" visualizerScore={score} visualizerLabel={t.accuracyScore} referenceLabel={t.referenceWave} />
                 <div className="flex gap-4 mt-4"><Button variant="secondary" onClick={() => { audioRecorder.resetRecording(); setSessionState(SessionState.DRILL_INTRO); }} icon={<RotateCcw className="w-4 h-4" />}>{t.retry}</Button><Button variant="primary" onClick={handleNextDrill} icon={<ChevronRight className="w-4 h-4 rtl:rotate-180" />} className="!bg-emerald-500 shadow-lg">{t.nextRound}</Button></div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};
