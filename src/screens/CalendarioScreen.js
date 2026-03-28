import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, borderRadius } from '../theme';
import { SCHEDULE } from '../data/user';
import { COURSES } from '../data/courses';

const TODAY_DATE = new Date().getDate().toString();

export const CalendarioScreen = ({ navigation }) => {
  const [selectedDay, setSelectedDay] = useState(
    SCHEDULE.find((s) => s.hasClass)?.id || SCHEDULE[0].id,
  );

  const selected = SCHEDULE.find((s) => s.id === selectedDay);
  const selectedClasses = selected?.classes || [];

  const totalWeek = SCHEDULE.reduce((sum, d) => sum + d.classes.length, 0);
  const completedWeek = 3; // mock

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']} style={styles.safe}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Calendario</Text>
          <Text style={styles.headerSub}>Marzo 2026</Text>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Weekly summary */}
        <View style={styles.summaryCard}>
          <LinearGradient
            colors={colors.gradientPrimary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.summaryGradient}
          >
            <View style={styles.summaryRow}>
              <View>
                <Text style={styles.summaryTitle}>Questa settimana</Text>
                <Text style={styles.summaryValue}>
                  {completedWeek}/{totalWeek} sessioni
                </Text>
              </View>
              <View style={styles.summaryRing}>
                <Text style={styles.summaryPct}>
                  {Math.round((completedWeek / totalWeek) * 100)}%
                </Text>
              </View>
            </View>
            <View style={styles.summaryProgressBg}>
              <View
                style={[
                  styles.summaryProgressFill,
                  { width: `${(completedWeek / totalWeek) * 100}%` },
                ]}
              />
            </View>
          </LinearGradient>
        </View>

        {/* Day selector */}
        <View style={styles.daySelector}>
          {SCHEDULE.map((day) => {
            const isSelected = day.id === selectedDay;
            const isToday = day.date === TODAY_DATE;
            return (
              <TouchableOpacity
                key={day.id}
                style={[styles.dayBtn, isSelected && styles.dayBtnActive]}
                onPress={() => setSelectedDay(day.id)}
                activeOpacity={0.8}
              >
                <Text style={[styles.dayName, isSelected && styles.dayNameActive]}>
                  {day.day}
                </Text>
                <View style={[styles.dayDateWrap, isToday && !isSelected && styles.dayDateToday]}>
                  <Text
                    style={[
                      styles.dayDate,
                      isSelected && styles.dayDateActive,
                      isToday && !isSelected && { color: colors.primary },
                    ]}
                  >
                    {day.date}
                  </Text>
                </View>
                {day.hasClass && (
                  <View style={[styles.dayDot, isSelected && styles.dayDotActive]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected day classes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selected?.day} {selected?.date} Marzo
          </Text>

          {selectedClasses.length === 0 ? (
            <View style={styles.restDay}>
              <Text style={styles.restEmoji}>🌿</Text>
              <Text style={styles.restTitle}>Giorno di riposo</Text>
              <Text style={styles.restText}>Nessuna sessione programmata. Il riposo fa parte dell'allenamento.</Text>
            </View>
          ) : (
            selectedClasses.map((cls) => {
              const course = COURSES.find((c) => c.id === cls.courseId);
              return (
                <TouchableOpacity
                  key={cls.id}
                  style={styles.classCard}
                  activeOpacity={0.85}
                  onPress={() =>
                    navigation.navigate('Home', {
                      screen: 'CourseDetail',
                      params: { courseId: cls.courseId },
                    })
                  }
                >
                  <View style={styles.classTimeCol}>
                    <Text style={styles.classTime}>{cls.time}</Text>
                    <View
                      style={[
                        styles.classTimeLine,
                        { backgroundColor: course?.colorFrom || colors.primary },
                      ]}
                    />
                  </View>
                  <View
                    style={[
                      styles.classContent,
                      { borderLeftColor: course?.colorFrom || colors.primary },
                    ]}
                  >
                    <View style={styles.classTop}>
                      <LinearGradient
                        colors={[course?.colorFrom || colors.primary, course?.colorTo || colors.primaryDark]}
                        style={styles.classEmoji}
                      >
                        <Text style={styles.classEmojiText}>{course?.emoji || '🧘'}</Text>
                      </LinearGradient>
                      <View style={styles.classInfo}>
                        <Text style={styles.classTitle} numberOfLines={1}>{cls.title}</Text>
                        <Text style={styles.classInstructor}>{cls.instructor}</Text>
                      </View>
                    </View>
                    <View style={styles.classMeta}>
                      <View style={styles.classMetaItem}>
                        <Ionicons name="time-outline" size={13} color={colors.textMuted} />
                        <Text style={styles.classMetaText}>{cls.duration} min</Text>
                      </View>
                      <TouchableOpacity
                        style={[styles.classPlayBtn, { backgroundColor: course?.colorFrom || colors.primary }]}
                        onPress={() =>
                          navigation.navigate('Home', {
                            screen: 'Lezione',
                            params: { courseId: cls.courseId, lessonId: cls.lessonId },
                          })
                        }
                        activeOpacity={0.85}
                      >
                        <Ionicons name="play" size={13} color={colors.white} />
                        <Text style={styles.classPlayText}>Inizia</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Quick add */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.addSession} activeOpacity={0.8}>
            <View style={styles.addSessionIcon}>
              <Ionicons name="add" size={22} color={colors.primary} />
            </View>
            <Text style={styles.addSessionText}>Aggiungi sessione</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Upcoming */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prossime settimane</Text>
          {[
            { week: 'Settimana 1 Aprile', sessions: 4, emoji: '🌱' },
            { week: 'Settimana 7 Aprile', sessions: 4, emoji: '🌿' },
          ].map((w) => (
            <View key={w.week} style={styles.upcomingRow}>
              <Text style={styles.upcomingEmoji}>{w.emoji}</Text>
              <Text style={styles.upcomingWeek}>{w.week}</Text>
              <View style={styles.upcomingTag}>
                <Text style={styles.upcomingTagText}>{w.sessions} sessioni</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: spacing.lg }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  safe: { backgroundColor: colors.background },
  scroll: { paddingBottom: spacing.xl },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md },
  headerTitle: { fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
  headerSub: { fontSize: typography.fontSize.sm, color: colors.textMuted, marginTop: 2 },

  summaryCard: { marginHorizontal: spacing.lg, borderRadius: borderRadius.xl, overflow: 'hidden', marginBottom: spacing.lg },
  summaryGradient: { padding: spacing.lg },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  summaryTitle: { fontSize: typography.fontSize.sm, color: 'rgba(255,255,255,0.82)', fontWeight: typography.fontWeight.semibold, marginBottom: 4 },
  summaryValue: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.white },
  summaryRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  summaryPct: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: colors.white },
  summaryProgressBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.22)', borderRadius: 3, overflow: 'hidden' },
  summaryProgressFill: { height: '100%', backgroundColor: colors.white, borderRadius: 3 },

  daySelector: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  dayBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  dayBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayName: { fontSize: 11, fontWeight: typography.fontWeight.semibold, color: colors.textMuted },
  dayNameActive: { color: 'rgba(255,255,255,0.85)' },
  dayDateWrap: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dayDateToday: { backgroundColor: colors.primaryUltraLight },
  dayDate: { fontSize: 13, fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
  dayDateActive: { color: colors.white },
  dayDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.textMuted },
  dayDotActive: { backgroundColor: 'rgba(255,255,255,0.7)' },

  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  sectionTitle: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginBottom: spacing.md },

  restDay: { alignItems: 'center', paddingVertical: spacing.xl, backgroundColor: colors.surface, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed' },
  restEmoji: { fontSize: 36, marginBottom: spacing.sm },
  restTitle: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginBottom: spacing.xs },
  restText: { fontSize: typography.fontSize.sm, color: colors.textMuted, textAlign: 'center', paddingHorizontal: spacing.lg },

  classCard: { flexDirection: 'row', marginBottom: spacing.md, gap: spacing.md },
  classTimeCol: { width: 44, alignItems: 'center', paddingTop: 2 },
  classTime: { fontSize: 11, fontWeight: typography.fontWeight.bold, color: colors.textSecondary, marginBottom: 4 },
  classTimeLine: { flex: 1, width: 2, borderRadius: 1 },
  classContent: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
  },
  classTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  classEmoji: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  classEmojiText: { fontSize: 18 },
  classInfo: { flex: 1 },
  classTitle: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.textPrimary, marginBottom: 2 },
  classInstructor: { fontSize: typography.fontSize.xs, color: colors.textMuted },
  classMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  classMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  classMetaText: { fontSize: 12, color: colors.textMuted },
  classPlayBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: borderRadius.full },
  classPlayText: { fontSize: 12, fontWeight: typography.fontWeight.bold, color: colors.white },

  addSession: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    gap: spacing.md,
  },
  addSessionIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primaryUltraLight, alignItems: 'center', justifyContent: 'center' },
  addSessionText: { flex: 1, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.textSecondary },

  upcomingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    gap: spacing.md,
  },
  upcomingEmoji: { fontSize: 22 },
  upcomingWeek: { flex: 1, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.textPrimary },
  upcomingTag: { backgroundColor: colors.primaryUltraLight, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: borderRadius.full },
  upcomingTagText: { fontSize: 12, color: colors.primary, fontWeight: typography.fontWeight.semibold },
});
