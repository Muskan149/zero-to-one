// src/app/generate/page.tsx
'use client';

import { ProjectGeneratorForm } from '@/components/forms/project-generator-form';

export default function GeneratePage() {
  return (
    <div className="max-w-5xl">
      {/* <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center">Generate Project Ideas</h1> */}
      <p className="text-gray-600 text-medium mt-4 mb-8 text-left">
        Fill out the form below to generate personalized project ideas based on your skills, interests, and career goals.
      </p>
      <ProjectGeneratorForm />
    </div>
  );
}