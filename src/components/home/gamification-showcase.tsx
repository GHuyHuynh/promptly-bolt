"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Zap,
  Target,
  Users,
  Gift,
  Star,
  Flag,
  Award,
  BookOpen,
  Crown,
} from "lucide-react";
import { XPBar } from "@/components/ui/xp-bar";
import { AchievementBadge } from "@/components/ui/achievement-badge";
import { StreakCounter } from "@/components/ui/streak-counter";
import { LeaderboardPreview } from "@/components/ui/leaderboard-preview";
import { Button } from "@/components/ui/button";

// Types
interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  xp: number;
  level: number;
  rank: number;
  trend?: "up" | "down" | "same";
}

// Sample data for demonstrations
const sampleAchievements = [
  {
    id: "first-lesson",
    title: "First Steps",
    description: "Complete your first AI lesson",
    icon: Flag,
    rarity: "common" as const,
    earned: true,
    earnedAt: "2024-01-15",
  },
  {
    id: "prompt-master",
    title: "Prompt Master",
    description: "Create 50 effective prompts",
    icon: Award,
    rarity: "rare" as const,
    earned: true,
    earnedAt: "2024-01-20",
  },
  {
    id: "ai-pioneer",
    title: "AI Pioneer",
    description: "Complete all beginner courses",
    icon: BookOpen,
    rarity: "epic" as const,
    earned: false,
  },
  {
    id: "legend",
    title: "AI Legend",
    description: "Reach level 50 in any path",
    icon: Crown,
    rarity: "legendary" as const,
    earned: true,
    earnedAt: "2024-01-25",
  },
];

const leaderboardUsers: LeaderboardUser[] = [
  {
    id: "1",
    name: "Alex Chen",
    avatar: "/avatars/alex.svg",
    xp: 2450,
    level: 12,
    rank: 1,
    trend: "up",
  },
  {
    id: "2",
    name: "Sarah Kim",
    avatar: "/avatars/sarah.svg",
    xp: 2380,
    level: 11,
    rank: 2,
    trend: "same",
  },
  {
    id: "3",
    name: "Mike Johnson",
    avatar: "/avatars/mike.svg",
    xp: 2250,
    level: 11,
    rank: 3,
    trend: "up",
  },
  {
    id: "4",
    name: "Emma Davis",
    avatar: "/avatars/emma.svg",
    xp: 2100,
    level: 10,
    rank: 4,
    trend: "down",
  },
  {
    id: "5",
    name: "David Wilson",
    avatar: "/avatars/david.svg",
    xp: 1950,
    level: 10,
    rank: 5,
    trend: "up",
  },
];

const currentUser = {
  id: "6",
  name: "You",
  xp: 18500,
  level: 24,
  rank: 12,
  trend: "up" as const,
};

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

export function GamificationShowcase() {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20">
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
            Level Up Your
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {" "}
              Learning
            </span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Experience the most engaging way to learn AI. Earn XP, unlock
            achievements, maintain streaks, and compete with learners worldwide.
          </p>
        </motion.div>

        {/* Main Showcase Grid */}
        <motion.div
          className="grid lg:grid-cols-2 gap-12 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* XP and Progress Section */}
          <motion.div variants={itemVariants} className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-yellow-500" />
                Experience Points
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Earn XP for every lesson completed, quiz passed, and project
                finished. Level up to unlock new content and features.
              </p>

              {/* XP Bar Demo */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <XPBar
                  currentXP={7350}
                  maxXP={10000}
                  level={24}
                  animated={true}
                />
              </div>
            </div>

            {/* Streak Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-orange-500" />
                Daily Streaks
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Build consistent learning habits. The longer your streak, the
                more bonus XP you earn daily.
              </p>

              <div className="flex justify-center">
                <StreakCounter streak={15} maxStreak={20} isActive={true} />
              </div>
            </div>
          </motion.div>

          {/* Achievements and Leaderboard Section */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Trophy className="w-6 h-6 text-purple-500" />
                Achievements
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Unlock badges as you reach learning milestones. From common to
                legendary, collect them all!
              </p>

              <div className="grid grid-cols-4 gap-4">
                {sampleAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.5 + index * 0.1,
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                  >
                    <AchievementBadge achievement={achievement} size="lg" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-500" />
                Global Competition
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Compete with learners worldwide. Weekly challenges and seasonal
                tournaments keep things exciting.
              </p>

              <LeaderboardPreview
                users={leaderboardUsers}
                currentUser={currentUser}
                showTrends={true}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            {
              icon: Gift,
              title: "Reward System",
              description:
                "Unlock exclusive content, special badges, and bonus features as you progress.",
              color: "text-pink-500",
            },
            {
              icon: Star,
              title: "Skill Mastery",
              description:
                "Track your progress across different AI skills and become a certified expert.",
              color: "text-yellow-500",
            },
            {
              icon: Users,
              title: "Community Challenges",
              description:
                "Join team challenges, compete in tournaments, and learn together.",
              color: "text-green-500",
            },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-6`}
              >
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h4 className="text-xl font-bold mb-4">{feature.title}</h4>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Earning XP Today
            <Trophy className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
