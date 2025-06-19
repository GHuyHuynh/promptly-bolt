import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  serverTimestamp,
  increment,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  XPTransaction,
  UserXP,
  UserBadge,
} from '../types/course';
import {
  XPEvent,
  UserXPProfile,
  XPEventType,
  XPSourceType,
  XPCategory,
  DifficultyLevel,
  MultiplierType,
  XPReward,
  XPMultiplier,
  XP_CONSTANTS,
} from '../types/xpSystem';
import { XPSystem } from '../utils/xpSystem';
import toast from 'react-hot-toast';

export interface XPTransactionData {
  type: XPTransaction['type'];
  amount: number;
  source: XPTransaction['source'];
  metadata?: Record<string, any>;
}

export interface LevelUpResult {
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  newLevelTitle: string;
  bonusXP?: number;
  unlockedFeatures?: string[];
}

/**
 * XPService - Handles XP transactions, level tracking, and rewards
 * Provides methods for awarding XP, managing levels, and tracking user progression
 */
export class XPService {
  // XP Transaction Management
  static async awardXP(
    userId: string,
    transactionData: XPTransactionData,
    skipValidation = false
  ): Promise<{
    transactionId: string;
    levelUpResult: LevelUpResult;
    totalXP: number;
  }> {
    try {
      // Validate XP transaction if not skipped
      if (!skipValidation) {
        const isValid = await this.validateXPTransaction(userId, transactionData);
        if (!isValid) {
          throw new Error('XP transaction validation failed');
        }
      }

      const batch = writeBatch(db);
      const now = serverTimestamp();

      // Get current user XP
      const userXPRef = doc(db, 'userXP', userId);
      const userXPDoc = await getDoc(userXPRef);
      
      let currentXP = 0;
      let currentLevel = 1;
      
      if (userXPDoc.exists()) {
        const data = userXPDoc.data();
        currentXP = data.totalXP || 0;
        currentLevel = data.currentLevel || 1;
      }

      // Calculate multipliers
      const multipliers = await this.calculateMultipliers(userId, transactionData);
      const finalAmount = Math.floor(transactionData.amount * multipliers.reduce((acc, m) => acc * m.value, 1));
      const newTotalXP = currentXP + finalAmount;

      // Check for level up
      const levelUpResult = XPSystem.checkForLevelUp(currentXP, newTotalXP);
      const xpSummary = XPSystem.getXPSummary(newTotalXP);

      // Create XP transaction
      const transactionRef = doc(collection(db, 'xpTransactions'));
      const transaction: Partial<XPTransaction> = {
        userId,
        type: transactionData.type,
        amount: finalAmount,
        source: transactionData.source,
        metadata: {
          ...transactionData.metadata,
          originalAmount: transactionData.amount,
          multipliers: multipliers.map(m => ({ type: m.type, value: m.value, reason: m.reason })),
        },
        createdAt: now as Timestamp,
      };
      
      batch.set(transactionRef, transaction);

      // Update user XP
      const userXPData: Partial<UserXP> = {
        userId,
        totalXP: newTotalXP,
        currentLevel: xpSummary.level,
        xpToNextLevel: xpSummary.xpForNextLevel,
        lastActivityAt: now as Timestamp,
      };

      // Initialize or update based on transaction type
      if (transactionData.type === 'lesson_complete') {
        userXPData.totalLessonsCompleted = increment(1);
      } else if (transactionData.type === 'course_complete') {
        userXPData.totalCoursesCompleted = increment(1);
      }

      batch.set(userXPRef, userXPData, { merge: true });

      // Update user profile XP
      const userRef = doc(db, 'users', userId);
      batch.update(userRef, {
        'profile.totalXP': newTotalXP,
        'profile.currentLevel': xpSummary.level,
        'profile.xpToNextLevel': xpSummary.xpForNextLevel,
      });

      // Handle level up rewards
      if (levelUpResult.leveledUp) {
        const levelUpRewards = await this.processLevelUp(userId, levelUpResult.newLevel, batch);
        Object.assign(levelUpResult, levelUpRewards);
      }

      await batch.commit();

      // Show appropriate notifications
      if (levelUpResult.leveledUp) {
        toast.success(`🎉 Level Up! You're now ${levelUpResult.newLevelTitle} (Level ${levelUpResult.newLevel})`);
      } else {
        toast.success(`+${finalAmount} XP earned!`);
      }

      return {
        transactionId: transactionRef.id,
        levelUpResult,
        totalXP: newTotalXP,
      };
    } catch (error) {
      console.error('Error awarding XP:', error);
      toast.error('Failed to award XP');
      throw error;
    }
  }

