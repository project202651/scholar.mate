# -*- coding: utf-8 -*
-import os, sys

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content.strip() + '\n')
    print(f'Successfully wrote: {path}')
gemini_code = r''''import { GoogleGenAI } from "@google/genai";

function getGenAIClient(customApiKey?: string) {
  const key = (customApiKey || process.env.GEMINI_API_KEY || "").trim();
  if (key && key.length > 5) {
    return { client: new GoogleGenAI({ apiKey: key }), key };
  }
  return null;}

const CANDIDATE_MODELS = ["gemini-3.6-flash", "gemini-3.5-flash-lite", "gemini-3.1-pro-preview"];

export function safeJsonParse(rawText: string) {
  const cleaned = rawText.replace(/```json/gi, "").replace(/```/gi, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    try {
      const sanitized = cleaned.replace(/\\(?![/u"bfnrt\\\/])/g, "\\\\");
      return JSON.parse(sanitized);
    } catch {
      const firstBrace = cleaned.indexOf("{");
      const firstBracket = cleaned.indexOf("[");
      if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
        const lastBrace = cleaned.lastIndexOf("}");
        if (lastBrace !== -1) {
          const slice = cleaned.slice(firstBrace, lastBrace + 1);
          return JSON.parse(slice);
        }
      } else if (firstBracket !== -1) {
        const lastBracket = cleaned.lastIndexOf("]");
        if (lastBracket !== -1) {
          const slice = cleaned.slice(firstBracket, lastBracket + 1);
          return JSON.parse(slice);
        }
      }
      throw new Error("unable to parse");
    }
  }
}

export async function askGemini(prompt: string, context?: string, customKey?: string): Promise<string> {
  const instance = getGenAIClient(customKey);
  if (!instance) return getHeuristicChatAnswer(prompt);

  const { client } = instance;
  const fullPrompt = context
    ? `You are Nexa 2.0, the Intelligent AI Exam Coach for ScholarMate 2.0. Student Question: ${prompt} \n Material: ${context}`
    : `You are Nexa 2.0, the Intelligent AI Exam Coach for ScholarMate 2.0. Student Question: ${prompt}`;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await client.models.generateContent({ model, contents: fullPrompt });
      if (response.text) return response.text;
    } catch (err) {
      console.warn('Model ' + model + ' failed');
    }
  }

  return getHeuristicChatAnswer(prompt);
}

