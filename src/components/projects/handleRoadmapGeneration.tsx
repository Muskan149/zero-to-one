// import { useRouter, NextRouter } from 'next/router';
import { getUserId, supabase } from '@/utils/supabase/supabaseClient';
import { generateRoadmap } from '@/utils/gemini-llm/roadmapGenerator'; 
import { uploadRoadmapToSupabase } from '@/utils/supabase/uploadRoadmap';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export async function handleRoadmapGeneration({ router, ideaId }: { router: AppRouterInstance, ideaId: string }) {
    try {
    // First, retrieve the project idea from Supabase
      const { data } = await supabase
        .from('project_ideas')
        .select('*')
        .eq('id', ideaId)
        .single();
    
    // Second, generate roadmap using the retrieved idea data
    const roadmapResponse = await generateRoadmap(data.domain, data.title, data.description, data.tech_stack, data.project_complexity, "intermediate"); // call Supabase
    
    const userId = await getUserId() 

    if (!userId) {
        throw new Error('User not logged in or userId is null');
    }

    console.log("roadmapSteps before upload:", roadmapResponse.data)
    
    // Retreieve the roadmap steps from the response
    // const steps = roadmapResponse.data 
    //   .map((step: any) => ({
    //       heading: step.heading,
    //       description: step.description,
    //       estimated_duration: step.estimated_duration,
    //       resources: step.resources,
    //   }));
    
    // Third, upload the generated roadmap to supabase
    const uploadResponse = await uploadRoadmapToSupabase(userId, ideaId, data.title, data.description, roadmapResponse.data);

    if (uploadResponse) {
        const roadmapId = uploadResponse
        // Redirect to the generated roadmap page
        router.push(`/roadmap/${roadmapId}`);
    }
  } catch (error) {
    console.log('Error fetching project idea:', error);
  }
}
