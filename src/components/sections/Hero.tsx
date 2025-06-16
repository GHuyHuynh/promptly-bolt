import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // In a real app, this would send to your backend
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-neutral-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-20 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-200 rounded-full opacity-15 animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Master AI in 2025
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 mb-6 leading-tight">
            Learn AI the
            <span className="text-primary-600 block">Right Way</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            From complete beginner to AI expert. Promptly teaches you everything about artificial intelligence through interactive lessons, real projects, and expert guidance.
          </p>

          {/* Email Capture Form */}
          <div className="max-w-md mx-auto mb-8">
            <form onSubmit={handleEmailSubmit} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
              <Button type="submit" disabled={isSubmitted}>
                {isSubmitted ? 'Sent!' : 'Get Started'}
                {!isSubmitted && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>
            <p className="text-sm text-neutral-500 mt-2">
              Join 12,000+ learners. No spam, unsubscribe anytime.
            </p>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-8 text-sm text-neutral-500 mb-12">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-primary-500 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-neutral-400 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-primary-300 rounded-full border-2 border-white"></div>
              </div>
              <span>12,000+ students</span>
            </div>
            <div>⭐⭐⭐⭐⭐ 4.9/5 rating</div>
            <div>🏆 #1 AI Course 2024</div>
          </div>

          {/* Demo Video Button */}
          <Button variant="outline" size="lg" className="group">
            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Watch 2-min Demo
          </Button>
        </div>
      </div>
    </section>
  );
};