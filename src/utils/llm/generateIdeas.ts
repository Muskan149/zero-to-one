"use server"
import { parseJSONData } from "./jsonParser";
import { getOpenAIClient } from "./openaiClient";

export async function generateIdeas(domain: string, nonTechInterests: string, skills: string, projectComplexity: string, roadmapGranularity: string) {
  
  const openai = getOpenAIClient();

  const userRequest = `hey! you are a project idea generator for building interdisciplinary projects for computer science beginners. given a list of user preferences, i need you to generate 4 technical project ideas. the generated ideas should be aligned with the user's preferences.
  if a user preference is "none"/na, just ignore that while drafting the ideas.

  preferences:-

  domain of interest: ${domain}
  non-tech interest:  ${nonTechInterests ? nonTechInterests : "none"}
  preferred skill stack: ${skills ? skills : "none"}
  project complexity: ${projectComplexity}

  return a list of ideas in a json format with the key project_ideas. don't write anything outside of the json structure. the generated ideas should have the following structure:
  
  Idea = {'title': string, "description": string, 'tech_stack': Array<string>, 'complexity_level': string, 'roadmap_granularity': ${roadmapGranularity}, 'estimated_duration': string, 'domain': ${domain}}

  The "tech_stack" field must be a **strict JSON array of plain strings**, each representing a valid programming language, framework, or tool. Do NOT use "or" as a separator. Do NOT use parentheses.

  the complexity_level key should have one of the following values: 'beginner', 'intermediate', 'advanced'.`;

  try {
    console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

    console.log("Sending request to OpenAI GPT-4o...");

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: userRequest,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const responseText = chatCompletion.choices[0].message.content;

    console.log("GPT-4o response text:", responseText);

    if (!responseText) {
      throw new Error("No idea generation response from OpenAI");
    }
    return parseJSONData(responseText, false)
  } catch (error: any) {
    console.error("Error generating ideas:", error);
    return {
      success: false,
      data: null,
      error: error.message || "Failed to generate ideas"
    };
  }
}
