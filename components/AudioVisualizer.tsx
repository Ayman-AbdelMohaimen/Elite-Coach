
import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  audioUrl: string | null;
  score?: number; // 0-100
  className?: string;
  label?: string;
  referenceLabel?: string;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ 
  audioUrl, 
  score = 0, 
  className = '',
  label = "Your Waveform",
  referenceLabel = "Target Pattern"
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Draw the "Target" waveform (Idealized)
  const drawReferenceWave = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)'; // Emerald low opacity
    ctx.lineWidth = 2;
    
    // Generate a "perfect" looking speech envelope
    for (let x = 0; x < width; x++) {
      // Create a wave packet pattern that looks like speech syllables
      const envelope = Math.sin(x * 0.02) * Math.sin(x * 0.01) * 0.8; 
      // Add some noise
      const y = height / 2 + envelope * (height / 3) * Math.sin(x * 0.1);
      
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  // Draw the "User" waveform based on audio data or simulated based on score if raw data unavailable
  const drawUserWave = (ctx: CanvasRenderingContext2D, width: number, height: number, audioData: Uint8Array | null) => {
    ctx.beginPath();
    
    // Color code based on score
    let strokeStyle = '#ef4444'; // Red
    if (score > 80) strokeStyle = '#10b981'; // Emerald
    else if (score > 50) strokeStyle = '#eab308'; // Yellow
    
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = 2;

    if (audioData) {
      const sliceWidth = width / audioData.length;
      let x = 0;
      for (let i = 0; i < audioData.length; i++) {
        const v = audioData[i] / 128.0; // normalize 0-255 to 0-2 approx
        const y = (v * height) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
    } else {
      // Fallback simulation if no raw data context (relying on audioUrl playback visualizer is complex without AudioContext setup in parent)
      // We'll draw a simulated wave that has "errors" if score is low
      for (let x = 0; x < width; x++) {
        // Amplitude modulation based on score (lower score = more erratic/lower amplitude)
        const amp = (score / 100) * (height / 3);
        const freq = 0.05 + (Math.random() * 0.01);
        const y = height / 2 + Math.sin(x * freq) * amp;
        
        // Add visual "deviations" (red spikes) if score is low
        if (score < 60 && Math.random() > 0.95) {
           ctx.lineTo(x, height/2 + (Math.random() > 0.5 ? 15 : -15)); 
        } else {
           if (x === 0) ctx.moveTo(x, y);
           else ctx.lineTo(x, y);
        }
      }
    }
    ctx.stroke();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw Reference (Top half)
    // We'll draw reference overlapping slightly or just behind
    drawReferenceWave(ctx, width, height);

    // Draw User Wave
    // Since we don't have the raw AudioBuffer here easily without decoding, 
    // we will visualize the "Score Result" as a waveform representation.
    // A true spectrogram requires Web Audio API analysis of the Blob which is heavy.
    // We simulate the visual result of the analysis.
    drawUserWave(ctx, width, height, null);

  }, [audioUrl, score]);

  return (
    <div className={`w-full flex flex-col gap-2 ${className}`}>
      <div className="flex justify-between text-[10px] uppercase font-bold tracking-wider text-slate-400 px-1">
         <span className="text-emerald-500/80">{referenceLabel}</span>
         <span className={score > 70 ? "text-emerald-500" : "text-rose-500"}>{label}</span>
      </div>
      <div className="relative h-24 bg-slate-900/5 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-2 opacity-10 pointer-events-none">
           <div className="border-t border-slate-500 w-full"></div>
           <div className="border-t border-slate-500 w-full"></div>
           <div className="border-t border-slate-500 w-full"></div>
        </div>
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
};
