import { supabase } from './supabaseClient';
/**
 * Updates the project_ideas table to mark a roadmap as generated for a specific project.
 * 
 * @param {string} projectId - The unique identifier of the project idea in the project_ideas table
 * @param {string} roadmapId - The unique identifier of the generated roadmap
 * @returns {Promise<Object>} The updated project data
 * @throws {Error} If the database update operation fails
 */
export async function updateRoadmapGenerated(projectId: string, roadmapId: string) {
  const { data, error } = await supabase
    .from('project_ideas')
    .update({ roadmap_generated: true, roadmap_id: roadmapId })
    .eq('id', projectId)
    .select()
    .single();

  if (error) {
    console.error('Error updating project saved status:', error);
    throw error;
  }

  return data;
} 
