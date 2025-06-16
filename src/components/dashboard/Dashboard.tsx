import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  TrendingUp,
  Play,
  ChevronRight,
  Star
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuthContext();

  const stats = [
    {
      icon: BookOpen,
      label: 'Courses Completed',
      value: '3',
      total: '6',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Trophy,
      label: 'Certificates Earned',
      value: '2',
      total: null,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      icon: Clock,
      label: 'Hours Learned',
      value: '47',
      total: null,
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: TrendingUp,
      label: 'Streak',
      value: '12',
      total: 'days',
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  const currentCourses = [
    {
      title: 'Deep Learning & Neural Networks',
      progress: 65,
      nextLesson: 'Convolutional Neural Networks',
      timeLeft: '2h 30m'
    },
    {
      title: 'Natural Language Processing',
      progress: 30,
      nextLesson: 'Text Preprocessing',
      timeLeft: '4h 15m'
    }
  ];

  const achievements = [
    { title: 'First Steps', description: 'Completed your first AI lesson', earned: true },
    { title: 'Quick Learner', description: 'Finished 3 lessons in one day', earned: true },
    { title: 'Consistent', description: 'Maintained a 7-day streak', earned: true },
    { title: 'Expert', description: 'Completed advanced neural networks', earned: false }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Welcome back, {user?.displayName?.split(' ')[0] || 'Learner'}! 👋
        </h1>
        <p className="text-neutral-600">
          Ready to continue your AI mastery journey? Let's pick up where you left off.
        </p>
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

            <div className="space-y-4">
              {currentCourses.map((course, index) => (
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

          {/* Recent Achievements */}
          <Card className="p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">Achievements</h3>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    achievement.earned ? 'bg-yellow-100' : 'bg-neutral-100'
                  }`}>
                    <Star className={`w-4 h-4 ${
                      achievement.earned ? 'text-yellow-600 fill-yellow-600' : 'text-neutral-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className={`font-medium ${
                      achievement.earned ? 'text-neutral-900' : 'text-neutral-500'
                    }`}>
                      {achievement.title}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {achievement.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};