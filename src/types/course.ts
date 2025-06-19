export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  xpReward: number;
  prerequisites: string[]; // course IDs
  tags: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  instructorId: string;
  instructorName: string;
  price: number;
  isPremium: boolean;
  enrollmentCount: number;
  rating: number;
  reviewCount: number;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  duration: number; // in minutes
  xpReward: number;
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseProgress {
  id: string;
  userId: string;
  courseId: string;
  completedLessons: string[];
  currentLessonId: string | null;
  progressPercentage: number;
  xpEarned: number;
  timeSpent: number; // in minutes
  lastAccessedAt: Date;
  completedAt: Date | null;
  startedAt: Date;
  certificate?: {
    id: string;
    issuedAt: Date;
    certificateUrl: string;
  };
}

export interface LessonProgress {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  isCompleted: boolean;
  xpEarned: number;
  timeSpent: number;
  completedAt: Date | null;
  lastAccessedAt: Date;
  notes?: string;
  quiz?: {
    attempts: number;
    bestScore: number;
    lastAttemptAt: Date;
  };
}

export interface XPTransaction {
  id: string;
  userId: string;
  type: 'lesson_complete' | 'course_complete' | 'achievement' | 'daily_streak' | 'bonus';
  amount: number;
  source: {
    id: string;
    type: 'lesson' | 'course' | 'achievement';
    title: string;
  };
  createdAt: Date;
  metadata?: Record<string, any>;
}

export interface UserXP {
  userId: string;
  totalXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  totalLessonsCompleted: number;
  totalCoursesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityAt: Date;
  achievements: string[];
  badges: UserBadge[];
}

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  earnedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  paymentStatus: 'free' | 'paid' | 'pending';
  accessExpiresAt: Date | null;
  source: 'direct' | 'bundle' | 'gift' | 'admin';
}

export interface UserStats {
  userId: string;
  totalXP: number;
  currentLevel: number;
  totalCoursesEnrolled: number;
  totalCoursesCompleted: number;
  totalLessonsCompleted: number;
  totalTimeSpent: number; // in minutes
  currentStreak: number;
  longestStreak: number;
  averageSessionTime: number;
  favoriteCategory: string;
  lastActivityAt: Date;
  joinedAt: Date;
  achievements: Achievement[];
  monthlyStats: MonthlyStats[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  type: 'milestone' | 'streak' | 'speed' | 'category' | 'special';
  criteria: Record<string, any>;
  earnedAt: Date;
  xpReward: number;
}

export interface MonthlyStats {
  month: string; // YYYY-MM
  coursesCompleted: number;
  lessonsCompleted: number;
  xpEarned: number;
  timeSpent: number;
  streakDays: number;
}

// Error types
export interface CourseError {
  code: string;
  message: string;
  details?: string;
}

// Hook state types
export interface CourseProgressState {
  progress: CourseProgress | null;
  lessonProgresses: LessonProgress[];
  loading: boolean;
  error: string | null;
}

export interface XPSystemState {
  userXP: UserXP | null;
  recentTransactions: XPTransaction[];
  loading: boolean;
  error: string | null;
}

export interface CourseEnrollmentState {
  enrollments: CourseEnrollment[];
  loading: boolean;
  error: string | null;
}

export interface UserStatsState {
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
}

export interface CourseContentState {
  courses: Course[];
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

// Utility types
export interface PaginationOptions {
  limit?: number;
  startAfter?: any;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface CourseFilters {
  category?: string;
  difficulty?: Course['difficulty'];
  isPremium?: boolean;
  tags?: string[];
  minRating?: number;
  maxPrice?: number;
}