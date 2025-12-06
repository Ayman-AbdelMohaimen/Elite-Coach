
import React, { useState, useRef } from 'react';
import { BookOpen, Sparkles, UploadCloud, FileText, FileType, ImageIcon, Loader2, Download, RotateCcw, AlertCircle, Zap } from 'lucide-react';
import { Button } from '../components/Button';
import { SessionState } from '../types';
import { generateVisualSummary } from '../services/geminiService';

interface Props {
  t: any;
  sessionState: SessionState;
  setSessionState: (s: SessionState) => void;
  audioRecorder: any;
  setShowReward: (b: boolean) => void;
  lang: 'en' | 'ar';
  onUpdateStats: (xp: number) => void;
  onPlayTTS: (text: string) => void;
  onBack: () => void;
  onConsumeEnergy: (amount: number) => boolean;
}

export const StudyLabView: React.FC<Props> = ({ 
  t, sessionState, setSessionState, setShowReward, lang, onUpdateStats, onBack, onConsumeEnergy 
}) => {
  const [inputText, setInputText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [visualSummary, setVisualSummary] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [genericErrorMessage, setGenericErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  
  // --- FILE HANDLING ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file: File) => {
    setFileName(file.name);
    
    // Read text file
    if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
           setInputText(event.target.result as string);
        }
      };
      reader.readAsText(file);
    } 
    // Handle PDF (Placeholder for demo)
    else if (file.type === 'application/pdf') {
       setInputText(`[System] Loading PDF: ${file.name}...\n\n(Simulated Text Extraction for Demo): This is a placeholder for the PDF content. The AI will analyze this structure.`);
    } else {
       alert("Please upload a .txt or .pdf file");
       setFileName(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleVisualize = async () => {
    if (!inputText.trim()) return;
    if (!onConsumeEnergy(20)) return; // High cost

    setIsProcessing(true);
    setVisualSummary(null);
    setGenericErrorMessage('');
    setSessionState(SessionState.STUDY_LAB_ANALYSIS); // Move to result view immediately
    
    try {
      const base64Image = await generateVisualSummary(inputText, lang);
      if (base64Image) {
        setVisualSummary(base64Image);
        onUpdateStats(30); // Award XP
        setShowReward(true);
      } else {
          throw new Error("No image generated");
      }
    } catch (e: any) {
      // Robust Error Handling for both Error objects and API Error Responses
      let errorMessage = "Unknown error occurred";
      let errorDetails = e;

      if (e instanceof Error) {
        errorMessage = e.message;
        errorDetails = { name: e.name, message: e.message, stack: e.stack };
      } else {
        errorMessage = e.error?.message || e.message || JSON.stringify(e);
      }

      console.error("Visual Summary Error:", errorMessage, errorDetails);
      setGenericErrorMessage(errorMessage);
    }
    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (visualSummary) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${visualSummary}`;
      link.download = 'FluencyFlow_Infographic.png';
      link.click();
    }
  };

  // --- INPUT PHASE ---
  if (sessionState === SessionState.STUDY_LAB_INTRO) {
    return (
      <div className="max-w-2xl mx-auto w-full animate-float-up pt-10">
        <div className="mb-8 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
               <BookOpen className="w-6 h-6 text-indigo-500" />
             </div>
             <div>
               <h2 className="text-2xl font-bold dark:text-white">{t.studyTitle}</h2>
               <p className="text-xs text-slate-500">{t.studyDesc}</p>
             </div>
           </div>
           <Button variant="ghost" onClick={onBack} className="text-xs hover:bg-indigo-500/10 hover:text-indigo-500">{t.backMenu}</Button>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-2xl border border-indigo-500/20 relative overflow-hidden">
           {/* Background Glow */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
            
            <div className="flex justify-end mb-4">
                 <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 flex items-center gap-1"><Zap className="w-3 h-3" /> Cost: 20</span>
            </div>

           {/* FILE UPLOAD ZONE */}
           <div 
             className={`w-full h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center mb-6 cursor-pointer transition-all duration-300 relative z-10
                ${dragActive 
                  ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' 
                  : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10'}
             `}
             onDragEnter={handleDrag}
             onDragLeave={handleDrag}
             onDragOver={handleDrag}
             onDrop={handleDrop}
             onClick={() => fileInputRef.current?.click()}
           >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".txt,.pdf"
                onChange={handleFileUpload}
              />
              
              {fileName ? (
                <div className="flex flex-col items-center gap-2 animate-float-up">
                    <div className="p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-full text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-lg">
                      {fileName.endsWith('.pdf') ? <FileType className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-200">{fileName}</span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setFileName(null); setInputText(''); }} 
                      className="text-xs text-rose-500 hover:text-rose-600 font-bold mt-1 bg-rose-500/10 px-2 py-1 rounded-full"
                    >
                      Remove File
                    </button>
                </div>
              ) : (
                <>
                    <UploadCloud className={`w-10 h-10 mb-3 ${dragActive ? 'text-indigo-600 animate-bounce' : 'text-slate-400'}`} />
                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                      {dragActive ? "Drop file here" : "Click to upload PDF or TXT"}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">or drag and drop here</p>
                </>
              )}
           </div>

           <div className="relative z-10">
              <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 block flex items-center gap-2">
                <FileText className="w-3 h-3" /> Or paste text manually
              </label>
              <textarea
                className="w-full h-32 bg-slate-50 dark:bg-slate-950 rounded-xl p-4 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none font-mono text-sm leading-relaxed dark:text-slate-300 transition-all"
                placeholder={t.pasteText}
                value={inputText}
                onChange={(e) => { setInputText(e.target.value); if(fileName && !e.target.value) setFileName(null); }}
              ></textarea>
           </div>

           <div className="mt-6 flex justify-end">
             <Button 
               variant="primary" 
               onClick={handleVisualize} 
               isLoading={isProcessing} 
               className="!bg-indigo-600 hover:!bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] w-full md:w-auto" 
               icon={<Sparkles className="w-4 h-4" />}
             >
               {lang === 'ar' ? "حول إلى إنفوجرافيك" : "Visualize Context"}
             </Button>
           </div>
        </div>
      </div>
    );
  }

  // --- RESULT PHASE (INFOGRAPHIC ONLY) ---
  if (sessionState === SessionState.STUDY_LAB_ANALYSIS || sessionState === SessionState.STUDY_LAB_PRACTICE) {
    return (
      <div className="max-w-2xl mx-auto w-full animate-float-up pt-10">
         <div className="mb-6 flex items-center justify-between">
             <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
               <ImageIcon className="w-5 h-5 text-indigo-500" /> {lang === 'ar' ? "الملخص البصري" : "Visual Summary"}
             </h2>
             <Button variant="ghost" onClick={() => { setSessionState(SessionState.STUDY_LAB_INTRO); setVisualSummary(null); }} className="hover:text-indigo-500">
               <RotateCcw className="w-4 h-4 mr-2" /> {t.retry}
             </Button>
         </div>
         
         {/* Visual Summary Poster */}
         <div className="bg-slate-900 rounded-[2rem] p-2 border border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.2)] relative min-h-[500px] flex items-center justify-center overflow-hidden">
            {isProcessing ? (
               <div className="flex flex-col items-center justify-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-xl animate-pulse"></div>
                    <Loader2 className="w-16 h-16 text-indigo-500 animate-spin relative z-10" />
                  </div>
                  <span className="text-indigo-400 font-mono text-sm animate-pulse tracking-widest uppercase">Creating Infographic...</span>
                  <p className="text-xs text-slate-500 mt-2 text-center max-w-xs">AI is visualizing your text context...</p>
               </div>
            ) : visualSummary ? (
               <div className="relative group w-full h-full">
                  <img 
                    src={`data:image/png;base64,${visualSummary}`} 
                    alt="Visual Summary" 
                    className="w-full h-auto rounded-3xl object-contain shadow-2xl" 
                  />
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button onClick={handleDownload} variant="primary" className="!bg-white text-slate-900 hover:!bg-slate-200 shadow-xl" icon={<Download className="w-4 h-4" />}>
                      Download Poster
                    </Button>
                  </div>
               </div>
            ) : (
               <div className="font-bold flex flex-col items-center text-center p-6 max-w-md">
                  <div className="p-4 bg-rose-500/10 rounded-full mb-4 border border-rose-500/30"><AlertCircle className="w-10 h-10 text-rose-500" /></div>
                  <span className="text-white text-lg mb-2">Generation Failed</span>
                  <p className="text-sm text-slate-400 mb-6">
                      {genericErrorMessage || "We couldn't generate the infographic at this time."}
                  </p>
                  <Button variant="secondary" onClick={handleVisualize}>Try Again</Button>
               </div>
            )}
         </div>
      </div>
    );
  }

  return null;
};
