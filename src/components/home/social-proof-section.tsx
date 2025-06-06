"use client";

import { motion } from "framer-motion";
import { Star, TrendingUp, Shield, Award } from "lucide-react";
import { TestimonialCard } from "@/components/ui/testimonial-card";
import { CompanyLogos } from "@/components/ui/company-logos";
import { AnimatedCounter } from "@/components/ui/animated-counter";

// Sample testimonials data
const testimonials = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Product Manager",
    company: "Google",
    avatar: "/avatars/sarah.svg",
    content:
      "Promptly transformed how I approach AI tools at work. The gamified learning kept me engaged, and I went from AI-curious to confidently implementing ChatGPT workflows that saved my team 15 hours per week.",
    rating: 5,
    beforeSkill: "Beginner",
    afterSkill: "Expert",
    timeframe: "3 months",
    coursesCompleted: 12,
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    role: "Marketing Director",
    company: "Spotify",
    avatar: "/avatars/marcus.svg",
    content:
      "The hands-on projects were game-changers. I built an AI content pipeline that increased our campaign efficiency by 40%. The skill tree made complex AI concepts feel like leveling up in a game.",
    rating: 5,
    beforeSkill: "Novice",
    afterSkill: "Advanced",
    timeframe: "2 months",
    coursesCompleted: 8,
  },
  {
    id: "3",
    name: "Emily Watson",
    role: "UX Designer",
    company: "Microsoft",
    avatar: "/avatars/emily.svg",
    content:
      "I was skeptical about AI replacing creativity, but Promptly showed me how to enhance my design process. Now I use AI for rapid prototyping and user research synthesis.",
    rating: 4,
    coursesCompleted: 6,
  },
  {
    id: "4",
    name: "Alex Kim",
    role: "Data Analyst",
    company: "Netflix",
    avatar: "/avatars/alex.svg",
    content:
      "The leaderboard and achievements made learning addictive! I completed 15 courses in 6 weeks and now lead AI initiatives at my company.",
    rating: 5,
    beforeSkill: "Intermediate",
    afterSkill: "Expert",
    timeframe: "6 weeks",
    coursesCompleted: 15,
  },
  {
    id: "5",
    name: "Jessica Liu",
    role: "Operations Manager",
    company: "Amazon",
    avatar: "/avatars/jessica.svg",
    content:
      "Promptly's practical approach helped me automate 60% of my repetitive tasks. The ROI has been incredible - my productivity doubled within a month.",
    rating: 5,
    coursesCompleted: 10,
  },
  {
    id: "6",
    name: "David Thompson",
    role: "Sales Director",
    company: "Uber",
    avatar: "/avatars/david.svg",
    content:
      "The AI sales tools I learned have revolutionized our prospecting process. Lead quality improved by 45% and conversion rates are through the roof.",
    rating: 4,
    coursesCompleted: 7,
  },
];

// Featured testimonial
const featuredTestimonial = testimonials[0];

// Trust signals
const trustSignals = [
  {
    icon: Star,
    value: 4.9,
    suffix: "/5",
    label: "Average Rating",
    description: "From 10,000+ reviews",
    color: "text-yellow-500",
  },
  {
    icon: Award,
    value: 98,
    suffix: "%",
    label: "Completion Rate",
    description: "Students finish courses",
    color: "text-green-500",
  },
  {
    icon: TrendingUp,
    value: 300,
    suffix: "%",
    label: "Career Growth",
    description: "Average salary increase",
    color: "text-blue-500",
  },
  {
    icon: Shield,
    value: 30,
    suffix: "-day",
    label: "Money Back",
    description: "Guarantee period",
    color: "text-purple-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export function SocialProofSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Join Thousands of
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {" "}
              Success Stories
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Real professionals, real results. See how Promptly has transformed
            careers and boosted productivity across leading companies.
          </p>
        </motion.div>

        {/* Trust Signals */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {trustSignals.map((signal, index) => (
            <motion.div
              key={signal.label}
              variants={itemVariants}
              className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-700 mb-4 ${signal.color}`}
              >
                <signal.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold mb-1">
                <AnimatedCounter
                  from={0}
                  to={signal.value}
                  duration={2}
                  delay={0.5 + index * 0.2}
                  suffix={signal.suffix}
                />
              </div>
              <div className="font-semibold text-gray-900 dark:text-white mb-1">
                {signal.label}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {signal.description}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Featured Testimonial */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <TestimonialCard
            testimonial={featuredTestimonial}
            variant="featured"
            className="max-w-4xl mx-auto"
          />
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.slice(1, 6).map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              variant="default"
            />
          ))}
        </motion.div>

        {/* Company Logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <CompanyLogos />
        </motion.div>

        {/* Additional Social Proof Stats */}
        <motion.div
          className="text-center mt-16 p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold mb-6">
            Why Professionals Choose Promptly
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                stat: "2x faster",
                description: "Skill acquisition vs traditional methods",
              },
              {
                stat: "94% report",
                description: "Immediate workplace application",
              },
              {
                stat: "85% get",
                description: "Promoted within 6 months",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {item.stat}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {item.description}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
