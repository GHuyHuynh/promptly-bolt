import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createModule = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("modules", {
      title: args.title,
      description: args.description,
      order: args.order,
      isActive: true,
    });
  },
});

export const getAllModules = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("modules")
      .withIndex("by_order")
      .order("asc")
      .collect();
  },
});

export const getModuleById = query({
  args: { moduleId: v.id("modules") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.moduleId);
  },
});