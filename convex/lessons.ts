import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createLesson = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("lessons", args);
  },
});

export const getLessonsByModule = query({
  args: { moduleId: v.id("modules") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("lessons")
      .withIndex("by_module_order", (q) => q.eq("moduleId", args.moduleId))
      .order("asc")
      .collect();
  },
});

export const getLessonById = query({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.lessonId);
  },
});

export const getNextLesson = query({
  args: { 
    userId: v.id("users"),
    currentModuleId: v.id("modules"),
    currentLessonOrder: v.number(),
  },
  handler: async (ctx, args) => {
    // Get the next lesson in the current module
    const nextLesson = await ctx.db
      .query("lessons")
      .withIndex("by_module_order", (q) => q.eq("moduleId", args.currentModuleId))
      .filter((q) => q.gt(q.field("order"), args.currentLessonOrder))
      .order("asc")
      .first();

    if (nextLesson) {
      return nextLesson;
    }

    // If no more lessons in current module, get first lesson of next module
    const currentModule = await ctx.db.get(args.currentModuleId);
    if (!currentModule) return null;

    const nextModule = await ctx.db
      .query("modules")
      .withIndex("by_order")
      .filter((q) => q.gt(q.field("order"), currentModule.order))
      .order("asc")
      .first();

    if (!nextModule) return null;

    return await ctx.db
      .query("lessons")
      .withIndex("by_module_order", (q) => q.eq("moduleId", nextModule._id))
      .order("asc")
      .first();
  },
});