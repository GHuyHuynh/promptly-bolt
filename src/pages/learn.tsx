import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Trophy, Star } from 'lucide-react';

const LearnPage: React.FC = () => {
  const modules = [
    {
      id: 1,
      title: "Introduction to Programming",
      description: "Learn the fundamentals of programming concepts",
      progress: 100,
      lessons: 8,
      duration: "2 hours",
      difficulty: "Beginner",
      completed: true
    },
    {
      id: 2,
      title: "Data Structures",
      description: "Master arrays, objects, and other data structures",
      progress: 60,
      lessons: 12,
      duration: "4 hours",
      difficulty: "Intermediate",
      completed: false
    },
    {
      id: 3,
      title: "Algorithms",
      description: "Understand sorting, searching, and optimization",
      progress: 0,
      lessons: 15,
      duration: "6 hours",
      difficulty: "Advanced",
      completed: false
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Modules</h1>
        <p className="text-gray-600">Continue your learning journey with our structured modules</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Card key={module.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge className={getDifficultyColor(module.difficulty)}>
                  {module.difficulty}
                </Badge>
                {module.completed && (
                  <Trophy className="h-5 w-5 text-yellow-500" />
                )}
              </div>
              <CardTitle className="text-xl">{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{module.lessons} lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{module.duration}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>{module.progress}%</span>
                  </div>
                  <Progress value={module.progress} className="h-2" />
                </div>

                <Button 
                  className="w-full" 
                  variant={module.completed ? "outline" : "default"}
                >
                  {module.completed ? "Review" : module.progress > 0 ? "Continue" : "Start Learning"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <div className="flex items-center justify-center mb-2">
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <CardTitle>Keep Learning!</CardTitle>
            <CardDescription>
              Complete modules to unlock achievements and climb the leaderboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              View Achievements
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearnPage;