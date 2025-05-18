// src/app/roadmap/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RoadmapItem } from '@/components/roadmap/roadmap-item';
import type { Roadmap} from '@/lib/types';
import { fetchRoadmap } from '@/utils/supabase/fetchRoadmap';

export default function RoadmapPage() {

  // First retrieve roadmapId
  const params = useParams();
  const roadmapId = params.roadmapId as string;
  console.log(`here is the roadmap id: ${roadmapId}`)

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    console.log("use effect in action")
    const fetchRoadmapOnLoad = async () => {
      try {
        const roadmapAndSteps = await fetchRoadmap(roadmapId); // raw snake_case from Supabase
        if (roadmapAndSteps) {
          setRoadmap(roadmapAndSteps);
          console.log("roadmapAndSteps:", roadmapAndSteps)
        }
      } catch (error) {
        console.error('Failed to fetch project ideas:', error);
      } finally {
        setLoading(false);
      }
  };
  console.log("abt to run fetch")
  fetchRoadmapOnLoad();
  console.log("finished running fetch")

  }, [roadmapId]);

  if (!roadmap) {
    return <p className="text-center mt-8 text-gray-500">No roadmap found.</p>;
  }

  if (loading) {
    return <p className="text-center mt-8 text-gray-500">Loading roadmap...</p>;
  }

  const progress = Math.round(
    (roadmap.steps.filter((item) => item.isCompleted).length / roadmap.steps.length) * 100
  );

  const handleToggleComplete = (id: string) => {
    setRoadmap((prev) =>
      prev
        ? {
            ...prev,
            steps: prev.steps.map((item) =>
              item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
            ),
          }
        : null
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-purple-600 mb-2">Project Roadmap</h1>
      <h2 className="text-xl text-gray-700 mb-6">{roadmap.roadmapTitle}</h2>
      <p className="text-gray-600 mb-4">{roadmap.roadmapDescription}</p>
      
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-600 h-2 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="mb-6 flex justify-between steps-center">
        <h3 className="text-xl font-semibold text-gray-800">Roadmap Steps</h3>
        <Button 
          variant="outline" 
          className="text-purple-600 border-purple-200 hover:bg-purple-100 hover:text-purple-600"
          onClick={() => window.print()}
        >
          Download Roadmap
        </Button>
      </div>
      
      <div className="space-y-4">
        {roadmap.steps.map((item) => (
          <RoadmapItem 
            key={item.id} 
            item={item} 
            onToggleComplete={handleToggleComplete} 
          />
        ))}
      </div>
      
      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
        <p className="text-gray-600 mb-4">
          If you&apos;re stuck or need guidance with this project, consider reaching out to the community:
        </p>
        <div className="flex gap-3">
          <Button variant="outline">Join Discord</Button>
          <Button variant="outline">Contact Us</Button>
        </div>
      </div>
    </div>
  );
}