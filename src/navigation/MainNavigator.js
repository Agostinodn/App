import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { colors, typography } from '../theme';
import {
  HomeScreen,
  CorsiScreen,
  CourseDetailScreen,
  LezioneScreen,
  CalendarioScreen,
  ProfiloScreen,
} from '../screens';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ----- Corsi stack (Corsi → Dettaglio → Lezione) -----
const CorsiStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CorsiList" component={CorsiScreen} />
    <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
    <Stack.Screen name="Lezione" component={LezioneScreen} />
  </Stack.Navigator>
);

// ----- Home stack (Home → Dettaglio → Lezione) -----
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
    <Stack.Screen name="Lezione" component={LezioneScreen} />
  </Stack.Navigator>
);

const TAB_ICONS = {
  Home: { active: 'home', inactive: 'home-outline' },
  Corsi: { active: 'library', inactive: 'library-outline' },
  Calendario: { active: 'calendar', inactive: 'calendar-outline' },
  Profilo: { active: 'person', inactive: 'person-outline' },
};

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          return (
            <Ionicons
              name={focused ? icons.active : icons.inactive}
              size={size - 2}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Corsi" component={CorsiStack} />
      <Tab.Screen name="Calendario" component={CalendarioScreen} />
      <Tab.Screen name="Profilo" component={ProfiloScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    paddingTop: 8,
    elevation: 0,
    shadowColor: colors.shadowColor,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: 0.1,
  },
});
