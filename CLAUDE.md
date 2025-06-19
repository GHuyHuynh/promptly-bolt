# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production (TypeScript check + Vite build)
- `npm run lint` - Run ESLint with TypeScript support
- `npm run preview` - Preview production build locally

## High-Level Architecture

### Application Structure
This is a React/TypeScript SPA with two main modes:
1. **Public Landing Page** (`/`) - Marketing site with sections (Hero, Features, Curriculum, etc.)
2. **Authenticated App** (`/app/*`) - Protected dashboard and user features

### Authentication Flow
- **AuthProvider** wraps entire application providing global auth state via React Context
- **useAuth** custom hook contains all authentication business logic
- **ProtectedRoute** component handles route protection and redirects
- Authentication state persists across browser sessions via Firebase Auth
- Users are automatically created in Firestore on first sign-in

### Route Architecture
```
/ (public landing)
/auth (sign-in page, redirects if authenticated)
/app/* (protected routes):
  - /app/dashboard (main dashboard)
  - /app/profile (user profile management)
  - /app/courses, /app/community, etc. (placeholder routes)
```

### State Management Pattern
- **Global Auth State**: React Context + custom hook pattern
- **Component State**: Local useState for component-specific data
- **Server State**: Firebase Auth + Firestore with real-time listeners
- No external state management library (Redux, Zustand) - uses React Context

### Component Organization
- `auth/` - Authentication-related components (login, profile, protection)
- `dashboard/` - Main application dashboard
- `layout/` - Layout components (headers, footers, app shell)
- `sections/` - Landing page sections (hero, features, pricing, etc.)
- `ui/` - Reusable UI components (buttons, cards, etc.)

### Firebase Configuration
- Uses environment variables prefixed with `VITE_FIREBASE_*`
- Supports Firebase emulators in development (Auth: 9099, Firestore: 8080)
- Google OAuth configured with email/profile scopes and account selection prompt
- Analytics only enabled in production builds

### Key Files to Understand
- `src/contexts/AuthContext.tsx` - Global auth context setup
- `src/hooks/useAuth.ts` - Core authentication logic
- `src/components/auth/ProtectedRoute.tsx` - Route protection logic  
- `src/lib/firebase.ts` - Firebase configuration and initialization
- `src/App.tsx` - Main routing and app structure

### TypeScript Usage
- Full type safety with strict TypeScript configuration
- Custom types in `src/types/` directory
- Authentication types defined in `src/types/auth.ts`
- All components use proper TypeScript React types

### Styling System
- Tailwind CSS with PostCSS processing
- Custom Tailwind configuration in `tailwind.config.js`
- Utility classes throughout components
- No CSS modules or styled-components