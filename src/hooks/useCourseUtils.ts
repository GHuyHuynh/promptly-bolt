import { useState, useCallback, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Course, Lesson, CourseProgress } from '../types/course';

// Hook for offline support and caching
export const useOfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cache course data in localStorage
  const cacheData = useCallback((key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  }, []);

  // Get cached data
  const getCachedData = useCallback((key: string, maxAge = 5 * 60 * 1000) => { // 5 minutes default
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > maxAge) {
        localStorage.removeItem(key);
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Failed to get cached data:', error);
      return null;
    }
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('course_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }, []);

  return {
    isOnline,
    cacheData,
    getCachedData,
    clearCache,
  };
};

// Hook for course navigation
export const useCourseNavigation = (courseId: string, lessons: Lesson[]) => {
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const currentLesson = lessons[currentLessonIndex];
  const hasNext = currentLessonIndex < lessons.length - 1;
  const hasPrevious = currentLessonIndex > 0;

  const goToNext = useCallback(() => {
    if (hasNext) {
      setCurrentLessonIndex(prev => prev + 1);
    }
  }, [hasNext]);

  const goToPrevious = useCallback(() => {
    if (hasPrevious) {
      setCurrentLessonIndex(prev => prev - 1);
    }
  }, [hasPrevious]);

  const goToLesson = useCallback((lessonId: string) => {
    const index = lessons.findIndex(lesson => lesson.id === lessonId);
    if (index !== -1) {
      setCurrentLessonIndex(index);
    }
  }, [lessons]);

  const getProgress = useCallback(() => {
    if (lessons.length === 0) return 0;
    return ((currentLessonIndex + 1) / lessons.length) * 100;
  }, [currentLessonIndex, lessons.length]);

  return {
    currentLesson,
    currentLessonIndex,
    hasNext,
    hasPrevious,
    goToNext,
    goToPrevious,
    goToLesson,
    getProgress,
    totalLessons: lessons.length,
  };
};

// Hook for real-time course updates
export const useRealtimeCourse = (courseId: string) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    const courseRef = doc(db, 'courses', courseId);
    const unsubscribe = onSnapshot(
      courseRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setCourse({
            ...data,
            id: doc.id,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
          } as Course);
        } else {
          setCourse(null);
        }
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error listening to course updates:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [courseId]);

  return { course, loading, error };
};

// Hook for course completion tracking
export const useCourseCompletion = (courseId: string, progress: CourseProgress | null, lessons: Lesson[]) => {
  const completionPercentage = useCallback(() => {
    if (!progress || lessons.length === 0) return 0;
    return (progress.completedLessons.length / lessons.length) * 100;
  }, [progress, lessons]);

  const isCompleted = useCallback(() => {
    return completionPercentage() === 100;
  }, [completionPercentage]);

  const getCompletedLessons = useCallback(() => {
    if (!progress) return [];
    return lessons.filter(lesson => progress.completedLessons.includes(lesson.id));
  }, [progress, lessons]);

  const getRemainingLessons = useCallback(() => {
    if (!progress) return lessons;
    return lessons.filter(lesson => !progress.completedLessons.includes(lesson.id));
  }, [progress, lessons]);

  const getNextLesson = useCallback(() => {
    const remaining = getRemainingLessons();
    return remaining.length > 0 ? remaining[0] : null;
  }, [getRemainingLessons]);

  const getEstimatedTimeToCompletion = useCallback(() => {
    const remaining = getRemainingLessons();
    return remaining.reduce((total, lesson) => total + lesson.duration, 0);
  }, [getRemainingLessons]);

  return {
    completionPercentage: completionPercentage(),
    isCompleted: isCompleted(),
    completedLessons: getCompletedLessons(),
    remainingLessons: getRemainingLessons(),
    nextLesson: getNextLesson(),
    estimatedTimeToCompletion: getEstimatedTimeToCompletion(),
  };
};

// Hook for course recommendations
export const useCourseRecommendations = (userId: string, currentCourse?: Course) => {
  const [recommendations, setRecommendations] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRecommendations = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // This is a simplified recommendation system
      // In a real app, you'd use machine learning algorithms
      
      // For now, recommend courses in the same category
      // or courses that other users with similar interests have taken
      
      // Implementation would depend on your specific recommendation algorithm
      setRecommendations([]);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    recommendations,
    loading,
    refreshRecommendations: fetchRecommendations,
  };
};

// Hook for course search with debouncing
export const useCourseSearch = (initialQuery = '', delay = 300) => {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [results, setResults] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    return () => clearTimeout(timer);
  }, [query, delay]);

  // Search function (you'd integrate this with your search service)
  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      // Implement your search logic here
      // This could integrate with Algolia, Elasticsearch, etc.
      setResults([]);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger search when debounced query changes
  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  return {
    query,
    setQuery,
    results,
    loading,
    clearSearch,
  };
};

// Hook for managing course favorites
export const useCourseFavorites = (userId: string) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load favorites from localStorage or Firestore
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        // Try localStorage first for offline support
        const cached = localStorage.getItem(`favorites_${userId}`);
        if (cached) {
          setFavorites(JSON.parse(cached));
        }

        // Then sync with Firestore
        // Implementation would depend on your data structure
        setLoading(false);
      } catch (error) {
        console.error('Error loading favorites:', error);
        setLoading(false);
      }
    };

    if (userId) {
      loadFavorites();
    }
  }, [userId]);

  const addFavorite = useCallback(async (courseId: string) => {
    if (favorites.includes(courseId)) return;

    const newFavorites = [...favorites, courseId];
    setFavorites(newFavorites);

    try {
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(newFavorites));
      // Also sync to Firestore
    } catch (error) {
      console.error('Error adding favorite:', error);
      // Rollback on error
      setFavorites(favorites);
    }
  }, [favorites, userId]);

  const removeFavorite = useCallback(async (courseId: string) => {
    const newFavorites = favorites.filter(id => id !== courseId);
    setFavorites(newFavorites);

    try {
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(newFavorites));
      // Also sync to Firestore
    } catch (error) {
      console.error('Error removing favorite:', error);
      // Rollback on error
      setFavorites(favorites);
    }
  }, [favorites, userId]);

  const isFavorite = useCallback((courseId: string) => {
    return favorites.includes(courseId);
  }, [favorites]);

  const toggleFavorite = useCallback(async (courseId: string) => {
    if (isFavorite(courseId)) {
      await removeFavorite(courseId);
    } else {
      await addFavorite(courseId);
    }
  }, [isFavorite, removeFavorite, addFavorite]);

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
};