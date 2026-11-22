import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { Colors } from '../constants/Colors';

export default function CustomButton({
  children,
  mode = 'contained',
  buttonColor,
  textColor,
  icon,
  onPress,
  loading = false,
  disabled = false,
  style,
  labelStyle,
}) {
  const isContained = mode === 'contained';
  const defaultBg = isContained ? (buttonColor || Colors.primary) : 'transparent';
  const defaultText = textColor || (isContained ? '#FFFFFF' : Colors.text);

  return (
    <Button
      mode={mode}
      buttonColor={defaultBg}
      textColor={defaultText}
      icon={icon}
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      style={[
        styles.button,
        mode === 'outlined' && styles.outlined,
        style,
      ]}
      labelStyle={[styles.label, labelStyle]}
    >
      {children}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    paddingVertical: 3,
  },
  outlined: {
    borderColor: Colors.border,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
