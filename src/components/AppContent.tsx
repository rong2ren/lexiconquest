import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProfilePage } from './ProfilePage';
import { LoginPage } from './LoginPage';

type AppState = 'loading' | 'login' | 'profile-ready';

export function AppContent() {
  const { currentUser, loading } = useAuth();
  const [appState, setAppState] = useState<AppState>('loading');

  useEffect(() => {
    console.log('AppContent useEffect - loading:', loading, 'currentUser:', currentUser);
    
    if (loading) {
      setAppState('loading');
      return;
    }

    if (currentUser) {
      // User is authenticated - go directly to profile
      setAppState('profile-ready');
    } else {
      // User is not authenticated - show login
      setAppState('login');
    }
  }, [currentUser, loading]);


  // Loading state
  if (appState === 'loading') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl animate-bounce">🌟</div>
          <h1 className="text-4xl text-white">Lexicon Quest</h1>
          <p className="text-slate-300">Loading your magical adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main content based on app state */}
      {appState === 'login' && <LoginPage />}
      {appState === 'profile-ready' && <ProfilePage />}
    </div>
  );
}
