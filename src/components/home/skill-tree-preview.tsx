"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Rocket,
  Lightbulb,
  Zap,
  Settings,
  Trophy,
  Wrench,
  Users,
  BarChart,
  Briefcase,
} from "lucide-react";
import { SkillNode, type SkillNodeData } from "@/components/ui/skill-node";
import { ConnectionLine } from "@/components/ui/connection-line";
import { useSkillTreeAnimation } from "@/hooks/use-skill-tree-animation";
import { Button } from "@/components/ui/button";

// Enhanced skill paths with more detailed information
const skillPaths = [
  {
    id: "prompt-engineering",
    title: "Prompt Engineering",
    description: "Master the art of communicating with AI",
    color: "bg-blue-500",
    careerOutcomes: ["AI Consultant", "Content Strategist", "Product Manager"],
    estimatedTime: "4-6 weeks",
  },
  {
    id: "ai-tools",
    title: "AI Tools Mastery",
    description: "Learn popular AI tools and platforms",
    color: "bg-purple-500",
    careerOutcomes: [
      "Digital Marketing Manager",
      "Operations Specialist",
      "Freelancer",
    ],
    estimatedTime: "6-8 weeks",
  },
  {
    id: "advanced-applications",
    title: "Advanced Applications",
    description: "Build complex AI-powered solutions",
    color: "bg-green-500",
    careerOutcomes: ["AI Engineer", "Technical Lead", "Innovation Manager"],
    estimatedTime: "8-10 weeks",
  },
  {
    id: "ai-strategy",
    title: "AI Strategy",
    description: "Strategic implementation of AI in business",
    color: "bg-orange-500",
    careerOutcomes: [
      "Strategy Consultant",
      "Business Analyst",
      "VP of Innovation",
    ],
    estimatedTime: "6-8 weeks",
  },
];

// Complete data for all learning paths with better positioning
const skillTreeData: Record<
  string,
  {
    nodes: SkillNodeData[];
    connections: Array<{ from: string; to: string }>;
    positions: Array<{ x: number; y: number }>;
  }
> = {
  "prompt-engineering": {
    nodes: [
      {
        id: "basics",
        title: "AI Basics",
        description: "Understanding AI fundamentals and terminology",
        status: "completed",
        icon: Brain,
        difficulty: "beginner",
        xpReward: 100,
      },
      {
        id: "prompt-fundamentals",
        title: "Prompt Fundamentals",
        description: "Learn the basics of prompt engineering",
        status: "completed",
        icon: Lightbulb,
        difficulty: "beginner",
        xpReward: 150,
      },
      {
        id: "advanced-prompting",
        title: "Advanced Prompting",
        description: "Complex prompting techniques and strategies",
        status: "in-progress",
        progress: 65,
        icon: Zap,
        difficulty: "intermediate",
        xpReward: 200,
      },
      {
        id: "prompt-optimization",
        title: "Prompt Optimization",
        description: "Optimize prompts for better results",
        status: "available",
        icon: Settings,
        difficulty: "advanced",
        xpReward: 300,
      },
      {
        id: "prompt-mastery",
        title: "Prompt Mastery",
        description: "Become a prompt engineering expert",
        status: "locked",
        icon: Trophy,
        difficulty: "expert",
        xpReward: 500,
      },
    ],
    connections: [
      { from: "basics", to: "prompt-fundamentals" },
      { from: "prompt-fundamentals", to: "advanced-prompting" },
      { from: "advanced-prompting", to: "prompt-optimization" },
      { from: "prompt-optimization", to: "prompt-mastery" },
    ],
    positions: [
      { x: 120, y: 180 },
      { x: 280, y: 120 },
      { x: 440, y: 160 },
      { x: 600, y: 100 },
      { x: 760, y: 140 },
    ],
  },
  "ai-tools": {
    nodes: [
      {
        id: "chatgpt-basics",
        title: "ChatGPT Mastery",
        description: "Master conversational AI and ChatGPT",
        status: "completed",
        icon: Brain,
        difficulty: "beginner",
        xpReward: 120,
      },
      {
        id: "image-ai",
        title: "AI Image Generation",
        description: "Create stunning visuals with DALL-E, Midjourney",
        status: "available",
        icon: Lightbulb,
        difficulty: "beginner",
        xpReward: 180,
      },
      {
        id: "ai-automation",
        title: "AI Automation",
        description: "Automate workflows with AI tools",
        status: "locked",
        icon: Wrench,
        difficulty: "intermediate",
        xpReward: 250,
      },
      {
        id: "ai-analytics",
        title: "AI Analytics",
        description: "Data analysis and insights with AI",
        status: "locked",
        icon: BarChart,
        difficulty: "advanced",
        xpReward: 300,
      },
    ],
    connections: [
      { from: "chatgpt-basics", to: "image-ai" },
      { from: "image-ai", to: "ai-automation" },
      { from: "ai-automation", to: "ai-analytics" },
    ],
    positions: [
      { x: 200, y: 180 },
      { x: 400, y: 120 },
      { x: 600, y: 180 },
      { x: 750, y: 220 },
    ],
  },
  "advanced-applications": {
    nodes: [
      {
        id: "ai-integration",
        title: "AI Integration",
        description: "Integrate AI into existing systems",
        status: "available",
        icon: Settings,
        difficulty: "intermediate",
        xpReward: 200,
      },
      {
        id: "custom-ai-solutions",
        title: "Custom AI Solutions",
        description: "Build tailored AI applications",
        status: "locked",
        icon: Wrench,
        difficulty: "advanced",
        xpReward: 400,
      },
      {
        id: "ai-deployment",
        title: "AI Deployment",
        description: "Deploy and scale AI solutions",
        status: "locked",
        icon: Rocket,
        difficulty: "expert",
        xpReward: 500,
      },
    ],
    connections: [
      { from: "ai-integration", to: "custom-ai-solutions" },
      { from: "custom-ai-solutions", to: "ai-deployment" },
    ],
    positions: [
      { x: 250, y: 180 },
      { x: 450, y: 140 },
      { x: 650, y: 180 },
    ],
  },
  "ai-strategy": {
    nodes: [
      {
        id: "ai-business-case",
        title: "AI Business Case",
        description: "Build compelling AI business cases",
        status: "completed",
        icon: Briefcase,
        difficulty: "intermediate",
        xpReward: 180,
      },
      {
        id: "ai-team-management",
        title: "AI Team Management",
        description: "Lead AI transformation teams",
        status: "in-progress",
        progress: 40,
        icon: Users,
        difficulty: "advanced",
        xpReward: 300,
      },
      {
        id: "ai-ethics-governance",
        title: "AI Ethics & Governance",
        description: "Responsible AI implementation",
        status: "available",
        icon: Settings,
        difficulty: "advanced",
        xpReward: 250,
      },
      {
        id: "ai-innovation-leadership",
        title: "AI Innovation Leadership",
        description: "Drive organizational AI innovation",
        status: "locked",
        icon: Trophy,
        difficulty: "expert",
        xpReward: 500,
      },
    ],
    connections: [
      { from: "ai-business-case", to: "ai-team-management" },
      { from: "ai-team-management", to: "ai-ethics-governance" },
      { from: "ai-ethics-governance", to: "ai-innovation-leadership" },
    ],
    positions: [
      { x: 180, y: 200 },
      { x: 380, y: 100 },
      { x: 580, y: 180 },
      { x: 720, y: 120 },
    ],
  },
};

