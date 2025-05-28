import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

import fs from 'fs';
import { checkAllLinks } from './checkLinks.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '../../../.env.local');

dotenv.config({ path: envPath });
dotenv.config()

const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";
const PERPLEXITY_API_KEY = process.env.NEXT_PUBLIC_PPLX_API_KEY;

// // Add debug logging
// console.log("Current working directory:", process.cwd());
// console.log("Environment variables:", process.env);
// console.log("PERPLEXITY_API_KEY: ", PERPLEXITY_API_KEY);

export async function generateLinks(roadmapJSON) {
  if (!PERPLEXITY_API_KEY) {
    throw new Error("Perplexity API key not set in environment variable PPLX_API_KEY");
  }

  const linksGenerationPrompt = (roadmapJSON) => `
I'm giving you a list of steps (enclosed in triple backticks) required to build a technical project.

For each step, provide 3 tutorial/informational links that a beginner can use to complete the given step. For your reference, the links could be from websites like geeksforgeeks, w3schools, youtube, documentation, and the like.

\`\`\`  
${JSON.stringify(roadmapJSON)}
\`\`\`

Return the output as a JSON object with the format:
{
"step_number": [ ("url1", title1"), ("url2", "title2"), ("url3", "title3")], ...
}

  Only return the JSON object — no explanations, no extra text.`

  const prompt = linksGenerationPrompt(roadmapJSON);

  const response = await fetch(PERPLEXITY_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "sonar-pro", 
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1024,
      temperature: 0.3
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const textResponse = data.choices?.[0]?.message?.content;

  if (!textResponse) {
    throw new Error("No response from Perplexity Sonar API");
  }

  // Try to parse the JSON object from the response
  try {
    // Remove any code block markers or extra text
    const jsonMatch = textResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    const jsonString = jsonMatch ? jsonMatch[1] : textResponse;
    const parsedLinks = JSON.parse(jsonString);
    
    // Check all links and return only valid ones
    console.log("Checking validity of generated links...");
    const validLinks = await checkAllLinks(parsedLinks);
    console.log("Link validation complete");
    
    return validLinks;
  } catch (err) {
    throw new Error("Failed to parse Perplexity Sonar response as JSON: " + err);
  }
}

// Dummy roadmapJSON for testing purposes
const roadmapJSON = [
  {
    heading: "Set Up Development Environment",
    description: "Install Node.js, npm, and a code editor like VS Code. Learn basic terminal commands."
  },
  {
    heading: "Initialize Project Repository",
    description: "Create a new GitHub repository and initialize your project with git. Set up a .gitignore file."
  },
  {
    heading: "Design Application Structure",
    description: "Plan the folder structure and main components of your application. Create initial files."
  },
  {
    heading: "Implement Core Functionality",
    description: "Write the main logic for your application. Test core features locally."
  },
  {
    heading: "Add User Interface",
    description: "Develop a simple UI using React. Connect UI to your core logic."
  }
];

console.log("About to generate links");

// Wrap in async IIFE to properly handle the Promise
(async () => {
  try {
    const links = await generateLinks(roadmapJSON);
    console.log("generated links: ", links);

    // Open up a file called linksForRoadmap.txt and add these links
  try {
    fs.writeFileSync('linksForRoadmap.txt', JSON.stringify(links, null, 2), 'utf8');
    console.log("Links written to linksForRoadmap.txt");
  } catch (err) {
    console.error("Failed to write links to file:", err);
  }
  } catch (error) {
    console.error("Error generating links:", error);
  }
})();