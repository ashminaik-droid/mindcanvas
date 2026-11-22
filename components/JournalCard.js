import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import CustomCard from './CustomCard';

export default function JournalCard({ entry, onPress, onEdit, onDelete, style }) {
  const { title, reflection, date } = entry;
  const moodLabel = entry.mood || entry.moodLabel || 'Calm';
  const moodEmoji = entry.emoji || entry.moodEmoji || '😌';
  const moodColor = entry.moodColor || Colors.accent;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      disabled={!onPress}
    >
      <CustomCard style={[styles.card, style]}>
        {/* Top Header: Mood Badge + Date */}
        <View style={styles.topRow}>
          <View style={[styles.moodBadge, { backgroundColor: moodColor }]}>
            <Text style={styles.moodEmoji}>{moodEmoji}</Text>
            <Text style={styles.moodLabel}>{moodLabel}</Text>
          </View>
          <Text style={styles.dateText}>{date}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {/* Reflection Excerpt */}
        <Text style={styles.reflection} numberOfLines={3}>
          {reflection}
        </Text>

        {/* Actions Row (Edit & Delete) */}
        {(onEdit || onDelete) && (
          <View style={styles.actionsRow}>
            {onEdit && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={(e) => {
                  e.stopPropagation && e.stopPropagation();
                  onEdit(entry);
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="pencil-outline" size={15} color={Colors.primary} />
                <Text style={styles.editActionText}>Edit</Text>
              </TouchableOpacity>
            )}

            {onDelete && (
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={(e) => {
                  e.stopPropagation && e.stopPropagation();
                  onDelete(entry);
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="trash-outline" size={15} color="#D9534F" />
                <Text style={styles.deleteActionText}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </CustomCard>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  moodEmoji: {
    fontSize: 16,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
  dateText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 6,
  },
  reflection: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F5ECE3',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: '#F8F4EE',
    gap: 5,
  },
  deleteButton: {
    backgroundColor: '#FDF2F2',
  },
  editActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  deleteActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D9534F',
  },
});
