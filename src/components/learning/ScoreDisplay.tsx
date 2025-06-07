import { motion } from "framer-motion";
import { Star, Zap, Flame, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScoreDisplayProps {
  user: {
    name: string;
    totalScore: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
  };
  className?: string;
}

export function ScoreDisplay({ user, className }: ScoreDisplayProps) {
  const xpToNextLevel = (user.level * 1000) - (user.totalScore % 1000);
  const currentLevelProgress = user.totalScore % 1000;

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-6">
        {/* User Info */}
        <div className="text-center">
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <Badge variant="outline" className="mt-2">
            Level {user.level}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Total Score */}
          <motion.div
            className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-center mb-2">
              <Star className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {user.totalScore.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total XP</div>
          </motion.div>

          {/* Current Streak */}
          <motion.div
            className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-center mb-2">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {user.currentStreak}
            </div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </motion.div>

          {/* Level Progress */}
          <motion.div
            className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {currentLevelProgress}
            </div>
            <div className="text-sm text-gray-600">XP to Level {user.level + 1}</div>
          </motion.div>

          {/* Longest Streak */}
          <motion.div
            className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-center mb-2">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {user.longestStreak}
            </div>
            <div className="text-sm text-gray-600">Best Streak</div>
          </motion.div>
        </div>

        {/* Level Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Level {user.level} Progress</span>
            <span className="text-sm text-gray-500">
              {currentLevelProgress}/1000 XP
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentLevelProgress / 1000) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}