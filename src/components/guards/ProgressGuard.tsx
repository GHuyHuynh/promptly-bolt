import React, { useState, useEffect } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { useCourseContent, useCourseProgress } from '../../hooks/useCourse';
import { useAuthContext } from '../../contexts/AuthContext';
import { Loader2, Lock, ChevronRight, CheckCircle, PlayCircle } from 'lucide-react';
import { Course, Lesson } from '../../types/course';

interface ProgressGuardProps {
  children: React.ReactNode;
  courseId?: string;
  lessonId?: string;
  requireSequential?: boolean;
  redirectTo?: string;
}

export const ProgressGuard: React.FC<ProgressGuardProps> = ({
  children,
  courseId: propCourseId,
  lessonId: propLessonId,
  requireSequential = true,
  redirectTo = '/app/courses'
}) => {
  const { user } = useAuthContext();
  const params = useParams();
  const courseId = propCourseId || params.courseId;
  const lessonId = propLessonId || params.lessonId;
  
  const { getCourse, fetchLessons } = useCourseContent();
  const { progress } = useCourseProgress(courseId || '');
  
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [hasAccess, setHasAccess] = useState(false);
  const [nextAvailableLesson, setNextAvailableLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    const checkProgress = async () => {
      if (!courseId || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Get course and lessons
        const [currentCourse, courseLessons] = await Promise.all([
          getCourse(courseId),
          fetchLessons(courseId)
        ]);

        if (!currentCourse || !courseLessons) {
          setLoading(false);
          return;
        }

        setCourse(currentCourse);
        setLessons(courseLessons);

        // If no specific lesson is requested, allow access to course overview
        if (!lessonId) {
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // If sequential progress is not required, allow access to any lesson
        if (!requireSequential) {
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // Find the requested lesson
        const requestedLesson = courseLessons.find(lesson => lesson.id === lessonId);
        if (!requestedLesson) {
          setLoading(false);
          return;
        }

        // Sort lessons by order
        const sortedLessons = [...courseLessons].sort((a, b) => a.order - b.order);
        const requestedLessonIndex = sortedLessons.findIndex(lesson => lesson.id === lessonId);

        if (requestedLessonIndex === -1) {
          setLoading(false);
          return;
        }

        // Check if this is the first lesson or all previous lessons are completed
        const isFirstLesson = requestedLessonIndex === 0;
        let canAccessLesson = isFirstLesson;

        if (!isFirstLesson && progress) {
          // Check if all previous lessons are completed
          const previousLessons = sortedLessons.slice(0, requestedLessonIndex);
          const allPreviousCompleted = previousLessons.every(lesson => 
            progress.completedLessons.includes(lesson.id)
          );
          canAccessLesson = allPreviousCompleted;

          // If not all previous lessons are completed, find the next available lesson
          if (!allPreviousCompleted) {
            const nextLesson = previousLessons.find(lesson => 
              !progress.completedLessons.includes(lesson.id)
            );
            setNextAvailableLesson(nextLesson || sortedLessons[0]);
          }
        } else if (!isFirstLesson && !progress) {
          // No progress recorded, can only access first lesson
          setNextAvailableLesson(sortedLessons[0]);
        }

        setHasAccess(canAccessLesson);
        setLoading(false);

      } catch (error) {
        console.error('Error checking progress:', error);
        setLoading(false);
      }
    };

    checkProgress();
  }, [courseId, lessonId, user, requireSequential, getCourse, fetchLessons, progress]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-neutral-600">Checking lesson progress...</p>
        </div>
      </div>
    );
  }

  if (!courseId || !course) {
    return <Navigate to={redirectTo} replace />;
  }

  // If accessing course overview (no specific lesson), allow access
  if (!lessonId || hasAccess) {
    return <>{children}</>;
  }

  // Block access and show progress requirement
  const currentLesson = lessons.find(lesson => lesson.id === lessonId);
  const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);
  const completedLessons = progress?.completedLessons || [];

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="max-w-2xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Complete Previous Lessons
            </h2>
            <p className="text-neutral-600">
              You need to complete previous lessons before accessing{' '}
              <span className="font-medium">{currentLesson?.title}</span>
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-neutral-700">
                Course Progress
              </span>
              <span className="text-sm text-neutral-600">
                {completedLessons.length} of {lessons.length} lessons completed
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
            {sortedLessons.map((lesson, index) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const isCurrent = lesson.id === lessonId;
              const isNext = lesson.id === nextAvailableLesson?.id;
              const canAccess = index === 0 || sortedLessons.slice(0, index).every(l => 
                completedLessons.includes(l.id)
              );

              return (
                <div
                  key={lesson.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    isCurrent
                      ? 'border-primary-200 bg-primary-50'
                      : isCompleted
                      ? 'border-green-200 bg-green-50'
                      : canAccess
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-neutral-200 bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : canAccess ? (
                        <PlayCircle className="w-5 h-5 text-yellow-600" />
                      ) : (
                        <Lock className="w-5 h-5 text-neutral-400" />
                      )}
                    </div>
                    <div>
                      <h4 className={`font-medium ${
                        isCurrent ? 'text-primary-900' : 'text-neutral-900'
                      }`}>
                        {lesson.title}
                      </h4>
                      <p className="text-sm text-neutral-600">
                        {lesson.duration} minutes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isCurrent && (
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                        Requested
                      </span>
                    )}
                    {isNext && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                        Next
                      </span>
                    )}
                    {canAccess && !isCompleted && (
                      <Link
                        to={`/app/courses/${courseId}/lessons/${lesson.id}`}
                        className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full hover:bg-primary-200 transition-colors"
                      >
                        Start
                      </Link>
                    )}
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={`/app/courses/${courseId}`}
              className="flex-1 bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors text-center"
            >
              Back to Course
            </Link>
            {nextAvailableLesson && (
              <Link
                to={`/app/courses/${courseId}/lessons/${nextAvailableLesson.id}`}
                className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-center"
              >
                Start Next Lesson
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};