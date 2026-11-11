// Server only: Google Gemini client shared by /api/chat and /api/solar-advice.
// The key comes from GEMINI_API_KEY (never NEXT_PUBLIC_), so it is never sent to the browser.
// Import this only from route handlers.
import { GoogleGenAI, ThinkingLevel, type GenerateContentConfig } from "@google/genai";

/** Override with GEMINI_MODEL in .env.local or Vercel to try another Gemini model. */
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";

export const hasGeminiKey = () => Boolean(process.env.GEMINI_API_KEY);

let client: GoogleGenAI | null = null;
export function gemini() {
  client ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
}

/**
 * Minimal thinking makes the first words arrive fastest, which matters most for a chat widget.
 * If answers feel too shallow, try ThinkingLevel.LOW. Remove thinkingConfig if you switch
 * GEMINI_MODEL to a model that does not support thinking levels.
 */
export const baseConfig: GenerateContentConfig = {
  thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
};
