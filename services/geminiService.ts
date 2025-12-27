
import { GoogleGenAI } from "@google/genai";
import type { Activity } from '../types';

export const generateAppreciationMessage = async (activity: Activity): Promise<string> => {
    // The API key is injected by Vite's define plugin from Vercel's environment variables
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const prompt = `A Rotaract club member, ${activity.userName}, has submitted the following activity for approval:
        - Activity Type: ${activity.type}
        - Description: "${activity.description}"
        
        Please generate a short, positive, and encouraging appreciation message (2-3 sentences) that the club president can send to this member upon approving the activity. The tone should be warm and motivating.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                temperature: 0.7,
            }
        });

        return response.text?.trim() || "Thank you for your service to the community and the club!";
    } catch (error) {
        console.error("Error generating message with Gemini API:", error);
        return "Great job on this activity! Your contribution is greatly appreciated.";
    }
};
