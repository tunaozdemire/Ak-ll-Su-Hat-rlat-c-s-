
export enum UserCategory {
  Athlete = 'Sporcu',
  BusinessPerson = 'İş İnsanı',
  Student = 'Öğrenci',
}

export enum WaterHabit {
  Low = 'Nadiren Su İçerim',
  Medium = 'Ara Sıra Hatırlamam Gerekir',
  High = 'Düzenli Su İçerim',
}

export enum UrineColor {
    Optimal = 'Optimal (Açık Sarı)',
    Good = 'İyi (Saman Sarısı)',
    Dehydrated = 'Dehidre (Koyu Sarı/Turuncu)',
}

export enum NotificationSound {
    Drop = 'Sakin Damla',
    Chime = 'Kristal Çan',
    Default = 'Varsayılan',
}

export enum AppSound {
  AddWater,
  GoalReached,
  Tap,
}

export interface UserProfile {
  category: UserCategory | null;
  weight: number;
  height: number;
  habit: WaterHabit | null;
  lastUrineColor: UrineColor | null;
  wakeUpTime: string; // e.g., "08:00"
  bedTime: string; // e.g., "23:00"
  notificationSound: NotificationSound;
}

export enum OnboardingStep {
  Welcome,
  Metrics,
  Habits,
  Dashboard
}

export interface HydrationLogEntry {
  intake: number;
  goal: number;
}

export interface HydrationLog {
  [date: string]: HydrationLogEntry;
}

export interface Reminder {
  id: number;
  message: string;
  time: string;
}