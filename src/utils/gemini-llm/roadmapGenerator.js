import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseProjectIdeas } from "./jsonParser.js";
import dotenv from "dotenv";

dotenv.config(); // Load .env variables

const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBOog-l8twIwIX5K_jOs7npSGcv094oMw4";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp-image-generation",
});

const generationConfig = {
  temperature: 1.2,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [],
  responseMimeType: "text/plain",
};

export async function generateRoadmap(domain, title, description, techStack, projectComplexity, roadmapGranularity) {
  const userRequest = `hey! you are a roadmap generator for building interdisciplinary projects for computer science beginners. given an idea (title and description) and the user's preferences, i need you to generate 9-11 step roadmap to build the project. 
  
    keep the level of detail aligned with the "roadmap granularity" preference of the user. if a user preference is null, just ignore that while drafting the roadmap.

    domain: ${domain}
    idea topic: ${title}
    idea description: ${description}
    user's preferred tech stack: ${techStack}
    project complexity: ${projectComplexity}
    roadmap granularity: ${roadmapGranularity}

    return the roadmap steps in a json format with the below keys. the generated roadmap should have the following structure:

    Step = {'heading': string, description: string}
    Return: Array<Step>`;

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(userRequest);

  const responseText = result.response.text();

  try {
    return parseProjectIdeas(responseText, true);
  } catch (error) {
    console.error("Error processing response:", error);
    return {
      success: false,
      error: error.message,
      rawResponse: responseText,
    };
  }
}