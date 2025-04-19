import { RawRoadmapItem, Roadmap, RoadmapItem } from '@/lib/types';
import { supabase } from '@/utils/supabase/supabaseClient'; 

export async function retrieveRoadmapAndSteps(roadmapId: string) {
  const { data, error } = await supabase
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
      estimated_duration
    )
    `)
    .eq('id', roadmapId)
    .single(); // because we expect 1 roadmap per idea
    // .single(); // because we expect 1 roadmap per idea
    

  if (error) {
    console.error('Error retrieving roadmap:', error.message);
    return null;
  } 
  
  console.log('Retrieved roadmap:', data);

  console.log(`
  roadmapId: ${data.id},
    roadmapTitle: ${data.title},
    roadmapDescription: ${data.description},
    steps: ${data.roadmap_step
      ?.sort((a: RawRoadmapItem, b: RawRoadmapItem) => a.step_order - b.step_order)
      .map((step: RawRoadmapItem) => ({
        id: step.id,
        stepOrder: step.step_order,
        heading: step.heading,
        description: step.description,
        estimatedDuration: step.estimated_duration,
        resources: [],
        isCompleted: false
        
      }))}`)

  return {
    roadmapId: data.id,
    roadmapTitle: data.title,
    roadmapDescription: data.description,
    steps: data.roadmap_step
      ?.sort((a: RawRoadmapItem, b: RawRoadmapItem) => a.step_order - b.step_order)
      .map((step: RawRoadmapItem) => ({
        id: step.id,
        stepOrder: step.step_order,
        heading: step.heading,
        description: step.description,
        estimatedDuration: step.estimated_duration,
        resources: [],
        isCompleted: false
      }))
  } as Roadmap;
}
