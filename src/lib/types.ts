// src/lib/types.ts
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type RawProjectIdea = {
  id?: string;
  title: string;
  description: string;
  tech_stack?: string[];
  complexity_level: string;
  estimated_duration: string;
};


export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  complexityLevel: string;
  estimatedDuration: string;
}

export interface RawRoadmapItem {
  id: string;
  step_order: number;
  heading: string;
  description: string;
  estimated_duration: string;
}

export interface RoadmapItem {
  id: string;
  stepOrder: number;
  heading: string;
  description: string;
  estimatedDuration: string;
  resources: {
    type: 'video' | 'article';
    title: string;
    url: string;
  }[];
  isCompleted: boolean;
}

export interface Roadmap {
  roadmapId: string;
  roadmapTitle: string;
  roadmapDescription: string
  steps: RoadmapItem[];
}

export interface ProjectFormData {
  domain: string;
  skills: string[];
  nonTechInterests: string[];
  // dreamRole: string;
  projectComplexity: 'beginner' | 'intermediate' |'advanced'
  roadmapGranularity: 'low' | 'medium' | 'high';
}