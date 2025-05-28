import { generateLinks } from "./generateLinks.js";

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

async function testGenerateLinks() {
  try {
    console.log("Testing generateLinks...");
    const links = await generateLinks(roadmapJSON);
    console.log("Generated links:", JSON.stringify(links, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

testGenerateLinks(); 