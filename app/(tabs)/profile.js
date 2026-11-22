import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import CustomCard from '../../components/CustomCard';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const displayName = user?.displayName || 'MindCanvas Explorer';
  const email = user?.email || 'explorer@mindcanvas.app';

  // Compute initials for the avatar (e.g. "Jane Doe" -> "JD")
  const getInitials = (name) => {
    if (!name) return 'MC';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleLogout = async () => {
    const performLogout = async () => {
      try {
        setLoggingOut(true);
        await logout();
        router.replace('/(auth)/login');
      } catch (error) {
        console.error('Logout error:', error);
        Alert.alert('Sign Out Error', 'Unable to log out right now. Please try again.');
      } finally {
        setLoggingOut(false);
      }
    };

    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm('Are you sure you want to sign out of MindCanvas?');
      if (confirmLogout) {
        await performLogout();
      }
    } else {
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out of your account?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign Out', style: 'destructive', onPress: performLogout },
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
        {/* Header Avatar and User Info */}
        <View style={styles.header}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitials}>{getInitials(displayName)}</Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        {/* Account Details Card */}
        <CustomCard style={styles.card}>
          <Text style={styles.cardTitle}>Account Overview</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelGroup}>
              <Ionicons name="shield-checkmark-outline" size={18} color={Colors.primary} />
              <Text style={styles.infoLabel}>Authentication</Text>
            </View>
            <Text style={styles.infoValue}>Firebase Auth</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelGroup}>
              <Ionicons name="sparkles-outline" size={18} color={Colors.primary} />
              <Text style={styles.infoLabel}>App Name</Text>
            </View>
            <Text style={styles.infoValue}>MindCanvas</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoLabelGroup}>
              <Ionicons name="code-slash-outline" size={18} color={Colors.primary} />
              <Text style={styles.infoLabel}>Version</Text>
            </View>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>
        </CustomCard>

        {/* Saved Quotes Link Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/favourites')}
        >
          <CustomCard style={styles.card}>
            <View style={styles.linkRow}>
              <View style={styles.linkLeftGroup}>
                <View style={styles.heartIconCircle}>
                  <Ionicons name="heart" size={18} color="#E63946" />
                </View>
                <View>
                  <Text style={styles.linkTitle}>Favourite Quotes</Text>
                  <Text style={styles.linkSubtitle}>View your saved ZenQuotes reflections</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
            </View>
          </CustomCard>
        </TouchableOpacity>

        {/* Preferences / Reflection Settings Card */}
        <CustomCard style={styles.card}>
          <Text style={styles.cardTitle}>Mindfulness & Cloud Status</Text>
          <Text style={styles.cardDesc}>
            Your reflections and favourite quotes are securely synchronized in real-time with Firebase Cloud Firestore.
          </Text>

          <View style={styles.pillFeatureRow}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>✨ Pastel Theme Active</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>☁️ Cloud Firestore Synced</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>🌿 ZenQuotes API Live</Text>
            </View>
          </View>
        </CustomCard>

        {/* Sign Out Card */}
        <CustomCard style={[styles.card, styles.logoutCard]}>
          <Text style={styles.logoutCardTitle}>Session Management</Text>
          <Text style={styles.logoutCardDesc}>
            Signing out will return you to the login screen. Your reflections are preserved.
          </Text>

          <CustomButton
            mode="contained"
            buttonColor="#FFD2CE"
            textColor="#B71C1C"
            icon="log-out-outline"
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <ActivityIndicator color="#B71C1C" size={18} />
            ) : (
              'Sign Out'
            )}
          </CustomButton>
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginVertical: 18,
  },
  avatarCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#F3EDFA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: Colors.primary,
    marginBottom: 12,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarInitials: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1,
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
    padding: 18,
    borderRadius: 22,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 14,
  },
  cardDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  linkLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heartIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFE6E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  linkSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  pillFeatureRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pill: {
    backgroundColor: '#F8F4EE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '600',
  },
  logoutCard: {
    borderColor: '#FFD6B0',
    backgroundColor: '#FFFBF7',
  },
  logoutCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  logoutCardDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 14,
    lineHeight: 18,
  },
  logoutButton: {
    borderRadius: 14,
  },
});
