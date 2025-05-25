"use server"
import { parseJSONData } from "./jsonParser";
import { getOpenAIClient } from "./openaiClient";
import { roadmapGenerationPrompt } from "./roadmapGenerationPrompt";


export async function generateRoadmap(domain: string, title: string, description: string, techStack: string[], projectComplexity: string, roadmapGranularity: string) {
  const openai = getOpenAIClient();

  // const userRequest = `hey! you are a roadmap generator for building interdisciplinary projects for computer science beginners. given an idea (title and description) and the user's preferences, i need you to generate a 9–11 step roadmap to build the project. 
  
  //   keep the level of detail aligned with the "roadmap granularity" preference of the user. if a user preference is null, just ignore that while drafting the roadmap.

  //   domain: ${domain}
  //   idea topic: ${title}
  //   idea description: ${description}
  //   user's preferred tech stack: ${techStack}
  //   project complexity: ${projectComplexity}
  //   roadmap granularity: ${roadmapGranularity}

  //   return the roadmap steps in a JSON format with the below keys. the generated roadmap should have the following structure:

  //   Step = {'heading': string, description: string}
  //   Return: Array<Step>`;

  const userRequest = roadmapGenerationPrompt(domain, title, description, techStack, projectComplexity, roadmapGranularity);

  try {
    console.log("User request:", userRequest);

    const response = await openai.responses.create({
      model: "gpt-4o",
      input: [
        {
          role: "user",
          content: userRequest,
        },
      ],
      temperature: 0.75,
      max_output_tokens: 2048,
      top_p: 1,
    });
    
    const responseText = response.output_text;

    console.log("Response:", response);

    if (!responseText) {
      throw new Error("No roadmap generation response from OpenAI");
    } 
    
    console.log("Non-parsed response:", responseText);
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
