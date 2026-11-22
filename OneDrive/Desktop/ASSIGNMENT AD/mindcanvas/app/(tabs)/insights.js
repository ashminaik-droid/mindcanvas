import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import CustomCard from '../../components/CustomCard';

export default function InsightsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="pie-chart-outline" size={36} color={Colors.primary} />
          <Text style={styles.title}>Mood Insights</Text>
          <Text style={styles.subtitle}>Analyze patterns, triggers and reflections</Text>
        </View>

        <CustomCard style={styles.card}>
          <Text style={styles.cardTitle}>📊 Analytics & Trends</Text>
          <Text style={styles.cardDesc}>
            Mood distribution charts and reflection analytics will be implemented in Phase 6.
          </Text>
        </CustomCard>
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
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  card: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
