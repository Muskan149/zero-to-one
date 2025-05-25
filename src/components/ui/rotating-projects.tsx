import React, { useState, useEffect } from 'react';
import { TypingAnimation } from './typing-animation';

const projectIdeas = [
  "Full Stack E-commerce Platform",
  "Mobile Fitness Tracking App",
  "Data Science Dashboard",
  "AI-powered Chatbot",
  "Full Stack Social Media Platform",
  "Mobile Food Delivery App",
  "Data Visualization Tool",
  "ML-powered Recommendation System"
];

export function RotatingProjects() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % projectIdeas.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-8 text-xl font-medium text-purple-600">
      Build a <TypingAnimation key={currentIndex} text={projectIdeas[currentIndex]} /> with AI-powered guidance
    </div>
  );
}