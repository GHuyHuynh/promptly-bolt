/**
 * XP System Integration Examples
 * 
 * This file provides practical examples of how to integrate the XP system
 * into your curriculum platform. These examples demonstrate common use cases
 * and best practices for implementing the XP system.
 */

import {
  calculateXPReward,
  getLevelInfo,
  updateUserXPProfile,
  createXPEvent,
  validateXPTransaction,
  checkAchievements,
  awardLessonXP
} from './xpSystem';

import { DEFAULT_ACHIEVEMENTS } from './achievements';

import {
  UserXPProfile,
  XPSource,
  XPSourceType,
  XPCategory,
  DifficultyLevel,
  XPEventType,
  XPTransaction
} from '../types/xpSystem';

// ============================================================================
// EXAMPLE 1: LESSON COMPLETION
// ============================================================================

/**
 * Example: Handle lesson completion with XP reward
 */
export const handleLessonCompletion = async (
  userId: string,
  lessonId: string,
  completionData: {
    score: number;
    timeSpent: number; // in minutes
    targetTime: number; // in minutes
    isFirstAttempt: boolean;
  }
): Promise<{
  success: boolean;
  xpEarned: number;
  newLevel: number;
  leveledUp: boolean;
  achievements: string[];
  message: string;
}> => {
  try {
    // Determine lesson difficulty (this would come from your lesson data)
    const lessonDifficulty = DifficultyLevel.INTERMEDIATE;
    
    // Award XP using the utility function
    const result = await awardLessonXP(userId, lessonId, lessonDifficulty, completionData);
    
    // Save to database (implement your own database functions)
    await saveUserXPProfile(result.newProfile);
    await saveXPEvent(createXPEvent(
      userId,
      XPEventType.TASK_COMPLETED,
      result.xpReward.totalXP,
      result.xpReward.source,
      lessonId,
      { score: completionData.score, timeSpent: completionData.timeSpent }
    ));
    
    // Save achievements
    for (const achievement of result.achievements) {
      await saveAchievement(userId, achievement);
    }
    
    return {
      success: true,
      xpEarned: result.xpReward.totalXP,
      newLevel: result.newProfile.currentLevel,
      leveledUp: result.leveledUp,
      achievements: result.achievements.map(a => a.name),
      message: `Great job! You earned ${result.xpReward.totalXP} XP${result.leveledUp ? ` and reached level ${result.newProfile.currentLevel}!` : '!'}`
    };
    
  } catch (error) {
    console.error('Error handling lesson completion:', error);
    return {
      success: false,
      xpEarned: 0,
      newLevel: 1,
      leveledUp: false,
      achievements: [],
      message: 'Error processing lesson completion'
    };
  }
};

// ============================================================================
// EXAMPLE 2: QUIZ COMPLETION
// ============================================================================

/**
 * Example: Handle quiz completion with validation
 */
export const handleQuizCompletion = async (
  userId: string,
  quizId: string,
  answers: any[],
  correctAnswers: any[],
  timeSpent: number
): Promise<{
  success: boolean;
  score: number;
  xpEarned: number;
  feedback: string;
}> => {
  try {
    // Calculate score
    const score = Math.round((answers.filter((answer, index) => 
      JSON.stringify(answer) === JSON.stringify(correctAnswers[index])
    ).length / correctAnswers.length) * 100);
    
    // Get user profile
    const userProfile = await getUserXPProfile(userId);
    
    // Define quiz source
    const quizSource: XPSource = {
      type: XPSourceType.QUIZ,
      category: XPCategory.ASSESSMENT,
      difficulty: DifficultyLevel.INTERMEDIATE,
      multiplier: 1
    };
    
    // Calculate XP reward
    const xpReward = calculateXPReward(quizSource, userProfile, {
      score,
      timeSpent,
      targetTime: 30, // 30 minutes target
      isFirstAttempt: true,
      isPerfectScore: score === 100
    });
    
    // Validate transaction
    const transaction: Omit<XPTransaction, 'id' | 'timestamp' | 'validated'> = {
      userId,
      amount: xpReward.totalXP,
      type: 'earned',
      source: quizSource,
      sourceId: quizId,
      reversible: true,
      metadata: { score, timeSpent }
    };
    
    const validation = validateXPTransaction(transaction, userProfile.xpHistory, []);
    
    if (!validation.isValid) {
      throw new Error(validation.reason);
    }
    
    // Create XP event
    const xpEvent = createXPEvent(
      userId,
      XPEventType.QUIZ_PASSED,
      xpReward.totalXP,
      quizSource,
      quizId,
      { score, timeSpent, answers: answers.length }
    );
    
    // Update profile
    const updatedProfile = updateUserXPProfile(userProfile, xpReward, {
      ...xpEvent, 
      id: generateUniqueId()
    });
    
    // Save to database
    await saveUserXPProfile(updatedProfile);
    
    return {
      success: true,
      score,
      xpEarned: xpReward.totalXP,
      feedback: score >= 80 ? 'Excellent work!' : score >= 60 ? 'Good job!' : 'Keep practicing!'
    };
    
  } catch (error) {
    console.error('Error handling quiz completion:', error);
    return {
      success: false,
      score: 0,
      xpEarned: 0,
      feedback: 'Error processing quiz'
    };
  }
};

