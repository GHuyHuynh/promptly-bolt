import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      return existingUser._id;
    }

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

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();
  },
});

export const updateUserScore = mutation({
  args: {
    userId: v.id("users"),
    scoreToAdd: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const newTotalScore = user.totalScore + args.scoreToAdd;
    const newLevel = Math.floor(newTotalScore / 1000) + 1; // Level up every 1000 XP

    await ctx.db.patch(args.userId, {
      totalScore: newTotalScore,
      level: newLevel,
    });

    // Check for level up achievement
    if (newLevel > user.level) {
      await ctx.db.insert("achievements", {
        userId: args.userId,
        type: "level_up",
        title: `Level ${newLevel} Reached!`,
        description: `Congratulations on reaching level ${newLevel}!`,
        earnedAt: Date.now(),
        metadata: { level: newLevel },
      });
    }

    return { newLevel, newTotalScore };
  },
});

export const updateStreak = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const today = new Date().toDateString();
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate).toDateString() : null;
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    let newStreak = user.currentStreak;

    if (lastActive === today) {
      // Already active today, no change
      return { currentStreak: newStreak };
    } else if (lastActive === yesterday) {
      // Continuing streak
      newStreak += 1;
    } else {
      // Streak broken or starting new
      newStreak = 1;
    }

    const newLongestStreak = Math.max(user.longestStreak, newStreak);

    await ctx.db.patch(args.userId, {
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastActiveDate: today,
    });

    // Check for streak achievements
    if (newStreak === 3 || newStreak === 7 || newStreak === 30) {
      await ctx.db.insert("achievements", {
        userId: args.userId,
        type: `streak_${newStreak}` as any,
        title: `${newStreak} Day Streak!`,
        description: `You've maintained a ${newStreak} day learning streak!`,
        earnedAt: Date.now(),
        metadata: { streak: newStreak },
      });
    }

    return { currentStreak: newStreak };
  },
});

export const getLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db
      .query("users")
      .order("desc")
      .take(10);

    return users
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((user, index) => ({
        rank: index + 1,
        name: user.name,
        totalScore: user.totalScore,
        level: user.level,
        currentStreak: user.currentStreak,
      }));
  },
});