export type ParsedResult<T> = {
  success: boolean;
  data: T | null;
  error: string | null;
}

export function parseJSONData(responseText: string, isRoadmap = false): ParsedResult<any> {

  console.log("Response text:", responseText);
  
  try {
    let jsonContent = responseText.trim();

    // If wrapped in triple backticks (```json ... ```), extract the content
    if (jsonContent.startsWith("```")) {
      const match = jsonContent.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
      if (match?.[1]) {
        jsonContent = match[1].trim();
      } else {
        throw new Error("Failed to extract JSON from markdown code block");
      }
    }

    const parsedData = JSON.parse(jsonContent);

    if (isRoadmap) {
      return { success: true, data: parsedData, error: null };
    }

    const ideas = parsedData?.project_ideas;

    if (Array.isArray(ideas)) {
      return { success: true, data: ideas, error: null };
    }

    return { success: true, data: parsedData, error: null };
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message,
    };
  }
}