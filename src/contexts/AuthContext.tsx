import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { firebaseApi, User } from '@/services/firebaseApi';

// Development mode flag - set to true to bypass authentication
const DEV_MODE_BYPASS_AUTH = import.meta.env.VITE_DEV_BYPASS_AUTH === 'true';

// Mock user for development
const MOCK_DEV_USER: FirebaseUser = {
  uid: 'dev-user-123',
  email: 'dev@example.com',
  displayName: 'Dev User',
  photoURL: 'https://via.placeholder.com/150',
  phoneNumber: null,
  providerId: 'google.com',
  emailVerified: true,
  isAnonymous: false,
  metadata: {
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString(),
  },
  providerData: [],
  refreshToken: '',
  tenantId: null,
  delete: async () => {},
  getIdToken: async () => 'mock-token',
  getIdTokenResult: async () => ({
    token: 'mock-token',
    authTime: new Date().toISOString(),
    issuedAtTime: new Date().toISOString(),
    expirationTime: new Date(Date.now() + 3600000).toISOString(),
    signInProvider: 'google.com',
    signInSecondFactor: null,
    claims: {},
  }),
  reload: async () => {},
  toJSON: () => ({}),
} as FirebaseUser;

const MOCK_USER_DATA: User = {
  id: 'dev-user-123',
  name: 'Dev User',
  email: 'dev@example.com',
  photoURL: 'https://via.placeholder.com/150',
  totalScore: 1500,
  level: 8,
  currentStreak: 5,
  longestStreak: 12,
  lastActiveDate: new Date().toISOString().split('T')[0],
  createdAt: Date.now(),
};

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isDevMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = async () => {
    if (DEV_MODE_BYPASS_AUTH) {
      console.log('🚀 DEV MODE: Bypassing Google authentication');
      setCurrentUser(MOCK_DEV_USER);
      setUserData(MOCK_USER_DATA);
      return;
    }

    try {
      console.log('Attempting Google sign-in...');
      console.log('Auth object:', auth);
      console.log('Google provider:', googleProvider);
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      console.log('Google sign-in successful:', user.uid);
      
      // Create or update user in Firestore
      await firebaseApi.users.createOrUpdateUser({
        id: user.uid,
        name: user.displayName || 'Anonymous User',
        email: user.email || '',
        photoURL: user.photoURL || undefined,
      });
      
      // Load user data
      const userDoc = await firebaseApi.users.getUserById(user.uid);
      setUserData(userDoc);
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      
      // Provide more specific error information
      if (error.code === 'auth/configuration-not-found') {
        console.error('Firebase Auth configuration not found. Please check:');
        console.error('1. Google Sign-in is enabled in Firebase Console');
        console.error('2. Your domain is added to authorized domains');
        console.error('3. OAuth client is properly configured');
      }
      
      throw error;
    }
  };

  const logout = async () => {
    if (DEV_MODE_BYPASS_AUTH) {
      console.log('🚀 DEV MODE: Bypassing logout');
      setCurrentUser(null);
      setUserData(null);
      return;
    }

    try {
      await signOut(auth);
      setUserData(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (DEV_MODE_BYPASS_AUTH) {
      console.log('🚀 DEV MODE: Authentication bypass enabled');
      console.log('🚀 DEV MODE: Auto-signing in with mock user');
      setCurrentUser(MOCK_DEV_USER);
      setUserData(MOCK_USER_DATA);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Load user data from Firestore
        try {
          const userDoc = await firebaseApi.users.getUserById(user.uid);
          setUserData(userDoc);
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    signInWithGoogle,
    logout,
    isDevMode: DEV_MODE_BYPASS_AUTH,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}