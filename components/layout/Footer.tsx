
import React from 'react';
import { Settings } from 'lucide-react';

interface FooterProps {
  text: string;
  settingsLabel: string;
  statusLabel: string;
  onOpenSettings: () => void;
}

export const Footer: React.FC<FooterProps> = ({ text, settingsLabel, statusLabel, onOpenSettings }) => {
  return (
    <footer className="hidden md:block w-full border-t border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl py-6 mt-auto">
      <div className="container mx-auto px-4 flex items-center justify-between text-xs text-slate-500 font-mono">
        <p>© {new Date().getFullYear()} {text}</p>
        <div className="flex items-center space-x-6 rtl:space-x-reverse">
          <button onClick={onOpenSettings} className="flex items-center gap-2 hover:text-emerald-500 cursor-pointer transition-colors">
            <Settings className="w-4 h-4" />
            {settingsLabel}
          </button>
          <span className="hover:text-emerald-500 cursor-pointer transition-colors">{statusLabel}</span>
        </div>
      </div>
    </footer>
  );
};
