import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Platform } from 'react-native';

const ZENQUOTES_TODAY_URL = 'https://zenquotes.io/api/today';
const ZENQUOTES_RANDOM_URL = 'https://zenquotes.io/api/random';

/**
 * Normalizes ZenQuotes API response array into a clean { text, author } object
 */
const parseZenQuotesResponse = (data) => {
  if (Array.isArray(data) && data.length > 0) {
    const item = data[0];
    const text = item.q ? item.q.trim() : '';
    const author = item.a ? item.a.trim() : 'Unknown';

    // ZenQuotes sometimes returns a rate-limit message in the 'q' field
    if (text.includes('Too many requests') || text.includes('zenquotes.io')) {
      throw new Error('ZenQuotes API daily rate limit reached. Please try again later.');
    }

    if (text) {
      return { text, author };
    }
  }
  throw new Error('Received invalid quote data from ZenQuotes API.');
};

/**
 * Safe fetcher that supports direct API calls and CORS proxy fallback on Web
 */
const fetchFromZenQuotes = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: Failed to fetch quote`);
    }
    const data = await response.json();
    return parseZenQuotesResponse(data);
  } catch (initialError) {
    // On Web, browsers block cross-origin requests to zenquotes.io if CORS headers are absent.
    // Try CORS proxy fallback on Web:
    if (Platform.OS === 'web') {
      try {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
        const proxyRes = await fetch(proxyUrl);
        if (proxyRes.ok) {
          const proxyData = await proxyRes.json();
          return parseZenQuotesResponse(proxyData);
        }
      } catch (proxyError) {
        console.warn('CORS proxy fallback also failed:', proxyError.message);
      }
    }
    throw initialError;
  }
};

/**
 * 1. Fetch Today's Inspirational Quote from ZenQuotes API
 */
export const fetchTodayQuote = async () => {
  return await fetchFromZenQuotes(ZENQUOTES_TODAY_URL);
};

/**
 * 2. Fetch a Random Inspirational Quote from ZenQuotes API
 */
export const fetchRandomQuote = async () => {
  return await fetchFromZenQuotes(ZENQUOTES_RANDOM_URL);
};

// ====================================================
// FIRESTORE FAVOURITE QUOTES FUNCTIONS
// Path: users/{userId}/favouriteQuotes/{quoteId}
// ====================================================

const getFavouritesCollectionRef = (userId) => {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }
  if (!userId) {
    throw new Error('User ID is required to access favourite quotes.');
  }
  return collection(db, 'users', userId, 'favouriteQuotes');
};

/**
 * 3. Add a quote to the user's favouriteQuotes in Firestore
 * Prevents duplicate favorites by checking existing quotes by text.
 */
export const addFavouriteQuote = async (userId, quote) => {
  const colRef = getFavouritesCollectionRef(userId);

  // Check if quote is already favorited by this user
  const q = query(colRef, where('text', '==', quote.text.trim()));
  const existing = await getDocs(q);

  if (!existing.empty) {
    // Already in favourites, return existing doc ID
    return { id: existing.docs[0].id, ...existing.docs[0].data(), alreadyFavorited: true };
  }

  const newFavourite = {
    text: quote.text.trim(),
    author: quote.author ? quote.author.trim() : 'Unknown',
    savedAt: serverTimestamp(),
  };

  const docRef = await addDoc(colRef, newFavourite);
  return { id: docRef.id, ...newFavourite, alreadyFavorited: false };
};

/**
 * 4. Remove a quote from favouriteQuotes by document ID
 */
export const removeFavouriteQuote = async (userId, quoteId) => {
  if (!db) throw new Error('Firestore is not initialized.');
  const docRef = doc(db, 'users', userId, 'favouriteQuotes', quoteId);
  await deleteDoc(docRef);
  return quoteId;
};

/**
 * 5. Remove a quote from favouriteQuotes by quote text (useful for toggling)
 */
export const removeFavouriteQuoteByText = async (userId, quoteText) => {
  const colRef = getFavouritesCollectionRef(userId);
  const q = query(colRef, where('text', '==', quoteText.trim()));
  const snapshot = await getDocs(q);

  const deletePromises = [];
  snapshot.forEach((d) => {
    deletePromises.push(deleteDoc(d.ref));
  });
  await Promise.all(deletePromises);
};

/**
 * 6. Get all favourite quotes for a user once
 */
export const getFavouriteQuotes = async (userId) => {
  const colRef = getFavouritesCollectionRef(userId);
  const q = query(colRef, orderBy('savedAt', 'desc'));
  const snapshot = await getDocs(q);

  const favourites = [];
  snapshot.forEach((d) => {
    favourites.push({ id: d.id, ...d.data() });
  });
  return favourites;
};

/**
 * 7. Subscribe to real-time updates for favourite quotes
 */
export const subscribeToFavouriteQuotes = (userId, onUpdate, onError) => {
  try {
    const colRef = getFavouritesCollectionRef(userId);
    const q = query(colRef, orderBy('savedAt', 'desc'));

    return onSnapshot(
      q,
      (snapshot) => {
        const favourites = [];
        snapshot.forEach((d) => {
          favourites.push({ id: d.id, ...d.data() });
        });
        onUpdate(favourites);
      },
      (error) => {
        console.warn('Realtime favourite quotes error:', error.message);
        if (onError) onError(error);
      }
    );
  } catch (err) {
    console.warn('subscribeToFavouriteQuotes initialization error:', err.message);
    if (onError) onError(err);
    return () => {};
  }
};
