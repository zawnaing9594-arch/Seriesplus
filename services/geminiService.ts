import { GoogleGenAI } from "@google/genai";
import { Movie } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMovieInsights = async (movie: Movie, userQuery: string) => {
  if (!process.env.API_KEY) {
    return "API Key is missing. Please set the API_KEY environment variable.";
  }

  try {
    const model = 'gemini-3-flash-preview';
    const systemPrompt = `You are an expert film critic and AI assistant for a streaming service called StreamGenius. 
    The user is asking about the movie: "${movie.title}".
    
    Movie Details:
    - Description: ${movie.description}
    - Genre: ${movie.genre.join(', ')}
    - Cast: ${movie.cast.join(', ')}
    - Director: ${movie.director}
    - Year: ${movie.year}

    Answer the user's question concisely, enthusiastically, and helpfully. Keep it under 100 words if possible.`;

    // Fix: Use config.systemInstruction and simplify contents as per guidelines
    const response = await ai.models.generateContent({
      model: model,
      contents: userQuery,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    return response.text || "I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the AI service right now.";
  }
};