
import { useState, useRef, useCallback, useEffect } from 'react';
import { generateSpeech } from '../services/geminiService';

type VoiceGender = 'male' | 'female';

export const useGeminiTTS = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioCache = useRef<Map<string, AudioBuffer>>(new Map());

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
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
        sourceRef.current.disconnect();
      } catch (e) {
        // Ignore errors if already stopped
      }
      sourceRef.current = null;
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

  const play = useCallback(async (text: string, gender: VoiceGender, speed: number) => {
    if (!text) return;
    
    // IMMEDIATE STOP of any existing audio
    stop();

    setIsLoading(true);
    setIsPlaying(false); // Reset state momentarily
    setError(null);

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
      setError("Audio playback failed");
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }, [stop]);

  useEffect(() => {
    return () => {
      stop();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [stop]);

  return { play, stop, isPlaying, isLoading, error };
};
    