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
  Timestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  UserEnrollment,
  Course,
  CourseEnrollment,
} from '../types/curriculum';
import toast from 'react-hot-toast';

export interface EnrollmentOptions {
  source?: 'direct' | 'bundle' | 'gift' | 'admin';
  paymentStatus?: 'free' | 'paid' | 'pending';
  accessDuration?: number; // days
  couponCode?: string;
}

export interface EnrollmentValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  prerequisites: {
    met: string[];
    missing: string[];
  };
}

/**
 * EnrollmentService - Handles course enrollment management
 * Provides methods for enrollment, access control, and enrollment analytics
 */
export class EnrollmentService {
  // Enrollment Management
  static async enrollUser(
    userId: string,
    courseId: string,
    options: EnrollmentOptions = {}
  ): Promise<string> {
    try {
      const enrollmentId = `${userId}_${courseId}`;
      
      // Validate enrollment
      const validation = await this.validateEnrollment(userId, courseId);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const batch = writeBatch(db);

      // Get course details
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      if (!courseDoc.exists()) {
        throw new Error('Course not found');
      }

      const course = courseDoc.data() as Course;
      const now = serverTimestamp();

      // Calculate access expiration
      let accessExpiresAt = null;
      if (options.accessDuration) {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + options.accessDuration);
        accessExpiresAt = Timestamp.fromDate(expirationDate);
      }

      // Create enrollment document
      const enrollment: UserEnrollment = {
        id: enrollmentId,
        userId,
        courseId,
        enrollment: {
          enrolledAt: now as Timestamp,
          status: 'enrolled',
          progress: 0,
        },
        performance: {
          currentXP: 0,
          totalXP: course.progression.totalXP,
          averageScore: 0,
          timeSpent: 0,
          lessonsCompleted: 0,
          tasksCompleted: 0,
        },
        settings: {
          notifications: true,
          reminderFrequency: 'weekly',
        },
        metadata: {
          lastAccessedAt: now as Timestamp,
          updatedAt: now as Timestamp,
        },
      };

      // Legacy CourseEnrollment document for backward compatibility
      const legacyEnrollment: Partial<CourseEnrollment> = {
        id: enrollmentId,
        userId,
        courseId,
        enrolledAt: now as Timestamp,
        status: 'active',
        paymentStatus: options.paymentStatus || 'free',
        source: options.source || 'direct',
        accessExpiresAt,
      };

      const enrollmentRef = doc(db, 'user_enrollments', enrollmentId);
      const legacyEnrollmentRef = doc(db, 'courseEnrollments', enrollmentId);

      batch.set(enrollmentRef, enrollment);
      batch.set(legacyEnrollmentRef, legacyEnrollment);

      // Update course enrollment count
      const courseRef = doc(db, 'courses', courseId);
      batch.update(courseRef, {
        enrollmentCount: increment(1),
      });

      // Update user's enrolled courses list
      const userRef = doc(db, 'users', userId);
      batch.update(userRef, {
        'profile.stats.coursesEnrolled': increment(1),
        enrolledCourses: arrayUnion(courseId),
      });

      // Initialize course progress
      const progressRef = doc(db, 'user_progress', `${userId}_${courseId}_initial`);
      batch.set(progressRef, {
        id: `${userId}_${courseId}_initial`,
        userId,
        courseId,
        lessonId: null,
        progress: {
          status: 'not-started',
          timeSpent: 0,
          attempts: 0,
          lastAccessedAt: now,
        },
        performance: {
          xpEarned: 0,
          tasksCompleted: 0,
          totalTasks: 0,
        },
      });

      await batch.commit();

      toast.success(`Successfully enrolled in ${course.title}!`);
      return enrollmentId;
    } catch (error) {
      console.error('Error enrolling user:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to enroll in course');
      throw error;
    }
  }

  static async validateEnrollment(userId: string, courseId: string): Promise<EnrollmentValidation> {
    try {
      const validation: EnrollmentValidation = {
        isValid: true,
        errors: [],
        warnings: [],
        prerequisites: { met: [], missing: [] },
      };

      // Check if already enrolled
      const enrollmentId = `${userId}_${courseId}`;
      const existingEnrollment = await getDoc(doc(db, 'user_enrollments', enrollmentId));
      
      if (existingEnrollment.exists()) {
        const data = existingEnrollment.data();
        if (data.enrollment.status === 'enrolled' || data.enrollment.status === 'in-progress') {
          validation.isValid = false;
          validation.errors.push('Already enrolled in this course');
          return validation;
        }
      }

      // Get course details
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      if (!courseDoc.exists()) {
        validation.isValid = false;
        validation.errors.push('Course not found');
        return validation;
      }

      const course = courseDoc.data() as Course;

      // Check if course is published
      if (!course.metadata.isPublished) {
        validation.isValid = false;
        validation.errors.push('Course is not available for enrollment');
        return validation;
      }

      // Check prerequisites
      if (course.content.prerequisites && course.content.prerequisites.length > 0) {
        const userEnrollmentsQuery = query(
          collection(db, 'user_enrollments'),
          where('userId', '==', userId),
          where('enrollment.status', '==', 'completed')
        );
        
        const userEnrollments = await getDocs(userEnrollmentsQuery);
        const completedCourses = new Set(
          userEnrollments.docs.map(doc => doc.data().courseId)
        );

        for (const prerequisite of course.content.prerequisites) {
          if (completedCourses.has(prerequisite)) {
            validation.prerequisites.met.push(prerequisite);
          } else {
            validation.prerequisites.missing.push(prerequisite);
          }
        }

        if (validation.prerequisites.missing.length > 0) {
          validation.isValid = false;
          validation.errors.push(
            `Missing prerequisites: ${validation.prerequisites.missing.join(', ')}`
          );
        }
      }

      // Check user enrollment limits (if any)
      const userEnrollmentsCount = await getDocs(query(
        collection(db, 'user_enrollments'),
        where('userId', '==', userId),
        where('enrollment.status', 'in', ['enrolled', 'in-progress'])
      ));

      if (userEnrollmentsCount.size >= 10) { // Max 10 active enrollments
        validation.warnings.push('You have many active enrollments. Consider completing some before enrolling in new courses.');
      }

      return validation;
    } catch (error) {
      console.error('Error validating enrollment:', error);
      return {
        isValid: false,
        errors: ['Validation failed'],
        warnings: [],
        prerequisites: { met: [], missing: [] },
      };
    }
  }

  static async unenrollUser(userId: string, courseId: string, reason?: string): Promise<void> {
    try {
      const enrollmentId = `${userId}_${courseId}`;
      const batch = writeBatch(db);

      // Update enrollment status
      const enrollmentRef = doc(db, 'user_enrollments', enrollmentId);
      batch.update(enrollmentRef, {
        'enrollment.status': 'dropped',
        'metadata.unenrolledAt': serverTimestamp(),
        'metadata.unenrollReason': reason || 'User requested',
      });

      // Update legacy enrollment
      const legacyEnrollmentRef = doc(db, 'courseEnrollments', enrollmentId);
      batch.update(legacyEnrollmentRef, {
        status: 'cancelled',
      });

      // Update course enrollment count
      const courseRef = doc(db, 'courses', courseId);
      batch.update(courseRef, {
        enrollmentCount: increment(-1),
      });

      // Update user's enrolled courses list
      const userRef = doc(db, 'users', userId);
      batch.update(userRef, {
        enrolledCourses: arrayRemove(courseId),
      });

      await batch.commit();
      toast.success('Successfully unenrolled from course');
    } catch (error) {
      console.error('Error unenrolling user:', error);
      toast.error('Failed to unenroll from course');
      throw error;
    }
  }

  // Access Control
  static async checkCourseAccess(userId: string, courseId: string): Promise<{
    hasAccess: boolean;
    enrollment: UserEnrollment | null;
    accessType: 'free' | 'paid' | 'expired' | 'none';
    expiresAt: Date | null;
  }> {
    try {
      const enrollmentId = `${userId}_${courseId}`;
      const enrollmentDoc = await getDoc(doc(db, 'user_enrollments', enrollmentId));

      if (!enrollmentDoc.exists()) {
        return {
          hasAccess: false,
          enrollment: null,
          accessType: 'none',
          expiresAt: null,
        };
      }

      const enrollment = enrollmentDoc.data() as UserEnrollment;
      const now = new Date();

      // Check if enrollment is active
      if (enrollment.enrollment.status === 'dropped') {
        return {
          hasAccess: false,
          enrollment,
          accessType: 'none',
          expiresAt: null,
        };
      }

      // Check legacy enrollment for payment status and expiration
      const legacyEnrollmentDoc = await getDoc(doc(db, 'courseEnrollments', enrollmentId));
      let accessType: 'free' | 'paid' | 'expired' = 'free';
      let expiresAt: Date | null = null;

      if (legacyEnrollmentDoc.exists()) {
        const legacyData = legacyEnrollmentDoc.data();
        accessType = legacyData.paymentStatus === 'paid' ? 'paid' : 'free';
        expiresAt = legacyData.accessExpiresAt?.toDate() || null;

        // Check if access has expired
        if (expiresAt && expiresAt < now) {
          return {
            hasAccess: false,
            enrollment,
            accessType: 'expired',
            expiresAt,
          };
        }
      }

      return {
        hasAccess: true,
        enrollment,
        accessType,
        expiresAt,
      };
    } catch (error) {
      console.error('Error checking course access:', error);
      return {
        hasAccess: false,
        enrollment: null,
        accessType: 'none',
        expiresAt: null,
      };
    }
  }

  static async extendAccess(
    userId: string,
    courseId: string,
    additionalDays: number
  ): Promise<void> {
    try {
      const enrollmentId = `${userId}_${courseId}`;
      const legacyEnrollmentRef = doc(db, 'courseEnrollments', enrollmentId);
      const legacyDoc = await getDoc(legacyEnrollmentRef);

      if (!legacyDoc.exists()) {
        throw new Error('Enrollment not found');
      }

      const legacyData = legacyDoc.data();
      const currentExpiration = legacyData.accessExpiresAt?.toDate() || new Date();
      const newExpiration = new Date(currentExpiration);
      newExpiration.setDate(newExpiration.getDate() + additionalDays);

      await updateDoc(legacyEnrollmentRef, {
        accessExpiresAt: Timestamp.fromDate(newExpiration),
      });

      toast.success(`Access extended by ${additionalDays} days`);
    } catch (error) {
      console.error('Error extending access:', error);
      toast.error('Failed to extend access');
      throw error;
    }
  }

  // Real-time Listeners
  static createEnrollmentListener(
    userId: string,
    callback: (enrollments: UserEnrollment[]) => void
  ): () => void {
    try {
      const enrollmentsQuery = query(
        collection(db, 'user_enrollments'),
        where('userId', '==', userId),
        orderBy('enrollment.enrolledAt', 'desc')
      );

      return onSnapshot(enrollmentsQuery, (snapshot) => {
        const enrollments: UserEnrollment[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
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
        });
        callback(enrollments);
      }, (error) => {
        console.error('Enrollment listener error:', error);
        callback([]);
      });
    } catch (error) {
      console.error('Error creating enrollment listener:', error);
      return () => {};
    }
  }

  // Enrollment Analytics
  static async getEnrollmentStats(userId: string): Promise<{
    totalEnrollments: number;
    activeEnrollments: number;
    completedEnrollments: number;
    droppedEnrollments: number;
    enrollmentsByCategory: Record<string, number>;
    enrollmentsByDifficulty: Record<string, number>;
    averageCompletionTime: number;
  }> {
    try {
      const enrollmentsQuery = query(
        collection(db, 'user_enrollments'),
        where('userId', '==', userId)
      );

      const enrollments = await getDocs(enrollmentsQuery);
      
      let totalEnrollments = 0;
      let activeEnrollments = 0;
      let completedEnrollments = 0;
      let droppedEnrollments = 0;
      let totalCompletionTime = 0;
      
      const enrollmentsByCategory: Record<string, number> = {};
      const enrollmentsByDifficulty: Record<string, number> = {};

      // Get course details for each enrollment
      const courseIds = new Set<string>();
      enrollments.docs.forEach(doc => {
        courseIds.add(doc.data().courseId);
      });

      const courseDetails: Record<string, Course> = {};
      for (const courseId of courseIds) {
        const courseDoc = await getDoc(doc(db, 'courses', courseId));
        if (courseDoc.exists()) {
          courseDetails[courseId] = courseDoc.data() as Course;
        }
      }

      enrollments.docs.forEach(doc => {
        const data = doc.data();
        const course = courseDetails[data.courseId];
        
        totalEnrollments++;
        
        switch (data.enrollment.status) {
          case 'enrolled':
          case 'in-progress':
            activeEnrollments++;
            break;
          case 'completed':
            completedEnrollments++;
            if (data.enrollment.enrolledAt && data.enrollment.completedAt) {
              const enrolledAt = data.enrollment.enrolledAt.toDate();
              const completedAt = data.enrollment.completedAt.toDate();
              totalCompletionTime += (completedAt.getTime() - enrolledAt.getTime()) / (1000 * 60 * 60 * 24); // days
            }
            break;
          case 'dropped':
            droppedEnrollments++;
            break;
        }

        if (course) {
          // Count by category
          enrollmentsByCategory[course.category] = (enrollmentsByCategory[course.category] || 0) + 1;
          
          // Count by difficulty
          enrollmentsByDifficulty[course.difficulty] = (enrollmentsByDifficulty[course.difficulty] || 0) + 1;
        }
      });

      const averageCompletionTime = completedEnrollments > 0 ? totalCompletionTime / completedEnrollments : 0;

      return {
        totalEnrollments,
        activeEnrollments,
        completedEnrollments,
        droppedEnrollments,
        enrollmentsByCategory,
        enrollmentsByDifficulty,
        averageCompletionTime,
      };
    } catch (error) {
      console.error('Error getting enrollment stats:', error);
      throw error;
    }
  }

  // Bulk Operations
  static async bulkEnroll(
    userIds: string[],
    courseId: string,
    options: EnrollmentOptions = {}
  ): Promise<{ successful: string[]; failed: Array<{ userId: string; error: string }> }> {
    const successful: string[] = [];
    const failed: Array<{ userId: string; error: string }> = [];

    for (const userId of userIds) {
      try {
        await this.enrollUser(userId, courseId, options);
        successful.push(userId);
      } catch (error) {
        failed.push({
          userId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return { successful, failed };
  }

  static async transferEnrollment(
    fromUserId: string,
    toUserId: string,
    courseId: string
  ): Promise<void> {
    try {
      const fromEnrollmentId = `${fromUserId}_${courseId}`;
      const toEnrollmentId = `${toUserId}_${courseId}`;

      // Check if source enrollment exists
      const fromEnrollmentDoc = await getDoc(doc(db, 'user_enrollments', fromEnrollmentId));
      if (!fromEnrollmentDoc.exists()) {
        throw new Error('Source enrollment not found');
      }

      // Check if target user already enrolled
      const toEnrollmentDoc = await getDoc(doc(db, 'user_enrollments', toEnrollmentId));
      if (toEnrollmentDoc.exists()) {
        throw new Error('Target user already enrolled');
      }

      const batch = writeBatch(db);
      const enrollmentData = fromEnrollmentDoc.data();

      // Create new enrollment for target user
      batch.set(doc(db, 'user_enrollments', toEnrollmentId), {
        ...enrollmentData,
        id: toEnrollmentId,
        userId: toUserId,
        metadata: {
          ...enrollmentData.metadata,
          transferredFrom: fromUserId,
          transferredAt: serverTimestamp(),
        },
      });

      // Remove old enrollment
      batch.delete(doc(db, 'user_enrollments', fromEnrollmentId));

      // Update user enrollment lists
      batch.update(doc(db, 'users', fromUserId), {
        enrolledCourses: arrayRemove(courseId),
      });

      batch.update(doc(db, 'users', toUserId), {
        enrolledCourses: arrayUnion(courseId),
      });

      await batch.commit();
      toast.success('Enrollment transferred successfully');
    } catch (error) {
      console.error('Error transferring enrollment:', error);
      toast.error('Failed to transfer enrollment');
      throw error;
    }
  }
}