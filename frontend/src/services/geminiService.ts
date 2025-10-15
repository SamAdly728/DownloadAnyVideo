
import type { VideoData } from '../types';
import { VideoPlatform } from '../types';

/**
 * Calls the unified backend server to analyze a video URL.
 * The server handles both platform detection and metadata fetching.
 * 
 * @param url The video URL to analyze.
 * @returns A promise that resolves to a VideoData object.
 */
export const analyzeVideoUrl = async (url: string): Promise<VideoData> => {
  // Step 1: Call our backend to use Gemini to validate the URL and identify the platform.
  const platformResponse = await fetch('/api/analyze-platform', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!platformResponse.ok) {
    const errorData = await platformResponse.json();
    throw new Error(errorData.error || `Platform analysis failed with status: ${platformResponse.status}`);
  }
  const platformData = await platformResponse.json();

  if (!platformData.isValid || platformData.platform === VideoPlatform.Unknown) {
    return {
      platform: VideoPlatform.Unknown,
      isValid: false,
      title: "Invalid or Unknown URL",
      description: "The provided URL could not be identified. Please check it and try again.",
      thumbnailUrl: "https://picsum.photos/seed/invalid/560/315",
    };
  }

  // Step 2: Call our backend server again to get the detailed metadata.
  const detailsResponse = await fetch('/api/video-details', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });

  if (!detailsResponse.ok) {
    const errorData = await detailsResponse.json();
    throw new Error(errorData.error || `Fetching details failed with status: ${detailsResponse.status}`);
  }

  const videoDetails: VideoData = await detailsResponse.json();
  // Combine results: use the accurate platform from the first call with details from the second.
  return { ...videoDetails, platform: platformData.platform };
};
