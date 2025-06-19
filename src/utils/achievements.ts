import { 
  Achievement, 
  Milestone, 
  AchievementType, 
  AchievementTier, 
  RequirementType,
  RewardType
} from '../types/xpSystem';

/**
 * Default Achievement and Milestone Configurations
 * 
 * This module provides pre-configured achievements and milestones
 * that can be used as a starting point for the curriculum platform.
 */

// ============================================================================
// ACHIEVEMENT DEFINITIONS
// ============================================================================

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  // PROGRESS ACHIEVEMENTS
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first lesson',
    type: AchievementType.PROGRESS,
    tier: AchievementTier.BRONZE,
    xpReward: 25,
    requirements: [
      {
        type: RequirementType.TASKS_COMPLETED,
        value: 1,
        description: 'Complete 1 lesson'
      }
    ],
    unlocked: false,
    progress: 0,
    icon: '🎯',
    badge: 'beginner'
  },
  
  {
    id: 'learning_momentum',
    name: 'Learning Momentum',
    description: 'Complete 10 lessons',
    type: AchievementType.PROGRESS,
    tier: AchievementTier.BRONZE,
    xpReward: 100,
    requirements: [
      {
        type: RequirementType.TASKS_COMPLETED,
        value: 10,
        description: 'Complete 10 lessons'
      }
    ],
    unlocked: false,
    progress: 0,
    icon: '📚',
    badge: 'learner'
  },
  
  {
    id: 'dedicated_student',
    name: 'Dedicated Student',
    description: 'Complete 50 lessons',
    type: AchievementType.PROGRESS,
    tier: AchievementTier.SILVER,
    xpReward: 500,
    requirements: [
      {
        type: RequirementType.TASKS_COMPLETED,
        value: 50,
        description: 'Complete 50 lessons'
      }
    ],
    unlocked: false,
    progress: 0,
    icon: '🎓',
    badge: 'student'
  },
  
  {
    id: 'knowledge_seeker',
    name: 'Knowledge Seeker',
    description: 'Complete 100 lessons',
    type: AchievementType.PROGRESS,
    tier: AchievementTier.GOLD,
    xpReward: 1000,
    requirements: [
      {
        type: RequirementType.TASKS_COMPLETED,
        value: 100,
        description: 'Complete 100 lessons'
      }
    ],
    unlocked: false,
    progress: 0,
    icon: '🔍',
    badge: 'seeker'
  },
  
  {
    id: 'master_learner',
    name: 'Master Learner',
    description: 'Complete 500 lessons',
    type: AchievementType.PROGRESS,
    tier: AchievementTier.PLATINUM,
    xpReward: 2500,
    requirements: [
      {
        type: RequirementType.TASKS_COMPLETED,
        value: 500,
        description: 'Complete 500 lessons'
      }
    ],
    unlocked: false,
    progress: 0,
    icon: '👑',
    badge: 'master'
  },

  // STREAK ACHIEVEMENTS
  {
    id: 'consistent_learner',
    name: 'Consistent Learner',
    description: 'Maintain a 3-day learning streak',
    type: AchievementType.STREAK,
    tier: AchievementTier.BRONZE,
    xpReward: 50,
    requirements: [
      {
        type: RequirementType.STREAK_DAYS,
        value: 3,
        description: 'Maintain a 3-day streak'
      }
    ],
    unlocked: false,
    progress: 0,
    icon: '🔥',
    badge: 'consistent'
  },
  
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    type: AchievementType.STREAK,
    tier: AchievementTier.SILVER,
    xpReward: 150,
    requirements: [
      {
        type: RequirementType.STREAK_DAYS,
        value: 7,
        description: 'Maintain a 7-day streak'
      }
    ],
    unlocked: false,
    progress: 0,
    icon: '🌟',
    badge: 'warrior'
  },
  
  {
    id: 'month_champion',
    name: 'Month Champion',
    description: 'Maintain a 30-day learning streak',
    type: AchievementType.STREAK,
    tier: AchievementTier.GOLD,
    xpReward: 500,
    requirements: [
      {
        type: RequirementType.STREAK_DAYS,
        value: 30,
        description: 'Maintain a 30-day streak'
      }
    ],
    unlocked: false,
    progress: 0,
    icon: '🏆',
    badge: 'champion'
  },

  // MASTERY ACHIEVEMENTS
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Achieve 10 perfect scores',
    type: AchievementType.MASTERY,
    tier: AchievementTier.SILVER,
    xpReward: 300,
    requirements: [
      {
        type: RequirementType.PERFECT_SCORES,
        value: 10,
        description: 'Achieve 10 perfect scores'
      }
    ],
    unlocked: false,
    progress: 0,
    icon: '💯',
    badge: 'perfectionist'
  },
  
  {
    id: 'flawless_execution',
    name: 'Flawless Execution',
    description: 'Achieve 50 perfect scores',
    type: AchievementType.MASTERY,
    tier: AchievementTier.GOLD,
    xpReward: 750,
    requirements: [
      {
        type: RequirementType.PERFECT_SCORES,
        value: 50,
        description: 'Achieve 50 perfect scores'
      }
    ],
    unlocked: false,
    progress: 0,
    icon: '✨',
    badge: 'flawless'
  },

  // MILESTONE ACHIEVEMENTS
  {
    id: 'rising_star',
    name: 'Rising Star',
    description: 'Reach level 5',
    type: AchievementType.MILESTONE,
    tier: AchievementTier.BRONZE,
    xpReward: 200,
    requirements: [
      {
        type: RequirementType.LEVEL_REACHED,
        value: 5,
        description: 'Reach level 5'
      }
    ],
    unlocked: false,
    progress: 0,
    icon: '⭐',
    badge: 'rising'
  },
  
  {
    id: 'accomplished_learner',
    name: 'Accomplished Learner',
    description: 'Reach level 10',
    type: AchievementType.MILESTONE,
    tier: AchievementTier.SILVER,
    xpReward: 500,
    requirements: [
      {
        type: RequirementType.LEVEL_REACHED,
        value: 10,
        description: 'Reach level 10'
      }
    ],
    unlocked: false,
    progress: 0,
    icon: '🎖️',
    badge: 'accomplished'
  },
  
  {
    id: 'expert_status',
    name: 'Expert Status',
    description: 'Reach level 25',
    type: AchievementType.MILESTONE,
    tier: AchievementTier.GOLD,
    xpReward: 1000,
    requirements: [
      {
        type: RequirementType.LEVEL_REACHED,
        value: 25,
        description: 'Reach level 25'
      }
    ],
    unlocked: false,
    progress: 0,
    icon: '🏅',
    badge: 'expert'
  },
  
  {
    id: 'legendary_mastery',
    name: 'Legendary Mastery',
    description: 'Reach level 50',
    type: AchievementType.MILESTONE,
    tier: AchievementTier.DIAMOND,
    xpReward: 2500,
    requirements: [
      {
        type: RequirementType.LEVEL_REACHED,
        value: 50,
        description: 'Reach level 50'
      }
    ],
    unlocked: false,
    progress: 0,
    icon: '💎',
    badge: 'legendary'
  },

  // XP ACHIEVEMENTS
  {
    id: 'point_collector',
    name: 'Point Collector',
    description: 'Earn 1,000 total XP',
    type: AchievementType.PROGRESS,
    tier: AchievementTier.BRONZE,
    xpReward: 100,
    requirements: [
      {
        type: RequirementType.TOTAL_XP,
        value: 1000,
        description: 'Earn 1,000 XP'
      }
    ],
    unlocked: false,
    progress: 0,
    icon: '💰',
    badge: 'collector'
  },
  
  {
    id: 'xp_accumulator',
    name: 'XP Accumulator',
    description: 'Earn 10,000 total XP',
    type: AchievementType.PROGRESS,
    tier: AchievementTier.SILVER,
    xpReward: 500,
    requirements: [
      {
        type: RequirementType.TOTAL_XP,
        value: 10000,
        description: 'Earn 10,000 XP'
      }
    ],
    unlocked: false,
    progress: 0,
    icon: '💎',
    badge: 'accumulator'
  },
  
  {
    id: 'xp_master',
    name: 'XP Master',
    description: 'Earn 100,000 total XP',
    type: AchievementType.PROGRESS,
    tier: AchievementTier.GOLD,
    xpReward: 2000,
    requirements: [
      {
        type: RequirementType.TOTAL_XP,
        value: 100000,
        description: 'Earn 100,000 XP'
      }
    ],
    unlocked: false,
    progress: 0,
    icon: '🏆',
    badge: 'xp_master'
  }
];

