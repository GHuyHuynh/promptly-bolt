import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      totalScore: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      createdAt: Date.now(),
    });
  },
});

export const getUser = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const getLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .order("desc")
      .take(10);
  },
});

export const updateUserProgress = mutation({
  args: {
    userId: v.id("users"),
    xpGained: v.number(),
    streakUpdate: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const newTotalScore = user.totalScore + args.xpGained;
    const newLevel = Math.floor(newTotalScore / 1000) + 1;
    
    let updates: any = {
      totalScore: newTotalScore,
      level: newLevel,
    };

    if (args.streakUpdate) {
      updates.currentStreak = user.currentStreak + 1;
      updates.longestStreak = Math.max(user.longestStreak, updates.currentStreak);
      updates.lastActiveDate = new Date().toISOString().split('T')[0];
    }

    return await ctx.db.patch(args.userId, updates);
  },
});

// Create a mock user for testing
export const createMockUser = mutation({
  args: {},
  handler: async (ctx) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", "alex@example.com"))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

    return await ctx.db.insert("users", {
      email: "alex@example.com",
      name: "Alex Chen",
      totalScore: 2450,
      level: 12,
      currentStreak: 7,
      longestStreak: 15,
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
    });
  },
});