import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from "@/components/ui/command";

import { allSkills } from "./allSkills";

interface SkillsSelectorProps {
  skills?: string[];
  onChange?: (skills: string[]) => void;
  className?: string;
}

// In your component:
const SkillsSelector =({ 
  skills = [], 
  onChange,
  }: SkillsSelectorProps) => {

  // State management
  const [skillInput, setSkillInput] = useState("");
  const [filteredSkills, setFilteredSkills] = useState<string[]>([]);

  useEffect(() => {
    if (skillInput.trim() === "") {
      console.log("nothing entered")
      setFilteredSkills([])
    } else {
      console.log("hmm smth entered")
      console.log(allSkills)
      const filteredSkills = allSkills.filter(
        skill => 
          skill.toLowerCase().includes(skillInput.toLowerCase()) && 
          !skills.includes(skill))
      setFilteredSkills(filteredSkills);
    }
    console.log(`filtered skills: ${filteredSkills}`)
      
    }, [skillInput, skills, allSkills]);

  const addSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      const newSkills = [...skills, skill];
      onChange?.(newSkills);
      setSkillInput("");
    }
  }

  const removeSkill = (skill: string) => {
    const newSkills = skills.filter(s => s != skill);
    onChange?.(newSkills);
  }

  
  return (
    <div className="space-y-1.5">
      <h2 className="text-medium font-semibold">Preferred skills/tech stack:</h2>
      
      <Command className="rounded-lg border shadow-md">
        <CommandInput
            value = {skillInput}
            onValueChange={setSkillInput}
            placeholder="Start typing to find skills..."
            className = "w-full">
        </CommandInput>
        {/* {skillInput.length > 0 &&  */}
          <CommandList>
            {skillInput.length > 0 && 
                <CommandEmpty>No skills found.</CommandEmpty>
            }
            <CommandGroup>
              {filteredSkills.map((skill) => 
                <CommandItem
                  key={skill}
                  onSelect={() => addSkill(skill)}
                  className="cursor-pointer">
                    {skill}
                  </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        {/* } */}

      </Command>
      
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="text-sm">
            {skill}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground"
              onClick={() => removeSkill(skill)}
            >
              ×
            </Button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SkillsSelector;