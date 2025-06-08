import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { firebaseApi, User } from '@/services/firebaseApi';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
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
    try {
      await signOut(auth);
      setUserData(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  useEffect(() => {
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
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}