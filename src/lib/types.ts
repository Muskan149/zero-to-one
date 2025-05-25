// src/lib/types.ts
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type SupabaseProjectIdea = {
  id?: string;
  title: string;
  description: string;
  tech_stack?: string[];
  complexity_level: string;
  estimated_duration: string;
  is_saved?: boolean;
  domain: string;
};


export interface ProjectIdea {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  complexityLevel: string;
  estimatedDuration: string;
  isSaved?: boolean;
}

export interface SupabaseRoadmapItem {
  id: string;
  step_order: number;
  heading: string;
  description: string;
  estimated_duration: string;
  articles: string[];
  videos: string[];
}

export interface RoadmapItem {
  id: string;
  stepOrder: number;
  heading: string;
  description: string;
  estimatedDuration: string;
  articles?: string[];
  videos?: string[];
  isCompleted: boolean;
}


export interface RoadmapStep {
  heading: string;
  description: string;
  articles?: string[];
  videos?: string[];
}

// One Roadmap has multiple RoadmapSteps
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

export type ArticleJSON = {
  title: string;
  url: string;
}

export type VideoJSON = {
  title: string;
  url: string;
}