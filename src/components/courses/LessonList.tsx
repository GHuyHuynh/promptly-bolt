import React from 'react';
import { Lesson, LessonProgress } from '../../types/course';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface LessonListProps {
  lessons: Lesson[];
  lessonProgresses: LessonProgress[];
  currentLessonId?: string | null;
  onLessonSelect: (lessonId: string) => void;
  onLessonStart: (lessonId: string) => void;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

export const LessonList: React.FC<LessonListProps> = ({
  lessons,
  lessonProgresses,
  currentLessonId,
  onLessonSelect,
  onLessonStart,
  className,
  variant = 'default',
}) => {
  const getLessonProgress = (lessonId: string) => {
    return lessonProgresses.find(lp => lp.lessonId === lessonId);
  };

  const isLessonCompleted = (lessonId: string) => {
    const progress = getLessonProgress(lessonId);
    return progress?.isCompleted || false;
  };

  const getLessonStatus = (lesson: Lesson) => {
    const progress = getLessonProgress(lesson.id);
    if (!progress) return 'not-started';
    if (progress.isCompleted) return 'completed';
    if (progress.timeSpent > 0) return 'in-progress';
    return 'not-started';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  const getStatusIcon = (status: string, isCurrent: boolean) => {
    if (isCurrent) {
      return (
        <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </div>
      );
    }

    switch (status) {
      case 'completed':
        return (
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'in-progress':
        return (
          <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-gray-300" />
          </div>
        );
    }
  };

  const getProgressBar = (lesson: Lesson) => {
    const progress = getLessonProgress(lesson.id);
    if (!progress || progress.timeSpent === 0) return null;

    const percentage = Math.min(100, (progress.timeSpent / lesson.duration) * 100);
    
    return (
      <div className="mt-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500">
            {formatDuration(progress.timeSpent)} watched
          </span>
          <span className="text-xs text-gray-500">
            {Math.round(percentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className="bg-primary-600 h-1 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  if (variant === 'compact') {
    return (
      <div className={cn('space-y-2', className)}>
        {lessons.map((lesson, index) => {
          const status = getLessonStatus(lesson);
          const isCurrent = lesson.id === currentLessonId;
          const progress = getLessonProgress(lesson.id);

          return (
            <button
              key={lesson.id}
              onClick={() => onLessonSelect(lesson.id)}
              className={cn(
                'w-full text-left p-3 rounded-lg transition-all duration-200 border',
                isCurrent
                  ? 'bg-primary-50 border-primary-200'
                  : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              )}
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(status, isCurrent)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 truncate">
                      {index + 1}. {lesson.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{formatDuration(lesson.duration)}</span>
                      <span>•</span>
                      <span>{lesson.xpReward} XP</span>
                    </div>
                  </div>
                  {progress && progress.timeSpent > 0 && (
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-primary-600 h-1 rounded-full"
                          style={{ 
                            width: `${Math.min(100, (progress.timeSpent / lesson.duration) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={cn('space-y-4', className)}>
        {lessons.map((lesson, index) => {
          const status = getLessonStatus(lesson);
          const isCurrent = lesson.id === currentLessonId;
          const progress = getLessonProgress(lesson.id);

          return (
            <Card
              key={lesson.id}
              className={cn(
                'transition-all duration-200',
                isCurrent ? 'ring-2 ring-primary-500 border-primary-200' : ''
              )}
              hover
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  {getStatusIcon(status, isCurrent)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Lesson {index + 1}: {lesson.title}
                        </h3>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {lesson.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{formatDuration(lesson.duration)}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{lesson.xpReward} XP</span>
                          </span>
                          {lesson.videoUrl && (
                            <span className="flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <span>Video</span>
                            </span>
                          )}
                        </div>
                        {getProgressBar(lesson)}
                      </div>
                      <div className="flex flex-col space-y-2">
                        {status === 'completed' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onLessonSelect(lesson.id)}
                          >
                            Review
                          </Button>
                        ) : (
                          <Button
                            variant={isCurrent ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => onLessonStart(lesson.id)}
                          >
                            {status === 'in-progress' ? 'Continue' : 'Start'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    );
  }

  // Default variant
  return (
    <Card className={className}>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Lessons</h3>
        <div className="space-y-3">
          {lessons.map((lesson, index) => {
            const status = getLessonStatus(lesson);
            const isCurrent = lesson.id === currentLessonId;
            const progress = getLessonProgress(lesson.id);

            return (
              <div
                key={lesson.id}
                className={cn(
                  'flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200',
                  isCurrent
                    ? 'bg-primary-50 border-primary-200'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                )}
              >
                {getStatusIcon(status, isCurrent)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 truncate">
                      {index + 1}. {lesson.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{formatDuration(lesson.duration)}</span>
                      <span>•</span>
                      <span>{lesson.xpReward} XP</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                    {lesson.description}
                  </p>
                  {getProgressBar(lesson)}
                </div>
                <div className="flex-shrink-0">
                  {status === 'completed' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onLessonSelect(lesson.id)}
                    >
                      Review
                    </Button>
                  ) : (
                    <Button
                      variant={isCurrent ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => onLessonStart(lesson.id)}
                    >
                      {status === 'in-progress' ? 'Continue' : 'Start'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};