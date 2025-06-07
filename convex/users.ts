import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args): Promise<string> => {
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
  handler: async (ctx, args): Promise<Doc<"users"> | null> => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args): Promise<Doc<"users"> | null> => {
    return await ctx.db.get(args.userId);
  },
});

export const getLeaderboard = query({
  args: {},
  handler: async (ctx): Promise<Doc<"users">[]> => {
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
  handler: async (ctx, args): Promise<void> => {
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

// Create sample users for development
export const createSampleUsers = mutation({
  args: {},
  handler: async (ctx): Promise<{ message: string; sampleUserId: string }> => {
    // Check if sample users already exist
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", "alex@example.com"))
      .first();

    if (existingUser) {
      return { message: "Sample users already exist", sampleUserId: existingUser._id };
    }

    // Create main sample user
    const sampleUserId = await ctx.db.insert("users", {
      email: "alex@example.com",
      name: "Alex Chen",
      totalScore: 2450,
      level: 12,
      currentStreak: 7,
      longestStreak: 15,
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
    });

    // Create additional sample users for leaderboard
    await ctx.db.insert("users", {
      email: "sarah@example.com",
      name: "Sarah Kim",
      totalScore: 2380,
      level: 11,
      currentStreak: 5,
      longestStreak: 12,
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
    });

    await ctx.db.insert("users", {
      email: "mike@example.com",
      name: "Mike Johnson",
      totalScore: 2250,
      level: 11,
      currentStreak: 3,
      longestStreak: 8,
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
    });

    await ctx.db.insert("users", {
      email: "emma@example.com",
      name: "Emma Davis",
      totalScore: 2100,
      level: 10,
      currentStreak: 2,
      longestStreak: 10,
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
    });

    await ctx.db.insert("users", {
      email: "david@example.com",
      name: "David Wilson",
      totalScore: 1950,
      level: 10,
      currentStreak: 1,
      longestStreak: 6,
      lastActiveDate: new Date().toISOString().split('T')[0],
      createdAt: Date.now(),
    });

    return { message: "Sample users created successfully", sampleUserId };
  },
});

// Get the main sample user for development
export const getSampleUser = query({
  args: {},
  handler: async (ctx): Promise<Doc<"users"> | null> => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", "alex@example.com"))
      .first();
  },
});