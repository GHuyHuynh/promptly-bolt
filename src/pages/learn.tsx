import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Clock, Trophy, Star, CheckCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { firebaseApi, User as FirebaseUser } from '@/services/firebaseApi';

const PromptingLesson: React.FC<{ onComplete: (score: number) => void; userId: string }> = ({ onComplete, userId }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userPrompt, setUserPrompt] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);

  const lessonSteps = [
    {
      title: "What is Prompt Engineering?",
      content: "Prompt engineering is the art of crafting effective instructions for AI models. A well-written prompt can dramatically improve the quality and relevance of AI responses.",
      type: "content"
    },
    {
      title: "Key Principles",
      content: "1. Be specific and clear\n2. Provide context\n3. Use examples when helpful\n4. Specify the desired format\n5. Iterate and refine",
      type: "content"
    },
    {
      title: "Practice Exercise",
      content: "Write a prompt to help someone create a professional email to request a meeting with their manager about a promotion discussion.",
      type: "exercise",
      expectedElements: ["professional tone", "meeting request", "promotion", "manager"],
      sampleAnswer: "Please help me write a professional email to my manager requesting a meeting to discuss my career advancement and potential promotion opportunities. The email should be respectful, concise, and suggest a few time slots for the meeting."
    }
  ];

  const currentStepData = lessonSteps[currentStep];

  const evaluatePrompt = (prompt: string) => {
    const elements = currentStepData.expectedElements || [];
    let foundElements = 0;
    let feedback = "Your prompt analysis:\n\n";

    elements.forEach(element => {
      if (prompt.toLowerCase().includes(element.toLowerCase()) || 
          (element === "professional tone" && (prompt.includes("professional") || prompt.includes("formal"))) ||
          (element === "meeting request" && (prompt.includes("meeting") || prompt.includes("schedule"))) ||
          (element === "promotion" && (prompt.includes("promotion") || prompt.includes("advancement") || prompt.includes("career"))) ||
          (element === "manager" && (prompt.includes("manager") || prompt.includes("supervisor") || prompt.includes("boss")))) {
        foundElements++;
        feedback += `✅ Includes ${element}\n`;
      } else {
        feedback += `❌ Missing ${element}\n`;
      }
    });

    const scorePercentage = Math.round((foundElements / elements.length) * 100);
    feedback += `\nScore: ${scorePercentage}%\n\n`;

    if (scorePercentage >= 80) {
      feedback += "Excellent work! Your prompt is clear and comprehensive.";
    } else if (scorePercentage >= 60) {
      feedback += "Good effort! Try to include more specific details.";
    } else {
      feedback += "Keep practicing! Focus on being more specific and including all key elements.";
    }

    setScore(scorePercentage);
    setFeedback(feedback);
  };

  const handleNext = () => {
    if (currentStep < lessonSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setUserPrompt('');
      setFeedback('');
    } else {
      onComplete(score);
    }
  };

  const handleSubmitPrompt = () => {
    evaluatePrompt(userPrompt);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Introduction to Prompt Engineering</h2>
          <Badge variant="outline">
            Step {currentStep + 1} of {lessonSteps.length}
          </Badge>
        </div>
        <Progress value={((currentStep + 1) / lessonSteps.length) * 100} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            {currentStepData.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose max-w-none">
            <p className="whitespace-pre-line text-gray-700">
              {currentStepData.content}
            </p>
          </div>

          {currentStepData.type === "exercise" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Your Prompt:
                </label>
                <Textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="Write your prompt here..."
                  className="min-h-[120px]"
                />
              </div>

              {!feedback && (
                <Button 
                  onClick={handleSubmitPrompt}
                  disabled={!userPrompt.trim()}
                  className="w-full"
                >
                  Submit Prompt
                </Button>
              )}

              {feedback && (
                <div className="space-y-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-4">
                      <pre className="whitespace-pre-line text-sm text-gray-700">
                        {feedback}
                      </pre>
                    </CardContent>
                  </Card>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Sample Answer:</h4>
                    <p className="text-sm text-gray-600 italic">
                      {currentStepData.sampleAnswer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={currentStepData.type === "exercise" && !feedback}
            >
              {currentStep === lessonSteps.length - 1 ? "Complete Lesson" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const LearnPage: React.FC = () => {
  const [showLesson, setShowLesson] = useState(false);
  const [lessonCompleted, setLessonCompleted] = useState(false);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Load sample user data
  useEffect(() => {
    firebaseApi.users.getSampleUser().then((userData) => {
      setUser(userData);
      setLoading(false);
    });
  }, []);

  const handleStartLesson = () => {
    setShowLesson(true);
  };

  const handleLessonComplete = async (score: number) => {
    if (!user) {
      console.error("No user found");
      return;
    }

    try {
      // Create lesson progress
      await firebaseApi.progress.createProgress({
        userId: user.id!,
        lessonId: "lesson1",
        completed: true,
        score: score,
      });

      // Update user XP
      const xpGained = Math.round(score * 2);
      await firebaseApi.users.updateUserProgress({
        userId: user.id!,
        xpGained: xpGained,
        streakUpdate: true,
      });

      setLessonCompleted(true);
      setShowLesson(false);
    } catch (error) {
      console.error("Error completing lesson:", error);
    }
  };

  if (showLesson && user) {
    return <PromptingLesson onComplete={handleLessonComplete} userId={user.id!} />;
  }

  const mockModules = [
    {
      id: 1,
      title: "Introduction to Prompt Engineering",
      description: "Learn the fundamentals of crafting effective AI prompts",
      progress: lessonCompleted ? 100 : 0,
      lessons: 1,
      duration: "15 minutes",
      difficulty: "Beginner",
      completed: lessonCompleted
    },
    {
      id: 2,
      title: "Advanced Prompting Techniques",
      description: "Master complex prompting strategies and best practices",
      progress: 0,
      lessons: 5,
      duration: "1 hour",
      difficulty: "Intermediate",
      completed: false
    },
    {
      id: 3,
      title: "AI Tool Integration",
      description: "Learn to integrate AI tools into your workflow",
      progress: 0,
      lessons: 8,
      duration: "2 hours",
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

  // Show loading state while user is being loaded
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your learning environment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600">Error loading user data. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Modules</h1>
        <p className="text-gray-600">Master AI skills through interactive lessons and hands-on practice</p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Welcome, {user.name}!</strong> You're currently at Level {user.level} with {user.totalScore} XP.
          </p>
        </div>
      </div>

      {lessonCompleted && (
        <Card className="mb-6 bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-800">Lesson Completed!</h3>
                <p className="text-green-600">Great job completing your first prompt engineering lesson.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockModules.map((module) => (
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
                    <span>{module.lessons} lesson{module.lessons !== 1 ? 's' : ''}</span>
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
                  onClick={module.id === 1 ? handleStartLesson : undefined}
                  disabled={module.id !== 1}
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
              Complete lessons to earn XP, maintain your streak, and climb the leaderboard
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