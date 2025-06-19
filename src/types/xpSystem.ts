// XP System Types for Curriculum Platform

export interface XPEvent {
  id: string;
  userId: string;
  type: XPEventType;
  amount: number;
  source: XPSource;
  sourceId: string; // ID of the task, quiz, project, etc.
  timestamp: Date;
  metadata?: Record<string, any>;
  validated: boolean;
}

export interface UserXPProfile {
  userId: string;
  totalXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  levelProgress: number; // Percentage (0-100)
  streak: number; // Current daily streak
  longestStreak: number;
  lastActivityDate: Date;
  achievements: Achievement[];
  milestones: Milestone[];
  xpHistory: XPEvent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface XPSource {
  type: XPSourceType;
  category: XPCategory;
  difficulty: DifficultyLevel;
  multiplier: number; // Base multiplier for this source type
}

export interface XPReward {
  baseXP: number;
  bonusXP: number;
  totalXP: number;
  multipliers: XPMultiplier[];
  reason: string;
}

export interface XPMultiplier {
  type: MultiplierType;
  value: number; // e.g., 1.5 for 50% bonus
  reason: string;
  expiresAt?: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: AchievementType;
  tier: AchievementTier;
  xpReward: number;
  requirements: AchievementRequirement[];
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number; // 0-100 percentage
  icon?: string;
  badge?: string;
}

export interface AchievementRequirement {
  type: RequirementType;
  value: number;
  description: string;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  level: number;
  xpThreshold: number;
  rewards: MilestoneReward[];
  reached: boolean;
  reachedAt?: Date;
}

export interface MilestoneReward {
  type: RewardType;
  value: string | number;
  description: string;
}

export interface LevelInfo {
  level: number;
  xpRequired: number;
  xpToNext: number;
  totalXPRequired: number;
  title: string;
  description: string;
  perks: string[];
  badgeColor: string;
}

export interface XPTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'earned' | 'spent' | 'adjusted';
  source: XPSource;
  sourceId: string;
  timestamp: Date;
  validated: boolean;
  reversible: boolean;
  metadata?: Record<string, any>;
}

export interface XPValidationRule {
  sourceType: XPSourceType;
  maxPerDay: number;
  maxPerHour: number;
  cooldownMinutes: number;
  requiresValidation: boolean;
  antiCheatChecks: string[];
}

// Enums and Constants

export enum XPEventType {
  TASK_COMPLETED = 'task_completed',
  QUIZ_PASSED = 'quiz_passed',
  PROJECT_SUBMITTED = 'project_submitted',
  STREAK_BONUS = 'streak_bonus',
  PERFECT_SCORE = 'perfect_score',
  FIRST_ATTEMPT = 'first_attempt',
  SPEED_BONUS = 'speed_bonus',
  COMEBACK_BONUS = 'comeback_bonus',
  MILESTONE_REACHED = 'milestone_reached',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
  DAILY_LOGIN = 'daily_login',
  PEER_REVIEW = 'peer_review',
  MANUAL_ADJUSTMENT = 'manual_adjustment'
}

export enum XPSourceType {
  LESSON = 'lesson',
  QUIZ = 'quiz',
  PROJECT = 'project',
  ASSIGNMENT = 'assignment',
  DISCUSSION = 'discussion',
  PEER_REVIEW = 'peer_review',
  ATTENDANCE = 'attendance',
  BONUS = 'bonus',
  CORRECTION = 'correction'
}

export enum XPCategory {
  CORE_LEARNING = 'core_learning',
  PRACTICE = 'practice',
  ASSESSMENT = 'assessment',
  COLLABORATION = 'collaboration',
  ENGAGEMENT = 'engagement',
  BONUS_ACTIVITY = 'bonus_activity'
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum MultiplierType {
  STREAK_BONUS = 'streak_bonus',
  PERFECT_SCORE = 'perfect_score',
  SPEED_BONUS = 'speed_bonus',
  FIRST_ATTEMPT = 'first_attempt',
  COMEBACK_BONUS = 'comeback_bonus',
  EVENT_BONUS = 'event_bonus',
  PREMIUM_BONUS = 'premium_bonus'
}

export enum AchievementType {
  PROGRESS = 'progress',
  STREAK = 'streak',
  MASTERY = 'mastery',
  SPEED = 'speed',
  CONSISTENCY = 'consistency',
  COLLABORATION = 'collaboration',
  EXPLORATION = 'exploration',
  MILESTONE = 'milestone'
}

export enum AchievementTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond'
}

export enum RequirementType {
  TOTAL_XP = 'total_xp',
  LEVEL_REACHED = 'level_reached',
  TASKS_COMPLETED = 'tasks_completed',
  PERFECT_SCORES = 'perfect_scores',
  STREAK_DAYS = 'streak_days',
  CATEGORIES_MASTERED = 'categories_mastered',
  SPEED_COMPLETIONS = 'speed_completions'
}

export enum RewardType {
  XP_BONUS = 'xp_bonus',
  MULTIPLIER = 'multiplier',
  BADGE = 'badge',
  TITLE = 'title',
  FEATURE_UNLOCK = 'feature_unlock',
  COSMETIC = 'cosmetic'
}

// Constants for XP calculations
export const XP_CONSTANTS = {
  // Base XP values by source type and difficulty
  BASE_XP: {
    [XPSourceType.LESSON]: {
      [DifficultyLevel.BEGINNER]: 10,
      [DifficultyLevel.INTERMEDIATE]: 15,
      [DifficultyLevel.ADVANCED]: 25,
      [DifficultyLevel.EXPERT]: 40
    },
    [XPSourceType.QUIZ]: {
      [DifficultyLevel.BEGINNER]: 15,
      [DifficultyLevel.INTERMEDIATE]: 25,
      [DifficultyLevel.ADVANCED]: 40,
      [DifficultyLevel.EXPERT]: 60
    },
    [XPSourceType.PROJECT]: {
      [DifficultyLevel.BEGINNER]: 50,
      [DifficultyLevel.INTERMEDIATE]: 100,
      [DifficultyLevel.ADVANCED]: 200,
      [DifficultyLevel.EXPERT]: 350
    },
    [XPSourceType.ASSIGNMENT]: {
      [DifficultyLevel.BEGINNER]: 30,
      [DifficultyLevel.INTERMEDIATE]: 50,
      [DifficultyLevel.ADVANCED]: 80,
      [DifficultyLevel.EXPERT]: 120
    }
  },
  
  // Level progression - exponential growth
  LEVEL_BASE_XP: 100,
  LEVEL_MULTIPLIER: 1.5,
  
  // Multiplier values
  STREAK_MULTIPLIERS: {
    3: 1.1,   // 10% bonus for 3-day streak
    7: 1.2,   // 20% bonus for 7-day streak
    14: 1.3,  // 30% bonus for 14-day streak
    30: 1.5   // 50% bonus for 30-day streak
  },
  
  PERFECT_SCORE_MULTIPLIER: 1.25,
  SPEED_BONUS_MULTIPLIER: 1.15,
  FIRST_ATTEMPT_MULTIPLIER: 1.1,
  COMEBACK_MULTIPLIER: 1.2,
  
  // Validation limits
  MAX_XP_PER_HOUR: 500,
  MAX_XP_PER_DAY: 2000,
  
  // Streak settings
  STREAK_RESET_HOURS: 48,
  DAILY_LOGIN_XP: 5
} as const;

export type XPConstantsType = typeof XP_CONSTANTS;