import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { AuthButton } from './AuthButton';
import { Card } from '../ui/Card';
import { Brain, Shield, Zap, Users } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { loading } = useAuthContext();

  const features = [
    {
      icon: Brain,
      title: 'Personalized Learning',
      description: 'AI-powered curriculum tailored to your pace and goals'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security'
    },
    {
      icon: Zap,
      title: 'Instant Access',
      description: 'Start learning immediately after signing in'
    },
    {
      icon: Users,
      title: 'Join the Community',
      description: 'Connect with 12,000+ AI learners worldwide'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-neutral-900">Promptly</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Welcome to Your AI Journey
          </h1>
          <p className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
            Sign in with Google to access your personalized AI learning experience and join thousands of successful learners.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Sign In Card */}
          <Card className="p-8 text-center">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
                Ready to Get Started?
              </h2>
              <p className="text-neutral-600">
                Sign in securely with your Google account to continue your learning journey.
              </p>
            </div>

            <AuthButton 
              size="lg" 
              className="w-full mb-4"
              disabled={loading}
            />

            <div className="text-sm text-neutral-500 space-y-1">
              <p>✅ Free to get started</p>
              <p>🔒 Secure Google OAuth</p>
              <p>⚡ Instant access to content</p>
            </div>
          </Card>

          {/* Features */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12 text-sm text-neutral-500">
          <p>
            By signing in, you agree to our{' '}
            <a href="#" className="text-primary-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};