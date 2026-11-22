import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { MOODS } from '../../constants/Moods';
import CustomCard from '../../components/CustomCard';
import CustomButton from '../../components/CustomButton';
import QuoteCard from '../../components/QuoteCard';
import JournalCard from '../../components/JournalCard';
import { useAuth } from '../../context/AuthContext';
import { subscribeToEntries, deleteEntry } from '../../services/journal';
import {
  fetchTodayQuote,
  fetchRandomQuote,
  addFavouriteQuote,
  removeFavouriteQuoteByText,
  subscribeToFavouriteQuotes,
} from '../../services/quotes';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  // Journal entries state
  const [entries, setEntries] = useState([]);
  const [loadingEntries, setLoadingEntries] = useState(true);

  // ZenQuotes state
  const [quote, setQuote] = useState({
    text: 'Feel it. Write it. Remember it.',
    author: 'MindCanvas',
  });
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [quoteError, setQuoteError] = useState(null);

  // Favourites state
  const [favouriteQuotes, setFavouriteQuotes] = useState([]);

  // 1. Fetch Today's Quote on load
  const loadDailyQuote = useCallback(async () => {
    try {
      setQuoteLoading(true);
      setQuoteError(null);
      const data = await fetchTodayQuote();
      setQuote(data);
    } catch (err) {
      console.warn('Failed to load today quote:', err.message);
      setQuoteError('Could not connect to ZenQuotes. Check your network.');
    } finally {
      setQuoteLoading(false);
    }
  }, []);

  // 2. Fetch a Random Quote on refresh
  const handleRefreshQuote = async () => {
    try {
      setQuoteLoading(true);
      setQuoteError(null);
      const randomData = await fetchRandomQuote();
      setQuote(randomData);
    } catch (err) {
      console.warn('Failed to refresh quote:', err.message);
      setQuoteError('Could not refresh quote right now. Please try again.');
    } finally {
      setQuoteLoading(false);
    }
  };

  useEffect(() => {
    loadDailyQuote();
  }, [loadDailyQuote]);

  // 3. Subscribe to real-time entries & favourite quotes
  useEffect(() => {
    if (!user?.uid) {
      setLoadingEntries(false);
      return;
    }

    setLoadingEntries(true);

    // Journal entries listener
    const unsubscribeEntries = subscribeToEntries(
      user.uid,
      (fetchedEntries) => {
        setEntries(fetchedEntries);
        setLoadingEntries(false);
      },
      (err) => {
        console.warn('Home Firestore subscription notice:', err.message);
        setLoadingEntries(false);
      }
    );

    // Favourite quotes listener
    const unsubscribeFavourites = subscribeToFavouriteQuotes(
      user.uid,
      (favs) => {
        setFavouriteQuotes(favs);
      },
      (err) => {
        console.warn('Favourites subscription notice:', err.message);
      }
    );

    return () => {
      if (typeof unsubscribeEntries === 'function') unsubscribeEntries();
      if (typeof unsubscribeFavourites === 'function') unsubscribeFavourites();
    };
  }, [user?.uid]);

  // Check if the currently displayed quote is in user's favourites
  const isCurrentQuoteFavorited = favouriteQuotes.some(
    (f) => f.text === quote.text
  );

  // Toggle favorite status
  const handleToggleFavorite = async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to save favourite quotes.');
      return;
    }

    try {
      if (isCurrentQuoteFavorited) {
        await removeFavouriteQuoteByText(user.uid, quote.text);
      } else {
        await addFavouriteQuote(user.uid, quote);
      }
    } catch (err) {
      console.error('Toggle favorite error:', err);
      Alert.alert('Error', 'Could not update favourite quotes. Please try again.');
    }
  };

  // Handle Edit Action
  const handleEditEntry = (entry) => {
    router.push({
      pathname: '/journal/editor',
      params: {
        entryId: entry.id,
        initialTitle: entry.title,
        initialReflection: entry.reflection,
        moodLabel: entry.mood || 'Calm',
        moodEmoji: entry.emoji || '😌',
        moodColor: entry.moodColor || '#E2D4F0',
        date: entry.date,
      },
    });
  };

  // Handle Delete Action with confirmation dialog
  const handleDeleteEntry = (entry) => {
    const confirmDelete = async () => {
      try {
        await deleteEntry(user.uid, entry.id);
      } catch (err) {
        console.error('Delete error:', err);
        Alert.alert('Error', 'Could not delete entry. Please try again.');
      }
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`Are you sure you want to delete "${entry.title}"?`);
      if (confirmed) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        'Delete Reflection',
        `Are you sure you want to delete "${entry.title}"? This cannot be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: confirmDelete },
        ]
      );
    }
  };

  // Format today's date nicely
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const firstName = user?.displayName ? user.displayName.split(' ')[0] : 'Explorer';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.dateText}>{todayFormatted}</Text>
            <Text style={styles.greeting}>Hello, {firstName} 🌸</Text>
          </View>
          <View style={styles.headerIconsRow}>
            {/* Saved Quotes Shortcut */}
            <TouchableOpacity
              style={styles.savedQuotesButton}
              onPress={() => router.push('/favourites')}
              activeOpacity={0.8}
            >
              <Ionicons name="heart" size={18} color="#E63946" />
              {favouriteQuotes.length > 0 && (
                <View style={styles.badgeDot}>
                  <Text style={styles.badgeText}>{favouriteQuotes.length}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Profile Shortcut */}
            <TouchableOpacity
              style={styles.avatarButton}
              onPress={() => router.push('/(tabs)/profile')}
              activeOpacity={0.8}
            >
              <Ionicons name="sparkles" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Mood Check-in Card */}
        <CustomCard style={styles.checkInCard}>
          <View style={styles.checkInHeader}>
            <View>
              <Text style={styles.checkInTitle}>Daily Mood Check-in</Text>
              <Text style={styles.checkInSubtitle}>
                How is your headspace feeling right now?
              </Text>
            </View>
            <View style={styles.sparkleBadge}>
              <Ionicons name="sunny" size={22} color="#F4A261" />
            </View>
          </View>

          {/* Quick mood preview pills */}
          <View style={styles.moodPillsRow}>
            {MOODS.map((m) => (
              <TouchableOpacity
                key={m.id}
                style={[styles.moodPill, { backgroundColor: m.color }]}
                onPress={() =>
                  router.push({
                    pathname: '/journal/editor',
                    params: {
                      moodId: m.id,
                      moodLabel: m.label,
                      moodEmoji: m.emoji,
                      moodColor: m.color,
                    },
                  })
                }
              >
                <Text style={styles.moodPillEmoji}>{m.emoji}</Text>
                <Text style={styles.moodPillText}>{m.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <CustomButton
            mode="contained"
            buttonColor={Colors.primary}
            textColor="#FFFFFF"
            icon="heart-outline"
            style={styles.checkInButton}
            onPress={() => router.push('/journal/mood')}
          >
            Record Full Reflection
          </CustomButton>
        </CustomCard>

        {/* ZenQuotes Inspirational Quote Card */}
        <QuoteCard
          quote={quote.text}
          author={quote.author}
          loading={quoteLoading}
          error={quoteError}
          isFavorite={isCurrentQuoteFavorited}
          onRefresh={handleRefreshQuote}
          onToggleFavorite={handleToggleFavorite}
          onRetry={loadDailyQuote}
        />

        {/* Recent Entries Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Reflections</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/calendar')}>
            <Text style={styles.seeAllText}>View Calendar →</Text>
          </TouchableOpacity>
        </View>

        {/* Loading Spinner for Entries */}
        {loadingEntries && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.loadingText}>Syncing reflections from Firestore...</Text>
          </View>
        )}

        {/* Entries List or Empty State */}
        {!loadingEntries && entries.length === 0 && (
          <CustomCard style={styles.emptyCard}>
            <Ionicons name="journal-outline" size={40} color={Colors.primary} />
            <Text style={styles.emptyTitle}>Your canvas is empty</Text>
            <Text style={styles.emptyDesc}>
              No reflections have been logged yet. Capture your thoughts and feelings to begin your journey.
            </Text>
            <CustomButton
              mode="contained"
              buttonColor={Colors.secondary}
              textColor={Colors.text}
              icon="pencil-outline"
              style={styles.emptyButton}
              onPress={() => router.push('/journal/mood')}
            >
              Write First Reflection
            </CustomButton>
          </CustomCard>
        )}

        {!loadingEntries &&
          entries.slice(0, 5).map((entry) => (
            <JournalCard
              key={entry.id}
              entry={entry}
              onEdit={handleEditEntry}
              onDelete={handleDeleteEntry}
            />
          ))}

        {/* New Entry Button */}
        <CustomButton
          mode="contained"
          buttonColor={Colors.accent}
          textColor={Colors.text}
          icon="add-circle-outline"
          style={styles.newEntryButton}
          onPress={() => router.push('/journal/mood')}
        >
          New Journal Entry
        </CustomButton>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 2,
  },
  savedQuotesButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF0F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#F8B4BD',
    position: 'relative',
  },
  badgeDot: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#E63946',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  avatarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3EDFA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.secondary,
  },
  checkInCard: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.border,
    padding: 18,
    marginBottom: 16,
    borderRadius: 22,
  },
  checkInHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  checkInTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  checkInSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 3,
  },
  sparkleBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF4E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodPillsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  moodPill: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 14,
    alignItems: 'center',
    minWidth: 54,
  },
  moodPillEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  moodPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
  },
  checkInButton: {
    borderRadius: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  seeAllText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  loadingBox: {
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 10,
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  emptyButton: {
    borderRadius: 12,
  },
  newEntryButton: {
    marginTop: 8,
    marginBottom: 12,
  },
});
