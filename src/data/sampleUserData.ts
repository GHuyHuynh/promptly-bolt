import { Timestamp } from 'firebase/firestore';
import { 
  UserEnrollment, 
  UserProgress, 
  UserTaskCompletion,
  UserProfile,
  UserAchievement 
} from '../types/curriculum';

// Utility function to create timestamp
const createTimestamp = (date?: Date) => 
  Timestamp.fromDate(date || new Date());

// Sample User Profiles
export const sampleUserProfiles: UserProfile[] = [
  {
    totalXP: 350,
    currentLevel: 3,
    xpToNextLevel: 150,
    streak: {
      current: 5,
      longest: 12,
      lastActivity: createTimestamp(new Date(Date.now() - 24 * 60 * 60 * 1000)) // Yesterday
    },
    stats: {
      coursesCompleted: 1,
      certificatesEarned: 1,
      hoursLearned: 15,
      tasksCompleted: 12
    }
  },
  {
    totalXP: 1250,
    currentLevel: 5,
    xpToNextLevel: 50,
    streak: {
      current: 15,
      longest: 23,
      lastActivity: createTimestamp(new Date(Date.now() - 2 * 60 * 60 * 1000)) // 2 hours ago
    },
    stats: {
      coursesCompleted: 2,
      certificatesEarned: 2,
      hoursLearned: 42,
      tasksCompleted: 35
    }
  },
  {
    totalXP: 75,
    currentLevel: 1,
    xpToNextLevel: 25,
    streak: {
      current: 1,
      longest: 3,
      lastActivity: createTimestamp(new Date(Date.now() - 30 * 60 * 1000)) // 30 minutes ago
    },
    stats: {
      coursesCompleted: 0,
      certificatesEarned: 0,
      hoursLearned: 3,
      tasksCompleted: 4
    }
  }
];

// Sample User Enrollments
export const sampleUserEnrollments: UserEnrollment[] = [
  {
    id: 'enrollment-1',
    userId: 'user-1',
    courseId: 'intro-to-ai',
    enrollment: {
      enrolledAt: createTimestamp(new Date('2024-03-01')),
      startedAt: createTimestamp(new Date('2024-03-01')),
      completedAt: createTimestamp(new Date('2024-03-15')),
      status: 'completed',
      progress: 100
    },
    performance: {
      currentXP: 500,
      totalXP: 500,
      averageScore: 87,
      timeSpent: 720, // 12 hours in minutes
      lessonsCompleted: 5,
      tasksCompleted: 20
    },
    settings: {
      notifications: true,
      reminderFrequency: 'daily'
    },
    metadata: {
      lastAccessedAt: createTimestamp(new Date('2024-03-15')),
      updatedAt: createTimestamp()
    }
  },
  {
    id: 'enrollment-2',
    userId: 'user-1',
    courseId: 'ml-fundamentals',
    enrollment: {
      enrolledAt: createTimestamp(new Date('2024-03-16')),
      startedAt: createTimestamp(new Date('2024-03-16')),
      status: 'in-progress',
      progress: 35
    },
    performance: {
      currentXP: 420,
      totalXP: 1200,
      averageScore: 82,
      timeSpent: 540, // 9 hours in minutes
      lessonsCompleted: 2,
      tasksCompleted: 11
    },
    settings: {
      notifications: true,
      reminderFrequency: 'daily'
    },
    metadata: {
      lastAccessedAt: createTimestamp(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)), // 2 days ago
      updatedAt: createTimestamp()
    }
  },
  {
    id: 'enrollment-3',
    userId: 'user-2',
    courseId: 'intro-to-ai',
    enrollment: {
      enrolledAt: createTimestamp(new Date('2024-02-15')),
      startedAt: createTimestamp(new Date('2024-02-15')),
      completedAt: createTimestamp(new Date('2024-03-01')),
      status: 'completed',
      progress: 100
    },
    performance: {
      currentXP: 500,
      totalXP: 500,
      averageScore: 94,
      timeSpent: 680, // 11.3 hours in minutes
      lessonsCompleted: 5,
      tasksCompleted: 20
    },
    settings: {
      notifications: true,
      reminderFrequency: 'weekly'
    },
    metadata: {
      lastAccessedAt: createTimestamp(new Date('2024-03-01')),
      updatedAt: createTimestamp()
    }
  },
  {
    id: 'enrollment-4',
    userId: 'user-2',
    courseId: 'ml-fundamentals',
    enrollment: {
      enrolledAt: createTimestamp(new Date('2024-03-02')),
      startedAt: createTimestamp(new Date('2024-03-02')),
      completedAt: createTimestamp(new Date('2024-03-25')),
      status: 'completed',
      progress: 100
    },
    performance: {
      currentXP: 1200,
      totalXP: 1200,
      averageScore: 91,
      timeSpent: 1480, // 24.7 hours in minutes
      lessonsCompleted: 6,
      tasksCompleted: 30
    },
    settings: {
      notifications: true,
      reminderFrequency: 'daily'
    },
    metadata: {
      lastAccessedAt: createTimestamp(new Date('2024-03-25')),
      updatedAt: createTimestamp()
    }
  },
  {
    id: 'enrollment-5',
    userId: 'user-2',
    courseId: 'ai-ethics',
    enrollment: {
      enrolledAt: createTimestamp(new Date('2024-03-26')),
      startedAt: createTimestamp(new Date('2024-03-26')),
      status: 'in-progress',
      progress: 60
    },
    performance: {
      currentXP: 480,
      totalXP: 800,
      averageScore: 88,
      timeSpent: 650, // 10.8 hours in minutes
      lessonsCompleted: 3,
      tasksCompleted: 15
    },
    settings: {
      notifications: true,
      reminderFrequency: 'daily'
    },
    metadata: {
      lastAccessedAt: createTimestamp(new Date(Date.now() - 2 * 60 * 60 * 1000)), // 2 hours ago
      updatedAt: createTimestamp()
    }
  },
  {
    id: 'enrollment-6',
    userId: 'user-3',
    courseId: 'intro-to-ai',
    enrollment: {
      enrolledAt: createTimestamp(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)), // 1 week ago
      startedAt: createTimestamp(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)),
      status: 'in-progress',
      progress: 20
    },
    performance: {
      currentXP: 100,
      totalXP: 500,
      averageScore: 76,
      timeSpent: 180, // 3 hours in minutes
      lessonsCompleted: 1,
      tasksCompleted: 4
    },
    settings: {
      notifications: false,
      reminderFrequency: 'none'
    },
    metadata: {
      lastAccessedAt: createTimestamp(new Date(Date.now() - 30 * 60 * 1000)), // 30 minutes ago
      updatedAt: createTimestamp()
    }
  }
];

