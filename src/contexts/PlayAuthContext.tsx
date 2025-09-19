import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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
  questProgress: Record<string, any>;
  createdAt: string;
  lastLogin: string;
  provider: 'local';
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
      questProgress: {},
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      provider: 'local'
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
    activateTrainer
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
