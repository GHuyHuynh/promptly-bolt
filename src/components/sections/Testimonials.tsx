import React from 'react';
import { Card } from '../ui/Card';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Data Scientist at Google',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'Promptly transformed my career. I went from knowing nothing about AI to landing my dream job at Google in just 6 months. The hands-on projects were incredible.',
    rating: 5
  },
  {
    name: 'Marcus Rodriguez',
    role: 'AI Engineer at Tesla',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'The curriculum is perfectly structured. Each module builds on the previous one, and the real-world projects gave me the confidence to tackle complex AI challenges.',
    rating: 5
  },
  {
    name: 'Emily Johnson',
    role: 'ML Researcher at OpenAI',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'What sets Promptly apart is the community. Having access to experts and fellow learners made all the difference in my learning journey.',
    rating: 5
  },
  {
    name: 'David Kim',
    role: 'Startup Founder',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'I used the skills from Promptly to build an AI-powered startup that just raised $2M in seed funding. The ROI on this course is incredible.',
    rating: 5
  },
  {
    name: 'Lisa Wang',
    role: 'Product Manager at Microsoft',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'Even as a non-technical PM, Promptly helped me understand AI deeply enough to make strategic decisions and communicate effectively with engineering teams.',
    rating: 5
  },
  {
    name: 'Alex Thompson',
    role: 'Freelance AI Consultant',
    image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    content: 'The certification from Promptly opened doors I never thought possible. I now charge $200/hour for AI consulting and have more clients than I can handle.',
    rating: 5
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            Success Stories
          </h2>
          <p className="text-xl text-neutral-600">
            Join thousands of students who've transformed their careers with Promptly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} hover className="p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-neutral-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-neutral-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};