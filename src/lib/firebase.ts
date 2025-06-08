import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Debug logging to check if environment variables are loaded
console.log('Firebase Config Debug:', {
  apiKey: firebaseConfig.apiKey ? '✓ Loaded' : '✗ Missing',
  authDomain: firebaseConfig.authDomain ? '✓ Loaded' : '✗ Missing',
  projectId: firebaseConfig.projectId ? '✓ Loaded' : '✗ Missing',
  storageBucket: firebaseConfig.storageBucket ? '✓ Loaded' : '✗ Missing',
  messagingSenderId: firebaseConfig.messagingSenderId ? '✓ Loaded' : '✗ Missing',
  appId: firebaseConfig.appId ? '✓ Loaded' : '✗ Missing',
  measurementId: firebaseConfig.measurementId ? '✓ Loaded' : '✗ Missing'
});

// Validate required configuration
const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingFields = requiredFields.filter(field => !firebaseConfig[field as keyof typeof firebaseConfig]);

if (missingFields.length > 0) {
  console.error('Missing required Firebase configuration fields:', missingFields);
  throw new Error(`Missing Firebase configuration: ${missingFields.join(', ')}`);
}

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('Firebase app initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase app:', error);
  throw error;
}

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Analytics only if measurementId is available
export const analytics = firebaseConfig.measurementId ? getAnalytics(app) : null;

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Add scopes for Google Auth
googleProvider.addScope('email');
googleProvider.addScope('profile');

export default app;

// Test function to verify Firebase Auth configuration
export const testFirebaseConfig = async () => {
  try {
    console.log('Testing Firebase Auth configuration...');
    
    // Try to get the current auth state
    const currentUser = auth.currentUser;
    console.log('Current user:', currentUser);
    
    // Test if we can access auth methods
    console.log('Auth methods available:', {
      signInWithPopup: typeof signInWithPopup,
      onAuthStateChanged: typeof onAuthStateChanged,
    });
    
    console.log('Firebase Auth test completed successfully');
    return true;
  } catch (error) {
    console.error('Firebase Auth test failed:', error);
    return false;
  }
};