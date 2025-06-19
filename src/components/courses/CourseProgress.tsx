import React from 'react';
import { CourseProgress as CourseProgressType, Course } from '../../types/course';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

interface CourseProgressProps {
  course: Course;
  progress: CourseProgressType;
  className?: string;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const CourseProgress: React.FC<CourseProgressProps> = ({
  course,
  progress,
  className,
  showDetails = true,
  size = 'md',
}) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getProgressText = (percentage: number) => {
    if (percentage >= 100) return 'Completed';
    if (percentage >= 75) return 'Almost there';
    if (percentage >= 50) return 'Halfway through';
    if (percentage >= 25) return 'Good progress';
    return 'Just started';
  };

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const progressBarSizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const textSizes = {
    sm: { title: 'text-base', subtitle: 'text-sm', detail: 'text-xs' },
    md: { title: 'text-lg', subtitle: 'text-base', detail: 'text-sm' },
    lg: { title: 'text-xl', subtitle: 'text-lg', detail: 'text-base' },
  };

  return (
    <Card className={cn(sizeClasses[size], className)}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className={cn('font-semibold text-gray-900 line-clamp-2', textSizes[size].title)}>
              {course.title}
            </h3>
            {showDetails && (
              <p className={cn('text-gray-600 mt-1', textSizes[size].detail)}>
                {course.category} • {course.difficulty}
              </p>
            )}
          </div>
          {progress.completedAt && (
            <div className="flex items-center ml-4">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className={cn('font-medium text-gray-700', textSizes[size].detail)}>
              Progress
            </span>
            <div className="flex items-center space-x-2">
              <span className={cn('font-bold text-gray-900', textSizes[size].subtitle)}>
                {Math.round(progress.progressPercentage)}%
              </span>
              <span className={cn('text-gray-500', textSizes[size].detail)}>
                ({progress.completedLessons.length} lessons)
              </span>
            </div>
          </div>
          <div className={cn('w-full bg-gray-200 rounded-full', progressBarSizes[size])}>
            <div
              className={cn(
                'rounded-full transition-all duration-500 ease-out',
                progressBarSizes[size],
                getProgressColor(progress.progressPercentage)
              )}
              style={{ width: `${progress.progressPercentage}%` }}
            />
          </div>
          <p className={cn('text-gray-600', textSizes[size].detail)}>
            {getProgressText(progress.progressPercentage)}
          </p>
        </div>

        {/* Stats */}
        {showDetails && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className={cn('text-gray-600', textSizes[size].detail)}>XP Earned</p>
              <p className={cn('font-semibold text-primary-600', textSizes[size].subtitle)}>
                {progress.xpEarned.toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className={cn('text-gray-600', textSizes[size].detail)}>Time Spent</p>
              <p className={cn('font-semibold text-gray-900', textSizes[size].subtitle)}>
                {formatTime(progress.timeSpent)}
              </p>
            </div>
          </div>
        )}

        {/* Timeline */}
        {showDetails && (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <span className={cn('text-gray-600', textSizes[size].detail)}>
                Started: {formatDate(progress.startedAt)}
              </span>
              {progress.completedAt && (
                <span className={cn('text-green-600 font-medium', textSizes[size].detail)}>
                  Completed: {formatDate(progress.completedAt)}
                </span>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className={cn('text-gray-600', textSizes[size].detail)}>
                Last activity: {formatDate(progress.lastAccessedAt)}
              </span>
            </div>
          </div>
        )}

        {/* Certificate */}
        {progress.certificate && (
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2L3 7v11c0 5.55 3.84 8 9 8s9-2.45 9-8V7l-7-5zM8 11.5l-1.5-1.5L5 11.5 8 14.5l6-6L12.5 7 8 11.5z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className={cn('font-semibold text-yellow-800', textSizes[size].subtitle)}>
                  Certificate Earned!
                </h4>
                <p className={cn('text-yellow-700', textSizes[size].detail)}>
                  Issued on {formatDate(progress.certificate.issuedAt)}
                </p>
              </div>
              <a
                href={progress.certificate.certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow-600 hover:text-yellow-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </a>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

// Minimal version for use in lists
export const CourseProgressMini: React.FC<{
  course: Course;
  progress: CourseProgressType;
  className?: string;
}> = ({ course, progress, className }) => {
  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
        <div className="flex items-center space-x-2 mt-1">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress.progressPercentage}%` }}
            />
          </div>
          <span className="text-xs text-gray-600 flex-shrink-0">
            {Math.round(progress.progressPercentage)}%
          </span>
        </div>
      </div>
      {progress.completedAt && (
        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )}
    </div>
  );
};