// ============================================================================
// EXAMPLE 3: DAILY LOGIN BONUS
// ============================================================================

/**
 * Example: Handle daily login XP bonus
 */
export const handleDailyLogin = async (userId: string): Promise<{
  bonusAwarded: boolean;
  xpEarned: number;
  streakContinued: boolean;
  currentStreak: number;
}> => {
  try {
    const userProfile = await getUserXPProfile(userId);
    
    // Check if user should get daily bonus
    const shouldGetBonus = !isToday(userProfile.lastActivityDate);
    
    if (!shouldGetBonus) {
      return {
        bonusAwarded: false,
        xpEarned: 0,
        streakContinued: false,
        currentStreak: userProfile.streak
      };
    }
    
    // Create daily login source
    const loginSource: XPSource = {
      type: XPSourceType.BONUS,
      category: XPCategory.ENGAGEMENT,
      difficulty: DifficultyLevel.BEGINNER,
      multiplier: 1
    };
    
    // Calculate XP (base 5 XP for daily login)
    const xpReward = calculateXPReward(loginSource, userProfile);
    
    // Create XP event
    const xpEvent = createXPEvent(
      userId,
      XPEventType.DAILY_LOGIN,
      5, // Fixed daily login XP
      loginSource,
      `daily-login-${new Date().toISOString().split('T')[0]}`,
      { loginDate: new Date().toISOString() }
    );
    
    // Update profile
    const updatedProfile = updateUserXPProfile(userProfile, xpReward, {
      ...xpEvent,
      id: generateUniqueId()
    });
    
    await saveUserXPProfile(updatedProfile);
    
    return {
      bonusAwarded: true,
      xpEarned: 5,
      streakContinued: updatedProfile.streak > userProfile.streak,
      currentStreak: updatedProfile.streak
    };
    
  } catch (error) {
    console.error('Error handling daily login:', error);
    return {
      bonusAwarded: false,
      xpEarned: 0,
      streakContinued: false,
      currentStreak: 0
    };
  }
};

// ============================================================================
// EXAMPLE 4: ACHIEVEMENT CHECKING
// ============================================================================

/**
 * Example: Check and award achievements
 */
export const checkAndAwardAchievements = async (userId: string): Promise<{
  newAchievements: string[];
  totalXPFromAchievements: number;
}> => {
  try {
    const userProfile = await getUserXPProfile(userId);
    const userAchievements = await getUserAchievements(userId);
    
    // Check for new achievements
    const newAchievements = checkAchievements(userProfile, [...userAchievements, ...DEFAULT_ACHIEVEMENTS]);
    
    let totalXPFromAchievements = 0;
    
    // Award XP for new achievements
    for (const achievement of newAchievements) {
      totalXPFromAchievements += achievement.xpReward;
      
      // Create achievement XP event
      const xpEvent = createXPEvent(
        userId,
        XPEventType.ACHIEVEMENT_UNLOCKED,
        achievement.xpReward,
        {
          type: XPSourceType.BONUS,
          category: XPCategory.ENGAGEMENT,
          difficulty: DifficultyLevel.BEGINNER,
          multiplier: 1
        },
        achievement.id,
        { achievementName: achievement.name }
      );
      
      // Save achievement
      await saveAchievement(userId, achievement);
    }
    
    // Update user profile with achievement XP
    if (totalXPFromAchievements > 0) {
      const updatedProfile = {
        ...userProfile,
        totalXP: userProfile.totalXP + totalXPFromAchievements,
        updatedAt: new Date()
      };
      await saveUserXPProfile(updatedProfile);
    }
    
    return {
      newAchievements: newAchievements.map(a => a.name),
      totalXPFromAchievements
    };
    
  } catch (error) {
    console.error('Error checking achievements:', error);
    return {
      newAchievements: [],
      totalXPFromAchievements: 0
    };
  }
};

