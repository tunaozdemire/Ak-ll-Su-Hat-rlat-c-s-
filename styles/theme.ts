import { UserCategory } from '../types';

export const themes = {
  [UserCategory.Athlete]: {
    text: 'text-red-500',
    background: 'bg-red-500',
    backgroundGradient: 'from-red-500 to-red-600',
    shadow: 'shadow-red-500/30 hover:shadow-red-500/50',
    border: 'border-red-400/50',
    color: '#ef4444', // red-500
    colorStart: '#f87171', // red-400
    colorEnd: '#dc2626', // red-600
    urineColors: {
        optimal: { bg: 'bg-red-200/80', ring: 'ring-red-300' },
        good: { bg: 'bg-red-400/80', ring: 'ring-red-500' },
        dehydrated: { bg: 'bg-red-600/80', ring: 'ring-red-700' },
    },
    selection: {
      border: 'border-red-400/50 dark:border-red-400/80',
      shadow: 'shadow-md shadow-red-500/5',
      icon: 'text-red-600 dark:text-red-400',
    },
  },
  [UserCategory.BusinessPerson]: {
    text: 'text-blue-500',
    background: 'bg-blue-500',
    backgroundGradient: 'from-blue-500 to-blue-600',
    shadow: 'shadow-blue-500/30 hover:shadow-blue-500/50',
    border: 'border-blue-400/50',
    color: '#3b82f6', // blue-500
    colorStart: '#60a5fa', // blue-400
    colorEnd: '#2563eb', // blue-600
    urineColors: {
        optimal: { bg: 'bg-blue-200/80', ring: 'ring-blue-300' },
        good: { bg: 'bg-blue-400/80', ring: 'ring-blue-500' },
        dehydrated: { bg: 'bg-blue-600/80', ring: 'ring-blue-700' },
    },
    selection: {
      border: 'border-blue-400/50 dark:border-blue-400/80',
      shadow: 'shadow-md shadow-blue-500/5',
      icon: 'text-blue-600 dark:text-blue-400',
    },
  },
  [UserCategory.Student]: {
    text: 'text-green-500',
    background: 'bg-green-500',
    backgroundGradient: 'from-green-500 to-green-600',
    shadow: 'shadow-green-500/30 hover:shadow-green-500/50',
    border: 'border-green-400/50',
    color: '#22c55e', // green-500
    colorStart: '#4ade80', // green-400
    colorEnd: '#16a34a', // green-600
    urineColors: {
        optimal: { bg: 'bg-green-200/80', ring: 'ring-green-300' },
        good: { bg: 'bg-green-400/80', ring: 'ring-green-500' },
        dehydrated: { bg: 'bg-green-600/80', ring: 'ring-green-700' },
    },
    selection: {
      border: 'border-green-400/50 dark:border-green-400/80',
      shadow: 'shadow-md shadow-green-500/5',
      icon: 'text-green-600 dark:text-green-400',
    },
  },
};

export type Theme = typeof themes[UserCategory.Athlete];

export const getTheme = (category: UserCategory | null): Theme => {
  return themes[category || UserCategory.BusinessPerson]; // Varsayılan olarak mavi tema
};