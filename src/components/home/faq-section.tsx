"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Clock,
  GraduationCap,
  Wrench,
  Award,
  Users,
  Shield,
  Smartphone,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const faqCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: GraduationCap,
    color: "text-blue-600",
  },
  {
    id: "learning",
    title: "Learning Experience",
    icon: Clock,
    color: "text-green-600",
  },
  {
    id: "tools",
    title: "AI Tools & Skills",
    icon: Wrench,
    color: "text-purple-600",
  },
  {
    id: "certificates",
    title: "Certificates & Recognition",
    icon: Award,
    color: "text-yellow-600",
  },
];

const faqs = [
  {
    category: "getting-started",
    question: "Do I need any technical background to start?",
    answer:
      "Not at all! Promptly is designed for complete beginners. We start with the absolute basics of AI communication and gradually build up your skills. Our most successful learners often come from non-technical backgrounds like marketing, customer service, and management.",
    popular: true,
  },
  {
    category: "getting-started",
    question:
      "How is this different from YouTube tutorials or free online courses?",
    answer:
      "While free resources give you information, Promptly provides structured, interactive practice with immediate feedback. You&apos;ll work on real projects, get personalized guidance, and build a portfolio of AI skills that employers recognize. Plus, our gamification keeps you motivated and engaged.",
  },
  {
    category: "learning",
    question: "How long does it take to see real results?",
    answer:
      "Most users start applying basic AI skills within their first week. By week 4, you&apos;ll be comfortable using AI tools for professional tasks. Complete beginners typically achieve job-relevant proficiency in 6-8 weeks with consistent practice (15-20 minutes daily).",
  },
  {
    category: "learning",
    question: "What if I get stuck on a lesson or concept?",
    answer:
      "We have multiple support layers: in-lesson hints and tips, community forums where you can ask questions, and for Premium users, monthly 1-on-1 mentorship sessions. Our AI-powered help system can also provide personalized guidance based on where you&apos;re struggling.",
  },
  {
    category: "learning",
    question: "Can I learn at my own pace?",
    answer:
      "Absolutely! Lessons are self-paced and available 24/7. Whether you have 10 minutes or 2 hours, you can make progress. The gamification elements like streaks encourage consistency, but there&apos;s no pressure to complete content by specific deadlines.",
  },
  {
    category: "tools",
    question: "Which AI tools will I learn to use?",
    answer:
      "You&apos;ll master the most important AI tools including ChatGPT, Claude, Gemini, Midjourney, DALL-E, and many specialized business tools. We regularly update our curriculum as new tools emerge, so you&apos;ll always be learning the latest and most relevant technologies.",
  },
  {
    category: "tools",
    question: "Do I need to pay for AI tool subscriptions separately?",
    answer:
      "For basic lessons, we provide practice environments that don&apos;t require separate subscriptions. As you advance, we&apos;ll guide you on which tools are worth investing in for your specific goals. Many professional AI tools offer free tiers that are sufficient for learning.",
  },
  {
    category: "certificates",
    question: "Are the certificates recognized by employers?",
    answer:
      "Our certificates focus on practical skill demonstration rather than just completion. Each certificate requires you to complete real projects that showcase your abilities. While we&apos;re working on formal industry partnerships, employers value demonstrated competency over traditional credentials in the AI field.",
  },
  {
    category: "certificates",
    question: "How do I prove my skills to potential employers?",
    answer:
      "Beyond certificates, you&apos;ll build a portfolio of real projects you can share. We also provide guidance on how to discuss AI skills in interviews and demonstrate value to employers. Many learners report improved job prospects within months of starting.",
  },
];

const quickStats = [
  {
    icon: Users,
    stat: "12,847",
    label: "Active learners",
    color: "text-blue-600",
  },
  {
    icon: Clock,
    stat: "15 min",
    label: "Average daily learning",
    color: "text-green-600",
  },
  {
    icon: Zap,
    stat: "6 weeks",
    label: "To job-ready skills",
    color: "text-purple-600",
  },
  {
    icon: Smartphone,
    stat: "24/7",
    label: "Access anywhere",
    color: "text-orange-600",
  },
];

export function FAQSection() {
  const [selectedCategory, setSelectedCategory] = useState("getting-started");
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const filteredFAQs = faqs.filter((faq) => faq.category === selectedCategory);

  const toggleQuestion = (questionId: string) => {
    setOpenQuestion(openQuestion === questionId ? null : questionId);
  };

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
          <div className="flex items-center justify-center gap-3 mb-6">
            <HelpCircle className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
              Frequently Asked
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Questions
              </span>
            </h2>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about learning AI skills with Promptly.
            Can&apos;t find your answer? Ask our community!
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {quickStats.map((stat) => (
            <Card
              key={stat.label}
              className="p-6 text-center bg-gray-50 dark:bg-gray-800 border-0"
            >
              <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.stat}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                {stat.label}
              </div>
            </Card>
          ))}
        </motion.div>

        {/* FAQ Categories */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {faqCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span className="font-medium">{category.title}</span>
            </button>
          ))}
        </motion.div>

        {/* FAQ Content */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="space-y-4">
            <AnimatePresence>
              {filteredFAQs.map((faq, index) => {
                const questionId = `${faq.category}-${index}`;
                const isOpen = openQuestion === questionId;

                return (
                  <motion.div
                    key={questionId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                      <button
                        onClick={() => toggleQuestion(questionId)}
                        className="w-full p-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-start gap-4">
                            {faq.popular && (
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              >
                                Popular
                              </Badge>
                            )}
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-left">
                              {faq.question}
                            </h3>
                          </div>
                          <div className="flex-shrink-0 ml-4">
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="px-6 pb-6">
                              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Still Have Questions CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800">
            <div className="max-w-2xl mx-auto">
              <Shield className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Still Have Questions?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Our community of learners and AI experts is here to help. Join
                thousands of people on the same journey as you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium">
                  Join Community
                </button>
                <button className="px-6 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 font-medium">
                  Contact Support
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                Average response time: Under 4 hours
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
