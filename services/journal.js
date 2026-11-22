import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

/**
 * Helper to obtain the entries subcollection reference for a user:
 * users/{userId}/entries
 */
const getEntriesCollectionRef = (userId) => {
  if (!db) {
    throw new Error('Firestore is not initialized. Please check firebaseConfig.js.');
  }
  if (!userId) {
    throw new Error('User ID is required to access journal entries.');
  }
  return collection(db, 'users', userId, 'entries');
};

/**
 * 1. Create a new journal entry in Firestore
 * @param {string} userId - Current authenticated user's UID
 * @param {object} entryData - { title, reflection, mood, emoji, moodColor, date }
 */
export const createEntry = async (userId, entryData) => {
  const colRef = getEntriesCollectionRef(userId);

  // Normalize date to YYYY-MM-DD if not provided
  const entryDate = entryData.date || new Date().toISOString().split('T')[0];

  const newDoc = {
    title: entryData.title.trim(),
    reflection: entryData.reflection.trim(),
    mood: entryData.mood || 'Calm',
    emoji: entryData.emoji || '😌',
    moodColor: entryData.moodColor || '#E2D4F0',
    date: entryDate,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(colRef, newDoc);
  return { id: docRef.id, ...newDoc };
};

/**
 * 2. Fetch all journal entries for a user once (ordered by date newest first)
 * @param {string} userId - Current authenticated user's UID
 */
export const getEntries = async (userId) => {
  const colRef = getEntriesCollectionRef(userId);
  const q = query(colRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);

  const entries = [];
  snapshot.forEach((d) => {
    entries.push({ id: d.id, ...d.data() });
  });
  return entries;
};

/**
 * 3. Subscribe to real-time updates for a user's journal entries
 * @param {string} userId - Current authenticated user's UID
 * @param {function} onUpdate - Callback receiving array of entries
 * @param {function} onError - Optional error handler callback
 * @returns {function} Unsubscribe listener function
 */
export const subscribeToEntries = (userId, onUpdate, onError) => {
  try {
    const colRef = getEntriesCollectionRef(userId);
    const q = query(colRef, orderBy('createdAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const entries = [];
        snapshot.forEach((d) => {
          entries.push({ id: d.id, ...d.data() });
        });
        onUpdate(entries);
      },
      (error) => {
        console.warn('Realtime entries subscription error:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('subscribeToEntries initialization error:', err.message);
    if (onError) onError(err);
    return () => {};
  }
};

/**
 * 4. Update an existing journal entry
 * @param {string} userId - Current authenticated user's UID
 * @param {string} entryId - Document ID in entries subcollection
 * @param {object} updatedData - { title, reflection, mood, emoji, moodColor, date }
 */
export const updateEntry = async (userId, entryId, updatedData) => {
  if (!entryId) {
    throw new Error('Entry ID is required to update an entry.');
  }

  const docRef = doc(db, 'users', userId, 'entries', entryId);

  const updates = {
    ...updatedData,
    updatedAt: serverTimestamp(),
  };

  // Clean strings
  if (updates.title) updates.title = updates.title.trim();
  if (updates.reflection) updates.reflection = updates.reflection.trim();

  await updateDoc(docRef, updates);
  return { id: entryId, ...updates };
};

/**
 * 5. Delete an entry from Firestore
 * @param {string} userId - Current authenticated user's UID
 * @param {string} entryId - Document ID in entries subcollection
 */
export const deleteEntry = async (userId, entryId) => {
  if (!entryId) {
    throw new Error('Entry ID is required to delete an entry.');
  }

  const docRef = doc(db, 'users', userId, 'entries', entryId);
  await deleteDoc(docRef);
  return entryId;
};
