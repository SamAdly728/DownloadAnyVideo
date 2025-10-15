import type { VideoData } from '../types';
import { VideoPlatform } from '../types';

// This is fallback mock data if the backend isn't running.
const FALLBACK_MOCK_DATA = {
  title: "Example Video Title (Frontend Fallback)",
  description: "Could not connect to the backend server. This is local mock data. Run `npm install` and `npm start` in the `backend` directory to run the server and fetch real-time data.",
  thumbnailUrl: "https://picsum.photos/560/315",
};

/**
 * First, analyzes a video URL by calling the backend to identify the platform using Gemini.
 * Then, calls a second backend service to fetch the video's metadata.
 * 
 * @param url The video URL to analyze.
 * @returns A promise that resolves to a VideoData object.
 */
export const analyzeVideoUrl = async (url: string): Promise<VideoData> => {
  // Step 1: Call our backend to use Gemini to validate the URL and identify the platform.
  let platformData: { platform: VideoPlatform | string; isValid: boolean };
  try {
    // Note: The '/api' prefix is handled by the Vite proxy in development.
    const platformResponse = await fetch('/api/analyze-platform', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!platformResponse.ok) {
        throw new Error(`Platform analysis failed with status: ${platformResponse.status}`);
    }
    platformData = await platformResponse.json();

  } catch (error) {
    console.warn("Could not connect to backend for platform analysis. Is the server running? `cd backend && npm start`", error);
    // If this fails, we can't proceed. Return an error-like state.
    return {
      ...FALLBACK_MOCK_DATA,
      platform: VideoPlatform.Unknown,
      isValid: false,
    };
  }


  if (!platformData.isValid || platformData.platform === VideoPlatform.Unknown) {
    // If Gemini (via our backend) can't identify it, don't bother calling the next endpoint.
    return {
      platform: VideoPlatform.Unknown,
      isValid: false,
      title: "Invalid or Unknown URL",
      description: "The provided URL could not be identified as a valid video link. Please check the URL and try again.",
      thumbnailUrl: "https://picsum.photos/seed/invalid/560/315", // A placeholder image for invalid urls
    };
  }

  // Step 2: Call our backend server to get detailed metadata.
  try {
    console.log("Attempting to fetch details from backend server...");
    // Note: The '/api' prefix is handled by the Vite proxy in development.
    const response = await fetch('/api/video-details', {
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
    // Ensure the platform from the initial check is used.
    return { ...videoDetails, platform: platformData.platform };

  } catch (error) {
    console.warn("Backend fetch for details failed. Using fallback data.", error);
    
    // --- FALLBACK ---
    // If the backend call for details fails, return mock data so the app remains interactive.
    return {
      ...FALLBACK_MOCK_DATA,
      platform: platformData.platform, // Use the platform we got from the first call
      isValid: true,
    };
  }
};
