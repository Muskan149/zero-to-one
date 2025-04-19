// src/lib/formHandlers.ts
// import { AppRouterInstance } from 'next/navigation';
import type { ProjectFormData } from '@/lib/types';
import { uploadUserPreferences } from "../../utils/supabase/uploadUserPreferences";
import { generateIdeas } from '@/utils/gemini-llm/ideaGenerator';
import { uploadIdeas } from '../../utils/supabase/uploadIdeas';

type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T>>;

export const handleFormSubmit = (
  formData: ProjectFormData,
  router: { push: (url: string) => void },
  setIsLoading: SetStateFunction<boolean>,
  setError: SetStateFunction<string | null>
) => {
  return async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {

      // const userId = "1fffad0a-4294-4d10-b1fb-4e42e300d0e9"; 

      // First, save preferences to Supabase
      const response = await uploadUserPreferences(formData);
      const data = response.data
      const preferenceId = data.id

      console.log("preferences id:", preferenceId);

      // Next, generate ideas using the ideaGenerator function
      try {
        const ideas = await generateIdeas(data.domain, data.non_tech_interest, data.skills, data.project_complexity, data.roadmap_granularity)
        console.log("Generated project ideas:", ideas.data);

        // Next, upload ideas using uploadIdeas
        const ideaUploadResponse = await uploadIdeas(ideas.data, preferenceId)
        const uploadedIdeas = ideaUploadResponse.data
      
        console.log("Uploaded project ideas to Supabase:", uploadedIdeas);

        router.push(`projects/${preferenceId}`);

      } catch (error) {
          console.error("Error generating project ideas:", error);
          throw error;
      };
    } catch (err) {
      setError("Failed to save preferences or generate project ideas. Please try again.");
      console.error("Error in form submission:", err);
    } finally {
      setIsLoading(false);
    };
  }
}