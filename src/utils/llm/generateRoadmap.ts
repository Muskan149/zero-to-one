"use server"
import { parseJSONData } from "./jsonParser";
import { getOpenAIClient } from "./openaiClient";


export async function generateRoadmap(domain: string, title: string, description: string, techStack: string[], projectComplexity: string, roadmapGranularity: string) {
  const openai = getOpenAIClient();

  const userRequest = `hey! you are a roadmap generator for building interdisciplinary projects for computer science beginners. given an idea (title and description) and the user's preferences, i need you to generate a 9–11 step roadmap to build the project. 
  
    keep the level of detail aligned with the "roadmap granularity" preference of the user. if a user preference is null, just ignore that while drafting the roadmap.

    domain: ${domain}
    idea topic: ${title}
    idea description: ${description}
    user's preferred tech stack: ${techStack}
    project complexity: ${projectComplexity}
    roadmap granularity: ${roadmapGranularity}

    return the roadmap steps in a JSON format with the below keys. the generated roadmap should have the following structure:

    Step = {'heading': string, description: string}
    Return: Array<Step>`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: userRequest,
        },
      ],
      temperature: 0.6,
      max_tokens: 1200,
    });
    const responseText = response.choices[0].message.content;

    if (!responseText) {
      throw new Error("No roadmap generation response from OpenAI");
    } 
    return parseJSONData(responseText, true); 
  } catch (error: any) {
    console.error("Error generating roadmap:", error);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
}
