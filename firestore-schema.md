# Firebase Firestore Schema Design for Curriculum System

## Collection: `users/` *(Enhanced existing collection)*

```typescript
interface UserDocument {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  updatedAt?: Timestamp;
  
  // Enhanced fields for curriculum system
  profile: {
    totalXP: number;                 // Total XP across all courses
    currentLevel: number;            // Current user level
    xpToNextLevel: number;          // XP needed for next level
    streak: {
      current: number;              // Current learning streak (days)
      longest: number;              // Longest streak achieved
      lastActivity: Timestamp;      // Last learning activity
    };
    stats: {
      coursesCompleted: number;
      certificatesEarned: number;
      hoursLearned: number;         // Total learning hours
      tasksCompleted: number;
    };
  };
  
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: {
      email: boolean;
      push: boolean;
      marketing: boolean;
      dailyReminders: boolean;
      weeklyProgress: boolean;
    };
    privacy: {
      profileVisible: boolean;
      analyticsEnabled: boolean;
      showOnLeaderboard: boolean;
    };
    learning: {
      preferredDifficulty: 'beginner' | 'intermediate' | 'advanced';
      dailyGoalMinutes: number;
      reminderTime?: string;        // HH:MM format
    };
  };
}
```

**Sample Document:**
```json
{
  "uid": "user123",
  "email": "john@example.com",
  "displayName": "John Doe",
  "photoURL": "https://...",
  "emailVerified": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "lastLoginAt": "2024-01-20T15:30:00Z",
  "profile": {
    "totalXP": 2450,
    "currentLevel": 5,
    "xpToNextLevel": 550,
    "streak": {
      "current": 12,
      "longest": 25,
      "lastActivity": "2024-01-20T14:00:00Z"
    },
    "stats": {
      "coursesCompleted": 3,
      "certificatesEarned": 2,
      "hoursLearned": 47.5,
      "tasksCompleted": 89
    }
  },
  "preferences": {
    "theme": "system",
    "notifications": {
      "email": true,
      "push": true,
      "marketing": false,
      "dailyReminders": true,
      "weeklyProgress": true
    },
    "privacy": {
      "profileVisible": true,
      "analyticsEnabled": true,
      "showOnLeaderboard": true
    },
    "learning": {
      "preferredDifficulty": "intermediate",
      "dailyGoalMinutes": 60,
      "reminderTime": "19:00"
    }
  }
}
```

## Collection: `courses/`

```typescript
interface CourseDocument {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;                 // e.g., "AI/ML", "Web Development"
  tags: string[];
  
  content: {
    estimatedHours: number;
    lessonCount: number;
    taskCount: number;
    prerequisites: string[];        // Course IDs
  };
  
  progression: {
    totalXP: number;               // Total XP available in course
    passingScore: number;          // Minimum score to complete (0-100)
    certificateEligible: boolean;
  };
  
  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    createdBy: string;             // Admin user ID
    version: string;
    isPublished: boolean;
    publishedAt?: Timestamp;
  };
  
  settings: {
    allowRetakes: boolean;
    showProgress: boolean;
    randomizeQuestions: boolean;
    timeLimit?: number;            // Minutes per lesson
  };
}
```

**Sample Document:**
```json
{
  "id": "course_ai_basics",
  "title": "AI Fundamentals: Neural Networks & Deep Learning",
  "description": "Comprehensive introduction to artificial intelligence...",
  "shortDescription": "Learn AI fundamentals with hands-on neural network examples",
  "imageUrl": "https://...",
  "difficulty": "beginner",
  "category": "AI/ML",
  "tags": ["artificial-intelligence", "neural-networks", "python"],
  "content": {
    "estimatedHours": 25,
    "lessonCount": 8,
    "taskCount": 32,
    "prerequisites": []
  },
  "progression": {
    "totalXP": 1200,
    "passingScore": 70,
    "certificateEligible": true
  },
  "metadata": {
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z",
    "createdBy": "admin123",
    "version": "1.2.0",
    "isPublished": true,
    "publishedAt": "2024-01-10T00:00:00Z"
  },
  "settings": {
    "allowRetakes": true,
    "showProgress": true,
    "randomizeQuestions": false,
    "timeLimit": 45
  }
}
```

## Collection: `lessons/`

