import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { useCourseEnrollment } from '../../hooks/useCourse';
import { useCourseContent } from '../../hooks/useCourse';
import { Loader2, Lock, AlertCircle, CreditCard, BookOpen } from 'lucide-react';

interface EnhancedProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireEnrollment?: boolean;
  requirePayment?: boolean;
  checkPrerequisites?: boolean;
  courseId?: string;
  fallbackPath?: string;
}

export const EnhancedProtectedRoute: React.FC<EnhancedProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requireEnrollment = false,
  requirePayment = false,
  checkPrerequisites = false,
  courseId,
  fallbackPath = '/app'
}) => {
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const location = useLocation();
  
  const { 
    hasAccessToCourse, 
    getEnrollment, 
    loading: enrollmentLoading 
  } = useCourseEnrollment();
  
  const { 
    getCourse 
  } = useCourseContent();

  // Basic auth check
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    const from = location.state?.from?.pathname || '/app';
    return <Navigate to={from} replace />;
  }

  // Course-specific checks
  if (requireEnrollment || requirePayment || checkPrerequisites) {
    if (!courseId) {
      console.error('courseId is required for course-specific protected routes');
      return <Navigate to={fallbackPath} replace />;
    }

    if (enrollmentLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
            <p className="text-neutral-600">Checking course access...</p>
          </div>
        </div>
      );
    }

    // Enrollment check
    if (requireEnrollment && !hasAccessToCourse(courseId)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="max-w-md mx-auto text-center p-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <Lock className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                Enrollment Required
              </h2>
              <p className="text-neutral-600 mb-6">
                You need to enroll in this course to access its content.
              </p>
              <button
                onClick={() => window.history.back()}
                className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Payment check for premium courses
    if (requirePayment) {
      const enrollment = getEnrollment(courseId);
      if (enrollment && enrollment.paymentStatus === 'pending') {
        return (
          <div className="min-h-screen flex items-center justify-center bg-neutral-50">
            <div className="max-w-md mx-auto text-center p-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <CreditCard className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                  Payment Required
                </h2>
                <p className="text-neutral-600 mb-6">
                  Complete your payment to access this premium course.
                </p>
                <button
                  onClick={() => window.history.back()}
                  className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Complete Payment
                </button>
              </div>
            </div>
          </div>
        );
      }
    }

    // Prerequisites check
    if (checkPrerequisites) {
      // This would need to be implemented with actual prerequisite checking logic
      // For now, we'll assume prerequisites are met
      console.log('Prerequisites check would be implemented here');
    }
  }

  return <>{children}</>;
};