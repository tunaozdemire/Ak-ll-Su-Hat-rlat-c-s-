import { UserProfile, UrineColor, WaterHabit, UserCategory } from '../types';

export const calculateDailyGoal = (profile: UserProfile): number => {
    let base = profile.weight * 33; // Base formula
    if (profile.category === UserCategory.Athlete) {
        base *= 1.2;
    }
    if (profile.habit === WaterHabit.Low) {
        base *= 0.9; // Start with a more achievable goal
    }
    
    let goal = Math.round(base / 100) * 100;
    
    if (profile.lastUrineColor === UrineColor.Dehydrated) {
        goal = Math.round(goal * 1.15); // Increase goal by 15% if dehydrated
    }
    return goal;
};
