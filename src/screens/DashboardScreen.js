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
import { Card } from '../components';
import { colors, typography, spacing, borderRadius } from '../theme';

const { width } = Dimensions.get('window');

const STATS = [
  { label: 'Attività', value: '24', unit: 'completate', icon: 'checkmark-circle', color: colors.primary },
  { label: 'Progresso', value: '78', unit: '%', icon: 'trending-up', color: colors.accent },
  { label: 'Punti', value: '1.2k', unit: 'totali', icon: 'star', color: '#F39C12' },
  { label: 'Streak', value: '7', unit: 'giorni', icon: 'flame', color: '#E67E22' },
];

const ACTIVITIES = [
  {
    id: 1,
    title: 'Sessione mattutina',
    subtitle: 'Completata alle 07:30',
    icon: 'sunny-outline',
    iconBg: colors.primaryUltraLight,
    iconColor: colors.primary,
    time: '07:30',
    tag: 'Completata',
    tagColor: colors.primary,
  },
  {
    id: 2,
    title: 'Obiettivo giornaliero',
    subtitle: '3 di 5 attività completate',
    icon: 'flag-outline',
    iconBg: '#FEF9E7',
    iconColor: '#F39C12',
    time: 'In corso',
    tag: 'In corso',
    tagColor: colors.warning,
  },
  {
    id: 3,
    title: 'Revisione settimanale',
    subtitle: 'Programmata per domani',
    icon: 'calendar-outline',
    iconBg: '#EBF5FB',
    iconColor: '#3498DB',
    time: 'Domani',
    tag: 'Pianificata',
    tagColor: '#3498DB',
  },
  {
    id: 4,
    title: 'Report mensile',
    subtitle: 'Generazione automatica',
    icon: 'bar-chart-outline',
    iconBg: colors.primaryUltraLight,
    iconColor: colors.accent,
    time: '28 Mar',
    tag: 'Automatica',
    tagColor: colors.accent,
  },
];

const QUICK_ACTIONS = [
  { label: 'Nuova\nAttività', icon: 'add-circle-outline', color: colors.primary },
  { label: 'Statistiche', icon: 'stats-chart-outline', color: colors.accent },
  { label: 'Calendario', icon: 'calendar-outline', color: '#3498DB' },
  { label: 'Impostazioni', icon: 'settings-outline', color: '#9B59B6' },
];

export const DashboardScreen = ({ navigation }) => {
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Buongiorno';
    if (h < 18) return 'Buon pomeriggio';
    return 'Buonasera';
  });

  const handleLogout = () => {
    navigation.replace('Auth');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={colors.gradientDark}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>MR</Text>
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.greetingText}>{greeting},</Text>
                <Text style={styles.nameText}>Mario Rossi</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.notificationBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={22} color={colors.white} />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>

          {/* Progress bar */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Obiettivo del giorno</Text>
              <Text style={styles.progressPercent}>78%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '78%' }]} />
            </View>
            <Text style={styles.progressSub}>3 di 5 attività completate</Text>
          </View>
        </LinearGradient>

        {/* Stats grid */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            {STATS.map((stat) => (
              <Card key={stat.label} style={styles.statCard} variant="flat">
                <View style={[styles.statIcon, { backgroundColor: stat.color + '18' }]}>
                  <Ionicons name={stat.icon} size={20} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statUnit}>{stat.unit}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Card>
            ))}
          </View>
        </View>

        {/* Quick actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Azioni rapide</Text>
          <View style={styles.quickActionsRow}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.label}
                style={styles.quickAction}
                activeOpacity={0.7}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '18' }]}>
                  <Ionicons name={action.icon} size={24} color={action.color} />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Attività recenti</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAll}>Vedi tutto</Text>
            </TouchableOpacity>
          </View>

          {ACTIVITIES.map((activity, idx) => (
            <TouchableOpacity
              key={activity.id}
              activeOpacity={0.75}
              style={[styles.activityItem, idx < ACTIVITIES.length - 1 && styles.activityBorder]}
            >
              <View style={[styles.activityIcon, { backgroundColor: activity.iconBg }]}>
                <Ionicons name={activity.icon} size={20} color={activity.iconColor} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activitySubtitle}>{activity.subtitle}</Text>
              </View>
              <View style={styles.activityRight}>
                <View style={[styles.tag, { backgroundColor: activity.tagColor + '18' }]}>
                  <Text style={[styles.tagText, { color: activity.tagColor }]}>{activity.tag}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={18} color={colors.error} />
            <Text style={styles.logoutText}>Esci dall'account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: { paddingBottom: spacing['2xl'] },

  // Header
  header: {
    paddingTop: 56,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    letterSpacing: 0.5,
  },
  headerTextContainer: {},
  greetingText: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: typography.fontWeight.regular,
  },
  nameText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E74C3C',
    borderWidth: 1.5,
    borderColor: colors.primaryDark,
  },

  // Progress
  progressCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: 'rgba(255,255,255,0.9)',
  },
  progressPercent: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 4,
  },
  progressSub: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: typography.fontWeight.medium,
  },

  // Stats
  statsSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statCard: {
    width: (width - spacing.lg * 2 - spacing.sm) / 2,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    lineHeight: 28,
  },
  statUnit: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.medium,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.semibold,
  },

  // Sections
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  seeAll: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },

  // Quick actions
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },

  // Activities
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  activityBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.regular,
  },
  activityRight: {
    alignItems: 'flex-end',
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  tagText: {
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 0.2,
  },

  // Logout
  logoutSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.errorLight,
    borderWidth: 1,
    borderColor: '#FADBD8',
  },
  logoutText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.error,
  },
});
