// src/components/roadmap/roadmap-item.tsx
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { RoadmapItem as RoadmapItemType } from '@/lib/types';

interface RoadmapItemProps {
  item: RoadmapItemType;
  onToggleComplete: (id: string, completed: boolean) => void;
}

export function RoadmapItem({ item, onToggleComplete }: RoadmapItemProps) {
  const [isCompleted, setIsCompleted] = useState(item.isCompleted);

  const handleToggle = () => {
    const newValue = !isCompleted;
    setIsCompleted(newValue);
    onToggleComplete(item.id, newValue);
  };

  const splitDescriptionIntoSentences = (desc: string): string[] => {
    return desc
      .split(/(?<=[.!?])\s+/)
      .filter((sentence) => sentence.trim() !== '');
  };
  

  return (
    <div className="border rounded-lg p-6 mb-4">
      <div className="flex items-start gap-3">
        <Checkbox 
          id={`item-${item.id}`} 
          checked={isCompleted}
          onCheckedChange={handleToggle}
          className="mt-1 h-6 w-6 border-2 border-purple-600 rounded-md shadow-sm checked:bg-purple-600 checked:border-transparent transition-colors duration-200"
        />
        <div className="flex-grow">
          <label 
            htmlFor={`item-${item.id}`}
            className={`text-lg font-medium ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800'}`}
          >
            {item.heading}
          </label>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            {splitDescriptionIntoSentences(item.description).map((line, idx) => (
              <li key={idx} className={`text-sm ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
              {line.trim()}
              </li>
            ))}
          </ul>

          {item.resources.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Resources:</h4>
              <ul className="space-y-2">
                {item.resources.map((resource, index) => (
                  <li key={index} className="flex items-center">
                    <span className="mr-2">
                      {resource.type === 'video' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                          <polygon points="23 7 16 12 23 17 23 7" />
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                      )}
                    </span>
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:underline"
                    >
                      {resource.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}