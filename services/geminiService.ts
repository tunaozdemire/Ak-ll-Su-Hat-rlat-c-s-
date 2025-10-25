
import { GoogleGenAI } from "@google/genai";
import { UserProfile, UserCategory, UrineColor } from '../types';

const getCategoryContext = (category: UserCategory | null): string => {
  switch (category) {
    case UserCategory.Athlete:
      return "Their goal is peak physical performance and rapid recovery. Focus on cellular hydration, endurance, and preventing cramps.";
    case UserCategory.BusinessPerson:
      return "Their goal is sustained mental clarity, sharp decision-making, and high energy throughout long workdays. Focus on cognitive function, focus, and preventing mental fatigue.";
    case UserCategory.Student:
      return "Their goal is improved memory, concentration for studying, and stress reduction. Focus on brain function, learning capacity, and exam performance.";
    default:
      return "Their goal is general well-being and establishing a healthy habit. Focus on energy levels, mood, and overall vitality.";
  }
};

const getHydrationStatusContext = (urineColor: UrineColor | null): string => {
    if (urineColor === UrineColor.Dehydrated) {
        return "Based on their last input, they are dehydrated. The message needs to be motivating and slightly urgent to correct this.";
    }
    if (urineColor === UrineColor.Optimal) {
        return "Based on their last input, their hydration is optimal. The message should be encouraging to maintain this state.";
    }
    return "Their current hydration status is unknown. Provide a general but powerful reminder.";
}

export const generateReminderMessage = async (profile: UserProfile): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    return "Küçük bir yudum, büyük bir fark yaratır. Şimdi tam zamanı.";
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      You are a behavioral science expert and sports coach crafting a water reminder notification for a minimalist mobile app named 'Aqua Vita'.
      Your goal is to use psychological triggers to motivate the user, reflecting the app's intelligent, adaptive nature.
      The message must be in TURKISH.

      User Profile:
      - Category: ${profile.category || 'Belirtilmemiş'}
      - Context: ${getCategoryContext(profile.category)}
      - Hydration Status: ${getHydrationStatusContext(profile.lastUrineColor)}

      Based on this complete profile, generate a single, short, compelling reminder message (under 15 words).
      The tone should be sharp, insightful, and inspiring.
      Do not use generic phrases like 'su içmeyi unutma'.
      Instead, use powerful words related to the user's specific context and current hydration need.

      Example for Athlete (Dehydrated): 'Kasların sinyal veriyor. Dehidrasyonu zafere dönüştür.'
      Example for Business Person (Optimal): 'Zihinsel akışını koru. Zirvedesin, orada kal.'
      Example for Student (Dehydrated): 'Odaklanma gücünü geri kazan. O notlar seni bekliyor.'

      Now, generate a new one for a ${profile.category} user whose hydration status is: ${profile.lastUrineColor || 'Normal'}.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text.trim().replace(/"/g, ''); // Clean up response
    return text;
  } catch (error) {
    console.error("Error generating reminder message:", error);
    return "Potansiyelini serbest bırakmanın ilk adımı. Bir yudum al.";
  }
};