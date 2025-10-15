// --- Backend Setup ---
// This server is now intended to run from the 'backend' directory.
// 1. Navigate to 'backend': `cd backend`
// 2. Install dependencies: `npm install`
// 3. Start the server: `npm start`

const express = require('express');
const cors = require('cors');
// const { ytDlpExec } = require('yt-dlp-exec'); // Uncomment when ready to use yt-dlp

const app = express();
// Render provides a PORT environment variable.
const PORT = process.env.PORT || 4000;

// --- Middleware ---
// IMPORTANT: For production, you might want to restrict the origin.
// For now, this allows your Render frontend to call the backend.
app.use(cors());
app.use(express.json());

// --- API Endpoints ---
app.post('/api/video-details', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'Video URL is required.' });
  }

  console.log(`[Server] Received request for URL: ${url}`);

  // --- MOCK IMPLEMENTATION FOR DEMONSTRATION ---
  console.log('[Server] Using mock data for demonstration.');
  setTimeout(() => {
    res.json({
      title: "Real Video Title (from Render Backend)",
      description: "This metadata was fetched from the Node.js server hosted on Render. This demonstrates the full-stack connection is working in production!",
      thumbnailUrl: "https://picsum.photos/seed/backend/560/315",
      platform: "Detected (from server)",
      downloadUrl: "#",
      isValid: true,
    });
  }, 1000);
});

// --- Health Check Route for Render ---
app.get('/', (req, res) => {
  res.send('UniVideo Downloader backend is running!');
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
