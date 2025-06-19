import React, { useState, useEffect } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { useCourseContent, useCourseEnrollment } from '../../hooks/useCourse';
import { useAuthContext } from '../../contexts/AuthContext';
import { Loader2, BookOpen, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { Course } from '../../types/course';

interface PrerequisiteGuardProps {
  children: React.ReactNode;
  courseId?: string;
  redirectTo?: string;
}

interface PrerequisiteStatus {
  course: Course;
  isCompleted: boolean;
  isEnrolled: boolean;
}

export const PrerequisiteGuard: React.FC<PrerequisiteGuardProps> = ({
  children,
  courseId: propCourseId,
  redirectTo = '/app/courses'
}) => {
  const { user } = useAuthContext();
  const params = useParams();
  const courseId = propCourseId || params.courseId;
  
  const { getCourse } = useCourseContent();
  const { getEnrollment } = useCourseEnrollment();
  
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [prerequisiteStatuses, setPrerequisiteStatuses] = useState<PrerequisiteStatus[]>([]);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkPrerequisites = async () => {
      if (!courseId || !user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Get the current course
        const currentCourse = await getCourse(courseId);
        if (!currentCourse) {
          setLoading(false);
          return;
        }

        setCourse(currentCourse);

        // If no prerequisites, user can access
        if (!currentCourse.prerequisites || currentCourse.prerequisites.length === 0) {
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // Check each prerequisite
        const statuses: PrerequisiteStatus[] = [];
        let allPrerequisitesMet = true;

        for (const prereqId of currentCourse.prerequisites) {
          const prereqCourse = await getCourse(prereqId);
          if (prereqCourse) {
            const enrollment = getEnrollment(prereqId);
            const isEnrolled = !!enrollment;
            const isCompleted = enrollment?.status === 'completed';

            statuses.push({
              course: prereqCourse,
              isCompleted,
              isEnrolled
            });

            if (!isCompleted) {
              allPrerequisitesMet = false;
            }
          }
        }

        setPrerequisiteStatuses(statuses);
        setHasAccess(allPrerequisitesMet);
        setLoading(false);

      } catch (error) {
        console.error('Error checking prerequisites:', error);
        setLoading(false);
      }
    };

    checkPrerequisites();
  }, [courseId, user, getCourse, getEnrollment]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-neutral-600">Checking prerequisites...</p>
        </div>
      </div>
    );
  }

  if (!courseId || !course) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!hasAccess && prerequisiteStatuses.length > 0) {
    const completedPrereqs = prerequisiteStatuses.filter(status => status.isCompleted).length;
    const totalPrereqs = prerequisiteStatuses.length;

    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="max-w-2xl mx-auto p-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-6">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                Prerequisites Required
              </h2>
              <p className="text-neutral-600">
                You must complete the following courses before accessing{' '}
                <span className="font-medium">{course.title}</span>
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-neutral-700">
                  Progress
                </span>
                <span className="text-sm text-neutral-600">
                  {completedPrereqs} of {totalPrereqs} completed
                </span>
              </div>
              <div className="w-full bg-neutral-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedPrereqs / totalPrereqs) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {prerequisiteStatuses.map((status) => (
                <div
                  key={status.course.id}
                  className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-neutral-500" />
                    <div>
                      <h4 className="font-medium text-neutral-900">
                        {status.course.title}
                      </h4>
                      <p className="text-sm text-neutral-600">
                        {status.course.category} • {status.course.difficulty}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {status.isCompleted ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    ) : status.isEnrolled ? (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="text-sm font-medium">In Progress</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-neutral-500">
                        <XCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Not Started</span>
                      </div>
                    )}
                    <Link
                      to={`/app/courses/${status.course.id}`}
                      className="ml-2 px-3 py-1 text-xs bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200 transition-colors"
                    >
                      {status.isEnrolled ? 'Continue' : 'Start'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={redirectTo}
                className="flex-1 bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors text-center"
              >
                Back to Courses
              </Link>
              {prerequisiteStatuses.some(status => !status.isEnrolled) && (
                <Link
                  to={`/app/courses?category=${course.category}`}
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-center"
                >
                  Browse Prerequisites
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};