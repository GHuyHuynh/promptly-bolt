/**
 * Enhanced Dashboard Integration Example
 * 
 * This file shows how to integrate the new curriculum system
 * with your existing Dashboard component using real Firestore data.
 * 
 * Replace the existing Dashboard.tsx with this implementation
 * to start using the curriculum system.
 */

import React from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  TrendingUp,
  Play,
  ChevronRight,
  Star,
  Award,
  Target,
  Zap
} from 'lucide-react';
import { useDashboard, useXPSystem, useUserCourses } from '../hooks/useCurriculum';
import { XPSystem } from '../utils/xpSystem';

export const EnhancedDashboard: React.FC = () => {
  const { user } = useAuthContext();
  const { dashboardData, loading, error } = useDashboard();
  const { totalXP, currentLevel, levelTitle, xpSummary } = useXPSystem();
  const { userCourses, loading: coursesLoading } = useUserCourses();

  if (loading || coursesLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-neutral-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-6 border-red-200 bg-red-50">
          <p className="text-red-600">Error loading dashboard: {error}</p>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      icon: BookOpen,
      label: 'Courses Completed',
      value: dashboardData?.stats.coursesCompleted?.toString() || '0',
      total: userCourses.length > 0 ? userCourses.length.toString() : null,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Trophy,
      label: 'Certificates Earned',
      value: dashboardData?.stats.certificatesEarned?.toString() || '0',
      total: null,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      icon: Clock,
      label: 'Hours Learned',
      value: Math.floor(dashboardData?.stats.hoursLearned || 0).toString(),
      total: null,
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: TrendingUp,
      label: 'Streak',
      value: dashboardData?.stats.currentStreak?.toString() || '0',
      total: 'days',
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header with XP */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Welcome back, {user?.displayName?.split(' ')[0] || 'Learner'}! 👋
            </h1>
            <p className="text-neutral-600">
              Ready to continue your AI mastery journey? Let's pick up where you left off.
            </p>
          </div>
          
          {/* XP and Level Display */}
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-yellow-600" />
              <span className="text-lg font-semibold text-neutral-900">
                Level {currentLevel} - {levelTitle}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-neutral-600">
                {totalXP} XP {xpSummary && `(${xpSummary.xpForNextLevel} to next level)`}
              </span>
            </div>
            {xpSummary && (
              <div className="w-32 bg-neutral-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${xpSummary.progressToNextLevel * 100}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-bold text-neutral-900">
                  {stat.value}
                  {stat.total && <span className="text-sm text-neutral-500">/{stat.total}</span>}
                </div>
                <div className="text-sm text-neutral-600">{stat.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Current Courses */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-neutral-900">Continue Learning</h2>
              <Button variant="outline" size="sm">
                View All Courses
              </Button>
            </div>

            {dashboardData?.currentCourses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No Active Courses</h3>
                <p className="text-neutral-600 mb-4">
                  Start your learning journey by enrolling in a course
                </p>
                <Button>Browse Courses</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData?.currentCourses.map((course, index) => (
                  <div key={index} className="p-4 bg-neutral-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-neutral-900">{course.title}</h3>
                      <span className="text-sm text-neutral-500">{course.progress}% complete</span>
                    </div>
                    
                    <div className="w-full bg-neutral-200 rounded-full h-2 mb-3">
                      <div 
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-neutral-600">
                        Next: {course.nextLesson}
                      </div>
                      <Button size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Continue ({course.timeLeft})
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-between">
                Browse Courses
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                Practice Projects
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                Join Community
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>

          {/* XP Progress */}
          {xpSummary && (
            <Card className="p-6">
              <h3 className="font-semibold text-neutral-900 mb-4">Level Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Current Level</span>
                  <span className="font-medium">{currentLevel} - {levelTitle}</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${xpSummary.progressToNextLevel * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">{xpSummary.xpInCurrentLevel} XP</span>
                  <span className="text-neutral-600">{xpSummary.xpForNextLevel} to go</span>
                </div>
              </div>
            </Card>
          )}

          {/* Recent Achievements */}
          <Card className="p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Recent Achievements</h3>
            {dashboardData?.recentAchievements.length === 0 ? (
              <div className="text-center py-4">
                <Target className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                <p className="text-sm text-neutral-600">
                  Complete tasks to earn achievements!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {dashboardData?.recentAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                      <Star className="w-4 h-4 text-yellow-600 fill-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-neutral-900">
                        Achievement Unlocked!
                      </div>
                      <div className="text-sm text-neutral-600">
                        Keep learning to unlock more
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};