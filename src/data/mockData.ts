// Mock data to replace Convex queries during Firebase transition

export interface MockUser {
  _id: string;
  name: string;
  email: string;
  totalScore: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string;
  createdAt: number;
}

export interface MockModule {
  _id: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
}

export interface MockLesson {
  _id: string;
  title: string;
  moduleId: string;
  order: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  xpReward: number;
  content: {
    introduction: string;
    sections: Array<{
      title: string;
      content: string;
      examples?: string[];
    }>;
    keyTakeaways: string[];
  };
}

export interface MockProgress {
  _id: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  score: number;
  completedAt?: number;
  attempts: number;
}

// Sample users for leaderboard
export const mockUsers: MockUser[] = [
  {
    _id: "user1",
    name: "Alex Chen",
    email: "alex@example.com",
    totalScore: 2450,
    level: 12,
    currentStreak: 7,
    longestStreak: 15,
    lastActiveDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now(),
  },
  {
    _id: "user2",
    name: "Sarah Kim",
    email: "sarah@example.com",
    totalScore: 2380,
    level: 11,
    currentStreak: 5,
    longestStreak: 12,
    lastActiveDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now(),
  },
  {
    _id: "user3",
    name: "Mike Johnson",
    email: "mike@example.com",
    totalScore: 2250,
    level: 11,
    currentStreak: 3,
    longestStreak: 8,
    lastActiveDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now(),
  },
  {
    _id: "user4",
    name: "Emma Davis",
    email: "emma@example.com",
    totalScore: 2100,
    level: 10,
    currentStreak: 2,
    longestStreak: 10,
    lastActiveDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now(),
  },
  {
    _id: "user5",
    name: "David Wilson",
    email: "david@example.com",
    totalScore: 1950,
    level: 10,
    currentStreak: 1,
    longestStreak: 6,
    lastActiveDate: new Date().toISOString().split('T')[0],
    createdAt: Date.now(),
  },
];

// Sample modules
export const mockModules: MockModule[] = [
  {
    _id: "module1",
    title: "Introduction to AI",
    description: "Learn the fundamentals of artificial intelligence",
    order: 1,
    isActive: true,
  },
  {
    _id: "module2",
    title: "Prompt Engineering",
    description: "Master the art of crafting effective AI prompts",
    order: 2,
    isActive: true,
  },
];

// Sample lessons
export const mockLessons: MockLesson[] = [
  {
    _id: "lesson1",
    title: "Introduction to Prompt Engineering",
    moduleId: "module1",
    order: 1,
    difficulty: "beginner",
    xpReward: 100,
    content: {
      introduction: "Learn the basics of prompt engineering",
      sections: [
        {
          title: "What is Prompt Engineering?",
          content: "Prompt engineering is the art of crafting effective instructions for AI models.",
        },
      ],
      keyTakeaways: ["Understanding AI communication", "Basic prompt structure"],
    },
  },
];

// Sample progress
export const mockProgress: MockProgress[] = [
  {
    _id: "progress1",
    userId: "user1",
    lessonId: "lesson1",
    completed: false,
    score: 0,
    attempts: 0,
  },
];

// Mock API functions to replace Convex queries
export const mockApi = {
  users: {
    getSampleUser: () => Promise.resolve(mockUsers[0]),
    getLeaderboard: () => Promise.resolve(mockUsers),
    createSampleUsers: () => Promise.resolve({ message: "Sample users created", sampleUserId: "user1" }),
    updateUserProgress: (params: { userId: string; xpGained: number; streakUpdate?: boolean }) => 
      Promise.resolve(),
  },
  modules: {
    getAllModules: () => Promise.resolve(mockModules),
  },
  lessons: {
    getLessonsByModule: (params: { moduleId: string }) => 
      Promise.resolve(mockLessons.filter(lesson => lesson.moduleId === params.moduleId)),
  },
  progress: {
    createProgress: (params: { userId: string; lessonId: string; completed: boolean; score: number }) =>
      Promise.resolve("progress1"),
  },
  learning: {
    getPersonalizedPrompts: (params: { userId: string }) => Promise.resolve([]),
    getUserLearningProfile: (params: { userId: string }) => Promise.resolve(null),
    getUserPromptAttempts: (params: { userId: string; limit?: number }) => Promise.resolve([]),
    startPromptAttempt: (params: any) => Promise.resolve("attempt1"),
    completePromptAttempt: (params: any) => Promise.resolve({ xpEarned: 100 }),
  },
};