// Sample User Progress (Lesson Level)
export const sampleUserProgress: UserProgress[] = [
  {
    id: 'progress-1',
    userId: 'user-1',
    courseId: 'intro-to-ai',
    lessonId: 'intro-ai-lesson-1',
    progress: {
      status: 'completed',
      startedAt: createTimestamp(new Date('2024-03-01T09:00:00Z')),
      completedAt: createTimestamp(new Date('2024-03-01T10:30:00Z')),
      timeSpent: 90,
      attempts: 1,
      lastAccessedAt: createTimestamp(new Date('2024-03-01T10:30:00Z'))
    },
    performance: {
      score: 87,
      xpEarned: 95,
      tasksCompleted: 4,
      totalTasks: 4
    }
  },
  {
    id: 'progress-2',
    userId: 'user-1',
    courseId: 'intro-to-ai',
    lessonId: 'intro-ai-lesson-2',
    progress: {
      status: 'completed',
      startedAt: createTimestamp(new Date('2024-03-02T14:00:00Z')),
      completedAt: createTimestamp(new Date('2024-03-02T15:45:00Z')),
      timeSpent: 105,
      attempts: 1,
      lastAccessedAt: createTimestamp(new Date('2024-03-02T15:45:00Z'))
    },
    performance: {
      score: 92,
      xpEarned: 100,
      tasksCompleted: 4,
      totalTasks: 4
    }
  },
  {
    id: 'progress-3',
    userId: 'user-2',
    courseId: 'ml-fundamentals',
    lessonId: 'ml-lesson-1',
    progress: {
      status: 'in-progress',
      startedAt: createTimestamp(new Date(Date.now() - 3 * 60 * 60 * 1000)), // 3 hours ago
      timeSpent: 45,
      attempts: 1,
      lastAccessedAt: createTimestamp(new Date(Date.now() - 2 * 60 * 60 * 1000)) // 2 hours ago
    },
    performance: {
      score: 78,
      xpEarned: 60,
      tasksCompleted: 2,
      totalTasks: 3
    }
  },
  {
    id: 'progress-4',
    userId: 'user-3',
    courseId: 'intro-to-ai',
    lessonId: 'intro-ai-lesson-1',
    progress: {
      status: 'completed',
      startedAt: createTimestamp(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)), // 6 days ago
      completedAt: createTimestamp(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)), // 5 days ago
      timeSpent: 120,
      attempts: 2,
      lastAccessedAt: createTimestamp(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000))
    },
    performance: {
      score: 76,
      xpEarned: 85,
      tasksCompleted: 4,
      totalTasks: 4
    }
  }
];

