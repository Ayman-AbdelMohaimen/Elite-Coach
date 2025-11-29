
import { useState, useRef, useCallback, useEffect } from 'react';
import { generateSpeech } from '../services/geminiService';

type VoiceGender = 'male' | 'female';

export const useGeminiTTS = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use AudioContext for raw PCM playback support
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  // Cache decoded AudioBuffers: key = "text_voice"
  const audioCache = useRef<Map<string, AudioBuffer>>(new Map());

  // Initialize AudioContext lazily on user interaction
  const getAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass({
        sampleRate: 24000, // Hint for Gemini's default 24kHz output
      });
    }
    // Always ensure context is running (it starts suspended in some browsers)
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  /**
   * Decodes Base64 audio string to AudioBuffer.
   * Strategies:
   * 1. Try native decodeAudioData (works if data has MP3/WAV headers).
   * 2. Fallback to Raw PCM (Int16, 24kHz, Mono) if native decoding fails.
   */
  const decodeAudioData = async (base64: string, ctx: AudioContext): Promise<AudioBuffer> => {
    // 1. Convert Base64 to ArrayBuffer
    const binaryString = window.atob(base64.replace(/[\n\r\s]/g, ''));
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    const arrayBuffer = bytes.buffer;

    try {
      // 2. Try standard decoding (MP3/WAV container)
      // We clone the buffer because decodeAudioData detaches it
      const tempBuffer = arrayBuffer.slice(0);
      const decoded = await ctx.decodeAudioData(tempBuffer);
      return decoded;
    } catch (e) {
      console.warn("Native decode failed, attempting Raw PCM decode.", e);
      
      // 3. Fallback: Assume Raw PCM (16-bit signed, Little Endian, 24kHz, Mono)
      // This is the default format for many Gemini audio outputs if not configured otherwise.
      const pcm16 = new Int16Array(arrayBuffer);
      const numSamples = pcm16.length;
      const numChannels = 1;
      const sampleRate = 24000; // Gemini default
      
      const audioBuffer = ctx.createBuffer(numChannels, numSamples, sampleRate);
      const channelData = audioBuffer.getChannelData(0);
      
      for (let i = 0; i < numSamples; i++) {
        // Normalize Int16 (-32768 to 32767) to Float32 (-1.0 to 1.0)
        channelData[i] = pcm16[i] / 32768.0;
      }
      return audioBuffer;
    }
  };

  const play = useCallback(async (text: string, gender: VoiceGender, speed: number) => {
    if (!text) return;

    // Stop any currently playing audio
    stop();

    setIsLoading(true);
    setIsPlaying(false);
    setError(null);

    try {
      const ctx = getAudioContext();
      
      // Cache key relies on Text + Gender (Speed is applied during playback)
      const cacheKey = `${text}_${gender}`;
      let buffer = audioCache.current.get(cacheKey);

      if (!buffer) {
        const voiceName = gender === 'male' ? 'Fenrir' : 'Kore';
        const base64 = await generateSpeech(text, voiceName);
        buffer = await decodeAudioData(base64, ctx);
        audioCache.current.set(cacheKey, buffer);
      }

      // Create Source Node
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = speed; // Apply speed here
      
      // Handle playback end
      source.onended = () => {
        setIsPlaying(false);
        sourceRef.current = null;
      };

      source.connect(ctx.destination);
      source.start(0);
      sourceRef.current = source;
      setIsPlaying(true);

    } catch (err: any) {
      console.error("Gemini TTS Playback Error:", err);
      setError("Failed to play audio.");
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
        sourceRef.current.disconnect();
      } catch (e) {
        // Ignore errors if already stopped
      }
      sourceRef.current = null;
      setIsPlaying(false);
    }
  }, []);

  // Cleanup on unmount
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
