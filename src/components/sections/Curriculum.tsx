import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { ChevronDown, ChevronRight, Clock, Users } from 'lucide-react';

const modules = [
  {
    title: 'AI Foundations',
    duration: '3 weeks',
    students: '12,000',
    lessons: 15,
    description: 'Understanding artificial intelligence, machine learning basics, and the AI landscape.',
    topics: [
      'What is Artificial Intelligence?',
      'Types of Machine Learning',
      'AI Ethics and Bias',
      'Industry Applications',
      'Setting Up Your AI Toolkit'
    ]
  },
  {
    title: 'Machine Learning Essentials',
    duration: '4 weeks',
    students: '9,800',
    lessons: 20,
    description: 'Core ML algorithms, data preprocessing, and model evaluation techniques.',
    topics: [
      'Supervised vs Unsupervised Learning',
      'Linear and Logistic Regression',
      'Decision Trees and Random Forests',
      'Data Cleaning and Feature Engineering',
      'Model Evaluation Metrics'
    ]
  },
  {
    title: 'Deep Learning & Neural Networks',
    duration: '5 weeks',
    students: '7,200',
    lessons: 25,
    description: 'Neural networks, deep learning frameworks, and advanced architectures.',
    topics: [
      'Neural Network Fundamentals',
      'Backpropagation and Optimization',
      'Convolutional Neural Networks (CNNs)',
      'Recurrent Neural Networks (RNNs)',
      'Transfer Learning Techniques'
    ]
  },
  {
    title: 'Natural Language Processing',
    duration: '4 weeks',
    students: '6,500',
    lessons: 18,
    description: 'Text processing, language models, and building conversational AI.',
    topics: [
      'Text Preprocessing and Tokenization',
      'Sentiment Analysis',
      'Language Models (GPT, BERT)',
      'Building Chatbots',
      'Prompt Engineering'
    ]
  },
  {
    title: 'Computer Vision',
    duration: '4 weeks',
    students: '5,800',
    lessons: 22,
    description: 'Image processing, object detection, and visual AI applications.',
    topics: [
      'Image Processing Fundamentals',
      'Object Detection and Recognition',
      'Facial Recognition Systems',
      'Image Generation (GANs)',
      'Real-time Video Analysis'
    ]
  },
  {
    title: 'AI in Production',
    duration: '3 weeks',
    students: '4,200',
    lessons: 12,
    description: 'Deploying AI models, scaling, and real-world implementation.',
    topics: [
      'Model Deployment Strategies',
      'API Development for AI',
      'Monitoring and Maintenance',
      'Scaling AI Applications',
      'Career Preparation'
    ]
  }
];

export const Curriculum: React.FC = () => {
  const [expandedModule, setExpandedModule] = useState<number | null>(0);

  return (
    <section className="py-24 bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            Complete AI Curriculum
          </h2>
          <p className="text-xl text-neutral-600">
            6 comprehensive modules designed to take you from beginner to AI expert in 23 weeks.
          </p>
        </div>

        <div className="space-y-4">
          {modules.map((module, index) => (
            <Card key={index} className="overflow-hidden">
              <button
                onClick={() => setExpandedModule(expandedModule === index ? null : index)}
                className="w-full p-6 text-left hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm font-medium text-primary-600 bg-primary-100 px-3 py-1 rounded-full">
                        Module {index + 1}
                      </span>
                      <div className="flex items-center gap-4 text-sm text-neutral-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {module.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {module.students} students
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      {module.title}
                    </h3>
                    <p className="text-neutral-600">
                      {module.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    {expandedModule === index ? (
                      <ChevronDown className="w-5 h-5 text-neutral-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-neutral-400" />
                    )}
                  </div>
                </div>
              </button>
              
              {expandedModule === index && (
                <div className="px-6 pb-6 border-t border-neutral-200 bg-neutral-50">
                  <div className="pt-4">
                    <h4 className="font-medium text-neutral-900 mb-3">
                      What you'll learn ({module.lessons} lessons):
                    </h4>
                    <ul className="space-y-2">
                      {module.topics.map((topic, topicIndex) => (
                        <li key={topicIndex} className="flex items-center gap-3 text-neutral-600">
                          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};