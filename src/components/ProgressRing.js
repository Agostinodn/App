import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

/**
 * Lightweight progress ring built with pure View — no SVG dependency needed.
 * Uses two half-circle masks (left / right) to draw an arc.
 */
export const ProgressRing = ({
  size = 80,
  progress = 0,        // 0–100
  color = colors.primary,
  bg = colors.border,
  strokeWidth = 7,
  label,
  sublabel,
}) => {
  const half = size / 2;
  const clampedProgress = Math.min(100, Math.max(0, progress));

  // Degrees for left and right half fills
  const leftRotate = clampedProgress > 50
    ? 180
    : (clampedProgress / 50) * 180;
  const rightRotate = clampedProgress > 50
    ? ((clampedProgress - 50) / 50) * 180
    : 0;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background ring */}
      <View
        style={[
          styles.ringBg,
          {
            width: size,
            height: size,
            borderRadius: half,
            borderWidth: strokeWidth,
            borderColor: bg,
          },
        ]}
      />

      {/* Right-half fill */}
      <View
        style={[
          styles.halfContainer,
          { width: half, height: size, left: half },
        ]}
      >
        <View
          style={[
            styles.halfFill,
            {
              width: half,
              height: size,
              borderTopRightRadius: half,
              borderBottomRightRadius: half,
              borderWidth: strokeWidth,
              borderColor: color,
              borderLeftWidth: 0,
              transform: [
                { translateX: -half / 2 },
                { rotate: `${rightRotate}deg` },
                { translateX: half / 2 },
              ],
            },
          ]}
        />
      </View>

      {/* Left-half fill */}
      {clampedProgress > 50 && (
        <View
          style={[
            styles.halfContainer,
            { width: half, height: size, left: 0 },
          ]}
        >
          <View
            style={[
              styles.halfFill,
              {
                width: half,
                height: size,
                borderTopLeftRadius: half,
                borderBottomLeftRadius: half,
                borderWidth: strokeWidth,
                borderColor: color,
                borderRightWidth: 0,
                transform: [
                  { translateX: half / 2 },
                  { rotate: `${-(leftRotate - 180)}deg` },
                  { translateX: -half / 2 },
                ],
              },
            ]}
          />
        </View>
      )}

      {/* Center label */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.center}>
          {label !== undefined && (
            <Text style={[styles.label, { color }]}>{label}</Text>
          )}
          {sublabel !== undefined && (
            <Text style={styles.sublabel}>{sublabel}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ringBg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  halfContainer: {
    position: 'absolute',
    top: 0,
    overflow: 'hidden',
  },
  halfFill: {
    position: 'absolute',
    top: 0,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    lineHeight: 22,
  },
  sublabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
  },
});
