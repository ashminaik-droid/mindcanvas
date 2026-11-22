import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import CustomCard from './CustomCard';

export default function QuoteCard({
  quote,
  author,
  loading = false,
  error = null,
  isFavorite = false,
  onRefresh,
  onToggleFavorite,
  onRetry,
  style,
}) {
  return (
    <CustomCard style={[styles.card, style]}>
      {/* Header Row: Badge & Action Buttons */}
      <View style={styles.headerRow}>
        <View style={styles.tagBadge}>
          <Ionicons name="sparkles" size={14} color={Colors.primary} />
          <Text style={styles.tagText}>Daily Reflection</Text>
        </View>

        <View style={styles.actionsGroup}>
          {/* Refresh Button */}
          {onRefresh && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={onRefresh}
              disabled={loading}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              {loading ? (
                <ActivityIndicator size={16} color={Colors.primary} />
              ) : (
                <Ionicons name="refresh-outline" size={18} color={Colors.textSecondary} />
              )}
            </TouchableOpacity>
          )}

          {/* Favourite Toggle Button */}
          {onToggleFavorite && (
            <TouchableOpacity
              style={[styles.iconButton, isFavorite && styles.favoritedButton]}
              onPress={onToggleFavorite}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={18}
                color={isFavorite ? '#E63946' : Colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Loading State Skeleton / Spinner */}
      {loading && !quote && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Fetching inspiring reflection from ZenQuotes...</Text>
        </View>
      )}

      {/* Error Notice with Retry */}
      {!loading && error && (
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline-outline" size={24} color="#D9534F" />
          <Text style={styles.errorText}>
            {error || 'Could not reach ZenQuotes. Check your connection.'}
          </Text>
          {onRetry && (
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <Ionicons name="reload" size={14} color={Colors.primary} />
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Quote Display */}
      {(!loading || quote) && !error && (
        <>
          <View style={styles.quoteBody}>
            <Ionicons name="chatbox-ellipses-outline" size={18} color={Colors.secondary} style={styles.quoteIcon} />
            <Text style={styles.quoteText}>
              "{quote || 'Feel it. Write it. Remember it.'}"
            </Text>
          </View>

          <Text style={styles.authorText}>
            — {author || 'MindCanvas'}
          </Text>
        </>
      )}
    </CustomCard>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF5F8',
    borderColor: '#F9DDE7',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  favoritedButton: {
    backgroundColor: '#FFE6E9',
    borderColor: '#FFAAA6',
  },
  loadingContainer: {
    paddingVertical: 18,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  errorText: {
    fontSize: 13,
    color: '#D9534F',
    textAlign: 'center',
    lineHeight: 18,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  retryText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  quoteBody: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  quoteIcon: {
    marginTop: 2,
  },
  quoteText: {
    flex: 1,
    fontSize: 15,
    fontStyle: 'italic',
    color: Colors.text,
    lineHeight: 22,
  },
  authorText: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: 8,
    fontWeight: '600',
  },
});
