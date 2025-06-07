import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Dashboard } from "@/components/learning/Dashboard";
import { Loading } from "@/components/ui/loading";

export default function DashboardPage() {
  const userProgress = useQuery(api.progress.getUserProgress);
  const modules = useQuery(api.modules.getAllModules);

  if (userProgress === undefined || modules === undefined) {
    return <Loading variant="brain" size="lg" text="Loading your dashboard..." fullScreen />;
  }

  if (!userProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to Promptly!</h2>
          <p className="text-gray-600 mb-6">Let's get you started on your AI learning journey.</p>
          <a
            href="/learn"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Learning
          </a>
        </div>
      </div>
    );
  }

  // Calculate total lessons across all modules
  const totalLessons = modules.reduce((total, module) => {
    // This would need to be calculated properly with lesson counts per module
    return total + 5; // Assuming 5 lessons per module for now
  }, 0);

  // Mock recent activity data
  const recentActivity = [
    {
      type: "lesson" as const,
      title: "Completed: Introduction to AI Prompting",
      timestamp: Date.now() - 86400000, // 1 day ago
      xp: 100,
    },
    {
      type: "achievement" as const,
      title: "Earned: First Lesson Complete!",
      timestamp: Date.now() - 86400000,
    },
  ];

  return (
    <Dashboard
      user={userProgress.user}
      progress={{
        completedLessons: userProgress.completedLessons,
        totalLessons,
        achievements: userProgress.achievements,
      }}
      recentActivity={recentActivity}
    />
  );
}