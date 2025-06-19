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
  startAfter,
  writeBatch,
  serverTimestamp,
  increment,
  DocumentSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  Course,
  Lesson,
  Task,
  UserEnrollment,
  UserProgress,
  UserTaskCompletion,
  UserProfile,
  CourseListResponse,
  ProgressSummary,
} from '../types/curriculum';
import { XPSystem } from '../utils/xpSystem';
import toast from 'react-hot-toast';

export class CourseService {
  // Course Management
  static async getCourse(courseId: string): Promise<Course | null> {
    try {
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      if (courseDoc.exists()) {
        return { id: courseDoc.id, ...courseDoc.data() } as Course;
      }
      return null;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  }

  static async getCourses(
    limit_count: number = 10,
    lastDoc?: DocumentSnapshot,
    category?: string,
    difficulty?: string
  ): Promise<CourseListResponse> {
    try {
      let courseQuery = query(
        collection(db, 'courses'),
        where('metadata.isPublished', '==', true),
        orderBy('metadata.publishedAt', 'desc'),
        limit(limit_count)
      );

      if (category) {
        courseQuery = query(courseQuery, where('category', '==', category));
      }

      if (difficulty) {
        courseQuery = query(courseQuery, where('difficulty', '==', difficulty));
      }

      if (lastDoc) {
        courseQuery = query(courseQuery, startAfter(lastDoc));
      }

      const snapshot = await getDocs(courseQuery);
      const courses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];

      return {
        courses,
        total: courses.length,
        hasMore: courses.length === limit_count
      };
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  static async getCourseLessons(courseId: string): Promise<Lesson[]> {
    try {
      const lessonsQuery = query(
        collection(db, 'lessons'),
        where('courseId', '==', courseId),
        where('metadata.isPublished', '==', true),
        orderBy('order', 'asc')
      );

      const snapshot = await getDocs(lessonsQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Lesson[];
    } catch (error) {
      console.error('Error fetching course lessons:', error);
      throw error;
    }
  }

  static async getLessonTasks(lessonId: string): Promise<Task[]> {
    try {
      const tasksQuery = query(
        collection(db, 'tasks'),
        where('lessonId', '==', lessonId),
        where('metadata.isPublished', '==', true),
        orderBy('order', 'asc')
      );

      const snapshot = await getDocs(tasksQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
    } catch (error) {
      console.error('Error fetching lesson tasks:', error);
      throw error;
    }
  }

  // User Enrollment Management
  static async enrollUser(userId: string, courseId: string): Promise<void> {
    try {
      const enrollmentId = `${userId}_${courseId}`;
      const enrollmentDoc = doc(db, 'user_enrollments', enrollmentId);

      // Check if already enrolled
      const existingEnrollment = await getDoc(enrollmentDoc);
      if (existingEnrollment.exists()) {
        toast.error('You are already enrolled in this course');
        return;
      }

      // Get course details for XP calculation
      const course = await this.getCourse(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      const enrollment: UserEnrollment = {
        id: enrollmentId,
        userId,
        courseId,
        enrollment: {
          enrolledAt: serverTimestamp() as Timestamp,
          status: 'enrolled',
          progress: 0
        },
        performance: {
          currentXP: 0,
          totalXP: course.progression.totalXP,
          averageScore: 0,
          timeSpent: 0,
          lessonsCompleted: 0,
          tasksCompleted: 0
        },
        settings: {
          notifications: true,
          reminderFrequency: 'weekly'
        },
        metadata: {
          lastAccessedAt: serverTimestamp() as Timestamp,
          updatedAt: serverTimestamp() as Timestamp
        }
      };

      await setDoc(enrollmentDoc, enrollment);
      toast.success(`Successfully enrolled in ${course.title}!`);
    } catch (error) {
      console.error('Error enrolling user:', error);
      toast.error('Failed to enroll in course');
      throw error;
    }
  }

  static async getUserEnrollments(userId: string): Promise<UserEnrollment[]> {
    try {
      const enrollmentsQuery = query(
        collection(db, 'user_enrollments'),
        where('userId', '==', userId),
        orderBy('enrollment.enrolledAt', 'desc')
      );

      const snapshot = await getDocs(enrollmentsQuery);
      return snapshot.docs.map(doc => doc.data()) as UserEnrollment[];
    } catch (error) {
      console.error('Error fetching user enrollments:', error);
      throw error;
    }
  }

  static async getUserEnrollment(userId: string, courseId: string): Promise<UserEnrollment | null> {
    try {
      const enrollmentId = `${userId}_${courseId}`;
      const enrollmentDoc = await getDoc(doc(db, 'user_enrollments', enrollmentId));
      
      if (enrollmentDoc.exists()) {
        return enrollmentDoc.data() as UserEnrollment;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user enrollment:', error);
      throw error;
    }
  }

  // Progress Tracking
  static async startLesson(userId: string, courseId: string, lessonId: string): Promise<void> {
    try {
      const batch = writeBatch(db);
      const progressId = `${userId}_${lessonId}`;
      const enrollmentId = `${userId}_${courseId}`;

      // Update lesson progress
      const progressDoc = doc(db, 'user_progress', progressId);
      batch.set(progressDoc, {
        id: progressId,
        userId,
        courseId,
        lessonId,
        progress: {
          status: 'in-progress',
          startedAt: serverTimestamp(),
          timeSpent: 0,
          attempts: 1,
          lastAccessedAt: serverTimestamp()
        },
        performance: {
          xpEarned: 0,
          tasksCompleted: 0,
          totalTasks: 0
        }
      });

      // Update enrollment status if first lesson
      const enrollmentDoc = doc(db, 'user_enrollments', enrollmentId);
      batch.update(enrollmentDoc, {
        'enrollment.status': 'in-progress',
        'enrollment.startedAt': serverTimestamp(),
        'metadata.lastAccessedAt': serverTimestamp(),
        'metadata.updatedAt': serverTimestamp()
      });

      await batch.commit();
    } catch (error) {
      console.error('Error starting lesson:', error);
      throw error;
    }
  }

  static async completeTask(
    userId: string,
    courseId: string,
    lessonId: string,
    taskId: string,
    score: number,
    timeSpent: number,
    answers?: any[],
    submissionData?: any
  ): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Get task details for XP calculation
      const taskDoc = await getDoc(doc(db, 'tasks', taskId));
      if (!taskDoc.exists()) {
        throw new Error('Task not found');
      }

      const task = taskDoc.data() as Task;
      const course = await this.getCourse(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      // Calculate XP earned
      const baseXP = XPSystem.calculateTaskXP(
        task.type,
        course.difficulty,
        score,
        task.progression.estimatedMinutes
      );

      // Get user's current streak for bonus
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.data();
      const streakMultiplier = userData?.profile?.streak?.current 
        ? XPSystem.getStreakMultiplier(userData.profile.streak.current)
        : 1.0;

      const finalXP = Math.floor(baseXP * streakMultiplier);
      const isPassed = score >= (task.progression.passingScore || 70);

      // Update task completion
      const completionId = `${userId}_${taskId}`;
      const completionDoc = doc(db, 'user_task_completions', completionId);
      batch.set(completionDoc, {
        id: completionId,
        userId,
        courseId,
        lessonId,
        taskId,
        completion: {
          status: isPassed ? 'completed' : 'failed',
          startedAt: serverTimestamp(),
          completedAt: serverTimestamp(),
          timeSpent,
          attempts: 1,
          maxAttempts: task.progression.maxAttempts
        },
        performance: {
          score,
          xpEarned: isPassed ? finalXP : 0,
          isPassed,
          answers,
          ...submissionData
        },
        metadata: {
          submittedAt: serverTimestamp(),
          gradedAt: serverTimestamp(),
          gradedBy: 'auto-graded'
        }
      });

      if (isPassed) {
        // Update user's total XP and stats
        batch.update(doc(db, 'users', userId), {
          'profile.totalXP': increment(finalXP),
          'profile.stats.tasksCompleted': increment(1),
          'profile.streak.lastActivity': serverTimestamp()
        });

        // Update lesson progress
        const progressId = `${userId}_${lessonId}`;
        batch.update(doc(db, 'user_progress', progressId), {
          'performance.xpEarned': increment(finalXP),
          'performance.tasksCompleted': increment(1),
          'progress.lastAccessedAt': serverTimestamp()
        });

        // Update enrollment performance
        const enrollmentId = `${userId}_${courseId}`;
        batch.update(doc(db, 'user_enrollments', enrollmentId), {
          'performance.currentXP': increment(finalXP),
          'performance.tasksCompleted': increment(1),
          'performance.timeSpent': increment(timeSpent),
          'metadata.lastAccessedAt': serverTimestamp(),
          'metadata.updatedAt': serverTimestamp()
        });
      }

      await batch.commit();

      if (isPassed) {
        toast.success(`Task completed! +${finalXP} XP earned`);
      } else {
        toast.error('Task failed. Try again to earn XP.');
      }
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
      throw error;
    }
  }

  static async completeLesson(userId: string, courseId: string, lessonId: string): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Get lesson details
      const lessonDoc = await getDoc(doc(db, 'lessons', lessonId));
      if (!lessonDoc.exists()) {
        throw new Error('Lesson not found');
      }

      const lesson = lessonDoc.data() as Lesson;

      // Update lesson progress
      const progressId = `${userId}_${lessonId}`;
      batch.update(doc(db, 'user_progress', progressId), {
        'progress.status': 'completed',
        'progress.completedAt': serverTimestamp(),
        'progress.lastAccessedAt': serverTimestamp()
      });

      // Award lesson completion XP
      const lessonXP = lesson.progression.xpReward;
      if (lessonXP > 0) {
        batch.update(doc(db, 'users', userId), {
          'profile.totalXP': increment(lessonXP),
          'profile.streak.lastActivity': serverTimestamp()
        });

        batch.update(doc(db, 'user_progress', progressId), {
          'performance.xpEarned': increment(lessonXP)
        });
      }

      // Update enrollment
      const enrollmentId = `${userId}_${courseId}`;
      batch.update(doc(db, 'user_enrollments', enrollmentId), {
        'performance.lessonsCompleted': increment(1),
        'performance.currentXP': increment(lessonXP),
        'metadata.lastAccessedAt': serverTimestamp(),
        'metadata.updatedAt': serverTimestamp()
      });

      await batch.commit();
      
      if (lessonXP > 0) {
        toast.success(`Lesson completed! +${lessonXP} XP earned`);
      } else {
        toast.success('Lesson completed!');
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
      toast.error('Failed to complete lesson');
      throw error;
    }
  }

  // Dashboard Data
  static async getDashboardData(userId: string): Promise<{
    enrollments: UserEnrollment[];
    recentProgress: UserProgress[];
    progressSummaries: ProgressSummary[];
  }> {
    try {
      // Get user enrollments
      const enrollments = await this.getUserEnrollments(userId);

      // Get recent progress
      const recentProgressQuery = query(
        collection(db, 'user_progress'),
        where('userId', '==', userId),
        orderBy('progress.lastAccessedAt', 'desc'),
        limit(5)
      );

      const progressSnapshot = await getDocs(recentProgressQuery);
      const recentProgress = progressSnapshot.docs.map(doc => doc.data()) as UserProgress[];

      // Create progress summaries
      const progressSummaries: ProgressSummary[] = [];
      
      for (const enrollment of enrollments) {
        if (enrollment.enrollment.status === 'in-progress' || enrollment.enrollment.status === 'completed') {
          const course = await this.getCourse(enrollment.courseId);
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
          }
        }
      }

      return {
        enrollments,
        recentProgress,
        progressSummaries
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  // Streak Management
  static async updateStreak(userId: string): Promise<void> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) return;

      const userData = userDoc.data();
      const now = new Date();
      const lastActivity = userData.profile?.streak?.lastActivity?.toDate();

      if (!lastActivity) {
        // First activity
        await updateDoc(doc(db, 'users', userId), {
          'profile.streak.current': 1,
          'profile.streak.longest': 1,
          'profile.streak.lastActivity': serverTimestamp()
        });
        return;
      }

      const daysDiff = Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        // Continue streak
        const newStreak = (userData.profile?.streak?.current || 0) + 1;
        const longestStreak = Math.max(newStreak, userData.profile?.streak?.longest || 0);

        await updateDoc(doc(db, 'users', userId), {
          'profile.streak.current': newStreak,
          'profile.streak.longest': longestStreak,
          'profile.streak.lastActivity': serverTimestamp()
        });
      } else if (daysDiff > 1) {
        // Streak broken
        await updateDoc(doc(db, 'users', userId), {
          'profile.streak.current': 1,
          'profile.streak.lastActivity': serverTimestamp()
        });
      }
      // Same day - no update needed
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  }

  // Search and Filtering
  static async searchCourses(searchTerm: string, filters?: {
    category?: string;
    difficulty?: string;
    tags?: string[];
  }): Promise<Course[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a basic implementation. For production, consider using Algolia or similar
      let coursesQuery = query(
        collection(db, 'courses'),
        where('metadata.isPublished', '==', true)
      );

      if (filters?.category) {
        coursesQuery = query(coursesQuery, where('category', '==', filters.category));
      }

      if (filters?.difficulty) {
        coursesQuery = query(coursesQuery, where('difficulty', '==', filters.difficulty));
      }

      const snapshot = await getDocs(coursesQuery);
      let courses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];

      // Client-side filtering for search term and tags
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        courses = courses.filter(course =>
          course.title.toLowerCase().includes(term) ||
          course.description.toLowerCase().includes(term) ||
          course.tags.some(tag => tag.toLowerCase().includes(term))
        );
      }

      if (filters?.tags && filters.tags.length > 0) {
        courses = courses.filter(course =>
          filters.tags!.some(tag => course.tags.includes(tag))
        );
      }

      return courses;
    } catch (error) {
      console.error('Error searching courses:', error);
      throw error;
    }
  }
}