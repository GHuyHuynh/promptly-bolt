"use client";

import { motion } from "framer-motion";
import {
  Wrench,
  Trophy,
  Shield,
  Crown,
  Award,
  Bot,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { XPBar } from "@/components/ui/xp-bar";
import { Badge } from "@/components/ui/badge";

const aiToolLogos = [
  { name: "ChatGPT", color: "text-green-500" },
  { name: "Claude", color: "text-orange-500" },
  { name: "Midjourney", color: "text-purple-500" },
  { name: "DALL-E", color: "text-blue-500" },
  { name: "Gemini", color: "text-red-500" },
];

const valueProps = [
  {
    id: "practical-skills",
    title: "Master Real AI Tools",
    description:
      "Learn ChatGPT, Claude, Midjourney, and more through hands-on practice",
    icon: Wrench,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    component: "tools",
  },
  {
    id: "engaging-gameplay",
    title: "Level Up Your Learning",
    description: "Earn XP, unlock achievements, and maintain streaks",
    icon: Trophy,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    component: "gamification",
  },
  {
    id: "safe-practice",
    title: "Risk-Free Learning",
    description: "Practice with AI tools in guided playgrounds",
    icon: Shield,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    borderColor: "border-green-200 dark:border-green-800",
    component: "sandbox",
  },
  {
    id: "competitive-rankings",
    title: "Compete & Compare",
    description: "Climb leaderboards and challenge friends",
    icon: Crown,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    component: "leaderboard",
  },
  {
    id: "career-certification",
    title: "Prove Your Skills",
    description: "Earn industry-recognized AI competency certificates",
    icon: Award,
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    component: "certification",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
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

function ToolsPreview() {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {aiToolLogos.map((tool, index) => (
        <motion.div
          key={tool.name}
          className={`px-3 py-1 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-sm ${tool.color} font-medium text-sm`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          {tool.name}
        </motion.div>
      ))}
    </div>
  );
}

function GamificationPreview() {
  return (
    <div className="space-y-3">
      <XPBar currentXP={750} maxXP={1000} level={8} animated={true} />
      <div className="flex gap-2 justify-center">
        <Badge
          variant="secondary"
          className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
        >
          <Trophy className="w-3 h-3 mr-1" />
          Quick Learner
        </Badge>
        <Badge
          variant="secondary"
          className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          Streak Master
        </Badge>
      </div>
    </div>
  );
}

function SandboxPreview() {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border-2 border-dashed border-gray-300 dark:border-gray-600">
      <div className="flex items-center gap-2 mb-2">
        <Bot className="w-4 h-4 text-green-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          AI Playground
        </span>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 rounded p-2">
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        "Write a product description for..."
      </div>
    </div>
  );
}

function LeaderboardPreview() {
  const users = [
    { name: "Alex C.", xp: 2450, rank: 1 },
    { name: "Sarah J.", xp: 2380, rank: 2 },
    { name: "You", xp: 1850, rank: 8 },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
      {users.map((user) => (
        <div key={user.name} className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-500 w-4">
              #{user.rank}
            </span>
            <span className="text-sm font-medium">{user.name}</span>
          </div>
          <span className="text-xs text-gray-500">{user.xp} XP</span>
        </div>
      ))}
    </div>
  );
}

function CertificationPreview() {
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
      <div className="text-center">
        <Award className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
        <div className="text-sm font-bold text-gray-800 dark:text-gray-200">
          AI Prompt Engineering
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Certificate
        </div>
        <div className="flex gap-1 justify-center mt-2">
          {["Beginner", "Intermediate", "Advanced"].map((level) => (
            <div
              key={level}
              className="w-2 h-2 bg-yellow-400 rounded-full"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CardContent({ component }: { component: string }) {
  switch (component) {
    case "tools":
      return <ToolsPreview />;
    case "gamification":
      return <GamificationPreview />;
    case "sandbox":
      return <SandboxPreview />;
    case "leaderboard":
      return <LeaderboardPreview />;
    case "certification":
      return <CertificationPreview />;
    default:
      return null;
  }
}

export function ValuePropositionShowcase() {
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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Why Choose
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Promptly
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience the most effective way to master AI tools. Built for
            professionals who want practical skills, not just theory.
          </p>
        </motion.div>

        {/* Value Proposition Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {valueProps.map((prop) => (
            <motion.div
              key={prop.id}
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              className="group"
            >
              <Card
                className={`h-full p-6 cursor-pointer transition-all duration-300 ${prop.bgColor} ${prop.borderColor} hover:shadow-xl`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Icon */}
                  <div
                    className={`p-3 rounded-full bg-gradient-to-r ${prop.color} text-white group-hover:scale-110 transition-transform duration-300`}
                  >
                    <prop.icon className="w-6 h-6" />
                  </div>

                  {/* Title and Description */}
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      {prop.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      {prop.description}
                    </p>
                  </div>

                  {/* Interactive Preview */}
                  <div className="w-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <CardContent component={prop.component} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
