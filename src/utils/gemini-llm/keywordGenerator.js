import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseProjectIdeas } from "./jsonParser.js";

const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBOog-l8twIwIX5K_jOs7npSGcv094oMw4";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-thinking-exp-01-21",
});

const generationConfig = {
  temperature: 0.95,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 65536,
  responseModalities: [],
  responseMimeType: "text/plain",
};

export async function keywordGenerator(roadmapJSON) {
  const keywordGenPrompt = `I’m giving you a list of steps (enclosed in triple backticks) that are required to build a technical project. 

For each step, generate 2–3 search queries that a beginner can use on Google or YouTube to learn how to complete that step.

\`\`\`
${roadmapJSON}
\`\`\`

Return the output as a JSON object with the format:
{
  "step_number": [ "query1", "query2", ... ]
}

Only return the JSON object — no explanations, no extra text.`;

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(keywordGenPrompt);
  let textResponse = result.response.text();
  textResponse = parseProjectIdeas(textResponse, true);

  try {
    return textResponse;
  } catch (err) {
    console.error("Error writing to file:", err);
  }
}

// const roadmapJSON = `
// {
//   "success": true,
//   "data": [
//     {
//       "heading": "1. Project Setup and API Key Acquisition",
//       "description": "Set up your Next.js project with TypeScript..."
//     },
//     {
//       "heading": "2. Database Schema Design and Implementation",
//       "description": "Design the database schema for storing event information..."
//     }
//     // ... continued as in your original example
//   ]
// }
// `;

// keywordGenerator(roadmapJSON);
