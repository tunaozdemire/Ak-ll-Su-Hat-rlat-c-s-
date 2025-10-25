import React, { useState, useEffect, useRef } from 'react';
import { OnboardingStep, UserProfile, UserCategory, WaterHabit, UrineColor, NotificationSound } from './types';
import { CategorySelector } from './components/Onboarding/CategorySelector';
import { MetricsForm } from './components/Onboarding/MetricsForm';
import { HabitSelector } from './components/Onboarding/HabitSelector';
import { Dashboard } from './components/Dashboard/Dashboard';
import { SettingsScreen } from './components/Settings/SettingsScreen';
import { triggerHapticFeedback } from './haptics';
import { ArrowLeftIcon } from './components/icons/ArrowLeftIcon';
import { getTheme, Theme } from './styles/theme';
import { calculateDailyGoal } from './utils/hydration';
import { showNotification } from './services/notificationService';
import { generateReminderMessage } from './services/geminiService';

const OnboardingContainer: React.FC<{ children: React.ReactNode; onNext?: () => void; nextDisabled?: boolean; nextText?: string; onBack?: () => void; theme: Theme }> = ({ children, onNext, nextDisabled = false, nextText = 'Devam Et', onBack, theme }) => {
  const handleNext = () => {
    if (onNext) {
      triggerHapticFeedback(50); // Stronger feedback for progression
      onNext();
    }
  };

  const handleBack = () => {
    if (onBack) {
      triggerHapticFeedback(); // Default feedback for back action
      onBack();
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6">
      {onBack && (
        <div className="absolute top-6 left-6 z-10">
            <button onClick={handleBack} className="text-zinc-800 dark:text-white transition-all p-2 rounded-full backdrop-blur-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-white/20 dark:border-white/10 active:scale-90">
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
        </div>
      )}
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>
      {onNext && (
        <footer className="flex-shrink-0 pt-4">
          <button
            onClick={handleNext}
            disabled={nextDisabled}
            className={`w-full text-white font-bold py-4 px-4 rounded-2xl
                       ${theme.background}
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50
                       transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] transform active:scale-95
                       disabled:bg-zinc-300 dark:disabled:bg-zinc-800 disabled:text-zinc-500 dark:disabled:text-zinc-600 disabled:cursor-not-allowed`}
          >
            {nextText}
          </button>
        </footer>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const [step, setStep] = useState<OnboardingStep>(OnboardingStep.Welcome);
  const [profile, setProfile] = useState<UserProfile>({
    category: null,
    weight: 70,
    height: 175,
    habit: null,
    lastUrineColor: null,
    wakeUpTime: '08:00',
    bedTime: '23:00',
    notificationSound: NotificationSound.Default,
  });
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const reminderTimers = useRef<number[]>([]);

  const theme = getTheme(profile.category);
  
  // Effect to handle reminder scheduling
  useEffect(() => {
    // 1. Clear any existing timers to prevent duplicates when profile changes.
    reminderTimers.current.forEach(clearTimeout);
    reminderTimers.current = [];

    // 2. Only schedule reminders if the user is on the dashboard.
    if (step !== OnboardingStep.Dashboard || !profile.wakeUpTime || !profile.bedTime) {
      return;
    }

    const scheduleReminders = () => {
        const now = new Date();
        const [wakeHours, wakeMinutes] = profile.wakeUpTime.split(':').map(Number);
        const [bedHours, bedMinutes] = profile.bedTime.split(':').map(Number);

        const wakeTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), wakeHours, wakeMinutes);
        let bedTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), bedHours, bedMinutes);

        // Handle overnight schedules (e.g., bed time is past midnight)
        if (bedTime <= wakeTime) {
            bedTime.setDate(bedTime.getDate() + 1);
        }
        
        // If it's already past bed time for today, do nothing.
        if (now > bedTime) return;

        const activeDurationMinutes = (bedTime.getTime() - wakeTime.getTime()) / (1000 * 60);
        if (activeDurationMinutes <= 0) return;

        // 3. Calculate how many reminders to send based on the daily goal.
        const dailyGoal = calculateDailyGoal(profile);
        // More water means more reminders. Min 2, max 10.
        const reminderCount = Math.min(10, Math.max(2, Math.floor(dailyGoal / 400)));

        // 4. Calculate the interval between reminders to spread them evenly.
        const intervalMinutes = activeDurationMinutes / (reminderCount + 1);

        // 5. Create timeouts for each future reminder.
        for (let i = 1; i <= reminderCount; i++) {
            const reminderDateTime = new Date(wakeTime.getTime() + i * intervalMinutes * 60 * 1000);

            // Only schedule reminders that are in the future.
            if (reminderDateTime > now) {
                const timeout = reminderDateTime.getTime() - now.getTime();
                
                const timerId = window.setTimeout(async () => {
                    const message = await generateReminderMessage(profile);
                    showNotification(message, profile.notificationSound);
                }, timeout);
                reminderTimers.current.push(timerId);
            }
        }
    };

    scheduleReminders();

    // 6. Cleanup function to clear timers when the component unmounts or deps change.
    return () => {
        reminderTimers.current.forEach(clearTimeout);
    };
}, [profile, step]);


  const handleCategorySelect = (category: UserCategory) => {
    setProfile(prev => ({ ...prev, category }));
  };
  
  const handleHabitSelect = (habit: WaterHabit) => {
    setProfile(prev => ({ ...prev, habit }));
  };
  
  const handleProfileChange = (newProfile: UserProfile) => {
    setProfile(newProfile);
  }

  const handleSettingsClose = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    setSettingsOpen(false);
  }

  const renderStep = () => {
    switch (step) {
      case OnboardingStep.Welcome:
        return (
          <OnboardingContainer 
            onNext={() => setStep(OnboardingStep.Metrics)} 
            nextDisabled={!profile.category}
            theme={theme}
          >
            <CategorySelector onSelect={handleCategorySelect} selectedCategory={profile.category} />
          </OnboardingContainer>
        );
      case OnboardingStep.Metrics:
        return (
          <OnboardingContainer
            onNext={() => setStep(OnboardingStep.Habits)}
            onBack={() => setStep(OnboardingStep.Welcome)}
            theme={theme}
          >
            <MetricsForm 
              theme={theme}
              weight={profile.weight}
              height={profile.height}
              onWeightChange={(w) => setProfile(p => ({...p, weight: w}))}
              onHeightChange={(h) => setProfile(p => ({...p, height: h}))}
            />
          </OnboardingContainer>
        );
      case OnboardingStep.Habits:
        return (
          <OnboardingContainer
            onNext={() => setStep(OnboardingStep.Dashboard)}
            nextDisabled={!profile.habit}
            nextText="Başla"
            onBack={() => setStep(OnboardingStep.Metrics)}
            theme={theme}
          >
            <HabitSelector theme={theme} onSelect={handleHabitSelect} selectedHabit={profile.habit} />
          </OnboardingContainer>
        );
      case OnboardingStep.Dashboard:
        return <Dashboard 
                  profile={profile} 
                  onProfileChange={handleProfileChange} 
                  onOpenSettings={() => setSettingsOpen(true)}
               />;
      default:
        return <div>Bilinmeyen adım</div>;
    }
  };

  return (
    <div className="h-screen w-screen font-sans text-zinc-900 dark:text-gray-100 bg-gray-100 dark:bg-zinc-900">
      <div className="max-w-md mx-auto h-full backdrop-blur-3xl bg-white/70 dark:bg-black/30 border-r border-l border-white/50 dark:border-white/10 shadow-2xl shadow-gray-400/20 dark:shadow-black/50 overflow-hidden relative">
        <div className="w-full h-full overflow-y-auto no-scrollbar">
          {renderStep()}
        </div>
        {isSettingsOpen && <SettingsScreen profile={profile} onClose={handleSettingsClose} />}
      </div>
    </div>
  );
};

export default App;