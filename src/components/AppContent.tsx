import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePlayAuth } from '../contexts/PlayAuthContext';
import { ProfilePage } from './ProfilePage';
import { LoginPage } from './LoginPage';
import { PlayProfile } from './PlayProfile';
import { PlayLogin } from './PlayLogin';

type AppState = 'loading' | 'old-cohort-login' | 'old-cohort-profile' | 'play-profile' | 'play-selection';

export function AppContent() {
  const { currentUser, loading: oldCohortLoading } = useAuth();
  const { currentTrainer, availableTrainers, loading: playLoading } = usePlayAuth();
  const [appState, setAppState] = useState<AppState>('loading');

  useEffect(() => {
    console.log('AppContent useEffect - oldCohortLoading:', oldCohortLoading, 'playLoading:', playLoading);
    console.log('currentUser:', currentUser, 'currentTrainer:', currentTrainer, 'availableTrainers:', availableTrainers);
    
    // Check if we're on /play route
    const isPlayRoute = window.location.pathname === '/play';
    
    if (isPlayRoute) {
      // Handle /play route with unified trainer selection
      if (playLoading) {
        setAppState('loading');
      } else if (currentTrainer) {
        // User is logged in to a trainer
        setAppState('play-profile');
      } else {
        // User is not logged in - show trainer selection (handles both new and returning users)
        setAppState('play-selection');
      }
    } else {
      // Handle / route (old cohort)
      if (oldCohortLoading) {
        setAppState('loading');
      } else if (currentUser) {
        setAppState('old-cohort-profile');
      } else {
        setAppState('old-cohort-login');
      }
    }
  }, [currentUser, oldCohortLoading, currentTrainer, availableTrainers, playLoading]);


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
      {appState === 'old-cohort-login' && <LoginPage />}
      {appState === 'old-cohort-profile' && <ProfilePage />}
      {appState === 'play-profile' && <PlayProfile />}
      {appState === 'play-selection' && <PlayLogin />}
    </div>
  );
}
