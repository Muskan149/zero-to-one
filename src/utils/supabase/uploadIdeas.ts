import { supabase } from '@/utils/supabase/supabaseClient';
import { getUserId } from '@/utils/supabase/supabaseClient';
import type { RawProjectIdea } from '@/lib/types';

export async function uploadIdeas (
  ideas: RawProjectIdea[], // Array of ideas from ideaGenerator
  preferenceId: string
) {
  const userId = await getUserId();

  if (!userId) {
    console.error('Invalid user ID');
    throw new Error('User not logged in');
  }

  if (!Array.isArray(ideas)) {
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
