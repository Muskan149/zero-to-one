import { SupabaseRoadmapItem, Roadmap } from '@/lib/types';
import { supabase } from '@/utils/supabase/supabaseClient'; 

// Fetches roadmap from Supabase with links to articles and videos
export async function fetchRoadmap(roadmapId: string) {
  try {
  console.log("Fetching roadmap called with ID:", roadmapId);
  const { data: roadmapData, error } = await supabase
    .from('roadmaps')
    .select(`
      id,
      title,
      description,
      roadmap_step (
      id,
      step_order,
      heading,
      description,
      estimated_duration,
      articles,
      videos
    )
    `)
    .eq('id', roadmapId)
    .single(); // because we expect 1 roadmap per idea    

  if (error) {
    console.error('Error retrieving roadmap:', error.message);
    return null;
  } 
  
  console.log('Retrieved roadmap:', roadmapData);

  const roadmapJson = {
    "roadmapId": roadmapData.id,
    "roadmapTitle": roadmapData.title,
    "roadmapDescription": roadmapData.description,
    "steps": roadmapData.roadmap_step
      ?.sort((a: SupabaseRoadmapItem, b: SupabaseRoadmapItem) => a.step_order - b.step_order)
      .map((step: SupabaseRoadmapItem) => ({
            id: step.id,
            stepOrder: step.step_order,
            heading: step.heading,
            description: step.description,
            estimatedDuration: step.estimated_duration,
            isCompleted: false,
            articles: step.articles,
            videos: step.videos
        }))}

  return roadmapJson as Roadmap; 

} catch (error) {
    console.error('Error retrieving roadmap:', error);
    return null;
  }
} 
