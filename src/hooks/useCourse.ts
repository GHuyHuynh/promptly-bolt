import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  doc,
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthContext } from '../contexts/AuthContext';
import {
  Course,
  Lesson,
  CourseProgress,
  LessonProgress,
  XPTransaction,
  UserXP,
  CourseEnrollment,
  UserStats,
  CourseProgressState,
  XPSystemState,
  CourseEnrollmentState,
  UserStatsState,
  CourseContentState,
  CourseError,
  PaginationOptions,
  CourseFilters,
} from '../types/course';
import toast from 'react-hot-toast';

// Utility function to handle course errors
const handleCourseError = (error: any): CourseError => {
  console.error('Course Error:', error);
  
  const courseError: CourseError = {
    code: error.code || 'unknown',
    message: 'An unexpected error occurred',
  };

  switch (error.code) {
    case 'permission-denied':
      courseError.message = 'You do not have permission to perform this action';
      break;
    case 'not-found':
      courseError.message = 'The requested resource was not found';
      break;
    case 'already-exists':
      courseError.message = 'This resource already exists';
      break;
    case 'resource-exhausted':
      courseError.message = 'Too many requests. Please try again later';
      break;
    case 'unavailable':
      courseError.message = 'Service temporarily unavailable';
      courseError.details = 'Please check your internet connection and try again';
      break;
    default:
      courseError.message = error.message || 'Course operation failed';
  }

  return courseError;
};

// Utility function to convert Firestore timestamps
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp || Date.now());
};

