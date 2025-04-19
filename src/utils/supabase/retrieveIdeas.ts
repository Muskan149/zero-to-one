// utils/retrieveIdeas.ts

import { supabase } from '@/utils/supabase/supabaseClient'; // Adjust the import based on your project structure

export async function retrieveIdeas(preferenceId: string) {
  const { data, error } = await supabase
    .from('project_ideas')
    .select('*')
    .eq('preference_id', preferenceId);

  if (error) {
    console.error('Error retrieving ideas:', error.message);
    return [];
  }
  console.log("Data retrieved from Supabase:", data);
  return data;
}
