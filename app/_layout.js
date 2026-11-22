import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, MD3LightTheme, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { AuthProvider, useAuth } from '../context/AuthContext';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.primary,
    secondary: Colors.secondary,
    background: Colors.background,
    surface: Colors.card,
    onSurface: Colors.text,
  },
};

/**
 * Handles protected route navigation based on user authentication state
 */
function RootNavigation() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';
    const inJournalGroup = segments[0] === 'journal';
    const inFavourites = segments[0] === 'favourites';

    if (!user && (inTabsGroup || inJournalGroup || inFavourites)) {
      // User is logged out but trying to access protected screens
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // User is logged in but on login/register screens
      router.replace('/(tabs)/home');
    }
  }, [user, loading, segments]);

  // While checking auth status on app start, show soft pastel splash loader
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="sparkles" size={40} color={Colors.primary} />
        </View>
        <Text style={styles.loadingTitle}>MindCanvas</Text>
        <Text style={styles.loadingSubtitle}>Feel it. Write it. Remember it.</Text>
        <ActivityIndicator
          size="small"
          color={Colors.primary}
          style={styles.spinner}
        />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="journal" />
      <Stack.Screen name="favourites" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <StatusBar style="dark" backgroundColor={Colors.background} />
        <RootNavigation />
      </AuthProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3EDFA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.secondary,
    marginBottom: 16,
  },
  loadingTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
    marginBottom: 24,
  },
  spinner: {
    marginTop: 8,
  },
});
