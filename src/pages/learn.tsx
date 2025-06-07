import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "~convex/api";
import { LessonCard } from "@/components/learning/LessonCard";
import { QuizInterface } from "@/components/learning/QuizInterface";
import { ProgressBar } from "@/components/learning/ProgressBar";
import { Loading } from "@/components/ui/loading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Trophy, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function LearnPage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const modules = useQuery(api.modules.getAllModules);
  const userProgress = useQuery(api.progress.getUserProgress);
  const lessons = selectedModule ? useQuery(api.lessons.getLessonsByModule, { moduleId: selectedModule as any }) : undefined;
  const quiz = selectedModule ? useQuery(api.quizzes.getQuizByModule, { moduleId: selectedModule as any }) : undefined;
  const selectedLessonData = selectedLesson ? useQuery(api.lessons.getLessonById, { lessonId: selectedLesson as any }) : undefined;

  const completeLesson = useMutation(api.progress.completeLesson);
  const submitQuiz = useMutation(api.quizzes.submitQuiz);

  if (modules === undefined || userProgress === undefined) {
    return <Loading variant="brain\" size="lg\" text="Loading learning content...\" fullScreen />;
  }

  if (!userProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please sign in to continue learning</h2>
          <a
            href="/sign-in"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  const handleLessonComplete = async (score: number) => {
    if (!selectedLesson) return;
    
    try {
      await completeLesson({
        lessonId: selectedLesson as any,
        score,
      });
      setSelectedLesson(null);
    } catch (error) {
      console.error("Failed to complete lesson:", error);
    }
  };

  const handleQuizSubmit = async (answers: Array<{ questionId: string; userAnswer: string | number }>) => {
    if (!quiz) return;

    try {
      const result = await submitQuiz({
        quizId: quiz._id,
        answers,
      });
      
      // Show results or navigate back
      alert(`Quiz ${result.passed ? 'passed' : 'failed'}! Score: ${result.totalScore}/${result.maxScore}`);
      setShowQuiz(false);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    }
  };

  // Show individual lesson
  if (selectedLesson && selectedLessonData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Button
            variant="outline"
            onClick={() => setSelectedLesson(null)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lessons
          </Button>

          <Card className="p-8">
            <h1 className="text-3xl font-bold mb-6">{selectedLessonData.title}</h1>
            
            <div className="prose dark:prose-invert max-w-none">
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Introduction</h2>
                <p>{selectedLessonData.content.introduction}</p>
              </div>

              {selectedLessonData.content.sections.map((section, index) => (
                <div key={index} className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                  <p className="mb-4">{section.content}</p>
                  {section.examples && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Examples:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {section.examples.map((example, i) => (
                          <li key={i} className="text-sm">{example}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Key Takeaways</h2>
                <ul className="list-disc list-inside space-y-2">
                  {selectedLessonData.content.keyTakeaways.map((takeaway, index) => (
                    <li key={index}>{takeaway}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-between items-center pt-8 border-t">
              <Badge className="bg-green-100 text-green-800">
                +{selectedLessonData.xpReward} XP
              </Badge>
              <Button
                onClick={() => handleLessonComplete(100)}
                className="bg-green-600 hover:bg-green-700"
              >
                Complete Lesson
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Show quiz
  if (showQuiz && quiz) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Button
            variant="outline"
            onClick={() => setShowQuiz(false)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Module
          </Button>

          <QuizInterface
            quiz={quiz}
            onSubmit={handleQuizSubmit}
            isSubmitting={false}
          />
        </div>
      </div>
    );
  }

  // Show lessons for selected module
  if (selectedModule && lessons) {
    const moduleData = modules.find(m => m._id === selectedModule);
    const completedLessonIds = userProgress.completedLessons.map(p => p.lessonId);

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Button
            variant="outline"
            onClick={() => setSelectedModule(null)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Modules
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">{moduleData?.title}</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{moduleData?.description}</p>
            
            <ProgressBar
              current={lessons.filter(l => completedLessonIds.includes(l._id)).length}
              total={lessons.length}
              label="Module Progress"
              color="blue"
              size="lg"
            />
          </div>

          <div className="grid gap-6 mb-8">
            {lessons.map((lesson, index) => {
              const isCompleted = completedLessonIds.includes(lesson._id);
              const isUnlocked = index === 0 || completedLessonIds.includes(lessons[index - 1]._id);
              const progress = userProgress.completedLessons.find(p => p.lessonId === lesson._id);

              return (
                <LessonCard
                  key={lesson._id}
                  lesson={lesson}
                  isCompleted={isCompleted}
                  isUnlocked={isUnlocked}
                  progress={progress ? { score: progress.score, attempts: 1 } : undefined}
                  onClick={() => setSelectedLesson(lesson._id)}
                />
              );
            })}
          </div>

          {/* Quiz Section */}
          {quiz && (
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Complete all lessons to unlock the module quiz
                  </p>
                </div>
                <div className="text-right">
                  <Badge className="mb-2">+{quiz.xpReward} XP</Badge>
                  <br />
                  <Button
                    onClick={() => setShowQuiz(true)}
                    disabled={lessons.filter(l => completedLessonIds.includes(l._id)).length < lessons.length}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    Take Quiz
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Show module selection
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">AI Learning Modules</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Master AI skills through structured, gamified learning
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <motion.div
              key={module._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="p-6 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300"
                onClick={() => setSelectedModule(module._id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                  <Badge variant="outline">Module {module.order}</Badge>
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{module.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{module.description}</p>
                
                <Button className="w-full">
                  Start Module
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}