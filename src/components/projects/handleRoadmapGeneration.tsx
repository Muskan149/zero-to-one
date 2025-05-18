// import { useRouter, NextRouter } from 'next/router';
import { getUserId, supabase } from '@/utils/supabase/supabaseClient';
import { generateRoadmap } from '@/utils/llm/generateRoadmap'; 
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { generateLinksForRoadmap } from '@/utils/llm/generateLinksForRoadmap';
import { uploadRoadmapToSupabase } from '@/utils/supabase/uploadRoadmap';

export async function handleRoadmapGeneration({ router, ideaId }: { router: AppRouterInstance, ideaId: string }) {
    try {
        // Fetch the project idea from Supabase
        console.log("About to retrieve the idea from Supabase...")
        const { data, error: fetchError } = await supabase
            .from('project_ideas')
            .select('*')
            .eq('id', ideaId)
            .single();
        
        if (fetchError) throw fetchError;
        if (!data) throw new Error('Project idea not found');
        
        // Generate roadmap using the fetched idea 
        console.log("About to generate roadmap")

        const roadmap = await generateRoadmap(data.domain, data.title, data.description, data.tech_stack, data.project_complexity, "intermediate");
        if (!roadmap || !roadmap.success) {
            throw new Error(`Failed to generate roadmap: ${roadmap?.error || 'Unknown error'}`);
        }

        const roadmapData = roadmap.data;
        if (!roadmapData) {
            throw new Error('Roadmap data is empty');
        }

        const userId = await getUserId();
        if (!userId) {
            throw new Error('User not logged in or userId is null');
        }

        // Generate links for the roadmap
        console.log("Generating links for the roadmap");
        const roadmapWithLinks = await generateLinksForRoadmap(roadmapData);
        
        if (!roadmapWithLinks || roadmapWithLinks.length == 0) {
            throw new Error('Failed to generate or no links were found for the roadmap', { cause: roadmap.error });
        }

        console.log("About to upload the roadmap to supabase...")
        // Upload the generated roadmap to supabase, returns roadmapId
        const roadmapId = await uploadRoadmapToSupabase(userId, ideaId, data.title, data.description, roadmapWithLinks);

        if (!roadmapId) {
            throw new Error('Failed to upload roadmap');
        }

        // Redirect to the generated roadmap page
        router.push(`/roadmap/${roadmapId}`);
        return roadmapId;
    } catch (error) {
        console.error('Error in roadmap generation:', error);
        throw error; 
    }
}
