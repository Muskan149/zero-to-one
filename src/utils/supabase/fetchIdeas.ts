import { supabase } from '@/utils/supabase/supabaseClient';

export async function fetchIdeasWithId(preferenceId: string) {
  const { data, error } = await supabase
    .from('project_ideas')
    .select('*')
    .eq('preference_id', preferenceId);

  if (error) {
    console.error('Error retrieving ideas:', error.message);
    return [];
  }

  return data;
}

export async function fetchAllIdeas(userId: string) {
  const { data, error } = await supabase
    .from('project_ideas')
    .select('*')
    .eq('user_id', userId)
    // .eq('is_saved', true);

  if (error) {
    console.error('Error retrieving saved ideas:', error.message);
    return [];
  }

  return data;
}

export async function fetchedSavedIdeas(userId: string) {
  const { data, error } = await supabase
    .from('project_ideas')
    .select('*')
    .eq('user_id', userId)
    .eq('is_saved', true);

  if (error) {
    console.error('Error retrieving saved ideas:', error.message);
    return [];
  }

  return data;
}