import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    totalScore: v.number(),
    level: v.number(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastActiveDate: v.optional(v.string()),
    createdAt: v.number(),
    learningProfile: v.optional(v.object({
      preferredTopics: v.array(v.string()),
      learningStyle: v.optional(v.union(v.literal("visual"), v.literal("auditory"), v.literal("kinesthetic"), v.literal("reading"))),
      currentFocus: v.optional(v.string()),
      skillLevels: v.object({
        prompting: v.number(),
        creativity: v.number(),
        analysis: v.number(),
        technical: v.number(),
      }),
      completedPrompts: v.array(v.string()),
      favoritePrompts: v.array(v.string()),
      learningGoals: v.array(v.string()),
    })),
  }).index("by_email", ["email"]),

  modules: defineTable({
    title: v.string(),
    description: v.string(),
    order: v.number(),
    isActive: v.boolean(),
  }).index("by_order", ["order"]),

  lessons: defineTable({
    title: v.string(),
    moduleId: v.id("modules"),
    order: v.number(),
    content: v.object({
      introduction: v.string(),
      sections: v.array(v.object({
        title: v.string(),
        content: v.string(),
        examples: v.optional(v.array(v.string())),
      })),
      keyTakeaways: v.array(v.string()),
    }),
    xpReward: v.number(),
    difficulty: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
  }).index("by_module_order", ["moduleId", "order"]),

  user_progress: defineTable({
    userId: v.id("users"),
    lessonId: v.id("lessons"),
    completed: v.boolean(),
    score: v.number(),
    completedAt: v.optional(v.number()),
    attempts: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_lesson", ["userId", "lessonId"]),

  quizzes: defineTable({
    moduleId: v.id("modules"),
    title: v.string(),
    questions: v.array(v.object({
      id: v.string(),
      question: v.string(),
      type: v.union(v.literal("multiple_choice"), v.literal("true_false"), v.literal("text_input")),
      options: v.optional(v.array(v.string())),
      correctAnswer: v.union(v.string(), v.number()),
      explanation: v.string(),
      points: v.number(),
    })),
    passingScore: v.number(),
    xpReward: v.number(),
  }).index("by_module", ["moduleId"]),

  quiz_attempts: defineTable({
    userId: v.id("users"),
    quizId: v.id("quizzes"),
    answers: v.array(v.object({
      questionId: v.string(),
      userAnswer: v.union(v.string(), v.number()),
      isCorrect: v.boolean(),
      points: v.number(),
    })),
    totalScore: v.number(),
    passed: v.boolean(),
    completedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_user_quiz", ["userId", "quizId"]),

  achievements: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("first_lesson"),
      v.literal("streak_3"),
      v.literal("streak_7"),
      v.literal("streak_30"),
      v.literal("module_complete"),
      v.literal("perfect_quiz"),
      v.literal("level_up")
    ),
    title: v.string(),
    description: v.string(),
    earnedAt: v.number(),
    metadata: v.optional(v.object({
      moduleId: v.optional(v.id("modules")),
      level: v.optional(v.number()),
      streak: v.optional(v.number()),
    })),
  }).index("by_user", ["userId"]),

  learning_prompts: defineTable({
    title: v.string(),
    category: v.string(),
    difficulty: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
    tags: v.array(v.string()),
    prompt: v.object({
      instruction: v.string(),
      context: v.optional(v.string()),
      examples: v.array(v.object({
        input: v.string(),
        output: v.string(),
        explanation: v.optional(v.string()),
      })),
      tips: v.array(v.string()),
      variations: v.optional(v.array(v.string())),
    }),
    learningObjectives: v.array(v.string()),
    estimatedTime: v.number(),
    xpReward: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
  }).index("by_category", ["category"])
    .index("by_difficulty", ["difficulty"])
    .index("by_active", ["isActive"]),

  prompt_attempts: defineTable({
    userId: v.id("users"),
    promptId: v.id("learning_prompts"),
    attempt: v.object({
      userInput: v.string(),
      userOutput: v.string(),
      timeSpent: v.number(),
      feedback: v.optional(v.object({
        selfRating: v.number(),
        whatWorked: v.optional(v.string()),
        whatDidntWork: v.optional(v.string()),
        improvements: v.optional(v.string()),
      })),
      aiEvaluation: v.optional(v.object({
        score: v.number(),
        strengths: v.array(v.string()),
        improvements: v.array(v.string()),
        suggestions: v.array(v.string()),
      })),
    }),
    completed: v.boolean(),
    xpEarned: v.number(),
    completedAt: v.number(),
    metadata: v.object({
      sessionId: v.optional(v.string()),
      deviceType: v.optional(v.string()),
      referenceUsed: v.optional(v.boolean()),
    }),
  }).index("by_user", ["userId"])
    .index("by_user_prompt", ["userId", "promptId"])
    .index("by_completion", ["completed"]),

  learning_paths: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(),
    difficulty: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
    path: v.object({
      prompts: v.array(v.object({
        promptId: v.id("learning_prompts"),
        order: v.number(),
        isRequired: v.boolean(),
        prerequisites: v.optional(v.array(v.string())),
      })),
      milestones: v.array(v.object({
        title: v.string(),
        description: v.string(),
        requiredPrompts: v.array(v.string()),
        reward: v.object({
          xp: v.number(),
          badge: v.optional(v.string()),
          unlocks: v.optional(v.array(v.string())),
        }),
      })),
    }),
    estimatedDuration: v.number(),
    totalXp: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
  }).index("by_category", ["category"])
    .index("by_active", ["isActive"]),

  user_learning_paths: defineTable({
    userId: v.id("users"),
    pathId: v.id("learning_paths"),
    progress: v.object({
      currentPromptIndex: v.number(),
      completedPrompts: v.array(v.string()),
      completedMilestones: v.array(v.string()),
      totalXpEarned: v.number(),
      startedAt: v.number(),
      lastActiveAt: v.number(),
      estimatedCompletion: v.optional(v.number()),
    }),
    status: v.union(v.literal("not_started"), v.literal("in_progress"), v.literal("completed"), v.literal("paused")),
    personalNotes: v.optional(v.string()),
    customizations: v.optional(v.object({
      skipOptional: v.boolean(),
      preferredPace: v.union(v.literal("slow"), v.literal("normal"), v.literal("fast")),
      reminderFrequency: v.optional(v.string()),
    })),
  }).index("by_user", ["userId"])
    .index("by_user_path", ["userId", "pathId"])
    .index("by_status", ["status"]),
});