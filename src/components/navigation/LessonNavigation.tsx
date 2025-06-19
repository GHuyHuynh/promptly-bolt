import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, Lock, Play, ArrowUp } from 'lucide-react';
import { useCourseContent, useCourseProgress } from '../../hooks/useCourse';
import { Lesson } from '../../types/course';

interface LessonNavigationProps {
  courseId?: string;
  currentLessonId?: string;
  onLessonComplete?: (lessonId: string) => void;
  showProgress?: boolean;
  className?: string;
}

export const LessonNavigation: React.FC<LessonNavigationProps> = ({
  courseId: propCourseId,
  currentLessonId: propLessonId,
  onLessonComplete,
  showProgress = true,
  className = ''
}) => {
  const params = useParams();
  const navigate = useNavigate();
  
  const courseId = propCourseId || params.courseId;
  const currentLessonId = propLessonId || params.lessonId;
  
  const { fetchLessons } = useCourseContent();
  const { progress, completeLesson } = useCourseProgress(courseId || '');
  
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    const loadLessons = async () => {
      if (!courseId) return;
      
      try {
        setLoading(true);
        const lessonData = await fetchLessons(courseId);
        setLessons(lessonData.sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error('Error loading lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, [courseId, fetchLessons]);

  const currentLessonIndex = lessons.findIndex(lesson => lesson.id === currentLessonId);
  const currentLesson = lessons[currentLessonIndex];
  const previousLesson = currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < lessons.length - 1 ? lessons[currentLessonIndex + 1] : null;

  const isCurrentLessonCompleted = progress?.completedLessons.includes(currentLessonId || '') || false;
  const completedLessons = progress?.completedLessons || [];

  const canAccessNextLesson = () => {
    if (!nextLesson) return false;
    // Can access next lesson if current lesson is completed or if it's the immediate next lesson
    return isCurrentLessonCompleted || nextLesson.order === (currentLesson?.order || 0) + 1;
  };

  const handleCompleteLesson = async () => {
    if (!currentLessonId || !currentLesson || completing) return;

    try {
      setCompleting(true);
      await completeLesson(currentLessonId, currentLesson.xpReward, 0); // 0 time for now
      onLessonComplete?.(currentLessonId);
    } catch (error) {
      console.error('Error completing lesson:', error);
    } finally {
      setCompleting(false);
    }
  };

  const navigateToLesson = (lessonId: string) => {
    if (courseId) {
      navigate(`/app/courses/${courseId}/lessons/${lessonId}`);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white border-t shadow-sm ${className}`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between animate-pulse">
            <div className="w-24 h-8 bg-neutral-300 rounded"></div>
            <div className="w-32 h-8 bg-neutral-300 rounded"></div>
            <div className="w-24 h-8 bg-neutral-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!courseId || !currentLesson) {
    return null;
  }

  const progressPercentage = lessons.length > 0 ? (completedLessons.length / lessons.length) * 100 : 0;

  return (
    <div className={`bg-white border-t shadow-sm ${className}`}>
      <div className="max-w-4xl mx-auto px-4 py-4">
        {/* Progress bar */}
        {showProgress && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-neutral-600 mb-2">
              <span>Course Progress</span>
              <span>{completedLessons.length} of {lessons.length} lessons completed</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Navigation controls */}
        <div className="flex items-center justify-between">
          {/* Previous lesson */}
          <div className="flex-1">
            {previousLesson ? (
              <Link
                to={`/app/courses/${courseId}/lessons/${previousLesson.id}`}
                className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors group"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <div className="text-left">
                  <div className="text-xs text-neutral-500">Previous</div>
                  <div className="text-sm font-medium truncate max-w-32">
                    {previousLesson.title}
                  </div>
                </div>
              </Link>
            ) : (
              <Link
                to={`/app/courses/${courseId}`}
                className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors group"
              >
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                <div className="text-left">
                  <div className="text-xs text-neutral-500">Back to</div>
                  <div className="text-sm font-medium">Course Overview</div>
                </div>
              </Link>
            )}
          </div>

          {/* Current lesson actions */}
          <div className="flex items-center gap-3">
            {!isCurrentLessonCompleted && (
              <button
                onClick={handleCompleteLesson}
                disabled={completing}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="w-4 h-4" />
                {completing ? 'Completing...' : 'Mark Complete'}
              </button>
            )}
            
            {isCurrentLessonCompleted && (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
          </div>

          {/* Next lesson */}
          <div className="flex-1 flex justify-end">
            {nextLesson ? (
              canAccessNextLesson() ? (
                <Link
                  to={`/app/courses/${courseId}/lessons/${nextLesson.id}`}
                  className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors group"
                >
                  <div className="text-right">
                    <div className="text-xs text-neutral-500">Next</div>
                    <div className="text-sm font-medium truncate max-w-32">
                      {nextLesson.title}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <div className="flex items-center gap-2 text-neutral-400 cursor-not-allowed">
                  <div className="text-right">
                    <div className="text-xs">Next</div>
                    <div className="text-sm font-medium truncate max-w-32">
                      {nextLesson.title}
                    </div>
                  </div>
                  <Lock className="w-4 h-4" />
                </div>
              )
            ) : (
              <Link
                to={`/app/courses/${courseId}`}
                className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors group"
              >
                <div className="text-right">
                  <div className="text-xs">Course</div>
                  <div className="text-sm font-medium">Complete!</div>
                </div>
                <Check className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Lesson info */}
        <div className="mt-4 pt-4 border-t border-neutral-100">
          <div className="flex items-center justify-between text-sm text-neutral-600">
            <span>
              Lesson {currentLesson.order} of {lessons.length}: {currentLesson.title}
            </span>
            <span>{currentLesson.duration} minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
};