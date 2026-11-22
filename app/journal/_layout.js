import React from 'react';
import { Stack } from 'expo-router';
import { Colors } from '../../constants/Colors';

export default function JournalLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="mood" />
      <Stack.Screen name="editor" />
    </Stack>
  );
}