// 1. useCourseProgress - Track user progress through courses
export const useCourseProgress = (courseId: string) => {
  const { user } = useAuthContext();
  const [state, setState] = useState<CourseProgressState>({
    progress: null,
    lessonProgresses: [],
    loading: true,
    error: null,
  });

  // Get course progress
  const fetchProgress = useCallback(async () => {
    if (!user || !courseId) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const progressRef = doc(db, 'courseProgress', `${user.uid}_${courseId}`);
      const progressSnap = await getDoc(progressRef);

      let progress: CourseProgress | null = null;
      if (progressSnap.exists()) {
        const data = progressSnap.data();
        progress = {
          ...data,
          createdAt: convertTimestamp(data.createdAt),
          lastAccessedAt: convertTimestamp(data.lastAccessedAt),
          completedAt: data.completedAt ? convertTimestamp(data.completedAt) : null,
          startedAt: convertTimestamp(data.startedAt),
        } as CourseProgress;
      }

      // Get lesson progresses
      const lessonProgressQuery = query(
        collection(db, 'lessonProgress'),
        where('userId', '==', user.uid),
        where('courseId', '==', courseId)
      );
      const lessonProgressSnap = await getDocs(lessonProgressQuery);
      const lessonProgresses: LessonProgress[] = lessonProgressSnap.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        lastAccessedAt: convertTimestamp(doc.data().lastAccessedAt),
        completedAt: doc.data().completedAt ? convertTimestamp(doc.data().completedAt) : null,
      })) as LessonProgress[];

      setState({
        progress,
        lessonProgresses,
        loading: false,
        error: null,
      });
    } catch (error) {
      const courseError = handleCourseError(error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: courseError.message,
      }));
    }
  }, [user, courseId]);

  // Mark lesson as completed
  const completeLesson = useCallback(async (lessonId: string, xpEarned: number, timeSpent: number) => {
    if (!user || !courseId) return;

    try {
      const batch = writeBatch(db);
      const now = serverTimestamp();

      // Update lesson progress
      const lessonProgressRef = doc(db, 'lessonProgress', `${user.uid}_${courseId}_${lessonId}`);
      batch.set(lessonProgressRef, {
        id: `${user.uid}_${courseId}_${lessonId}`,
        userId: user.uid,
        courseId,
        lessonId,
        isCompleted: true,
        xpEarned,
        timeSpent,
        completedAt: now,
        lastAccessedAt: now,
      }, { merge: true });

      // Update course progress
      const progressRef = doc(db, 'courseProgress', `${user.uid}_${courseId}`);
      const currentProgress = state.progress;
      const completedLessons = currentProgress?.completedLessons || [];
      const newCompletedLessons = [...completedLessons];
      
      if (!newCompletedLessons.includes(lessonId)) {
        newCompletedLessons.push(lessonId);
      }

      batch.set(progressRef, {
        completedLessons: newCompletedLessons,
        xpEarned: increment(xpEarned),
        timeSpent: increment(timeSpent),
        lastAccessedAt: now,
      }, { merge: true });

      // Add XP transaction
      const xpTransactionRef = doc(collection(db, 'xpTransactions'));
      batch.set(xpTransactionRef, {
        userId: user.uid,
        type: 'lesson_complete',
        amount: xpEarned,
        source: {
          id: lessonId,
          type: 'lesson',
          title: `Lesson ${lessonId}`,
        },
        createdAt: now,
      });

      // Update user XP
      const userXPRef = doc(db, 'userXP', user.uid);
      batch.set(userXPRef, {
        totalXP: increment(xpEarned),
        totalLessonsCompleted: increment(1),
        lastActivityAt: now,
      }, { merge: true });

      await batch.commit();

      // Optimistic update
      setState(prev => ({
        ...prev,
        lessonProgresses: prev.lessonProgresses.map(lp =>
          lp.lessonId === lessonId
            ? { ...lp, isCompleted: true, xpEarned, timeSpent, completedAt: new Date() }
            : lp
        ),
        progress: prev.progress ? {
          ...prev.progress,
          completedLessons: newCompletedLessons,
          xpEarned: (prev.progress.xpEarned || 0) + xpEarned,
          timeSpent: (prev.progress.timeSpent || 0) + timeSpent,
        } : prev.progress,
      }));

      toast.success(`Lesson completed! +${xpEarned} XP`);
    } catch (error) {
      const courseError = handleCourseError(error);
      toast.error(courseError.message);
      throw courseError;
    }
  }, [user, courseId, state.progress]);

  // Complete course
  const completeCourse = useCallback(async (totalXpEarned: number) => {
    if (!user || !courseId) return;

    try {
      const batch = writeBatch(db);
      const now = serverTimestamp();

      // Update course progress
      const progressRef = doc(db, 'courseProgress', `${user.uid}_${courseId}`);
      batch.update(progressRef, {
        progressPercentage: 100,
        completedAt: now,
      });

      // Add course completion XP transaction
      const xpTransactionRef = doc(collection(db, 'xpTransactions'));
      batch.set(xpTransactionRef, {
        userId: user.uid,
        type: 'course_complete',
        amount: totalXpEarned,
        source: {
          id: courseId,
          type: 'course',
          title: 'Course Completion Bonus',
        },
        createdAt: now,
      });

      // Update user XP
      const userXPRef = doc(db, 'userXP', user.uid);
      batch.set(userXPRef, {
        totalXP: increment(totalXpEarned),
        totalCoursesCompleted: increment(1),
        lastActivityAt: now,
      }, { merge: true });

      await batch.commit();

      toast.success(`Course completed! +${totalXpEarned} XP bonus!`);
    } catch (error) {
      const courseError = handleCourseError(error);
      toast.error(courseError.message);
      throw courseError;
    }
  }, [user, courseId]);

  // Set up real-time listener
  useEffect(() => {
    if (!user || !courseId) return;

    const progressRef = doc(db, 'courseProgress', `${user.uid}_${courseId}`);
    const unsubscribe = onSnapshot(progressRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const progress: CourseProgress = {
          ...data,
          createdAt: convertTimestamp(data.createdAt),
          lastAccessedAt: convertTimestamp(data.lastAccessedAt),
          completedAt: data.completedAt ? convertTimestamp(data.completedAt) : null,
          startedAt: convertTimestamp(data.startedAt),
        } as CourseProgress;

        setState(prev => ({ ...prev, progress }));
      }
    });

    return unsubscribe;
  }, [user, courseId]);

  // Initial fetch
  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return {
    ...state,
    completeLesson,
    completeCourse,
    refreshProgress: fetchProgress,
  };
};

