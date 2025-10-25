
import { NotificationSound, AppSound } from '../types';

// Use a self-initializing function to create a singleton AudioContext
const getAudioContext = (() => {
    let audioContext: AudioContext | null = null;
    return () => {
        if (typeof window !== 'undefined' && (window.AudioContext || (window as any).webkitAudioContext)) {
            if (!audioContext) {
                 audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            }
            // Resume context on any user interaction that might play a sound
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            return audioContext;
        }
        return null;
    };
})();


const playTone = (frequency: number, duration: number, type: OscillatorType) => {
    const ctx = getAudioContext();
    if (!ctx) return;

    // Resume context if it's suspended (e.g., due to browser autoplay policies)
    if (ctx.state === 'suspended') {
        ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    oscillator.start(ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
    oscillator.stop(ctx.currentTime + duration);
}

const playNotificationSound = (sound: NotificationSound) => {
    switch (sound) {
        case NotificationSound.Drop:
            // A soft, high-pitched "drop"
            playTone(1200, 0.2, 'sine');
            setTimeout(() => playTone(1000, 0.3, 'sine'), 50);
            break;
        case NotificationSound.Chime:
            // A clear, bell-like "chime"
            playTone(1500, 0.5, 'triangle');
            setTimeout(() => playTone(2000, 0.5, 'triangle'), 100);
            break;
        case NotificationSound.Default:
            // A standard notification beep
            playTone(880, 0.2, 'square');
            break;
    }
};

export const playAppSound = (sound: AppSound) => {
    switch (sound) {
        case AppSound.AddWater:
            // A short, satisfying "blip"
            playTone(400, 0.15, 'sine');
            break;
        case AppSound.GoalReached:
            // A positive, ascending chime
            playTone(523, 0.1, 'sine'); // C5
            setTimeout(() => playTone(659, 0.1, 'sine'), 120); // E5
            setTimeout(() => playTone(784, 0.2, 'sine'), 240); // G5
            break;
        case AppSound.Tap:
            // A subtle, low-frequency tap for UI interactions
            playTone(200, 0.05, 'sine');
            break;
    }
};

export const showNotification = (message: string, sound: NotificationSound) => {
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification('HydrateMind', {
            body: message,
            // A generic water drop icon using data URI as a placeholder
            icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💧</text></svg>',
            silent: true, // We will play our own sound
        });
        playNotificationSound(sound);

        notification.onclick = () => {
            window.focus();
        };

    } else {
        console.warn(`Notification permission not granted. Message: ${message}`);
        // As a fallback, still play the sound if possible for in-app feedback
        playNotificationSound(sound);
    }
};