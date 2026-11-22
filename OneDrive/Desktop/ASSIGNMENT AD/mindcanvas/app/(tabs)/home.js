import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import CustomCard from '../../components/CustomCard';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Explorer 🌿</Text>
            <Text style={styles.subtitle}>How are you feeling today?</Text>
          </View>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="sparkles" size={20} color={Colors.primary} />
          </View>
        </View>

        {/* Daily Quote Card (ZenQuotes in Phase 5) */}
        <CustomCard style={[styles.card, styles.quoteCard]}>
          <Text style={styles.quoteTag}>✨ Daily Reflection</Text>
          <Text style={styles.quoteText}>
            "Feel it. Write it. Remember it."
          </Text>
          <Text style={styles.quoteAuthor}>— MindCanvas</Text>
        </CustomCard>

        {/* Quick Journal Action */}
        <CustomCard style={styles.card}>
          <Text style={styles.sectionTitle}>Daily Check-in</Text>
          <Text style={styles.sectionDesc}>
            Log your current mood or write a reflection for your journal.
          </Text>

          <View style={styles.actionRow}>
            <Button
              mode="contained"
              buttonColor={Colors.accent}
              textColor={Colors.text}
              icon="emoticon-happy-outline"
              style={styles.actionButton}
              onPress={() => router.push('/journal/mood')}
            >
              Log Mood
            </Button>

            <Button
              mode="contained"
              buttonColor={Colors.secondary}
              textColor={Colors.text}
              icon="pencil-outline"
              style={styles.actionButton}
              onPress={() => router.push('/journal/editor')}
            >
              New Entry
            </Button>
          </View>
        </CustomCard>

        {/* Setup Notice */}
        <CustomCard style={styles.card}>
          <Text style={styles.sectionTitle}>Phase 1 Status</Text>
          <Text style={styles.sectionDesc}>
            Home screen placeholder active. Journal entries and Firestore sync will be connected in Phase 4.
          </Text>
        </CustomCard>
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
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3EDFA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  card: {
    borderRadius: 16,
  },
  quoteCard: {
    backgroundColor: '#FFF1F5',
    borderColor: Colors.secondary,
  },
  quoteTag: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: Colors.text,
    lineHeight: 24,
  },
  quoteAuthor: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  sectionDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
  },
});