// 2. useXPSystem - Manage XP transactions and level progression
export const useXPSystem = () => {
  const { user } = useAuthContext();
  const [state, setState] = useState<XPSystemState>({
    userXP: null,
    recentTransactions: [],
    loading: true,
    error: null,
  });

  // Calculate level from XP
  const calculateLevel = useCallback((totalXP: number) => {
    // Level progression: level 1 = 100 XP, level 2 = 300 XP, level 3 = 600 XP, etc.
    // Formula: XP needed for level n = n * 100 + (n-1) * 100 = n * (n+1) * 50
    let level = 1;
    let xpForCurrentLevel = 0;
    
    while (xpForCurrentLevel <= totalXP) {
      level++;
      xpForCurrentLevel = level * (level + 1) * 50;
    }
    
    level--; // Go back to the last valid level
    const xpForThisLevel = level * (level + 1) * 50;
    const xpForNextLevel = (level + 1) * (level + 2) * 50;
    const xpToNextLevel = xpForNextLevel - totalXP;
    
    return {
      currentLevel: level,
      xpToNextLevel: Math.max(0, xpToNextLevel),
    };
  }, []);

  // Fetch user XP data
  const fetchUserXP = useCallback(async () => {
    if (!user) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const userXPRef = doc(db, 'userXP', user.uid);
      const userXPSnap = await getDoc(userXPRef);

      let userXP: UserXP | null = null;
      if (userXPSnap.exists()) {
        const data = userXPSnap.data();
        const levelInfo = calculateLevel(data.totalXP || 0);
        
        userXP = {
          ...data,
          ...levelInfo,
          lastActivityAt: convertTimestamp(data.lastActivityAt),
          badges: data.badges?.map((badge: any) => ({
            ...badge,
            earnedAt: convertTimestamp(badge.earnedAt),
          })) || [],
        } as UserXP;
      } else {
        // Initialize user XP if it doesn't exist
        const initialUserXP = {
          userId: user.uid,
          totalXP: 0,
          currentLevel: 1,
          xpToNextLevel: 100,
          totalLessonsCompleted: 0,
          totalCoursesCompleted: 0,
          currentStreak: 0,
          longestStreak: 0,
          lastActivityAt: new Date(),
          achievements: [],
          badges: [],
        };

        await setDoc(userXPRef, {
          ...initialUserXP,
          lastActivityAt: serverTimestamp(),
        });

        userXP = initialUserXP;
      }

      // Fetch recent transactions
      const transactionsQuery = query(
        collection(db, 'xpTransactions'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const transactionsSnap = await getDocs(transactionsQuery);
      const recentTransactions: XPTransaction[] = transactionsSnap.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: convertTimestamp(doc.data().createdAt),
      })) as XPTransaction[];

      setState({
        userXP,
        recentTransactions,
        loading: false,
        error: null,
      });
    } catch (error) {
      const courseError = handleCourseError(error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: courseError.message,
      }));
    }
  }, [user, calculateLevel]);

  // Add XP transaction
  const addXPTransaction = useCallback(async (
    type: XPTransaction['type'],
    amount: number,
    source: XPTransaction['source'],
    metadata?: Record<string, any>
  ) => {
    if (!user) return;

    try {
      const batch = writeBatch(db);
      const now = serverTimestamp();

      // Add transaction
      const transactionRef = doc(collection(db, 'xpTransactions'));
      batch.set(transactionRef, {
        userId: user.uid,
        type,
        amount,
        source,
        metadata,
        createdAt: now,
      });

      // Update user XP
      const userXPRef = doc(db, 'userXP', user.uid);
      batch.set(userXPRef, {
        totalXP: increment(amount),
        lastActivityAt: now,
      }, { merge: true });

      await batch.commit();

      // Optimistic update
      setState(prev => ({
        ...prev,
        userXP: prev.userXP ? {
          ...prev.userXP,
          totalXP: prev.userXP.totalXP + amount,
          ...calculateLevel(prev.userXP.totalXP + amount),
        } : prev.userXP,
        recentTransactions: [
          {
            id: transactionRef.id,
            userId: user.uid,
            type,
            amount,
            source,
            metadata,
            createdAt: new Date(),
          },
          ...prev.recentTransactions.slice(0, 9),
        ],
      }));

      return transactionRef.id;
    } catch (error) {
      const courseError = handleCourseError(error);
      toast.error(courseError.message);
      throw courseError;
    }
  }, [user, calculateLevel]);

  // Update daily streak
  const updateStreak = useCallback(async () => {
    if (!user) return;

    try {
      const userXPRef = doc(db, 'userXP', user.uid);
      const userXPSnap = await getDoc(userXPRef);
      
      if (userXPSnap.exists()) {
        const data = userXPSnap.data();
        const lastActivity = convertTimestamp(data.lastActivityAt);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const isConsecutiveDay = 
          lastActivity.toDateString() === yesterday.toDateString() ||
          lastActivity.toDateString() === today.toDateString();

        const newStreak = isConsecutiveDay ? (data.currentStreak || 0) + 1 : 1;
        const longestStreak = Math.max(newStreak, data.longestStreak || 0);

        await updateDoc(userXPRef, {
          currentStreak: newStreak,
          longestStreak,
          lastActivityAt: serverTimestamp(),
        });

        // Add streak bonus XP
        if (newStreak > 1) {
          await addXPTransaction(
            'daily_streak',
            newStreak * 5, // 5 XP per day in streak
            {
              id: 'daily_streak',
              type: 'achievement',
              title: `${newStreak} Day Streak!`,
            },
            { streakDays: newStreak }
          );
        }
      }
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }, [user, addXPTransaction]);

  // Set up real-time listener
  useEffect(() => {
    if (!user) return;

    const userXPRef = doc(db, 'userXP', user.uid);
    const unsubscribe = onSnapshot(userXPRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const levelInfo = calculateLevel(data.totalXP || 0);
        
        const userXP: UserXP = {
          ...data,
          ...levelInfo,
          lastActivityAt: convertTimestamp(data.lastActivityAt),
          badges: data.badges?.map((badge: any) => ({
            ...badge,
            earnedAt: convertTimestamp(badge.earnedAt),
          })) || [],
        } as UserXP;

        setState(prev => ({ ...prev, userXP }));
      }
    });

    return unsubscribe;
  }, [user, calculateLevel]);

  // Initial fetch
  useEffect(() => {
    fetchUserXP();
  }, [fetchUserXP]);

  return {
    ...state,
    addXPTransaction,
    updateStreak,
    calculateLevel,
    refreshUserXP: fetchUserXP,
  };
};

