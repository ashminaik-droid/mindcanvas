import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import CustomCard from '../../components/CustomCard';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Logout Error', 'Could not sign out. Please try again.');
    } finally {
      setLoggingOut(false);
    }
  };

  const displayName = user?.displayName || 'MindCanvas Explorer';
  const email = user?.email || 'No email registered';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* User Avatar & Name */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        {/* Profile Card */}
        <CustomCard style={styles.card}>
          <Text style={styles.cardTitle}>👤 Account Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={styles.infoValue}>Authenticated (Firebase)</Text>
          </View>
          {user?.uid ? (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>User ID:</Text>
              <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="middle">
                {user.uid}
              </Text>
            </View>
          ) : null}
        </CustomCard>

        {/* Settings & Logout Card */}
        <CustomCard style={styles.card}>
          <Text style={styles.cardTitle}>⚙️ Session & Settings</Text>
          <Text style={styles.cardDesc}>
            Additional profile customization, dark/pastel mode toggles, and statistics will be added in Phase 6.
          </Text>

          {/* Logout Button */}
          <Button
            mode="contained"
            buttonColor="#FFD2CE"
            textColor="#B71C1C"
            icon="logout"
            style={styles.logoutButton}
            labelStyle={styles.logoutButtonLabel}
            onPress={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <ActivityIndicator color="#B71C1C" size={18} />
            ) : (
              'Sign Out'
            )}
          </Button>
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
    marginVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3EDFA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
  },
  email: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 18,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 10,
  },
  cardDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: Colors.text,
    fontWeight: '600',
    maxWidth: '65%',
  },
  logoutButton: {
    borderRadius: 12,
    marginTop: 4,
  },
  logoutButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
});
