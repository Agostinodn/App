import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing, borderRadius } from '../theme';

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
}) => {
  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[styles.wrapper, style]}
      >
        <LinearGradient
          colors={isDisabled ? ['#A9DFBF', '#A9DFBF'] : colors.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.base, styles[size]]}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} size="small" />
          ) : (
            <View style={styles.row}>
              {icon && <View style={styles.iconLeft}>{icon}</View>}
              <Text style={[styles.label, styles.labelPrimary, styles[`label_${size}`]]}>
                {title}
              </Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.7}
        style={[styles.base, styles[size], styles.outline, isDisabled && styles.disabledOutline, style]}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} size="small" />
        ) : (
          <View style={styles.row}>
            {icon && <View style={styles.iconLeft}>{icon}</View>}
            <Text style={[styles.label, styles.labelOutline, styles[`label_${size}`]]}>
              {title}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  if (variant === 'ghost') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.6}
        style={[styles.base, styles[size], style]}
      >
        <Text style={[styles.label, styles.labelGhost, styles[`label_${size}`]]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },

  // Sizes
  sm: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 40,
  },
  md: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    minHeight: 52,
  },
  lg: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    minHeight: 60,
  },

  // Labels
  label: {
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 0.3,
  },
  label_sm: { fontSize: typography.fontSize.sm },
  label_md: { fontSize: typography.fontSize.base },
  label_lg: { fontSize: typography.fontSize.md },

  labelPrimary: {
    color: colors.white,
  },
  labelOutline: {
    color: colors.primary,
  },
  labelGhost: {
    color: colors.primary,
  },

  // Variants
  outline: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  disabledOutline: {
    borderColor: colors.border,
    opacity: 0.6,
  },
});
