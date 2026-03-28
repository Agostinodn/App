import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, borderRadius } from '../theme';
import { COURSES } from '../data/courses';

const { width, height } = Dimensions.get('window');

const pad = (n) => String(n).padStart(2, '0');

const formatTime = (secs) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${pad(m)}:${pad(s)}`;
};

export const LezioneScreen = ({ navigation, route }) => {
  const { courseId, lessonId } = route.params;
  const course = COURSES.find((c) => c.id === courseId);
  const lesson = course?.lessons.find((l) => l.id === lessonId);

  const totalSecs = (lesson?.duration || 30) * 60;
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [breathPhase, setBreathPhase] = useState('inhale'); // inhale | hold | exhale

  const intervalRef = useRef(null);
  const breathIntervalRef = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const breathAnim = useRef(new Animated.Value(1)).current;

  const remaining = totalSecs - elapsed;
  const progressPct = totalSecs > 0 ? elapsed / totalSecs : 0;

  // Timer
  useEffect(() => {
    if (isRunning && !isDone) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => {
          if (prev + 1 >= totalSecs) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsDone(true);
            return totalSecs;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isDone, totalSecs]);

  // Progress animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progressPct,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progressPct]);

  // Breathing animation
  useEffect(() => {
    if (!isRunning) return;
    let phase = 0;
    const phases = [
      { label: 'inhale', duration: 4000, toValue: 1.3 },
      { label: 'hold', duration: 2000, toValue: 1.3 },
      { label: 'exhale', duration: 4000, toValue: 1 },
    ];
    const cycle = () => {
      const p = phases[phase % phases.length];
      setBreathPhase(p.label);
      Animated.timing(breathAnim, {
        toValue: p.toValue,
        duration: p.duration,
        useNativeDriver: true,
      }).start(() => {
        phase++;
        cycle();
      });
    };
    cycle();
    return () => {
      breathAnim.stopAnimation();
    };
  }, [isRunning]);

  const toggleTimer = useCallback(() => {
    if (isDone) return;
    setIsRunning((v) => !v);
  }, [isDone]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setElapsed(0);
    setIsDone(false);
    setCurrentExercise(0);
  }, []);

  const handleNext = useCallback(() => {
    if (!course || !lesson) return;
    const currentIdx = course.lessons.findIndex((l) => l.id === lessonId);
    const nextLesson = course.lessons[currentIdx + 1];
    if (nextLesson) {
      navigation.replace('Lezione', { courseId, lessonId: nextLesson.id });
    } else {
      navigation.goBack();
    }
  }, [course, lesson, lessonId, courseId, navigation]);

  const BREATH_LABELS = { inhale: 'Inspira', hold: 'Tieni', exhale: 'Espira' };

  if (!course || !lesson) {
    return (
      <View style={styles.root}>
        <Text style={{ color: colors.textPrimary, padding: spacing.lg }}>Lezione non trovata.</Text>
      </View>
    );
  }

  const exercises = lesson.exercises || [];
  const currentIdx = course.lessons.findIndex((l) => l.id === lessonId);
  const hasNext = currentIdx < course.lessons.length - 1;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient
        colors={[course.colorFrom, course.colorTo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroGradient}
      >
        <SafeAreaView edges={['top']} style={styles.safeTop}>
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Ionicons name="chevron-down" size={22} color={colors.white} />
            </TouchableOpacity>
            <View style={styles.topCenter}>
              <Text style={styles.courseNameTop} numberOfLines={1}>{course.title}</Text>
              <Text style={styles.lessonIndexTop}>
                Lezione {currentIdx + 1} di {course.lessons.length}
              </Text>
            </View>
            <View style={{ width: 40 }} />
          </View>
        </SafeAreaView>

        {/* Timer ring */}
        <View style={styles.timerSection}>
          <View style={styles.timerRing}>
            {/* Background circle via border */}
            <View style={styles.timerRingBg} />
            {/* Breathing orb */}
            <Animated.View
              style={[
                styles.breathOrb,
                { transform: [{ scale: breathAnim }] },
              ]}
            />
            {/* Time display */}
            <View style={styles.timerContent}>
              {isDone ? (
                <>
                  <Text style={styles.doneEmoji}>🎉</Text>
                  <Text style={styles.doneText}>Completata!</Text>
                </>
              ) : (
                <>
                  <Text style={styles.timerValue}>{formatTime(remaining)}</Text>
                  <Text style={styles.timerLabel}>rimasti</Text>
                  {isRunning && (
                    <Text style={styles.breathLabel}>{BREATH_LABELS[breathPhase]}</Text>
                  )}
                </>
              )}
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressRow}>
            <View style={styles.progressBg}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressPct}>{Math.round(progressPct * 100)}%</Text>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.controlBtnSm}
              onPress={resetTimer}
              activeOpacity={0.8}
            >
              <Ionicons name="refresh" size={20} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.controlBtnLg, isDone && styles.controlBtnDone]}
              onPress={isDone ? handleNext : toggleTimer}
              activeOpacity={0.85}
            >
              <Ionicons
                name={isDone ? 'arrow-forward' : isRunning ? 'pause' : 'play'}
                size={28}
                color={isDone ? course.colorFrom : colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.controlBtnSm}
              onPress={handleNext}
              activeOpacity={0.8}
              disabled={!hasNext}
            >
              <Ionicons
                name="play-skip-forward"
                size={20}
                color={hasNext ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.lessonHeader}>
          <Text style={styles.lessonTitle}>{lesson.title}</Text>
          <View style={styles.lessonMetaRow}>
            <Ionicons name="time-outline" size={14} color={colors.textMuted} />
            <Text style={styles.lessonMetaText}>{lesson.duration} minuti</Text>
            <View style={styles.dot} />
            <Text style={styles.lessonMetaText}>{exercises.length} esercizi</Text>
          </View>
          <Text style={styles.lessonDesc}>{lesson.description}</Text>
        </View>

        {/* Exercises */}
        {exercises.length > 0 && (
          <View style={styles.exerciseSection}>
            <Text style={styles.exerciseSectionTitle}>Esercizi della lezione</Text>
            {exercises.map((ex, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.exerciseItem,
                  idx === currentExercise && styles.exerciseItemActive,
                  idx < exercises.length - 1 && styles.exerciseBorder,
                ]}
                onPress={() => setCurrentExercise(idx)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.exerciseNumber,
                    idx === currentExercise && { backgroundColor: course.colorFrom },
                    idx < currentExercise && { backgroundColor: colors.success },
                  ]}
                >
                  {idx < currentExercise ? (
                    <Ionicons name="checkmark" size={13} color={colors.white} />
                  ) : (
                    <Text
                      style={[
                        styles.exerciseNumberText,
                        idx === currentExercise && { color: colors.white },
                      ]}
                    >
                      {idx + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.exerciseName,
                    idx === currentExercise && { color: course.colorFrom, fontWeight: typography.fontWeight.bold },
                    idx < currentExercise && { color: colors.textMuted },
                  ]}
                >
                  {ex}
                </Text>
                {idx === currentExercise && (
                  <View style={[styles.activeTag, { backgroundColor: course.colorFrom + '18' }]}>
                    <Text style={[styles.activeTagText, { color: course.colorFrom }]}>Attuale</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Done card */}
        {isDone && (
          <View style={styles.doneCard}>
            <Text style={styles.doneCardTitle}>Lezione completata! 🎉</Text>
            <Text style={styles.doneCardText}>
              Hai completato "{lesson.title}" in {lesson.duration} minuti. Ottimo lavoro!
            </Text>
            <TouchableOpacity
              style={[styles.doneNextBtn, { backgroundColor: course.colorFrom }]}
              onPress={hasNext ? handleNext : () => navigation.goBack()}
              activeOpacity={0.85}
            >
              <Text style={styles.doneNextBtnText}>
                {hasNext ? 'Lezione successiva →' : 'Torna al corso'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: spacing['2xl'] }} />
      </ScrollView>
    </View>
  );
};

const RING_SIZE = width * 0.54;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  heroGradient: { paddingBottom: spacing.xl },
  safeTop: {},
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topCenter: { flex: 1, alignItems: 'center' },
  courseNameTop: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.bold, color: colors.white },
  lessonIndexTop: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 1 },

  timerSection: { alignItems: 'center', paddingBottom: spacing.lg },

  timerRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    position: 'relative',
  },
  timerRingBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RING_SIZE / 2,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  breathOrb: {
    position: 'absolute',
    width: RING_SIZE * 0.72,
    height: RING_SIZE * 0.72,
    borderRadius: (RING_SIZE * 0.72) / 2,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  timerContent: { alignItems: 'center', zIndex: 1 },
  timerValue: { fontSize: 48, fontWeight: typography.fontWeight.bold, color: colors.white, letterSpacing: -1 },
  timerLabel: { fontSize: typography.fontSize.sm, color: 'rgba(255,255,255,0.7)', fontWeight: typography.fontWeight.medium },
  breathLabel: { fontSize: typography.fontSize.base, color: 'rgba(255,255,255,0.9)', fontWeight: typography.fontWeight.semibold, marginTop: 4 },
  doneEmoji: { fontSize: 44 },
  doneText: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.white },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.xl,
    width: '100%',
    marginBottom: spacing.lg,
  },
  progressBg: { flex: 1, height: 6, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.white, borderRadius: 3 },
  progressPct: { fontSize: 12, fontWeight: typography.fontWeight.bold, color: colors.white, width: 36, textAlign: 'right' },

  controls: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  controlBtnSm: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtnLg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  controlBtnDone: {
    backgroundColor: colors.white,
  },

  content: { flex: 1, backgroundColor: colors.background },
  lessonHeader: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md },
  lessonTitle: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginBottom: spacing.xs },
  lessonMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: spacing.md },
  lessonMetaText: { fontSize: 12, color: colors.textMuted, fontWeight: typography.fontWeight.medium },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: colors.textMuted },
  lessonDesc: { fontSize: typography.fontSize.base, color: colors.textSecondary, lineHeight: 22 },

  exerciseSection: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exerciseSectionTitle: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginBottom: spacing.md },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    gap: spacing.md,
  },
  exerciseItemActive: {
    backgroundColor: colors.primaryUltraLight,
    marginHorizontal: -spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
  },
  exerciseBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  exerciseNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseNumberText: { fontSize: 12, fontWeight: typography.fontWeight.bold, color: colors.textSecondary },
  exerciseName: { flex: 1, fontSize: typography.fontSize.base, color: colors.textSecondary, fontWeight: typography.fontWeight.medium },
  activeTag: { paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: borderRadius.full },
  activeTagText: { fontSize: 10, fontWeight: typography.fontWeight.bold, letterSpacing: 0.3 },

  doneCard: {
    backgroundColor: colors.successLight || '#EEF7F2',
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.success + '40',
    alignItems: 'center',
  },
  doneCardTitle: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginBottom: spacing.sm },
  doneCardText: { fontSize: typography.fontSize.base, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: spacing.lg },
  doneNextBtn: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: borderRadius.lg },
  doneNextBtnText: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: colors.white },
});
