'use client';

// import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth, useIsAuthenticated } from '@/context/AuthContext';

export function Navigation() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const { signOut, user, error } = useAuth();

  // Debug output
  console.log('Navigation render - Auth state:', { isAuthenticated, user, error });

  const handleSignOut = async () => {
    try {
      await signOut();
      console.log('Sign out successful');
      router.push('/');
    } catch (error) {
      console.error('Sign out error in navigation:', error);
    }
  };

  const handleSignIn = () => {
    console.log('Navigating to auth page');
    router.push('/auth');
  };

  return (
    <nav className="flex items-center space-x-6">
      <Link
        href={isAuthenticated ? "/generate" : "/auth"}
        className={cn(
          "font-medium text-sm text-gray-600 hover:text-purple-600 transition-colors"
        )}
      >
        Generate Ideas
      </Link>

      {isAuthenticated && (
        <Link
          href="/profile"
          className={cn(
            "font-medium text-sm text-gray-600 hover:text-purple-600 transition-colors"
          )}
        >
          My Projects
        </Link>
      )}

      <Button
        variant="ghost"
        className="text-sm text-gray-600 hover:text-purple-600 transition-colors cursor-pointer"
        onClick={isAuthenticated ? handleSignOut : handleSignIn}
      >
        {isAuthenticated ? "Sign Out" : "Sign In"}
      </Button>
    </nav>
  );
}
