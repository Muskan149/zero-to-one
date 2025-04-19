// supabaseClient.js
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client 
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yvijepeavdbltwhaognp.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2aWplcGVhdmRibHR3aGFvZ25wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1MzU2MDUsImV4cCI6MjA1ODExMTYwNX0.3eHc5SjYU_rn7iQ9uN2qAaYSf_dMj3C467AsJXEt_9o';
console.log(`Supabase URL: ${supabaseUrl}`);
console.log(`Supabase Key: ${supabaseKey}`);

// Create a single instance of the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Signs up a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<{user: object|null, session: object|null, error: Error|null}>}
 */
const signUp = async (email, password) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  return { 
    user: data?.user || null, 
    session: data?.session || null, 
    error 
  };
};

/**
 * Signs in an existing user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<{user: object|null, session: object|null, error: Error|null}>}
 */
const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { 
    user: data?.user || null, 
    session: data?.session || null, 
    error 
  };
};

/**
 * Signs out the current user
 * @returns {Promise<{error: Error|null}>}
 */
const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

/**
 * Gets the current user from the session
 * @returns {Promise<{user: object|null}>}
 */
const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return { user };
};

/**
 * Gets the current user ID from the session
 * @returns {Promise<string|null>} The user ID or null if not authenticated
 */
const getUserId = async () => {
  const { user } = await getCurrentUser();
  return user?.id || null;
};

/**
 * Clears the user ID from localStorage (useful for logout)
 */
const clearUserId = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('temp_user_id');
  }
};

// const signMuskanIn = async () => {
//   const { user, session, error } = await sign("muskanmahajan2004@gmail.com", "netthmvopidliriz");
//   console.log("User:", user);
//   console.log("Session:", session);
//   console.log("Error:", error)
//   return { user, session, error };
// }

module.exports = { supabase, signUp, signIn, signOut, getCurrentUser, getUserId, clearUserId };
