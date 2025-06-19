import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  serverTimestamp,
  increment,
  onSnapshot,
  DocumentSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  UserEnrollment,
  UserProgress,
  UserTaskCompletion,
  Course,
  Lesson,
  Task,
} from '../types/curriculum';
import toast from 'react-hot-toast';

/**
 * ProgressService - Handles real-time progress tracking for users
 * Provides methods for tracking lesson progress, task completion, and course advancement
 */
export class ProgressService {
  // Real-time Progress Listeners
  static createProgressListener(
    userId: string, 
    courseId: string, 
    callback: (progress: UserEnrollment | null) => void
  ): () => void {
    try {
      const enrollmentId = `${userId}_${courseId}`;
      const enrollmentRef = doc(db, 'user_enrollments', enrollmentId);
      
      return onSnapshot(enrollmentRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const enrollment: UserEnrollment = {
            ...data,
            enrollment: {
              ...data.enrollment,
              enrolledAt: data.enrollment.enrolledAt?.toDate() || new Date(),
              startedAt: data.enrollment.startedAt?.toDate() || undefined,
              completedAt: data.enrollment.completedAt?.toDate() || undefined,
            },
            metadata: {
              ...data.metadata,
              lastAccessedAt: data.metadata.lastAccessedAt?.toDate() || new Date(),
              updatedAt: data.metadata.updatedAt?.toDate() || new Date(),
            },
          } as UserEnrollment;
          callback(enrollment);
        } else {
          callback(null);
        }
      }, (error) => {
        console.error('Progress listener error:', error);
        callback(null);
      });
    } catch (error) {
      console.error('Error creating progress listener:', error);
      return () => {};
    }
  }

  static createLessonProgressListener(
    userId: string,
    courseId: string,
    callback: (progresses: UserProgress[]) => void
  ): () => void {
    try {
      const progressQuery = query(
        collection(db, 'user_progress'),
        where('userId', '==', userId),
        where('courseId', '==', courseId),
        orderBy('progress.lastAccessedAt', 'desc')
      );

      return onSnapshot(progressQuery, (snapshot) => {
        const progresses: UserProgress[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            progress: {
              ...data.progress,
              startedAt: data.progress.startedAt?.toDate() || undefined,
              completedAt: data.progress.completedAt?.toDate() || undefined,
              lastAccessedAt: data.progress.lastAccessedAt?.toDate() || new Date(),
            },
          } as UserProgress;
        });
        callback(progresses);
      }, (error) => {
        console.error('Lesson progress listener error:', error);
        callback([]);
      });
    } catch (error) {
      console.error('Error creating lesson progress listener:', error);
      return () => {};
    }
  }

  static createTaskCompletionListener(
    userId: string,
    lessonId: string,
    callback: (completions: UserTaskCompletion[]) => void
  ): () => void {
    try {
      const completionQuery = query(
        collection(db, 'user_task_completions'),
        where('userId', '==', userId),
        where('lessonId', '==', lessonId),
        orderBy('completion.completedAt', 'desc')
      );

      return onSnapshot(completionQuery, (snapshot) => {
        const completions: UserTaskCompletion[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            completion: {
              ...data.completion,
              startedAt: data.completion.startedAt?.toDate() || new Date(),
              completedAt: data.completion.completedAt?.toDate() || undefined,
            },
            metadata: {
              ...data.metadata,
              submittedAt: data.metadata?.submittedAt?.toDate() || undefined,
              gradedAt: data.metadata?.gradedAt?.toDate() || undefined,
            },
          } as UserTaskCompletion;
        });
        callback(completions);
      }, (error) => {
        console.error('Task completion listener error:', error);
        callback([]);
      });
    } catch (error) {
      console.error('Error creating task completion listener:', error);
      return () => {};
    }
  }

  // Progress Management
  static async updateLessonProgress(
    userId: string,
    courseId: string,
    lessonId: string,
    updates: Partial<UserProgress>
  ): Promise<void> {
    try {
      const progressId = `${userId}_${lessonId}`;
      const progressRef = doc(db, 'user_progress', progressId);
      
      await updateDoc(progressRef, {
        ...updates,
        'progress.lastAccessedAt': serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      throw error;
    }
  }

  static async calculateCourseProgress(
    userId: string,
    courseId: string
  ): Promise<{
    progressPercentage: number;
    completedLessons: number;
    totalLessons: number;
    xpEarned: number;
    totalTimeSpent: number;
  }> {
    try {
      // Get course lessons
      const lessonsQuery = query(
        collection(db, 'lessons'),
        where('courseId', '==', courseId),
        where('metadata.isPublished', '==', true)
      );
      const lessonsSnapshot = await getDocs(lessonsQuery);
      const totalLessons = lessonsSnapshot.size;

      // Get user progress for this course
      const progressQuery = query(
        collection(db, 'user_progress'),
        where('userId', '==', userId),
        where('courseId', '==', courseId)
      );
      const progressSnapshot = await getDocs(progressQuery);
      
      let completedLessons = 0;
      let xpEarned = 0;
      let totalTimeSpent = 0;

      progressSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.progress.status === 'completed') {
          completedLessons++;
        }
        xpEarned += data.performance.xpEarned || 0;
        totalTimeSpent += data.progress.timeSpent || 0;
      });

      const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        progressPercentage,
        completedLessons,
        totalLessons,
        xpEarned,
        totalTimeSpent,
      };
    } catch (error) {
      console.error('Error calculating course progress:', error);
      throw error;
    }
  }

  static async updateCourseProgress(userId: string, courseId: string): Promise<void> {
    try {
      const stats = await this.calculateCourseProgress(userId, courseId);
      const enrollmentId = `${userId}_${courseId}`;
      const enrollmentRef = doc(db, 'user_enrollments', enrollmentId);

      const updates = {
        'enrollment.progress': stats.progressPercentage,
        'performance.currentXP': stats.xpEarned,
        'performance.timeSpent': stats.totalTimeSpent,
        'performance.lessonsCompleted': stats.completedLessons,
        'metadata.lastAccessedAt': serverTimestamp(),
        'metadata.updatedAt': serverTimestamp(),
      };

      // Mark as completed if 100% progress
      if (stats.progressPercentage === 100) {
        Object.assign(updates, {
          'enrollment.status': 'completed' as const,
          'enrollment.completedAt': serverTimestamp(),
        });
      }

      await updateDoc(enrollmentRef, updates);
    } catch (error) {
      console.error('Error updating course progress:', error);
      throw error;
    }
  }

  // Batch Progress Operations
  static async batchUpdateProgress(operations: Array<{
    userId: string;
    courseId: string;
    lessonId?: string;
    taskId?: string;
    type: 'lesson_start' | 'lesson_complete' | 'task_complete';
    data: any;
  }>): Promise<void> {
    try {
      const batch = writeBatch(db);
      
      for (const operation of operations) {
        switch (operation.type) {
          case 'lesson_start':
            const progressId = `${operation.userId}_${operation.lessonId}`;
            const progressRef = doc(db, 'user_progress', progressId);
            batch.set(progressRef, {
              id: progressId,
              userId: operation.userId,
              courseId: operation.courseId,
              lessonId: operation.lessonId,
              progress: {
                status: 'in-progress',
                startedAt: serverTimestamp(),
                timeSpent: 0,
                attempts: 1,
                lastAccessedAt: serverTimestamp(),
              },
              performance: {
                xpEarned: 0,
                tasksCompleted: 0,
                totalTasks: operation.data.totalTasks || 0,
              },
            });
            break;

          case 'lesson_complete':
            const lessonProgressRef = doc(db, 'user_progress', `${operation.userId}_${operation.lessonId}`);
            batch.update(lessonProgressRef, {
              'progress.status': 'completed',
              'progress.completedAt': serverTimestamp(),
              'performance.xpEarned': increment(operation.data.xpEarned || 0),
              'progress.timeSpent': increment(operation.data.timeSpent || 0),
            });
            break;

          case 'task_complete':
            const completionId = `${operation.userId}_${operation.taskId}`;
            const completionRef = doc(db, 'user_task_completions', completionId);
            batch.set(completionRef, {
              id: completionId,
              userId: operation.userId,
              courseId: operation.courseId,
              lessonId: operation.lessonId,
              taskId: operation.taskId,
              completion: {
                status: operation.data.isPassed ? 'completed' : 'failed',
                startedAt: serverTimestamp(),
                completedAt: serverTimestamp(),
                timeSpent: operation.data.timeSpent || 0,
                attempts: 1,
              },
              performance: {
                score: operation.data.score,
                xpEarned: operation.data.xpEarned || 0,
                isPassed: operation.data.isPassed,
                answers: operation.data.answers,
              },
              metadata: {
                submittedAt: serverTimestamp(),
                gradedAt: serverTimestamp(),
                gradedBy: 'auto-graded',
              },
            });
            break;
        }
      }

      await batch.commit();
    } catch (error) {
      console.error('Error in batch progress update:', error);
      throw error;
    }
  }

  // Progress Analytics
  static async getProgressAnalytics(userId: string, timeRange: 'week' | 'month' | 'all' = 'all') {
    try {
      const now = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        default:
          startDate.setFullYear(2020); // Far back date for 'all'
      }

      // Get task completions in time range
      const completionsQuery = query(
        collection(db, 'user_task_completions'),
        where('userId', '==', userId),
        where('completion.completedAt', '>=', Timestamp.fromDate(startDate)),
        orderBy('completion.completedAt', 'desc')
      );

      const completionsSnapshot = await getDocs(completionsQuery);
      
      let totalXP = 0;
      let totalTasks = 0;
      let totalTimeSpent = 0;
      const dailyStats: Record<string, { xp: number; tasks: number; time: number }> = {};

      completionsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.performance.isPassed) {
          totalXP += data.performance.xpEarned || 0;
          totalTasks++;
          totalTimeSpent += data.completion.timeSpent || 0;

          const date = data.completion.completedAt?.toDate().toDateString() || '';
          if (!dailyStats[date]) {
            dailyStats[date] = { xp: 0, tasks: 0, time: 0 };
          }
          dailyStats[date].xp += data.performance.xpEarned || 0;
          dailyStats[date].tasks++;
          dailyStats[date].time += data.completion.timeSpent || 0;
        }
      });

      // Get lesson completions
      const progressQuery = query(
        collection(db, 'user_progress'),
        where('userId', '==', userId),
        where('progress.completedAt', '>=', Timestamp.fromDate(startDate)),
        where('progress.status', '==', 'completed')
      );

      const progressSnapshot = await getDocs(progressQuery);
      const lessonsCompleted = progressSnapshot.size;

      return {
        totalXP,
        totalTasks,
        lessonsCompleted,
        totalTimeSpent,
        dailyStats: Object.entries(dailyStats).map(([date, stats]) => ({
          date,
          ...stats,
        })),
        averageSessionTime: totalTasks > 0 ? Math.round(totalTimeSpent / totalTasks) : 0,
      };
    } catch (error) {
      console.error('Error getting progress analytics:', error);
      throw error;
    }
  }

  // Streak Management
  static async updateDailyStreak(userId: string): Promise<{
    streakContinued: boolean;
    currentStreak: number;
    xpBonus: number;
  }> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const profile = userData.profile || {};
      const streak = profile.streak || { current: 0, longest: 0, lastActivity: null };
      
      const now = new Date();
      const today = now.toDateString();
      const lastActivity = streak.lastActivity?.toDate();
      const lastActivityDate = lastActivity ? lastActivity.toDateString() : null;
      
      let streakContinued = false;
      let currentStreak = 1;
      let xpBonus = 0;

      if (lastActivityDate === today) {
        // Already active today, no change
        return {
          streakContinued: true,
          currentStreak: streak.current,
          xpBonus: 0,
        };
      }

      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDate = yesterday.toDateString();

      if (lastActivityDate === yesterdayDate) {
        // Continue streak
        currentStreak = (streak.current || 0) + 1;
        streakContinued = true;
      } else if (lastActivityDate && lastActivityDate < yesterdayDate) {
        // Streak broken, start new
        currentStreak = 1;
        streakContinued = false;
      }

      // Calculate XP bonus based on streak
      if (currentStreak >= 3) {
        xpBonus = Math.min(currentStreak * 2, 50); // Max 50 XP bonus
      }

      const longestStreak = Math.max(currentStreak, streak.longest || 0);

      // Update user profile
      await updateDoc(userRef, {
        'profile.streak.current': currentStreak,
        'profile.streak.longest': longestStreak,
        'profile.streak.lastActivity': serverTimestamp(),
      });

      return {
        streakContinued,
        currentStreak,
        xpBonus,
      };
    } catch (error) {
      console.error('Error updating daily streak:', error);
      throw error;
    }
  }

  // Progress Recovery (for offline support)
  static async syncOfflineProgress(
    userId: string,
    offlineActions: Array<{
      type: string;
      courseId: string;
      lessonId?: string;
      taskId?: string;
      data: any;
      timestamp: Date;
    }>
  ): Promise<void> {
    try {
      const batch = writeBatch(db);
      const processed = new Set<string>();

      // Sort actions by timestamp
      const sortedActions = offlineActions.sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
      );

      for (const action of sortedActions) {
        const actionKey = `${action.type}_${action.courseId}_${action.lessonId || ''}_${action.taskId || ''}`;
        
        // Skip duplicate actions
        if (processed.has(actionKey)) continue;
        processed.add(actionKey);

        // Apply action based on type
        switch (action.type) {
          case 'lesson_progress':
            const progressRef = doc(db, 'user_progress', `${userId}_${action.lessonId}`);
            batch.update(progressRef, {
              'progress.timeSpent': increment(action.data.timeSpent || 0),
              'progress.lastAccessedAt': Timestamp.fromDate(action.timestamp),
            });
            break;

          case 'task_completion':
            const completionRef = doc(db, 'user_task_completions', `${userId}_${action.taskId}`);
            batch.set(completionRef, {
              ...action.data,
              'completion.completedAt': Timestamp.fromDate(action.timestamp),
              'metadata.submittedAt': Timestamp.fromDate(action.timestamp),
            }, { merge: true });
            break;
        }
      }

      await batch.commit();
      toast.success('Progress synchronized successfully');
    } catch (error) {
      console.error('Error syncing offline progress:', error);
      toast.error('Failed to sync offline progress');
      throw error;
    }
  }
}