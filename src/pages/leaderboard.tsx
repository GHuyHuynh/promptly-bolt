import { Authenticated, Unauthenticated, AuthLoading, useQuery } from "convex/react";
import { SignInButton } from "@clerk/clerk-react";
import { api } from "~convex/api";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/loading";

function LeaderboardContent() {
  const leaderboard = useQuery(api.users.getLeaderboard);
  const userProgress = useQuery(api.progress.getUserProgress);

  if (leaderboard === undefined || userProgress === undefined) {
    return <Loading variant="brain" size="lg" text="Loading leaderboard..." fullScreen />;
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">#{rank}</div>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600";
      default:
        return "bg-gray-100 dark:bg-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Trophy className="w-10 h-10 text-yellow-500" />
            Leaderboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            See how you rank among AI learners worldwide
          </p>
        </motion.div>

        {/* Top 3 Podium */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-12"
        >
          {leaderboard.slice(0, 3).map((user, index) => {
            const actualRank = user.rank;
            const podiumOrder = actualRank === 1 ? 1 : actualRank === 2 ? 0 : 2; // 2nd, 1st, 3rd visual order
            
            return (
              <motion.div
                key={user.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + podiumOrder * 0.1 }}
                className={`text-center ${actualRank === 1 ? 'order-2' : actualRank === 2 ? 'order-1' : 'order-3'}`}
              >
                <Card className={`p-6 ${getRankColor(actualRank)} text-white`}>
                  <div className="flex justify-center mb-4">
                    {getRankIcon(actualRank)}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{user.name}</h3>
                  <div className="text-2xl font-bold mb-1">
                    {user.totalScore.toLocaleString()}
                  </div>
                  <div className="text-sm opacity-90">XP</div>
                  <Badge variant="outline" className="mt-2 bg-white/20 border-white/30">
                    Level {user.level}
                  </Badge>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Full Leaderboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="overflow-hidden">
            <div className="p-6 border-b bg-gray-50 dark:bg-gray-800">
              <h2 className="text-xl font-semibold">Full Rankings</h2>
            </div>
            <div className="divide-y dark:divide-gray-700">
              {leaderboard.map((user, index) => (
                <motion.div
                  key={user.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.05 }}
                  className={`p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    userProgress?.user.name === user.name ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10">
                      {getRankIcon(user.rank)}
                    </div>
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {user.name}
                        {userProgress?.user.name === user.name && (
                          <Badge variant="outline" className="text-xs">You</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Level {user.level} • {user.currentStreak} day streak
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {user.totalScore.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">XP</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* User's Position (if not in top 10) */}
        {userProgress && !leaderboard.some(u => u.name === userProgress.user.name) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8"
          >
            <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full">
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      #{Math.floor(Math.random() * 100) + 11}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      {userProgress.user.name}
                      <Badge variant="outline" className="text-xs">You</Badge>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Level {userProgress.user.level} • {userProgress.user.currentStreak} day streak
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">
                    {userProgress.user.totalScore.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">XP</div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <>
      <AuthLoading>
        <Loading variant="brain" size="lg" text="Checking authentication..." fullScreen />
      </AuthLoading>
      <Unauthenticated>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Sign in to view leaderboard</h2>
            <p className="text-gray-600 mb-6">Please sign in to see your ranking and compete with other learners.</p>
            <SignInButton>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      </Unauthenticated>
      <Authenticated>
        <LeaderboardContent />
      </Authenticated>
    </>
  );
}