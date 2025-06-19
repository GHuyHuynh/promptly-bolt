import React, { useState } from "react";
import { Button } from "../ui/Button";
import { ArrowRight, Play, Sparkles } from "lucide-react";

export const Hero: React.FC = () => {
  const [email, setEmail] = useState("");
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
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-200 rounded-full opacity-15 animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-slide-up">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-neutral-900 mb-6 leading-tight">
            Learn AI the
            <span className="text-primary-600 block">Right Way</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-neutral-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            From complete beginner to AI expert. Promptly teaches you everything
            about artificial intelligence through interactive lessons, real
            projects, and expert guidance.
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
                {isSubmitted ? "Sent!" : "Get Started"}
                {!isSubmitted && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>
            <p className="text-sm text-neutral-500 mt-2">
              No spam, unsubscribe anytime.
            </p>
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