// 3. useCourseEnrollment - Handle course enrollment and access
export const useCourseEnrollment = () => {
  const { user } = useAuthContext();
  const [state, setState] = useState<CourseEnrollmentState>({
    enrollments: [],
    loading: true,
    error: null,
  });

  // Fetch user enrollments
  const fetchEnrollments = useCallback(async () => {
    if (!user) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const enrollmentsQuery = query(
        collection(db, 'courseEnrollments'),
        where('userId', '==', user.uid),
        orderBy('enrolledAt', 'desc')
      );
      const enrollmentsSnap = await getDocs(enrollmentsQuery);
      
      const enrollments: CourseEnrollment[] = enrollmentsSnap.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        enrolledAt: convertTimestamp(doc.data().enrolledAt),
        accessExpiresAt: doc.data().accessExpiresAt ? convertTimestamp(doc.data().accessExpiresAt) : null,
      })) as CourseEnrollment[];

      setState({
        enrollments,
        loading: false,
        error: null,
      });
    } catch (error) {
      const courseError = handleCourseError(error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: courseError.message,
      }));
    }
  }, [user]);

  // Enroll in course
  const enrollInCourse = useCallback(async (
    courseId: string,
    paymentStatus: CourseEnrollment['paymentStatus'] = 'free',
    source: CourseEnrollment['source'] = 'direct'
  ) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      const enrollmentId = `${user.uid}_${courseId}`;
      const enrollmentRef = doc(db, 'courseEnrollments', enrollmentId);
      
      // Check if already enrolled
      const existingEnrollment = await getDoc(enrollmentRef);
      if (existingEnrollment.exists()) {
        throw new Error('Already enrolled in this course');
      }

      const batch = writeBatch(db);
      const now = serverTimestamp();

      // Create enrollment
      const enrollment: Partial<CourseEnrollment> = {
        id: enrollmentId,
        userId: user.uid,
        courseId,
        enrolledAt: now,
        status: 'active',
        paymentStatus,
        source,
        accessExpiresAt: null, // For premium courses, set expiration
      };

      batch.set(enrollmentRef, enrollment);

      // Initialize course progress
      const progressRef = doc(db, 'courseProgress', enrollmentId);
      batch.set(progressRef, {
        id: enrollmentId,
        userId: user.uid,
        courseId,
        completedLessons: [],
        currentLessonId: null,
        progressPercentage: 0,
        xpEarned: 0,
        timeSpent: 0,
        lastAccessedAt: now,
        completedAt: null,
        startedAt: now,
      });

      // Update course enrollment count
      const courseRef = doc(db, 'courses', courseId);
      batch.update(courseRef, {
        enrollmentCount: increment(1),
      });

      await batch.commit();

      // Optimistic update
      setState(prev => ({
        ...prev,
        enrollments: [
          {
            ...enrollment,
            enrolledAt: new Date(),
          } as CourseEnrollment,
          ...prev.enrollments,
        ],
      }));

      toast.success('Successfully enrolled in course!');
      return enrollmentId;
    } catch (error) {
      const courseError = handleCourseError(error);
      toast.error(courseError.message);
      throw courseError;
    }
  }, [user]);

  // Check if user has access to course
  const hasAccessToCourse = useCallback((courseId: string): boolean => {
    const enrollment = state.enrollments.find(e => e.courseId === courseId);
    if (!enrollment) return false;

    if (enrollment.status !== 'active') return false;
    
    if (enrollment.accessExpiresAt && enrollment.accessExpiresAt < new Date()) {
      return false;
    }

    return true;
  }, [state.enrollments]);

  // Get enrollment for course
  const getEnrollment = useCallback((courseId: string): CourseEnrollment | null => {
    return state.enrollments.find(e => e.courseId === courseId) || null;
  }, [state.enrollments]);

  // Update enrollment status
  const updateEnrollmentStatus = useCallback(async (
    courseId: string,
    status: CourseEnrollment['status']
  ) => {
    if (!user) return;

    try {
      const enrollmentId = `${user.uid}_${courseId}`;
      const enrollmentRef = doc(db, 'courseEnrollments', enrollmentId);
      
      await updateDoc(enrollmentRef, { status });

      // Optimistic update
      setState(prev => ({
        ...prev,
        enrollments: prev.enrollments.map(e =>
          e.courseId === courseId ? { ...e, status } : e
        ),
      }));

      toast.success('Enrollment status updated');
    } catch (error) {
      const courseError = handleCourseError(error);
      toast.error(courseError.message);
      throw courseError;
    }
  }, [user]);

  // Set up real-time listener
  useEffect(() => {
    if (!user) return;

    const enrollmentsQuery = query(
      collection(db, 'courseEnrollments'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(enrollmentsQuery, (snapshot) => {
      const enrollments: CourseEnrollment[] = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        enrolledAt: convertTimestamp(doc.data().enrolledAt),
        accessExpiresAt: doc.data().accessExpiresAt ? convertTimestamp(doc.data().accessExpiresAt) : null,
      })) as CourseEnrollment[];

      setState(prev => ({ ...prev, enrollments }));
    });

    return unsubscribe;
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  return {
    ...state,
    enrollInCourse,
    hasAccessToCourse,
    getEnrollment,
    updateEnrollmentStatus,
    refreshEnrollments: fetchEnrollments,
  };
};

