"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  AlertCircle,
  Star,
  ArrowRight,
  Play,
  RotateCcw,
  Lightbulb,
  Target,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScoreItem {
  id: string;
  label: string;
  points: number;
  achieved: boolean;
  suggestion?: string;
}

const demoChallenge = {
  title: "Prompt Engineering Challenge",
  description:
    "Write a prompt to help a marketing manager create a social media post for a coffee shop's new seasonal drink",
  placeholder: "Enter your prompt here...",
  sampleResponse:
    "Create an engaging Instagram post for our new pumpkin spice latte, highlighting the cozy autumn vibes and limited-time availability",
  maxScore: 100,
};

const scoringCriteria: ScoreItem[] = [
  {
    id: "specific-product",
    label: "Specific product mentioned",
    points: 20,
    achieved: false,
  },
  {
    id: "platform-specified",
    label: "Platform specified",
    points: 15,
    achieved: false,
  },
  {
    id: "emotional-tone",
    label: "Emotional tone included",
    points: 25,
    achieved: false,
  },
  {
    id: "urgency-scarcity",
    label: "Urgency/scarcity element",
    points: 20,
    achieved: false,
  },
  {
    id: "call-to-action",
    label: "Clear call-to-action",
    points: 20,
    achieved: false,
    suggestion: 'Try adding "Visit us today" or "Order now"',
  },
];

export function InteractiveDemo() {
  const [userInput, setUserInput] = useState("");
  const [currentScore, setCurrentScore] = useState(0);
  const [evaluatedCriteria, setEvaluatedCriteria] =
    useState<ScoreItem[]>(scoringCriteria);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const evaluatePrompt = (input: string) => {
    const lowerInput = input.toLowerCase();

    const newCriteria = scoringCriteria.map((criterion) => {
      let achieved = false;

      switch (criterion.id) {
        case "specific-product":
          achieved =
            lowerInput.includes("pumpkin spice") ||
            lowerInput.includes("latte") ||
            lowerInput.includes("drink") ||
            lowerInput.includes("beverage");
          break;
        case "platform-specified":
          achieved =
            lowerInput.includes("instagram") ||
            lowerInput.includes("facebook") ||
            lowerInput.includes("social media") ||
            lowerInput.includes("post");
          break;
        case "emotional-tone":
          achieved =
            lowerInput.includes("cozy") ||
            lowerInput.includes("warm") ||
            lowerInput.includes("autumn") ||
            lowerInput.includes("fall") ||
            lowerInput.includes("seasonal") ||
            lowerInput.includes("vibes");
          break;
        case "urgency-scarcity":
          achieved =
            lowerInput.includes("limited") ||
            lowerInput.includes("seasonal") ||
            lowerInput.includes("while supplies last") ||
            lowerInput.includes("limited time");
          break;
        case "call-to-action":
          achieved =
            lowerInput.includes("visit") ||
            lowerInput.includes("try") ||
            lowerInput.includes("order") ||
            lowerInput.includes("get") ||
            lowerInput.includes("come");
          break;
      }

      return { ...criterion, achieved };
    });

    return newCriteria;
  };

  const handleEvaluate = async () => {
    if (!userInput.trim()) return;

    setIsEvaluating(true);

    // Simulate evaluation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newCriteria = evaluatePrompt(userInput);
    setEvaluatedCriteria(newCriteria);

    const score = newCriteria.reduce(
      (total, item) => total + (item.achieved ? item.points : 0),
      0
    );
    setCurrentScore(score);

    setShowResults(true);
    setIsEvaluating(false);
  };

  const handleReset = () => {
    setUserInput("");
    setCurrentScore(0);
    setEvaluatedCriteria(scoringCriteria);
    setShowResults(false);
  };

  const handleTrySample = () => {
    setUserInput(demoChallenge.sampleResponse);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-indigo-900/20 dark:via-blue-900/20 dark:to-purple-900/20">
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
            Experience Promptly in
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              60 Seconds
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Try our interactive demo to see how Promptly makes learning AI
            practical and engaging. No signup required!
          </p>
        </motion.div>

        {/* Demo Interface */}
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Challenge Input */}
            <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      {demoChallenge.title}
                    </h3>
                    <Badge variant="secondary" className="mt-1">
                      Lesson 1 of 200+
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {demoChallenge.description}
                </p>

                <div className="space-y-4">
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={demoChallenge.placeholder}
                    className="w-full h-32 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    disabled={isEvaluating}
                  />

                  <div className="flex gap-3">
                    <Button
                      onClick={handleEvaluate}
                      disabled={!userInput.trim() || isEvaluating}
                      className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      {isEvaluating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Evaluating...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Evaluate Prompt
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleTrySample}
                      disabled={isEvaluating}
                      className="whitespace-nowrap"
                    >
                      Try Sample
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleReset}
                      disabled={isEvaluating}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Right: Real-time Feedback */}
            <Card className="p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      Real-time Scoring
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {currentScore}/{demoChallenge.maxScore}
                    </div>
                    <div className="text-sm text-gray-500">points</div>
                  </div>
                </div>

                {/* Scoring Criteria */}
                <div className="space-y-3">
                  <AnimatePresence>
                    {evaluatedCriteria.map((criterion, index) => (
                      <motion.div
                        key={criterion.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: showResults ? index * 0.1 : 0 }}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          criterion.achieved
                            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                            : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600"
                        }`}
                      >
                        {criterion.achieved ? (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-500" />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {criterion.label}
                            </span>
                            <span
                              className={`font-bold ${
                                criterion.achieved
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-gray-400"
                              }`}
                            >
                              +{criterion.points}
                            </span>
                          </div>
                          {!criterion.achieved &&
                            criterion.suggestion &&
                            showResults && (
                              <div className="flex items-center gap-2 mt-1">
                                <AlertCircle className="w-3 h-3 text-amber-500" />
                                <span className="text-xs text-amber-600 dark:text-amber-400">
                                  {criterion.suggestion}
                                </span>
                              </div>
                            )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Results Action */}
                {showResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="pt-4 border-t border-gray-200 dark:border-gray-600"
                  >
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="font-bold text-gray-900 dark:text-white">
                          {currentScore >= 80
                            ? "Excellent work!"
                            : currentScore >= 60
                              ? "Good effort!"
                              : "Keep practicing!"}
                        </span>
                      </div>
                      <Button
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        asChild
                      >
                        <Link to="/auth/signup">
                          <Zap className="w-4 h-4 mr-2" />
                          Start Learning - Lesson 1 Free
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This was just one lesson. We have 200+ interactive lessons covering
            all major AI tools.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="px-4 py-2">
              ✓ ChatGPT Mastery
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              ✓ Claude Expertise
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              ✓ Midjourney Creation
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              ✓ Business Applications
            </Badge>
          </div>
        </motion.div>
      </div>
    </section>
  );
}