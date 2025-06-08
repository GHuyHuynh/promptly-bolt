import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// Types
export interface User {
  id?: string;
  name: string;
  email: string;
  totalScore: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string;
  createdAt: Timestamp | number;
}

export interface Module {
  id?: string;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
}

export interface Lesson {
  id?: string;
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

export interface Progress {
  id?: string;
  userId: string;
  lessonId: string;
  completed: boolean;
  score: number;
  completedAt?: Timestamp | number;
  attempts: number;
}

export interface PromptAttempt {
  id?: string;
  userId: string;
  promptId: string;
  userInput: string;
  userOutput: string;
  timeSpent: number;
  selfRating?: number;
  feedback?: {
    whatWorked?: string;
    whatDidntWork?: string;
    improvements?: string;
  };
  xpEarned: number;
  completedAt: Timestamp | number;
}

// Firebase API functions
export const firebaseApi = {
  // Users
  users: {
    async getSampleUser(): Promise<User | null> {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("email", "==", "alex@example.com"), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          return { id: doc.id, ...doc.data() } as User;
        }
        
        // Create sample user if doesn't exist
        return await this.createSampleUser();
      } catch (error) {
        console.error("Error getting sample user:", error);
        return null;
      }
    },

    async createSampleUser(): Promise<User> {
      try {
        const sampleUser: Omit<User, 'id'> = {
          name: "Alex Chen",
          email: "alex@example.com",
          totalScore: 2450,
          level: 12,
          currentStreak: 7,
          longestStreak: 15,
          lastActiveDate: new Date().toISOString().split('T')[0],
          createdAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, "users"), sampleUser);
        return { id: docRef.id, ...sampleUser, createdAt: Date.now() };
      } catch (error) {
        console.error("Error creating sample user:", error);
        throw error;
      }
    },

    async getLeaderboard(): Promise<User[]> {
      try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, orderBy("totalScore", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
      } catch (error) {
        console.error("Error getting leaderboard:", error);
        return [];
      }
    },

    async updateUserProgress(params: { 
      userId: string; 
      xpGained: number; 
      streakUpdate?: boolean 
    }): Promise<void> {
      try {
        const userRef = doc(db, "users", params.userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          const newTotalScore = userData.totalScore + params.xpGained;
          const newLevel = Math.floor(newTotalScore / 1000) + 1;
          
          const updates: Partial<User> = {
            totalScore: newTotalScore,
            level: newLevel,
          };

          if (params.streakUpdate) {
            updates.currentStreak = userData.currentStreak + 1;
            updates.longestStreak = Math.max(userData.longestStreak, updates.currentStreak);
            updates.lastActiveDate = new Date().toISOString().split('T')[0];
          }

          await updateDoc(userRef, updates);
        }
      } catch (error) {
        console.error("Error updating user progress:", error);
        throw error;
      }
    },

    async createSampleUsers(): Promise<{ message: string; sampleUserId: string }> {
      try {
        // Check if sample users already exist
        const existingUser = await this.getSampleUser();
        if (existingUser) {
          return { message: "Sample users already exist", sampleUserId: existingUser.id! };
        }

        // Create sample users
        const sampleUsers = [
          {
            name: "Alex Chen",
            email: "alex@example.com",
            totalScore: 2450,
            level: 12,
            currentStreak: 7,
            longestStreak: 15,
            lastActiveDate: new Date().toISOString().split('T')[0],
            createdAt: serverTimestamp(),
          },
          {
            name: "Sarah Kim",
            email: "sarah@example.com",
            totalScore: 2380,
            level: 11,
            currentStreak: 5,
            longestStreak: 12,
            lastActiveDate: new Date().toISOString().split('T')[0],
            createdAt: serverTimestamp(),
          },
          {
            name: "Mike Johnson",
            email: "mike@example.com",
            totalScore: 2250,
            level: 11,
            currentStreak: 3,
            longestStreak: 8,
            lastActiveDate: new Date().toISOString().split('T')[0],
            createdAt: serverTimestamp(),
          },
        ];

        let mainUserId = "";
        for (const user of sampleUsers) {
          const docRef = await addDoc(collection(db, "users"), user);
          if (user.email === "alex@example.com") {
            mainUserId = docRef.id;
          }
        }

        return { message: "Sample users created successfully", sampleUserId: mainUserId };
      } catch (error) {
        console.error("Error creating sample users:", error);
        throw error;
      }
    },
  },

  // Modules
  modules: {
    async getAllModules(): Promise<Module[]> {
      try {
        const modulesRef = collection(db, "modules");
        const q = query(modulesRef, orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          // Create sample modules if none exist
          await this.createSampleModules();
          return await this.getAllModules();
        }
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Module[];
      } catch (error) {
        console.error("Error getting modules:", error);
        return [];
      }
    },

    async createSampleModules(): Promise<void> {
      try {
        const sampleModules = [
          {
            title: "Introduction to AI",
            description: "Learn the fundamentals of artificial intelligence",
            order: 1,
            isActive: true,
          },
          {
            title: "Prompt Engineering",
            description: "Master the art of crafting effective AI prompts",
            order: 2,
            isActive: true,
          },
        ];

        for (const module of sampleModules) {
          await addDoc(collection(db, "modules"), module);
        }
      } catch (error) {
        console.error("Error creating sample modules:", error);
        throw error;
      }
    },
  },

  // Lessons
  lessons: {
    async getLessonsByModule(params: { moduleId: string }): Promise<Lesson[]> {
      try {
        const lessonsRef = collection(db, "lessons");
        const q = query(
          lessonsRef, 
          where("moduleId", "==", params.moduleId),
          orderBy("order", "asc")
        );
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          // Create sample lesson if none exist
          await this.createSampleLesson(params.moduleId);
          return await this.getLessonsByModule(params);
        }
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Lesson[];
      } catch (error) {
        console.error("Error getting lessons:", error);
        return [];
      }
    },

    async createSampleLesson(moduleId: string): Promise<void> {
      try {
        const sampleLesson = {
          title: "Introduction to Prompt Engineering",
          moduleId: moduleId,
          order: 1,
          difficulty: "beginner" as const,
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
        };

        await addDoc(collection(db, "lessons"), sampleLesson);
      } catch (error) {
        console.error("Error creating sample lesson:", error);
        throw error;
      }
    },
  },

  // Progress
  progress: {
    async createProgress(params: { 
      userId: string; 
      lessonId: string; 
      completed: boolean; 
      score: number 
    }): Promise<string> {
      try {
        const progressData: Omit<Progress, 'id'> = {
          userId: params.userId,
          lessonId: params.lessonId,
          completed: params.completed,
          score: params.score,
          completedAt: params.completed ? serverTimestamp() : undefined,
          attempts: 1,
        };

        const docRef = await addDoc(collection(db, "progress"), progressData);
        return docRef.id;
      } catch (error) {
        console.error("Error creating progress:", error);
        throw error;
      }
    },

    async getUserProgress(userId: string): Promise<Progress[]> {
      try {
        const progressRef = collection(db, "progress");
        const q = query(progressRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Progress[];
      } catch (error) {
        console.error("Error getting user progress:", error);
        return [];
      }
    },
  },

  // Learning (Prompt exercises)
  learning: {
    async getPersonalizedPrompts(params: { userId: string }): Promise<any[]> {
      // For now, return empty array - can be implemented later
      return [];
    },

    async getUserLearningProfile(params: { userId: string }): Promise<any> {
      // For now, return null - can be implemented later
      return null;
    },

    async getUserPromptAttempts(params: { userId: string; limit?: number }): Promise<PromptAttempt[]> {
      try {
        const attemptsRef = collection(db, "promptAttempts");
        const q = query(
          attemptsRef, 
          where("userId", "==", params.userId),
          orderBy("completedAt", "desc"),
          limit(params.limit || 10)
        );
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PromptAttempt[];
      } catch (error) {
        console.error("Error getting prompt attempts:", error);
        return [];
      }
    },

    async startPromptAttempt(params: any): Promise<string> {
      // For now, return mock ID - can be implemented later
      return "attempt_" + Date.now();
    },

    async completePromptAttempt(params: any): Promise<{ xpEarned: number }> {
      try {
        const attemptData: Omit<PromptAttempt, 'id'> = {
          userId: "sample_user", // This should come from params
          promptId: "sample_prompt",
          userInput: params.userInput || "",
          userOutput: params.userOutput,
          timeSpent: params.timeSpent,
          selfRating: params.selfRating,
          feedback: params.feedback,
          xpEarned: 100, // Calculate based on performance
          completedAt: serverTimestamp(),
        };

        await addDoc(collection(db, "promptAttempts"), attemptData);
        return { xpEarned: 100 };
      } catch (error) {
        console.error("Error completing prompt attempt:", error);
        return { xpEarned: 0 };
      }
    },
  },
};