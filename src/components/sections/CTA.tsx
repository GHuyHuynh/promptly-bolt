import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { ArrowRight, CheckCircle } from 'lucide-react';

export const CTA: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // In a real app, this would send to your backend
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-24 bg-gradient-to-r from-primary-600 to-primary-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Master AI?
        </h2>
        <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          Join 12,000+ students who are already building their AI careers. Start your journey today with our proven curriculum.
        </p>

        <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-auto mb-8">
          <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Limited Time: 50% Off</span>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email to get started"
              className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitted}>
              {isSubmitted ? (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Check Your Email!
                </>
              ) : (
                <>
                  Start Learning AI Today
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>
          
          <p className="text-sm text-neutral-500 mt-4">
            ✅ Instant access • ✅ 30-day guarantee • ✅ Cancel anytime
          </p>
        </div>

        <div className="flex items-center justify-center gap-8 text-primary-100 text-sm">
          <div>🎓 12,000+ graduates</div>
          <div>⭐ 4.9/5 rating</div>
          <div>🏆 #1 AI course</div>
        </div>
      </div>
    </section>
  );
};