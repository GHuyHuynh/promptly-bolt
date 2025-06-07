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
});