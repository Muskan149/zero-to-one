import { supabase } from './supabaseClient';

export async function updateProjectSaved(projectId: string, isSaved: boolean) {
  const { data, error } = await supabase
    .from('project_ideas')
    .update({ is_saved: isSaved })
    .eq('id', projectId)
    .select()
    .single();

  if (error) {
    console.error('Error updating project saved status:', error);
    throw error;
  }

  return data;
} 