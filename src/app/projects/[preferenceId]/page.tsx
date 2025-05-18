// src/app/projects/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { IdeaCard } from '@/components/projects/idea-card';
import { ProjectIdea, SupabaseProjectIdea } from '@/lib/types';
import { fetchIdeasWithId } from '@/utils/supabase/fetchIdeas';
import { useParams } from 'next/navigation';

export default function ProjectIdeasPage() {
  const { preferenceId } = useParams();
  const [projectIdeas, setProjectIdeas] = useState<ProjectIdea[]>([]); // Replace `any` with a proper type later
  const [generatingProjectId, setGeneratingProjectId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const ideas = await fetchIdeasWithId(preferenceId as string);
        console.log("Fetched ideas from Supabase:", ideas);

        const formattedIdeas: ProjectIdea[] = ideas.map((idea: SupabaseProjectIdea, index: number) => ({
          id: idea.id || index.toString(),
          title: idea.title,
          description: idea.description,
          techStack: idea.tech_stack || [],
          complexityLevel: idea.complexity_level,
          estimatedDuration: idea.estimated_duration,
          isSaved: idea.is_saved || false
        }));

        console.log("Formatted project ideas:", formattedIdeas);
        setProjectIdeas(formattedIdeas);
      } catch (error) {
        console.error('Failed to fetch project ideas:', error);
      } 
    };

    if (preferenceId) {
      fetchIdeas();
    }
  }, [preferenceId]);

  useEffect(() => {
    // console.log("Is Something being generated?", isGenerating ? "Yes" : "No");
  }, [generatingProjectId]);
  
  return (
    <div className="max-w-6xl mx-auto">
      {/* <h1 className="text-3xl font-bold text-purple-600 mb-6">Project Ideas</h1> */}
      <p className="text-gray-600 mb-8">
        Browse through these project ideas or generate personalized recommendations based on your skills and interests.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projectIdeas.map((project) => {
          const isThisCardGenerating = generatingProjectId === project.id;
          return (
            <IdeaCard 
              key={project.id} 
              project={project} 
              isGenerating={isThisCardGenerating || isGenerating}
              onGenerateStart={() => {
                setGeneratingProjectId(project.id);
                setIsGenerating(true);
              }}
              onGenerateEnd={() => {
                setGeneratingProjectId(null);
                setIsGenerating(false);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}