import { GoogleGenAI, Type } from "@google/genai";
import type { VideoData } from '../types';
import { VideoPlatform } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// This is fallback mock data if the backend isn't running.
const FALLBACK_MOCK_DATA = {
  title: "Example Video Title (Frontend Fallback)",
  description: "Could not connect to the backend server. This is local mock data. Run `npm install` and `npm start` in your terminal to run the server and fetch real-time data.",
  thumbnailUrl: "https://picsum.photos/560/315",
};

/**
 * First, analyzes a video URL using Gemini to identify the platform.
 * Then, calls a local backend service to fetch the video's metadata.
 * 
 * @param url The video URL to analyze.
 * @returns A promise that resolves to a VideoData object.
 */
export const analyzeVideoUrl = async (url: string): Promise<VideoData> => {
  // Step 1: Use Gemini to quickly validate the URL and identify the platform.
  const platformData = await getPlatformFromGemini(url);

  if (!platformData.isValid || platformData.platform === VideoPlatform.Unknown) {
    // If Gemini can't identify it, don't bother calling the backend.
    return {
      ...FALLBACK_MOCK_DATA,
      platform: VideoPlatform.Unknown,
      isValid: false,
    };
  }

  // Step 2: Call our backend server to get detailed metadata using yt-dlp.
  try {
    console.log("Attempting to fetch details from backend server at http://localhost:4000...");
    const response = await fetch('http://localhost:4000/api/video-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      // Handle server errors (e.g., 500 from yt-dlp failure)
      throw new Error(`Backend server responded with status: ${response.status}`);
    }

    const videoDetails: VideoData = await response.json();
    console.log("Successfully fetched data from backend:", videoDetails);
    return videoDetails;

  } catch (error) {
    console.warn("Backend fetch failed. This is expected if the server isn't running.", error);
    
    // --- FALLBACK ---
    // If the backend call fails, return mock data so the app remains interactive.
    return {
      ...FALLBACK_MOCK_DATA,
      platform: platformData.platform, // Use the platform we got from Gemini
      isValid: true,
    };
  }
};

/**
 * Helper function to call the Gemini API for platform detection.
 */
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

        const jsonString = response.text.replace(/```json\n?/, '').replace(/```$/, '');
        return JSON.parse(jsonString) as { platform: string; isValid: boolean };

    } catch (error) {
        console.error("Error analyzing URL with Gemini API:", error);
        throw new Error("Failed to analyze URL with AI service.");
    }
};
