import React, { useState, useMemo } from 'react';
import { HydrationLog, AppSound } from '../../types';
import { CheckIcon } from '../icons/CheckIcon';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import { XMarkIcon } from '../icons/XMarkIcon';
import { triggerHapticFeedback } from '../../haptics';
import { playAppSound } from '../../services/notificationService';

const WEEK_DAYS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

const toLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const CalendarView: React.FC<{ log: HydrationLog, onClose: () => void }> = ({ log, onClose }) => {
    const [viewDate, setViewDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    const calendarDays = useMemo(() => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        
        const daysInMonth = lastDayOfMonth.getDate();
        const startDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // 0 = Monday

        const days = [];

        // Previous month's padding days
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push({ date: null });
        }
        
        // Current month's days
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({ date: new Date(year, month, i) });
        }

        return days;
    }, [viewDate]);

    const weeklySummary = useMemo(() => {
        const startOfWeek = new Date(selectedDate);
        const dayOfWeek = (selectedDate.getDay() + 6) % 7; // 0 = Monday
        startOfWeek.setDate(selectedDate.getDate() - dayOfWeek);
        
        let totalIntake = 0;
        let goalMetDays = 0;

        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const dateString = toLocalDateString(date);
            const dayLog = log[dateString];

            if (dayLog) {
                totalIntake += dayLog.intake;
                if (dayLog.intake >= dayLog.goal) {
                    goalMetDays++;
                }
            }
        }
        return { totalIntake, goalMetDays };
    }, [selectedDate, log]);


    const changeMonth = (amount: number) => {
        setViewDate(current => {
            const newDate = new Date(current);
            newDate.setMonth(current.getMonth() + amount);
            return newDate;
        });
        triggerHapticFeedback();
        playAppSound(AppSound.Tap);
    };

    const handleClose = () => {
        playAppSound(AppSound.Tap);
        triggerHapticFeedback();
        onClose();
    };
    
    const today = new Date();

    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-zinc-900 z-50 flex flex-col animate-slide-up">
            <div className="w-full h-full md:max-w-md md:mx-auto backdrop-blur-3xl bg-white/70 dark:bg-black/30 md:border-r md:border-l border-white/50 dark:border-white/10 md:shadow-2xl shadow-gray-400/20 dark:shadow-black/50 flex flex-col p-6">
                
                <header className="flex items-center justify-between mb-6 flex-shrink-0">
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Geçmiş</h1>
                    <button onClick={handleClose} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                        <XMarkIcon className="w-6 h-6 text-zinc-800 dark:text-white" />
                    </button>
                </header>
                
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <h2 className="font-semibold text-lg">
                        {viewDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transform rotate-180">
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-zinc-500 dark:text-gray-400 mb-2 flex-shrink-0">
                    {WEEK_DAYS.map(day => <div key={day}>{day}</div>)}
                </div>

                <div className="grid grid-cols-7 gap-1 flex-grow">
                    {calendarDays.map((day, index) => {
                        if (!day.date) return <div key={`empty-${index}`}></div>;

                        const dateString = toLocalDateString(day.date);
                        const dayLog = log[dateString];
                        const isGoalMet = dayLog ? dayLog.intake >= dayLog.goal : false;
                        const isToday = toLocalDateString(today) === dateString;
                        const isSelected = toLocalDateString(selectedDate) === dateString;
                        
                        return (
                            <div key={dateString} className="flex flex-col items-center justify-start aspect-square p-0.5" onClick={() => setSelectedDate(day.date)}>
                                <span className={`flex items-center justify-center w-8 h-8 rounded-full text-sm mb-1 transition-colors duration-200
                                    ${isSelected ? 'bg-blue-500 text-white' : ''}
                                    ${isToday && !isSelected ? 'font-bold ring-2 ring-blue-500 text-blue-600 dark:text-blue-400' : 'text-zinc-800 dark:text-white'}`}>
                                    {day.date.getDate()}
                                </span>
                                {dayLog && (
                                    <div className="flex flex-col items-center">
                                        <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-zinc-500 dark:text-gray-400'}`}>
                                            {(dayLog.intake / 1000).toFixed(1)}L
                                        </span>
                                        {isGoalMet && (
                                            <div className={`mt-0.5 w-4 h-4 rounded-full ${isSelected ? 'bg-white/20' : 'bg-blue-100 dark:bg-blue-900'} flex items-center justify-center`}>
                                                <CheckIcon className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-blue-600 dark:text-blue-300'}`}/>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
                 <div className="mt-6 p-5 bg-black/5 dark:bg-white/5 rounded-2xl flex-shrink-0">
                    <h3 className="text-sm font-semibold text-zinc-500 dark:text-gray-400 mb-3">Haftalık Özet</h3>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{(weeklySummary.totalIntake / 1000).toFixed(1)} L</p>
                            <p className="text-xs text-zinc-500 dark:text-gray-400">Toplam Tüketim</p>
                        </div>
                         <div className="text-right">
                            <p className="text-2xl font-bold text-zinc-900 dark:text-white">{weeklySummary.goalMetDays} / 7</p>
                            <p className="text-xs text-zinc-500 dark:text-gray-400">Hedefe Ulaşılan Gün</p>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.35s ease-out;
                }
            `}</style>
        </div>
    );
};