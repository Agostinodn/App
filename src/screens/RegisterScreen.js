import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input } from '../components';
import { colors, typography, spacing, borderRadius } from '../theme';

export const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmRef = useRef(null);

  const setField = (field) => (value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Nome è obbligatorio';
    if (!form.email) newErrors.email = 'Email è obbligatoria';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email non valida';
    if (!form.password) newErrors.password = 'Password è obbligatoria';
    else if (form.password.length < 8) newErrors.password = 'Minimo 8 caratteri';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Conferma la password';
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Le password non corrispondono';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Main');
    }, 1500);
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: 'Debole', color: colors.error, width: '25%' };
    if (p.length < 10) return { label: 'Discreta', color: colors.warning, width: '55%' };
    return { label: 'Forte', color: colors.success, width: '100%' };
  };

  const strength = passwordStrength();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={colors.gradientDark}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={styles.logoCircle}>
              <Ionicons name="person-add" size={28} color={colors.white} />
            </View>
            <Text style={styles.headerTitle}>Crea Account</Text>
            <Text style={styles.headerSubtitle}>Unisciti a GreenApp oggi</Text>
          </View>
        </LinearGradient>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.formCard}>
            <Input
              label="Nome completo"
              placeholder="Mario Rossi"
              value={form.name}
              onChangeText={setField('name')}
              icon="person-outline"
              autoCapitalize="words"
              error={errors.name}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />

            <Input
              inputRef={emailRef}
              label="Email"
              placeholder="nome@esempio.it"
              value={form.email}
              onChangeText={setField('email')}
              keyboardType="email-address"
              icon="mail-outline"
              error={errors.email}
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />

            <Input
              inputRef={passwordRef}
              label="Password"
              placeholder="Min. 8 caratteri"
              value={form.password}
              onChangeText={setField('password')}
              secureTextEntry
              icon="lock-closed-outline"
              error={errors.password}
              returnKeyType="next"
              onSubmitEditing={() => confirmRef.current?.focus()}
            />

            {/* Password strength */}
            {strength && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBar}>
                  <View style={[styles.strengthFill, { width: strength.width, backgroundColor: strength.color }]} />
                </View>
                <Text style={[styles.strengthLabel, { color: strength.color }]}>
                  {strength.label}
                </Text>
              </View>
            )}

            <Input
              inputRef={confirmRef}
              label="Conferma password"
              placeholder="Ripeti la password"
              value={form.confirmPassword}
              onChangeText={setField('confirmPassword')}
              secureTextEntry
              icon="shield-checkmark-outline"
              error={errors.confirmPassword}
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />

            {/* Terms */}
            <View style={styles.termsRow}>
              <Ionicons name="information-circle-outline" size={14} color={colors.textMuted} />
              <Text style={styles.termsText}>
                Registrandoti accetti i nostri{' '}
                <Text style={styles.termsLink}>Termini di Servizio</Text>
                {' '}e la{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            <Button
              title="Crea Account"
              onPress={handleRegister}
              loading={loading}
              style={styles.registerBtn}
            />
          </View>

          {/* Login link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Hai già un account? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <Text style={styles.loginLink}>Accedi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1 },

  header: {
    paddingTop: 56,
    paddingBottom: spacing['2xl'],
    paddingHorizontal: spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
  },

  formContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },

  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    minWidth: 50,
    textAlign: 'right',
  },

  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    marginBottom: spacing.lg,
    paddingHorizontal: 2,
  },
  termsText: {
    flex: 1,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    lineHeight: 18,
  },
  termsLink: {
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },

  registerBtn: {
    marginTop: spacing.xs,
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
});
