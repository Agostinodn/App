import React from 'react';
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
import { USER, ACHIEVEMENTS, MY_COURSES } from '../data/user';
import { COURSES } from '../data/courses';

const { width } = Dimensions.get('window');

const SETTINGS = [
  { icon: 'notifications-outline', label: 'Notifiche', desc: 'Promemoria e aggiornamenti' },
  { icon: 'moon-outline', label: 'Modalità scura', desc: 'Cambia tema' },
  { icon: 'language-outline', label: 'Lingua', desc: 'Italiano' },
  { icon: 'shield-checkmark-outline', label: 'Privacy', desc: 'Gestisci i tuoi dati' },
  { icon: 'help-circle-outline', label: 'Supporto', desc: 'FAQ e contatti' },
];

export const ProfiloScreen = () => {
  const myCourseData = MY_COURSES.map((mc) => ({
    ...mc,
    course: COURSES.find((c) => c.id === mc.courseId),
  })).filter((mc) => mc.course);

  const unlockedAchievements = ACHIEVEMENTS.filter((a) => a.unlocked);
  const weeklyGoalPct = Math.round((USER.weeklyCompleted / USER.weeklyGoal) * 100);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <LinearGradient
          colors={colors.gradientPrimary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <SafeAreaView edges={['top']}>
            <View style={styles.headerInner}>
              <View style={styles.avatarWrap}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{USER.avatar}</Text>
                </View>
                <TouchableOpacity style={styles.editAvatarBtn} activeOpacity={0.8}>
                  <Ionicons name="camera" size={14} color={colors.white} />
                </TouchableOpacity>
              </View>
              <Text style={styles.userName}>{USER.name} {USER.lastName}</Text>
              <View style={styles.levelBadge}>
                <Ionicons name="ribbon-outline" size={13} color={colors.primary} />
                <Text style={styles.levelText}>{USER.level}</Text>
              </View>
              <Text style={styles.joinDate}>Con noi dal settembre 2024</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {[
            { value: USER.totalSessions, label: 'Sessioni', icon: 'checkmark-circle-outline', color: colors.primary },
            { value: `${USER.streakDays}🔥`, label: 'Streak', icon: 'flame-outline', color: colors.accent },
            { value: `${USER.totalHours}h`, label: 'Ore totali', icon: 'time-outline', color: colors.secondary },
            { value: unlockedAchievements.length, label: 'Badge', icon: 'trophy-outline', color: '#E8A87C' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Obiettivo settimanale */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Obiettivo settimanale</Text>
            <Text style={styles.cardSubtitle}>{USER.weeklyCompleted}/{USER.weeklyGoal} sessioni</Text>
          </View>
          <View style={styles.progressBg}>
            <View
              style={[
                styles.progressFill,
                { width: `${weeklyGoalPct}%` },
              ]}
            />
          </View>
          <View style={styles.weekDots}>
            {Array.from({ length: USER.weeklyGoal }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.weekDot,
                  i < USER.weeklyCompleted && styles.weekDotActive,
                ]}
              >
                {i < USER.weeklyCompleted && (
                  <Ionicons name="checkmark" size={12} color={colors.white} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* I miei corsi */}
        {myCourseData.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>I miei corsi</Text>
            {myCourseData.map(({ course, progress }) => (
              <View key={course.id} style={styles.myCourseRow}>
                <LinearGradient
                  colors={[course.colorFrom, course.colorTo]}
                  style={styles.myCourseIcon}
                >
                  <Text style={styles.myCourseEmoji}>{course.emoji}</Text>
                </LinearGradient>
                <View style={styles.myCourseContent}>
                  <View style={styles.myCourseHeader}>
                    <Text style={styles.myCourseTitle} numberOfLines={1}>{course.title}</Text>
                    <Text style={[styles.myCoursePct, { color: course.colorFrom }]}>{Math.round(progress)}%</Text>
                  </View>
                  <View style={styles.myCourseBg}>
                    <View
                      style={[
                        styles.myCourseFill,
                        { width: `${progress}%`, backgroundColor: course.colorFrom },
                      ]}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Achievements */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Traguardi</Text>
            <Text style={styles.cardSubtitle}>{unlockedAchievements.length}/{ACHIEVEMENTS.length}</Text>
          </View>
          <View style={styles.achievementsGrid}>
            {ACHIEVEMENTS.map((ach) => (
              <View
                key={ach.id}
                style={[styles.achievementItem, !ach.unlocked && styles.achievementLocked]}
              >
                <Text style={[styles.achievementEmoji, !ach.unlocked && { opacity: 0.3 }]}>
                  {ach.icon}
                </Text>
                <Text
                  style={[styles.achievementTitle, !ach.unlocked && { color: colors.textMuted }]}
                  numberOfLines={2}
                >
                  {ach.title}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Impostazioni</Text>
          {SETTINGS.map((setting, idx) => (
            <TouchableOpacity
              key={setting.label}
              style={[
                styles.settingRow,
                idx < SETTINGS.length - 1 && styles.settingBorder,
              ]}
              activeOpacity={0.75}
            >
              <View style={styles.settingIcon}>
                <Ionicons name={setting.icon} size={20} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingLabel}>{setting.label}</Text>
                <Text style={styles.settingDesc}>{setting.desc}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* App version */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Pilates Studio • v1.0.0</Text>
          <Text style={styles.footerSub}>Fatto con ❤️ per il tuo benessere</Text>
        </View>

        <View style={{ height: spacing.lg }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing.xl },

  header: { paddingBottom: spacing.xl },
  headerInner: { alignItems: 'center', paddingHorizontal: spacing.lg, paddingTop: spacing.sm, gap: spacing.sm },
  avatarWrap: { position: 'relative', marginBottom: spacing.xs },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.white, letterSpacing: 1 },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  userName: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.white },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  levelText: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: colors.primary },
  joinDate: { fontSize: typography.fontSize.xs, color: 'rgba(255,255,255,0.7)' },

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.sm + 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: 3,
  },
  statValue: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold },
  statLabel: { fontSize: 10, color: colors.textMuted, fontWeight: typography.fontWeight.semibold, textAlign: 'center' },

  card: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  cardTitle: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginBottom: spacing.md },
  cardSubtitle: { fontSize: typography.fontSize.sm, color: colors.textMuted, fontWeight: typography.fontWeight.semibold, marginBottom: 0 },

  progressBg: { height: 8, backgroundColor: colors.surfaceDark, borderRadius: 4, overflow: 'hidden', marginBottom: spacing.md },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  weekDots: { flexDirection: 'row', gap: spacing.sm },
  weekDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  weekDotActive: { backgroundColor: colors.success, borderColor: colors.success },

  myCourseRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  myCourseIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  myCourseEmoji: { fontSize: 22 },
  myCourseContent: { flex: 1 },
  myCourseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  myCourseTitle: { flex: 1, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.textPrimary, marginRight: spacing.sm },
  myCoursePct: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold },
  myCourseBg: { height: 5, backgroundColor: colors.surfaceDark, borderRadius: 3, overflow: 'hidden' },
  myCourseFill: { height: '100%', borderRadius: 3 },

  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  achievementItem: {
    width: (width - spacing.lg * 2 - spacing.md * 2 - spacing.sm * 3) / 4,
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    gap: 4,
  },
  achievementLocked: { opacity: 0.55 },
  achievementEmoji: { fontSize: 24 },
  achievementTitle: { fontSize: 10, fontWeight: typography.fontWeight.semibold, color: colors.textSecondary, textAlign: 'center', lineHeight: 13 },

  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.md },
  settingBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  settingIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: colors.primaryUltraLight, alignItems: 'center', justifyContent: 'center' },
  settingContent: { flex: 1 },
  settingLabel: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.textPrimary, marginBottom: 2 },
  settingDesc: { fontSize: typography.fontSize.xs, color: colors.textMuted },

  footer: { alignItems: 'center', marginTop: spacing.xl, gap: 4 },
  footerText: { fontSize: typography.fontSize.sm, color: colors.textMuted, fontWeight: typography.fontWeight.medium },
  footerSub: { fontSize: typography.fontSize.xs, color: colors.textMuted },
});
