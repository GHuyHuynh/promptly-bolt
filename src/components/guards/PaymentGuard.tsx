import React, { useState, useEffect } from 'react';
import { Navigate, useParams, Link } from 'react-router-dom';
import { useCourseContent, useCourseEnrollment } from '../../hooks/useCourse';
import { useAuthContext } from '../../contexts/AuthContext';
import { Loader2, CreditCard, Lock, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Course, CourseEnrollment } from '../../types/course';

interface PaymentGuardProps {
  children: React.ReactNode;
  courseId?: string;
  redirectTo?: string;
}

export const PaymentGuard: React.FC<PaymentGuardProps> = ({
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
  const [enrollment, setEnrollment] = useState<CourseEnrollment | null>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkPaymentStatus = async () => {
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

        // Get enrollment status
        const userEnrollment = getEnrollment(courseId);
        setEnrollment(userEnrollment);

        // If course is not premium, allow access
        if (!currentCourse.isPremium) {
          setHasAccess(true);
          setLoading(false);
          return;
        }

        // For premium courses, check payment status
        if (userEnrollment) {
          const hasValidPayment = 
            userEnrollment.paymentStatus === 'paid' || 
            userEnrollment.paymentStatus === 'free'; // In case of promotions/admin grants

          setHasAccess(hasValidPayment);
        } else {
          setHasAccess(false);
        }

        setLoading(false);

      } catch (error) {
        console.error('Error checking payment status:', error);
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [courseId, user, getCourse, getEnrollment]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-neutral-600">Checking payment status...</p>
        </div>
      </div>
    );
  }

  if (!courseId || !course) {
    return <Navigate to={redirectTo} replace />;
  }

  // If not a premium course, allow access
  if (!course.isPremium) {
    return <>{children}</>;
  }

  // If user has valid payment, allow access
  if (hasAccess && enrollment?.paymentStatus === 'paid') {
    return <>{children}</>;
  }

  // Handle different payment scenarios
  const renderPaymentStatus = () => {
    if (!enrollment) {
      // Not enrolled at all
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="max-w-md mx-auto p-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Lock className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                Premium Course
              </h2>
              <p className="text-neutral-600 mb-4">
                This is a premium course. You need to enroll and complete payment to access the content.
              </p>
              <div className="bg-neutral-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-neutral-900">Course Price:</span>
                  <span className="text-xl font-bold text-primary-600">
                    ${course.price}
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to={`/app/courses/${courseId}`}
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Enroll Now
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

    if (enrollment.paymentStatus === 'pending') {
      // Payment is pending
      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="max-w-md mx-auto p-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">
                Payment Pending
              </h2>
              <p className="text-neutral-600 mb-4">
                Your payment is being processed. This usually takes a few minutes.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Processing Payment</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  You'll receive access once payment is confirmed.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Refresh Status
                </button>
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

    // Default case - payment required
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="max-w-md mx-auto p-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <CreditCard className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Payment Required
            </h2>
            <p className="text-neutral-600 mb-4">
              You are enrolled in this course but need to complete payment to access the content.
            </p>
            <div className="bg-neutral-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-900">Amount Due:</span>
                <span className="text-xl font-bold text-red-600">
                  ${course.price}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={`/app/courses/${courseId}/payment`}
                className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Complete Payment
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
  };

  return renderPaymentStatus();
};