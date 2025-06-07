import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  question: string;
  type: "multiple_choice" | "true_false" | "text_input";
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  points: number;
}

interface QuizInterfaceProps {
  quiz: {
    _id: string;
    title: string;
    questions: Question[];
    passingScore: number;
    xpReward: number;
  };
  onSubmit: (answers: Array<{ questionId: string; userAnswer: string | number }>) => void;
  isSubmitting: boolean;
}

export function QuizInterface({ quiz, onSubmit, isSubmitting }: QuizInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const allQuestionsAnswered = quiz.questions.every(q => answers[q.id] !== undefined);

  const handleAnswer = (questionId: string, answer: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResults(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex(prev => prev - 1);
  };

  const handleSubmit = () => {
    const formattedAnswers = quiz.questions.map(q => ({
      questionId: q.id,
      userAnswer: answers[q.id],
    }));
    onSubmit(formattedAnswers);
  };

  const renderQuestion = (question: Question) => {
    const userAnswer = answers[question.id];

    switch (question.type) {
      case "multiple_choice":
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <motion.button
                key={index}
                className={cn(
                  "w-full p-4 text-left rounded-lg border-2 transition-all duration-200",
                  userAnswer === index
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                )}
                onClick={() => handleAnswer(question.id, index)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2",
                      userAnswer === index
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    )}
                  >
                    {userAnswer === index && (
                      <div className="w-full h-full rounded-full bg-white scale-50" />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </motion.button>
            ))}
          </div>
        );

      case "true_false":
        return (
          <div className="flex gap-4">
            {["True", "False"].map((option, index) => (
              <motion.button
                key={option}
                className={cn(
                  "flex-1 p-4 rounded-lg border-2 transition-all duration-200",
                  userAnswer === index
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                )}
                onClick={() => handleAnswer(question.id, index)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                {option}
              </motion.button>
            ))}
          </div>
        );

      case "text_input":
        return (
          <input
            type="text"
            className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800"
            placeholder="Type your answer here..."
            value={userAnswer as string || ""}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
          />
        );

      default:
        return null;
    }
  };

  if (showResults) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Submit?</h2>
        <p className="text-gray-600 mb-6">
          You've answered all {quiz.questions.length} questions. 
          You need {quiz.passingScore} points to pass this quiz.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => {
              setShowResults(false);
              setCurrentQuestionIndex(0);
            }}
          >
            Review Answers
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <Badge variant="outline">
            {quiz.xpReward} XP
          </Badge>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {currentQuestion.question}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{currentQuestion.points} points</span>
              </div>
            </div>

            {renderQuestion(currentQuestion)}
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="text-sm text-gray-500">
          {Object.keys(answers).length} of {quiz.questions.length} answered
        </div>

        <Button
          onClick={handleNext}
          disabled={answers[currentQuestion.id] === undefined}
        >
          {isLastQuestion ? "Review" : "Next"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}