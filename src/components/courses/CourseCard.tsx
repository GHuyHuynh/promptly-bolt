import React from 'react';
import { Course, CourseProgress } from '../../types/course';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface CourseCardProps {
  course: Course;
  progress?: CourseProgress;
  onEnroll?: () => void;
  onContinue?: () => void;
  onViewDetails?: () => void;
  isEnrolled?: boolean;
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  progress,
  onEnroll,
  onContinue,
  onViewDetails,
  isEnrolled = false,
  className,
}) => {
  const getDifficultyColor = (difficulty: Course['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={cn(
          'text-sm',
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        )}
      >
        ★
      </span>
    ));
  };

  return (
    <Card className={cn('overflow-hidden group cursor-pointer transition-all duration-300', className)} hover>
      <div className="relative">
        {course.imageUrl && (
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute top-4 left-4">
          <span
            className={cn(
              'px-2 py-1 text-xs font-semibold rounded-full',
              getDifficultyColor(course.difficulty)
            )}
          >
            {course.difficulty}
          </span>
        </div>
        {course.isPremium && (
          <div className="absolute top-4 right-4">
            <span className="bg-purple-600 text-white px-2 py-1 text-xs font-semibold rounded-full">
              Premium
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">{course.description}</p>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            {renderStars(course.rating)}
            <span className="text-sm text-gray-600 ml-1">
              ({course.reviewCount})
            </span>
          </div>
          <span className="text-sm text-gray-600">
            {course.enrollmentCount} students
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>{formatDuration(course.duration)}</span>
            <span>{course.xpReward} XP</span>
          </div>
          <div className="text-right">
            {course.price > 0 ? (
              <span className="text-lg font-bold text-gray-900">${course.price}</span>
            ) : (
              <span className="text-lg font-bold text-green-600">Free</span>
            )}
          </div>
        </div>

        {/* Progress bar for enrolled courses */}
        {isEnrolled && progress && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round(progress.progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {course.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {course.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
              +{course.tags.length - 3}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {isEnrolled ? (
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={onContinue}
            >
              Continue Learning
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={onEnroll}
            >
              {course.price > 0 ? 'Enroll Now' : 'Start Free'}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="px-4"
          >
            Details
          </Button>
        </div>
      </div>
    </Card>
  );
};