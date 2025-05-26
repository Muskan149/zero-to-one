"use server"
// import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseJSONData } from "./jsonParser";
import { getOpenAIClient } from "./openaiClient";

// const generationConfig = {
//   temperature: 0.95,
//   topP: 0.95,
//   topK: 64,
//   maxOutputTokens: 65536,
//   responseModalities: [],
//   responseMimeType: "text/plain",
// };


export async function keywordGenerator(roadmapJSON: any) {
  const openai = getOpenAIClient();

  const keywordGenPrompt = `I’m giving you a list of steps (enclosed in triple backticks) that are required to build a technical project. 

For each step, generate 2–3 search queries that a beginner can use on Google or YouTube to learn how to complete that step.

\`\`\`
${JSON.stringify(roadmapJSON)}
\`\`\`

Return the output as a JSON object with the format:
{
  "step_number": [ "query1", "query2", ... ]
}

Only return the JSON object — no explanations, no extra text.`;

  console.log("Prompt for keywordGeneration: ", keywordGenPrompt);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: keywordGenPrompt,
        },
      ],
      temperature: 0.5,
      max_tokens: 800,
    });

    const textResponse = response.choices[0].message.content;

    if (!textResponse) {  
      throw new Error("No keyword generation response from OpenAI");
    }

    return parseJSONData(textResponse, true); 
}