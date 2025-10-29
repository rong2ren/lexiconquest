// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// TODO: Replace with YOUR Firebase configuration from Firebase Console
// Go to: Project Settings → General → Your apps → SDK setup and configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-d9W68bg6xIplZK9EQgNcBNU9x6nMJ9g",
  authDomain: "lexiconquest-243fb.firebaseapp.com",
  projectId: "lexiconquest-243fb",
  storageBucket: "lexiconquest-243fb.firebasestorage.app",
  messagingSenderId: "375627109251",
  appId: "1:375627109251:web:dda77f9de4e189d9f21cb6",
  measurementId: "G-DT3GB0P84D"
};

// Initialize Firebase
// console.log('Initializing Firebase...');
const app = initializeApp(firebaseConfig);
// console.log('Firebase app initialized:', app);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// console.log('Firebase services initialized:', { auth, db, analytics });

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
// Add email scope to ensure we get the user's email
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Export the app instance
export default app;
