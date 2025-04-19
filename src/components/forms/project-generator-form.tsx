// src/components/forms/project-generator-form.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ProjectFormData } from '@/lib/types';
import SkillsSelector from './skills-selector';
import { handleFormSubmit } from './handleFormSubmit';

// import {ideaGenerator} from '@/utils/gemini-llm/ideaGenerator';

export function ProjectGeneratorForm() {
  const router = useRouter();

  const [formData, setFormData] = useState<ProjectFormData>({
    domain: '',
    skills: [],
    nonTechInterests: [],
    projectComplexity: 'beginner',
    roadmapGranularity: 'medium',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  const domainOptions = [
    'Full Stack Development', 
    'Data Science', 
    'Trading', 
    'Big Tech', 
    'Startup'
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

      {/* DOMAIN HERE */}
      <div>
        <h2 className="text-medium font-semibold mb-2">Domain</h2>
        <Select 
          onValueChange={(value) => handleSelectChange('domain', value)}
          required
        >
          <SelectTrigger className = "min-w-full">
            <SelectValue placeholder="What kind of project are we thinking?" />
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
        <h2 className="text-medium font-semibold mb-2">Non-tech interest:</h2>
        <Input 
            placeholder="e.g., Music, Sports, Finance, Healthcare..."
            onChange={(e) => handleInputChange('nonTechInterests', e.target.value)}
            className='text-sm'
        />
      </div>

      {/* TECH STACK */}
      <SkillsSelector skills ={skills} onChange={handleSkillsChange}/>
      
      {/* PROJECT COMPLEXITY */}
      <div>
        <h2 className="text-medium font-semibold mb-2">Project Complexity</h2>
        <Select 
          defaultValue="intermediate"
          onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => handleSelectChange('projectComplexity', value)}
        >
          <SelectTrigger className = "min-w-full">
            <SelectValue placeholder="Select granularity" />
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
        <h2 className="text-medium font-semibold mb-2">Roadmap Granularity</h2>
        <Select 
          defaultValue="medium"
          onValueChange={(value: 'low' | 'medium' | 'high') => handleSelectChange('roadmapGranularity', value)}
        >
          <SelectTrigger className = "min-w-full">
            <SelectValue placeholder="Select granularity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
    
      {/* SUBMIT BUTTON */}
      <Button 
        type="submit" 
        className="w-full bg-purple-600 hover:bg-purple-700"
        disabled={isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate Project Ideas'}
      </Button>

    </form>
  );
}