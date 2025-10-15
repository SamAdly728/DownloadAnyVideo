// FIX: Add triple-slash directive to fix TypeScript error for `import.meta.env`
/// <reference types="vite/client" />

import type { VideoData } from '../types';
import { VideoPlatform } from '../types';

// Use the Vite environment variable for the API base URL.
// Fallback to localhost for local development.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// FIX: Removed Gemini API key and client initialization from the frontend.
// API calls are now securely handled by the backend server.

const FALLBACK_MOCK_DATA = {
  title: "Example Video Title (Frontend Fallback)",
  description: "Could not connect to the backend server. This is local mock data. Ensure the backend server is running and the VITE_API_BASE_URL is set correctly.",
  thumbnailUrl: "https://picsum.photos/560/315",
};

export const analyzeVideoUrl = async (url: string): Promise<VideoData> => {
  // FIX: Call our own backend to analyze the platform instead of Gemini directly.
  const platformData = await getPlatformFromServer(url);

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

// FIX: This function now calls our backend, which then calls Gemini.
const getPlatformFromServer = async (url: string): Promise<{ platform: VideoPlatform | string; isValid: boolean }> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/analyze-platform`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        return await response.json();

    } catch (error) {
        console.error("Error analyzing URL with backend service:", error);
        return { platform: VideoPlatform.Unknown, isValid: false };
    }
};
