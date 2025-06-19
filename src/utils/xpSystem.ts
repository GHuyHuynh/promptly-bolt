/**
 * XP and Level Progression System
 * Handles experience points calculation and level progression
 */

export class XPSystem {
  // XP required for each level (exponential growth)
  static getXPForLevel(level: number): number {
    if (level <= 1) return 0;
    return Math.floor(100 * Math.pow(1.5, level - 2));
  }

  // Total XP required to reach a specific level
  static getTotalXPForLevel(level: number): number {
    if (level <= 1) return 0;
    let total = 0;
    for (let i = 2; i <= level; i++) {
      total += this.getXPForLevel(i);
    }
    return total;
  }

  // Get current level from total XP
  static getLevelFromXP(totalXP: number): number {
    if (totalXP <= 0) return 1;
    
    let level = 1;
    let xpUsed = 0;
    
    while (xpUsed + this.getXPForLevel(level + 1) <= totalXP) {
      xpUsed += this.getXPForLevel(level + 1);
      level++;
    }
    
    return level;
  }

  // Get XP needed to reach next level
  static getXPToNextLevel(totalXP: number): number {
    const currentLevel = this.getLevelFromXP(totalXP);
    const nextLevel = currentLevel + 1;
    const totalXPForNextLevel = this.getTotalXPForLevel(nextLevel);
    
    return totalXPForNextLevel - totalXP;
  }

  // Get XP progress within current level (0-1)
  static getLevelProgress(totalXP: number): number {
    const currentLevel = this.getLevelFromXP(totalXP);
    const totalXPForCurrentLevel = this.getTotalXPForLevel(currentLevel);
    const totalXPForNextLevel = this.getTotalXPForLevel(currentLevel + 1);
    
    if (totalXPForNextLevel === totalXPForCurrentLevel) return 1;
    
    const progressXP = totalXP - totalXPForCurrentLevel;
    const levelRangeXP = totalXPForNextLevel - totalXPForCurrentLevel;
    
    return Math.min(progressXP / levelRangeXP, 1);
  }

  // Calculate XP rewards based on task completion
  static calculateTaskXP(
    taskType: string,
    difficulty: 'beginner' | 'intermediate' | 'advanced',
    score: number,
    estimatedMinutes: number
  ): number {
    // Base XP by task type
    const baseXP: Record<string, number> = {
      reading: 10,
      quiz: 25,
      coding: 50,
      project: 100,
      discussion: 15,
      reflection: 20
    };

    // Difficulty multipliers
    const difficultyMultiplier = {
      beginner: 1.0,
      intermediate: 1.5,
      advanced: 2.0
    };

    // Time-based bonus (1 XP per 5 minutes)
    const timeBonus = Math.floor(estimatedMinutes / 5);

    // Score multiplier (0.5 to 1.5 based on 0-100 score)
    const scoreMultiplier = Math.max(0.5, Math.min(1.5, score / 100 + 0.5));

    const finalXP = Math.floor(
      (baseXP[taskType] || 10) * 
      difficultyMultiplier[difficulty] * 
      scoreMultiplier + 
      timeBonus
    );

    return Math.max(1, finalXP); // Minimum 1 XP
  }

  // Calculate streak bonuses
  static getStreakMultiplier(streakDays: number): number {
    if (streakDays < 3) return 1.0;
    if (streakDays < 7) return 1.1;
    if (streakDays < 14) return 1.25;
    if (streakDays < 30) return 1.5;
    return 2.0; // 30+ day streak
  }

  // Get level title/name
  static getLevelTitle(level: number): string {
    const titles = [
      'Novice',        // 1
      'Learner',       // 2
      'Student',       // 3
      'Apprentice',    // 4
      'Practitioner',  // 5
      'Scholar',       // 6
      'Expert',        // 7
      'Specialist',    // 8
      'Master',        // 9
      'Grandmaster',   // 10
      'Sage',          // 11
      'Guru',          // 12
      'Legend'         // 13+
    ];
    
    return titles[Math.min(level - 1, titles.length - 1)] || 'Legend';
  }

  // Check if user should level up and return level up info
  static checkForLevelUp(oldXP: number, newXP: number): {
    leveledUp: boolean;
    oldLevel: number;
    newLevel: number;
    newLevelTitle: string;
  } {
    const oldLevel = this.getLevelFromXP(oldXP);
    const newLevel = this.getLevelFromXP(newXP);
    
    return {
      leveledUp: newLevel > oldLevel,
      oldLevel,
      newLevel,
      newLevelTitle: this.getLevelTitle(newLevel)
    };
  }

  // Generate XP summary for display
  static getXPSummary(totalXP: number): {
    level: number;
    levelTitle: string;
    xpInCurrentLevel: number;
    xpForNextLevel: number;
    progressToNextLevel: number;
    totalXPForNextLevel: number;
  } {
    const level = this.getLevelFromXP(totalXP);
    const levelTitle = this.getLevelTitle(level);
    const totalXPForCurrentLevel = this.getTotalXPForLevel(level);
    const totalXPForNextLevel = this.getTotalXPForLevel(level + 1);
    const xpInCurrentLevel = totalXP - totalXPForCurrentLevel;
    const xpForNextLevel = totalXPForNextLevel - totalXP;
    const progressToNextLevel = this.getLevelProgress(totalXP);

    return {
      level,
      levelTitle,
      xpInCurrentLevel,
      xpForNextLevel,
      progressToNextLevel,
      totalXPForNextLevel
    };
  }
}