// ============================================================================
// MILESTONE DEFINITIONS
// ============================================================================

export const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: 'level_5_milestone',
    name: 'First Achievement',
    description: 'Unlock basic features and earn your first badge',
    level: 5,
    xpThreshold: 500,
    rewards: [
      {
        type: RewardType.FEATURE_UNLOCK,
        value: 'advanced_exercises',
        description: 'Access to advanced exercises'
      },
      {
        type: RewardType.BADGE,
        value: 'achiever',
        description: 'Achiever badge'
      }
    ],
    reached: false
  },
  
  {
    id: 'level_10_milestone',
    name: 'Solid Foundation',
    description: 'Unlock bonus content and get priority support',
    level: 10,
    xpThreshold: 1500,
    rewards: [
      {
        type: RewardType.FEATURE_UNLOCK,
        value: 'bonus_content',
        description: 'Access to bonus learning materials'
      },
      {
        type: RewardType.FEATURE_UNLOCK,
        value: 'priority_support',
        description: 'Priority customer support'
      },
      {
        type: RewardType.XP_BONUS,
        value: 200,
        description: 'Bonus XP reward'
      }
    ],
    reached: false
  },
  
  {
    id: 'level_15_milestone',
    name: 'Dedicated Learner',
    description: 'Access beta features and get XP multiplier',
    level: 15,
    xpThreshold: 3000,
    rewards: [
      {
        type: RewardType.FEATURE_UNLOCK,
        value: 'beta_features',
        description: 'Access to beta features'
      },
      {
        type: RewardType.MULTIPLIER,
        value: 1.1,
        description: '10% XP multiplier for 7 days'
      },
      {
        type: RewardType.TITLE,
        value: 'Dedicated Learner',
        description: 'Special profile title'
      }
    ],
    reached: false
  },
  
  {
    id: 'level_20_milestone',
    name: 'Advanced Practitioner',
    description: 'Unlock mentor program and advanced features',
    level: 20,
    xpThreshold: 6000,
    rewards: [
      {
        type: RewardType.FEATURE_UNLOCK,
        value: 'mentor_program',
        description: 'Eligibility for mentor program'
      },
      {
        type: RewardType.FEATURE_UNLOCK,
        value: 'advanced_analytics',
        description: 'Advanced learning analytics'
      },
      {
        type: RewardType.XP_BONUS,
        value: 500,
        description: 'Bonus XP reward'
      }
    ],
    reached: false
  },
  
  {
    id: 'level_30_milestone',
    name: 'Expert Status',
    description: 'Influence curriculum and get permanent bonuses',
    level: 30,
    xpThreshold: 12000,
    rewards: [
      {
        type: RewardType.FEATURE_UNLOCK,
        value: 'curriculum_voting',
        description: 'Vote on curriculum changes'
      },
      {
        type: RewardType.MULTIPLIER,
        value: 1.15,
        description: 'Permanent 15% XP multiplier'
      },
      {
        type: RewardType.TITLE,
        value: 'Curriculum Expert',
        description: 'Expert profile title'
      },
      {
        type: RewardType.BADGE,
        value: 'expert_gold',
        description: 'Gold expert badge'
      }
    ],
    reached: false
  },
  
  {
    id: 'level_50_milestone',
    name: 'Legendary Master',
    description: 'Ultimate recognition and exclusive perks',
    level: 50,
    xpThreshold: 50000,
    rewards: [
      {
        type: RewardType.FEATURE_UNLOCK,
        value: 'all_premium_features',
        description: 'Access to all premium features'
      },
      {
        type: RewardType.MULTIPLIER,
        value: 1.25,
        description: 'Permanent 25% XP multiplier'
      },
      {
        type: RewardType.TITLE,
        value: 'Legendary Master',
        description: 'Legendary profile title'
      },
      {
        type: RewardType.BADGE,
        value: 'legendary_diamond',
        description: 'Diamond legendary badge'
      },
      {
        type: RewardType.XP_BONUS,
        value: 5000,
        description: 'Massive bonus XP reward'
      }
    ],
    reached: false
  }
];

