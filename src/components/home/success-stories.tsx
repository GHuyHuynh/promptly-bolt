"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  TrendingUp,
  Target,
  CheckCircle,
  Users,
  Zap,
  BarChart3,
  MessageSquare,
  Palette,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const learningJourney = [
  {
    stage: "Week 1",
    title: "New to AI",
    description: "Learn the basics of AI communication",
    skills: ["Basic prompting", "AI tool navigation", "Safety guidelines"],
    outcome: "Write your first effective AI prompt",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    stage: "Week 4",
    title: "Building Confidence",
    description: "Apply AI tools to real work scenarios",
    skills: ["Advanced prompting", "Context management", "Output optimization"],
    outcome: "Create professional content with AI assistance",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    stage: "Month 2",
    title: "Workflow Integration",
    description: "Build complex AI-powered workflows",
    skills: ["Multi-step processes", "Tool combinations", "Quality control"],
    outcome: "Automate routine tasks and boost productivity",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    stage: "Month 3",
    title: "Professional Mastery",
    description: "Lead AI initiatives in your workplace",
    skills: ["Strategic implementation", "Team training", "ROI measurement"],
    outcome: "Drive AI adoption and innovation in your organization",
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
  },
];

const realProjects = [
  {
    category: "Marketing",
    title: "Automated Content Calendar",
    description: "Create 30 days of social media content in 2 hours",
    tools: ["ChatGPT", "Claude", "Midjourney"],
    icon: MessageSquare,
    color: "text-blue-600",
    skills: [
      "Content strategy prompting",
      "Image generation",
      "Batch processing",
    ],
  },
  {
    category: "Customer Service",
    title: "AI Response Templates",
    description: "Build intelligent customer support workflows",
    tools: ["ChatGPT", "Claude"],
    icon: Users,
    color: "text-green-600",
    skills: [
      "Customer service prompting",
      "Tone management",
      "Escalation handling",
    ],
  },
  {
    category: "Data Analysis",
    title: "Report Generation",
    description: "Transform raw data into executive summaries",
    tools: ["ChatGPT", "Claude", "Data visualization tools"],
    icon: BarChart3,
    color: "text-purple-600",
    skills: [
      "Data interpretation",
      "Chart analysis",
      "Executive communication",
    ],
  },
  {
    category: "Design",
    title: "Brand Asset Creation",
    description: "Generate logos, graphics, and marketing materials",
    tools: ["Midjourney", "DALL-E", "Stable Diffusion"],
    icon: Palette,
    color: "text-orange-600",
    skills: ["Visual prompting", "Style consistency", "Brand guidelines"],
  },
];

const careerImpact = [
  {
    role: "Marketing Manager",
    growth: "25%",
    metric: "productivity increase",
    skills: ["Content creation", "Campaign optimization", "Market research"],
    industries: ["Tech", "E-commerce", "SaaS"],
  },
  {
    role: "Business Analyst",
    growth: "30%",
    metric: "faster report generation",
    skills: [
      "Data analysis",
      "Process documentation",
      "Stakeholder communication",
    ],
    industries: ["Finance", "Consulting", "Healthcare"],
  },
  {
    role: "Customer Success",
    growth: "40%",
    metric: "response time improvement",
    skills: [
      "Customer communication",
      "Problem solving",
      "Knowledge management",
    ],
    industries: ["SaaS", "Support", "Services"],
  },
  {
    role: "Product Manager",
    growth: "20%",
    metric: "feature planning efficiency",
    skills: [
      "Requirements gathering",
      "User story creation",
      "Competitive analysis",
    ],
    industries: ["Tech", "Startups", "Enterprise"],
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

export function SuccessStories() {
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
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            From Learning to
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {" "}
              Earning
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See how professionals transform their careers with practical AI
            skills. Real projects, measurable outcomes, career advancement.
          </p>
        </motion.div>

        {/* Learning Journey Timeline */}
        <motion.div
          className="mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Your Learning Journey
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {learningJourney.map((stage, index) => (
              <motion.div
                key={stage.stage}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <Card
                  className={`p-6 h-full ${stage.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300`}
                >
                  <div className="space-y-4">
                    {/* Stage Badge */}
                    <div
                      className={`inline-flex px-3 py-1 rounded-full bg-gradient-to-r ${stage.color} text-white text-sm font-bold`}
                    >
                      {stage.stage}
                    </div>

                    {/* Title */}
                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                      {stage.title}
                    </h4>

                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {stage.description}
                    </p>

                    {/* Skills */}
                    <div className="space-y-2">
                      {stage.skills.map((skill) => (
                        <div key={skill} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {skill}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Outcome */}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {stage.outcome}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Arrow for desktop */}
                {index < learningJourney.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Real Projects */}
        <motion.div
          className="mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Real Projects You&apos;ll Build
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {realProjects.map((project) => (
              <motion.div key={project.title} variants={itemVariants}>
                <Card className="p-6 h-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700 ${project.color}`}
                      >
                        <project.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <Badge variant="outline" className="text-xs">
                          {project.category}
                        </Badge>
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                          {project.title}
                        </h4>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300">
                      {project.description}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                          Tools you&apos;ll master:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {project.tools.map((tool) => (
                            <Badge
                              key={tool}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                          Skills you&apos;ll gain:
                        </span>
                        <div className="space-y-1">
                          {project.skills.map((skill) => (
                            <div
                              key={skill}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {skill}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Career Impact */}
        <motion.div
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Career Impact by Role
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {careerImpact.map((impact) => (
              <motion.div key={impact.role} variants={itemVariants}>
                <Card className="p-6 text-center bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <Briefcase className="w-8 h-8 text-blue-600" />
                    </div>

                    <h4 className="font-bold text-lg text-gray-900 dark:text-white">
                      {impact.role}
                    </h4>

                    <div className="flex items-center justify-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-2xl font-bold text-green-600">
                        {impact.growth}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {impact.metric}
                    </p>

                    <div className="space-y-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Key skills:
                      </span>
                      {impact.skills.map((skill) => (
                        <div
                          key={skill}
                          className="text-xs text-gray-600 dark:text-gray-400"
                        >
                          • {skill}
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {impact.industries.map((industry) => (
                          <Badge
                            key={industry}
                            variant="outline"
                            className="text-xs"
                          >
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Transform Your Career?
              </h3>
              <p className="text-blue-100 mb-6">
                Join thousands of professionals who&apos;ve already boosted
                their productivity and career prospects with AI skills.
              </p>
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3"
                asChild
              >
                <Link to="/auth/signup">
                  <Zap className="w-5 h-5 mr-2" />
                  Start Your AI Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}