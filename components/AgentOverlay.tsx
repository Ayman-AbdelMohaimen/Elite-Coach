
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Mic, Send, Minimize2, Maximize2, Sparkles, Volume2 } from 'lucide-react';
import { useGeminiTTS } from '../hooks/useGeminiTTS';
import { chatWithAgent } from '../services/geminiService';
import { UserPersona, ChatMessage } from '../types';
import { PERSONAS } from '../constants';

interface AgentOverlayProps {
  selectedPersona: UserPersona | null;
  audioRecorder: any;
  lang: 'en' | 'ar';
}

export const AgentOverlay: React.FC<AgentOverlayProps> = ({ selectedPersona, audioRecorder, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { play: playTTS } = useGeminiTTS();

  const personaConfig = PERSONAS.find(p => p.id === selectedPersona) || PERSONAS[0];
  const avatarUrl = `https://api.dicebear.com/9.x/${personaConfig.avatar.style}/svg?seed=${personaConfig.avatar.seed}`;

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Initial Greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
       const greeting = lang === 'ar' 
         ? `مرحباً! أنا مدربك الشخصي. كيف كان يومك في العمل اليوم؟` 
         : `Hello! I'm your elite coach. How was your day? Any speaking challenges?`;
       
       setMessages([{
         id: 'init',
         sender: 'ai',
         text: greeting,
         type: 'text',
         timestamp: Date.now()
       }]);
       playTTS(greeting, 'female', 1.0, 'gemini');
    }
  }, [isOpen, lang]);

  const handleSendAudio = async () => {
    if (!audioRecorder.audioBlob) return;
    
    const userAudioUrl = URL.createObjectURL(audioRecorder.audioBlob);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'user',
      audioUrl: userAudioUrl,
      type: 'audio',
      timestamp: Date.now()
    }]);

    setIsProcessing(true);
    
    try {
      const base64 = await audioRecorder.blobToBase64(audioRecorder.audioBlob);
      const response = await chatWithAgent(base64, selectedPersona || 'business', lang);
      
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '_ai',
        sender: 'ai',
        text: response.replyText, // Contains the empathetic reply + correction
        type: 'text',
        timestamp: Date.now()
      }]);
      
      if (response.replyText) {
         playTTS(response.replyText, 'female', 1.0, 'gemini');
      }

    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, { id: 'err', sender: 'ai', text: "Connection error. Please try again.", type: 'text', timestamp: Date.now() }]);
    }
    
    setIsProcessing(false);
    audioRecorder.resetRecording();
  };

  const toggleRecord = async () => {
     if (audioRecorder.isRecording) {
        audioRecorder.stopRecording();
        // Wait slightly for blob availability then send
        setTimeout(handleSendAudio, 500);
     } else {
        await audioRecorder.startRecording();
     }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 md:bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-slate-900 border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center group transition-transform hover:scale-110"
      >
        <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping opacity-75"></div>
        <img src={avatarUrl} alt="Agent" className="w-12 h-12 rounded-full relative z-10" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900"></div>
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 md:bottom-6 right-6 z-50 w-full max-w-sm h-[500px] bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-float-up">
       {/* Header */}
       <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
             <div className="relative w-10 h-10 rounded-full bg-slate-800 border border-emerald-500/50 overflow-hidden">
                <img src={avatarUrl} alt="Agent" className="w-full h-full object-cover" />
             </div>
             <div>
                <h3 className="text-sm font-bold text-white">Fluency Therapist</h3>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online</span>
             </div>
          </div>
          <div className="flex gap-2">
             <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-800 rounded text-slate-400"><Minimize2 className="w-4 h-4" /></button>
          </div>
       </div>

       {/* Messages */}
       <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`
                   max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed
                   ${msg.sender === 'user' 
                     ? 'bg-emerald-600 text-white rounded-br-none' 
                     : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none'}
                `}>
                   {msg.type === 'audio' ? (
                      <div className="flex items-center gap-2">
                         <Volume2 className="w-4 h-4" /> <span>Audio Message</span>
                      </div>
                   ) : (
                      <p>{msg.text}</p>
                   )}
                </div>
             </div>
          ))}
          {isProcessing && (
             <div className="flex justify-start">
                 <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-slate-700 flex gap-1">
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></span>
                 </div>
             </div>
          )}
          <div ref={messagesEndRef} />
       </div>

       {/* Input */}
       <div className="p-4 border-t border-slate-700 bg-slate-950/30">
          <div className="flex items-center gap-2">
             <button 
               onClick={toggleRecord}
               className={`flex-grow h-12 rounded-xl flex items-center justify-center gap-2 font-bold transition-all
                  ${audioRecorder.isRecording 
                     ? 'bg-red-500/20 text-red-500 border border-red-500/50 animate-pulse' 
                     : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}
               `}
             >
                {audioRecorder.isRecording ? <div className="w-3 h-3 bg-red-500 rounded sm:hidden"></div> : <Mic className="w-5 h-5" />}
                {audioRecorder.isRecording ? "Listening..." : "Hold to Speak"}
             </button>
          </div>
       </div>
    </div>
  );
};