// ============================================================================
// EXAMPLE 5: USER DASHBOARD DATA
// ============================================================================

/**
 * Example: Get user dashboard data with XP information
 */
export const getUserDashboardData = async (userId: string): Promise<{
  levelInfo: any;
  recentActivity: any[];
  achievements: any[];
  nextMilestone: any;
  statistics: any;
}> => {
  try {
    const userProfile = await getUserXPProfile(userId);
    const userAchievements = await getUserAchievements(userId);
    
    // Get level information
    const levelInfo = getLevelInfo(userProfile.totalXP);
    
    // Get recent activity (last 7 days)
    const recentActivity = userProfile.xpHistory
      .filter(event => {
        const daysDiff = Math.floor((Date.now() - event.timestamp.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff <= 7;
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);
    
    // Get recent achievements
    const recentAchievements = userAchievements
      .filter(achievement => achievement.unlocked && achievement.unlockedAt)
      .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
      .slice(0, 5);
    
    // Get next milestone
    const nextMilestone = DEFAULT_MILESTONES
      .filter(milestone => milestone.level > levelInfo.level)
      .sort((a, b) => a.level - b.level)[0];
    
    // Calculate statistics
    const statistics = {
      totalXP: userProfile.totalXP,
      currentLevel: levelInfo.level,
      currentStreak: userProfile.streak,
      longestStreak: userProfile.longestStreak,
      totalAchievements: userAchievements.filter(a => a.unlocked).length,
      completedTasks: userProfile.xpHistory.filter(e => e.type === XPEventType.TASK_COMPLETED).length,
      xpThisWeek: recentActivity.reduce((sum, event) => sum + event.amount, 0)
    };
    
    return {
      levelInfo,
      recentActivity,
      achievements: recentAchievements,
      nextMilestone,
      statistics
    };
    
  } catch (error) {
    console.error('Error getting dashboard data:', error);
    throw error;
  }
};

// ============================================================================
// MOCK DATABASE FUNCTIONS
// ============================================================================
// These functions should be implemented with your actual database

const getUserXPProfile = async (userId: string): Promise<UserXPProfile> => {
  // Implement with your database
  throw new Error('Implement getUserXPProfile with your database');
};

const saveUserXPProfile = async (profile: UserXPProfile): Promise<void> => {
  // Implement with your database
  console.log('Saving user XP profile:', profile);
};

const saveXPEvent = async (event: any): Promise<void> => {
  // Implement with your database
  console.log('Saving XP event:', event);
};

const saveAchievement = async (userId: string, achievement: any): Promise<void> => {
  // Implement with your database
  console.log('Saving achievement:', userId, achievement);
};

const getUserAchievements = async (userId: string): Promise<any[]> => {
  // Implement with your database
  return [];
};

const generateUniqueId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// ============================================================================
// REACT HOOK EXAMPLE
// ============================================================================

/**
 * Example React hook for XP system
 */
export const useXPSystem = (userId: string) => {
  // This would be implemented as a proper React hook
  // using useState, useEffect, etc.
  
  return {
    // User data
    userProfile: null,
    levelInfo: null,
    
    // Actions
    awardXP: async (sourceType: XPSourceType, sourceId: string, amount: number) => {
      // Implementation
    },
    
    checkAchievements: async () => {
      // Implementation
    },
    
    // Loading states
    loading: false,
    error: null
  };
};

export default {
  handleLessonCompletion,
  handleQuizCompletion,
  handleDailyLogin,
  checkAndAwardAchievements,
  getUserDashboardData,
  useXPSystem
};