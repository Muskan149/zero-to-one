import { supabase } from '@/utils/supabase/supabaseClient';
import { getUserId } from '@/utils/supabase/supabaseClient';
import type { SupabaseProjectIdea } from '@/lib/types';

export async function uploadIdeasToSupabase (
  ideas: SupabaseProjectIdea[], // Array of ideas from ideaGenerator
  preferenceId: string
) {
  // Get the user ID from the context or auth state
const userId = await getUserId(); // This should be a function that retrieves the user ID from your auth context or Supabase session

  console.log("User ID:", userId);


  if (!userId) {
    console.error('Invalid user ID');
    throw new Error('User not logged in');
  }

  if (!Array.isArray(ideas)) {
    console.error('Ideas must be an array', ideas);
    throw new Error('Ideas must be an array');
  }

  const formattedIdeas = ideas.map(idea => ({
    user_id: userId,
    preference_id: preferenceId,
    title: idea.title,
    description: idea.description,
    tech_stack: idea.tech_stack, // Make sure it's an array or comma-separated string
    complexity_level: idea.complexity_level || null,
    estimated_duration: idea.estimated_duration || null,
    created_at: new Date().toISOString(),
    domain: idea.domain,
    is_saved: false,
  }));

  const { data, error } = await supabase
    .from('project_ideas')
    .insert(formattedIdeas)
    .select();

  if (error) {
    console.error('Error uploading project ideas:', error);
    throw new Error('Failed to upload project ideas');
  }

  console.log("Uploaded project ideas:", data);
  return { data };
}
