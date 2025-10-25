
import React from 'react';
import { WaterHabit } from '../../types';
import { CheckIcon } from '../icons/CheckIcon';
import { triggerHapticFeedback } from '../../haptics';
import { Theme } from '../../styles/theme';
import { playAppSound } from '../../services/notificationService';
import { AppSound } from '../../types';

interface HabitSelectorProps {
  onSelect: (habit: WaterHabit) => void;
  selectedHabit: WaterHabit | null;
  theme: Theme;
}

const habits = [
  { id: WaterHabit.Low, label: 'Nadiren Su İçerim' },
  { id: WaterHabit.Medium, label: 'Ara Sıra Hatırlamam Gerekir' },
  { id: WaterHabit.High, label: 'Düzenli Su İçerim' },
];

const HabitButton: React.FC<{ habit: typeof habits[0], isSelected: boolean, onClick: () => void, theme: Theme }> = ({ habit, isSelected, onClick, theme }) => (
  <button
    onClick={() => {
      onClick();
      triggerHapticFeedback();
      playAppSound(AppSound.Tap);
    }}
    className={`
      w-full p-5 text-left flex items-center justify-between
      rounded-2xl group
      transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]
      border
      ${isSelected 
        ? `bg-white/80 dark:bg-white/10 ${theme.selection.border} ${theme.selection.shadow}`
        : 'bg-white/50 dark:bg-white/5 border-white/0 dark:border-white/5 hover:border-white dark:hover:border-white/20'
      }
      transform active:scale-95
    `}
  >
    <span className="font-semibold text-zinc-900 dark:text-white">{habit.label}</span>
    {isSelected && <CheckIcon className={`w-6 h-6 ${theme.selection.icon}`} />}
  </button>
);

export const HabitSelector: React.FC<HabitSelectorProps> = ({ onSelect, selectedHabit, theme }) => {
  return (
    <div className="w-full text-center">
      <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">Son Bir Adım</h1>
      <p className="text-lg text-gray-800 dark:text-gray-300 mb-12">Mevcut su içme alışkanlığın nedir?</p>
      <div className="space-y-4">
        {habits.map((h) => (
          <HabitButton
            key={h.id}
            habit={h}
            isSelected={selectedHabit === h.id}
            onClick={() => onSelect(h.id)}
            theme={theme}
          />
        ))}
      </div>
    </div>
  );
};