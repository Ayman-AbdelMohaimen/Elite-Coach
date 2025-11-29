
import React from 'react';

interface VisemeGuideProps {
  focus: 'th' | 'r' | 'f' | 'l' | 'm' | 's';
  className?: string;
}

export const VisemeGuide: React.FC<VisemeGuideProps> = ({ focus, className = '' }) => {
  // Helper to render paths based on focus
  const renderMouthPath = () => {
    switch (focus) {
      case 'th':
        return (
          <>
             {/* Tongue sticking out */}
             <path d="M140 180 Q 180 180 220 190 Q 230 195 220 200 Q 180 210 140 210" fill="#F87171" stroke="#991B1B" strokeWidth="2" />
             {/* Upper Teeth */}
             <path d="M140 140 L 140 185 L 160 185 L 160 140" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
             {/* Lower Teeth */}
             <path d="M140 260 L 140 215 L 160 215 L 160 260" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
          </>
        );
      case 'r':
        return (
           <>
             {/* Tongue Curled Back */}
             <path d="M140 230 Q 180 230 190 200 Q 180 170 150 170" fill="none" stroke="#F87171" strokeWidth="12" strokeLinecap="round" />
             {/* Upper Teeth */}
             <path d="M140 140 L 140 180 L 160 180 L 160 140" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
             {/* Lower Teeth */}
             <path d="M140 260 L 140 220 L 160 220 L 160 260" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
          </>
        );
      case 'f':
        return (
          <>
             {/* Lower Lip Tucked */}
             <path d="M140 240 Q 160 220 180 220" fill="none" stroke="#F87171" strokeWidth="10" />
             {/* Upper Teeth Biting Lip */}
             <path d="M140 140 L 140 225 L 160 225 L 160 140" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
          </>
        );
      case 'l':
        return (
          <>
             {/* Tongue Tip Touching Ridge */}
             <path d="M140 230 Q 180 230 180 185" fill="none" stroke="#F87171" strokeWidth="10" strokeLinecap="round" />
             {/* Upper Teeth */}
             <path d="M140 140 L 140 180 L 160 180 L 160 140" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
          </>
        );
      default:
        return (
           <>
            {/* Neutral Tongue */}
            <path d="M140 240 Q 180 240 200 240" fill="none" stroke="#F87171" strokeWidth="10" strokeLinecap="round" />
             {/* Upper Teeth */}
             <path d="M140 140 L 140 180 L 160 180 L 160 140" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
             {/* Lower Teeth */}
             <path d="M140 260 L 140 220 L 160 220 L 160 260" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
           </>
        );
    }
  };

  return (
    <div className={`relative w-40 h-40 bg-slate-100 dark:bg-slate-800 rounded-full border-4 border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden ${className}`}>
      <svg viewBox="0 0 300 300" className="w-full h-full">
        {/* Head Profile Outline */}
        <path d="M100 50 Q 200 50 250 150 Q 250 250 180 290 L 100 290" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-300 dark:text-slate-600" />
        {/* Nose */}
        <path d="M250 150 Q 280 170 260 190" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-300 dark:text-slate-600" />
        
        {/* Dynamic Articulators */}
        {renderMouthPath()}
      </svg>
      
      <div className="absolute bottom-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
        Side View
      </div>
    </div>
  );
};
