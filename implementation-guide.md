# Curriculum System Implementation Guide

This guide provides step-by-step instructions for implementing the comprehensive curriculum system in your existing React/Firebase application.

## Overview

The curriculum system extends your existing authentication system with:
- Course enrollment and progress tracking
- XP-based progression system with levels
- Task completion with multiple types (reading, quiz, coding, projects)
- Real-time progress updates
- Achievement system
- Dashboard integration with live data

## Files Created

### Core Schema and Types
- `/firestore-schema.md` - Complete Firestore database schema
- `/src/types/curriculum.ts` - TypeScript interfaces for all curriculum entities
- `/src/types/auth.ts` - Enhanced with curriculum profile fields

### Utility Functions
- `/src/utils/xpSystem.ts` - XP calculation and level progression logic
- `/src/services/courseService.ts` - Firestore operations for courses and progress

### React Hooks
- `/src/hooks/useCurriculum.ts` - Custom hooks for curriculum data management

### Examples
- `/src/examples/enhanced-dashboard-integration.tsx` - Updated dashboard component

## Implementation Steps

### Step 1: Update Existing User System

1. **Update User Interface**: The `User` interface in `/src/types/auth.ts` has been enhanced with curriculum fields. Update your existing user documents to include the new profile structure.

2. **Migrate Existing Users**: Run a Firebase Function or script to add default curriculum profile data to existing users:

```typescript
// Firebase Function to migrate existing users
const migrateuserProfiles = async () => {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  
  const batch = writeBatch(db);
  
  snapshot.docs.forEach(doc => {
    const userData = doc.data();
    if (!userData.profile) {
      batch.update(doc.ref, {
        profile: {
          totalXP: 0,
          currentLevel: 1,
          xpToNextLevel: 100,
          streak: {
            current: 0,
            longest: 0,
            lastActivity: serverTimestamp()
          },
          stats: {
            coursesCompleted: 0,
            certificatesEarned: 0,
            hoursLearned: 0,
            tasksCompleted: 0
          }
        }
      });
    }
  });
  
  await batch.commit();
};
```

### Step 2: Set Up Firestore Security Rules

Add the security rules from `/firestore-schema.md` to your Firestore console:

1. Go to Firestore Console → Rules
2. Replace or merge with the provided security rules
3. Publish the rules

### Step 3: Create Initial Course Content

Use the Firebase Admin SDK or Firestore console to create your first course:

```typescript
// Example: Create a sample course
const createSampleCourse = async () => {
  const courseData: Course = {
    id: 'intro-to-ai',
    title: 'Introduction to Artificial Intelligence',
    description: 'Learn the fundamentals of AI and machine learning...',
    shortDescription: 'AI fundamentals for beginners',
    imageUrl: 'https://example.com/course-image.jpg',
    difficulty: 'beginner',
    category: 'AI/ML',
    tags: ['artificial-intelligence', 'machine-learning', 'beginner'],
    content: {
      estimatedHours: 10,
      lessonCount: 5,
      taskCount: 20,
      prerequisites: []
    },
    progression: {
      totalXP: 500,
      passingScore: 70,
      certificateEligible: true
    },
    metadata: {
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: 'admin',
      version: '1.0.0',
      isPublished: true,
      publishedAt: serverTimestamp()
    },
    settings: {
      allowRetakes: true,
      showProgress: true,
      randomizeQuestions: false,
      timeLimit: 60
    }
  };

  await setDoc(doc(db, 'courses', courseData.id), courseData);
};
```

### Step 4: Update Dashboard Component

Replace your existing Dashboard component with the enhanced version:

1. Copy the content from `/src/examples/enhanced-dashboard-integration.tsx`
2. Rename it to `Dashboard.tsx` 
3. Update imports as needed
4. Test the integration

### Step 5: Create Course Pages

Create new components for course interaction:

```typescript
// src/components/courses/CoursePage.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useCourseEnrollment } from '../../hooks/useCurriculum';
import { CourseService } from '../../services/courseService';

export const CoursePage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { enrollment, loading, enroll, isEnrolled } = useCourseEnrollment(courseId!);
  
  // Implementation here...
};
```

### Step 6: Add Firestore Indexes

Create composite indexes in Firestore console for optimal query performance:

1. Go to Firestore Console → Indexes
2. Add these composite indexes:

```
Collection: user_enrollments
Fields: userId (Ascending), enrollment.status (Ascending)

Collection: user_progress  
Fields: userId (Ascending), progress.lastAccessedAt (Descending)

Collection: user_task_completions
Fields: userId (Ascending), courseId (Ascending), completion.status (Ascending)

Collection: courses
Fields: metadata.isPublished (Ascending), category (Ascending), difficulty (Ascending)
```

### Step 7: Test the System

1. **User Enrollment**: Test course enrollment flow
2. **Progress Tracking**: Complete tasks and verify XP/progress updates
3. **Dashboard**: Ensure real-time data updates
4. **Level System**: Test XP accumulation and level progression

## Key Integration Points

### With Existing Auth System

The curriculum system extends your existing user management without breaking changes:

- Existing user data remains intact
- New curriculum fields are optional
- Authentication flow unchanged
- User preferences enhanced with learning settings

### Real-time Updates

The system uses Firestore's real-time listeners for:
- Progress tracking during lessons
- XP updates on task completion  
- Dashboard data synchronization
- Achievement notifications

### XP and Level System

The XP system is designed to be:
- **Scalable**: Exponential level requirements prevent runaway progression
- **Flexible**: Different task types have different XP values
- **Engaging**: Streak bonuses encourage daily learning

## Performance Considerations

### Efficient Queries
- Use composite indexes for complex queries
- Limit real-time listeners to essential data
- Implement pagination for course lists

### Data Structure
- Denormalized data for quick dashboard loading
- Atomic operations for progress updates
- Batch writes for multiple document updates

### Caching Strategy
- Use React Query or SWR for client-side caching
- Cache course content that doesn't change frequently
- Implement offline support for better UX

## Next Steps

### Phase 1: Basic Implementation
1. Set up core schema and security rules
2. Migrate existing users
3. Create sample course content
4. Update dashboard with real data

### Phase 2: Enhanced Features
1. Add achievement system
2. Implement leaderboards
3. Create course authoring tools
4. Add social features

### Phase 3: Advanced Features
1. Add AI-powered recommendations
2. Implement adaptive learning paths
3. Create mobile app integration
4. Add analytics and reporting

## Troubleshooting

### Common Issues

**XP not updating**: Check Firestore rules and ensure proper batch operations

**Real-time listeners not working**: Verify Firestore security rules allow read access

**Course enrollment failing**: Check user authentication and course existence

**Dashboard loading slowly**: Implement proper indexes and consider data pagination

### Debug Tools

Use these utilities for debugging:

```typescript
// Debug XP calculations
console.log(XPSystem.getXPSummary(totalXP));

// Debug enrollment status
console.log(await CourseService.getUserEnrollment(userId, courseId));

// Debug progress tracking
console.log(await CourseService.getDashboardData(userId));
```

## Support

For implementation questions or issues:
1. Check the Firestore console for rule errors
2. Review browser console for JavaScript errors  
3. Test with sample data before production deployment
4. Use Firestore emulator for local development

This curriculum system provides a solid foundation for online learning that can scale with your application's growth while maintaining performance and user experience.