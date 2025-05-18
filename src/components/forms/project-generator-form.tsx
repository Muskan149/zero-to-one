// src/components/forms/project-generator-form.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info as InfoIcon } from 'lucide-react';
import type { ProjectFormData } from '@/lib/types';
import SkillsSelector from './skills-selector';
import { handleFormSubmit } from './handleFormSubmit';
import { useEffect } from 'react';
import { LoadingDots } from '@/components/ui/LoadingDots';

export function ProjectGeneratorForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<ProjectFormData>({
    domain: '',
    skills: [],
    nonTechInterests: [],
    projectComplexity: 'intermediate',
    roadmapGranularity: 'medium',
  });
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
  const isValid =
    formData.domain.trim() !== '' &&
    formData.projectComplexity.trim() !== '' &&
    formData.roadmapGranularity.trim() !== '';

  setIsFormValid(isValid);
  }, [formData.domain, formData.projectComplexity, formData.roadmapGranularity]);
  

  // const domainOptions = [
  //   'Full Stack Development',
  //   'Frontend Development',
  //   'Backend Development',
  //   'Mobile App Development',
  //   'Game Development',
  //   'Data Science',
  //   'DevOps',
  //   'Machine Learning',
  //   'Artificial Intelligence',
  //   'Cybersecurity',
  //   'Cloud Computing',
  //   'Blockchain Development',
  //   'Embedded Systems',
  //   'AR/VR Development',
  //   'IoT (Internet of Things)',
  //   'Database Development',
  //   'Web3 Development',
  //   'Computer Vision',
  //   'Natural Language Processing'
  // ];

  const domainOptions = [
    'Full Stack Development',
    'Frontend Development',
    'Backend Development',
    'Mobile Development',
    'Data & AI/ML',
    'Cloud & DevOps',
    'Cybersecurity',
    'Game & XR Development',
    'Blockchain & Web3',
    'Embedded & IoT'
  ];
  
  
  const handleSelectChange = (field: keyof ProjectFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    if (field === 'skills' || field === 'nonTechInterests') {
      // Split by comma and trim each item
      const items = value.split(',').map((item) => item.trim());
      setFormData((prev) => ({ ...prev, [field]: items }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const [skills, setSkills] = useState<string[]>([]);

  // Function to update the skills list
  const handleSkillsChange = (newSkills: string[]) => {
    setSkills(newSkills);
    setFormData((prev) => ({ ...prev, skills: newSkills }));
  };

    // Create the submit handler using the imported function
  const submitHandler = handleFormSubmit(
      formData,
      router,
      setIsLoading,
      setError
  );
  

  // 
  return (
    <form onSubmit={submitHandler} className="space-y-6 max-w-2xl">
      <TooltipProvider>
     {/* DOMAIN */}
    <div>
    <div className="flex items-center gap-2">
      <h2 className="text-medium font-semibold mb-2">
        Domain <span className="text-red-500">*</span>
      </h2>
    </div>
    <Select
      onValueChange={(value) => handleSelectChange('domain', value)}
      required
    >
      <SelectTrigger className="min-w-full">
        <SelectValue placeholder="What kind of project do you want to work on?" />
      </SelectTrigger>
      <SelectContent>
        {domainOptions.map((domain) => (
          <SelectItem
            key={domain.toLowerCase().replace(/ /g, '-')}
            value={domain.toLowerCase().replace(/ /g, '-')}
          >
            {domain}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* NON-TECH INTERESTS */}
  <div>
    <div className="flex items-center gap-2">
      <h2 className="text-medium font-semibold mb-2">
      (Optional) Non-Tech Interest
      </h2>
      <Tooltip>
        <TooltipTrigger asChild>
        <InfoIcon className="w-4 h-4 text-gray-500" />
        </TooltipTrigger>
        <TooltipContent>
          Add personal interests outside of tech (e.g. music, sports, fashion, healthcare) to generate interdisciplinary project ideas. Optional.
        </TooltipContent>
      </Tooltip>
    </div>
    <Input
      placeholder="Music, sports, finance, etc..."
      onChange={(e) => handleInputChange('nonTechInterests', e.target.value)}
      className="text-sm"
    />
  </div>

  {/* TECH STACK */}
  <div>
    <div className="flex items-center gap-2">
      <h2 className="text-medium font-semibold">(Optional) Preferred skills/tech stack:</h2>
      <Tooltip>
        <TooltipTrigger asChild>
        <InfoIcon className="w-4 h-4 text-gray-500" />
        </TooltipTrigger>
        <TooltipContent>
          Optional. Useful if you&apos;re targeting a specific stack (e.g., React, Django, PHP). If not, our AI will figure out a tech stack for you.
        </TooltipContent>
      </Tooltip>
    </div>
    <SkillsSelector skills={skills} onChange={handleSkillsChange} />
  </div>

  {/* PROJECT COMPLEXITY */}
  <div>
    <div className="flex items-center gap-2">
      <h2 className="text-medium font-semibold mb-2">
        Project Complexity <span className="text-red-500">*</span>
      </h2>
    </div>
    <Select
      defaultValue="intermediate"
      onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') =>
        handleSelectChange('projectComplexity', value)
      }
    >
      <SelectTrigger className="min-w-full">
        <SelectValue placeholder="Select complexity" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="beginner">Beginner</SelectItem>
        <SelectItem value="intermediate">Intermediate</SelectItem>
        <SelectItem value="advanced">Advanced</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* ROADMAP GRANULARITY */}
  <div>
    <div className="flex items-center gap-2">
      <h2 className="text-medium font-semibold mb-2">
        Roadmap Granularity <span className="text-red-500">*</span>
      </h2>
      <Tooltip>
        <TooltipTrigger asChild>
        <InfoIcon className="w-4 h-4 text-gray-500" />
        </TooltipTrigger>
        <TooltipContent>
          Determines how step-by-step the roadmap should be. High granularity gives detailed guidance, ideal for beginners.
        </TooltipContent>
      </Tooltip>
    </div>
    <Select
      defaultValue="medium"
      onValueChange={(value: 'low' | 'medium' | 'high') =>
        handleSelectChange('roadmapGranularity', value)
      }
    >
      <SelectTrigger className="min-w-full">
        <SelectValue placeholder="Select granularity" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="low">Low</SelectItem>
        <SelectItem value="medium">Medium</SelectItem>
        <SelectItem value="high">High</SelectItem>
      </SelectContent>
    </Select>
  </div>
  </TooltipProvider>
    
    {/* SUBMIT BUTTON */}
    <Button 
    type="submit" 
    className="w-full bg-purple-600 hover:bg-purple-700"
    disabled={!isFormValid || isLoading}
  >
    {isLoading ? <LoadingDots text="Generating" /> : 'Generate Project Ideas'}
  </Button>
  </form>
  );
}