import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, borderRadius } from '../theme';
import { COURSES } from '../data/courses';
import { MY_COURSES } from '../data/user';

const { width } = Dimensions.get('window');

const LEVEL_CONFIG = {
  principiante: { label: 'Principiante', bg: colors.levels?.principianteBg || '#EEF7F2', color: colors.levels?.principiante || '#6AB187' },
  intermedio: { label: 'Intermedio', bg: colors.levels?.intermedioBg || '#FCF3EC', color: colors.levels?.intermedio || '#E8A87C' },
  avanzato: { label: 'Avanzato', bg: colors.levels?.avanzatoBg || '#F5E8E4', color: colors.levels?.avanzato || '#C9705A' },
  tutti: { label: 'Tutti i livelli', bg: colors.levels?.tuttiBg || '#EBF3F3', color: colors.levels?.tutti || '#5B8A8A' },
};

export const CourseDetailScreen = ({ navigation, route }) => {
  const { courseId } = route.params;
  const course = COURSES.find((c) => c.id === courseId);
  const myCourse = MY_COURSES.find((mc) => mc.courseId === courseId);
  const [showFullDesc, setShowFullDesc] = useState(false);

  if (!course) {
    return (
      <View style={styles.root}>
        <Text style={{ color: colors.textPrimary, padding: spacing.lg }}>Corso non trovato.</Text>
      </View>
    );
  }

  const levelCfg = LEVEL_CONFIG[course.level] || LEVEL_CONFIG.tutti;
  const isEnrolled = !!myCourse;
  const completedIds = myCourse?.completedLessons || [];
  const nextLesson = course.lessons.find((l) => !completedIds.includes(l.id)) || course.lessons[0];

  const handleStartLesson = (lesson) => {
    if (!lesson.isFree && !isEnrolled) return;
    navigation.navigate('Lezione', { courseId: course.id, lessonId: lesson.id });
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Hero */}
        <LinearGradient
          colors={[course.colorFrom, course.colorTo]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <SafeAreaView edges={['top']}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-back" size={22} color={colors.white} />
            </TouchableOpacity>
          </SafeAreaView>
          <View style={styles.heroContent}>
            <Text style={styles.heroEmoji}>{course.emoji}</Text>
            <View style={[styles.levelBadge, { backgroundColor: 'rgba(255,255,255,0.22)' }]}>
              <Text style={[styles.levelText, { color: colors.white }]}>{levelCfg.label}</Text>
            </View>
            <Text style={styles.heroTitle}>{course.title}</Text>
            <Text style={styles.heroSubtitle}>{course.subtitle}</Text>
            <View style={styles.heroMeta}>
              <View style={styles.heroMetaItem}>
                <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.heroMetaText}>{course.duration}</Text>
              </View>
              <View style={styles.heroMetaDot} />
              <View style={styles.heroMetaItem}>
                <Ionicons name="play-circle-outline" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.heroMetaText}>{course.lessonsCount} lezioni</Text>
              </View>
              <View style={styles.heroMetaDot} />
              <View style={styles.heroMetaItem}>
                <Ionicons name="star" size={13} color="rgba(255,255,255,0.9)" />
                <Text style={styles.heroMetaText}>{course.rating} ({course.reviewsCount})</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* CTA */}
        <View style={styles.ctaSection}>
          <TouchableOpacity
            style={styles.ctaBtn}
            activeOpacity={0.85}
            onPress={() => handleStartLesson(nextLesson)}
          >
            <LinearGradient
              colors={[course.colorFrom, course.colorTo]}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaBtnGradient}
            >
              <Ionicons name="play-circle" size={22} color={colors.white} />
              <Text style={styles.ctaBtnText}>
                {isEnrolled ? 'Continua' : 'Inizia'} il corso
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          {isEnrolled && myCourse && (
            <View style={styles.progressRow}>
              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${myCourse.progress}%`, backgroundColor: course.colorFrom },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>{Math.round(myCourse.progress)}%</Text>
            </View>
          )}
        </View>

        {/* Istruttore */}
        <View style={styles.card}>
          <View style={styles.instructorRow}>
            <LinearGradient
              colors={[course.colorFrom, course.colorTo]}
              style={styles.instructorAvatar}
            >
              <Text style={styles.instructorAvatarText}>
                {course.instructor.split(' ').map((n) => n[0]).join('')}
              </Text>
            </LinearGradient>
            <View style={styles.instructorInfo}>
              <Text style={styles.instructorName}>{course.instructor}</Text>
              <Text style={styles.instructorBio} numberOfLines={2}>{course.instructorBio}</Text>
            </View>
          </View>
        </View>

        {/* Descrizione */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Descrizione</Text>
          <Text
            style={styles.descText}
            numberOfLines={showFullDesc ? undefined : 3}
          >
            {course.description}
          </Text>
          <TouchableOpacity onPress={() => setShowFullDesc((v) => !v)} activeOpacity={0.7}>
            <Text style={[styles.seeMore, { color: course.colorFrom }]}>
              {showFullDesc ? 'Mostra meno ↑' : 'Leggi tutto ↓'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { icon: 'time-outline', value: `${course.totalMinutes} min`, label: 'Totale' },
            { icon: 'bar-chart-outline', value: levelCfg.label, label: 'Livello' },
            { icon: 'play-circle-outline', value: `${course.lessonsCount}`, label: 'Lezioni' },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: course.colorFrom + '18' }]}>
                <Ionicons name={s.icon} size={20} color={course.colorFrom} />
              </View>
              <Text style={[styles.statValue, { color: course.colorFrom }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Lezioni */}
        <View style={[styles.card, { marginBottom: spacing.xl }]}>
          <Text style={styles.cardTitle}>Programma del corso</Text>
          {course.lessons.map((lesson, idx) => {
            const isCompleted = completedIds.includes(lesson.id);
            const isLocked = !lesson.isFree && !isEnrolled;
            const isCurrent = nextLesson?.id === lesson.id && isEnrolled;
            return (
              <TouchableOpacity
                key={lesson.id}
                style={[
                  styles.lessonItem,
                  isCurrent && styles.lessonItemCurrent,
                  idx < course.lessons.length - 1 && styles.lessonBorder,
                ]}
                onPress={() => handleStartLesson(lesson)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.lessonNumber,
                    isCompleted && { backgroundColor: colors.success },
                    isCurrent && { backgroundColor: course.colorFrom },
                  ]}
                >
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={14} color={colors.white} />
                  ) : isLocked ? (
                    <Ionicons name="lock-closed" size={12} color={colors.textMuted} />
                  ) : (
                    <Text style={[styles.lessonNumberText, isCurrent && { color: colors.white }]}>
                      {idx + 1}
                    </Text>
                  )}
                </View>
                <View style={styles.lessonContent}>
                  <Text
                    style={[
                      styles.lessonTitle,
                      isCompleted && { color: colors.textMuted },
                      isCurrent && { color: course.colorFrom },
                    ]}
                    numberOfLines={1}
                  >
                    {lesson.title}
                  </Text>
                  <View style={styles.lessonMeta}>
                    <Ionicons name="time-outline" size={11} color={colors.textMuted} />
                    <Text style={styles.lessonMetaText}>{lesson.duration} min</Text>
                    {lesson.isFree && !isEnrolled && (
                      <View style={styles.freeBadge}>
                        <Text style={styles.freeBadgeText}>GRATIS</Text>
                      </View>
                    )}
                  </View>
                </View>
                {!isLocked && (
                  <Ionicons
                    name={isCompleted ? 'checkmark-circle' : 'play-circle-outline'}
                    size={20}
                    color={isCompleted ? colors.success : course.colorFrom}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing.xl },

  hero: { paddingBottom: spacing.xl },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.lg,
    marginTop: spacing.sm,
  },
  heroContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: 8 },
  heroEmoji: { fontSize: 48, marginBottom: 4 },
  levelBadge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: borderRadius.full, alignSelf: 'flex-start' },
  levelText: { fontSize: 11, fontWeight: typography.fontWeight.semibold, letterSpacing: 0.3 },
  heroTitle: { fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.white, lineHeight: 34 },
  heroSubtitle: { fontSize: typography.fontSize.base, color: 'rgba(255,255,255,0.82)', fontWeight: typography.fontWeight.medium },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4 },
  heroMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroMetaText: { fontSize: 12, color: 'rgba(255,255,255,0.82)', fontWeight: typography.fontWeight.medium },
  heroMetaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(255,255,255,0.4)' },

  ctaSection: { paddingHorizontal: spacing.lg, marginTop: spacing.lg, gap: spacing.md },
  ctaBtn: { borderRadius: borderRadius.lg, overflow: 'hidden' },
  ctaBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md + 2,
    gap: spacing.sm,
  },
  ctaBtnText: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: colors.white },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  progressBg: { flex: 1, height: 6, backgroundColor: colors.surfaceDark, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: colors.textSecondary, width: 36 },

  card: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginBottom: spacing.md },

  instructorRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  instructorAvatar: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  instructorAvatarText: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: colors.white },
  instructorInfo: { flex: 1 },
  instructorName: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginBottom: 3 },
  instructorBio: { fontSize: typography.fontSize.sm, color: colors.textMuted, lineHeight: 18 },

  descText: { fontSize: typography.fontSize.base, color: colors.textSecondary, lineHeight: 22 },
  seeMore: { marginTop: spacing.sm, fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  statIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  statValue: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold },
  statLabel: { fontSize: 11, color: colors.textMuted, fontWeight: typography.fontWeight.medium },

  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 4,
    gap: spacing.md,
  },
  lessonItemCurrent: {
    backgroundColor: colors.primaryUltraLight,
    marginHorizontal: -spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  lessonBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  lessonNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonNumberText: { fontSize: 13, fontWeight: typography.fontWeight.bold, color: colors.textSecondary },
  lessonContent: { flex: 1 },
  lessonTitle: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.textPrimary, marginBottom: 2 },
  lessonMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  lessonMetaText: { fontSize: 11, color: colors.textMuted, fontWeight: typography.fontWeight.medium },
  freeBadge: { backgroundColor: colors.primaryUltraLight, paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4, marginLeft: spacing.xs },
  freeBadgeText: { fontSize: 9, fontWeight: typography.fontWeight.bold, color: colors.primary, letterSpacing: 0.4 },
});