// ============================================================================
// UTILITY FUNCTIONS FOR ACHIEVEMENTS
// ============================================================================

/**
 * Get achievements by type
 */
export const getAchievementsByType = (type: AchievementType): Achievement[] => {
  return DEFAULT_ACHIEVEMENTS.filter(achievement => achievement.type === type);
};

/**
 * Get achievements by tier
 */
export const getAchievementsByTier = (tier: AchievementTier): Achievement[] => {
  return DEFAULT_ACHIEVEMENTS.filter(achievement => achievement.tier === tier);
};

/**
 * Get next milestone for a given level
 */
export const getNextMilestone = (currentLevel: number): Milestone | null => {
  const nextMilestone = DEFAULT_MILESTONES
    .filter(milestone => milestone.level > currentLevel && !milestone.reached)
    .sort((a, b) => a.level - b.level)[0];
    
  return nextMilestone || null;
};

/**
 * Get all milestones for a level range
 */
export const getMilestonesInRange = (minLevel: number, maxLevel: number): Milestone[] => {
  return DEFAULT_MILESTONES.filter(
    milestone => milestone.level >= minLevel && milestone.level <= maxLevel
  );
};

/**
 * Get achievement by ID
 */
export const getAchievementById = (id: string): Achievement | null => {
  return DEFAULT_ACHIEVEMENTS.find(achievement => achievement.id === id) || null;
};

