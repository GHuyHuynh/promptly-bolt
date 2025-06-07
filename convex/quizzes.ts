import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

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

export const submitQuiz = mutation({
  args: {
    quizId: v.id("quizzes"),
    answers: v.array(v.object({
      questionId: v.string(),
      userAnswer: v.union(v.string(), v.number()),
    })),
  },
  handler: async (ctx, args) => {
    const identity = await auth.getUserIdentity(ctx);
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

    const quiz = await ctx.db.get(args.quizId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    // Grade the quiz
    const gradedAnswers = args.answers.map(userAnswer => {
      const question = quiz.questions.find(q => q.id === userAnswer.questionId);
      if (!question) {
        return {
          questionId: userAnswer.questionId,
          userAnswer: userAnswer.userAnswer,
          isCorrect: false,
          points: 0,
        };
      }

      const isCorrect = question.correctAnswer === userAnswer.userAnswer;
      return {
        questionId: userAnswer.questionId,
        userAnswer: userAnswer.userAnswer,
        isCorrect,
        points: isCorrect ? question.points : 0,
      };
    });

    const totalScore = gradedAnswers.reduce((sum, answer) => sum + answer.points, 0);
    const passed = totalScore >= quiz.passingScore;

    // Save quiz attempt
    await ctx.db.insert("quiz_attempts", {
      userId: user._id,
      quizId: args.quizId,
      answers: gradedAnswers,
      totalScore,
      passed,
      completedAt: Date.now(),
    });

    // If passed, award XP and check for achievements
    if (passed) {
      await ctx.db.patch(user._id, {
        totalScore: user.totalScore + quiz.xpReward,
      });

      // Check for perfect score achievement
      const maxPossibleScore = quiz.questions.reduce((sum, q) => sum + q.points, 0);
      if (totalScore === maxPossibleScore) {
        await ctx.db.insert("achievements", {
          userId: user._id,
          type: "perfect_quiz",
          title: "Perfect Score!",
          description: "You got every question right on this quiz!",
          earnedAt: Date.now(),
        });
      }

      // Check for module completion achievement
      const moduleId = quiz.moduleId;
      const moduleLessons = await ctx.db
        .query("lessons")
        .withIndex("by_module_order", (q) => q.eq("moduleId", moduleId))
        .collect();

      const completedLessons = await ctx.db
        .query("user_progress")
        .withIndex("by_user", (q) => q.eq("userId", user._id))
        .filter((q) => q.eq(q.field("completed"), true))
        .collect();

      const moduleCompletedLessons = completedLessons.filter(progress => 
        moduleLessons.some(lesson => lesson._id === progress.lessonId)
      );

      if (moduleCompletedLessons.length === moduleLessons.length) {
        await ctx.db.insert("achievements", {
          userId: user._id,
          type: "module_complete",
          title: "Module Complete!",
          description: "You've completed all lessons and the quiz for this module!",
          earnedAt: Date.now(),
          metadata: { moduleId },
        });
      }
    }

    return {
      passed,
      totalScore,
      maxScore: quiz.questions.reduce((sum, q) => sum + q.points, 0),
      gradedAnswers,
      xpEarned: passed ? quiz.xpReward : 0,
    };
  },
});

export const getUserQuizAttempts = query({
  args: { quizId: v.id("quizzes") },
  handler: async (ctx, args) => {
    const identity = await auth.getUserIdentity(ctx);
    if (!identity) {
      return [];
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      return [];
    }

    return await ctx.db
      .query("quiz_attempts")
      .withIndex("by_user_quiz", (q) => 
        q.eq("userId", user._id).eq("quizId", args.quizId)
      )
      .collect();
  },
});