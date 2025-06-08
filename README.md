# Promptly - Gamified AI Learning Platform

**Promptly** is a gamified learning platform designed to teach AI and prompt engineering skills through interactive lessons, challenges, and achievements. Think "Duolingo for AI" - making AI education accessible, engaging, and effective through game mechanics.

## 🎯 Project Overview

Promptly transforms AI education by combining:
- **Interactive Learning**: Hands-on prompt engineering exercises
- **Gamification**: XP, levels, streaks, and achievements
- **Progress Tracking**: Personalized learning paths and analytics
- **Community Features**: Leaderboards and social learning

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Radix UI components
- **Backend**: Firebase (Firestore + Authentication)
- **Routing**: React Router v6
- **State Management**: React Context API
- **Deployment**: Netlify

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, cards, etc.)
│   ├── home/           # Landing page components
│   ├── learning/       # Learning-specific components
│   └── gamification/   # Game mechanics components
├── pages/              # Route components
│   ├── home.tsx        # Landing page
│   ├── dashboard.tsx   # User dashboard
│   ├── learn.tsx       # Learning interface
│   ├── prompt-learning.tsx # Advanced prompt exercises
│   ├── leaderboard.tsx # Community rankings
│   └── sign-in.tsx     # Authentication
├── services/           # External API integrations
│   └── firebaseApi.ts  # Firebase service layer
├── contexts/           # React Context providers
│   └── AuthContext.tsx # Authentication state
├── types/              # TypeScript type definitions
│   ├── user.ts         # User-related types
│   ├── lesson.ts       # Learning content types
│   ├── gamification.ts # Game mechanics types
│   └── api.ts          # API response types
├── lib/                # Utility functions and configs
│   ├── firebase.ts     # Firebase configuration
│   └── utils.ts        # Helper functions
├── hooks/              # Custom React hooks
└── data/               # Static data and configurations
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17.0 or higher
- npm or yarn
- Firebase project with Firestore and Authentication enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd promptly-bolt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🎮 Core Features

### Learning System
- **Interactive Lessons**: Step-by-step prompt engineering tutorials
- **Practice Exercises**: Real-world prompt writing challenges
- **Instant Feedback**: AI-powered evaluation and suggestions
- **Progressive Difficulty**: Beginner to advanced skill levels

### Gamification
- **XP System**: Earn experience points for completed lessons
- **Level Progression**: Unlock new content as you advance
- **Streak Tracking**: Daily learning streaks with rewards
- **Achievements**: Badges for milestones and special accomplishments
- **Leaderboards**: Community rankings and friendly competition

### User Management
- **Google Authentication**: Secure sign-in with Google accounts
- **Progress Tracking**: Detailed learning analytics and history
- **Personalized Dashboard**: Custom learning recommendations
- **Profile Management**: User stats, achievements, and preferences

## 🔧 Key Components

### Authentication Flow
- `AuthContext.tsx`: Manages user authentication state
- `ProtectedRoute.tsx`: Route protection for authenticated users
- Firebase Auth integration with Google provider

### Learning Engine
- `learn.tsx`: Main learning interface with interactive lessons
- `prompt-learning.tsx`: Advanced prompt engineering exercises
- Automated scoring and feedback system
- Progress tracking and XP calculation

### Data Layer
- `firebaseApi.ts`: Comprehensive Firebase service layer
- Firestore collections: users, modules, lessons, progress, attempts
- Real-time data synchronization
- Offline capability support

### UI Components
- Radix UI primitives for accessibility
- Custom themed components with Tailwind CSS
- Responsive design for mobile and desktop
- Dark/light theme support

## 📊 Data Models

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  totalScore: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
}
```

### Lesson
```typescript
interface Lesson {
  id: string;
  title: string;
  moduleId: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  xpReward: number;
  content: {
    introduction: string;
    sections: Array<{
      title: string;
      content: string;
      examples?: string[];
    }>;
  };
}
```

### Progress
```typescript
interface Progress {
  userId: string;
  lessonId: string;
  completed: boolean;
  score: number;
  attempts: number;
  completedAt: Timestamp;
}
```

## 🛠️ Development Guidelines

### Code Organization
- Use TypeScript for all new code
- Follow React functional component patterns
- Implement proper error boundaries
- Use custom hooks for reusable logic

### State Management
- Context API for global state (auth, theme)
- Local state for component-specific data
- Firebase real-time listeners for live data

### Styling
- Tailwind CSS for utility-first styling
- CSS variables for theme customization
- Responsive design principles
- Accessibility-first component design

### Testing Strategy
- Component testing with React Testing Library
- Firebase emulator for backend testing
- E2E testing for critical user flows
- Performance monitoring and optimization

## 🚀 Deployment

### Netlify Deployment
The project is configured for Netlify deployment:
- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect rules configured in `netlify.toml`

### Environment Variables
Set the following in your Netlify dashboard:
- All Firebase configuration variables
- Any additional API keys or secrets

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with proper TypeScript types
3. Test locally with Firebase emulator
4. Submit pull request with detailed description

### Code Standards
- ESLint configuration enforced
- Prettier for code formatting
- Conventional commit messages
- Component documentation with JSDoc

## 📈 Future Enhancements

### Planned Features
- **AI Integration**: GPT-4 powered lesson generation
- **Community Features**: User-generated content and sharing
- **Advanced Analytics**: Learning pattern analysis
- **Mobile App**: React Native companion app
- **Certification System**: Skill verification and badges

### Technical Improvements
- **Performance**: Code splitting and lazy loading
- **Offline Support**: PWA capabilities
- **Real-time Features**: Live collaboration and chat
- **Internationalization**: Multi-language support

## 🐛 Troubleshooting

### Common Issues
1. **Firebase Connection**: Verify environment variables are set correctly
2. **Build Errors**: Check TypeScript types and imports
3. **Authentication**: Ensure Firebase Auth is properly configured
4. **Styling**: Verify Tailwind CSS classes and theme configuration

### Debug Mode
Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'promptly:*');
```

## 📄 License

This project is private and proprietary. All rights reserved.

---

**For LLMs**: This codebase implements a gamified learning platform with React/TypeScript frontend and Firebase backend. Key areas to focus on when making changes:
- Authentication flows in `AuthContext.tsx`
- Learning logic in `pages/learn.tsx` and `pages/prompt-learning.tsx`
- Firebase integration in `services/firebaseApi.ts`
- UI components in `components/` directory
- Type definitions in `types/` directory

The application follows modern React patterns with functional components, hooks, and context for state management. All user interactions are tracked for gamification purposes, and the Firebase backend handles real-time data synchronization.
