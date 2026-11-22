import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import CustomCard from '../../components/CustomCard';
import JournalCard from '../../components/JournalCard';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../context/AuthContext';
import { subscribeToEntries, deleteEntry } from '../../services/journal';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calendar month/year navigation state
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  // Subscribe to real-time entries for current user
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
        console.warn('Calendar entries subscription error:', err.message);
        setLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user?.uid]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Get total days in month and day offset for 1st of month
  const totalDays = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  // Map entries by date key: YYYY-MM-DD -> array of entries
  const entriesByDate = useMemo(() => {
    const map = {};
    entries.forEach((e) => {
      let dateKey = e.date;
      if (!dateKey && e.createdAt?.toDate) {
        dateKey = e.createdAt.toDate().toISOString().split('T')[0];
      }
      if (dateKey) {
        if (!map[dateKey]) map[dateKey] = [];
        map[dateKey].push(e);
      }
    });
    return map;
  }, [entries]);

  // Handlers for month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  // Helper to construct YYYY-MM-DD for a day number in current month
  const getDayKey = (dayNumber) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
  };

  const selectedDateKey = selectedDay ? getDayKey(selectedDay) : null;
  const entriesForSelectedDay = selectedDateKey ? entriesByDate[selectedDateKey] || [] : [];

  // Edit handler
  const handleEdit = (entry) => {
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

  // Delete handler
  const handleDelete = (entry) => {
    const confirmDelete = async () => {
      try {
        await deleteEntry(user.uid, entry.id);
      } catch (err) {
        console.error('Delete error:', err);
        Alert.alert('Error', 'Could not delete entry. Please try again.');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Delete reflection "${entry.title}"?`)) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        'Delete Reflection',
        `Are you sure you want to delete "${entry.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: confirmDelete },
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Mood Calendar</Text>
          <Text style={styles.subtitle}>Trace your emotional journey day by day</Text>
        </View>

        {/* Calendar Card */}
        <CustomCard style={styles.calendarCard}>
          {/* Month / Year Bar */}
          <View style={styles.monthBar}>
            <TouchableOpacity onPress={prevMonth} style={styles.navButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="chevron-back" size={22} color={Colors.text} />
            </TouchableOpacity>

            <Text style={styles.monthTitle}>{monthName}</Text>

            <TouchableOpacity onPress={nextMonth} style={styles.navButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="chevron-forward" size={22} color={Colors.text} />
            </TouchableOpacity>
          </View>

          {/* Weekday Labels */}
          <View style={styles.weekdaysRow}>
            {WEEKDAYS.map((day, idx) => (
              <Text key={idx} style={styles.weekdayLabel}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Days Grid */}
          <View style={styles.daysGrid}>
            {/* Blanks for days before 1st of month */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <View key={`blank-${i}`} style={styles.dayCell} />
            ))}

            {/* Days in current month */}
            {Array.from({ length: totalDays }).map((_, i) => {
              const dayNumber = i + 1;
              const dateKey = getDayKey(dayNumber);
              const dayEntries = entriesByDate[dateKey] || [];
              const hasEntry = dayEntries.length > 0;
              const primaryEntry = hasEntry ? dayEntries[0] : null;
              const isSelected = selectedDay === dayNumber;

              return (
                <TouchableOpacity
                  key={`day-${dayNumber}`}
                  activeOpacity={0.7}
                  style={[
                    styles.dayCell,
                    isSelected && styles.selectedDayCell,
                    hasEntry && !isSelected && { backgroundColor: primaryEntry.moodColor || '#FFF3B0' },
                  ]}
                  onPress={() => setSelectedDay(dayNumber)}
                >
                  <Text
                    style={[
                      styles.dayNumber,
                      isSelected && styles.selectedDayNumber,
                    ]}
                  >
                    {dayNumber}
                  </Text>
                  {hasEntry && (
                    <Text style={styles.dayEmoji}>{primaryEntry.emoji || '😌'}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </CustomCard>

        {/* Selected Date Entry Preview */}
        <View style={styles.previewSection}>
          <Text style={styles.previewHeader}>
            {selectedDay
              ? `Reflections for ${currentDate.toLocaleDateString('en-US', { month: 'short' })} ${selectedDay}`
              : 'Select a Date'}
          </Text>

          {loading && (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          )}

          {!loading && entriesForSelectedDay.length > 0 && (
            entriesForSelectedDay.map((entry) => (
              <JournalCard
                key={entry.id}
                entry={entry}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}

          {!loading && entriesForSelectedDay.length === 0 && (
            <CustomCard style={styles.emptyCard}>
              <Ionicons name="sparkles-outline" size={32} color={Colors.primary} />
              <Text style={styles.emptyTitle}>No reflections on this day</Text>
              <Text style={styles.emptyDesc}>
                Take a moment to write about your day or thoughts.
              </Text>
              <CustomButton
                mode="contained"
                buttonColor={Colors.secondary}
                textColor={Colors.text}
                icon="pencil-outline"
                style={styles.addEntryButton}
                onPress={() =>
                  router.push({
                    pathname: '/journal/mood',
                    params: { date: selectedDateKey },
                  })
                }
              >
                Write an Entry
              </CustomButton>
            </CustomCard>
          )}
        </View>
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
    paddingBottom: 30,
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
  calendarCard: {
    padding: 16,
    borderRadius: 22,
    marginBottom: 20,
  },
  monthBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3EDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 8,
  },
  weekdayLabel: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginVertical: 2,
  },
  selectedDayCell: {
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: '#7B61B8',
  },
  dayNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
  selectedDayNumber: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  dayEmoji: {
    fontSize: 11,
    marginTop: 1,
  },
  previewSection: {
    marginTop: 6,
  },
  previewHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
  },
  loadingBox: {
    padding: 20,
    alignItems: 'center',
  },
  emptyCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 18,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
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
  addEntryButton: {
    borderRadius: 12,
  },
});
