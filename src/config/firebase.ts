import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAddHjvRgjBUfR4OBAwWJs_rhuf3gkX-2Q",
  authDomain: "lexicon-quest.firebaseapp.com",
  projectId: "lexicon-quest",
  storageBucket: "lexicon-quest.firebasestorage.app",
  messagingSenderId: "107916687613",
  appId: "1:107916687613:web:dcc3236f8eb84d6a0da694",
  measurementId: "G-Y5R9TTH4PT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export default app;