/**
 * Get milestone by ID
 */
export const getMilestoneById = (id: string): Milestone | null => {
  return DEFAULT_MILESTONES.find(milestone => milestone.id === id) || null;
};

/**
 * Calculate total XP rewards from achievements
 */
export const calculateTotalAchievementXP = (achievements: Achievement[]): number => {
  return achievements
    .filter(achievement => achievement.unlocked)
    .reduce((total, achievement) => total + achievement.xpReward, 0);
};

/**
 * Get recommended next achievements for a user
 */
export const getRecommendedAchievements = (
  userAchievements: Achievement[],
  count: number = 3
): Achievement[] => {
  const unlockedIds = new Set(
    userAchievements.filter(a => a.unlocked).map(a => a.id)
  );
  
  const availableAchievements = DEFAULT_ACHIEVEMENTS
    .filter(achievement => !unlockedIds.has(achievement.id))
    .sort((a, b) => {
      // Sort by progress (descending) and then by XP reward (ascending)
      if (a.progress !== b.progress) {
        return b.progress - a.progress;
      }
      return a.xpReward - b.xpReward;
    });
    
  return availableAchievements.slice(0, count);
};

export default {
  DEFAULT_ACHIEVEMENTS,
  DEFAULT_MILESTONES,
  getAchievementsByType,
  getAchievementsByTier,
  getNextMilestone,
  getMilestonesInRange,
  getAchievementById,
  getMilestoneById,
  calculateTotalAchievementXP,
  getRecommendedAchievements
};