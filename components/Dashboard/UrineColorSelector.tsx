import React from 'react';
import { UrineColor } from '../../types';
import { triggerHapticFeedback } from '../../haptics';
import { Theme } from '../../styles/theme';

interface UrineColorSelectorProps {
  onSelect: (color: UrineColor) => void;
  onClose: () => void;
  theme: Theme;
}

export const UrineColorSelector: React.FC<UrineColorSelectorProps> = ({ onSelect, onClose, theme }) => {
  const colorOptions = [
    { id: UrineColor.Optimal, label: 'Optimal', ...theme.urineColors.optimal },
    { id: UrineColor.Good, label: 'İyi', ...theme.urineColors.good },
    { id: UrineColor.Dehydrated, label: 'Dehidre', ...theme.urineColors.dehydrated },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-lg flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-3xl p-10 rounded-[2.5rem] w-11/12 max-w-md text-center shadow-2xl border border-white/20 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white mb-3">Hidrasyon Seviyesi</h2>
        <p className="text-zinc-600 dark:text-gray-300 mb-10">Vücudunun sinyallerini dinle. En yakın rengi seç.</p>
        
        <div className="space-y-5">
          {colorOptions.map(({ id, label, bg, ring }) => (
            <button
              key={id}
              onClick={() => {
                onSelect(id);
                triggerHapticFeedback(50);
              }}
              className={`
                w-full flex items-center p-5 rounded-2xl transition-all duration-200
                border border-transparent hover:bg-black/5 dark:hover:bg-white/5
                focus:outline-none focus:ring-2 ${ring}
              `}
            >
              <div className={`w-10 h-10 rounded-full ${bg} border border-black/10`}></div>
              <span className="ml-5 font-semibold text-lg text-zinc-800 dark:text-gray-100">{label}</span>
            </button>
          ))}
        </div>

        <button onClick={onClose} className="mt-10 text-sm font-medium text-zinc-500 dark:text-gray-400 hover:underline">
            İptal
        </button>
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};