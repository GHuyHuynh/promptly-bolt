import { useState, useEffect, useCallback } from 'react';
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  orderBy,
  limit,
  Unsubscribe
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthContext } from '../contexts/AuthContext';
import {
  Course,
  UserEnrollment,
  UserProgress,
  UserTaskCompletion,
  DashboardData,
  ProgressSummary
} from '../types/curriculum';
import { CourseService } from '../services/courseService';
import { XPSystem } from '../utils/xpSystem';

// Hook for managing course enrollment
export const useCourseEnrollment = (courseId: string) => {
  const { user } = useAuthContext();
  const [enrollment, setEnrollment] = useState<UserEnrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !courseId) {
      setLoading(false);
      return;
    }

    const enrollmentId = `${user.uid}_${courseId}`;
    const unsubscribe = onSnapshot(
      doc(db, 'user_enrollments', enrollmentId),
      (doc) => {
        if (doc.exists()) {
          setEnrollment(doc.data() as UserEnrollment);
        } else {
          setEnrollment(null);
        }
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error fetching enrollment:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user, courseId]);

  const enroll = useCallback(async () => {
    if (!user || !courseId) return;
    
    try {
      setLoading(true);
      await CourseService.enrollUser(user.uid, courseId);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to enroll');
    } finally {
      setLoading(false);
    }
  }, [user, courseId]);

  return {
    enrollment,
    loading,
    error,
    enroll,
    isEnrolled: !!enrollment
  };
};

// Hook for tracking lesson progress
export const useLessonProgress = (lessonId: string) => {
  const { user } = useAuthContext();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !lessonId) {
      setLoading(false);
      return;
    }

    const progressId = `${user.uid}_${lessonId}`;
    const unsubscribe = onSnapshot(
      doc(db, 'user_progress', progressId),
      (doc) => {
        if (doc.exists()) {
          setProgress(doc.data() as UserProgress);
        } else {
          setProgress(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching lesson progress:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user, lessonId]);

  return { progress, loading };
};

// Hook for managing task completions
export const useTaskCompletion = (taskId: string) => {
  const { user } = useAuthContext();
  const [completion, setCompletion] = useState<UserTaskCompletion | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !taskId) {
      setLoading(false);
      return;
    }

    const completionId = `${user.uid}_${taskId}`;
    const unsubscribe = onSnapshot(
      doc(db, 'user_task_completions', completionId),
      (doc) => {
        if (doc.exists()) {
          setCompletion(doc.data() as UserTaskCompletion);
        } else {
          setCompletion(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching task completion:', error);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [user, taskId]);

  return { completion, loading, isCompleted: completion?.completion.status === 'completed' };
};

// Hook for real-time dashboard data
export const useDashboard = () => {
  const { user } = useAuthContext();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    let unsubscribes: Unsubscribe[] = [];

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Get user enrollments with real-time updates
        const enrollmentsQuery = query(
          collection(db, 'user_enrollments'),
          where('userId', '==', user.uid),
          where('enrollment.status', 'in', ['in-progress', 'completed']),
          orderBy('metadata.lastAccessedAt', 'desc')
        );

        const enrollmentsUnsubscribe = onSnapshot(enrollmentsQuery, async (snapshot) => {
          const enrollments = snapshot.docs.map(doc => doc.data()) as UserEnrollment[];
          
          // Fetch course details for each enrollment
          const coursesPromises = enrollments.map(enrollment => 
            CourseService.getCourse(enrollment.courseId)
          );
          const courses = await Promise.all(coursesPromises);
          
          // Create progress summaries
          const progressSummaries: ProgressSummary[] = [];
          const currentCourses: any[] = [];
          
          enrollments.forEach((enrollment, index) => {
            const course = courses[index];
            if (course) {
              progressSummaries.push({
                courseId: enrollment.courseId,
                courseTitle: course.title,
                progress: enrollment.enrollment.progress,
                xpEarned: enrollment.performance.currentXP,
                totalXP: enrollment.performance.totalXP,
                lessonsCompleted: enrollment.performance.lessonsCompleted,
                totalLessons: course.content.lessonCount,
                lastActivity: enrollment.metadata.lastAccessedAt
              });

              if (enrollment.enrollment.status === 'in-progress') {
                currentCourses.push({
                  id: course.id,
                  title: course.title,
                  progress: enrollment.enrollment.progress,
                  nextLesson: 'Continue Learning', // This would be calculated based on progress
                  timeLeft: `${Math.ceil((course.content.estimatedHours * (100 - enrollment.enrollment.progress)) / 100)}h remaining`,
                  imageUrl: course.imageUrl
                });
              }
            }
          });

          // Calculate stats from user profile
          const stats = {
            coursesCompleted: user.profile?.stats?.coursesCompleted || 0,
            certificatesEarned: user.profile?.stats?.certificatesEarned || 0,
            hoursLearned: user.profile?.stats?.hoursLearned || 0,
            currentStreak: user.profile?.streak?.current || 0,
            totalXP: user.profile?.totalXP || 0,
            currentLevel: user.profile?.currentLevel || 1
          };

          setDashboardData({
            stats,
            currentCourses,
            recentAchievements: [], // Would be populated from user_achievements
            upcomingDeadlines: []
          });
          
          setLoading(false);
          setError(null);
        });

        unsubscribes.push(enrollmentsUnsubscribe);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load dashboard');
        setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe());
    };
  }, [user]);

  return { dashboardData, loading, error };
};

