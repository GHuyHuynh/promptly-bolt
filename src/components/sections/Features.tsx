import React from 'react';
import { Card } from '../ui/Card';
import { Brain, Code, Users, Zap, Target, Award } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI Fundamentals',
    description: 'Master machine learning, neural networks, and deep learning concepts with clear, visual explanations.',
    highlight: 'Start from zero'
  },
  {
    icon: Code,
    title: 'Hands-on Projects',
    description: 'Build real AI applications including chatbots, image recognition, and data analysis tools.',
    highlight: '50+ projects'
  },
  {
    icon: Users,
    title: 'Expert Community',
    description: 'Learn alongside thousands of students and get help from AI professionals and instructors.',
    highlight: '24/7 support'
  },
  {
    icon: Zap,
    title: 'Latest Tools',
    description: 'Work with cutting-edge AI tools like GPT-4, Claude, Midjourney, and emerging technologies.',
    highlight: 'Always updated'
  },
  {
    icon: Target,
    title: 'Career Ready',
    description: 'Prepare for AI roles with interview prep, portfolio building, and industry connections.',
    highlight: '89% job rate'
  },
  {
    icon: Award,
    title: 'Certification',
    description: 'Earn recognized certificates to showcase your AI expertise to employers and clients.',
    highlight: 'Industry recognized'
  }
];

export const Features: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            Everything You Need to Master AI
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Our comprehensive curriculum covers all aspects of artificial intelligence, from theory to practical application.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} hover className="p-8 group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                  {feature.highlight}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};