// src/components/projects/project-card.tsx
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectIdea } from '@/lib/types';
import { handleRoadmapGeneration } from '@/components/projects/handleRoadmapGeneration';
import { useRouter } from 'next/navigation';

interface ProjectCardProps {
  project: ProjectIdea;
}

export function ProjectCard({ project }: ProjectCardProps) {

  const router = useRouter();

  function handleGenerateClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault(); // stop automatic navigation
    handleRoadmapGeneration({ ideaId: project.id, router });
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
        <Button 
          asChild 
          className="flex-grow bg-purple-600 hover:bg-purple-700"
        >
          <Link href={`/roadmap/${project.id}`}
                    onClick={handleGenerateClick}>
          Generate Roadmap
          </Link>
        </Button>
        <Button 
          variant="outline" 
          className="border-purple-200 text-purple-600"
        >
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}