import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, ActivityIndicator } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import CustomCard from '../../components/CustomCard';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../context/AuthContext';
import { createEntry, updateEntry } from '../../services/journal';

export default function EditorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();

  // If entryId is provided, we are in Edit Mode
  const isEditMode = Boolean(params.entryId);

  // Retrieve mood from navigation parameters with sensible fallbacks
  const moodLabel = params.moodLabel || params.mood || 'Calm';
  const moodEmoji = params.moodEmoji || params.emoji || '😌';
  const moodColor = params.moodColor || '#E2D4F0';

  const [title, setTitle] = useState(params.initialTitle || '');
  const [reflection, setReflection] = useState(params.initialReflection || '');
  const [errorMessage, setErrorMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setErrorMessage('');

    if (!user) {
      setErrorMessage('You must be logged in to save journal reflections.');
      return;
    }

    if (!title.trim()) {
      setErrorMessage('Please enter a title for your reflection.');
      return;
    }

    if (!reflection.trim()) {
      setErrorMessage('Please write your thoughts or reflection.');
      return;
    }

    try {
      setSaving(true);

      if (isEditMode) {
        // Update existing entry in Firestore
        await updateEntry(user.uid, params.entryId, {
          title: title.trim(),
          reflection: reflection.trim(),
          mood: moodLabel,
          emoji: moodEmoji,
          moodColor: moodColor,
        });
      } else {
        // Create new entry in Firestore
        const todayDate = params.date || new Date().toISOString().split('T')[0];
        await createEntry(user.uid, {
          title: title.trim(),
          reflection: reflection.trim(),
          mood: moodLabel,
          emoji: moodEmoji,
          moodColor: moodColor,
          date: todayDate,
        });
      }

      const successTitle = isEditMode ? 'Reflection Updated ✨' : 'Reflection Saved ✨';
      const successMsg = isEditMode
        ? 'Your journal changes have been saved to Cloud Firestore.'
        : 'Your new reflection is safely stored in Cloud Firestore.';

      if (Platform.OS === 'web') {
        alert(`${successTitle}\n${successMsg}`);
        router.replace('/(tabs)/home');
      } else {
        Alert.alert(
          successTitle,
          successMsg,
          [
            {
              text: 'Return Home',
              onPress: () => router.replace('/(tabs)/home'),
            },
          ]
        );
      }
    } catch (error) {
      console.error('Firestore save/update error:', error);
      let userFriendlyMsg = 'Could not save your reflection. Please check your network and Firebase configuration.';
      if (error?.code === 'permission-denied') {
        userFriendlyMsg = 'Permission denied. Please verify your Firestore security rules.';
      }
      setErrorMessage(userFriendlyMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
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
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.cancelIconButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              disabled={saving}
            >
              <Ionicons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isEditMode ? 'Edit Reflection' : 'New Reflection'}
            </Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Mood Badge Card */}
          <CustomCard style={[styles.moodCard, { backgroundColor: moodColor }]}>
            <View style={styles.moodBadgeContent}>
              <Text style={styles.moodEmoji}>{moodEmoji}</Text>
              <View style={styles.moodTexts}>
                <Text style={styles.feelingTag}>SELECTED MOOD</Text>
                <Text style={styles.moodTitle}>{moodLabel}</Text>
              </View>
              <TouchableOpacity
                style={styles.changeMoodButton}
                onPress={() => router.push('/journal/mood')}
                disabled={saving}
              >
                <Text style={styles.changeMoodText}>Change</Text>
              </TouchableOpacity>
            </View>
          </CustomCard>

          {/* Error Banner */}
          {errorMessage ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color="#D9534F" />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Reflection Title</Text>
            <TextInput
              mode="outlined"
              placeholder="E.g., Morning thoughts, A small win..."
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errorMessage) setErrorMessage('');
              }}
              outlineColor={Colors.border}
              activeOutlineColor={Colors.primary}
              textColor={Colors.text}
              style={styles.input}
              placeholderTextColor={Colors.textSecondary}
              disabled={saving}
            />
          </View>

          {/* Multiline Reflection Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Write Your Reflection</Text>
            <TextInput
              mode="outlined"
              placeholder="What made you feel this way? What are you grateful for today?"
              value={reflection}
              onChangeText={(text) => {
                setReflection(text);
                if (errorMessage) setErrorMessage('');
              }}
              multiline
              numberOfLines={8}
              outlineColor={Colors.border}
              activeOutlineColor={Colors.primary}
              textColor={Colors.text}
              style={[styles.input, styles.multilineInput]}
              placeholderTextColor={Colors.textSecondary}
              disabled={saving}
            />
          </View>

          {/* Cloud Sync Status Note */}
          <View style={styles.infoNote}>
            <Ionicons name="cloud-done-outline" size={18} color={Colors.primary} />
            <Text style={styles.infoNoteText}>
              Your reflections are synchronized securely to Cloud Firestore under your account.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <CustomButton
              mode="outlined"
              textColor={Colors.text}
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={saving}
            >
              Cancel
            </CustomButton>

            <CustomButton
              mode="contained"
              buttonColor={Colors.primary}
              textColor="#FFFFFF"
              icon={isEditMode ? 'checkmark-circle-outline' : 'cloud-upload-outline'}
              style={styles.saveButton}
              onPress={handleSave}
              loading={saving}
              disabled={saving}
            >
              {saving ? 'Saving...' : (isEditMode ? 'Update Entry' : 'Save Entry')}
            </CustomButton>
          </View>
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cancelIconButton: {
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
  moodCard: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 18,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  moodBadgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 36,
    marginRight: 14,
  },
  moodTexts: {
    flex: 1,
  },
  feelingTag: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  moodTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  changeMoodButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  changeMoodText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDEDED',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#F5C6CB',
  },
  errorText: {
    color: '#D9534F',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    fontSize: 15,
  },
  multilineInput: {
    minHeight: 140,
    textAlignVertical: 'top',
  },
  infoNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EDFA',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  infoNoteText: {
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
});
