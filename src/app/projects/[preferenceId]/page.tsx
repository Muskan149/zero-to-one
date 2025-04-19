// src/app/projects/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { ProjectCard } from '@/components/projects/project-card';
import { ProjectIdea, RawProjectIdea } from '@/lib/types';
import { retrieveIdeas } from '@/utils/supabase/retrieveIdeas';
import { useParams } from 'next/navigation';

export default function ProjectIdeasPage() {
  const { preferenceId } = useParams();
  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>([]); // Replace `any` with a proper type later
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
    try {
        const ideas = await retrieveIdeas(preferenceId as string); // raw snake_case from Supabase
        console.log("Raw Supabase ideas:", ideas);

        // ✅ format them right here
        const formattedIdeas: ProjectIdea[] = ideas.map((idea: RawProjectIdea, index: number) => ({
          id: idea.id || index.toString(),
          title: idea.title,
          description: idea.description,
          techStack: idea.tech_stack || [],
          complexityLevel: idea.complexity_level,
          estimatedDuration: idea.estimated_duration
        }));

        console.log("Formatted project ideas:", formattedIdeas);
        setProjectIdeas(formattedIdeas);
      } catch (error) {
        console.error('Failed to fetch project ideas:', error);
      } finally {
        setLoading(false);
      }
    };

    if (preferenceId) {
      fetchIdeas();
    }
  }, [preferenceId]);
  
  if (loading) {
    return <div className="text-center">Loading...</div>;
  }
  return (
    <div className="max-w-6xl mx-auto">
      {/* <h1 className="text-3xl font-bold text-purple-600 mb-6">Project Ideas</h1> */}
      <p className="text-gray-600 mb-8">
        Browse through these project ideas or generate personalized recommendations based on your skills and interests.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projectIdeas.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}