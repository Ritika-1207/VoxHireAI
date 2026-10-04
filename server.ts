import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Google GenAI on the server
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

const SYSTEM_PROMPT = `You are Aria, an executive talent acquisition specialist calling from VoxHire.AI regarding an application for a Software Developer position.
Your voice is warm, sweet, friendly, natural, and professional. You are having a real-time, two-way spoken phone conversation with a candidate.

CONVERSATION RULES:
1. Speak in concise, natural conversational English (1 to 3 short sentences maximum per turn). Because this is a voice call, never speak in long paragraphs or bullet points.
2. Acknowledge what the candidate just said with genuine warmth and natural conversation transitions (e.g., "That sounds wonderful,", "Got it, thanks for sharing that with me,", "I completely understand,").
3. If the candidate asks ANY question (e.g. about company culture, tech stack, salary range, relocation, work from home policy, team size, interview process), answer it clearly, warmly, and honestly before continuing.
   - Company: VoxHire.AI is an AI infrastructure company building autonomous voice systems for enterprise hiring.
   - Tech stack: TypeScript, React, Node.js, Python, PostgreSQL, distributed cloud, and real-time audio systems.
   - Work culture: Hybrid arrangement with hubs in Bangalore and Hyderabad, flexible remote options for high performers.
   - Compensation: Market competitive compensation with stock options and health benefits.
   - Next steps: Quick technical evaluation with the engineering lead, followed by a final team fit discussion.
4. Keep track of everything the candidate has already shared. Never re-ask for details they already gave.
5. Smoothly guide the screening forward when appropriate to cover:
   - Primary technical skills and hands-on projects
   - Current and expected compensation (in LPA)
   - Official notice period or start date
   - Location / hybrid work preference
6. Keep your sentences simple, friendly, and smooth. Avoid robotic phrases like "As an AI assistant" or "My records indicate". Speak naturally and comfortably as a real human talent partner.
7. Output ONLY plain text for direct text-to-speech reading. Do NOT use markdown, asterisks, bullet points, or emoji.`;

