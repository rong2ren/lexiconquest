import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  type User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { trackEvent, identifyUser, resetUser } from '../config/mixpanel';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      trackEvent('User Login', { method: 'email' });
      identifyUser(result.user.uid, { email: result.user.email });
    } catch (error: any) {
      trackEvent('Login Error', { error: error.message });
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      trackEvent('User Signup', { method: 'email' });
      identifyUser(result.user.uid, { email: result.user.email });
    } catch (error: any) {
      trackEvent('Signup Error', { error: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      trackEvent('User Logout');
      resetUser();
    } catch (error: any) {
      trackEvent('Logout Error', { error: error.message });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      trackEvent('Password Reset Requested', { email });
    } catch (error: any) {
      trackEvent('Password Reset Error', { error: error.message });
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      trackEvent('User Login', { method: 'google' });
      identifyUser(result.user.uid, { 
        email: result.user.email,
        name: result.user.displayName 
      });
    } catch (error: any) {
      trackEvent('Google Login Error', { error: error.message });
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      if (user) {
        identifyUser(user.uid, { email: user.email });
        trackEvent('User Session Started');
      } else {
        resetUser();
        trackEvent('User Session Ended');
      }
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    login,
    signup,
    logout,
    resetPassword,
    loginWithGoogle
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