// 4. useUserStats - Aggregate user statistics and achievements
export const useUserStats = () => {
  const { user } = useAuthContext();
  const [state, setState] = useState<UserStatsState>({
    stats: null,
    loading: true,
    error: null,
  });

  // Fetch user statistics
  const fetchUserStats = useCallback(async () => {
    if (!user) return;

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const statsRef = doc(db, 'userStats', user.uid);
      const statsSnap = await getDoc(statsRef);

      let stats: UserStats | null = null;
      if (statsSnap.exists()) {
        const data = statsSnap.data();
        stats = {
          ...data,
          lastActivityAt: convertTimestamp(data.lastActivityAt),
          joinedAt: convertTimestamp(data.joinedAt),
          achievements: data.achievements?.map((achievement: any) => ({
            ...achievement,
            earnedAt: convertTimestamp(achievement.earnedAt),
          })) || [],
        } as UserStats;
      } else {
        // Initialize user stats if they don't exist
        const initialStats: Partial<UserStats> = {
          userId: user.uid,
          totalXP: 0,
          currentLevel: 1,
          totalCoursesEnrolled: 0,
          totalCoursesCompleted: 0,
          totalLessonsCompleted: 0,
          totalTimeSpent: 0,
          currentStreak: 0,
          longestStreak: 0,
          averageSessionTime: 0,
          favoriteCategory: '',
          lastActivityAt: new Date(),
          joinedAt: new Date(),
          achievements: [],
          monthlyStats: [],
        };

        await setDoc(statsRef, {
          ...initialStats,
          lastActivityAt: serverTimestamp(),
          joinedAt: serverTimestamp(),
        });

        stats = initialStats as UserStats;
      }

      setState({
        stats,
        loading: false,
        error: null,
      });
    } catch (error) {
      const courseError = handleCourseError(error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: courseError.message,
      }));
    }
  }, [user]);

  // Update user stats
  const updateStats = useCallback(async (updates: Partial<UserStats>) => {
    if (!user) return;

    try {
      const statsRef = doc(db, 'userStats', user.uid);
      await updateDoc(statsRef, {
        ...updates,
        lastActivityAt: serverTimestamp(),
      });

      // Optimistic update
      setState(prev => ({
        ...prev,
        stats: prev.stats ? { ...prev.stats, ...updates } : prev.stats,
      }));
    } catch (error) {
      const courseError = handleCourseError(error);
      console.error('Error updating stats:', courseError);
    }
  }, [user]);

  // Get user rank
  const getUserRank = useCallback(async (): Promise<number> => {
    if (!user) return 0;

    try {
      const statsQuery = query(
        collection(db, 'userStats'),
        where('totalXP', '>', (state.stats?.totalXP || 0)),
      );
      const higherXPUsers = await getDocs(statsQuery);
      return higherXPUsers.size + 1;
    } catch (error) {
      console.error('Error getting user rank:', error);
      return 0;
    }
  }, [user, state.stats?.totalXP]);

  // Set up real-time listener
  useEffect(() => {
    if (!user) return;

    const statsRef = doc(db, 'userStats', user.uid);
    const unsubscribe = onSnapshot(statsRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const stats: UserStats = {
          ...data,
          lastActivityAt: convertTimestamp(data.lastActivityAt),
          joinedAt: convertTimestamp(data.joinedAt),
          achievements: data.achievements?.map((achievement: any) => ({
            ...achievement,
            earnedAt: convertTimestamp(achievement.earnedAt),
          })) || [],
        } as UserStats;

        setState(prev => ({ ...prev, stats }));
      }
    });

    return unsubscribe;
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchUserStats();
  }, [fetchUserStats]);

  return {
    ...state,
    updateStats,
    getUserRank,
    refreshStats: fetchUserStats,
  };
};

