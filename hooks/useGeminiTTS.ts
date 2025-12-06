
import { useState, useRef, useCallback, useEffect } from 'react';
import { generateSpeech } from '../services/geminiService';

type VoiceGender = 'male' | 'female';
type TTSEngine = 'browser' | 'gemini';

export const useGeminiTTS = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Gemini / Web Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioCache = useRef<Map<string, AudioBuffer>>(new Map());

  // Browser Speech Synthesis Refs
  const synthesisRef = useRef<SpeechSynthesis | null>(typeof window !== 'undefined' ? window.speechSynthesis : null);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass({ sampleRate: 24000 });
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  const stop = useCallback(() => {
    // Stop Web Audio (Gemini)
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
        sourceRef.current.disconnect();
      } catch (e) { /* ignore */ }
      sourceRef.current = null;
    }

    // Stop Browser Synthesis
    if (synthesisRef.current && synthesisRef.current.speaking) {
      synthesisRef.current.cancel();
    }

    setIsPlaying(false);
  }, []);

  const decodeAudioData = async (base64: string, ctx: AudioContext): Promise<AudioBuffer> => {
    const binaryString = window.atob(base64.replace(/[\n\r\s]/g, ''));
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    const arrayBuffer = bytes.buffer;

    try {
      const tempBuffer = arrayBuffer.slice(0);
      return await ctx.decodeAudioData(tempBuffer);
    } catch (e) {
      const pcm16 = new Int16Array(arrayBuffer);
      const audioBuffer = ctx.createBuffer(1, pcm16.length, 24000);
      const channelData = audioBuffer.getChannelData(0);
      for (let i = 0; i < pcm16.length; i++) channelData[i] = pcm16[i] / 32768.0;
      return audioBuffer;
    }
  };

  const play = useCallback(async (text: string, gender: VoiceGender, speed: number, engine: TTSEngine = 'browser') => {
    if (!text) return;
    stop();

    setIsLoading(true);
    setIsPlaying(false);
    setError(null);

    // --- BROWSER ENGINE ---
    if (engine === 'browser') {
        if (!synthesisRef.current) {
            setError("Browser TTS not supported");
            setIsLoading(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = speed;
        
        // Voice Selection Logic
        let voices = synthesisRef.current.getVoices();
        
        // Retry getting voices if empty (Chrome quirk)
        if (voices.length === 0) {
            await new Promise(resolve => setTimeout(resolve, 100));
            voices = synthesisRef.current.getVoices();
        }

        let selectedVoice = null;
        
        if (gender === 'male') {
            // Try to find specific male voices or fall back to any voice with 'male' in name
            selectedVoice = voices.find(v => v.name.includes('David') || v.name.includes('Mark') || v.name.includes('Daniel')) 
                            || voices.find(v => v.name.toLowerCase().includes('male'));
        } else {
            // Try to find specific female voices or fall back to any voice with 'female' in name
            selectedVoice = voices.find(v => v.name.includes('Zira') || v.name.includes('Google US English')) 
                            || voices.find(v => v.name.toLowerCase().includes('female'));
        }

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.onend = () => {
            setIsPlaying(false);
            setIsLoading(false);
        };
        
        utterance.onerror = (event) => {
            // Ignore interruption errors which happen when stop() is called
            // Some browsers return 'interrupted' or 'canceled', we check for these.
            const errorMsg = event.error;
            if (errorMsg === 'canceled' || errorMsg === 'interrupted') {
                setIsPlaying(false);
                setIsLoading(false);
                return;
            }
            
            console.warn("Browser TTS Error Event:", event);
            // Fix [object Object] error by logging the specific string error message from the event
            // setError(`TTS Error: ${errorMsg}`); 
            setIsPlaying(false);
            setIsLoading(false);
        };

        // Browser needs explicit resume sometimes
        if (synthesisRef.current.paused) synthesisRef.current.resume();
        
        // Small delay to prevent cutting off
        setTimeout(() => {
            try {
                synthesisRef.current?.speak(utterance);
                setIsPlaying(true);
                setIsLoading(false);
            } catch (e) {
                console.error("Speak execution failed", e);
                setIsLoading(false);
            }
        }, 10);
        
        return;
    }

    // --- GEMINI ENGINE ---
    try {
      const ctx = getAudioContext();
      const cacheKey = `${text}_${gender}`;
      let buffer = audioCache.current.get(cacheKey);

      if (!buffer) {
        const voiceName = gender === 'male' ? 'Fenrir' : 'Kore';
        const base64 = await generateSpeech(text, voiceName);
        buffer = await decodeAudioData(base64, ctx);
        audioCache.current.set(cacheKey, buffer);
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = speed;
      
      source.onended = () => {
        setIsPlaying(false);
        sourceRef.current = null;
      };

      source.connect(ctx.destination);
      source.start(0);
      sourceRef.current = source;
      setIsPlaying(true);

    } catch (err: any) {
      console.error("Gemini TTS Error:", err);
      // Ensure error is a string
      const errMsg = typeof err === 'string' ? err : err.message || "Audio playback failed";
      setError(errMsg);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }, [stop]);

  useEffect(() => {
    // Initialize voices
    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        // Chrome loads voices asynchronously
        window.speechSynthesis.onvoiceschanged = () => {
             window.speechSynthesis.getVoices();
        };
    }
    return () => {
      stop();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [stop]);

  return { play, stop, isPlaying, isLoading, error };
};
