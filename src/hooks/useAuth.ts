import { useState, useEffect, useCallback } from 'react';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  deleteUser,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { User, AuthState, mapFirebaseUser, AuthError } from '../types/auth';
import toast from 'react-hot-toast';

const INITIAL_STATE: AuthState = {
  user: null,
  loading: true,
  error: null,
  isAuthenticated: false,
};

export const useAuth = () => {
  const [state, setState] = useState<AuthState>(INITIAL_STATE);

  // Enhanced error handling
  const handleAuthError = useCallback((error: any): AuthError => {
    console.error('Auth Error:', error);
    
    const authError: AuthError = {
      code: error.code || 'unknown',
      message: 'An unexpected error occurred',
    };

    switch (error.code) {
      case 'auth/popup-closed-by-user':
        authError.message = 'Sign-in was cancelled';
        break;
      case 'auth/popup-blocked':
        authError.message = 'Pop-up was blocked by your browser';
        authError.details = 'Please allow pop-ups for this site and try again';
        break;
      case 'auth/cancelled-popup-request':
        authError.message = 'Sign-in was cancelled';
        break;
      case 'auth/network-request-failed':
        authError.message = 'Network error occurred';
        authError.details = 'Please check your internet connection';
        break;
      case 'auth/too-many-requests':
        authError.message = 'Too many failed attempts';
        authError.details = 'Please try again later';
        break;
      case 'auth/user-disabled':
        authError.message = 'This account has been disabled';
        break;
      case 'auth/requires-recent-login':
        authError.message = 'Please sign in again to continue';
        break;
      default:
        authError.message = error.message || 'Authentication failed';
    }

    return authError;
  }, []);

  // Create or update user document in Firestore
  const createUserDocument = useCallback(async (firebaseUser: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      
      const userData = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified,
        lastLoginAt: serverTimestamp(),
      };

      if (!userSnap.exists()) {
        // Create new user document
        await setDoc(userRef, {
          ...userData,
          createdAt: serverTimestamp(),
          preferences: {
            theme: 'system',
            notifications: {
              email: true,
              push: true,
              marketing: false,
            },
            privacy: {
              profileVisible: true,
              analyticsEnabled: true,
            },
          },
        });
      } else {
        // Update existing user document
        await updateDoc(userRef, userData);
      }

      // Fetch the complete user data including preferences
      const updatedUserSnap = await getDoc(userRef);
      return updatedUserSnap.data();
    } catch (error) {
      console.error('Error creating/updating user document:', error);
      throw error;
    }
  }, []);

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await signInWithPopup(auth, googleProvider);
      await createUserDocument(result.user);
      
      toast.success(`Welcome back, ${result.user.displayName || 'there'}!`);
    } catch (error) {
      const authError = handleAuthError(error);
      setState(prev => ({ ...prev, error: authError.message, loading: false }));
      toast.error(authError.message);
      throw authError;
    }
  }, [createUserDocument, handleAuthError]);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      await firebaseSignOut(auth);
      toast.success('Signed out successfully');
    } catch (error) {
      const authError = handleAuthError(error);
      setState(prev => ({ ...prev, error: authError.message, loading: false }));
      toast.error(authError.message);
      throw authError;
    }
  }, [handleAuthError]);

  // Update user profile
  const updateUserProfile = useCallback(async (updates: Partial<User>) => {
    if (!auth.currentUser) throw new Error('No authenticated user');

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Update Firebase Auth profile
      if (updates.displayName !== undefined || updates.photoURL !== undefined) {
        await updateProfile(auth.currentUser, {
          displayName: updates.displayName || auth.currentUser.displayName,
          photoURL: updates.photoURL || auth.currentUser.photoURL,
        });
      }

      // Update Firestore document
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      toast.success('Profile updated successfully');
    } catch (error) {
      const authError = handleAuthError(error);
      setState(prev => ({ ...prev, error: authError.message, loading: false }));
      toast.error(authError.message);
      throw authError;
    }
  }, [handleAuthError]);

  // Delete user account
  const deleteAccount = useCallback(async () => {
    if (!auth.currentUser) throw new Error('No authenticated user');

    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const userId = auth.currentUser.uid;
      
      // Delete user document from Firestore
      await deleteDoc(doc(db, 'users', userId));
      
      // Delete Firebase Auth user
      await deleteUser(auth.currentUser);
      
      toast.success('Account deleted successfully');
    } catch (error) {
      const authError = handleAuthError(error);
      setState(prev => ({ ...prev, error: authError.message, loading: false }));
      toast.error(authError.message);
      throw authError;
    }
  }, [handleAuthError]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!auth.currentUser) return;

    try {
      await auth.currentUser.reload();
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const user: User = {
          ...mapFirebaseUser(auth.currentUser),
          preferences: userData.preferences,
        };
        
        setState(prev => ({
          ...prev,
          user,
          isAuthenticated: true,
          loading: false,
        }));
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is signed in
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          
          let userData = userSnap.data();
          
          // If user document doesn't exist, create it
          if (!userSnap.exists()) {
            userData = await createUserDocument(firebaseUser);
          }
          
          const user: User = {
            ...mapFirebaseUser(firebaseUser),
            preferences: userData?.preferences,
          };
          
          setState({
            user,
            loading: false,
            error: null,
            isAuthenticated: true,
          });
        } else {
          // User is signed out
          setState({
            user: null,
            loading: false,
            error: null,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setState({
          user: null,
          loading: false,
          error: 'Failed to load user data',
          isAuthenticated: false,
        });
      }
    });

    return unsubscribe;
  }, [createUserDocument]);

  return {
    ...state,
    signInWithGoogle,
    signOut,
    updateUserProfile,
    deleteAccount,
    refreshUser,
  };
};