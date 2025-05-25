// src/app/page.tsx
'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useIsAuthenticated } from '@/context/AuthContext';
import { ProcessSteps } from '@/components/ui/process-steps';
import { RotatingProjects } from '@/components/ui/rotating-projects';

export default function Home() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[70vh] text-center">
      <RotatingProjects />
    <h1 className="text-6xl font-bold text-purple-600 mb-4 font-sans">ZeroToOne</h1>
    <p className="text-lg text-gray-700 max-w-2xl mb-8">
      Highly Personalized Roadmaps for your First Tech Project<br/>
      {/* GenAI-powered Coding done <b>right</b> */}
    </p>
      <div className="flex gap-4 mb-8">
        <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 px-8 py-8 text-md">
          <Link href={isAuthenticated ? "/generate" : "/auth"}>
            Start Your Journey
          </Link>
        </Button>
      </div>
      <ProcessSteps />
    </div>
  );
}