```typescript
interface LessonDocument {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;                   // Order within course
  
  content: {
    type: 'video' | 'text' | 'interactive' | 'mixed';
    videoUrl?: string;
    videoDuration?: number;        // Seconds
    textContent?: string;          // Markdown content
    resources: {
      type: 'pdf' | 'link' | 'code' | 'dataset';
      title: string;
      url: string;
      description?: string;
    }[];
  };
  
  progression: {
    xpReward: number;
    estimatedMinutes: number;
    requiredForProgress: boolean;
    unlockConditions?: {
      previousLessons: string[];   // Lesson IDs
      minimumScore?: number;
    };
  };
  
  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    isPublished: boolean;
  };
}
```

## Collection: `tasks/`

```typescript
interface TaskDocument {
  id: string;
  lessonId: string;
  courseId: string;
  title: string;
  description: string;
  order: number;                   // Order within lesson
  
  type: 'reading' | 'quiz' | 'coding' | 'project' | 'discussion' | 'reflection';
  
  content: {
    // For reading tasks
    text?: string;                 // Markdown content
    
    // For quiz tasks
    questions?: {
      id: string;
      type: 'multiple-choice' | 'true-false' | 'short-answer' | 'code';
      question: string;
      options?: string[];          // For multiple choice
      correctAnswer: string | string[];
      explanation?: string;
      points: number;
    }[];
    
    // For coding tasks
    codeTemplate?: string;
    testCases?: {
      input: string;
      expectedOutput: string;
      hidden: boolean;
    }[];
    
    // For project tasks
    requirements?: string[];
    submissionFormat?: 'text' | 'file' | 'url' | 'code';
    rubric?: {
      criteria: string;
      points: number;
    }[];
  };
  
  progression: {
    xpReward: number;
    estimatedMinutes: number;
    passingScore?: number;         // For quizzes/projects
    maxAttempts?: number;
    isRequired: boolean;
  };
  
  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    isPublished: boolean;
  };
}
```

## Collection: `user_enrollments/`

```typescript
interface UserEnrollmentDocument {
  id: string;                      // {userId}_{courseId}
  userId: string;
  courseId: string;
  
  enrollment: {
    enrolledAt: Timestamp;
    startedAt?: Timestamp;         // When first lesson was accessed
    completedAt?: Timestamp;
    status: 'enrolled' | 'in-progress' | 'completed' | 'dropped';
    progress: number;              // 0-100 percentage
  };
  
  performance: {
    currentXP: number;
    totalXP: number;               // Total available XP in course
    averageScore: number;          // 0-100
    timeSpent: number;             // Minutes
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
```

## Collection: `user_progress/`

```typescript
interface UserProgressDocument {
  id: string;                      // {userId}_{lessonId}
  userId: string;
  courseId: string;
  lessonId: string;
  
  progress: {
    status: 'not-started' | 'in-progress' | 'completed';
    startedAt?: Timestamp;
    completedAt?: Timestamp;
    timeSpent: number;             // Minutes
    attempts: number;
    lastAccessedAt: Timestamp;
  };
  
  performance: {
    score?: number;                // 0-100 for lessons with assessments
    xpEarned: number;
    tasksCompleted: number;
    totalTasks: number;
  };
}
```

## Collection: `user_task_completions/`

```typescript
interface UserTaskCompletionDocument {
  id: string;                      // {userId}_{taskId}
  userId: string;
  courseId: string;
  lessonId: string;
  taskId: string;
  
  completion: {
    status: 'not-started' | 'in-progress' | 'completed' | 'failed';
    startedAt: Timestamp;
    completedAt?: Timestamp;
    timeSpent: number;             // Minutes
    attempts: number;
    maxAttempts?: number;
  };
  
  performance: {
    score?: number;                // 0-100
    xpEarned: number;
    isPassed: boolean;
    
    // Task-specific data
    answers?: any[];               // Quiz answers
    submissionUrl?: string;        // Project submission
    code?: string;                 // Coding task solution
    feedback?: string;             // Instructor feedback
  };
  
  metadata: {
    submittedAt?: Timestamp;
    gradedAt?: Timestamp;
    gradedBy?: string;             // Auto-graded or instructor ID
  };
}
```

## Collection: `achievements/`

```typescript
interface AchievementDocument {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  category: 'progress' | 'skill' | 'social' | 'special';
  
  requirements: {
    type: 'xp' | 'courses' | 'streak' | 'tasks' | 'time' | 'custom';
    threshold: number;
    courseIds?: string[];          // Specific courses if applicable
    additionalCriteria?: any;
  };
  
  rewards: {
    xpBonus: number;
    title?: string;                // Special title for user
    badgeUrl?: string;
  };
  
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  
  metadata: {
    createdAt: Timestamp;
    isActive: boolean;
  };
}
```

