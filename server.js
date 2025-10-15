
const express = require('express');
const cors = require('cors');
const path = require('path');
const { GoogleGenAI, Type } = require('@google/genai');
// const ytdl = require('yt-dlp-exec'); // Uncomment for real implementation

const app = express();
const PORT = process.env.PORT || 4000;

// Securely initialize Gemini AI from server-side environment variables
if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. The AI service will not work. Please add it in Render.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


// --- Middleware ---
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON bodies

// --- API Endpoints ---
app.post('/api/analyze-platform', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required.' });
  }

  if (!process.env.API_KEY) {
    return res.status(503).json({ error: 'AI Service is not configured on the server.' });
  }

  console.log(`[Server] Analyzing platform for URL: ${url}`);
  try {
    const model = 'gemini-2.5-flash';
    const schema = {
      type: Type.OBJECT,
      properties: {
        platform: { type: Type.STRING, description: "The video platform (e.g., YouTube, TikTok, X). 'Unknown' if not identifiable." },
        isValid: { type: Type.BOOLEAN, description: "True if the URL is a valid video platform URL." }
      },
      required: ["platform", "isValid"]
    };
    const prompt = `Analyze the URL and identify the video platform: ${url}. Respond only with a JSON object matching the schema.`;
    
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseMimeType: "application/json", responseSchema: schema },
    });
    
    const jsonString = response.text.trim();
    res.json(JSON.parse(jsonString));
  } catch (error) {
    console.error('[Server] Gemini API Error:', error);
    res.status(500).json({ error: 'Failed to analyze URL with AI service.' });
  }
});

app.post('/api/video-details', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'Video URL is required.' });
  }
  console.log(`[Server] Fetching details for URL: ${url}`);

  // --- MOCK IMPLEMENTATION FOR NOW ---
  console.log('[Server] Using mock data for video details.');
  res.json({
    title: "Video Title (from Unified Server)",
    description: "This metadata was fetched from the Node.js server. The full-stack app is working!",
    thumbnailUrl: "https://picsum.photos/seed/unified/560/315",
    platform: "Detected (Server)", // This will be overwritten by the frontend
    downloadUrl: "#", // Placeholder
    isValid: true,
  });
});

// --- Serve Static Frontend ---
// This serves the built React app from the frontend/dist directory
const buildPath = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(buildPath));

// For any request that doesn't match an API route or a static file,
// send back the main index.html file. This is for client-side routing.
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