// Sample User Task Completions
export const sampleUserTaskCompletions: UserTaskCompletion[] = [
  {
    id: 'task-completion-1',
    userId: 'user-1',
    courseId: 'intro-to-ai',
    lessonId: 'intro-ai-lesson-1',
    taskId: 'intro-ai-task-1-reading',
    completion: {
      status: 'completed',
      startedAt: createTimestamp(new Date('2024-03-01T09:00:00Z')),
      completedAt: createTimestamp(new Date('2024-03-01T09:15:00Z')),
      timeSpent: 15,
      attempts: 1
    },
    performance: {
      xpEarned: 10,
      isPassed: true
    },
    metadata: {
      submittedAt: createTimestamp(new Date('2024-03-01T09:15:00Z'))
    }
  },
  {
    id: 'task-completion-2',
    userId: 'user-1',
    courseId: 'intro-to-ai',
    lessonId: 'intro-ai-lesson-1',
    taskId: 'intro-ai-task-1-quiz',
    completion: {
      status: 'completed',
      startedAt: createTimestamp(new Date('2024-03-01T09:20:00Z')),
      completedAt: createTimestamp(new Date('2024-03-01T09:30:00Z')),
      timeSpent: 10,
      attempts: 1
    },
    performance: {
      score: 87,
      xpEarned: 25,
      isPassed: true,
      answers: [
        'Narrow AI is designed for specific tasks, while General AI can perform any intellectual task',
        'Traditional calculator',
        'True',
        ['Virtual assistants', 'Recommendation systems', 'Image recognition']
      ]
    },
    metadata: {
      submittedAt: createTimestamp(new Date('2024-03-01T09:30:00Z')),
      gradedAt: createTimestamp(new Date('2024-03-01T09:30:00Z'))
    }
  },
  {
    id: 'task-completion-3',
    userId: 'user-1',
    courseId: 'intro-to-ai',
    lessonId: 'intro-ai-lesson-1',
    taskId: 'intro-ai-task-1-discussion',
    completion: {
      status: 'completed',
      startedAt: createTimestamp(new Date('2024-03-01T09:35:00Z')),
      completedAt: createTimestamp(new Date('2024-03-01T09:55:00Z')),
      timeSpent: 20,
      attempts: 1
    },
    performance: {
      score: 90,
      xpEarned: 20,
      isPassed: true,
      feedback: 'Excellent analysis of AI's impact on future work. Your examples were well-chosen and your reasoning was clear.'
    },
    metadata: {
      submittedAt: createTimestamp(new Date('2024-03-01T09:55:00Z')),
      gradedAt: createTimestamp(new Date('2024-03-01T10:15:00Z')),
      gradedBy: 'instructor-1'
    }
  },
  {
    id: 'task-completion-4',
    userId: 'user-2',
    courseId: 'ml-fundamentals',
    lessonId: 'ml-lesson-1',
    taskId: 'ml-task-1-coding',
    completion: {
      status: 'completed',
      startedAt: createTimestamp(new Date('2024-03-03T14:00:00Z')),
      completedAt: createTimestamp(new Date('2024-03-03T14:45:00Z')),
      timeSpent: 45,
      attempts: 2
    },
    performance: {
      score: 95,
      xpEarned: 100,
      isPassed: true,
      code: `
# Simple Linear Regression Example
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import matplotlib.pyplot as plt

# Generate sample data
np.random.seed(42)
house_sizes = np.random.normal(2000, 500, 100).reshape(-1, 1)
house_prices = house_sizes.flatten() * 150 + np.random.normal(0, 50000, 100)

# Split data
X_train, X_test, y_train, y_test = train_test_split(house_sizes, house_prices, test_size=0.25, random_state=42)

# Create and train model
model = LinearRegression()
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)

# Calculate MSE
mse = mean_squared_error(y_test, predictions)
      `,
      feedback: 'Excellent implementation! Your linear relationship between house size and price is realistic, and the model performed well.'
    },
    metadata: {
      submittedAt: createTimestamp(new Date('2024-03-03T14:45:00Z')),
      gradedAt: createTimestamp(new Date('2024-03-03T15:00:00Z')),
      gradedBy: 'auto-grader'
    }
  },
  {
    id: 'task-completion-5',
    userId: 'user-3',
    courseId: 'intro-to-ai',
    lessonId: 'intro-ai-lesson-1',
    taskId: 'intro-ai-task-1-quiz',
    completion: {
      status: 'completed',
      startedAt: createTimestamp(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
      completedAt: createTimestamp(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 12 * 60 * 1000)),
      timeSpent: 12,
      attempts: 2,
      maxAttempts: 3
    },
    performance: {
      score: 75,
      xpEarned: 20, // Reduced XP for multiple attempts
      isPassed: true,
      answers: [
        'Narrow AI is designed for specific tasks, while General AI can perform any intellectual task',
        'Google Maps navigation', // Incorrect answer
        'True',
        ['Virtual assistants', 'Recommendation systems']
      ]
    },
    metadata: {
      submittedAt: createTimestamp(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 12 * 60 * 1000)),
      gradedAt: createTimestamp(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 12 * 60 * 1000))
    }
  }
];

