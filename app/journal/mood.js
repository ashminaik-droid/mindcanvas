import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { MOODS } from '../../constants/Moods';
import MoodCard from '../../components/MoodCard';
import CustomButton from '../../components/CustomButton';

export default function MoodScreen() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState(MOODS[0]); // Default to first mood or null

  const handleContinue = () => {
    if (!selectedMood) return;

    router.push({
      pathname: '/journal/editor',
      params: {
        moodId: selectedMood.id,
        moodLabel: selectedMood.label,
        moodEmoji: selectedMood.emoji,
        moodColor: selectedMood.color,
      },
    });
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
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Your Mood</Text>
          <View style={{ width: 24 }} />
        </View>

        <Text style={styles.subtitle}>
          How are you feeling right now? Tap a mood that mirrors your headspace.
        </Text>

        {/* Mood Selection Grid */}
        <View style={styles.grid}>
          {MOODS.map((mood) => (
            <View key={mood.id} style={styles.gridItem}>
              <MoodCard
                mood={mood}
                isSelected={selectedMood?.id === mood.id}
                onSelect={(m) => setSelectedMood(m)}
              />
            </View>
          ))}
        </View>

        {/* Selected Mood Detail Banner */}
        {selectedMood && (
          <View style={[styles.selectedBanner, { backgroundColor: selectedMood.color }]}>
            <Text style={styles.bannerEmoji}>{selectedMood.emoji}</Text>
            <View style={styles.bannerInfo}>
              <Text style={styles.bannerTitle}>
                You selected: {selectedMood.label}
              </Text>
              <Text style={styles.bannerDesc}>
                Ready to pen down the thoughts behind this feeling?
              </Text>
            </View>
          </View>
        )}

        {/* Continue Button */}
        <CustomButton
          mode="contained"
          buttonColor={Colors.primary}
          textColor="#FFFFFF"
          icon="arrow-forward-outline"
          style={styles.continueButton}
          onPress={handleContinue}
          disabled={!selectedMood}
        >
          Continue to Reflection
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginVertical: 12,
    paddingHorizontal: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 16,
    gap: 12,
  },
  gridItem: {
    width: '48%',
  },
  selectedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  bannerEmoji: {
    fontSize: 34,
    marginRight: 14,
  },
  bannerInfo: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  bannerDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  continueButton: {
    borderRadius: 14,
    marginTop: 8,
  },
});
