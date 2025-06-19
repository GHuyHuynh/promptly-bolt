import React, { useState, useEffect } from 'react';
import {
  useCourseProgress,
  useXPSystem,
  useCourseEnrollment,
  useUserStats,
  useCourseContent,
} from '../hooks/useCourse';
import {
  useCourseNavigation,
  useOfflineSupport,
  useCourseCompletion,
  useCourseSearch,
  useCourseFavorites,
} from '../hooks/useCourseUtils';
import { useAuthContext } from '../contexts/AuthContext';
import { Course, Lesson } from '../types/course';
import toast from 'react-hot-toast';

// Example 1: Course Dashboard Component
export const CourseDashboard: React.FC = () => {
  const { user } = useAuthContext();
  const { stats, loading: statsLoading } = useUserStats();
  const { userXP, loading: xpLoading } = useXPSystem();
  const { enrollments, loading: enrollmentsLoading } = useCourseEnrollment();

  if (!user) {
    return <div>Please sign in to view your dashboard</div>;
  }

  if (statsLoading || xpLoading || enrollmentsLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Welcome back, {user.displayName}!</h1>
      
      {/* XP and Level Display */}
      <div className="xp-section">
        <h2>Your Progress</h2>
        <div className="level-info">
          <span>Level {userXP?.currentLevel}</span>
          <div className="xp-bar">
            <div 
              className="xp-fill" 
              style={{ 
                width: `${((userXP?.totalXP || 0) / ((userXP?.totalXP || 0) + (userXP?.xpToNextLevel || 1))) * 100}%` 
              }}
            />
          </div>
          <span>{userXP?.totalXP} XP</span>
        </div>
        <p>{userXP?.xpToNextLevel} XP to next level</p>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Courses Completed</h3>
          <p>{stats?.totalCoursesCompleted || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Lessons Completed</h3>
          <p>{stats?.totalLessonsCompleted || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Current Streak</h3>
          <p>{stats?.currentStreak || 0} days</p>
        </div>
        <div className="stat-card">
          <h3>Total Time</h3>
          <p>{Math.round((stats?.totalTimeSpent || 0) / 60)} hours</p>
        </div>
      </div>

      {/* Active Enrollments */}
      <div className="active-courses">
        <h2>Continue Learning</h2>
        {enrollments
          .filter(e => e.status === 'active')
          .map(enrollment => (
            <CourseCard key={enrollment.courseId} courseId={enrollment.courseId} />
          ))}
      </div>
    </div>
  );
};

// Example 2: Course Player Component
export const CoursePlayer: React.FC<{ courseId: string }> = ({ courseId }) => {
  const { user } = useAuthContext();
  const { progress, lessonProgresses, completeLesson, loading } = useCourseProgress(courseId);
  const { addXPTransaction } = useXPSystem();
  const { isOnline, cacheData, getCachedData } = useOfflineSupport();
  
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [lessonStartTime, setLessonStartTime] = useState(Date.now());

  const {
    currentLesson,
    currentLessonIndex,
    hasNext,
    hasPrevious,
    goToNext,
    goToPrevious,
    getProgress,
  } = useCourseNavigation(courseId, lessons);

  const {
    completionPercentage,
    isCompleted,
    nextLesson,
    estimatedTimeToCompletion,
  } = useCourseCompletion(courseId, progress, lessons);

  // Load lessons (with offline support)
  useEffect(() => {
    const loadLessons = async () => {
      const cacheKey = `course_lessons_${courseId}`;
      
      if (!isOnline) {
        const cached = getCachedData(cacheKey);
        if (cached) {
          setLessons(cached);
          return;
        }
      }

      try {
        // Fetch lessons from API
        const response = await fetch(`/api/courses/${courseId}/lessons`);
        const fetchedLessons = await response.json();
        setLessons(fetchedLessons);
        
        if (isOnline) {
          cacheData(cacheKey, fetchedLessons);
        }
      } catch (error) {
        console.error('Error loading lessons:', error);
        toast.error('Failed to load course content');
      }
    };

    loadLessons();
  }, [courseId, isOnline, getCachedData, cacheData]);

  // Handle lesson completion
  const handleLessonComplete = async () => {
    if (!currentLesson || !user) return;

    const timeSpent = (Date.now() - lessonStartTime) / 1000 / 60; // minutes
    const xpEarned = currentLesson.xpReward;

    try {
      await completeLesson(currentLesson.id, xpEarned, timeSpent);
      
      // Auto-advance to next lesson
      if (hasNext) {
        goToNext();
        setLessonStartTime(Date.now());
      } else {
        // Course completed!
        toast.success('Congratulations! You completed the course!');
      }
    } catch (error) {
      toast.error('Failed to mark lesson as complete');
    }
  };

  if (loading) {
    return <div>Loading course...</div>;
  }

  if (!currentLesson) {
    return <div>No lessons available</div>;
  }

  return (
    <div className="course-player">
      {!isOnline && (
        <div className="offline-indicator">
          You're offline. Some features may be limited.
        </div>
      )}

      {/* Progress Bar */}
      <div className="course-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${getProgress()}%` }}
          />
        </div>
        <span>{Math.round(getProgress())}% Complete</span>
      </div>

      {/* Video Player */}
      <div className="video-container">
        {currentLesson.videoUrl ? (
          <video
            src={currentLesson.videoUrl}
            controls
            onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
            onEnded={handleLessonComplete}
          />
        ) : (
          <div className="no-video">
            <h3>{currentLesson.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
          </div>
        )}
      </div>

      {/* Lesson Info */}
      <div className="lesson-info">
        <h2>{currentLesson.title}</h2>
        <p>{currentLesson.description}</p>
        <div className="lesson-meta">
          <span>Duration: {currentLesson.duration} minutes</span>
          <span>XP Reward: {currentLesson.xpReward}</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="player-controls">
        <button onClick={goToPrevious} disabled={!hasPrevious}>
          Previous
        </button>
        
        <button onClick={handleLessonComplete} className="complete-button">
          Mark Complete
        </button>
        
        <button onClick={goToNext} disabled={!hasNext}>
          Next
        </button>
      </div>

      {/* Lesson List */}
      <div className="lesson-list">
        <h3>Course Contents</h3>
        {lessons.map((lesson, index) => {
          const isCurrentLesson = lesson.id === currentLesson.id;
          const isCompleted = progress?.completedLessons.includes(lesson.id);
          
          return (
            <div 
              key={lesson.id} 
              className={`lesson-item ${isCurrentLesson ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}
            >
              <span className="lesson-number">{index + 1}</span>
              <span className="lesson-title">{lesson.title}</span>
              <span className="lesson-duration">{lesson.duration}m</span>
              {isCompleted && <span className="checkmark">✓</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Example 3: Course Catalog Component
export const CourseCatalog: React.FC = () => {
  const { user } = useAuthContext();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'beginner' | 'intermediate' | 'advanced' | ''>('');
  
  const { 
    courses, 
    loading, 
    error, 
    hasMore, 
    loadMoreCourses,
    searchCourses 
  } = useCourseContent(
    {
      category: selectedCategory || undefined,
      difficulty: selectedDifficulty || undefined,
      isPremium: false, // Show free courses first
    },
    {
      limit: 12,
      orderBy: 'rating',
      orderDirection: 'desc',
    }
  );

  const { enrollInCourse, hasAccessToCourse } = useCourseEnrollment();
  const { query, setQuery, results: searchResults, loading: searchLoading } = useCourseSearch();
  const { favorites, toggleFavorite, isFavorite } = useCourseFavorites(user?.uid || '');

  const handleEnroll = async (courseId: string) => {
    try {
      await enrollInCourse(courseId);
      toast.success('Successfully enrolled!');
    } catch (error) {
      toast.error('Failed to enroll in course');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchCourses(query);
    }
  };

  const displayCourses = query ? searchResults : courses;

  return (
    <div className="course-catalog">
      <h1>Course Catalog</h1>

      {/* Search */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search courses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Filters */}
      <div className="filters">
        <select 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="programming">Programming</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
        </select>

        <select 
          value={selectedDifficulty} 
          onChange={(e) => setSelectedDifficulty(e.target.value as any)}
        >
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Course Grid */}
      {loading || searchLoading ? (
        <div>Loading courses...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <>
          <div className="course-grid">
            {displayCourses.map((course) => (
              <div key={course.id} className="course-card">
                <img src={course.imageUrl} alt={course.title} />
                
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p className="course-description">{course.description}</p>
                  
                  <div className="course-meta">
                    <span className="difficulty">{course.difficulty}</span>
                    <span className="duration">{course.duration}m</span>
                    <span className="rating">⭐ {course.rating.toFixed(1)}</span>
                  </div>

                  <div className="course-actions">
                    {hasAccessToCourse(course.id) ? (
                      <button className="continue-button">
                        Continue Learning
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleEnroll(course.id)}
                        className="enroll-button"
                      >
                        Enroll {course.price > 0 ? `- $${course.price}` : '- Free'}
                      </button>
                    )}
                    
                    <button 
                      onClick={() => toggleFavorite(course.id)}
                      className={`favorite-button ${isFavorite(course.id) ? 'favorited' : ''}`}
                    >
                      {isFavorite(course.id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasMore && !query && (
            <button onClick={loadMoreCourses} className="load-more">
              Load More Courses
            </button>
          )}
        </>
      )}
    </div>
  );
};

// Example 4: XP Progress Component
export const XPProgressWidget: React.FC = () => {
  const { userXP, recentTransactions, loading } = useXPSystem();
  const [showTransactions, setShowTransactions] = useState(false);

  if (loading) {
    return <div>Loading XP data...</div>;
  }

  if (!userXP) {
    return <div>No XP data available</div>;
  }

  const progressPercentage = ((userXP.totalXP % 100) / 100) * 100; // Assuming 100 XP per level

  return (
    <div className="xp-widget">
      <div className="level-display">
        <h3>Level {userXP.currentLevel}</h3>
        <div className="xp-progress-bar">
          <div 
            className="xp-progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <p>{userXP.totalXP} XP • {userXP.xpToNextLevel} to next level</p>
      </div>

      <div className="xp-stats">
        <div className="stat">
          <span>Lessons</span>
          <span>{userXP.totalLessonsCompleted}</span>
        </div>
        <div className="stat">
          <span>Courses</span>
          <span>{userXP.totalCoursesCompleted}</span>
        </div>
        <div className="stat">
          <span>Streak</span>
          <span>{userXP.currentStreak} days</span>
        </div>
      </div>

      <button 
        onClick={() => setShowTransactions(!showTransactions)}
        className="toggle-transactions"
      >
        {showTransactions ? 'Hide' : 'Show'} Recent Activity
      </button>

      {showTransactions && (
        <div className="recent-transactions">
          <h4>Recent XP Gains</h4>
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <span className="transaction-source">
                {transaction.source.title}
              </span>
              <span className="transaction-amount">
                +{transaction.amount} XP
              </span>
              <span className="transaction-date">
                {transaction.createdAt.toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Example 5: Course Card Component (reusable)
const CourseCard: React.FC<{ courseId: string }> = ({ courseId }) => {
  const [course, setCourse] = useState<Course | null>(null);
  const { progress } = useCourseProgress(courseId);
  const { hasAccessToCourse } = useCourseEnrollment();

  useEffect(() => {
    // Fetch course data
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`);
        const courseData = await response.json();
        setCourse(courseData);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (!course) {
    return <div>Loading course...</div>;
  }

  const hasAccess = hasAccessToCourse(courseId);
  const progressPercentage = progress?.progressPercentage || 0;

  return (
    <div className="course-card">
      <img src={course.imageUrl} alt={course.title} />
      <div className="course-content">
        <h3>{course.title}</h3>
        
        {hasAccess && (
          <div className="progress-indicator">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span>{Math.round(progressPercentage)}% complete</span>
          </div>
        )}

        <div className="course-meta">
          <span>{course.difficulty}</span>
          <span>{course.duration} minutes</span>
          <span>⭐ {course.rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

// Example usage in a main component
export const CourseApp: React.FC = () => {
  const { user, loading } = useAuthContext();
  const [currentView, setCurrentView] = useState<'dashboard' | 'catalog' | 'player'>('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in to access courses</div>;
  }

  return (
    <div className="course-app">
      <nav className="course-nav">
        <button 
          onClick={() => setCurrentView('dashboard')}
          className={currentView === 'dashboard' ? 'active' : ''}
        >
          Dashboard
        </button>
        <button 
          onClick={() => setCurrentView('catalog')}
          className={currentView === 'catalog' ? 'active' : ''}
        >
          Catalog
        </button>
        {selectedCourseId && (
          <button 
            onClick={() => setCurrentView('player')}
            className={currentView === 'player' ? 'active' : ''}
          >
            Course Player
          </button>
        )}
      </nav>

      <main className="course-main">
        {currentView === 'dashboard' && <CourseDashboard />}
        {currentView === 'catalog' && <CourseCatalog />}
        {currentView === 'player' && selectedCourseId && (
          <CoursePlayer courseId={selectedCourseId} />
        )}
      </main>

      <div className="xp-sidebar">
        <XPProgressWidget />
      </div>
    </div>
  );
};