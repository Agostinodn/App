import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography, spacing, borderRadius } from '../theme';

const { width } = Dimensions.get('window');

const LEVEL_CONFIG = {
  principiante: { label: 'Principiante', bg: colors.levels.principianteBg, color: colors.levels.principiante },
  intermedio: { label: 'Intermedio', bg: colors.levels.intermedioBg, color: colors.levels.intermedio },
  avanzato: { label: 'Avanzato', bg: colors.levels.avanzatoBg, color: colors.levels.avanzato },
  tutti: { label: 'Tutti i livelli', bg: colors.levels.tuttiBg, color: colors.levels.tutti },
};

export const CourseCard = ({ course, onPress, variant = 'default' }) => {
  const levelCfg = LEVEL_CONFIG[course.level] || LEVEL_CONFIG.tutti;

  if (variant === 'featured') {
    return (
      <TouchableOpacity
        style={styles.featured}
        onPress={onPress}
        activeOpacity={0.88}
      >
        <LinearGradient
          colors={[course.colorFrom, course.colorTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.featuredGradient}
        >
          {course.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NUOVO</Text>
            </View>
          )}
          <View style={styles.featuredEmoji}>
            <Text style={styles.emojiText}>{course.emoji}</Text>
          </View>
          <View style={styles.featuredContent}>
            <View style={[styles.levelBadge, { backgroundColor: 'rgba(255,255,255,0.22)' }]}>
              <Text style={[styles.levelText, { color: '#fff' }]}>{levelCfg.label}</Text>
            </View>
            <Text style={styles.featuredTitle}>{course.title}</Text>
            <Text style={styles.featuredSubtitle}>{course.subtitle}</Text>
            <View style={styles.featuredMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={13} color="rgba(255,255,255,0.8)" />
                <Text style={styles.metaText}>{course.duration}</Text>
              </View>
              <View style={styles.metaDot} />
              <View style={styles.metaItem}>
                <Ionicons name="play-circle-outline" size={13} color="rgba(255,255,255,0.8)" />
                <Text style={styles.metaText}>{course.lessonsCount} lezioni</Text>
              </View>
              <View style={styles.metaDot} />
              <View style={styles.metaItem}>
                <Ionicons name="star" size={12} color="rgba(255,255,255,0.9)" />
                <Text style={styles.metaText}>{course.rating}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'compact') {
    return (
      <TouchableOpacity style={styles.compact} onPress={onPress} activeOpacity={0.85}>
        <LinearGradient
          colors={[course.colorFrom, course.colorTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.compactIcon}
        >
          <Text style={styles.compactEmoji}>{course.emoji}</Text>
        </LinearGradient>
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={1}>{course.title}</Text>
          <Text style={styles.compactInstructor} numberOfLines={1}>{course.instructor}</Text>
          <View style={styles.compactMeta}>
            <Ionicons name="time-outline" size={11} color={colors.textMuted} />
            <Text style={styles.compactMetaText}>{course.totalMinutes} min</Text>
            <View style={styles.metaDot} />
            <Text style={styles.compactMetaText}>{course.lessonsCount} lez.</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
      </TouchableOpacity>
    );
  }

  // default card
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <LinearGradient
        colors={[course.colorFrom, course.colorTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardHeader}
      >
        {course.isNew && (
          <View style={styles.newBadgeSmall}>
            <Text style={styles.newBadgeSmallText}>NUOVO</Text>
          </View>
        )}
        <Text style={styles.cardEmoji}>{course.emoji}</Text>
      </LinearGradient>
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <View style={[styles.levelBadge, { backgroundColor: levelCfg.bg }]}>
            <Text style={[styles.levelText, { color: levelCfg.color }]}>{levelCfg.label}</Text>
          </View>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={11} color="#E8A87C" />
            <Text style={styles.ratingText}>{course.rating}</Text>
          </View>
        </View>
        <Text style={styles.cardTitle} numberOfLines={1}>{course.title}</Text>
        <Text style={styles.cardSubtitle} numberOfLines={2}>{course.subtitle}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.metaItem}>
            <Ionicons name="person-outline" size={12} color={colors.textMuted} />
            <Text style={styles.cardMetaText}>{course.instructor.split(' ')[0]}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="play-circle-outline" size={12} color={colors.textMuted} />
            <Text style={styles.cardMetaText}>{course.lessonsCount} lezioni</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CARD_WIDTH = (width - spacing.lg * 2 - spacing.md) / 2;

const styles = StyleSheet.create({
  // Featured
  featured: {
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  featuredGradient: {
    padding: spacing.lg,
    minHeight: 200,
    justifyContent: 'flex-end',
  },
  featuredEmoji: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiText: { fontSize: 30 },
  newBadge: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: colors.accentLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },
  newBadgeText: { fontSize: 10, fontWeight: typography.fontWeight.bold, color: colors.accentDark, letterSpacing: 0.8 },
  featuredContent: { gap: 6 },
  featuredTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    lineHeight: 28,
  },
  featuredSubtitle: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255,255,255,0.82)',
    fontWeight: typography.fontWeight.medium,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 4,
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: 'rgba(255,255,255,0.82)', fontWeight: typography.fontWeight.medium },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.5)' },

  levelBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  levelText: { fontSize: 11, fontWeight: typography.fontWeight.semibold, letterSpacing: 0.3 },

  // Compact
  compact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  compactIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactEmoji: { fontSize: 24 },
  compactContent: { flex: 1 },
  compactTitle: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.textPrimary, marginBottom: 2 },
  compactInstructor: { fontSize: typography.fontSize.sm, color: colors.textMuted, marginBottom: 4 },
  compactMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  compactMetaText: { fontSize: 11, color: colors.textMuted, fontWeight: typography.fontWeight.medium },

  // Default card
  card: {
    width: CARD_WIDTH,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: { fontSize: 34 },
  newBadgeSmall: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.28)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  newBadgeSmallText: { fontSize: 9, fontWeight: typography.fontWeight.bold, color: '#fff', letterSpacing: 0.5 },
  cardBody: { padding: spacing.sm + 4 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingText: { fontSize: 11, fontWeight: typography.fontWeight.semibold, color: colors.textSecondary },
  cardTitle: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginBottom: 2 },
  cardSubtitle: { fontSize: typography.fontSize.xs, color: colors.textMuted, lineHeight: 16, marginBottom: spacing.sm },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardMetaText: { fontSize: 11, color: colors.textMuted, fontWeight: typography.fontWeight.medium },
});
