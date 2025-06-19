import { Timestamp } from 'firebase/firestore';

// Enhanced User Profile Types
export interface UserProfile {
  totalXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  streak: {
    current: number;
    longest: number;
    lastActivity: Timestamp;
  };
  stats: {
    coursesCompleted: number;
    certificatesEarned: number;
    hoursLearned: number;
    tasksCompleted: number;
  };
}

export interface UserLearningPreferences {
  preferredDifficulty: 'beginner' | 'intermediate' | 'advanced';
  dailyGoalMinutes: number;
  reminderTime?: string; // HH:MM format
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  content: {
    estimatedHours: number;
    lessonCount: number;
    taskCount: number;
    prerequisites: string[];
  };
  progression: {
    totalXP: number;
    passingScore: number;
    certificateEligible: boolean;
  };
  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    createdBy: string;
    version: string;
    isPublished: boolean;
    publishedAt?: Timestamp;
  };
  settings: {
    allowRetakes: boolean;
    showProgress: boolean;
    randomizeQuestions: boolean;
    timeLimit?: number;
  };
}

// Lesson Types
export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  content: {
    type: 'video' | 'text' | 'interactive' | 'mixed';
    videoUrl?: string;
    videoDuration?: number;
    textContent?: string;
    resources: LessonResource[];
  };
  progression: {
    xpReward: number;
    estimatedMinutes: number;
    requiredForProgress: boolean;
    unlockConditions?: {
      previousLessons: string[];
      minimumScore?: number;
    };
  };
  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    isPublished: boolean;
  };
}

export interface LessonResource {
  type: 'pdf' | 'link' | 'code' | 'dataset';
  title: string;
  url: string;
  description?: string;
}

// Task Types
export type TaskType = 'reading' | 'quiz' | 'coding' | 'project' | 'discussion' | 'reflection';

export interface Task {
  id: string;
  lessonId: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  type: TaskType;
  content: TaskContent;
  progression: {
    xpReward: number;
    estimatedMinutes: number;
    passingScore?: number;
    maxAttempts?: number;
    isRequired: boolean;
  };
  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    isPublished: boolean;
  };
}

export interface TaskContent {
  // Reading tasks
  text?: string;
  
  // Quiz tasks
  questions?: QuizQuestion[];
  
  // Coding tasks
  codeTemplate?: string;
  testCases?: TestCase[];
  
  // Project tasks
  requirements?: string[];
  submissionFormat?: 'text' | 'file' | 'url' | 'code';
  rubric?: RubricCriteria[];
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'code';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  points: number;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  hidden: boolean;
}

export interface RubricCriteria {
  criteria: string;
  points: number;
}

// Progress Tracking Types
export interface UserEnrollment {
  id: string;
  userId: string;
  courseId: string;
  enrollment: {
    enrolledAt: Timestamp;
    startedAt?: Timestamp;
    completedAt?: Timestamp;
    status: 'enrolled' | 'in-progress' | 'completed' | 'dropped';
    progress: number;
  };
  performance: {
    currentXP: number;
    totalXP: number;
    averageScore: number;
    timeSpent: number;
    lessonsCompleted: number;
    tasksCompleted: number;
  };
  settings: {
    notifications: boolean;
    reminderFrequency: 'daily' | 'weekly' | 'none';
  };
  metadata: {
    lastAccessedAt: Timestamp;
    updatedAt: Timestamp;
  };
}

export interface UserProgress {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  progress: {
    status: 'not-started' | 'in-progress' | 'completed';
    startedAt?: Timestamp;
    completedAt?: Timestamp;
    timeSpent: number;
    attempts: number;
    lastAccessedAt: Timestamp;
  };
  performance: {
    score?: number;
    xpEarned: number;
    tasksCompleted: number;
    totalTasks: number;
  };
}

export interface UserTaskCompletion {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  taskId: string;
  completion: {
    status: 'not-started' | 'in-progress' | 'completed' | 'failed';
    startedAt: Timestamp;
    completedAt?: Timestamp;
    timeSpent: number;
    attempts: number;
    maxAttempts?: number;
  };
  performance: {
    score?: number;
    xpEarned: number;
    isPassed: boolean;
    answers?: any[];
    submissionUrl?: string;
    code?: string;
    feedback?: string;
  };
  metadata: {
    submittedAt?: Timestamp;
    gradedAt?: Timestamp;
    gradedBy?: string;
  };
}

// Achievement Types
export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  category: 'progress' | 'skill' | 'social' | 'special';
  requirements: {
    type: 'xp' | 'courses' | 'streak' | 'tasks' | 'time' | 'custom';
    threshold: number;
    courseIds?: string[];
    additionalCriteria?: any;
  };
  rewards: {
    xpBonus: number;
    title?: string;
    badgeUrl?: string;
  };
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  metadata: {
    createdAt: Timestamp;
    isActive: boolean;
  };
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  earned: {
    earnedAt: Timestamp;
    progress: number;
    isCompleted: boolean;
  };
  context: {
    courseId?: string;
    trigger: string;
  };
}

// Leaderboard Types
export interface Leaderboard {
  id: string;
  type: 'global' | 'course' | 'weekly' | 'monthly';
  courseId?: string;
  entries: LeaderboardEntry[];
  metadata: {
    updatedAt: Timestamp;
    period?: {
      startDate: Timestamp;
      endDate: Timestamp;
    };
  };
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL?: string;
  score: number;
  rank: number;
  change: number;
}

// Dashboard Data Types
export interface DashboardStats {
  coursesCompleted: number;
  certificatesEarned: number;
  hoursLearned: number;
  currentStreak: number;
  totalXP: number;
  currentLevel: number;
}

export interface DashboardCourse {
  id: string;
  title: string;
  progress: number;
  nextLesson: string;
  timeLeft: string;
  imageUrl: string;
}

export interface DashboardData {
  stats: DashboardStats;
  currentCourses: DashboardCourse[];
  recentAchievements: UserAchievement[];
  upcomingDeadlines: any[];
}

// API Response Types
export interface CourseListResponse {
  courses: Course[];
  total: number;
  hasMore: boolean;
}

export interface ProgressSummary {
  courseId: string;
  courseTitle: string;
  progress: number;
  xpEarned: number;
  totalXP: number;
  lessonsCompleted: number;
  totalLessons: number;
  lastActivity: Timestamp;
}

// Utility Types
export type CourseStatus = 'not-enrolled' | 'enrolled' | 'in-progress' | 'completed';
export type ProgressStatus = 'not-started' | 'in-progress' | 'completed';
export type TaskStatus = 'not-started' | 'in-progress' | 'completed' | 'failed';

// Form Types for Creating/Editing
export interface CreateCourseForm {
  title: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  estimatedHours: number;
  prerequisites: string[];
  totalXP: number;
  passingScore: number;
  certificateEligible: boolean;
}

export interface CreateLessonForm {
  courseId: string;
  title: string;
  description: string;
  order: number;
  contentType: 'video' | 'text' | 'interactive' | 'mixed';
  videoUrl?: string;
  videoDuration?: number;
  textContent?: string;
  xpReward: number;
  estimatedMinutes: number;
  requiredForProgress: boolean;
}

export interface CreateTaskForm {
  lessonId: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  type: TaskType;
  xpReward: number;
  estimatedMinutes: number;
  isRequired: boolean;
  content: Partial<TaskContent>;
}