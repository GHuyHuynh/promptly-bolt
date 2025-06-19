import React, { useState, useEffect } from 'react';
import { Course, Lesson, CourseProgress, LessonProgress } from '../../types/course';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

interface CoursePlayerProps {
  course: Course;
  lessons: Lesson[];
  currentLesson: Lesson | null;
  progress: CourseProgress;
  lessonProgresses: LessonProgress[];
  onLessonSelect: (lessonId: string) => void;
  onLessonComplete: (lessonId: string) => void;
  onNextLesson: () => void;
  onPreviousLesson: () => void;
  className?: string;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({
  course,
  lessons,
  currentLesson,
  progress,
  lessonProgresses,
  onLessonSelect,
  onLessonComplete,
  onNextLesson,
  onPreviousLesson,
  className,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'lessons' | 'resources' | 'notes'>('lessons');
  const [notes, setNotes] = useState('');

  const currentLessonIndex = lessons.findIndex(lesson => lesson.id === currentLesson?.id);
  const hasNextLesson = currentLessonIndex < lessons.length - 1;
  const hasPreviousLesson = currentLessonIndex > 0;

  const getLessonProgress = (lessonId: string) => {
    return lessonProgresses.find(lp => lp.lessonId === lessonId);
  };

  const isLessonCompleted = (lessonId: string) => {
    const lessonProgress = getLessonProgress(lessonId);
    return lessonProgress?.isCompleted || false;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${remainingMinutes}m`;
  };

  const getCompletedLessonsCount = () => {
    return lessons.filter(lesson => isLessonCompleted(lesson.id)).length;
  };

  return (
    <div className={cn('flex h-screen bg-gray-50', className)}>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{course.title}</h1>
                {currentLesson && (
                  <p className="text-sm text-gray-600">
                    Lesson {currentLessonIndex + 1}: {currentLesson.title}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Progress */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {getCompletedLessonsCount()} of {lessons.length} lessons
                </span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.progressPercentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round(progress.progressPercentage)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {currentLesson ? (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Lesson Header */}
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">{currentLesson.title}</h2>
                <p className="text-gray-600">{currentLesson.description}</p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <span>{formatDuration(currentLesson.duration)}</span>
                  <span>•</span>
                  <span>{currentLesson.xpReward} XP</span>
                </div>
              </div>

              {/* Video Player */}
              {currentLesson.videoUrl && (
                <Card className="overflow-hidden">
                  <video
                    controls
                    className="w-full aspect-video"
                    poster={course.imageUrl}
                  >
                    <source src={currentLesson.videoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Card>
              )}

              {/* Lesson Content */}
              <Card className="p-8">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                />
              </Card>

              {/* Lesson Actions */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={onPreviousLesson}
                  disabled={!hasPreviousLesson}
                  className="flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Previous</span>
                </Button>

                <div className="flex items-center space-x-4">
                  {!isLessonCompleted(currentLesson.id) && (
                    <Button
                      variant="primary"
                      onClick={() => onLessonComplete(currentLesson.id)}
                      className="flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Mark Complete</span>
                    </Button>
                  )}
                  {isLessonCompleted(currentLesson.id) && (
                    <div className="flex items-center space-x-2 text-green-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Completed</span>
                    </div>
                  )}
                </div>

                <Button
                  variant="primary"
                  onClick={onNextLesson}
                  disabled={!hasNextLesson}
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto text-center space-y-4">
              <div className="text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No lesson selected</h3>
                <p className="text-gray-600">Choose a lesson from the sidebar to start learning</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className={cn(
        'w-80 bg-white border-l border-gray-200 transform transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      )}>
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {[
              { id: 'lessons', label: 'Lessons', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
              { id: 'resources', label: 'Resources', icon: 'M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.33M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
              { id: 'notes', label: 'Notes', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  'flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <div className="flex items-center justify-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  <span>{tab.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4 overflow-y-auto h-full">
          {activeTab === 'lessons' && (
            <div className="space-y-2">
              {lessons.map((lesson, index) => {
                const isCompleted = isLessonCompleted(lesson.id);
                const isCurrent = lesson.id === currentLesson?.id;
                const lessonProgress = getLessonProgress(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => onLessonSelect(lesson.id)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg transition-all duration-200 border',
                      isCurrent
                        ? 'bg-primary-50 border-primary-200 text-primary-700'
                        : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {isCompleted ? (
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <div className={cn(
                            'w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold',
                            isCurrent
                              ? 'border-primary-600 bg-primary-600 text-white'
                              : 'border-gray-300 text-gray-500'
                          )}>
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 line-clamp-2">{lesson.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {formatDuration(lesson.duration)}
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">{lesson.xpReward} XP</span>
                        </div>
                        {lessonProgress && lessonProgress.timeSpent > 0 && (
                          <div className="mt-2">
                            <div className="text-xs text-gray-500 mb-1">
                              {formatDuration(lessonProgress.timeSpent)} watched
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1">
                              <div
                                className="bg-primary-600 h-1 rounded-full"
                                style={{ 
                                  width: `${Math.min(100, (lessonProgress.timeSpent / lesson.duration) * 100)}%` 
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
          )}

          {activeTab === 'resources' && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Course Resources</h3>
              <div className="space-y-2">
                <a
                  href="#"
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Course Slides</p>
                    <p className="text-xs text-gray-500">PDF • 2.3 MB</p>
                  </div>
                </a>
                <a
                  href="#"
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Code Examples</p>
                    <p className="text-xs text-gray-500">GitHub Repository</p>
                  </div>
                </a>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">My Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Take notes while learning..."
                className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <Button variant="outline" size="sm" className="w-full">
                Save Notes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};