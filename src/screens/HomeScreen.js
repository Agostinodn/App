import React, { useMemo } from 'react';
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
import { CourseCard } from '../components';
import { colors, typography, spacing, borderRadius } from '../theme';
import { COURSES, CATEGORIES } from '../data/courses';
import { USER, MY_COURSES, SCHEDULE } from '../data/user';

const { width } = Dimensions.get('window');

const GREETING = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Buongiorno';
  if (h < 18) return 'Buon pomeriggio';
  return 'Buonasera';
};

const MOTIVATIONAL = [
  'Ogni movimento conta.',
  'Il corpo ricorda tutto.',
  'Respira. Muoviti. Vivi.',
  'La costanza è il tuo superpotere.',
  'Inizia dal centro.',
];

export const HomeScreen = ({ navigation }) => {
  const greeting = useMemo(GREETING, []);
  const motivational = useMemo(() => MOTIVATIONAL[Math.floor(Math.random() * MOTIVATIONAL.length)], []);

  const featuredCourses = COURSES.filter((c) => c.isFeatured);
  const newCourses = COURSES.filter((c) => c.isNew);

  const myCourseData = MY_COURSES.map((mc) => ({
    ...mc,
    course: COURSES.find((c) => c.id === mc.courseId),
  })).filter((mc) => mc.course);

  const todayClasses = SCHEDULE.find((s) => s.date === new Date().getDate().toString())?.classes || SCHEDULE[4].classes;

  const weeklyPct = Math.round((USER.weeklyCompleted / USER.weeklyGoal) * 100);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Header ── */}
        <LinearGradient
          colors={colors.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <SafeAreaView edges={['top']} style={styles.safeHeader}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.greetingText}>{greeting}, {USER.name} 👋</Text>
                <Text style={styles.motivational}>{motivational}</Text>
              </View>
              <TouchableOpacity style={styles.avatarBtn} activeOpacity={0.8}>
                <Text style={styles.avatarText}>{USER.avatar}</Text>
              </TouchableOpacity>
            </View>

            {/* Weekly progress */}
            <View style={styles.weeklyCard}>
              <View style={styles.weeklyTop}>
                <View>
                  <Text style={styles.weeklyTitle}>Obiettivo settimanale</Text>
                  <Text style={styles.weeklyCount}>
                    {USER.weeklyCompleted}/{USER.weeklyGoal} sessioni
                  </Text>
                </View>
                <Text style={styles.weeklyPct}>{weeklyPct}%</Text>
              </View>
              <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: `${weeklyPct}%` }]} />
              </View>
              <View style={styles.weeklyStats}>
                <View style={styles.weeklyStatItem}>
                  <Ionicons name="flame-outline" size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.weeklyStatText}>{USER.streakDays} giorni streak</Text>
                </View>
                <View style={styles.weeklyStatItem}>
                  <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.weeklyStatText}>{USER.totalHours}h totali</Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* ── I miei corsi ── */}
        {myCourseData.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>I miei corsi</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Corsi')}
                activeOpacity={0.7}
              >
                <Text style={styles.seeAll}>Vedi tutti</Text>
              </TouchableOpacity>
            </View>
            {myCourseData.map(({ course, progress, lastLessonId }) => {
              const lastLesson = course.lessons.find((l) => l.id === lastLessonId);
              return (
                <TouchableOpacity
                  key={course.id}
                  style={styles.myCard}
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation.navigate('CourseDetail', { courseId: course.id })
                  }
                >
                  <LinearGradient
                    colors={[course.colorFrom, course.colorTo]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.myCardIcon}
                  >
                    <Text style={styles.myCardEmoji}>{course.emoji}</Text>
                  </LinearGradient>
                  <View style={styles.myCardContent}>
                    <Text style={styles.myCardTitle} numberOfLines={1}>{course.title}</Text>
                    <Text style={styles.myCardLesson} numberOfLines={1}>
                      Prossima: {lastLesson?.title || 'Prima lezione'}
                    </Text>
                    <View style={styles.myProgressBg}>
                      <View
                        style={[
                          styles.myProgressFill,
                          { width: `${progress}%`, backgroundColor: course.colorFrom },
                        ]}
                      />
                    </View>
                    <Text style={styles.myProgressText}>{Math.round(progress)}% completato</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.playBtn, { backgroundColor: course.colorFrom }]}
                    onPress={() =>
                      navigation.navigate('Lezione', {
                        courseId: course.id,
                        lessonId: lastLessonId,
                      })
                    }
                    activeOpacity={0.8}
                  >
                    <Ionicons name="play" size={16} color={colors.white} />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* ── In evidenza ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>In evidenza</Text>
          </View>
          {featuredCourses.map((course) => (
            <View key={course.id} style={{ marginBottom: spacing.md }}>
              <CourseCard
                course={course}
                variant="featured"
                onPress={() =>
                  navigation.navigate('CourseDetail', { courseId: course.id })
                }
              />
            </View>
          ))}
        </View>

        {/* ── Nuovi corsi ── */}
        {newCourses.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nuovi arrivi</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Corsi')}
                activeOpacity={0.7}
              >
                <Text style={styles.seeAll}>Vedi tutti</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.hScroll}
            >
              {newCourses.map((course) => (
                <View key={course.id} style={styles.hCard}>
                  <CourseCard
                    course={course}
                    variant="default"
                    onPress={() =>
                      navigation.navigate('CourseDetail', { courseId: course.id })
                    }
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Categorie ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Esplora</Text>
          <View style={styles.categoriesGrid}>
            {CATEGORIES.filter((c) => c.id !== 'tutti').map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryCard}
                activeOpacity={0.8}
                onPress={() =>
                  navigation.navigate('Corsi', { categoryFilter: cat.id })
                }
              >
                <View style={styles.categoryIcon}>
                  <Ionicons name={cat.icon} size={22} color={colors.primary} />
                </View>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: spacing.lg }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing.lg },

  // Header
  header: {},
  safeHeader: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
    paddingTop: spacing.sm,
  },
  greetingText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    marginBottom: 4,
  },
  motivational: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: typography.fontWeight.medium,
    fontStyle: 'italic',
  },
  avatarBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    letterSpacing: 0.5,
  },

  // Weekly
  weeklyCard: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  weeklyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  weeklyTitle: { fontSize: typography.fontSize.sm, color: 'rgba(255,255,255,0.85)', fontWeight: typography.fontWeight.semibold },
  weeklyCount: { fontSize: typography.fontSize.xs, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  weeklyPct: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.white },
  progressBg: { height: 7, backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 4, overflow: 'hidden', marginBottom: spacing.sm },
  progressFill: { height: '100%', backgroundColor: colors.white, borderRadius: 4 },
  weeklyStats: { flexDirection: 'row', gap: spacing.lg },
  weeklyStatItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  weeklyStatText: { fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: typography.fontWeight.medium },

  // Sections
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
  seeAll: { fontSize: typography.fontSize.sm, color: colors.primary, fontWeight: typography.fontWeight.semibold },

  // My courses
  myCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  myCardIcon: { width: 54, height: 54, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  myCardEmoji: { fontSize: 26 },
  myCardContent: { flex: 1 },
  myCardTitle: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginBottom: 2 },
  myCardLesson: { fontSize: typography.fontSize.xs, color: colors.textMuted, marginBottom: spacing.sm },
  myProgressBg: { height: 4, backgroundColor: colors.surfaceDark, borderRadius: 2, overflow: 'hidden', marginBottom: 3 },
  myProgressFill: { height: '100%', borderRadius: 2 },
  myProgressText: { fontSize: 10, color: colors.textMuted, fontWeight: typography.fontWeight.medium },
  playBtn: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },

  // Horizontal scroll
  hScroll: { paddingRight: spacing.lg },
  hCard: { marginRight: spacing.md },

  // Categories
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  categoryCard: {
    width: (width - spacing.lg * 2 - spacing.sm * 2) / 3,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primaryUltraLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: { fontSize: 11, fontWeight: typography.fontWeight.semibold, color: colors.textSecondary, textAlign: 'center', lineHeight: 15 },
});
