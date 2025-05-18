// src/context/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from "@/utils/supabase/supabaseClient";

type AuthState = {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
};

type AuthContextType = AuthState & {
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (mounted) {
          console.log('Session loaded:', session?.user ? 'User found' : 'No user');
          setAuthState(prev => ({
            ...prev,
            user: session?.user ?? null,
            loading: false,
          }));
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setAuthState(prev => ({
            ...prev,
            error: error as AuthError,
            loading: false,
          }));
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user ? 'User present' : 'No user');
        
        if (mounted) {
          setAuthState(prev => ({
            ...prev,
            user: session?.user ?? null,
            loading: false,
          }));
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setAuthState(prev => ({
        ...prev,
        user: null,
        error: null,
      }));
    } catch (error) {
      console.error('Sign out error:', error);
      setAuthState(prev => ({
        ...prev,
        error: error as AuthError,
      }));
    }
  };

  if (authState.loading) {
    return <div>Loading auth state...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider 
      value={{
        ...authState,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper hook for checking if user is authenticated
export const useIsAuthenticated = () => {
  const { user } = useAuth();
  return !!user;
};
