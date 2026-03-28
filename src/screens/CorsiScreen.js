import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CourseCard, FilterChip } from '../components';
import { colors, typography, spacing, borderRadius } from '../theme';
import { COURSES, CATEGORIES } from '../data/courses';

const LEVELS = [
  { id: 'tutti', label: 'Tutti' },
  { id: 'principiante', label: 'Principiante' },
  { id: 'intermedio', label: 'Intermedio' },
  { id: 'avanzato', label: 'Avanzato' },
];

export const CorsiScreen = ({ navigation, route }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(route?.params?.categoryFilter || 'tutti');
  const [activeLevel, setActiveLevel] = useState('tutti');

  const filtered = useMemo(() => {
    return COURSES.filter((c) => {
      const matchSearch =
        search.trim() === '' ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.instructor.toLowerCase().includes(search.toLowerCase()) ||
        c.subtitle.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === 'tutti' || c.category === activeCategory;
      const matchLevel = activeLevel === 'tutti' || c.level === activeLevel || c.level === 'tutti';
      return matchSearch && matchCat && matchLevel;
    });
  }, [search, activeCategory, activeLevel]);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <SafeAreaView edges={['top']} style={styles.safe}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Corsi</Text>
          <Text style={styles.headerSub}>{filtered.length} corsi disponibili</Text>
        </View>

        {/* Search */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cerca corsi, istruttori…"
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
              autoCorrect={false}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')} activeOpacity={0.7}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        stickyHeaderIndices={[0]}
      >
        {/* Sticky filters */}
        <View style={styles.filtersWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {CATEGORIES.map((cat) => (
              <FilterChip
                key={cat.id}
                label={cat.label}
                icon={cat.icon}
                active={activeCategory === cat.id}
                onPress={() => setActiveCategory(cat.id)}
              />
            ))}
          </ScrollView>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {LEVELS.map((lv) => (
              <FilterChip
                key={lv.id}
                label={lv.label}
                active={activeLevel === lv.id}
                onPress={() => setActiveLevel(lv.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Results */}
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>Nessun corso trovato</Text>
            <Text style={styles.emptyText}>Prova a cambiare i filtri o la ricerca.</Text>
          </View>
        ) : (
          <View style={styles.listWrapper}>
            {filtered.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                variant="compact"
                onPress={() =>
                  navigation.navigate('CourseDetail', { courseId: course.id })
                }
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  safe: { backgroundColor: colors.background },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.sm },
  headerTitle: { fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
  headerSub: { fontSize: typography.fontSize.sm, color: colors.textMuted, marginTop: 2 },

  searchRow: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
    padding: 0,
  },

  filtersWrapper: {
    backgroundColor: colors.background,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.xs,
  },
  filterRow: { paddingHorizontal: spacing.lg, paddingVertical: spacing.xs },

  scroll: { paddingBottom: spacing.xl },

  listWrapper: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  emptyState: { alignItems: 'center', paddingTop: spacing['2xl'], paddingHorizontal: spacing.lg },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginBottom: spacing.sm },
  emptyText: { fontSize: typography.fontSize.base, color: colors.textMuted, textAlign: 'center' },
});
