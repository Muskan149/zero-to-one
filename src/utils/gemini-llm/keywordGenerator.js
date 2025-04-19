const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  const fs = require("node:fs");
  const mime = require("mime-types");

const { parseProjectIdeas } = require("./jsonParser.js");
  
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
    responseModalities: [
    ],
    responseMimeType: "text/plain",
  };

async function keywordGenerator(roadmapJSON) {

    // const keywordGenPrompt = `i am giving you a list of steps, enclosed by 3 backticks, required to build a technical projec. for each step, generate a list of short queries i can make on google/youtube to learn how to perform the step.  
    
    //   \`\`\`
    //   ${roadmapJSON}
    //   \`\`\`
      
    //   return a json output with key step_number pointing to a list of 2-3 queries 
      
    //   don't return anything outside of the json`;

//     const keywordGenPrompt = `I’m giving you a list of steps (enclosed in triple backticks) that are required to build a technical project. 

//   For each step, generate 2–3 short and effective search queries that a beginner can use on Google or YouTube to learn how to complete that step.

// \`\`\`
// ${roadmapJSON}
// \`\`\`

// Return the output as a JSON object with the format:
// {
//   "step_number": [ "query1", "query2", ... ]
// }

// Only return the JSON object — no explanations, no extra text.`;

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
      history: [
      ],
    });
    
  const result = await chatSession.sendMessage(keywordGenPrompt);
  textResponse = result.response.text();
  textResponse = parseProjectIdeas(textResponse, true);   

  try {
    fs.writeFileSync("keywordOutpu3t.txt", JSON.stringify(textResponse, null, 2), "utf-8");
    console.log("Output written to output.txt");
    return textResponse
  } catch (err) {
    console.error("Error writing to file:", err);
  }
}


const roadmapJSON = `
  {
    "success": true,
    "data": [
      {
        "heading": "1. Project Setup and API Key Acquisition",
        "description": "Set up your Next.js project with TypeScript. Initialize necessary directories (e.g., components, pages, API). Obtain API keys for your chosen event data API (e.g., Ticketmaster API). Also, acquire an API key for a Geolocation service if you plan to use user location for recommendations."
      },
      {
        "heading": "2. Database Schema Design and Implementation",
        "description": "Design the database schema for storing event information (name, venue, date, time, artists, genres, location) and user profiles (preferences, location history). Choose either MongoDB or PostgreSQL based on your preference and create the necessary tables/collections and models using an ORM like Prisma or Mongoose."
      },
      {
        "heading": "3. Event Data Aggregation and Storage (Backend)",
        "description": "Develop the backend (Node.js with Express.js) to fetch event data from the chosen API(s). Implement error handling and pagination. Transform the API data to match your database schema. Implement scheduled jobs or event-driven architecture (e.g., using a message queue) to regularly update the event data in your database."
      },
      {
        "heading": "4. Geolocation Integration (Backend)",
        "description": "Integrate the Geolocation API into your backend to convert addresses to geographic coordinates (latitude and longitude). This will be used for finding events within a user's specified radius. Implement caching mechanisms to reduce API calls and improve performance."
      },
      {
        "heading": "5. User Authentication and Preference Management (Backend)",
        "description": "Implement user authentication (registration, login, logout) using a library like Passport.js or NextAuth.js. Develop API endpoints to allow users to manage their musical preferences (genres, artists) which are stored in the database. Store user preferences securely."
      },
      {
        "heading": "6. Personalized Recommendation Engine (Backend)",
        "description": "Implement the recommendation engine.  Develop an algorithm that uses the user's preferences and location to rank events. Consider factors like genre match, artist popularity, venue popularity, and distance. Implement different recommendation strategies (e.g., content-based filtering, collaborative filtering) and A/B test them to optimize performance."
      },
      {
        "heading": "7. Frontend Development (Event Display and Filtering)",
        "description": "Develop the frontend using Next.js and HTML/CSS. Create components to display event listings. Implement filtering options (by genre, date, location). Use a mapping library (e.g., Leaflet or Google Maps API) to visualize event locations on a map. Implement responsive design for different screen sizes."
      },
      {
        "heading": "8. Frontend Development (User Profile and Preferences)",
        "description": "Develop the user profile section of the frontend. Allow users to view and edit their preferences. Integrate with the backend API endpoints for managing user authentication and preferences. Display personalized event recommendations on the user's profile page."
      },
      {
        "heading": "9. Testing, Deployment, and Monitoring",
        "description": "Thoroughly test the platform's functionality, performance, and security. Use tools like Jest and Cypress for unit and integration testing. Deploy the application to a hosting platform like Vercel or Netlify. Set up monitoring and logging to track application performance and identify potential issues. Consider using tools like Sentry for error tracking."
      }
    ]
  }
  `

keywordGenerator(roadmapJSON);