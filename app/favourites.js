import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import CustomCard from '../components/CustomCard';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { subscribeToFavouriteQuotes, removeFavouriteQuote } from '../services/quotes';

export default function FavouritesScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time favourite quotes for this user
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToFavouriteQuotes(
      user.uid,
      (quotes) => {
        setFavourites(quotes);
        setLoading(false);
      },
      (err) => {
        console.warn('Favourites subscription error:', err.message);
        setLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user?.uid]);

  const handleRemove = (quoteItem) => {
    const confirmRemove = async () => {
      try {
        await removeFavouriteQuote(user.uid, quoteItem.id);
      } catch (err) {
        console.error('Remove favourite error:', err);
        Alert.alert('Error', 'Could not remove quote. Please try again.');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Remove this quote from your saved favourites?')) {
        confirmRemove();
      }
    } else {
      Alert.alert(
        'Remove Favourite',
        'Remove this quote from your saved reflections?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: confirmRemove },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Saved Quotes</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{favourites.length}</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Inspirational quotes from ZenQuotes that you have bookmarked for mindfulness.
        </Text>

        {/* Loading Spinner */}
        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading your favourite reflections...</Text>
          </View>
        )}

        {/* Empty State */}
        {!loading && favourites.length === 0 && (
          <CustomCard style={styles.emptyCard}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="heart-dislike-outline" size={36} color={Colors.secondary} />
            </View>
            <Text style={styles.emptyTitle}>No Saved Quotes Yet</Text>
            <Text style={styles.emptyDesc}>
              Tap the heart icon on any inspirational quote on the Home screen to save your favourite reflections here.
            </Text>
            <CustomButton
              mode="contained"
              buttonColor={Colors.primary}
              textColor="#FFFFFF"
              icon="sparkles"
              style={styles.exploreButton}
              onPress={() => router.replace('/(tabs)/home')}
            >
              Explore Today's Quote
            </CustomButton>
          </CustomCard>
        )}

        {/* Favourites List */}
        {!loading &&
          favourites.map((item) => (
            <CustomCard key={item.id} style={styles.quoteItemCard}>
              <View style={styles.cardTopRow}>
                <Ionicons name="bookmark" size={18} color={Colors.primary} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemove(item)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="trash-outline" size={16} color="#D9534F" />
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.quoteText}>"{item.text}"</Text>
              <Text style={styles.authorText}>— {item.author || 'Unknown'}</Text>
            </CustomCard>
          ))}
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
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  countBadge: {
    backgroundColor: '#FFE6E9',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E63946',
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 18,
    lineHeight: 18,
  },
  loadingBox: {
    padding: 30,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 28,
    borderRadius: 22,
    marginTop: 20,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF0F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  exploreButton: {
    borderRadius: 14,
  },
  quoteItemCard: {
    backgroundColor: '#FFF5F8',
    borderColor: '#F9DDE7',
    padding: 18,
    borderRadius: 20,
    marginBottom: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#FDF2F2',
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D9534F',
  },
  quoteText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: Colors.text,
    lineHeight: 22,
    marginBottom: 8,
  },
  authorText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'right',
    fontWeight: '600',
  },
});