  static async validateXPTransaction(
    userId: string,
    transactionData: XPTransactionData
  ): Promise<boolean> {
    try {
      // Check rate limits
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Get recent transactions for rate limiting
      const recentTransactionsQuery = query(
        collection(db, 'xpTransactions'),
        where('userId', '==', userId),
        where('createdAt', '>=', Timestamp.fromDate(oneHourAgo)),
        orderBy('createdAt', 'desc')
      );

      const recentTransactions = await getDocs(recentTransactionsQuery);
      
      let hourlyXP = 0;
      let dailyXP = 0;

      recentTransactions.docs.forEach(doc => {
        const data = doc.data();
        const createdAt = data.createdAt.toDate();
        
        if (createdAt >= oneHourAgo) {
          hourlyXP += data.amount;
        }
        if (createdAt >= oneDayAgo) {
          dailyXP += data.amount;
        }
      });

      // Check limits
      if (hourlyXP + transactionData.amount > XP_CONSTANTS.MAX_XP_PER_HOUR) {
        console.warn('Hourly XP limit exceeded');
        return false;
      }

      if (dailyXP + transactionData.amount > XP_CONSTANTS.MAX_XP_PER_DAY) {
        console.warn('Daily XP limit exceeded');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating XP transaction:', error);
      return false;
    }
  }

  static async calculateMultipliers(
    userId: string,
    transactionData: XPTransactionData
  ): Promise<XPMultiplier[]> {
    try {
      const multipliers: XPMultiplier[] = [];

      // Get user streak for streak bonus
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const currentStreak = userData.profile?.streak?.current || 0;
        
        if (currentStreak >= 3) {
          const streakMultiplier = XPSystem.getStreakMultiplier(currentStreak);
          if (streakMultiplier > 1.0) {
            multipliers.push({
              type: MultiplierType.STREAK_BONUS,
              value: streakMultiplier,
              reason: `${currentStreak}-day streak bonus`,
            });
          }
        }
      }

      // Perfect score bonus
      if (transactionData.metadata?.score === 100) {
        multipliers.push({
          type: MultiplierType.PERFECT_SCORE,
          value: XP_CONSTANTS.PERFECT_SCORE_MULTIPLIER,
          reason: 'Perfect score bonus',
        });
      }

      // First attempt bonus
      if (transactionData.metadata?.attempts === 1) {
        multipliers.push({
          type: MultiplierType.FIRST_ATTEMPT,
          value: XP_CONSTANTS.FIRST_ATTEMPT_MULTIPLIER,
          reason: 'First attempt bonus',
        });
      }

      // Speed bonus (if completed faster than estimated time)
      if (transactionData.metadata?.estimatedMinutes && transactionData.metadata?.actualMinutes) {
        const estimated = transactionData.metadata.estimatedMinutes;
        const actual = transactionData.metadata.actualMinutes;
        
        if (actual <= estimated * 0.75) { // Completed in 75% or less of estimated time
          multipliers.push({
            type: MultiplierType.SPEED_BONUS,
            value: XP_CONSTANTS.SPEED_BONUS_MULTIPLIER,
            reason: 'Speed completion bonus',
          });
        }
      }

      return multipliers;
    } catch (error) {
      console.error('Error calculating multipliers:', error);
      return [];
    }
  }

  static async processLevelUp(
    userId: string,
    newLevel: number,
    batch: any
  ): Promise<{ bonusXP?: number; unlockedFeatures?: string[] }> {
    try {
      const bonusXP = newLevel * 10; // 10 XP per level as bonus
      const unlockedFeatures: string[] = [];

      // Level-based feature unlocks
      if (newLevel === 5) {
        unlockedFeatures.push('Custom Profile Themes');
      }
      if (newLevel === 10) {
        unlockedFeatures.push('Course Creation Tools');
      }
      if (newLevel === 15) {
        unlockedFeatures.push('Advanced Analytics');
      }

      // Award level up bonus XP
      if (bonusXP > 0) {
        const levelUpTransactionRef = doc(collection(db, 'xpTransactions'));
        batch.set(levelUpTransactionRef, {
          userId,
          type: 'achievement',
          amount: bonusXP,
          source: {
            id: `level_${newLevel}`,
            type: 'achievement',
            title: `Level ${newLevel} Reached!`,
          },
          metadata: {
            levelReached: newLevel,
            bonusType: 'level_up',
          },
          createdAt: serverTimestamp(),
        });

        // Update total XP with bonus
        const userXPRef = doc(db, 'userXP', userId);
        batch.update(userXPRef, {
          totalXP: increment(bonusXP),
        });
      }

      return { bonusXP, unlockedFeatures };
    } catch (error) {
      console.error('Error processing level up:', error);
      return {};
    }
  }

