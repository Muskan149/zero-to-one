export type ParsedResult<T> = {
  success: boolean;
  data: T | null;
  error: string | null;
}

export function parseJSONData(responseText: string, isRoadmap = false): ParsedResult<any> {
  try {
    let jsonContent = responseText;
    
    const jsonMatch =
      responseText.match(/```(?:json)?([\s\S]*?)```/) ||
      responseText.match(/({[\s\S]*})/);

    if (jsonMatch?.[1]) {
      jsonContent = jsonMatch[1].trim();
    }

    const parsedData = JSON.parse(jsonContent);

    if (isRoadmap) {
      return { success: true, data: parsedData, error: null };
    }

    const ideas = parsedData?.project_ideas

    if (Array.isArray(ideas)) {
      return { success: true, data: ideas, error: null};
    }

    throw new Error("Invalid structure: missing 'project_ideas'");
  } catch (err: any) {
    return {
      success: false,
      data: null,
      error: err.message,
    };
  }
}
