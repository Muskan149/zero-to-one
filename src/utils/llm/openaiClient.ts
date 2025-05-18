// src/lib/openai.ts
import OpenAI from "openai";

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("❌ Missing OPENAI_API_KEY in environment variables.");
  }

  return new OpenAI({ apiKey });
}