  // Streak Management
  static async updateStreak(userId: string): Promise<{
    streakContinued: boolean;
    currentStreak: number;
    xpBonus: number;
  }> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const profile = userData.profile || {};
      const streak = profile.streak || { current: 0, longest: 0, lastActivity: null };
      
      const now = new Date();
      const today = now.toDateString();
      const lastActivity = streak.lastActivity?.toDate();
      const lastActivityDate = lastActivity ? lastActivity.toDateString() : null;
      
      // If already active today, no change needed
      if (lastActivityDate === today) {
        return {
          streakContinued: true,
          currentStreak: streak.current,
          xpBonus: 0,
        };
      }

      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayDate = yesterday.toDateString();

      let currentStreak = 1;
      let streakContinued = false;

      if (lastActivityDate === yesterdayDate) {
        // Continue streak
        currentStreak = (streak.current || 0) + 1;
        streakContinued = true;
      } else if (lastActivityDate && lastActivityDate < yesterdayDate) {
        // Streak broken, start new
        currentStreak = 1;
        streakContinued = false;
      }

      const longestStreak = Math.max(currentStreak, streak.longest || 0);

      // Calculate XP bonus
      let xpBonus = 0;
      if (currentStreak >= 3) {
        xpBonus = Math.min(currentStreak * 2, 50); // Max 50 XP bonus
      }

      const batch = writeBatch(db);

      // Update user profile
      batch.update(userRef, {
        'profile.streak.current': currentStreak,
        'profile.streak.longest': longestStreak,
        'profile.streak.lastActivity': serverTimestamp(),
      });

      // Award streak bonus XP if applicable
      if (xpBonus > 0) {
        await this.awardXP(userId, {
          type: 'daily_streak',
          amount: xpBonus,
          source: {
            id: 'daily_streak',
            type: 'achievement',
            title: `${currentStreak} Day Streak!`,
          },
          metadata: { streakDays: currentStreak },
        }, true); // Skip validation for streak bonuses
      }

      await batch.commit();

