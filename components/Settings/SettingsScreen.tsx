import React, { useState } from 'react';
import { UserProfile, NotificationSound, AppSound } from '../../types';
import { triggerHapticFeedback } from '../../haptics';
import { CheckIcon } from '../icons/CheckIcon';
import { playAppSound } from '../../services/notificationService';

interface SettingsScreenProps {
  profile: UserProfile;
  onClose: (updatedProfile: UserProfile) => void;
}

const soundOptions = [
    { id: NotificationSound.Drop, label: 'Sakin Damla' },
    { id: NotificationSound.Chime, label: 'Kristal Çan' },
    { id: NotificationSound.Default, label: 'Varsayılan' },
];

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ profile, onClose }) => {
  const [localProfile, setLocalProfile] = useState<UserProfile>(profile);

  const handleSave = () => {
    triggerHapticFeedback(50);
    playAppSound(AppSound.Tap);
    onClose(localProfile);
  };
  
  const SoundOptionButton: React.FC<{ option: typeof soundOptions[0] }> = ({ option }) => {
    const isSelected = localProfile.notificationSound === option.id;
    return (
        <button
          onClick={() => {
            setLocalProfile(p => ({ ...p, notificationSound: option.id }));
            triggerHapticFeedback();
            playAppSound(AppSound.Tap);
          }}
          className={`
            w-full p-4 text-left flex items-center justify-between
            rounded-xl group
            transition-all duration-200
            ${isSelected 
              ? 'bg-blue-500/10 dark:bg-blue-400/10' 
              : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
            }
          `}
        >
          <span className={`font-medium ${isSelected ? 'text-blue-600 dark:text-blue-300' : 'text-zinc-800 dark:text-gray-100'}`}>{option.label}</span>
          {isSelected && <CheckIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
        </button>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-100 dark:bg-zinc-900 z-50 flex flex-col animate-slide-up">
        <div className="w-full h-full md:max-w-md md:mx-auto backdrop-blur-3xl bg-white/70 dark:bg-black/30 md:border-r md:border-l border-white/50 dark:border-white/10 md:shadow-2xl shadow-gray-400/20 dark:shadow-black/50 overflow-hidden relative p-6 pt-20">
            
            <header className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-20">
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Ayarlar</h1>
                <button
                    onClick={handleSave}
                    className="font-bold text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/10"
                >
                    Bitti
                </button>
            </header>

            <main className="space-y-10 overflow-y-auto h-full pt-4 no-scrollbar">
                <section>
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">Aktif Zaman Dilimi</h2>
                    <p className="text-sm text-zinc-500 dark:text-gray-400 mb-4">Bu saatler arasında hatırlatıcı alacaksın.</p>
                    <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <label htmlFor="wakeUpTime" className="font-medium text-zinc-800 dark:text-gray-100">Uyanış</label>
                            <input
                                id="wakeUpTime"
                                type="time"
                                value={localProfile.wakeUpTime}
                                onChange={(e) => setLocalProfile(p => ({...p, wakeUpTime: e.target.value}))}
                                className="bg-transparent font-semibold text-zinc-900 dark:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                         <div className="border-t border-black/10 dark:border-white/10"></div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="bedTime" className="font-medium text-zinc-800 dark:text-gray-100">Uyku</label>
                            <input
                                id="bedTime"
                                type="time"
                                value={localProfile.bedTime}
                                onChange={(e) => setLocalProfile(p => ({...p, bedTime: e.target.value}))}
                                className="bg-transparent font-semibold text-zinc-900 dark:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-1">Bildirim Sesi</h2>
                    <p className="text-sm text-zinc-500 dark:text-gray-400 mb-4">Hatırlatıcılar için bir ses seç.</p>
                     <div className="space-y-2">
                        {soundOptions.map((option) => (
                          <SoundOptionButton key={option.id} option={option} />
                        ))}
                    </div>
                </section>
            </main>
        </div>
        <style>{`
            @keyframes slide-up {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
            }
            .animate-slide-up {
                animation: slide-up 0.35s ease-out;
            }
            input[type="time"]::-webkit-calendar-picker-indicator {
                filter: invert(0.5);
            }
            .dark input[type="time"]::-webkit-calendar-picker-indicator {
                filter: invert(1);
            }
        `}</style>
    </div>
  );
};