## Collection: `user_achievements/`

```typescript
interface UserAchievementDocument {
  id: string;                      // {userId}_{achievementId}
  userId: string;
  achievementId: string;
  
  earned: {
    earnedAt: Timestamp;
    progress: number;              // 0-100, useful for partial progress
    isCompleted: boolean;
  };
  
  context: {
    courseId?: string;             // If earned in specific course
    trigger: string;               // What triggered the achievement
  };
}
```

## Collection: `leaderboards/` *(Optional)*

```typescript
interface LeaderboardDocument {
  id: string;                      // 'global' | 'course_{courseId}' | 'weekly' etc.
  type: 'global' | 'course' | 'weekly' | 'monthly';
  courseId?: string;               // For course-specific leaderboards
  
  entries: {
    userId: string;
    displayName: string;
    photoURL?: string;
    score: number;                 // XP or other metric
    rank: number;
    change: number;                // Rank change from previous period
  }[];
  
  metadata: {
    updatedAt: Timestamp;
    period?: {
      startDate: Timestamp;
      endDate: Timestamp;
    };
  };
}
```

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isAdmin() {
      return request.auth.token.admin == true;
    }
    
    // Users collection - enhanced existing rules
    match /users/{userId} {
      allow read: if isAuthenticated() && (isOwner(userId) || resource.data.preferences.privacy.profileVisible);
      allow write: if isAuthenticated() && isOwner(userId);
    }
    
    // Courses collection - public read for published courses
    match /courses/{courseId} {
      allow read: if isAuthenticated() && resource.data.metadata.isPublished;
      allow write: if isAdmin();
    }
    
    // Lessons collection - public read for published lessons
    match /lessons/{lessonId} {
      allow read: if isAuthenticated() && resource.data.metadata.isPublished;
      allow write: if isAdmin();
    }
    
    // Tasks collection - public read for published tasks
    match /tasks/{taskId} {
      allow read: if isAuthenticated() && resource.data.metadata.isPublished;
      allow write: if isAdmin();
    }
    
    // User enrollments - only user can read/write their own
    match /user_enrollments/{enrollmentId} {
      allow read, write: if isAuthenticated() && 
        enrollmentId.split('_')[0] == request.auth.uid;
    }
    
    // User progress - only user can read/write their own
    match /user_progress/{progressId} {
      allow read, write: if isAuthenticated() && 
        progressId.split('_')[0] == request.auth.uid;
    }
    
    // User task completions - only user can read/write their own
    match /user_task_completions/{completionId} {
      allow read, write: if isAuthenticated() && 
        completionId.split('_')[0] == request.auth.uid;
    }
    
    // Achievements - public read
    match /achievements/{achievementId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // User achievements - only user can read their own
    match /user_achievements/{userAchievementId} {
      allow read: if isAuthenticated() && 
        userAchievementId.split('_')[0] == request.auth.uid;
      allow write: if false; // Only system can write achievements
    }
    
    // Leaderboards - authenticated read only
    match /leaderboards/{leaderboardId} {
      allow read: if isAuthenticated();
      allow write: if false; // Only system can update leaderboards
    }
  }
}
```

## Integration with Existing User System

### 1. Update User Document Structure

Modify your existing `useAuth.ts` hook to handle the enhanced user profile:

```typescript
// Add to your existing User interface in types/auth.ts
interface User {
  // ... existing fields
  profile?: {
    totalXP: number;
    currentLevel: number;
    xpToNextLevel: number;
    streak: {
      current: number;
      longest: number;
      lastActivity: Date;
    };
    stats: {
      coursesCompleted: number;
      certificatesEarned: number;
      hoursLearned: number;
      tasksCompleted: number;
    };
  };
}
```

### 2. XP and Level Progression System

```typescript
// utils/xpSystem.ts
export class XPSystem {
  // XP required for each level (exponential growth)
  static getXPForLevel(level: number): number {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }
  
  static getTotalXPForLevel(level: number): number {
    let total = 0;
    for (let i = 1; i < level; i++) {
      total += this.getXPForLevel(i);
    }
    return total;
  }
  
  static getLevelFromXP(totalXP: number): number {
    let level = 1;
    let xpUsed = 0;
    
    while (xpUsed + this.getXPForLevel(level) <= totalXP) {
      xpUsed += this.getXPForLevel(level);
      level++;
    }
    
    return level;
  }
  
