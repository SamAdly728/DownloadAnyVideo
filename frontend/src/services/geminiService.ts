import { GoogleGenAI, Type } from "@google/genai";
import type { VideoData } from '../types';
import { VideoPlatform } from '../types';

// Use the Vite environment variable for the API base URL.
// Fallback to localhost for local development.
// FIX: Changed import.meta.env to process.env to resolve TypeScript error. It's assumed the build process will handle this.
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:4000';

// FIX: Aligned with @google/genai coding guidelines to use process.env.API_KEY for the API key, which also resolves a TypeScript error.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const FALLBACK_MOCK_DATA = {
  title: "Example Video Title (Frontend Fallback)",
  description: "Could not connect to the backend server. This is local mock data. Ensure the backend server is running and the VITE_API_BASE_URL is set correctly.",
  thumbnailUrl: "https://picsum.photos/560/315",
};

export const analyzeVideoUrl = async (url: string): Promise<VideoData> => {
  const platformData = await getPlatformFromGemini(url);

  if (!platformData.isValid || platformData.platform === VideoPlatform.Unknown) {
    return {
      ...FALLBACK_MOCK_DATA,
      platform: VideoPlatform.Unknown,
      isValid: false,
      downloadUrl: '#',
    };
  }
  
  try {
    console.log(`Attempting to fetch details from backend server at ${API_BASE_URL}...`);
    const response = await fetch(`${API_BASE_URL}/api/video-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`Backend server responded with status: ${response.status}`);
    }

    const videoDetails: VideoData = await response.json();
    console.log("Successfully fetched data from backend:", videoDetails);
    return videoDetails;

  } catch (error) {
    console.warn("Backend fetch failed. Using fallback data.", error);
    return {
      ...FALLBACK_MOCK_DATA,
      platform: platformData.platform,
      isValid: true,
      downloadUrl: '#',
    };
  }
};

const getPlatformFromGemini = async (url: string): Promise<{ platform: VideoPlatform | string; isValid: boolean }> => {
    try {
        const model = 'gemini-2.5-flash';
        const schema = {
            type: Type.OBJECT,
            properties: {
                platform: {
                    type: Type.STRING,
                    description: "The name of the video platform (e.g., YouTube, TikTok, Instagram, Facebook, Vimeo, X). Should be 'Unknown' if the platform cannot be identified or the URL is invalid.",
                },
                isValid: {
                    type: Type.BOOLEAN,
                    description: "True if the URL is a valid and recognizable video platform URL, otherwise false.",
                }
            },
            required: ["platform", "isValid"]
        };

        const prompt = `Analyze the following URL and identify the video platform. The URL is: ${url}. Respond with only a JSON object matching the provided schema.`;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        const jsonString = response.text.trim();
        return JSON.parse(jsonString) as { platform: string; isValid: boolean };

    } catch (error) {
        console.error("Error analyzing URL with Gemini API:", error);
        return { platform: VideoPlatform.Unknown, isValid: false };
    }
};
