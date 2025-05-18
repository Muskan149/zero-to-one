// Import necessary Supabase client
import { ProjectFormData } from '@/lib/types';
// import { createClient } from '@supabase/supabase-js';
// import { v4 as uuidv4 } from 'uuid'; // For generating temporary user IDs
import { getUserId, supabase }  from '@/utils/supabase/supabaseClient'; // Adjust the import based on your project structure
// import { useAuth } from '@/context/AuthContext';

// This function would go in your formSubmission.ts file to replace or extend the existing uploadToSupabase function
export async function uploadUserPreferences(formData: ProjectFormData) {
  // const { user, session, error: signInError } = await signMuskanIn(); // Sign in the user to Supabase
  const userId = await getUserId(); // Get the user ID from Supabase client

  // Check if user_id is valid
  if (!userId) {
      console.error('Invalid user ID');
      throw new Error('User not logged in');
  } else {
    console.log('User ID from context:', userId);
  }
    
  // Prepare data for Supabase insertion
  const userPreferences = {
    user_id: userId, 
    domain: formData.domain,
    non_tech_interest: formData.nonTechInterests.join(', '), // Convert array to string
    skills: formData.skills,
    project_complexity: formData.projectComplexity,
    roadmap_granularity: formData.roadmapGranularity,
  };

  // Insert data into the user_preferences table
  const { data, error } = await supabase
    .from('user_preferences')
    .insert([userPreferences])
    .select().single();

  if (error) {
    console.error('Error saving preferences to Supabase:', error);
    throw new Error('Failed to save preferences');
  }

  return { data };
}