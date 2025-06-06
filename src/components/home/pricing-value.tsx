"use client";

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Check,
  Star,
  Zap,
  Crown,
  Shield,
  ArrowRight,
  TrendingUp,
  Clock,
  BookOpen,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const pricingTiers = [
  {
    id: "free",
    name: "Free Explorer",
    price: 0,
    period: "forever",
    description: "Perfect for getting started with AI learning",
    features: [
      "5 lessons per month",
      "Basic achievement system",
      "Community access",
      "Mobile app access",
      "Progress tracking",
    ],
    limitations: [
      "No certificates",
      "Limited AI tools",
      "No 1-on-1 mentorship",
    ],
    cta: "Start Free",
    popular: false,
    color: "from-gray-500 to-gray-600",
    bgColor: "bg-gray-50 dark:bg-gray-800/50",
    icon: BookOpen,
  },
  {
    id: "premium",
    name: "Premium Learner",
    price: 19,
    period: "month",
    description: "For serious learners who want to master AI skills",
    features: [
      "Unlimited lessons & practice",
      "All AI tools & platforms",
      "Industry certificates",
      "1-on-1 monthly mentorship",
      "Priority community support",
      "Advanced analytics",
      "Mobile offline access",
      "Custom learning paths",
    ],
    limitations: [],
    cta: "Start Premium",
    popular: true,
    color: "from-blue-500 to-purple-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    icon: Zap,
  },
  {
    id: "pro",
    name: "Pro Expert",
    price: 39,
    period: "month",
    description: "For professionals leading AI initiatives",
    features: [
      "Everything in Premium",
      "Early access to new content",
      "Weekly 1-on-1 sessions",
      "Custom enterprise integrations",
      "Advanced project templates",
      "White-label certificates",
      "API access for workflows",
      
      "Dedicated success manager",
    ],
    limitations: [],
    cta: "Go Pro",
    popular: false,
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    icon: Crown,
  },
];

const valueComparisons = [
  {
    category: "Traditional Education",
    items: [
      {
        name: "University AI Course",
        price: "$3,000+",
        duration: "1 semester",
        practical: false,
      },
      {
        name: "Online Bootcamp",
        price: "$1,500+",
        duration: "3 months",
        practical: true,
      },
      {
        name: "Corporate Training",
        price: "$2,000+",
        duration: "1 week",
        practical: false,
      },
    ],
  },
  {
    category: "Promptly Premium",
    items: [
      {
        name: "Complete AI Mastery",
        price: "$19/month",
        duration: "Lifetime access",
        practical: true,
      },
      {
        name: "Regular Updates",
        price: "Included",
        duration: "Ongoing",
        practical: true,
      },
      {
        name: "Personal Mentorship",
        price: "Included",
        duration: "Monthly",
        practical: true,
      },
    ],
  },
];

const roiCalculator = {
  averageSalaryIncrease: 22,
  averageProductivityGain: 35,
  timeToResults: 6,
  costPerMonth: 19,
};

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

export function PricingValue() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/20">
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
            Invest in Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              AI Future
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choose the plan that fits your learning goals. All plans include our
            game-like learning experience and practical AI skill development.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          className="grid lg:grid-cols-3 gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {pricingTiers.map((tier) => (
            <motion.div
              key={tier.id}
              variants={cardVariants}
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <Card
                className={`h-full p-8 ${tier.bgColor} ${tier.popular ? "border-blue-500 shadow-xl" : ""} border-2 hover:shadow-xl transition-all duration-300`}
              >
                <div className="space-y-6">
                  {/* Header */}
                  <div className="text-center">
                    <div
                      className={`inline-flex p-3 rounded-full bg-gradient-to-r ${tier.color} text-white mb-4`}
                    >
                      <tier.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {tier.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {tier.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="text-center">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        ${tier.price}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        /{tier.period}
                      </span>
                    </div>
                    {tier.price === 0 && (
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        No credit card required
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    {tier.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}

                    {tier.limitations.map((limitation) => (
                      <div
                        key={limitation}
                        className="flex items-center gap-3 opacity-60"
                      >
                        <div className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0" />
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button
                    className={`w-full py-3 font-semibold ${
                      tier.popular
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        : "border border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                    asChild
                  >
                    <Link to="/auth/signup">
                      {tier.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* ROI Calculator */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Return on Investment Calculator
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                See how Promptly Premium pays for itself in weeks, not years
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-3xl font-bold text-green-600">
                    {roiCalculator.averageSalaryIncrease}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Average salary increase
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Based on AI skill demand
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span className="text-3xl font-bold text-blue-600">
                    {roiCalculator.averageProductivityGain}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Productivity improvement
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Time saved with AI tools
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="text-3xl font-bold text-purple-600">
                    {roiCalculator.timeToResults}
                  </span>
                  <span className="text-lg text-purple-600">weeks</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Time to see results
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Start applying skills immediately
                </p>
              </div>
            </div>

            <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg border">
              <div className="text-center">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                  Your Investment Breakdown
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">
                      Cost per month:
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white ml-2">
                      ${roiCalculator.costPerMonth}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">
                      Cost per day:
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white ml-2">
                      $0.63
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Less than a coffee - for skills that transform careers
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Value Comparison */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Compare Learning Options
          </h3>

          <div className="grid lg:grid-cols-2 gap-8">
            {valueComparisons.map((comparison) => (
              <Card
                key={comparison.category}
                className="p-6 bg-white dark:bg-gray-800"
              >
                <h4
                  className={`text-lg font-bold mb-4 ${
                    comparison.category === "Promptly Premium"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {comparison.category}
                </h4>
                <div className="space-y-4">
                  {comparison.items.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                    >
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {item.duration}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 dark:text-white">
                          {item.price}
                        </div>
                        <div className="flex items-center gap-1">
                          {item.practical ? (
                            <>
                              <Check className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-green-600">
                                Practical
                              </span>
                            </>
                          ) : (
                            <span className="text-xs text-gray-400">
                              Theory only
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="max-w-3xl mx-auto">
              <Shield className="w-12 h-12 mx-auto mb-4 text-blue-200" />
              <h3 className="text-2xl font-bold mb-4">
                30-Day Money-Back Guarantee
              </h3>
              <p className="text-blue-100 mb-6">
                Try Promptly risk-free. If you don&apos;t see improvement in
                your AI skills within 30 days, we&apos;ll refund every penny.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8 py-3"
                  asChild
                >
                  <Link to="/auth/signup">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 px-8 py-3"
                  asChild
                >
                  <Link to="/auth/signin">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}