import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import CustomCard from '../../components/CustomCard';

export default function EditorScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Journal Reflection</Text>
        </View>

        <Text style={styles.subtitle}>Write down your thoughts, reflections, and gratitude.</Text>

        <CustomCard style={styles.editorPlaceholder}>
          <Ionicons name="create-outline" size={32} color={Colors.primary} style={styles.icon} />
          <Text style={styles.cardTitle}>Reflection Editor</Text>
          <Text style={styles.cardDesc}>
            Full text editor with Firestore saving will be integrated in Phase 4.
          </Text>
        </CustomCard>

        <Button
          mode="contained"
          buttonColor={Colors.primary}
          textColor="#FFFFFF"
          style={styles.doneButton}
          onPress={() => router.push('/(tabs)/home')}
        >
          Return to Home
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
    marginBottom: 20,
  },
  editorPlaceholder: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
  },
  doneButton: {
    borderRadius: 12,
    marginTop: 'auto',
  },
});
