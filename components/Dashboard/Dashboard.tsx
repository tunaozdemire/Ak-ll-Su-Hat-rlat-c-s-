import React, { useState, useMemo, useEffect } from 'react';
import { UserProfile, UrineColor } from '../../types';
import { DynamicWaterDrop } from './DynamicWaterDrop';
import { UrineColorSelector } from './UrineColorSelector';
import { triggerHapticFeedback } from '../../haptics';
import { SettingsIcon } from '../icons/SettingsIcon';
import { calculateDailyGoal } from '../../utils/hydration';
import { getTheme } from '../../styles/theme';


interface DashboardProps {
  profile: UserProfile;
  onProfileChange: (newProfile: UserProfile) => void;
  onOpenSettings: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ profile, onProfileChange, onOpenSettings }) => {
  const [isUrineModalOpen, setUrineModalOpen] = useState(false);
  
  useEffect(() => {
    // Request notification permission when dashboard is first shown, if not already decided.
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const dailyGoal = useMemo(() => {
    return calculateDailyGoal(profile);
  }, [profile]);
  
  const theme = useMemo(() => getTheme(profile.category), [profile.category]);

  const [currentIntake, setCurrentIntake] = useState(0);

  const progress = Math.min((currentIntake / dailyGoal) * 100, 100);

  // Dynamic font size calculation
  const progressFactor = Math.min(currentIntake / dailyGoal, 1); // Capped at 1 (100%)
  const intakeFontSize = 3 + progressFactor * 0.75; // from 3rem (text-5xl) to 3.75rem
  const unitFontSize = 1.875 + progressFactor * 0.5; // from 1.875rem (text-3xl) to 2.375rem

  const addWater = (amount: number) => {
    const wasGoalMet = currentIntake >= dailyGoal;
    const newIntake = currentIntake + amount;
    const isGoalMetNow = newIntake >= dailyGoal;

    if (!wasGoalMet && isGoalMetNow) {
      // Success pattern when goal is reached for the first time
      triggerHapticFeedback([100, 30, 100]);
    }
    setCurrentIntake(newIntake);
  };

  const handleUrineSelect = (color: UrineColor) => {
    onProfileChange({ ...profile, lastUrineColor: color });
    setUrineModalOpen(false);
  };

  return (
    <>
      <div className="absolute top-6 right-6 z-10">
          <button 
              onClick={() => {
                onOpenSettings();
                triggerHapticFeedback();
              }} 
              className="text-zinc-800 dark:text-white transition-all p-3 rounded-full backdrop-blur-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-white/20 dark:border-white/10 active:scale-90"
          >
            <SettingsIcon className="w-6 h-6" />
          </button>
      </div>
      <div className="w-full h-full flex flex-col items-center justify-between p-8 pt-24 bg-transparent text-center">
        <header className="flex-shrink-0">
            <div className="flex items-baseline justify-center">
                <span
                    className="font-bold text-zinc-900 dark:text-white"
                    style={{ fontSize: `${intakeFontSize}rem`, transition: 'font-size 0.5s ease-out' }}
                >
                    {currentIntake}
                </span>
                <span
                    className="ml-1 font-light text-zinc-500 dark:text-gray-400"
                    style={{ fontSize: `${unitFontSize}rem`, transition: 'font-size 0.5s ease-out' }}
                >
                    ml
                </span>
            </div>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-1">Hedef: {dailyGoal} ml</p>
        </header>
        
        <main className="flex-grow flex items-center justify-center my-8">
            <DynamicWaterDrop progress={progress} />
        </main>
        
        <footer className="w-full flex-shrink-0 space-y-4">
            <button 
                onClick={() => {
                    setUrineModalOpen(true);
                    triggerHapticFeedback();
                }}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
                Hidrasyonu Ayarla
            </button>
            <button 
                onClick={() => {
                  triggerHapticFeedback(50);
                  addWater(200);
                }} 
                className="w-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold py-5 rounded-3xl text-center transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-95 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50"
            >
                Bir Bardak Su Ekle
            </button>
        </footer>
      </div>
      {isUrineModalOpen && (
        <UrineColorSelector 
          theme={theme}
          onSelect={handleUrineSelect}
          onClose={() => setUrineModalOpen(false)}
        />
      )}
    </>
  );
};