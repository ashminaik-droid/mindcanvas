import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// MindCanvas Firebase Configuration
// Replace these placeholders with your Firebase project keys from Firebase Console
const firebaseConfig = {
 apiKey: "AIzaSyAiF_I0pB06BLBtydGjVNfJq8NdLmE_lho",
  authDomain: "mindcanvas-89af1.firebaseapp.com",
  projectId: "mindcanvas-89af1",
  storageBucket: "mindcanvas-89af1.firebasestorage.app",
  messagingSenderId: "649815703525",
  appId: "1:649815703525:web:c7d7167bc0bffc9e09f90c",
  measurementId: "G-GS7C791RDD"}

// Initialize Firebase App and Auth with persistence
let app;
let auth;
let db;

try {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    // On React Native / Expo, use AsyncStorage persistence. On Web, standard getAuth handles it.
    if (Platform.OS === 'web') {
      auth = getAuth(app);
    } else {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    }
  } else {
    app = getApp();
    auth = getAuth(app);
  }
  db = getFirestore(app);
} catch (error) {
  console.warn('Firebase initialization notice:', error.message);
  if (app && !auth) {
    try {
      auth = getAuth(app);
    } catch (e) {
      console.warn('Fallback getAuth notice:', e.message);
    }
  }
}

export { app, auth, db };
export default app;
