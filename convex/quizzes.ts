import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createQuiz = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("quizzes", args);
  },
});

export const getQuizByModule = query({
  args: { moduleId: v.id("modules") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("quizzes")
      .withIndex("by_module", (q) => q.eq("moduleId", args.moduleId))
      .first();
  },
});

export const submitQuizAttempt = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("quiz_attempts", {
      userId: args.userId,
      quizId: args.quizId,
      answers: args.answers,
      totalScore: args.totalScore,
      passed: args.passed,
      completedAt: Date.now(),
    });
  },
});