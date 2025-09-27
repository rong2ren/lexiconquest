import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { identifyUser, resetUser, trackEvent } from '../lib/mixpanel';

// Custom hook that combines auth with analytics tracking
export function useAuthWithAnalytics() {
  const auth = useAuth();

  // Track authentication events
  useEffect(() => {
    if (auth.currentUser) {
      // User is signed in - identify and register properties
      // Use userProfile.email if available, fallback to currentUser.email
      const email = auth.userProfile?.email || auth.currentUser.email;
      
      // Get a better name for the user
      const userName = auth.userProfile?.kidsNames?.[0] || 
                      auth.currentUser.displayName || 
                      email?.split('@')[0] || 
                      'unknown';
      
      identifyUser(auth.currentUser.uid, {
        '$email': email,
        '$name': userName,
        'user_id': auth.currentUser.uid,
        'provider': auth.userProfile?.provider || (auth.currentUser?.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'email'),
        'kids_count': auth.userProfile?.kidsNames?.length || 'unknown',
        'created_at': auth.userProfile?.createdAt || new Date().toISOString()
      });
    } else {
      // User is signed out - reset analytics
      resetUser();
    }
  }, [auth.currentUser, auth.userProfile]);

  // Enhanced login function with analytics
  const loginWithTracking = async (email: string, password: string) => {
    try {
      trackEvent('Login Attempted', { method: 'email' });
      await auth.login(email, password);
      trackEvent('Login Success', { method: 'email' });
    } catch (error) {
      trackEvent('Login Failed', { 
        method: 'email', 
        error: (error as any).code 
      });
      throw error;
    }
  };

  // Enhanced Google login with analytics
  const loginWithGoogleTracking = async () => {
    try {
      trackEvent('Login Attempted', { method: 'google' });
      await auth.loginWithGoogle();
      trackEvent('Login Success', { method: 'google' });
    } catch (error) {
      trackEvent('Login Failed', { 
        method: 'google', 
        error: (error as any).code 
      });
      throw error;
    }
  };

  // Enhanced signup with analytics
  const signupWithTracking = async (email: string, password: string, kidsNames?: string[]) => {
    try {
      trackEvent('Signup Attempted', { method: 'email' });
      await auth.signup(email, password, kidsNames);
      trackEvent('Signup Success', { method: 'email' });
    } catch (error) {
      trackEvent('Signup Failed', { 
        method: 'email', 
        error: (error as any).code 
      });
      throw error;
    }
  };

  // Enhanced logout with analytics
  const logoutWithTracking = async () => {
    try {
      trackEvent('Logout Attempted');
      await auth.logout();
      trackEvent('Logout Success');
    } catch (error) {
      trackEvent('Logout Failed', { error: (error as any).code });
      throw error;
    }
  };

  // Enhanced reset password with analytics
  const resetPasswordWithTracking = async (email: string) => {
    try {
      trackEvent('Password Reset Attempted', { email });
      await auth.resetPassword(email);
      trackEvent('Password Reset Email Sent', { email });
    } catch (error) {
      trackEvent('Password Reset Failed', { 
        email, 
        error: (error as any).code 
      });
      throw error;
    }
  };

  return {
    ...auth,
    login: loginWithTracking,
    loginWithGoogle: loginWithGoogleTracking,
    signup: signupWithTracking,
    logout: logoutWithTracking,
    resetPassword: resetPasswordWithTracking
  };
}
