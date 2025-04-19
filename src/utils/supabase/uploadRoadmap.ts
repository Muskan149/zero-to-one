import { supabase } from '@/utils/supabase/supabaseClient';

interface RoadmapStepInput {
  heading: string;
  description: string;
}

export async function uploadRoadmapToSupabase(
  userId: string,
  ideaId: string,
  projectTitle: string,
  projectDescription: string,
  roadmapSteps: RoadmapStepInput[]
) {
  try {
    // Step 1: Insert into 'roadmaps' table
    const { data: roadmapData, error: roadmapError } = await supabase
      .from('roadmaps')
      .insert([
        {
          user_id: userId,
          idea_id: ideaId,
          title: projectTitle,
          description: projectDescription,
        },
      ])
      .select()
      .single(); // get inserted roadmap with its id

    if (roadmapError || !roadmapData) {
      throw new Error(`Error inserting into roadmaps: ${roadmapError?.message}`);
    }

    const roadmapId = roadmapData.id;

    // Step 2: Prepare steps with reference to the new roadmap ID
    const stepsToInsert = roadmapSteps.map((step, index) => ({
      roadmap_id: roadmapId,
      step_order: index + 1,
      heading: step.heading,
      description: step.description,
    }));

    // Step 3: Insert steps into 'roadmap_step' table
    const { error: stepsError } = await supabase
      .from('roadmap_step')
      .insert(stepsToInsert);

    if (stepsError) {
      throw new Error(`Error inserting roadmap steps: ${stepsError.message}`);
    }

    console.log('Roadmap and steps uploaded successfully!');
    return roadmapId;
  } catch (err) {
    console.error('Upload failed:', err);
    throw err;
  }
}