// Intelligent fallback response generator if Gemini key is unavailable or fails
function generateSmartFallbackResponse(
  userText: string,
  history: Array<{ speaker: string; text: string }>
): string {
  const text = userText.toLowerCase().trim();
  const historyText = history.map((h) => h.text.toLowerCase()).join(' ');

  // Candidate asking unexpected questions
  if (/\b(tech stack|technologies|tools|languages do you use|stack)\b/i.test(text)) {
    return "Our engineering stack is built on modern TypeScript, React, Node.js, Python, and PostgreSQL, along with real-time audio systems. What programming languages and frameworks do you feel most comfortable with?";
  }

  if (/\b(remote|work from home|hybrid|office|relocate|location|wfh)\b/i.test(text) && (text.includes('?') || /\b(is this|can i|is it|do you offer|policy)\b/i.test(text))) {
    return "We have modern hubs in Bangalore and Hyderabad with a hybrid arrangement, and we also support remote options for strong talent. Would that setup work well for your current situation?";
  }

  if (/\b(what is|what's|tell me|is there|your|can you share)\s*(the\s*)?(salary|budget|ctc|package|compensation|pay|range)\b/i.test(text) || /\b(salary|package|ctc|budget)\s*(range|\?)/i.test(text)) {
    return "Our budget is competitive and depends on experience, typically ranging from 8 to 22 LPA plus equity for software engineers. What are your current and expected numbers in LPA?";
  }

  if (/\b(culture|team|environment|work life|company culture)\b/i.test(text)) {
    return "We have a highly collaborative, fast-paced team with great engineering autonomy and zero micro-management. What kind of engineering culture helps you do your best work?";
  }

  if (/\b(next step|interview process|rounds|what happens next|timeline)\b/i.test(text)) {
    return "After our initial screening today, the next step is a hands-on technical architecture discussion with an engineering lead, followed by a final team conversation. How does that sound?";
  }

  // Small talk / greetings
  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/i.test(text)) {
    return "Hello! It's so nice to speak with you today. Could you tell me a little about your development experience and the technologies you enjoy working with the most?";
  }

  if (/\b(how are you|how's it going|doing today)\b/i.test(text)) {
    return "I'm doing wonderfully, thank you for asking! I'd love to hear a bit about your software development background and what you've been working on lately.";
  }

  // Candidate providing experience details
  if (/\b(react|node|javascript|typescript|python|java|c\+\+|aws|backend|frontend|fullstack|sql|years|experience)\b/i.test(text)) {
    if (!historyText.includes('compensation') && !historyText.includes('salary') && !historyText.includes('lpa')) {
      return "That sounds like solid hands-on experience, thank you for sharing that! What are your current and expected compensation figures in LPA?";
    }
  }

  // Candidate providing salary details
  if (/\b(current|expected|fixed|variable|\d+\s*lpa|\d+\s*to\s*\d+|\d+\s*lakh)\b/i.test(text)) {
    if (!historyText.includes('notice') && !historyText.includes('immediate') && !historyText.includes('join')) {
      return "Got it, that fits within our budget range. And what is your official contractual notice period or earliest availability to start?";
    }
  }

  // Candidate providing notice period details
  if (/\b(notice|days|months|immediate|serving|weeks|available|join|can start)\b/i.test(text)) {
    if (!historyText.includes('bangalore') && !historyText.includes('hyderabad') && !historyText.includes('hybrid')) {
      return "Understood, that timeline works well for our hiring plan. Are you comfortable with our hybrid working model based out of Bangalore or Hyderabad?";
    }
  }

  // Candidate confirming location
  if (/\b(yes|yeah|comfortable|fine|works|okay|sure|agree|no problem|relocate|bangalore|hyderabad|remote)\b/i.test(text)) {
    return "That's wonderful to hear! I've noted down all your details with care. Our engineering team will review the summary and reach out shortly for the next step. Do you have any questions for me before we wrap up?";
  }

  // Candidate providing salary details
  if (/\b(lpa|lakh|current|expected|fixed|variable|package|\d+\s*(to|-)\s*\d+)\b/i.test(text) || /\b\d+\s*lpa\b/i.test(text)) {
    if (!historyText.includes('notice') && !historyText.includes('immediate') && !historyText.includes('available')) {
      return "Got it, that fits well within our compensation expectations. And what is your official contractual notice period or earliest availability to start?";
    }
  }

  // Candidate providing notice period details
  if (/\b(notice|days|months|immediate|serving|weeks|available|join)\b/i.test(text)) {
    if (!historyText.includes('bangalore') && !historyText.includes('hyderabad') && !historyText.includes('hybrid')) {
      return "Understood, that timeline works well for our hiring plan. Are you comfortable with our hybrid working model based out of Bangalore or Hyderabad?";
    }
  }

  // Wrapping up
  if (/\b(no questions|all good|that's all|thank you|thanks|goodbye|bye)\b/i.test(text)) {
    return "Thank you so much for your time today! It was an absolute pleasure speaking with you. Have a wonderful rest of your day!";
  }

  return "Thank you, that's really helpful context! Could you tell me a little more about your earliest availability to join, or any questions you might have about our team?";
}

// Live conversational response endpoint
app.post('/api/chat/respond', async (req: Request, res: Response) => {
  try {
    const { userMessage, history = [] } = req.body;

    if (!userMessage || typeof userMessage !== 'string') {
      res.status(400).json({ error: 'userMessage is required' });
      return;
    }

    // Try calling Gemini if API client is available
    if (aiClient) {
      try {
        // Construct conversation turns for Gemini
        const contents = [];

        // Build prior context (last 6 turns to keep fast and concise)
        const recentHistory = history.slice(-6);
        for (const item of recentHistory) {
          contents.push({
            role: item.speaker === 'ai' ? 'model' : 'user',
            parts: [{ text: item.text }],
          });
        }

        // Add latest user speech
        contents.push({
          role: 'user',
          parts: [{ text: userMessage }],
        });

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.7,
            topP: 0.9,
          },
        });

        const replyText = response.text ? response.text.trim() : '';
        if (replyText) {
          // Clean up any stray markdown formatting for pure speech output
          const cleanText = replyText
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/#/g, '')
            .replace(/`/g, '')
            .trim();

          res.json({ reply: cleanText, source: 'gemini' });
          return;
        }
      } catch (geminiError: any) {
        console.warn('Gemini generateContent error, falling back to smart dialogue:', geminiError?.message || geminiError);
      }
    }

    // Fallback response generator if Gemini call failed or key absent
    const fallbackReply = generateSmartFallbackResponse(userMessage, history);
    res.json({ reply: fallbackReply, source: 'fallback' });
  } catch (err: any) {
    console.error('Error in /api/chat/respond:', err);
    res.status(500).json({
      error: 'Failed to process conversation',
      reply: "Thanks for sharing that! Could you tell me a bit more about your current notice period and availability?",
      source: 'error-fallback',
    });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`VoxHire.AI Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
