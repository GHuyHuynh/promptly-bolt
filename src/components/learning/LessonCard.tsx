import { motion } from "framer-motion";
import { CheckCircle, Lock, Play, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LessonCardProps {
  lesson: {
    _id: string;
    title: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    xpReward: number;
    order: number;
  };
  isCompleted: boolean;
  isUnlocked: boolean;
  progress?: {
    score: number;
    attempts: number;
  };
  onClick: () => void;
}

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  advanced: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export function LessonCard({ lesson, isCompleted, isUnlocked, progress, onClick }: LessonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={isUnlocked ? { scale: 1.02 } : {}}
      whileTap={isUnlocked ? { scale: 0.98 } : {}}
    >
      <Card
        className={cn(
          "p-6 cursor-pointer transition-all duration-300",
          isUnlocked
            ? "hover:shadow-lg border-2 hover:border-blue-300"
            : "opacity-60 cursor-not-allowed",
          isCompleted && "border-green-500 bg-green-50 dark:bg-green-900/10"
        )}
        onClick={isUnlocked ? onClick : undefined}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full",
                isCompleted
                  ? "bg-green-500 text-white"
                  : isUnlocked
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-500"
              )}
            >
              {isCompleted ? (
                <CheckCircle className="w-5 h-5" />
              ) : isUnlocked ? (
                <Play className="w-5 h-5" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{lesson.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={difficultyColors[lesson.difficulty]}>
                  {lesson.difficulty}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{lesson.xpReward} XP</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Lesson {lesson.order}</div>
            {progress && (
              <div className="text-xs text-gray-400 mt-1">
                Score: {progress.score}% • {progress.attempts} attempt{progress.attempts !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {isUnlocked && (
          <Button
            className={cn(
              "w-full",
              isCompleted
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {isCompleted ? "Review Lesson" : "Start Lesson"}
          </Button>
        )}
      </Card>
    </motion.div>
  );
}