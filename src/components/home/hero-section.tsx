"use client";

import { motion } from "framer-motion";
import {
  ChevronRight,
  Play,
  Star,
  Users,
  BookOpen,
  Award,
  Sparkles,
  Gamepad2,
  Brain,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { FloatingElements } from "@/components/ui/floating-elements";
import { GradientText } from "@/components/ui/gradient-text";
import { Badge } from "@/components/ui/badge";

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

const stats = [
  {
    icon: Users,
    value: 12847,
    suffix: "+",
    label: "Active Learners",
    color: "text-blue-500",
  },
  {
    icon: BookOpen,
    value: 200,
    suffix: "+",
    label: "Interactive Lessons",
    color: "text-green-500",
  },
  {
    icon: Award,
    value: 2140,
    suffix: "+",
    label: "Certificates Earned",
    color: "text-purple-500",
  },
  {
    icon: Star,
    value: 98,
    suffix: "%",
    label: "Career Impact Rate",
    color: "text-yellow-500",
  },
];

const aiToolLogos = [
  { name: "ChatGPT", color: "text-green-400" },
  { name: "Claude", color: "text-orange-400" },
  { name: "Midjourney", color: "text-purple-400" },
  { name: "Gemini", color: "text-blue-400" },
  { name: "DALL-E", color: "text-pink-400" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
      {/* Background Elements */}
      <FloatingElements count={15} />

      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-black/20" />

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-white/10 backdrop-blur-sm border border-gray-200 dark:border-white/20 text-gray-800 dark:text-white/90 text-sm font-medium mb-6"
        >
          <Gamepad2 className="w-4 h-4 text-green-500" />
          <span>Learn AI skills like you learned languages with Duolingo</span>
          <ChevronRight className="w-4 h-4" />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
        >
          Master AI Skills Like{" "}
          <GradientText variant="ai" animated>
            Duolingo
          </GradientText>
          <br />
          for Your Career
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-xl sm:text-2xl text-gray-600 dark:text-white/80 mb-8 max-w-4xl mx-auto leading-relaxed"
        >
          The fun, addictive way to learn AI tools that actually matter for your
          job. Build practical skills through interactive quests, earn
          achievements, and get certified in ChatGPT, Claude, Midjourney, and
          more.
        </motion.p>

        {/* AI Tools Preview */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          {aiToolLogos.map((tool, index) => (
            <motion.div
              key={tool.name}
              className={`px-4 py-2 rounded-full bg-white/90 dark:bg-white/10 backdrop-blur-sm border border-gray-200 dark:border-white/20 ${tool.color} font-medium text-sm`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex items-center gap-2">
                <Brain className="w-3 h-3" />
                {tool.name}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            asChild
          >
            <Link to="/sign-in">
              <Sparkles className="mr-2 w-5 h-5" />
              Try Interactive Demo
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-gray-300 dark:border-white/30 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm"
            asChild
          >
            <Link to="/sign-in">
              <Play className="mr-2 w-5 h-5" />
              Sign In
            </Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 + index * 0.1, duration: 0.5 }}
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(255, 255, 255, 0.9)",
              }}
            >
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  <AnimatedCounter
                    from={0}
                    to={stat.value}
                    duration={2}
                    delay={1.2 + index * 0.2}
                    suffix={stat.suffix}
                  />
                </div>
                <div className="text-sm text-gray-600 dark:text-white/70 font-medium">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Value Props Preview */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto"
        >
          <Badge
            variant="outline"
            className="px-4 py-2 bg-white/80 dark:bg-white/10 border-gray-200 dark:border-white/20 text-gray-700 dark:text-white/90 hover:bg-white/90 dark:hover:bg-white/20 transition-all duration-300"
          >
            🎯 Job-ready skills in 6 weeks
          </Badge>
          <Badge
            variant="outline"
            className="px-4 py-2 bg-white/80 dark:bg-white/10 border-gray-200 dark:border-white/20 text-gray-700 dark:text-white/90 hover:bg-white/90 dark:hover:bg-white/20 transition-all duration-300"
          >
            🏆 Industry-recognized certificates
          </Badge>
          <Badge
            variant="outline"
            className="px-4 py-2 bg-white/80 dark:bg-white/10 border-gray-200 dark:border-white/20 text-gray-700 dark:text-white/90 hover:bg-white/90 dark:hover:bg-white/20 transition-all duration-300"
          >
            ⚡ 15 min/day to transform your career
          </Badge>
          <Badge
            variant="outline"
            className="px-4 py-2 bg-white/80 dark:bg-white/10 border-gray-200 dark:border-white/20 text-gray-700 dark:text-white/90 hover:bg-white/90 dark:hover:bg-white/20 transition-all duration-300"
          >
            🛡️ Practice safely in guided playgrounds
          </Badge>
        </motion.div>
      </motion.div>
    </section>
  );
}