// Hook for XP and level information
export const useXPSystem = () => {
  const { user } = useAuthContext();
  
  const xpSummary = user?.profile?.totalXP 
    ? XPSystem.getXPSummary(user.profile.totalXP)
    : null;

  return {
    totalXP: user?.profile?.totalXP || 0,
    currentLevel: user?.profile?.currentLevel || 1,
    xpToNextLevel: user?.profile?.xpToNextLevel || 0,
    xpSummary,
    levelTitle: xpSummary?.levelTitle || 'Novice'
  };
};

// Hook for user's course list with progress
export const useUserCourses = () => {
  const { user } = useAuthContext();
  const [userCourses, setUserCourses] = useState<{
    course: Course;
    enrollment: UserEnrollment;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const enrollmentsQuery = query(
      collection(db, 'user_enrollments'),
      where('userId', '==', user.uid),
      orderBy('enrollment.enrolledAt', 'desc')
    );

    const unsubscribe = onSnapshot(enrollmentsQuery, async (snapshot) => {
      try {
        const enrollments = snapshot.docs.map(doc => doc.data()) as UserEnrollment[];
        
        // Fetch course details for each enrollment
        const coursesWithEnrollment = await Promise.all(
          enrollments.map(async (enrollment) => {
            const course = await CourseService.getCourse(enrollment.courseId);
            return course ? { course, enrollment } : null;
          })
        );

        setUserCourses(coursesWithEnrollment.filter(Boolean) as {
          course: Course;
          enrollment: UserEnrollment;
        }[]);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error('Error fetching user courses:', error);
        setError(error instanceof Error ? error.message : 'Failed to load courses');
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [user]);

  return { userCourses, loading, error };
};

// Hook for course search and filtering
export const useCourseSearch = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchCourses = useCallback(async (
    searchTerm: string,
    filters?: {
      category?: string;
      difficulty?: string;
      tags?: string[];
    }
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await CourseService.searchCourses(searchTerm, filters);
      setCourses(results);
    } catch (error) {
      console.error('Error searching courses:', error);
      setError(error instanceof Error ? error.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    courses,
    loading,
    error,
    searchCourses
  };
};

// Hook for real-time progress tracking during lesson
export const useProgressTracker = (courseId: string, lessonId: string) => {
  const { user } = useAuthContext();
  const [timeSpent, setTimeSpent] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 60000); // Update every minute
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive]);

  const startTracking = useCallback(() => {
    setIsActive(true);
    // Start lesson if not already started
    if (user && courseId && lessonId) {
      CourseService.startLesson(user.uid, courseId, lessonId);
    }
  }, [user, courseId, lessonId]);

  const stopTracking = useCallback(() => {
    setIsActive(false);
  }, []);

  const completeTask = useCallback(async (
    taskId: string,
    score: number,
    answers?: any[],
    submissionData?: any
  ) => {
    if (!user || !courseId || !lessonId) return;

    try {
      await CourseService.completeTask(
        user.uid,
        courseId,
        lessonId,
        taskId,
        score,
        timeSpent,
        answers,
        submissionData
      );
    } catch (error) {
      throw error;
    }
  }, [user, courseId, lessonId, timeSpent]);

  return {
    timeSpent,
    isActive,
    startTracking,
    stopTracking,
    completeTask
  };
};