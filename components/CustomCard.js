import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from 'react-native-paper';
import { Colors } from '../constants/Colors';

export default function CustomCard({ children, style }) {
  return (
    <Card style={[styles.card, style]}>
      <View style={styles.content}>
        {children}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    elevation: 2,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  content: {
    padding: 16,
  },
});
