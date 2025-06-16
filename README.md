# Promptly - AI Learning Platform

A modern, comprehensive AI learning platform built with React, TypeScript, and Firebase.

## Features

### 🔐 Advanced Authentication
- **Google OAuth Integration**: Secure sign-in with Google accounts
- **Persistent Auth State**: Maintains user session across browser refreshes
- **Protected Routes**: Automatic redirection based on authentication status
- **Profile Management**: Complete user profile with preferences and settings
- **Account Security**: Account deletion and data management features

### 🎨 Modern UI/UX
- **Minimal Design**: Clean, distraction-free interface
- **Responsive Layout**: Optimized for all device sizes
- **Smooth Animations**: Subtle micro-interactions and transitions
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Skeleton screens and loading indicators

### 🚀 Technical Excellence
- **TypeScript**: Full type safety throughout the application
- **React 18**: Latest React features with functional components and hooks
- **Firebase v10**: Modern Firebase SDK with optimal bundle size
- **Tailwind CSS**: Utility-first styling with custom design system
- **React Router**: Client-side routing with protected routes
- **Error Handling**: Comprehensive error boundaries and user feedback

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Authentication and Firestore enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd promptly-landing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication with Google provider
   - Enable Firestore Database
   - Copy your Firebase config

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your Firebase configuration values in `.env`

5. **Start the development server**
   ```bash
   npm run dev
   ```

### Firebase Setup

#### Authentication
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable Google provider
3. Add your domain to authorized domains

#### Firestore Database
1. Go to Firebase Console → Firestore Database
2. Create database in test mode (or production with proper rules)
3. The app will automatically create user documents

#### Security Rules (Firestore)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Architecture

### Project Structure
```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard and app components
│   ├── layout/         # Layout components
│   ├── sections/       # Landing page sections
│   └── ui/             # Reusable UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Firebase and utility configurations
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

### Key Components

#### Authentication System
- **AuthProvider**: Global authentication context
- **useAuth**: Custom hook for authentication logic
- **ProtectedRoute**: Route protection component
- **AuthButton**: Reusable authentication button
- **UserProfile**: Complete profile management

#### State Management
- **React Context**: Global auth state management
- **Custom Hooks**: Encapsulated business logic
- **Local State**: Component-specific state management

#### Error Handling
- **Comprehensive Error Types**: Typed error handling
- **User-Friendly Messages**: Clear error communication
- **Toast Notifications**: Real-time feedback
- **Graceful Degradation**: Fallback UI states

## Features Deep Dive

### Authentication Flow
1. **Sign In**: Google OAuth popup with error handling
2. **User Creation**: Automatic Firestore document creation
3. **Session Persistence**: Maintains auth state across sessions
4. **Profile Sync**: Syncs Firebase Auth with Firestore data
5. **Sign Out**: Clean session termination

### User Profile Management
- **Profile Editing**: In-line editing with validation
- **Preferences**: Theme, notifications, and privacy settings
- **Account Security**: Account deletion with confirmation
- **Data Sync**: Real-time sync between Auth and Firestore

### Dashboard Features
- **Learning Progress**: Visual progress tracking
- **Course Management**: Current and completed courses
- **Achievements**: Gamification elements
- **Quick Actions**: Easy navigation to key features

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify
1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Environment Variables (Production)
Make sure to set all Firebase configuration variables in your deployment platform.

## Security Considerations

### Firebase Security
- **Authentication Rules**: Only authenticated users can access protected data
- **Firestore Rules**: Users can only access their own data
- **API Key Security**: Client-side API keys are safe for public use
- **Environment Variables**: Sensitive config stored securely

### Application Security
- **Input Validation**: All user inputs are validated
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: Firebase handles CSRF protection
- **Secure Headers**: Proper security headers in deployment

## Performance Optimizations

### Bundle Optimization
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Asset Optimization**: Optimized images and fonts

### Runtime Performance
- **React.memo**: Prevent unnecessary re-renders
- **useMemo/useCallback**: Expensive operation caching
- **Efficient Queries**: Optimized Firestore queries
- **Loading States**: Perceived performance improvements

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@promptly.ai or join our Discord community.