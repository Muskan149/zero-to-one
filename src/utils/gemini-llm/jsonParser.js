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

module.exports = { parseProjectIdeas, parseProjectRoadmaps };