import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

// User profile interface
export interface UserProfile {
  uid: string;
  email: string | null;
  kidsNames: string[];
  surveyResults: Record<string, any>;
  createdAt: string;
  provider?: string;
}

// Auth context interface
interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, kidsNames?: string[]) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  getFirebaseErrorMessage: (error: any) => string;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile from Firestore
  const loadUserProfile = async (user: User): Promise<UserProfile | null> => {
    try {
      const userDoc = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDoc);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          uid: user.uid,
          email: user.email,
          kidsNames: data.kidsNames || [],
          surveyResults: data.surveyResults || {},
          createdAt: data.createdAt || new Date().toISOString(),
          provider: data.provider
        };
      }
      return null;
    } catch (error) {
      console.error('Error loading user profile:', error);
      return null;
    }
  };

  // Set up auth state listener
  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('Auth timeout - setting loading to false');
      setLoading(false);
    }, 5000); // 5 second timeout
    
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
        
        if (user) {
          setCurrentUser(user);
          const profile = await loadUserProfile(user);
          setUserProfile(profile);
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
        setLoading(false);
        clearTimeout(timeout);
      }, (error) => {
        console.error('Auth state listener error:', error);
        setLoading(false);
        clearTimeout(timeout);
      });

      return () => {
        clearTimeout(timeout);
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up auth listener:', error);
      setLoading(false);
      clearTimeout(timeout);
    }
  }, []);

  // Login with email and password
  const login = async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Signup with email and password
  const signup = async (email: string, password: string, kidsNames: string[] = []): Promise<void> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Save user profile to Firestore
    const userDoc = doc(db, 'users', userCredential.user.uid);
    await setDoc(userDoc, {
      email: email,
      kidsNames: kidsNames,
      surveyResults: {},
      createdAt: new Date().toISOString(),
      provider: 'email'
    });
  };

  // Login with Google
  const loginWithGoogle = async (): Promise<void> => {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Check if this is a new user and create profile if needed
    const userDoc = doc(db, 'users', result.user.uid);
    const docSnap = await getDoc(userDoc);
    
    const isNewUser = !docSnap.exists();
    
    if (isNewUser) {
      // New user - create profile with Google info
      await setDoc(userDoc, {
        email: result.user.email,
        kidsNames: [], // Empty initially, can be filled later
        surveyResults: {},
        createdAt: new Date().toISOString(),
        provider: 'google'
      });
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    await signOut(auth);
  };

  // Reset password
  const resetPassword = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  };

  // Get user-friendly Firebase error messages
  const getFirebaseErrorMessage = (error: any): string => {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'This Email or Password does not match our records';
      case 'auth/wrong-password':
        return 'This Email or Password does not match our records';
      case 'auth/invalid-credential':
        return 'This Email or Password does not match our records';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters';
      case 'auth/invalid-email':
        return 'Please enter a valid email address';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      default:
        return error.message || 'An error occurred';
    }
  };

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    login,
    signup,
    loginWithGoogle,
    logout,
    resetPassword,
    getFirebaseErrorMessage
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
