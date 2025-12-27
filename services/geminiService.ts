
import { GoogleGenAI } from "@google/genai";
import type { Activity } from '../types';

// IMPORTANT: This key is exposed on the client-side for demonstration purposes only.
// In a real application, this API call should be made from a secure backend server.
const FAKE_API_KEY = process.env.API_KEY;

if (!FAKE_API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API will not be available.");
}

const ai = new GoogleGenAI({ apiKey: FAKE_API_KEY as string });

export const generateAppreciationMessage = async (activity: Activity): Promise<string> => {
    if(!FAKE_API_KEY) return "Gemini API key not configured.";

    try {
        const prompt = `A Rotaract club member, ${activity.userName}, has submitted the following activity for approval:
        - Activity Type: ${activity.type}
        - Description: "${activity.description}"
        
        Please generate a short, positive, and encouraging appreciation message (2-3 sentences) that the club president can send to this member upon approving the activity. The tone should be warm and motivating.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.7,
            }
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error generating message with Gemini API:", error);
        return "Failed to generate a suggestion. Please check your API key and network connection.";
    }
};
