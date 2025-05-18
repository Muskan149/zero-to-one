// src/app/page.tsx
'use client'

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useIsAuthenticated } from '@/context/AuthContext';

export default function Home() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <h1 className="text-4xl font-bold text-purple-600 mb-4">ZeroToOne</h1>
      <p className="text-lg text-gray-700 max-w-2xl mb-8">
        Highly Personalized Roadmaps for your First Tech Project<br/> GenAI-powered Coding done <b>right</b>
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
          <Link href={isAuthenticated ? "/generate" : "/auth"}>
            Get Started
          </Link>
        </Button>
      </div>
    </div>
  );
}
