'use client'

import { motion } from 'framer-motion';

const steps = [
  {
    title: "Share Your Idea",
    description: "Tell us about your project vision and goals",
    icon: "💡",
    color: "from-purple-500 to-purple-600"
  },
  {
    title: "AI Analysis",
    description: "Our AI analyzes your idea and suggests the best tech stack",
    icon: "🤖",
    color: "from-purple-600 to-purple-700"
  },
  {
    title: "Custom Roadmap",
    description: "Get a personalized development roadmap",
    icon: "🗺️",
    color: "from-purple-700 to-purple-800"
  },
  {
    title: "Start Building",
    description: "Begin your journey with guided tutorials",
    icon: "🚀",
    color: "from-purple-800 to-purple-900"
  }
];

export function ProcessSteps() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 pb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="relative"
          >
            <div className={`bg-gradient-to-br ${step.color} p-4 rounded-xl shadow-lg text-white h-[180px] flex flex-col justify-between`}>
              <div>
                <div className="text-3xl mb-2">{step.icon}</div>
                <h3 className="text-lg font-semibold mb-4">{step.title}</h3>
              </div>
              <p className="text-sm text-purple-100">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-purple-300"></div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
} 