  static getXPToNextLevel(totalXP: number): number {
    const currentLevel = this.getLevelFromXP(totalXP);
    const xpForCurrentLevel = this.getXPForLevel(currentLevel);
    const totalXPForCurrentLevel = this.getTotalXPForLevel(currentLevel);
    
    return xpForCurrentLevel - (totalXP - totalXPForCurrentLevel);
  }
}
```

### 3. Real-time Progress Tracking Hooks

```typescript
// hooks/useCourseProgress.ts
export const useCourseProgress = (courseId: string) => {
  const { user } = useAuthContext();
  const [progress, setProgress] = useState<UserEnrollmentDocument | null>(null);
  
  useEffect(() => {
    if (!user || !courseId) return;
    
    const enrollmentId = `${user.uid}_${courseId}`;
    const unsubscribe = onSnapshot(
      doc(db, 'user_enrollments', enrollmentId),
      (doc) => {
        if (doc.exists()) {
          setProgress(doc.data() as UserEnrollmentDocument);
        }
      }
    );
    
    return unsubscribe;
  }, [user, courseId]);
  
  return progress;
};
```

### 4. Dashboard Integration

Update your existing Dashboard component to use real Firestore data:

```typescript
// hooks/useDashboardData.ts
export const useDashboardData = () => {
  const { user } = useAuthContext();
  const [dashboardData, setDashboardData] = useState(null);
  
  useEffect(() => {
    if (!user) return;
    
    // Fetch user enrollments, recent progress, achievements
    const fetchDashboardData = async () => {
      const [enrollments, recentProgress, achievements] = await Promise.all([
        getDocs(query(
          collection(db, 'user_enrollments'),
          where('userId', '==', user.uid),
          where('enrollment.status', 'in', ['in-progress', 'completed'])
        )),
        getDocs(query(
          collection(db, 'user_progress'),
          where('userId', '==', user.uid),
          orderBy('progress.lastAccessedAt', 'desc'),
          limit(5)
        )),
        getDocs(query(
          collection(db, 'user_achievements'),
          where('userId', '==', user.uid),
          where('earned.isCompleted', '==', true)
        ))
      ]);
      
      setDashboardData({
        enrollments: enrollments.docs.map(doc => doc.data()),
        recentProgress: recentProgress.docs.map(doc => doc.data()),
        achievements: achievements.docs.map(doc => doc.data())
      });
    };
    
    fetchDashboardData();
  }, [user]);
  
  return dashboardData;
};
```

### 5. Course Service Functions

```typescript
// services/courseService.ts
export class CourseService {
  static async enrollUser(userId: string, courseId: string) {
    const enrollmentId = `${userId}_${courseId}`;
    const enrollmentDoc = doc(db, 'user_enrollments', enrollmentId);
    
    await setDoc(enrollmentDoc, {
      id: enrollmentId,
      userId,
      courseId,
      enrollment: {
        enrolledAt: serverTimestamp(),
        status: 'enrolled',
        progress: 0
      },
      performance: {
        currentXP: 0,
        totalXP: 0,
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
        lastAccessedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
    });
  }
  
  static async completeTask(userId: string, taskId: string, score: number, xpEarned: number) {
    const batch = writeBatch(db);
    
    // Update task completion
    const completionId = `${userId}_${taskId}`;
    const completionDoc = doc(db, 'user_task_completions', completionId);
    batch.set(completionDoc, {
      // ... completion data
      performance: {
        score,
        xpEarned,
        isPassed: score >= 70
      }
    });
    
    // Update user's total XP
    const userDoc = doc(db, 'users', userId);
    batch.update(userDoc, {
      'profile.totalXP': increment(xpEarned),
      'profile.stats.tasksCompleted': increment(1)
    });
    
    await batch.commit();
  }
}
```

## Performance Optimizations

1. **Composite Indexes**: Create composite indexes for common queries:
   - `user_enrollments`: (userId, enrollment.status)
   - `user_progress`: (userId, progress.lastAccessedAt)
   - `user_task_completions`: (userId, courseId, completion.status)

2. **Data Denormalization**: Store frequently accessed data in multiple places:
   - User stats in user document for quick dashboard loading
   - Course metadata in enrollment documents

3. **Caching Strategy**: Use React Query or SWR for client-side caching of course content

4. **Real-time Subscriptions**: Only subscribe to critical real-time data (user progress, notifications)

This schema design provides a scalable, performant foundation for your curriculum system while integrating seamlessly with your existing authentication system. The structure supports all your requirements including XP tracking, progress monitoring, multiple task types, and real-time updates.