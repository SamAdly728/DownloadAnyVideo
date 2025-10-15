// --- Backend Setup ---
// This server is now intended to run from the 'backend' directory.
// 1. Navigate to 'backend': `cd backend`
// 2. Install dependencies: `npm install` (you will need to add '@google/genai')
// 3. Start the server: `npm start`

const express = require('express');
const cors = require('cors');
// FIX: Import GoogleGenAI for server-side API calls
const { GoogleGenAI } = require('@google/genai');

const app = express();
// Render provides a PORT environment variable.
const PORT = process.env.PORT || 4000;

// FIX: Initialize Gemini AI client on the server
// This securely uses the API key from environment variables.
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set. Please add it to your Render environment variables.");
}
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


// --- Middleware ---
// IMPORTANT: For production, you might want to restrict the origin.
// For now, this allows your Render frontend to call the backend.
app.use(cors());
app.use(express.json());

// --- API Endpoints ---

// FIX: Add a new endpoint to handle Gemini API calls for platform analysis
app.post('/api/analyze-platform', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required.' });
  }

  console.log(`[Server] Received request to analyze platform for URL: ${url}`);

  try {
    const model = 'gemini-2.5-flash';
    // Define the response schema for the AI model
    const schema = {
      type: 'OBJECT',
      properties: {
        platform: {
          type: 'STRING',
          description: "The name of the video platform (e.g., YouTube, TikTok, Instagram, Facebook, Vimeo, X). Should be 'Unknown' if the platform cannot be identified or the URL is invalid.",
        },
        isValid: {
          type: 'BOOLEAN',
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
    res.json(JSON.parse(jsonString));
  } catch (error) {
    console.error('[Server] Error analyzing URL with Gemini API:', error);
    res.status(500).json({ error: 'Failed to analyze URL with AI service.' });
  }
});

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