// Sample User Achievements
export const sampleUserAchievements: UserAchievement[] = [
  {
    id: 'user-achievement-1',
    userId: 'user-1',
    achievementId: 'first-lesson-complete',
    earned: {
      earnedAt: createTimestamp(new Date('2024-03-01T10:30:00Z')),
      progress: 100,
      isCompleted: true
    },
    context: {
      courseId: 'intro-to-ai',
      trigger: 'lesson-completed'
    }
  },
  {
    id: 'user-achievement-2',
    userId: 'user-1',
    achievementId: 'ai-novice',
    earned: {
      earnedAt: createTimestamp(new Date('2024-03-15T16:30:00Z')),
      progress: 100,
      isCompleted: true
    },
    context: {
      courseId: 'intro-to-ai',
      trigger: 'course-completed'
    }
  },
  {
    id: 'user-achievement-3',
    userId: 'user-2',
    achievementId: 'first-lesson-complete',
    earned: {
      earnedAt: createTimestamp(new Date('2024-02-15T11:45:00Z')),
      progress: 100,
      isCompleted: true
    },
    context: {
      courseId: 'intro-to-ai',
      trigger: 'lesson-completed'
    }
  },
  {
    id: 'user-achievement-4',
    userId: 'user-2',
    achievementId: 'ai-novice',
    earned: {
      earnedAt: createTimestamp(new Date('2024-03-01T14:20:00Z')),
      progress: 100,
      isCompleted: true
    },
    context: {
      courseId: 'intro-to-ai',
      trigger: 'course-completed'
    }
  },
  {
    id: 'user-achievement-5',
    userId: 'user-2',
    achievementId: 'ml-practitioner',
    earned: {
      earnedAt: createTimestamp(new Date('2024-03-25T17:15:00Z')),
      progress: 100,
      isCompleted: true
    },
    context: {
      courseId: 'ml-fundamentals',
      trigger: 'course-completed'
    }
  },
  {
    id: 'user-achievement-6',
    userId: 'user-2',
    achievementId: 'streak-warrior',
    earned: {
      earnedAt: createTimestamp(new Date('2024-03-20T08:00:00Z')),
      progress: 100,
      isCompleted: true
    },
    context: {
      trigger: 'streak-milestone'
    }
  },
  {
    id: 'user-achievement-7',
    userId: 'user-3',
    achievementId: 'first-lesson-complete',
    earned: {
      earnedAt: createTimestamp(new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)),
      progress: 100,
      isCompleted: true
    },
    context: {
      courseId: 'intro-to-ai',
      trigger: 'lesson-completed'
    }
  }
];

// Sample Learning Streaks
export const sampleLearningStreaks = [
  {
    userId: 'user-1',
    dates: [
      '2024-03-01',
      '2024-03-02',
      '2024-03-03',
      '2024-03-04',
      '2024-03-05'
    ],
    currentStreak: 5,
    longestStreak: 12
  },
  {
    userId: 'user-2',
    dates: [
      '2024-02-15', '2024-02-16', '2024-02-17', '2024-02-18', '2024-02-19',
      '2024-02-20', '2024-02-21', '2024-02-22', '2024-02-23', '2024-02-24',
      '2024-02-25', '2024-02-26', '2024-02-27', '2024-02-28', '2024-03-01',
      '2024-03-02', '2024-03-03', '2024-03-04', '2024-03-05', '2024-03-06',
      '2024-03-07', '2024-03-08', '2024-03-09'
    ],
    currentStreak: 15,
    longestStreak: 23
  },
  {
    userId: 'user-3',
    dates: [
      new Date(Date.now() - 30 * 60 * 1000).toISOString().split('T')[0] // Today
    ],
    currentStreak: 1,
    longestStreak: 3
  }
];

// Export all sample data
export const sampleData = {
  userProfiles: sampleUserProfiles,
  userEnrollments: sampleUserEnrollments,
  userProgress: sampleUserProgress,
  userTaskCompletions: sampleUserTaskCompletions,
  userAchievements: sampleUserAchievements,
  learningStreaks: sampleLearningStreaks
};