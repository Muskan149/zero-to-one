function parseProjectIdeas(responseText, isRoadmap = false) {
  try {
    // Find JSON content (in case there's text around it)
    let jsonContent = responseText;
    
    // Try to find JSON content if wrapped in markdown code blocks or has extra text
    const jsonMatch = responseText.match(/```(?:json)?([\s\S]*?)```/) || 
                     responseText.match(/({[\s\S]*})/);
    
    if (jsonMatch && jsonMatch[1]) {
      jsonContent = jsonMatch[1].trim();
    }
    
    // Parse the JSON
    const parsedData = JSON.parse(jsonContent);
    
    // Extract and validate the project ideas
    if (isRoadmap) {
      if (parsedData) {
        return {
          success: true,
          data: parsedData
        };
      } else {
        throw new Error("Invalid JSON structure: Missing array");
      }
    } 
    
    // Not a roadmap situation
    if (parsedData && parsedData.project_ideas || parsedData.p && Array.isArray(parsedData.project_ideas)) {
      return {
        success: true,
        data: parsedData.project_ideas
      };
    } else {
      throw new Error("Invalid JSON structure: Missing project_ideas array");
    }
  } catch (error) {
    console.error("The input:", responseText);
    console.error("JSON parsing error:", error.message);
    return {
      success: false,
      error: error.message,
      rawResponse: responseText
    };
  }
}

function parseProjectRoadmaps(jsonString) {
  console.log(jsonString)
  const cleanedJsonString = jsonString.replace(/^```json\s+|\s+```$/g, '');
  // console.log(cleanedJsonString);
  try {
    data = JSON.parse(cleanedJsonString);

    if (!data) {
        console.error("Invalid data format");
        return [];
      }

      return data
  } catch (error) {
      console.log(`error parsing the json string: ${error}`)
      return null
  }
}

const projectData =  `{
    "project_ideas": [
      {
        "title": "Collaborative Music Composition Platform",
        "description": "A web application allowing multiple users to collaboratively create and edit musical compositions in real-time. Users can contribute to different parts of a song, add instruments, and arrange sections. The platform will have features for saving, sharing, and version control of musical projects.",
        "tech_stack": ["HTML", "Next.js", "WebSockets", "Tone.js (or similar)", "Backend framework (e.g., Node.js with Express)"],
        "complexity_level": "intermediate",
        "estimated_duration": "3-4 months"
      },
      {
        "title": "Interactive Music Visualizer with User Control",
        "description": "A web-based music visualizer that reacts to uploaded or streaming audio. Users can customize the visual elements (shapes, colors, patterns) through an interactive interface built with Next.js. The project will involve audio processing in the browser and dynamic rendering of graphics.",
        "tech_stack": ["HTML", "Next.js", "Web Audio API", "p5.js (or Three.js)", "Styled Components/CSS Modules"],
        "complexity_level": "intermediate",
        "estimated_duration": "2-3 months"
      },
      {
        "title": "AI-Powered Song Recommendation Engine with Mood Analysis",
        "description": "A web application where users can input their mood or current activity, and an AI model recommends songs based on this input. The frontend will be built with Next.js, allowing users to browse recommendations and play previews. The backend will handle mood analysis (potentially using NLP on text input or audio feature extraction) and song database querying.",
        "tech_stack": ["HTML", "Next.js", "Backend framework (e.g., Python with Flask/Django)", "Machine Learning libraries (e.g., scikit-learn, TensorFlow)", "Music API (e.g., Spotify Web API)"],
        "complexity_level": "intermediate",
        "estimated_duration": "4-5 months"
      },
      {
        "title": "Platform for Musicians to Find Collaborators",
        "description": "A social networking web application connecting musicians based on their genres, instruments, skill levels, and project interests. Users can create profiles, search for collaborators, post project proposals, and communicate with each other. The frontend will be built with Next.js, focusing on user experience and profile management.",
        "tech_stack": ["HTML", "Next.js", "Backend framework (e.g., Node.js with Express)", "Database (e.g., PostgreSQL, MongoDB)", "Authentication and Authorization"],
        "complexity_level": "intermediate",
        "estimated_duration": "3-4 months"
      },
      {
        "title": "Interactive Chord Progression Generator and Player",
        "description": "A web tool that allows users to experiment with different chord progressions. Users can select a key, scale, and then drag and drop chords to build sequences. The application will visually represent the chords and provide audio playback. Next.js will be used for the interactive frontend.",
        "tech_stack": ["HTML", "Next.js", "Tone.js (or similar)", "State management (e.g., Zustand, Redux Toolkit)"],
        "complexity_level": "intermediate",
        "estimated_duration": "2-3 months"
      },
      {
        "title": "Web-Based Synthesizer with Customizable Interface",
        "description": "A digital synthesizer built as a web application. Users can interact with virtual oscillators, filters, envelopes, and other synthesis modules through a customizable user interface created with Next.js. The project will involve using the Web Audio API for sound generation and manipulation.",
        "tech_stack": ["HTML", "Next.js", "Web Audio API", "Styled Components/CSS Modules"],
        "complexity_level": "intermediate",
        "estimated_duration": "3-4 months"
      }
    ]
  }`
  
  // console.log(parseProjectIdeas(projectData));
  // Output: ["Collaborative Music Composition Platform", "Interactive Music Visualizer with User Control"]

  const rawProjectData = 
`\`\`\`json
{
  "project_ideas": [
    {
      "title": "Collaborative Music Composition Platform",
      "description": "A web application allowing multiple users to collaboratively create and edit musical compositions in real-time.",
      "tech_stack": ["HTML", "Next.js", "WebSockets", "Tone.js", "Backend framework (e.g., Node.js with Express)"],
      "complexity_level": "intermediate",
      "estimated_duration": "3-4 months"
    },
    {
      "title": "Interactive Music Visualizer with User Control",
      "description": "A web-based music visualizer that reacts to uploaded or streaming audio.",
      "tech_stack": ["HTML", "Next.js", "Web Audio API", "p5.js", "Styled Components/CSS Modules"],
      "complexity_level": "intermediate",
      "estimated_duration": "2-3 months"
    }
  ]
}
\`\`\``;

// console.log(parseProjectRoadmaps(rawProjectData));

module.exports = { parseProjectIdeas, parseProjectRoadmaps };