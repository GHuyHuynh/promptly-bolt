import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const completeLesson = mutation({
  args: {
    lessonId: v.id("lessons"),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson) {
      throw new Error("Lesson not found");
    }

    // Check if already completed
    const existingProgress = await ctx.db
      .query("user_progress")
      .withIndex("by_user_lesson", (q) => 
        q.eq("userId", user._id).eq("lessonId", args.lessonId)
      )
      .first();

    if (existingProgress) {
      // Update existing progress
      await ctx.db.patch(existingProgress._id, {
        completed: true,
        score: Math.max(existingProgress.score, args.score),
        completedAt: Date.now(),
        attempts: existingProgress.attempts + 1,
      });
    } else {
      // Create new progress record
      await ctx.db.insert("user_progress", {
        userId: user._id,
        lessonId: args.lessonId,
        completed: true,
        score: args.score,
        completedAt: Date.now(),
        attempts: 1,
      });

      // Check for first lesson achievement
      const totalCompleted = await ctx.db
        .query("user_progress")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .filter((q) => q.eq(q.field("completed"), true))
        .collect();

      if (totalCompleted.length === 1) {
        await ctx.db.insert("achievements", {
          userId: user._id,
          type: "first_lesson",
          title: "First Lesson Complete!",
          description: "You've completed your first lesson. Keep it up!",
          earnedAt: Date.now(),
        });
      }
    }

    // Update user score and streak
    await ctx.db.patch(user._id, {
      totalScore: user.totalScore + lesson.xpReward,
    });

    // Update streak
    const today = new Date().toDateString();
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate).toDateString() : null;
    
    if (lastActive !== today) {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      const newStreak = lastActive === yesterday ? user.currentStreak + 1 : 1;
      
      await ctx.db.patch(user._id, {
        currentStreak: newStreak,
        longestStreak: Math.max(user.longestStreak, newStreak),
        lastActiveDate: today,
      });
    }

    return { success: true, xpEarned: lesson.xpReward };
  },
});

export const getUserProgress = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      return null;
    }

    const progress = await ctx.db
      .query("user_progress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const achievements = await ctx.db
      .query("achievements")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return {
      user,
      completedLessons: progress.filter(p => p.completed),
      totalProgress: progress,
      achievements,
    };
  },
});

export const isLessonUnlocked = query({
  args: { 
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      return false;
    }

    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson) {
      return false;
    }

    // First lesson is always unlocked
    if (lesson.order === 1) {
      return true;
    }

    // Check if previous lesson is completed
    const previousLesson = await ctx.db
      .query("lessons")
      .withIndex("by_module_order", (q) => q.eq("moduleId", lesson.moduleId))
      .filter((q) => q.eq(q.field("order"), lesson.order - 1))
      .first();

    if (!previousLesson) {
      return false;
    }

    const previousProgress = await ctx.db
      .query("user_progress")
      .withIndex("by_user_lesson", (q) => 
        q.eq("userId", user._id).eq("lessonId", previousLesson._id)
      )
      .first();

    return previousProgress?.completed || false;
  },
});