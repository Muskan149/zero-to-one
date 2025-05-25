// export const roadmapGenerationPrompt = (domain: string, title: string, description: string, techStack: string[], projectComplexity: string, roadmapGranularity: string) => `
// Hey! You are a roadmap generator for building interdisciplinary projects for computer science beginners. 

// Given an idea (title and description) and the user's preferences, generate a 10 step roadmap to build the project.

// **IMPORTANT:** Make the roadmap as beginner-friendly and actionable as possible. For each step, break it down into 3–5 clear, granular sub-tasks (without the step number) or instructions. For example, instead of "Set up backend", write out the high level instructions a beginner would need to follow and 
// tools/libraries to use.

// For each step, include:
// - Required tools, librariess (with versions if relevant)
// - Explanations of what and why (in beginner-friendly language)
// - Validation criteria (how to check if the step is complete)
// - Common pitfalls or troubleshooting tips

// If a user preference is null, just ignore that while drafting the roadmap.

// Here are the project details:
// - Domain: ${domain}
// - Idea topic: ${title}
// - Idea description: ${description}
// - User's preferred tech stack: ${techStack}
// - Project complexity: ${projectComplexity}
// - Roadmap granularity: ${roadmapGranularity}

// **Output:**  
// Return the roadmap steps in a JSON array, where each step is an object with the following keys:
// - "heading": string (the step title)
// - "description": string (detailed, actionable instructions and explanations)

// Example step:
// {
//   "heading": "Set Up Node.js Environment",
//   "description": "Download Node.js LTS from https://nodejs.org/en/download/ and install it. Open your terminal and run 'node -v' to verify the installation. Create a new project folder using 'mkdir my-app' and navigate into it with 'cd my-app'."
// }

// Return: Array<Step>
// `

export const roadmapGenerationPrompt = (domain: string, title: string, description: string, techStack: string[], projectComplexity: string, roadmapGranularity: string) => `
Hey! You are a roadmap generator for building interdisciplinary projects for computer science beginners. 

Given an idea (title and description) and the user's preferences, generate a 10 step roadmap to build the project.

**IMPORTANT:** Make the roadmap as beginner-friendly and actionable as possible. For each step, break it down into 3–5 clear, granular sub-tasks (without the step number) or instructions. For example, instead of "Set up backend", write out the high level instructions a beginner would need to follow and 
tools/libraries to use.

For each step, include:
- High level instructions 
- Required tools, librariess (with versions if relevant)
- Explanations of what and why
- Common pitfalls or troubleshooting tips
- DO NOT include any step numbers 

If a user preference is null, just ignore that while drafting the roadmap.

Here are the project details:
- Domain: ${domain}
- Idea topic: ${title}
- Idea description: ${description}
- Tech stack: ${techStack}
- Project complexity: ${projectComplexity}
- Roadmap granularity: ${roadmapGranularity}

**Output:**  
Return the roadmap steps in a JSON array, where each step is an object with the following keys:
- "heading": string (the step title)
- "description": string (detailed, actionable instructions and explanations)

Return: Array<Step>
`
