import { motion } from "framer-motion";
import { BookOpen, Trophy, Target, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "./ProgressBar";
import { ScoreDisplay } from "./ScoreDisplay";

interface DashboardProps {
  user: {
    name: string;
    totalScore: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
  };
  progress: {
    completedLessons: Array<{ lessonId: string; score: number }>;
    totalLessons: number;
    achievements: Array<{
      type: string;
      title: string;
      description: string;
      earnedAt: number;
    }>;
  };
  recentActivity: Array<{
    type: "lesson" | "quiz" | "achievement";
    title: string;
    timestamp: number;
    xp?: number;
  }>;
}

export function Dashboard({ user, progress, recentActivity }: DashboardProps) {
  const completionPercentage = Math.round(
    (progress.completedLessons.length / progress.totalLessons) * 100
  );

  const recentAchievements = progress.achievements
    .sort((a, b) => b.earnedAt - a.earnedAt)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Continue your AI learning journey
        </p>
      </motion.div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Score Display */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ScoreDisplay user={user} />
        </motion.div>

        {/* Middle Column - Progress Overview */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Overall Progress */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Learning Progress
            </h3>
            <ProgressBar
              current={progress.completedLessons.length}
              total={progress.totalLessons}
              label="Lessons Completed"
              color="green"
              size="lg"
            />
            <div className="mt-4 text-center">
              <span className="text-2xl font-bold text-green-600">
                {completionPercentage}%
              </span>
              <span className="text-gray-500 ml-2">Complete</span>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <div className="text-xl font-bold">{progress.completedLessons.length}</div>
              <div className="text-sm text-gray-600">Lessons Done</div>
            </Card>
            <Card className="p-4 text-center">
              <Trophy className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
              <div className="text-xl font-bold">{progress.achievements.length}</div>
              <div className="text-sm text-gray-600">Achievements</div>
            </Card>
          </div>
        </motion.div>

        {/* Right Column - Recent Activity & Achievements */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Recent Achievements */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Recent Achievements
            </h3>
            <div className="space-y-3">
              {recentAchievements.length > 0 ? (
                recentAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.title}
                    className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Trophy className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">{achievement.title}</div>
                      <div className="text-xs text-gray-600">{achievement.description}</div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <Trophy className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No achievements yet</p>
                  <p className="text-xs">Complete lessons to earn your first achievement!</p>
                </div>
              )}
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.slice(0, 5).map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div>
                      <div className="font-medium text-sm">{activity.title}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                    {activity.xp && (
                      <Badge variant="outline" className="text-xs">
                        +{activity.xp} XP
                      </Badge>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent activity</p>
                  <p className="text-xs">Start a lesson to see your progress here!</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}