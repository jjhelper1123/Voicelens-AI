import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Increase limit for image uploads
app.use(express.json({ limit: '10mb' }));

// Lazy load Gemini
let genAI: GoogleGenAI | null = null;
function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY env variable is required');
    }
    genAI = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return genAI;
}

// Health check
app.get('/api/health', (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ status: 'error', message: 'API Key missing' });
    }
    res.json({ status: 'ok', message: 'VoiceLens Systems Online' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Systems Offline' });
  }
});

// API Routes
app.post('/api/analyze', async (req, res) => {
  try {
    const { image, mode, context } = req.body;
    const ai = getGenAI();
    
    let promptText = '';
    if (mode === 'ocr') {
      promptText = 'Read all text in this image clearly and naturally. Fix any obvious spelling mistakes or OCR errors (like "v1tamin" to "vitamin") to ensure it sounds correct when read aloud. If it is a medicine bottle, identify the name and dosage. If it is a bill, state the total and due date. Return ONLY the polished text.';
    } else if (mode === 'explain') {
      promptText = `Translate this text into simple, everyday language. If it is legal jargon, medical terminology, or complex paperwork, explain the direct meaning. Example: "Your payment is overdue" instead of "Balance outstanding past due date". 
      
      IMPORTANT: Structure your response exactly like this:
      EXPLAINED: [Your simple explanation here]
      ORIGINAL: [The original complex text here]
      
      Keep it supportive, clear, and very brief.`;
    }

    const imagePart = {
      inlineData: {
        data: image.split(',')[1],
        mimeType: 'image/jpeg',
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: { parts: [imagePart, { text: promptText }] },
    });

    const text = response.text;
    if (!text) {
      console.warn('Gemini returned empty text');
      throw new Error('The AI was unable to find any text in this image. Please try adjusting the lighting or angle.');
    }
    res.json({ text });
  } catch (error: any) {
    console.error('AI Error:', error);
    let message = error.message || 'Unknown error';
    
    let statusCode = 500;
    
    // Create a composite lowercased string of the error to catch status/code/message/JSON fields
    const errorStr = `${message} ${error.status || ''} ${error.code || ''} ${typeof error === 'object' ? JSON.stringify(error) : ''}`.toLowerCase();

    // Handle specific Gemini error codes and statuses
    if (
      errorStr.includes('429') || 
      errorStr.includes('too many requests') || 
      errorStr.includes('quota') || 
      errorStr.includes('exhausted') || 
      errorStr.includes('rate-limit') || 
      errorStr.includes('limit')
    ) {
      message = "Service is currently very busy (Quota reached). Please wait a moment and try again.";
      statusCode = 429;
    } else if (
      errorStr.includes('503') || 
      errorStr.includes('service unavailable') || 
      errorStr.includes('overloaded') || 
      errorStr.includes('unavailable') || 
      errorStr.includes('demand') || 
      errorStr.includes('temporary')
    ) {
      message = "The reading assistant is currently experiencing high demand. Please try again in 30 seconds.";
      statusCode = 503;
    } else if (errorStr.includes('api_key') || errorStr.includes('apikey')) {
      message = "Settings error: The AI key is missing. Please contact support or check your app settings.";
    } else if (errorStr.includes('deadline') || errorStr.includes('timeout')) {
      message = "The connection timed out. Please check your internet and try again.";
    }

    res.status(statusCode).json({ error: message });
  }
});

async function startServer() {
  // Check for API key on startup
  if (!process.env.GEMINI_API_KEY) {
    console.warn('WARNING: GEMINI_API_KEY is not set. AI features will be disabled.');
  }

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VoiceLens AI running at http://localhost:${PORT}`);
  });
}

startServer();