// 5. useCourseContent - Fetch and manage course content
export const useCourseContent = (filters?: CourseFilters, options?: PaginationOptions) => {
  const [state, setState] = useState<CourseContentState>({
    courses: [],
    lessons: [],
    loading: true,
    error: null,
    hasMore: true,
  });

  // Fetch courses with filters and pagination
  const fetchCourses = useCallback(async (loadMore = false) => {
    try {
      if (!loadMore) {
        setState(prev => ({ ...prev, loading: true, error: null }));
      }

      let coursesQuery = query(collection(db, 'courses'));

      // Apply filters
      if (filters?.category) {
        coursesQuery = query(coursesQuery, where('category', '==', filters.category));
      }
      if (filters?.difficulty) {
        coursesQuery = query(coursesQuery, where('difficulty', '==', filters.difficulty));
      }
      if (filters?.isPremium !== undefined) {
        coursesQuery = query(coursesQuery, where('isPremium', '==', filters.isPremium));
      }
      if (filters?.minRating) {
        coursesQuery = query(coursesQuery, where('rating', '>=', filters.minRating));
      }

      // Apply ordering
      const orderField = options?.orderBy || 'createdAt';
      const orderDirection = options?.orderDirection || 'desc';
      coursesQuery = query(coursesQuery, orderBy(orderField, orderDirection));

      // Apply pagination
      if (options?.limit) {
        coursesQuery = query(coursesQuery, limit(options.limit));
      }

      if (loadMore && options?.startAfter) {
        coursesQuery = query(coursesQuery, startAfter(options.startAfter));
      }

      const coursesSnap = await getDocs(coursesQuery);
      const courses: Course[] = coursesSnap.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt),
      })) as Course[];

      const hasMore = coursesSnap.docs.length === (options?.limit || 20);

      setState(prev => ({
        ...prev,
        courses: loadMore ? [...prev.courses, ...courses] : courses,
        loading: false,
        error: null,
        hasMore,
      }));

      return courses;
    } catch (error) {
      const courseError = handleCourseError(error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: courseError.message,
      }));
      throw courseError;
    }
  }, [filters, options]);

  // Fetch lessons for a specific course
  const fetchLessons = useCallback(async (courseId: string) => {
    try {
      const lessonsQuery = query(
        collection(db, 'lessons'),
        where('courseId', '==', courseId),
        where('isPublished', '==', true),
        orderBy('order', 'asc')
      );
      const lessonsSnap = await getDocs(lessonsQuery);
      
      const lessons: Lesson[] = lessonsSnap.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt),
      })) as Lesson[];

      setState(prev => ({ ...prev, lessons }));
      return lessons;
    } catch (error) {
      const courseError = handleCourseError(error);
      console.error('Error fetching lessons:', courseError);
      throw courseError;
    }
  }, []);

  // Get single course
  const getCourse = useCallback(async (courseId: string): Promise<Course | null> => {
    try {
      const courseRef = doc(db, 'courses', courseId);
      const courseSnap = await getDoc(courseRef);
      
      if (!courseSnap.exists()) {
        return null;
      }

      const data = courseSnap.data();
      return {
        ...data,
        id: courseSnap.id,
        createdAt: convertTimestamp(data.createdAt),
        updatedAt: convertTimestamp(data.updatedAt),
      } as Course;
    } catch (error) {
      const courseError = handleCourseError(error);
      console.error('Error fetching course:', courseError);
      throw courseError;
    }
  }, []);

  // Search courses
  const searchCourses = useCallback(async (searchTerm: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Note: Firestore doesn't have full-text search built-in
      // In a real app, you'd use Algolia, Elasticsearch, or similar
      // For now, we'll search by title contains (limited functionality)
      const coursesQuery = query(
        collection(db, 'courses'),
        where('isPublished', '==', true),
        orderBy('title')
      );

      const coursesSnap = await getDocs(coursesQuery);
      const allCourses = coursesSnap.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: convertTimestamp(doc.data().createdAt),
        updatedAt: convertTimestamp(doc.data().updatedAt),
      })) as Course[];

      // Client-side filtering (not ideal for large datasets)
      const filteredCourses = allCourses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      setState(prev => ({
        ...prev,
        courses: filteredCourses,
        loading: false,
        error: null,
        hasMore: false,
      }));

      return filteredCourses;
    } catch (error) {
      const courseError = handleCourseError(error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: courseError.message,
      }));
      throw courseError;
    }
  }, []);

  // Load more courses
  const loadMoreCourses = useCallback(async () => {
    if (!state.hasMore || state.loading) return;

    const lastCourse = state.courses[state.courses.length - 1];
    if (!lastCourse) return;

    await fetchCourses(true);
  }, [state.hasMore, state.loading, state.courses, fetchCourses]);

  // Memoized filtered courses
  const filteredCourses = useMemo(() => {
    let filtered = [...state.courses];

    if (filters?.maxPrice !== undefined) {
      filtered = filtered.filter(course => course.price <= filters.maxPrice!);
    }

    if (filters?.tags && filters.tags.length > 0) {
      filtered = filtered.filter(course =>
        filters.tags!.some(tag => course.tags.includes(tag))
      );
    }

    return filtered;
  }, [state.courses, filters]);

  // Initial fetch
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    ...state,
    courses: filteredCourses,
    fetchCourses,
    fetchLessons,
    getCourse,
    searchCourses,
    loadMoreCourses,
  };
};