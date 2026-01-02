
import { GoogleGenAI, Type } from "@google/genai";

// Always use the required constructor format and direct environment variable access
const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const getTeamEnhancements = async (groupCount: number) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate ${groupCount} creative team names and one specific icebreaker question for each team for a corporate event. Return as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              groupName: { type: Type.STRING },
              iceBreaker: { type: Type.STRING }
            },
            propertyOrdering: ["groupName", "iceBreaker"]
          }
        }
      }
    });

    // Access the text property directly, handle possible undefined
    const jsonStr = response.text?.trim();
    if (!jsonStr) return null;
    
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini enhancement failed", error);
    return null;
  }
};

export const getWinnerCheer = async (name: string) => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short, enthusiastic 1-sentence announcement for a lucky draw winner named ${name}. Keep it professional but exciting.`,
    });
    // Use the .text property directly
    return response.text || `Congratulations to our winner, ${name}!`;
  } catch {
    return `Congratulations to our winner, ${name}!`;
  }
};
