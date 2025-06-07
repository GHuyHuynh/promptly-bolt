import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// ===== LEARNING PROMPTS =====

export const createLearningPrompt = mutation({
  args: {
    title: v.string(),
    category: v.string(),
    difficulty: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")),
    tags: v.array(v.string()),
    instruction: v.string(),
    context: v.optional(v.string()),
    examples: v.array(v.object({
      input: v.string(),
      output: v.string(),
      explanation: v.optional(v.string()),
    })),
    tips: v.array(v.string()),
    variations: v.optional(v.array(v.string())),
    learningObjectives: v.array(v.string()),
    estimatedTime: v.number(),
    xpReward: v.number(),
  },
  handler: async (ctx, args): Promise<Id<"learning_prompts">> => {
    return await ctx.db.insert("learning_prompts", {
      title: args.title,
      category: args.category,
      difficulty: args.difficulty,
      tags: args.tags,
      prompt: {
        instruction: args.instruction,
        context: args.context,
        examples: args.examples,
        tips: args.tips,
        variations: args.variations,
      },
      learningObjectives: args.learningObjectives,
      estimatedTime: args.estimatedTime,
      xpReward: args.xpReward,
      isActive: true,
      createdAt: Date.now(),
    });
  },
});

export const getPromptsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args): Promise<Doc<"learning_prompts">[]> => {
    return await ctx.db
      .query("learning_prompts")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const getPromptsByDifficulty = query({
  args: { difficulty: v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced")) },
  handler: async (ctx, args): Promise<Doc<"learning_prompts">[]> => {
    return await ctx.db
      .query("learning_prompts")
      .withIndex("by_difficulty", (q) => q.eq("difficulty", args.difficulty))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const getRandomPrompt = query({
  args: { 
    category: v.optional(v.string()),
    difficulty: v.optional(v.union(v.literal("beginner"), v.literal("intermediate"), v.literal("advanced"))),
    excludeCompleted: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args): Promise<Doc<"learning_prompts"> | null> => {
    let prompts = await ctx.db
      .query("learning_prompts")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Filter by category if provided
    if (args.category) {
      prompts = prompts.filter(p => p.category === args.category);
    }

    // Filter by difficulty if provided
    if (args.difficulty) {
      prompts = prompts.filter(p => p.difficulty === args.difficulty);
    }

    // Exclude completed prompts if provided
    if (args.excludeCompleted && args.excludeCompleted.length > 0) {
      prompts = prompts.filter(p => !args.excludeCompleted!.includes(p._id));
    }

    if (prompts.length === 0) return null;

    // Return random prompt
    const randomIndex = Math.floor(Math.random() * prompts.length);
    return prompts[randomIndex];
  },
});

// ===== USER LEARNING PROFILE =====

export const updateUserLearningProfile = mutation({
  args: {
    userId: v.id("users"),
    learningProfile: v.object({
      preferredTopics: v.optional(v.array(v.string())),
      learningStyle: v.optional(v.union(v.literal("visual"), v.literal("auditory"), v.literal("kinesthetic"), v.literal("reading"))),
      currentFocus: v.optional(v.string()),
      skillLevels: v.optional(v.object({
        prompting: v.number(),
        creativity: v.number(),
        analysis: v.number(),
        technical: v.number(),
      })),
      learningGoals: v.optional(v.array(v.string())),
    }),
  },
  handler: async (ctx, args): Promise<void> => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const currentProfile = user.learningProfile || {
      preferredTopics: [],
      skillLevels: { prompting: 1, creativity: 1, analysis: 1, technical: 1 },
      completedPrompts: [],
      favoritePrompts: [],
      learningGoals: [],
    };

    const updatedProfile = {
      ...currentProfile,
      ...args.learningProfile,
      skillLevels: args.learningProfile.skillLevels || currentProfile.skillLevels,
    };

    await ctx.db.patch(args.userId, { learningProfile: updatedProfile });
  },
});

export const getUserLearningProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user?.learningProfile || null;
  },
});

// ===== PROMPT ATTEMPTS =====

export const startPromptAttempt = mutation({
  args: {
    userId: v.id("users"),
    promptId: v.id("learning_prompts"),
    userInput: v.string(),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<Id<"prompt_attempts">> => {
    return await ctx.db.insert("prompt_attempts", {
      userId: args.userId,
      promptId: args.promptId,
      attempt: {
        userInput: args.userInput,
        userOutput: "",
        timeSpent: 0,
      },
      completed: false,
      xpEarned: 0,
      completedAt: Date.now(),
      metadata: {
        sessionId: args.sessionId,
        deviceType: "web",
        referenceUsed: false,
      },
    });
  },
});

export const completePromptAttempt = mutation({
  args: {
    attemptId: v.id("prompt_attempts"),
    userOutput: v.string(),
    timeSpent: v.number(),
    selfRating: v.optional(v.number()),
    feedback: v.optional(v.object({
      whatWorked: v.optional(v.string()),
      whatDidntWork: v.optional(v.string()),
      improvements: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args): Promise<{ xpEarned: number }> => {
    const attempt = await ctx.db.get(args.attemptId);
    if (!attempt) throw new Error("Attempt not found");

    const prompt = await ctx.db.get(attempt.promptId);
    if (!prompt) throw new Error("Prompt not found");

    // Calculate XP based on completion and self-rating
    let xpEarned = prompt.xpReward;
    if (args.selfRating && args.selfRating >= 4) {
      xpEarned = Math.floor(xpEarned * 1.2); // 20% bonus for high self-rating
    }

    // Update attempt
    await ctx.db.patch(args.attemptId, {
      attempt: {
        ...attempt.attempt,
        userOutput: args.userOutput,
        timeSpent: args.timeSpent,
        feedback: args.selfRating ? {
          selfRating: args.selfRating,
          ...args.feedback,
        } : undefined,
      },
      completed: true,
      xpEarned,
      completedAt: Date.now(),
    });

    // Update user learning profile
    const user = await ctx.db.get(attempt.userId);
    if (user) {
      const currentProfile = user.learningProfile || {
        preferredTopics: [],
        skillLevels: { prompting: 1, creativity: 1, analysis: 1, technical: 1 },
        completedPrompts: [],
        favoritePrompts: [],
        learningGoals: [],
      };

      const updatedProfile = {
        ...currentProfile,
        completedPrompts: [...currentProfile.completedPrompts, prompt._id],
      };

      await ctx.db.patch(attempt.userId, { 
        learningProfile: updatedProfile,
        totalScore: user.totalScore + xpEarned,
      });
    }

    return { xpEarned };
  },
});

export const getUserPromptAttempts = query({
  args: { 
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<Doc<"prompt_attempts">[]> => {
    let query = ctx.db
      .query("prompt_attempts")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc");

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.collect();
  },
});

// ===== LEARNING RECOMMENDATIONS =====

export const getPersonalizedPrompts = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args): Promise<Doc<"learning_prompts">[]> => {
    const user = await ctx.db.get(args.userId);
    if (!user || !user.learningProfile) {
      // Return beginner prompts if no profile
      return await ctx.db
        .query("learning_prompts")
        .withIndex("by_difficulty", (q) => q.eq("difficulty", "beginner"))
        .filter((q) => q.eq(q.field("isActive"), true))
        .take(5);
    }

    const profile = user.learningProfile;
    let prompts = await ctx.db
      .query("learning_prompts")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Filter out completed prompts
    prompts = prompts.filter(p => !profile.completedPrompts.includes(p._id));

    // Score prompts based on user preferences
    const scoredPrompts = prompts.map(prompt => {
      let score = 0;

      // Prefer topics user is interested in
      if (profile.preferredTopics.some(topic => 
        prompt.tags.includes(topic) || prompt.category.includes(topic)
      )) {
        score += 3;
      }

      // Match difficulty to skill level
      const avgSkill = Object.values(profile.skillLevels).reduce((a, b) => a + b, 0) / 4;
      if (avgSkill <= 3 && prompt.difficulty === "beginner") score += 2;
      else if (avgSkill > 3 && avgSkill <= 7 && prompt.difficulty === "intermediate") score += 2;
      else if (avgSkill > 7 && prompt.difficulty === "advanced") score += 2;

      // Prefer current focus area
      if (profile.currentFocus && prompt.category === profile.currentFocus) {
        score += 2;
      }

      return { ...prompt, score };
    });

    // Sort by score and return top 10
    return scoredPrompts
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(({ score, ...prompt }) => prompt);
  },
});

// ===== SAMPLE DATA CREATION =====

export const createSamplePrompts = mutation({
  args: {},
  handler: async (ctx): Promise<{ message: string; promptIds: Id<"learning_prompts">[] }> => {
    const existingPrompts = await ctx.db.query("learning_prompts").collect();
    if (existingPrompts.length > 0) {
      return { message: "Sample prompts already exist", promptIds: [] };
    }

    const samplePrompts = [
      {
        title: "Creative Story Starter",
        category: "creative",
        difficulty: "beginner" as const,
        tags: ["storytelling", "creativity", "writing"],
        instruction: "Write a creative story beginning based on the given scenario. Focus on setting the scene and introducing an interesting character.",
        context: "You'll be given a simple scenario. Your job is to expand it into an engaging story opening that hooks the reader.",
        examples: [
          {
            input: "A person finds a mysterious key in their grandmother's attic",
            output: "Sarah's fingers trembled as she lifted the ornate brass key from beneath the dusty photo albums. The metal was warm to the touch, almost pulsing with an energy that made her skin tingle. Her grandmother had been gone for three months now, but this key—with its intricate engravings of symbols she'd never seen before—felt like it was waiting specifically for her to find it.",
            explanation: "This example shows how to take a simple premise and add sensory details, emotion, and mystery to create an engaging opening."
          }
        ],
        tips: [
          "Use sensory details to make the scene vivid",
          "Create immediate intrigue or questions",
          "Establish the character's emotional state",
          "Set up a clear direction for the story"
        ],
        variations: ["Try different genres (mystery, sci-fi, romance)", "Experiment with different points of view"],
        learningObjectives: ["Practice creative writing", "Learn story structure", "Develop character voice"],
        estimatedTime: 15,
        xpReward: 100,
      },
      {
        title: "Problem-Solution Analysis",
        category: "analytical",
        difficulty: "intermediate" as const,
        tags: ["analysis", "problem-solving", "critical-thinking"],
        instruction: "Analyze a given problem and propose a structured solution. Break down the problem into components and provide a step-by-step approach.",
        context: "You'll receive a real-world problem scenario. Your task is to demonstrate analytical thinking by identifying root causes and proposing actionable solutions.",
        examples: [
          {
            input: "A small business is losing customers to online competitors",
            output: "**Problem Analysis:**\n1. Root causes: Limited online presence, higher prices, outdated customer experience\n2. Impact: 30% revenue decline, reduced market share\n\n**Solution Framework:**\n1. Digital transformation (website, social media, online ordering)\n2. Competitive pricing strategy\n3. Enhanced customer service training\n4. Loyalty program implementation\n\n**Implementation Timeline:** 3-month phased approach with measurable milestones",
            explanation: "This shows structured problem-solving with clear analysis, actionable solutions, and implementation planning."
          }
        ],
        tips: [
          "Always identify root causes, not just symptoms",
          "Propose specific, actionable solutions",
          "Consider implementation feasibility",
          "Include success metrics"
        ],
        learningObjectives: ["Develop analytical thinking", "Learn problem-solving frameworks", "Practice structured communication"],
        estimatedTime: 25,
        xpReward: 150,
      },
      {
        title: "Technical Explanation Simplifier",
        category: "technical",
        difficulty: "advanced" as const,
        tags: ["technical-writing", "communication", "simplification"],
        instruction: "Take a complex technical concept and explain it in simple terms that anyone can understand. Use analogies and examples.",
        context: "You'll be given a technical topic. Your goal is to make it accessible to non-technical audiences while maintaining accuracy.",
        examples: [
          {
            input: "Explain blockchain technology",
            output: "Think of blockchain like a digital ledger book that's shared among many people. Instead of one person keeping track of transactions, thousands of copies exist across different computers. When someone wants to add a new transaction, the majority of computers must agree it's valid—like having multiple witnesses verify each entry. Once added, the entry can't be erased or changed, making it extremely secure and trustworthy.",
            explanation: "This uses the familiar concept of a ledger book and witnesses to explain the complex ideas of distributed consensus and immutability."
          }
        ],
        tips: [
          "Use familiar analogies and metaphors",
          "Avoid technical jargon",
          "Focus on the 'why' and 'what' before the 'how'",
          "Test your explanation with someone non-technical"
        ],
        learningObjectives: ["Master technical communication", "Learn to use analogies effectively", "Practice audience adaptation"],
        estimatedTime: 30,
        xpReward: 200,
      }
    ];

    const promptIds: Id<"learning_prompts">[] = [];

    for (const promptData of samplePrompts) {
      const promptId = await ctx.db.insert("learning_prompts", {
        title: promptData.title,
        category: promptData.category,
        difficulty: promptData.difficulty,
        tags: promptData.tags,
        prompt: {
          instruction: promptData.instruction,
          context: promptData.context,
          examples: promptData.examples,
          tips: promptData.tips,
          variations: promptData.variations,
        },
        learningObjectives: promptData.learningObjectives,
        estimatedTime: promptData.estimatedTime,
        xpReward: promptData.xpReward,
        isActive: true,
        createdAt: Date.now(),
      });
      promptIds.push(promptId);
    }

    return { message: "Sample prompts created successfully", promptIds };
  },
}); 