// src/components/projects/idea-card.tsx
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectIdea } from '@/lib/types';
import { handleRoadmapGeneration } from '@/components/projects/handleRoadmapGeneration';
import { useRouter } from 'next/navigation';
import { LoadingDots } from '../ui/LoadingDots';
import { useState } from 'react';
import { updateProjectSaved } from '@/utils/supabase/updateProjectSaved';
import { updateRoadmapGenerated } from '@/utils/supabase/updateRoadmapGenerated';
interface IdeaCardProps {
  project: ProjectIdea;
  isGenerating: boolean;
  onGenerateStart: () => void;
  onGenerateEnd: () => void;
}

export function IdeaCard({ project, isGenerating, onGenerateStart, onGenerateEnd }: IdeaCardProps) {
  const router = useRouter();
  const [isLocalGenerating, setIsLocalGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(project.isSaved || false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleGenerateClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault(); // stop automatic navigation
    setIsLocalGenerating(true);
    onGenerateStart();
    try {
      // Generate the roadmap
      const roadmapId = await handleRoadmapGeneration({ ideaId: project.id, router });
      if (!roadmapId) {
        throw new Error('Failed to generate roadmap');
      }

      // Update the project_ideas table to indicate that a roadmap has been generated for the project
      await updateRoadmapGenerated(project.id, roadmapId);
    } finally {
      setIsLocalGenerating(false);
      onGenerateEnd();``
    }
  }

  async function handleSaveClick() {
    setIsSaving(true);
    try {
      await updateProjectSaved(project.id, !isSaved);
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Error updating save status:', error);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-xl text-purple-600">{project.title}</CardTitle>
        {/* { project.techStack } */}
        <div className="flex flex-wrap gap-1 mt-2">
          {project.techStack.map((tag) => (
            <Badge key={tag} variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600">{project.description}</p>
        <div className="mt-4 flex items-center">
          <code className="text-xs bg-gray-100 p-1 rounded">&lt;/&gt; {project.complexityLevel}</code>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm text-gray-500">{project.estimatedDuration}</span>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 gap-2">
        {isGenerating || isLocalGenerating ? (
          <Button 
            className="flex-grow bg-purple-600 hover:bg-purple-700"
            disabled={true}
          > 
              { 
                isLocalGenerating ? 
                  <LoadingDots text="Generating" /> : 
                    <Link href={`/roadmap/${project.id}`}
                        onClick={handleGenerateClick}>
                    Generate Roadmap
                    </Link>
            }
          </Button>
        ) : (
          <Button 
            asChild 
            className="flex-grow bg-purple-600 hover:bg-purple-700"
          >
            <Link href={`/roadmap/${project.id}`}
                  onClick={handleGenerateClick}>
              Generate Roadmap
            </Link>
          </Button>
        )}
        <Button 
          variant="outline" 
          className={`border-purple-200 ${isSaved ? 'bg-purple-700 text-white hover:bg-purple-600 hover:text-white cursor-pointer-' : 'text-purple-600 hover:bg-purple-100'}`}
          onClick={handleSaveClick}
          disabled={isSaving}
        >
          {isSaving ? <LoadingDots text="Saving" /> : isSaved ? 'Saved' : 'Save'}
        </Button>
      </CardFooter>
    </Card>
  );
}