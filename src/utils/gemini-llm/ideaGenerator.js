const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const {parseProjectIdeas} = require("./jsonParser.js");

// const fs = require("node:fs");
const mime = require("mime-types");

require('dotenv').config(); // This loads the .env file variables

const apiKey = process.env.GEMINI_API_KEY || "AIzaSyBOog-l8twIwIX5K_jOs7npSGcv094oMw4";

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp-image-generation",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseModalities: [
    "image",
    "text",
  ],
  responseMimeType: "text/plain",
};

async function generateIdeas(domain, nonTechInterests, skills, projectComplexity, roadmapGranularity) {
  const chatSession = model.startChat({
    generationConfig,
    history: [
    ],
  });

  const userRequest = `hey! you are a project idea generator for building interdisciplinary projects for computer science beginners. given a list of user preferences, i need you to generate 6 technical project ideas. the generated ideas should be aligned with the user's preferences.
  if a user preference is null, just ignore that while drafting the ideas.

    preferences:-

    domain of interest: ${domain}
    non-tech interest:  ${nonTechInterests}
    preferred skill stack: ${skills}
    project complexity: ${projectComplexity}

    return a list of ideas in a json format with the key project_ideas. don't write anything outside of the json structure. the generated ideas should have the following structure:
    
    Idea = {'title': string, "description": string, 'tech_stack': Array<string>, 'complexity_level': string, 'roadmap_granularity': ${roadmapGranularity}, 'estimated_duration': string}
    
    the tech_stack key should have a list of technologies that can be used to build the project. the complexity_level key should have one of the following values: 'beginner', 'intermediate', 'advanced'.`;
  
  // console.log("User Request: ", userRequest);
  
  const result = await chatSession.sendMessage(userRequest);
  // TODO: Following code needs to be updated for client-side apps.
//  const candidates = result.response.candidates;
//   for(let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
//     for(let part_index = 0; part_index < candidates[candidate_index].content.parts.length; part_index++) {
//       const part = candidates[candidate_index].content.parts[part_index];
//       if(part.inlineData) {
//         try {
//           const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`;
//           fs.writeFileSync(filename, Buffer.from(part.inlineData.data, 'base64'));
//           console.log(`Output written to: ${filename}`);
//         } catch (err) {
//           console.error(err);
//         }
//       }
//     }
//   } 
    
  // Get the raw text response
  const responseText = result.response.text();
  
  // Parse the JSON directly in this function
  try {    
    // Parse the response
    return parseProjectIdeas(responseText);
  } catch (error) {
    console.error("Error processing response:", error);
    return {
      success: false,
      error: error.message,
      rawResponse: responseText
    };
  }
}

/* TEST THE FUNCTION */
// Use the function with async/await
// (async () => {
//   try {
//     const ideas = await ideaGenerator("data science", "sports", "", "advanced");
//     console.log(JSON.stringify(ideas, null, 2)); // Pretty print the result
//   } catch (error) {
//     console.error("Error generating ideas:", error);
//   }
// })();

module.exports = { generateIdeas };