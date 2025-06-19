import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useCourseEnrollment } from '../../hooks/useCourse';
import { Loader2, Lock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EnrollmentGuardProps {
  children: React.ReactNode;
  courseId?: string;
  redirectTo?: string;
}

export const EnrollmentGuard: React.FC<EnrollmentGuardProps> = ({
  children,
  courseId: propCourseId,
  redirectTo = '/app/courses'
}) => {
  const params = useParams();
  const courseId = propCourseId || params.courseId;
  
  const { 
    hasAccessToCourse, 
    getEnrollment, 
    enrollInCourse,
    loading 
  } = useCourseEnrollment();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-neutral-600">Checking enrollment status...</p>
        </div>
      </div>
    );
  }

  if (!courseId) {
    return <Navigate to={redirectTo} replace />;
  }

  const hasAccess = hasAccessToCourse(courseId);
  const enrollment = getEnrollment(courseId);

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="max-w-md mx-auto p-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Lock className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Enrollment Required
            </h2>
            <p className="text-neutral-600 mb-6">
              You need to enroll in this course to access its content.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={`/app/courses/${courseId}`}
                className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                View Course
              </Link>
              <Link
                to={redirectTo}
                className="flex-1 bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors"
              >
                Back to Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if enrollment is still active
  if (enrollment) {
    if (enrollment.status === 'cancelled') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="max-w-md mx-auto p-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                Enrollment Cancelled
              </h2>
              <p className="text-neutral-600 mb-6">
                Your enrollment in this course has been cancelled.
              </p>
              <Link
                to={redirectTo}
                className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-block"
              >
                Back to Courses
              </Link>
            </div>
          </div>
        </div>
      );
    }

    if (enrollment.status === 'paused') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="max-w-md mx-auto p-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Lock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                Enrollment Paused
              </h2>
              <p className="text-neutral-600 mb-6">
                Your enrollment in this course is currently paused.
              </p>
              <Link
                to={redirectTo}
                className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors inline-block"
              >
                Back to Courses
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Check if access has expired
    if (enrollment.accessExpiresAt && enrollment.accessExpiresAt < new Date()) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="max-w-md mx-auto p-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                Access Expired
              </h2>
              <p className="text-neutral-600 mb-6">
                Your access to this course has expired.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={`/app/courses/${courseId}`}
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Renew Access
                </Link>
                <Link
                  to={redirectTo}
                  className="flex-1 bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors"
                >
                  Back to Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};