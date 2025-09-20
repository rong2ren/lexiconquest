import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { doc, setDoc, getDoc, updateDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Trainer interface for new customers
export interface Trainer {
  uid: string;
  firstName: string;
  lastName: string;
  birthday: string;
  stats: {
    bravery: number;
    wisdom: number;
    curiosity: number;
    empathy: number;
  };
  ownedKowai: string[];
  encounteredKowai: string[];
  currentIssue: string; // e.g., 'issue1', 'issue2', etc.
  issueProgress: {
    [issueId: string]: {
      lastCompletedQuest: number; // 0-6, 0 if none completed
      startedAt: string | null;
      completedAt: string | null;
    };
  };
  createdAt: string;
  lastLogin: string;
  provider: '/play';
}

// Trainer session for localStorage
export interface TrainerSession {
  trainerId: string;
  firstName: string;
  lastName: string;
  lastLogin: string;
}

// Multi-trainer localStorage structure
interface MultiTrainerStorage {
  activeTrainerId: string | null;
  trainerSessions: TrainerSession[];
}

// Stats history entry interface for subcollection
export interface StatsHistoryEntry {
  prevStats: { bravery: number; wisdom: number; curiosity: number; empathy: number };
  newStats: { bravery: number; wisdom: number; curiosity: number; empathy: number };
  issue: string;
  quest: number;
  answer: string | string[] | number;
  updateTime: string;
}

// Attempt interface for quest answers
export interface Attempt {
  id: string; // attemptId: trainerId_issueId_questNumber_YYYYMMDD_HHMMSS
  trainerId: string;
  issueId: string;
  questNumber: number;
  
  // The actual answer (flexible type)
  answer: string | string[] | number;
  
  // Answer metadata
  answerType: string;
  isCorrect: boolean;
  
  // Timing data
  questStartTime: string;
  submittedAt: string;
  timeSpent: number; // milliseconds
  
  // Context data
  statsBefore: { bravery: number; wisdom: number; curiosity: number; empathy: number };
  statsAfter?: { bravery: number; wisdom: number; curiosity: number; empathy: number };
  
  createdAt: string;
}

// PlayAuth context interface
interface PlayAuthContextType {
  currentTrainer: Trainer | null;
  availableTrainers: TrainerSession[];
  loading: boolean;
  signup: (firstName: string, lastName: string, birthday: string) => Promise<void>;
  login: (firstName: string, lastName: string, birthday: string) => Promise<void>;
  logout: () => void;
  loadTrainerFromStorage: () => Promise<void>;
  switchTrainer: (trainerId: string) => Promise<void>;
  addNewTrainer: (firstName: string, lastName: string, birthday: string) => Promise<void>;
  removeTrainer: (trainerId: string) => void;
  getTrainerDisplayName: (trainer: TrainerSession) => string;
  activateTrainer: (trainerId: string) => Promise<void>;
  updateTrainerStats: (newStats: { bravery: number; wisdom: number; curiosity: number; empathy: number }) => Promise<void>;
  updateQuestProgress: (completedQuest: number) => Promise<void>;
  updateStatsAndQuestProgress: (newStats: { bravery: number; wisdom: number; curiosity: number; empathy: number }, completedQuest: number, answer?: string | string[] | number) => Promise<void>;
  saveAttempt: (attemptData: Omit<Attempt, 'id' | 'createdAt'>) => Promise<void>;
  saveStatsHistory: (entry: Omit<StatsHistoryEntry, 'updateTime'>) => Promise<void>;
  getStatsHistory: (trainerId?: string) => Promise<StatsHistoryEntry[]>;
  getCurrentIssueProgress: () => { lastCompletedQuest: number; startedAt: string | null; completedAt: string | null } | null;
  startIssue: () => Promise<void>;
  switchToIssue: (issueId: string) => Promise<void>;
  addKowaiToTrainer: (kowaiId: string) => Promise<void>;
}

// Create the context
const PlayAuthContext = createContext<PlayAuthContextType | undefined>(undefined);

// PlayAuth provider component
interface PlayAuthProviderProps {
  children: ReactNode;
}

export function PlayAuthProvider({ children }: PlayAuthProviderProps) {
  const [currentTrainer, setCurrentTrainer] = useState<Trainer | null>(null);
  const [availableTrainers, setAvailableTrainers] = useState<TrainerSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Generate trainerId from user input
  const generateTrainerId = (firstName: string, lastName: string, birthday: string): string => {
    return `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${birthday}`;
  };

  // localStorage helper functions
  const getMultiTrainerStorage = (): MultiTrainerStorage => {
    const stored = localStorage.getItem('multiTrainerStorage');
    if (stored) {
      return JSON.parse(stored);
    }
    return { activeTrainerId: null, trainerSessions: [] };
  };

  const setMultiTrainerStorage = (storage: MultiTrainerStorage): void => {
    localStorage.setItem('multiTrainerStorage', JSON.stringify(storage));
  };

  const addTrainerSession = (trainer: Trainer): void => {
    const storage = getMultiTrainerStorage();
    const session: TrainerSession = {
      trainerId: trainer.uid,
      firstName: trainer.firstName,
      lastName: trainer.lastName,
      lastLogin: trainer.lastLogin
    };

    // Remove existing session if it exists
    const existingIndex = storage.trainerSessions.findIndex(s => s.trainerId === trainer.uid);
    if (existingIndex >= 0) {
      storage.trainerSessions[existingIndex] = session;
    } else {
      storage.trainerSessions.push(session);
    }

    // Set as active trainer
    storage.activeTrainerId = trainer.uid;
    setMultiTrainerStorage(storage);
  };

  const removeTrainerSession = (trainerId: string): void => {
    const storage = getMultiTrainerStorage();
    storage.trainerSessions = storage.trainerSessions.filter(s => s.trainerId !== trainerId);
    
    // If we removed the active trainer, set to null or first available
    if (storage.activeTrainerId === trainerId) {
      storage.activeTrainerId = storage.trainerSessions.length > 0 ? storage.trainerSessions[0].trainerId : null;
    }
    
    setMultiTrainerStorage(storage);
  };

  // Load trainer from localStorage on app start
  const loadTrainerFromStorage = async (): Promise<void> => {
    try {
      const storage = getMultiTrainerStorage();
      setAvailableTrainers(storage.trainerSessions);

      if (storage.activeTrainerId) {
        const trainerDoc = await getDoc(doc(db, 'trainers', storage.activeTrainerId));
        if (trainerDoc.exists()) {
          const trainerData = trainerDoc.data() as Trainer;
          setCurrentTrainer(trainerData);
        } else {
          // Trainer not found in Firebase, remove from storage
          removeTrainerSession(storage.activeTrainerId);
          setCurrentTrainer(null);
        }
      } else {
        setCurrentTrainer(null);
      }
    } catch (error) {
      console.error('Error loading trainer from storage:', error);
    } finally {
      setLoading(false);
    }
  };

  // Signup new trainer
  const signup = async (firstName: string, lastName: string, birthday: string): Promise<void> => {
    const trainerId = generateTrainerId(firstName, lastName, birthday);
    
    // Check if trainer already exists
    const trainerDoc = await getDoc(doc(db, 'trainers', trainerId));
    if (trainerDoc.exists()) {
      // Trainer exists in Firebase, log them in instead
      await login(firstName, lastName, birthday);
      return;
    }

    // Create new trainer
    const newTrainer: Trainer = {
      uid: trainerId,
      firstName,
      lastName,
      birthday,
      stats: { bravery: 0, wisdom: 0, curiosity: 0, empathy: 0 },
      ownedKowai: [],
      encounteredKowai: ['lumino', 'forcino'],
      currentIssue: 'issue1', // Start with issue1
      issueProgress: {
        issue1: {
          lastCompletedQuest: 0, // No quests completed yet
          startedAt: null, // Will be set when they first click "Start Your Quest"
          completedAt: null
        }
      },
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      provider: '/play'
    };

    // Save to Firebase
    await setDoc(doc(db, 'trainers', trainerId), newTrainer);

    // Add to multi-trainer storage
    addTrainerSession(newTrainer);

    // Set current trainer and update available trainers
    setCurrentTrainer(newTrainer);
    const storage = getMultiTrainerStorage();
    setAvailableTrainers(storage.trainerSessions);
  };

  // Login existing trainer
  const login = async (firstName: string, lastName: string, birthday: string): Promise<void> => {
    const trainerId = generateTrainerId(firstName, lastName, birthday);
    
    const trainerDoc = await getDoc(doc(db, 'trainers', trainerId));
    if (!trainerDoc.exists()) {
      throw new Error('No trainer found with this information. Please check your details or sign up.');
    }

    const trainerData = trainerDoc.data() as Trainer;
    
    // Update lastLogin
    const updatedTrainer = {
      ...trainerData,
      lastLogin: new Date().toISOString()
    };
    
    await setDoc(doc(db, 'trainers', trainerId), updatedTrainer);

    // Add to multi-trainer storage
    addTrainerSession(updatedTrainer);

    // Set current trainer and update available trainers
    setCurrentTrainer(updatedTrainer);
    const storage = getMultiTrainerStorage();
    setAvailableTrainers(storage.trainerSessions);
  };

  // Logout
  const logout = (): void => {
    // Clear current trainer but keep all sessions for easy re-login
    const storage = getMultiTrainerStorage();
    storage.activeTrainerId = null;
    setMultiTrainerStorage(storage);
    
    setCurrentTrainer(null);
    // Keep availableTrainers so they can see their previous sessions
  };

  // Switch to a different trainer
  const switchTrainer = async (trainerId: string): Promise<void> => {
    try {
      const trainerDoc = await getDoc(doc(db, 'trainers', trainerId));
      if (!trainerDoc.exists()) {
        throw new Error('Trainer not found');
      }

      const trainerData = trainerDoc.data() as Trainer;
      
      // Update lastLogin
      const updatedTrainer = {
        ...trainerData,
        lastLogin: new Date().toISOString()
      };
      
      await setDoc(doc(db, 'trainers', trainerId), updatedTrainer);

      // Update storage to set as active trainer
      const storage = getMultiTrainerStorage();
      storage.activeTrainerId = trainerId;
      setMultiTrainerStorage(storage);

      // Update available trainers list
      const updatedSessions = storage.trainerSessions.map(session => 
        session.trainerId === trainerId 
          ? { ...session, lastLogin: updatedTrainer.lastLogin }
          : session
      );
      setAvailableTrainers(updatedSessions);

      // Set current trainer
      setCurrentTrainer(updatedTrainer);
    } catch (error) {
      console.error('Error switching trainer:', error);
      throw error;
    }
  };

  // Add new trainer (alias for signup for clarity)
  const addNewTrainer = async (firstName: string, lastName: string, birthday: string): Promise<void> => {
    await signup(firstName, lastName, birthday);
  };

  // Remove trainer from available trainers
  const removeTrainer = (trainerId: string): void => {
    removeTrainerSession(trainerId);
    const storage = getMultiTrainerStorage();
    setAvailableTrainers(storage.trainerSessions);
    
    // If we removed the current trainer, clear it
    if (currentTrainer?.uid === trainerId) {
      setCurrentTrainer(null);
    }
  };

  // Get display name for trainer
  const getTrainerDisplayName = (trainer: TrainerSession): string => {
    return `${trainer.firstName} ${trainer.lastName}`;
  };

  // Activate trainer (alias for switchTrainer for clarity)
  const activateTrainer = async (trainerId: string): Promise<void> => {
    await switchTrainer(trainerId);
  };

  // Update trainer stats
  const updateTrainerStats = async (newStats: { bravery: number; wisdom: number; curiosity: number; empathy: number }): Promise<void> => {
    if (!currentTrainer) return;

    try {
      const trainerRef = doc(db, 'trainers', currentTrainer.uid);
      await updateDoc(trainerRef, {
        stats: newStats,
        lastLogin: new Date().toISOString()
      });

      // Update local state
      setCurrentTrainer(prev => prev ? { ...prev, stats: newStats } : null);
    } catch (error) {
      console.error('Error updating trainer stats:', error);
      throw error;
    }
  };

  // Optimized function to update both stats and quest progress in a single Firebase call
  const updateStatsAndQuestProgress = async (newStats: { bravery: number; wisdom: number; curiosity: number; empathy: number }, completedQuest: number, answer?: string | string[] | number): Promise<void> => {
    if (!currentTrainer) return;

    // Validate quest number
    if (completedQuest < 1 || completedQuest > 6) {
      throw new Error('Invalid quest number. Must be between 1 and 6.');
    }

    const currentIssue = currentTrainer.currentIssue;
    const currentIssueProgress = currentTrainer.issueProgress[currentIssue];
    
    if (!currentIssueProgress) {
      throw new Error(`No progress found for issue ${currentIssue}`);
    }

    // Validate quest progression (can't skip quests)
    const currentLastCompleted = currentIssueProgress.lastCompletedQuest || 0;
    if (completedQuest !== currentLastCompleted + 1) {
      throw new Error(`Invalid quest progression. Expected quest ${currentLastCompleted + 1}, got ${completedQuest}.`);
    }

    try {
      const trainerRef = doc(db, 'trainers', currentTrainer.uid);
      const now = new Date().toISOString();
      
      // Update issue progress
      const updatedIssueProgress = {
        ...currentTrainer.issueProgress,
        [currentIssue]: {
          ...currentIssueProgress,
          lastCompletedQuest: completedQuest,
          completedAt: completedQuest === 6 ? now : currentIssueProgress.completedAt
        }
      };

      // Single atomic update for both stats and quest progress
      await updateDoc(trainerRef, {
        stats: newStats,
        issueProgress: updatedIssueProgress,
        lastLogin: now
      });

      // Save stats history entry if answer is provided
      if (answer !== undefined) {
        await saveStatsHistory({
          prevStats: currentTrainer.stats,
          newStats: newStats,
          issue: currentIssue,
          quest: completedQuest,
          answer: answer
        });
      }

      // Update local state
      setCurrentTrainer(prev => prev ? { 
        ...prev, 
        stats: newStats,
        issueProgress: updatedIssueProgress
      } : null);
    } catch (error) {
      console.error('Error updating trainer stats and quest progress:', error);
      throw error;
    }
  };

  // Generate attempt ID with hybrid naming convention
  const generateAttemptId = (trainerId: string, issueId: string, questNumber: number): string => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
    const timeStr = now.toISOString().slice(11, 19).replace(/:/g, ''); // HHMMSS
    return `${trainerId}_${issueId}_${questNumber}_${dateStr}_${timeStr}`;
  };

  // Save attempt to Firestore
  const saveAttempt = async (attemptData: Omit<Attempt, 'id' | 'createdAt'>): Promise<void> => {
    if (!currentTrainer) return;

    try {
      const attemptId = generateAttemptId(
        attemptData.trainerId,
        attemptData.issueId,
        attemptData.questNumber
      );

      const attempt: Attempt = {
        id: attemptId,
        ...attemptData,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'attempts', attemptId), attempt);
    } catch (error) {
      console.error('Error saving attempt:', error);
      throw error;
    }
  };

  // Generate stats history document ID
  const generateStatsHistoryId = (issueId: string, questNumber: number): string => {
    return `${issueId}_${questNumber}`;
  };

  // Save stats history entry to trainer subcollection
  const saveStatsHistory = async (entry: Omit<StatsHistoryEntry, 'updateTime'>): Promise<void> => {
    if (!currentTrainer) return;

    try {
      const statsHistoryEntry: StatsHistoryEntry = {
        ...entry,
        updateTime: new Date().toISOString()
      };

      const documentId = generateStatsHistoryId(entry.issue, entry.quest);
      const statsHistoryRef = doc(db, 'trainers', currentTrainer.uid, 'statsHistory', documentId);

      await setDoc(statsHistoryRef, statsHistoryEntry);
    } catch (error) {
      console.error('Error saving stats history:', error);
      throw error;
    }
  };

  // Get stats history for a trainer
  const getStatsHistory = async (trainerId?: string): Promise<StatsHistoryEntry[]> => {
    const targetTrainerId = trainerId || currentTrainer?.uid;
    if (!targetTrainerId) return [];

    try {
      const statsHistoryRef = collection(db, 'trainers', targetTrainerId, 'statsHistory');
      const q = query(statsHistoryRef, orderBy('updateTime', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const statsHistory: StatsHistoryEntry[] = [];
      querySnapshot.forEach((doc) => {
        statsHistory.push(doc.data() as StatsHistoryEntry);
      });
      
      return statsHistory;
    } catch (error) {
      console.error('Error getting stats history:', error);
      throw error;
    }
  };

  // Update quest progress with validation
  const updateQuestProgress = async (completedQuest: number): Promise<void> => {
    if (!currentTrainer) return;

    // Validate quest number
    if (completedQuest < 1 || completedQuest > 6) {
      throw new Error('Invalid quest number. Must be between 1 and 6.');
    }

    const currentIssue = currentTrainer.currentIssue;
    const currentIssueProgress = currentTrainer.issueProgress[currentIssue];
    
    if (!currentIssueProgress) {
      throw new Error(`No progress found for issue ${currentIssue}`);
    }

    // Validate quest progression (can't skip quests)
    const currentLastCompleted = currentIssueProgress.lastCompletedQuest || 0;
    if (completedQuest !== currentLastCompleted + 1) {
      throw new Error(`Invalid quest progression. Expected quest ${currentLastCompleted + 1}, got ${completedQuest}.`);
    }

    try {
      const trainerRef = doc(db, 'trainers', currentTrainer.uid);
      const now = new Date().toISOString();
      
      // Update issue progress
      const updatedIssueProgress = {
        ...currentTrainer.issueProgress,
        [currentIssue]: {
          ...currentIssueProgress,
          lastCompletedQuest: completedQuest,
          completedAt: completedQuest === 6 ? now : currentIssueProgress.completedAt
        }
      };

      const updateData = {
        lastLogin: now,
        issueProgress: updatedIssueProgress
      };
      
      await setDoc(trainerRef, updateData, { merge: true });

      // Update local state
      setCurrentTrainer(prev => prev ? { 
        ...prev, 
        issueProgress: updatedIssueProgress 
      } : null);
    } catch (error) {
      console.error('Error updating quest progress:', error);
      throw error;
    }
  };

  // Get current issue progress
  const getCurrentIssueProgress = (): { lastCompletedQuest: number; startedAt: string | null; completedAt: string | null } | null => {
    if (!currentTrainer) return null;
    return currentTrainer.issueProgress[currentTrainer.currentIssue] || null;
  };

  // Start an issue (set startedAt when first clicking "Start Your Quest")
  const startIssue = async (): Promise<void> => {
    if (!currentTrainer) return;

    const currentIssue = currentTrainer.currentIssue;
    const currentIssueProgress = currentTrainer.issueProgress[currentIssue];
    
    if (!currentIssueProgress) {
      throw new Error(`No progress found for issue ${currentIssue}`);
    }

    // Only set startedAt if it's null and lastCompletedQuest is 0
    if (currentIssueProgress.startedAt === null && currentIssueProgress.lastCompletedQuest === 0) {
      try {
        const trainerRef = doc(db, 'trainers', currentTrainer.uid);
        const now = new Date().toISOString();
        
        const updatedIssueProgress = {
          ...currentTrainer.issueProgress,
          [currentIssue]: {
            ...currentIssueProgress,
            startedAt: now
          }
        };

        const updateData = {
          issueProgress: updatedIssueProgress
        };
        
        await setDoc(trainerRef, updateData, { merge: true });

        // Update local state
        setCurrentTrainer(prev => prev ? { 
          ...prev, 
          issueProgress: updatedIssueProgress 
        } : null);
      } catch (error) {
        console.error('Error starting issue:', error);
        throw error;
      }
    }
  };

  // Switch to a different issue
  const switchToIssue = async (issueId: string): Promise<void> => {
    if (!currentTrainer) return;

    // If trainer hasn't started this issue yet, initialize it
    if (!currentTrainer.issueProgress[issueId]) {
      const updatedIssueProgress = {
        ...currentTrainer.issueProgress,
        [issueId]: {
          lastCompletedQuest: 0,
          startedAt: null, // Will be set when they first click "Start Your Quest"
          completedAt: null
        }
      };

      try {
        const trainerRef = doc(db, 'trainers', currentTrainer.uid);
        await setDoc(trainerRef, {
          currentIssue: issueId,
          issueProgress: updatedIssueProgress,
          lastLogin: new Date().toISOString()
        }, { merge: true });

        setCurrentTrainer(prev => prev ? {
          ...prev,
          currentIssue: issueId,
          issueProgress: updatedIssueProgress
        } : null);
      } catch (error) {
        console.error('Error switching to issue:', error);
        throw error;
      }
    } else {
      // Just switch current issue
      try {
        const trainerRef = doc(db, 'trainers', currentTrainer.uid);
        await setDoc(trainerRef, {
          currentIssue: issueId,
          lastLogin: new Date().toISOString()
        }, { merge: true });

        setCurrentTrainer(prev => prev ? {
          ...prev,
          currentIssue: issueId
        } : null);
      } catch (error) {
        console.error('Error switching to issue:', error);
        throw error;
      }
    }
  };

  // Add Kowai to trainer
  const addKowaiToTrainer = async (kowaiId: string): Promise<void> => {
    if (!currentTrainer) return;

    try {
      const trainerRef = doc(db, 'trainers', currentTrainer.uid);
      const updatedOwnedKowai = [...currentTrainer.ownedKowai];
      
      // Only add if not already owned
      if (!updatedOwnedKowai.includes(kowaiId)) {
        updatedOwnedKowai.push(kowaiId);
        
        await updateDoc(trainerRef, {
          ownedKowai: updatedOwnedKowai,
          lastLogin: new Date().toISOString()
        });

        // Update local state
        setCurrentTrainer(prev => prev ? { ...prev, ownedKowai: updatedOwnedKowai } : null);
      }
    } catch (error) {
      console.error('Error adding Kowai to trainer:', error);
      throw error;
    }
  };

  // Load trainer from storage on mount
  useEffect(() => {
    loadTrainerFromStorage();
  }, []);

  const value: PlayAuthContextType = {
    currentTrainer,
    availableTrainers,
    loading,
    signup,
    login,
    logout,
    loadTrainerFromStorage,
    switchTrainer,
    addNewTrainer,
    removeTrainer,
    getTrainerDisplayName,
    activateTrainer,
    updateTrainerStats,
    updateQuestProgress,
    updateStatsAndQuestProgress,
    saveAttempt,
    saveStatsHistory,
    getStatsHistory,
    getCurrentIssueProgress,
    startIssue,
    switchToIssue,
    addKowaiToTrainer
  };

  return (
    <PlayAuthContext.Provider value={value}>
      {children}
    </PlayAuthContext.Provider>
  );
}

// Custom hook to use play auth context
export function usePlayAuth(): PlayAuthContextType {
  const context = useContext(PlayAuthContext);
  if (context === undefined) {
    throw new Error('usePlayAuth must be used within a PlayAuthProvider');
  }
  return context;
}
