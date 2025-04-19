const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");

const {parseProjectIdeas} = require("./jsonParser.js");

const mime = require("mime-types");

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
  responseModalities: [
  ],
  responseMimeType: "text/plain",
};

async function generateRoadmap(domain, title, description, techStack, projectComplexity, roadmapGranularity) {
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

    const roadmapPrompt = `
    You are a roadmap generator designed to help computer science beginners build interdisciplinary projects. 
    Given a project idea (title + description) and the user's preferences, generate a 9–11 step roadmap that breaks the project into sequential, developer-friendly steps.
    
    Tailor the level of detail in each step according to the \`roadmapGranularity\` preference. 
    If any user preference is \`null\`, simply ignore it while generating the roadmap.
    
    User Input:
    - Domain: ${domain}
    - Idea Topic: ${title}
    - Idea Description: ${description}
    - Preferred Tech Stack: ${techStack}
    - Project Complexity: ${projectComplexity}
    - Roadmap Granularity: ${roadmapGranularity}
    
    Output Format:  
    Return the roadmap as a JSON array of steps, where each step follows this format:
    
    \`\`\`json
    {
      "heading": "Step Title without Step Number",
      "description": "Explanation of what the step involves."
    }
    \`\`\`
    
    Make sure the roadmap flows logically from project setup to final deployment or completion, and aligns with the user's preferences wherever specified.
    `;
    

  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage(userRequest);
  // TODO: Following code needs to be updated for client-side apps.
  const candidates = result.response.candidates;
  for(let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
    for(let part_index = 0; part_index < candidates[candidate_index].content.parts.length; part_index++) {
      const part = candidates[candidate_index].content.parts[part_index];
      if(part.inlineData) {
        try {
          const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`;
          fs.writeFileSync(filename, Buffer.from(part.inlineData.data, 'base64'));
          console.log(`Output written to: ${filename}`);
        } catch (err) {
          console.log("error writing to file");
          console.error(err);
        }
      }
    }
  }
  const responseText = result.response.text()

  // Parse the JSON directly in this function
  try {    
    // Parse the response
    return parseProjectIdeas(responseText, true);
  } catch (error) {
    console.error("Error processing response:", error);
    return {
      success: false,
      error: error.message,
      rawResponse: responseText
    };
  }

  // console.log(result.response.text());
}
  
// /* TEST THE FUNCTION */
// // Use the function with async/await
// (async () => {
//   try {
//     const roadmap = await generateRoadmap(
//       "Platform for Local Music Event Discovery with Personalized Recommendations", 
//       "Create a web platform where users can discover local music events (concerts, festivals, open mics). The platform will aggregate data from various sources (e.g., event APIs, venue websites) and provide personalized recommendations based on the user's stated musical preferences and potentially their location.",
//       "HTML, Next.js, Node.js, Express.js, API for event data (e.g., Ticketmaster API), Geolocation API, Database (MongoDB or PostgreSQL)",
//       "Intermediate", 
//       "High");
//     console.log(JSON.stringify(roadmap, null, 2)); // Pretty print the result
//   } catch (error) {
//     console.error("Error generating roadmap:", error);
//   }
// })();

module.exports = { generateRoadmap };