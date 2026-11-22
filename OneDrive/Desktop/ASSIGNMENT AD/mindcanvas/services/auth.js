import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

/**
 * Maps Firebase authentication error codes to beginner-friendly messages
 */
export const getAuthErrorMessage = (error) => {
  const code = error?.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters long.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please register first.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please double-check your credentials.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/invalid-api-key':
    case 'auth/api-key-not-valid':
      return 'Firebase API key is missing or invalid. Please check firebaseConfig.js.';
    default:
      return error?.message || 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Register a new user with email, password, and full name
 */
export const registerUser = async (name, email, password) => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please configure firebaseConfig.js.');
  }

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  // Attach full name to Firebase user profile if provided
  if (name && name.trim()) {
    try {
      await updateProfile(userCredential.user, {
        displayName: name.trim(),
      });
    } catch (profileError) {
      console.warn('Could not update display name:', profileError.message);
    }
  }

  return userCredential.user;
};

/**
 * Sign in existing user with email and password
 */
export const loginUser = async (email, password) => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please configure firebaseConfig.js.');
  }

  const userCredential = await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password
  );

  return userCredential.user;
};

/**
 * Sign out the currently authenticated user
 */
export const logoutUser = async () => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized.');
  }
  await signOut(auth);
};

/**
 * Listen to Firebase authentication state changes
 */
export const subscribeToAuthChanges = (callback) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};