      return {
        streakContinued,
        currentStreak,
        xpBonus,
      };
    } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
    }
  }

  // Real-time Listeners
  static createXPListener(
    userId: string,
    callback: (userXP: UserXP | null) => void
  ): () => void {
    try {
      const userXPRef = doc(db, 'userXP', userId);
      
      return onSnapshot(userXPRef, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          const userXP: UserXP = {
            ...data,
            lastActivityAt: data.lastActivityAt?.toDate() || new Date(),
            badges: data.badges?.map((badge: any) => ({
              ...badge,
              earnedAt: badge.earnedAt?.toDate() || new Date(),
            })) || [],
          } as UserXP;
          callback(userXP);
        } else {
          callback(null);
        }
      }, (error) => {
        console.error('XP listener error:', error);
        callback(null);
      });
    } catch (error) {
      console.error('Error creating XP listener:', error);
      return () => {};
    }
  }

  static createTransactionListener(
    userId: string,
    callback: (transactions: XPTransaction[]) => void
  ): () => void {
    try {
      const transactionsQuery = query(
        collection(db, 'xpTransactions'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      return onSnapshot(transactionsQuery, (snapshot) => {
        const transactions: XPTransaction[] = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as XPTransaction[];
        callback(transactions);
      }, (error) => {
        console.error('Transaction listener error:', error);
        callback([]);
      });
    } catch (error) {
      console.error('Error creating transaction listener:', error);
      return () => {};
    }
  }

  // XP Analytics
  static async getXPAnalytics(userId: string, timeRange: 'week' | 'month' | 'all' = 'month') {
    try {
      const now = new Date();
      const startDate = new Date();
      
      switch (timeRange) {
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        default:
          startDate.setFullYear(2020); // Far back date for 'all'
      }

      const transactionsQuery = query(
        collection(db, 'xpTransactions'),
        where('userId', '==', userId),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        orderBy('createdAt', 'desc')
      );

      const transactions = await getDocs(transactionsQuery);
      
      let totalXP = 0;
      const xpByType: Record<string, number> = {};
      const xpByDay: Record<string, number> = {};
      const xpBySource: Record<string, number> = {};

      transactions.docs.forEach(doc => {
        const data = doc.data();
        const amount = data.amount || 0;
        const date = data.createdAt?.toDate().toDateString() || '';
        
        totalXP += amount;
        
        // By type
        xpByType[data.type] = (xpByType[data.type] || 0) + amount;
        
        // By day
        xpByDay[date] = (xpByDay[date] || 0) + amount;
        
        // By source type
        const sourceType = data.source?.type || 'unknown';
        xpBySource[sourceType] = (xpBySource[sourceType] || 0) + amount;
      });

      // Calculate averages
      const days = Object.keys(xpByDay).length;
      const averageXPPerDay = days > 0 ? totalXP / days : 0;

      return {
        totalXP,
        xpByType,
        xpByDay: Object.entries(xpByDay).map(([date, xp]) => ({ date, xp })),
        xpBySource,
        averageXPPerDay,
        transactionCount: transactions.size,
      };
    } catch (error) {
      console.error('Error getting XP analytics:', error);
      throw error;
    }
  }

  // Leaderboard Management
  static async updateLeaderboard(userId: string, newXP: number): Promise<void> {
    try {
      const leaderboardRef = doc(db, 'leaderboards', 'global');
      const leaderboardDoc = await getDoc(leaderboardRef);
      
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) return;
      
      const userData = userDoc.data();
      const userEntry = {
        userId,
        displayName: userData.displayName || 'Anonymous',
        photoURL: userData.photoURL || null,
        score: newXP,
        rank: 0, // Will be calculated
        change: 0, // Will be calculated
      };

      let entries: any[] = [];
      if (leaderboardDoc.exists()) {
        entries = leaderboardDoc.data().entries || [];
      }

      // Update or add user entry
      const existingIndex = entries.findIndex(entry => entry.userId === userId);
      if (existingIndex >= 0) {
        entries[existingIndex] = { ...entries[existingIndex], ...userEntry };
      } else {
        entries.push(userEntry);
      }

      // Sort by score and update ranks
      entries.sort((a, b) => b.score - a.score);
      entries.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      // Keep top 100 only
      entries = entries.slice(0, 100);

      await setDoc(leaderboardRef, {
        type: 'global',
        entries,
        metadata: {
          updatedAt: serverTimestamp(),
        },
      });
    } catch (error) {
      console.error('Error updating leaderboard:', error);
      // Don't throw - leaderboard updates shouldn't fail XP awards
    }
  }

  // XP Recovery and Migration
  static async recalculateUserXP(userId: string): Promise<void> {
    try {
      // Get all XP transactions for user
      const transactionsQuery = query(
        collection(db, 'xpTransactions'),
        where('userId', '==', userId),
        orderBy('createdAt', 'asc')
      );

      const transactions = await getDocs(transactionsQuery);
      
      let totalXP = 0;
      let totalLessonsCompleted = 0;
      let totalCoursesCompleted = 0;

      transactions.docs.forEach(doc => {
        const data = doc.data();
        totalXP += data.amount || 0;
        
        if (data.type === 'lesson_complete') {
          totalLessonsCompleted++;
        } else if (data.type === 'course_complete') {
          totalCoursesCompleted++;
        }
      });

      const xpSummary = XPSystem.getXPSummary(totalXP);

      // Update user XP document
      const userXPRef = doc(db, 'userXP', userId);
      await setDoc(userXPRef, {
        userId,
        totalXP,
        currentLevel: xpSummary.level,
        xpToNextLevel: xpSummary.xpForNextLevel,
        totalLessonsCompleted,
        totalCoursesCompleted,
        lastActivityAt: serverTimestamp(),
        achievements: [],
        badges: [],
      });

      // Update user profile
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'profile.totalXP': totalXP,
        'profile.currentLevel': xpSummary.level,
        'profile.xpToNextLevel': xpSummary.xpForNextLevel,
      });

      console.log(`Recalculated XP for user ${userId}: ${totalXP} XP, Level ${xpSummary.level}`);
    } catch (error) {
      console.error('Error recalculating user XP:', error);
      throw error;
    }
  }
}