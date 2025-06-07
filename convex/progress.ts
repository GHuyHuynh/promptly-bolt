import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createProgress = mutation({
  args: {
    userId: v.id("users"),
    lessonId: v.id("lessons"),
    completed: v.boolean(),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    const existingProgress = await ctx.db
      .query("user_progress")
      .withIndex("by_user_lesson", (q) => 
        q.eq("userId", args.userId).eq("lessonId", args.lessonId)
      )
      .first();

    if (existingProgress) {
      return await ctx.db.patch(existingProgress._id, {
        completed: args.completed,
        score: Math.max(existingProgress.score, args.score),
        completedAt: args.completed ? Date.now() : undefined,
        attempts: existingProgress.attempts + 1,
      });
    }

    return await ctx.db.insert("user_progress", {
      userId: args.userId,
      lessonId: args.lessonId,
      completed: args.completed,
      score: args.score,
      completedAt: args.completed ? Date.now() : undefined,
      attempts: 1,
    });
  },
});

export const getUserProgress = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("user_progress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const getLessonProgress = query({
  args: { 
    userId: v.id("users"),
    lessonId: v.id("lessons")
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("user_progress")
      .withIndex("by_user_lesson", (q) => 
        q.eq("userId", args.userId).eq("lessonId", args.lessonId)
      )
      .first();
  },
});