export function SkillTreePreview() {
  const {
    hoveredNode,
    selectedPath,
    handleNodeHover,
    handleNodeClick,
    switchPath,
    getConnectionStatus,
  } = useSkillTreeAnimation();

  // Get current path data
  const currentPathData = skillTreeData[selectedPath];
  const currentPath = skillPaths.find((p) => p.id === selectedPath);

  const getNodePosition = (nodeId: string) => {
    const index = currentPathData.nodes.findIndex((node) => node.id === nodeId);
    return currentPathData.positions[index] || { x: 0, y: 0 };
  };

  // Calculate progress for current path
  const completedNodes = currentPathData.nodes.filter(
    (n) => n.status === "completed"
  ).length;
  const totalNodes = currentPathData.nodes.length;
  const progressPercentage = Math.round((completedNodes / totalNodes) * 100);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
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
            Your AI Learning
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Journey
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Follow guided learning paths designed to take you from AI novice to
            expert. Each path is carefully crafted with hands-on projects and
            real-world applications.
          </p>
        </motion.div>

        {/* Path Selector */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {skillPaths.map((path) => (
            <Button
              key={path.id}
              variant={selectedPath === path.id ? "default" : "outline"}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                selectedPath === path.id
                  ? `${path.color} text-white shadow-lg`
                  : "hover:scale-105"
              }`}
              onClick={() => switchPath(path.id)}
            >
              <div className="text-center">
                <div className="font-semibold">{path.title}</div>
                <div className="text-xs opacity-75">{path.description}</div>
              </div>
            </Button>
          ))}
        </motion.div>

        {/* Skill Tree Visualization */}
        <motion.div
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
          style={{ height: "600px" }} // Increased height to prevent overlap
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
              backgroundSize: "20px 20px",
            }}
          />

          {/* Skill Tree Content with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPath}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              {/* Connections */}
              {currentPathData.connections.map((connection, index) => {
                const fromNode = currentPathData.nodes.find(
                  (n) => n.id === connection.from
                );
                const toNode = currentPathData.nodes.find(
                  (n) => n.id === connection.to
                );

                if (!fromNode || !toNode) return null;

                const fromPos = getNodePosition(connection.from);
                const toPos = getNodePosition(connection.to);
                const { isActive, isCompleted } = getConnectionStatus(
                  fromNode,
                  toNode
                );

                return (
                  <motion.div
                    key={`${connection.from}-${connection.to}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ConnectionLine
                      from={fromPos}
                      to={toPos}
                      isActive={isActive}
                      isCompleted={isCompleted}
                      delay={0.5}
                      index={index}
                    />
                  </motion.div>
                );
              })}

              {/* Skill Nodes */}
              {currentPathData.nodes.map((node, index) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  <SkillNode
                    node={node}
                    position={getNodePosition(node.id)}
                    isHighlighted={hoveredNode === node.id}
                    onHover={handleNodeHover}
                    onClick={handleNodeClick}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Enhanced Path Info Panel - moved to bottom with proper spacing */}
          <motion.div
            className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl p-4 border shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Path Info */}
              <div>
                <h3 className="font-semibold text-lg mb-1">
                  {currentPath?.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                  {currentPath?.description}
                </p>
                <div className="text-xs text-gray-500">
                  Estimated time: {currentPath?.estimatedTime}
                </div>
              </div>

              {/* Progress */}
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {completedNodes}/{totalNodes}
                </div>
                <div className="text-xs text-gray-500 mb-2">Completed</div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {progressPercentage}%
                </div>
              </div>

              {/* Career Outcomes */}
              <div>
                <h4 className="font-medium text-sm mb-2">Career Outcomes</h4>
                <div className="space-y-1">
                  {currentPath?.careerOutcomes
                    .slice(0, 3)
                    .map((outcome, index) => (
                      <div
                        key={index}
                        className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
                      >
                        {outcome}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Learning Journey
            <Rocket className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
