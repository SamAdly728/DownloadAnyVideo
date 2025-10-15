// --- Backend Setup ---
// To run this server, you'll need Node.js and npm/yarn.
// 1. Install dependencies: `npm install`
// 2. Start the server: `npm start`
// The server will run on http://localhost:4000

const express = require('express');
const cors = require('cors');
// const { ytDlpExec } = require('yt-dlp-exec'); // Uncomment when ready to use yt-dlp

const app = express();
const PORT = 4000;

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing for local development
app.use(express.json()); // Enable parsing of JSON request bodies

// --- API Endpoints ---

/**
 * @route POST /api/video-details
 * @desc Fetches video metadata using yt-dlp.
 * @access Public
 */
app.post('/api/video-details', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Video URL is required.' });
  }

  console.log(`[Server] Received request for URL: ${url}`);

  // --- REAL IMPLEMENTATION WITH yt-dlp ---
  // The following code is the actual implementation you would use.
  // It is commented out because it requires a local Node.js environment and `yt-dlp` installed.
  /*
  try {
    const { ytDlpExec } = require('yt-dlp-exec');
    // yt-dlp flags:
    // -j, --dump-json: Dumps metadata as a single JSON line.
    // -f 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best': Select best MP4 format.
    const metadata = await ytDlpExec(url, {
      dumpJson: true,
      format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
    });

    // The metadata object contains all video details.
    res.json({
      title: metadata.title,
      description: metadata.description,
      thumbnailUrl: metadata.thumbnail,
      platform: metadata.extractor_key, // e.g., 'Youtube', 'TikTok'
      downloadUrl: metadata.url, // This is often a direct download link
      isValid: true,
    });

  } catch (error) {
    console.error('[Server] Error fetching video data with yt-dlp:', error.message);
    res.status(500).json({ error: 'Failed to fetch video details.' });
  }
  */

  // --- MOCK IMPLEMENTATION FOR DEMONSTRATION ---
  // For demonstration purposes, we'll return mock data with a short delay
  // to simulate a real API call.
  console.log('[Server] Using mock data for demonstration.');
  setTimeout(() => {
    res.json({
      title: "Real Video Title (from Backend)",
      description: "This metadata was fetched from the Node.js server. This demonstrates the full-stack connection. The real implementation would use yt-dlp to get actual data for the video.",
      thumbnailUrl: "https://picsum.photos/seed/backend/560/315", // Different image to show it's from backend
      platform: "Detected (from server)", // Indicate data is from server
      downloadUrl: "#", // Placeholder download link
      isValid: true,
    });
  }, 1000); // 1-second delay
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`UniVideo Downloader server is running on http://localhost:${PORT}`);
});
