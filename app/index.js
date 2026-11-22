import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import CustomCard from '../components/CustomCard';
import { useAuth } from '../context/AuthContext';

export default function IndexScreen() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* App Logo / Badge */}
        <View style={styles.iconCircle}>
          <Ionicons name="sparkles" size={48} color={Colors.primary} />
        </View>

        {/* Title & Tagline */}
        <Text style={styles.title}>MindCanvas</Text>
        <Text style={styles.tagline}>Feel it. Write it. Remember it.</Text>

        {/* Welcome / Action Card */}
        <CustomCard style={styles.card}>
          {user ? (
            <>
              <Text style={styles.cardTitle}>
                Welcome back, {user.displayName || 'Explorer'} ✨
              </Text>
              <Text style={styles.cardDesc}>
                You are currently signed in as {user.email}. Ready to reflect today?
              </Text>

              <Button
                mode="contained"
                buttonColor={Colors.primary}
                textColor="#FFFFFF"
                style={styles.button}
                labelStyle={styles.buttonText}
                onPress={() => router.replace('/(tabs)/home')}
              >
                Go to Home Journal
              </Button>
            </>
          ) : (
            <>
              <Text style={styles.cardTitle}>Visual Mood & Reflection Journal</Text>
              <Text style={styles.cardDesc}>
                A peaceful, pastel space to track your daily feelings, reflect on moments, and cultivate mindfulness.
              </Text>

              <Button
                mode="contained"
                buttonColor={Colors.primary}
                textColor="#FFFFFF"
                style={styles.button}
                labelStyle={styles.buttonText}
                onPress={() => router.push('/(auth)/login')}
              >
                Sign In
              </Button>

              <Button
                mode="outlined"
                textColor={Colors.text}
                style={[styles.button, styles.outlineButton]}
                labelStyle={styles.buttonText}
                onPress={() => router.push('/(auth)/register')}
              >
                Create Account
              </Button>
            </>
          )}
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F3EDFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 6,
    marginBottom: 32,
    fontStyle: 'italic',
  },
  card: {
    width: '100%',
    padding: 12,
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
    marginBottom: 20,
  },
  button: {
    borderRadius: 12,
    marginVertical: 6,
  },
  outlineButton: {
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 2,
  },
});
