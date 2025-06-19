import React, { createContext, useContext, ReactNode } from 'react';
import { useXPSystem, useCourseEnrollment, useUserStats } from '../hooks/useCourse';
import { useOfflineSupport } from '../hooks/useCourseUtils';
import { XPSystemState, CourseEnrollmentState, UserStatsState } from '../types/course';

interface CourseContextType {
  // XP System
  userXP: XPSystemState['userXP'];
  recentTransactions: XPSystemState['recentTransactions'];
  xpLoading: boolean;
  addXPTransaction: ReturnType<typeof useXPSystem>['addXPTransaction'];
  updateStreak: ReturnType<typeof useXPSystem>['updateStreak'];
  calculateLevel: ReturnType<typeof useXPSystem>['calculateLevel'];
  
  // Enrollment
  enrollments: CourseEnrollmentState['enrollments'];
  enrollmentLoading: boolean;
  enrollInCourse: ReturnType<typeof useCourseEnrollment>['enrollInCourse'];
  hasAccessToCourse: ReturnType<typeof useCourseEnrollment>['hasAccessToCourse'];
  getEnrollment: ReturnType<typeof useCourseEnrollment>['getEnrollment'];
  
  // User Stats
  stats: UserStatsState['stats'];
  statsLoading: boolean;
  getUserRank: ReturnType<typeof useUserStats>['getUserRank'];
  
  // Offline Support
  isOnline: boolean;
  cacheData: ReturnType<typeof useOfflineSupport>['cacheData'];
  getCachedData: ReturnType<typeof useOfflineSupport>['getCachedData'];
  clearCache: ReturnType<typeof useOfflineSupport>['clearCache'];
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

interface CourseProviderProps {
  children: ReactNode;
}

export const CourseProvider: React.FC<CourseProviderProps> = ({ children }) => {
  const {
    userXP,
    recentTransactions,
    loading: xpLoading,
    addXPTransaction,
    updateStreak,
    calculateLevel,
  } = useXPSystem();

  const {
    enrollments,
    loading: enrollmentLoading,
    enrollInCourse,
    hasAccessToCourse,
    getEnrollment,
  } = useCourseEnrollment();

  const {
    stats,
    loading: statsLoading,
    getUserRank,
  } = useUserStats();

  const {
    isOnline,
    cacheData,
    getCachedData,
    clearCache,
  } = useOfflineSupport();

  const value: CourseContextType = {
    // XP System
    userXP,
    recentTransactions,
    xpLoading,
    addXPTransaction,
    updateStreak,
    calculateLevel,
    
    // Enrollment
    enrollments,
    enrollmentLoading,
    enrollInCourse,
    hasAccessToCourse,
    getEnrollment,
    
    // User Stats
    stats,
    statsLoading,
    getUserRank,
    
    // Offline Support
    isOnline,
    cacheData,
    getCachedData,
    clearCache,
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};

export const useCourseContext = (): CourseContextType => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourseContext must be used within a CourseProvider');
  }
  return context;
};

// Higher-order component for course access control
export const withCourseAccess = <P extends object>(
  Component: React.ComponentType<P>,
  requiredCourseId?: string
) => {
  return (props: P) => {
    const { hasAccessToCourse } = useCourseContext();
    
    if (requiredCourseId && !hasAccessToCourse(requiredCourseId)) {
      return (
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You need to enroll in this course to access this content.</p>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
};

// Hook for course context with null checking
export const useCourseContextSafe = () => {
  try {
    return useCourseContext();
  } catch {
    // Return null values if context is not available
    return {
      userXP: null,
      recentTransactions: [],
      xpLoading: false,
      addXPTransaction: async () => {},
      updateStreak: async () => {},
      calculateLevel: () => ({ currentLevel: 1, xpToNextLevel: 100 }),
      enrollments: [],
      enrollmentLoading: false,
      enrollInCourse: async () => '',
      hasAccessToCourse: () => false,
      getEnrollment: () => null,
      stats: null,
      statsLoading: false,
      getUserRank: async () => 0,
      isOnline: navigator.onLine,
      cacheData: () => {},
      getCachedData: () => null,
      clearCache: () => {},
    };
  }
};