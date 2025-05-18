'use client';

import { useEffect, useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { IdeaCard } from '@/components/projects/idea-card';
import { ProjectIdea, SupabaseProjectIdea } from '@/lib/types';
import { fetchedSavedIdeas } from '@/utils/supabase/fetchIdeas';
// import { getUserId } from '@/utils/supabase/supabaseClient';


export default function ProfilePage() {
  
  // const [userId, setUserId] = useState<string | null>(null);
  const [savedProjects, setSavedProjects] = useState<ProjectIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generatingProjectId, setGeneratingProjectId] = useState<string | null>(null);

  // const userId = await getUserId();
  // if (!userId) {
  //   console.error('User not logged in');
  //   return;
  // } setUserId(userId)

  useEffect(() => {
    const fetchSavedProjects = async () => {
      

      try {
        setIsLoading(true);
        // TODO: Replace with actual user ID
        const userId = "47c468ef-43b3-4b3c-abda-6b52a7bf1ce9"
        const savedIdeas = await fetchedSavedIdeas(userId as string);
        console.log("Raw Supabase ideas:", savedIdeas);
        const formattedSavedIdeas: ProjectIdea[] = savedIdeas
          .map((idea: SupabaseProjectIdea, index: number) => ({
            id: idea.id || index.toString(),
            title: idea.title,
            description: idea.description,
            techStack: idea.tech_stack || [],
            complexityLevel: idea.complexity_level,
            estimatedDuration: idea.estimated_duration,
            isSaved: idea.is_saved
          }));
        setSavedProjects(formattedSavedIdeas);
      } catch (error) {
        console.error('Failed to fetch saved projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedProjects();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* <div className="flex justify-center items-center bg-gray-50">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24">
                {user.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                ) : (
                  <AvatarFallback>
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <CardTitle className="text-xl text-center">{user.name}</CardTitle>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-gray-700">{user.bio}</p>
            <Button>Edit Profile</Button>
          </CardContent>
        </Card>
      </div> */}

      <div className="space-y-6">
        {/* <h2 className="text-2xl font-bold text-purple-700 text-center">Saved Projects</h2> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savedProjects.map((project) => (
            <IdeaCard 
              key={project.id} 
              project={project} 
              isGenerating={generatingProjectId === project.id}
              onGenerateStart={() => setGeneratingProjectId(project.id)}
              onGenerateEnd={() => setGeneratingProjectId(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
