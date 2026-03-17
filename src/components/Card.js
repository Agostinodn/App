import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../theme';

export const Card = ({ children, style, variant = 'default' }) => {
  return (
    <View style={[styles.card, styles[variant], style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  green: {
    backgroundColor: colors.primaryUltraLight,
    borderColor: colors.primaryLight,
    shadowColor: colors.primary,
    shadowOpacity: 0.08,
  },
  flat: {
    shadowOpacity: 0,
    elevation: 0,
    borderColor: colors.border,
  },
});
