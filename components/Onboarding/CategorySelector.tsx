import React from 'react';
import { UserCategory } from '../../types';
import { triggerHapticFeedback } from '../../haptics';
import { AthleteIcon } from '../icons/AthleteIcon';
import { BusinessPersonIcon } from '../icons/BusinessPersonIcon';
import { StudentIcon } from '../icons/StudentIcon';

interface CategorySelectorProps {
  onSelect: (category: UserCategory) => void;
  selectedCategory: UserCategory | null;
}

const categories = [
  { 
    id: UserCategory.Athlete, 
    label: 'Sporcu', 
    icon: AthleteIcon, 
    color: 'text-red-500',
    borderColor: 'border-red-400/50 dark:border-red-400/80',
    shadowColor: 'shadow-red-500/10'
  },
  { 
    id: UserCategory.BusinessPerson, 
    label: 'İş İnsanı', 
    icon: BusinessPersonIcon, 
    color: 'text-blue-500',
    borderColor: 'border-blue-400/50 dark:border-blue-400/80',
    shadowColor: 'shadow-blue-500/10'
  },
  { 
    id: UserCategory.Student, 
    label: 'Öğrenci', 
    icon: StudentIcon, 
    color: 'text-green-500',
    borderColor: 'border-green-400/50 dark:border-green-400/80',
    shadowColor: 'shadow-green-500/10'
  },
];

const CategoryCard: React.FC<{ category: typeof categories[0], isSelected: boolean, onClick: () => void }> = ({ category, isSelected, onClick }) => {
  const IconComponent = category.icon;
  return (
    <button
      onClick={() => {
        onClick();
        triggerHapticFeedback();
      }}
      className={`
        w-full p-6 rounded-3xl text-center group
        transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]
        border
        ${isSelected 
          ? `bg-white/80 dark:bg-white/10 ${category.borderColor} shadow-lg ${category.shadowColor}` 
          : 'bg-white/50 dark:bg-white/5 border-white/0 dark:border-white/5 hover:border-white dark:hover:border-white/20 shadow-md shadow-black/5'
        }
        active:scale-95 active:shadow-sm
      `}
    >
      <div
        className={`
          transition-all duration-300
        `}
      >
        <IconComponent className={`w-14 h-14 mx-auto mb-4 transition-colors duration-300 ${isSelected ? category.color : 'text-zinc-800 dark:text-white'}`} />
        <span className="font-semibold text-lg text-zinc-900 dark:text-white pb-4 block">{category.label}</span>
      </div>
    </button>
  );
};


export const CategorySelector: React.FC<CategorySelectorProps> = ({ onSelect, selectedCategory }) => {
  return (
    <div className="w-full text-center">
      <h1 className="text-6xl font-extrabold text-zinc-900/90 dark:text-white/90 mb-4">Hoş Geldin!</h1>
      <p className="text-lg text-gray-800 dark:text-gray-300 mb-12">Sana en uygun hatırlatıcıları oluşturmak için yaşam tarzını seç.</p>
      <div className="flex flex-col gap-5">
        {categories.map((cat) => (
          <CategoryCard 
            key={cat.id} 
            category={cat} 
            isSelected={selectedCategory === cat.id}
            onClick={() => onSelect(cat.id)} 
          />
        ))}
      </div>
    </div>
  );
};