import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import CustomCard from '../../components/CustomCard';
import { useAuth } from '../../context/AuthContext';
import { getAuthErrorMessage } from '../../services/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Email format validation helper
  const isValidEmail = (emailStr) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr.trim());
  };

  const handleRegister = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    // Field validations
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter a password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-check.');
      return;
    }

    try {
      setLoading(true);
      await register(fullName.trim(), email.trim(), password);
      setSuccessMessage('Account created successfully! Welcome to MindCanvas ✨');
      // The auth listener in RootLayout / AuthContext will handle navigation
    } catch (error) {
      const friendlyMessage = getAuthErrorMessage(error);
      setErrorMessage(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="sparkles" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Join MindCanvas</Text>
            <Text style={styles.subtitle}>
              Begin your visual journey of thoughts and reflections
            </Text>
          </View>

          {/* Form Card */}
          <CustomCard style={styles.card}>
            {/* Error Message Banner */}
            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={18} color="#D9534F" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Success Message Banner */}
            {successMessage ? (
              <View style={styles.successBanner}>
                <Ionicons name="checkmark-circle" size={18} color="#388E3C" />
                <Text style={styles.successText}>{successMessage}</Text>
              </View>
            ) : null}

            {/* Full Name Input */}
            <TextInput
              label="Full Name"
              value={fullName}
              onChangeText={(text) => {
                setFullName(text);
                if (errorMessage) setErrorMessage('');
              }}
              mode="outlined"
              outlineColor={Colors.border}
              activeOutlineColor={Colors.primary}
              textColor={Colors.text}
              style={styles.input}
              left={<TextInput.Icon icon="account-outline" color={Colors.textSecondary} />}
              disabled={loading}
              autoCapitalize="words"
            />

            {/* Email Input */}
            <TextInput
              label="Email Address"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errorMessage) setErrorMessage('');
              }}
              mode="outlined"
              outlineColor={Colors.border}
              activeOutlineColor={Colors.primary}
              textColor={Colors.text}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email-outline" color={Colors.textSecondary} />}
              disabled={loading}
            />

            {/* Password Input */}
            <TextInput
              label="Password (min 6 characters)"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage) setErrorMessage('');
              }}
              mode="outlined"
              outlineColor={Colors.border}
              activeOutlineColor={Colors.primary}
              textColor={Colors.text}
              style={styles.input}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              left={<TextInput.Icon icon="lock-outline" color={Colors.textSecondary} />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  color={Colors.textSecondary}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              disabled={loading}
            />

            {/* Confirm Password Input */}
            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errorMessage) setErrorMessage('');
              }}
              mode="outlined"
              outlineColor={Colors.border}
              activeOutlineColor={Colors.primary}
              textColor={Colors.text}
              style={styles.input}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              left={<TextInput.Icon icon="lock-check-outline" color={Colors.textSecondary} />}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  color={Colors.textSecondary}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
              disabled={loading}
            />

            {/* Submit Button */}
            <Button
              mode="contained"
              buttonColor={Colors.primary}
              textColor="#FFFFFF"
              style={styles.submitButton}
              labelStyle={styles.submitButtonLabel}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size={20} />
              ) : (
                'Create Account'
              )}
            </Button>

            {/* Link to Login */}
            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/login')}
                disabled={loading}
              >
                <Text style={styles.loginLink}> Log In</Text>
              </TouchableOpacity>
            </View>
          </CustomCard>

          {/* Back to Welcome */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/')}
            disabled={loading}
          >
            <Text style={styles.backButtonText}>← Back to Welcome</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingVertical: 16,
    justifyContent: 'center',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F3EDFA',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.secondary,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 280,
  },
  card: {
    padding: 16,
    borderRadius: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDEDED',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#F5C6CB',
  },
  errorText: {
    color: '#D9534F',
    fontSize: 13,
    flex: 1,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF7ED',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#C3E6CB',
  },
  successText: {
    color: '#2E7D32',
    fontSize: 13,
    flex: 1,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 14,
    borderRadius: 12,
    paddingVertical: 4,
  },
  submitButtonLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  footerText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  loginLink: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  backButton: {
    marginTop: 18,
    alignSelf: 'center',
    padding: 8,
  },
  backButtonText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
