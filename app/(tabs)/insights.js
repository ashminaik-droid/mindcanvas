import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { MOODS } from '../../constants/Moods';
import CustomCard from '../../components/CustomCard';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../context/AuthContext';
import { subscribeToEntries } from '../../services/journal';

export default function InsightsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to real-time entries
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToEntries(
      user.uid,
      (fetched) => {
        setEntries(fetched);
        setLoading(false);
      },
      (err) => {
        console.warn('Insights entries subscription notice:', err.message);
        setLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user?.uid]);

  // Compute live analytics from actual user entries
  const stats = useMemo(() => {
    const total = entries.length;
    if (total === 0) {
      return null;
    }

    // Filter entries from the past 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

    const currentWeekCount = entries.filter((e) => {
      const d = e.date || (e.createdAt?.toDate ? e.createdAt.toDate().toISOString().split('T')[0] : null);
      return d && d >= sevenDaysAgoStr;
    }).length;

    // Mood count mapping
    const counts = {
      happy: 0,
      calm: 0,
      loved: 0,
      anxious: 0,
      sad: 0,
    };

    entries.forEach((e) => {
      const moodId = (e.mood || e.moodLabel || '').toLowerCase();
      if (counts[moodId] !== undefined) {
        counts[moodId]++;
      } else {
        // Fallback matching by emoji
        if (e.emoji === '😊') counts.happy++;
        else if (e.emoji === '😌') counts.calm++;
        else if (e.emoji === '🥰') counts.loved++;
        else if (e.emoji === '😰') counts.anxious++;
        else if (e.emoji === '😢') counts.sad++;
        else counts.calm++;
      }
    });

    // Compute distribution percentages for each mood
    const distribution = MOODS.map((m) => {
      const count = counts[m.id] || 0;
      const percent = total > 0 ? Math.round((count / total) * 100) : 0;
      return {
        id: m.id,
        label: m.label,
        emoji: m.emoji,
        color: m.color,
        count,
        percent,
      };
    }).sort((a, b) => b.count - a.count);

    const topMood = distribution[0] || {
      label: 'Calm',
      emoji: '😌',
      color: '#E2D4F0',
      percent: 0,
    };

    return {
      total,
      currentWeekCount,
      topMood,
      distribution,
    };
  }, [entries]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Reflections & Insights</Text>
          <Text style={styles.subtitle}>
            Generated live from your actual Cloud Firestore entries
          </Text>
        </View>

        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <Text style={styles.loadingText}>Analyzing reflections...</Text>
          </View>
        )}

        {/* Empty State when user has 0 entries */}
        {!loading && !stats && (
          <CustomCard style={styles.emptyCard}>
            <Ionicons name="pie-chart-outline" size={48} color={Colors.primary} />
            <Text style={styles.emptyTitle}>No Insights Available Yet</Text>
            <Text style={styles.emptyDesc}>
              Write your first reflections in MindCanvas to unlock real-time mood trends, weekly breakdown, and statistics.
            </Text>
            <CustomButton
              mode="contained"
              buttonColor={Colors.primary}
              textColor="#FFFFFF"
              icon="create-outline"
              style={styles.emptyButton}
              onPress={() => router.push('/journal/mood')}
            >
              Log a Reflection
            </CustomButton>
          </CustomCard>
        )}

        {/* Analytics Display when entries exist */}
        {!loading && stats && (
          <>
            {/* Top Metric Cards */}
            <View style={styles.metricsRow}>
              {/* Total Entries */}
              <CustomCard style={[styles.metricCard, { backgroundColor: '#FFF5EB' }]}>
                <View style={styles.metricIconCircle}>
                  <Ionicons name="book-outline" size={20} color="#D97706" />
                </View>
                <Text style={styles.metricValue}>{stats.total}</Text>
                <Text style={styles.metricLabel}>Total Entries</Text>
                <Text style={styles.metricSub}>{stats.currentWeekCount} this week</Text>
              </CustomCard>

              {/* Most Frequent Mood */}
              <CustomCard style={[styles.metricCard, { backgroundColor: stats.topMood.color }]}>
                <Text style={styles.metricEmoji}>{stats.topMood.emoji}</Text>
                <Text style={styles.metricValue}>{stats.topMood.label}</Text>
                <Text style={styles.metricLabel}>Top Mood</Text>
                <Text style={styles.metricSub}>{stats.topMood.percent}% of reflections</Text>
              </CustomCard>
            </View>

            {/* Weekly Activity Banner */}
            <CustomCard style={styles.activityCard}>
              <View style={styles.activityContent}>
                <View style={styles.activityIconCircle}>
                  <Ionicons name="calendar-outline" size={22} color={Colors.primary} />
                </View>
                <View style={styles.activityTextContainer}>
                  <Text style={styles.activityTitle}>
                    {stats.currentWeekCount} Entries This Week
                  </Text>
                  <Text style={styles.activitySubtitle}>
                    {stats.currentWeekCount >= 3
                      ? 'Consistent mindfulness reflection observed! Keep it up!'
                      : 'Take a few minutes today to check in with yourself.'}
                  </Text>
                </View>
              </View>
            </CustomCard>

            {/* Mood Distribution Section */}
            <CustomCard style={styles.distributionCard}>
              <View style={styles.distHeader}>
                <Text style={styles.distTitle}>Mood Distribution</Text>
                <Text style={styles.distSubtitle}>{stats.total} total recorded</Text>
              </View>

              {stats.distribution.map((item) => (
                <View key={item.id} style={styles.distRow}>
                  <View style={styles.distLabelGroup}>
                    <Text style={styles.distEmoji}>{item.emoji}</Text>
                    <Text style={styles.distName}>{item.label}</Text>
                    <Text style={styles.distCountText}>{item.count} entries</Text>
                    <Text style={styles.distPercent}>{item.percent}%</Text>
                  </View>

                  {/* Progress Bar Container */}
                  <View style={styles.progressBarTrack}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${Math.max(item.percent, 3)}%`,
                          backgroundColor: item.color,
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </CustomCard>

            {/* Summary Reflection Card */}
            <CustomCard style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <Ionicons name="sparkles" size={18} color={Colors.primary} />
                <Text style={styles.tipTitle}>Reflection Summary</Text>
              </View>
              <Text style={styles.tipText}>
                Your primary headspace is {stats.topMood.label} ({stats.topMood.emoji}). Regular journaling helps bring unconscious feelings into conscious perspective.
              </Text>
            </CustomCard>
          </>
        )}
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
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
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
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 12,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  emptyButton: {
    borderRadius: 14,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  metricCard: {
    flex: 1,
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  metricIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  metricEmoji: {
    fontSize: 30,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  metricSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  activityCard: {
    backgroundColor: '#FFF7E6',
    borderColor: '#FFE0B2',
    padding: 14,
    borderRadius: 18,
    marginBottom: 16,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityTextContainer: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8D4004',
  },
  activitySubtitle: {
    fontSize: 12,
    color: '#A7520B',
    marginTop: 2,
    lineHeight: 16,
  },
  distributionCard: {
    padding: 18,
    borderRadius: 22,
    marginBottom: 16,
  },
  distHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  distTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  distSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  distRow: {
    marginBottom: 14,
  },
  distLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  distEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  distName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  distCountText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginRight: 10,
  },
  distPercent: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: '#F0EBE5',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tipCard: {
    backgroundColor: '#F7F3FC',
    borderColor: '#E6DAF5',
    padding: 16,
    borderRadius: 18,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  tipText: {
    fontSize: 13,
    color: Colors.text,
    lineHeight: 19,
  },
});
