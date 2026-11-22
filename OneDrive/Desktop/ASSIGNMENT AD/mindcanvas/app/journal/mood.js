import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { MOODS } from '../../constants/Moods';
import CustomCard from '../../components/CustomCard';

export default function MoodScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Select Your Mood</Text>
        </View>

        <Text style={styles.subtitle}>Choose what best represents your headspace right now:</Text>

        <View style={styles.moodsGrid}>
          {MOODS.map((mood) => (
            <CustomCard key={mood.id} style={[styles.moodCard, { backgroundColor: mood.color }]}>
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={styles.moodLabel}>{mood.label}</Text>
            </CustomCard>
          ))}
        </View>

        <Button
          mode="contained"
          buttonColor={Colors.primary}
          textColor="#FFFFFF"
          style={styles.continueButton}
          onPress={() => router.push('/journal/editor')}
        >
          Continue to Reflection
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 24,
  },
  moodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  moodCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
  },
  moodEmoji: {
    fontSize: 36,
    marginBottom: 6,
    textAlign: 'center',
  },
  moodLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  continueButton: {
    borderRadius: 12,
    marginTop: 'auto',
  },
});
