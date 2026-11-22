import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

export default function MoodCard({
  mood,
  isSelected = false,
  onSelect,
  style,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onSelect && onSelect(mood)}
      style={[
        styles.card,
        { backgroundColor: mood.color },
        isSelected && styles.selectedCard,
        style,
      ]}
    >
      {isSelected && (
        <View style={styles.checkBadge}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
        </View>
      )}
      <Text style={styles.emoji}>{mood.emoji}</Text>
      <Text style={[styles.label, { color: mood.textColor || Colors.text }]}>
        {mood.label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  selectedCard: {
    borderColor: Colors.primary,
    borderWidth: 2.5,
    shadowOpacity: 0.15,
    elevation: 4,
    transform: [{ scale: 1.03 }],
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  emoji: {
    fontSize: 38,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
