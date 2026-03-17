import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Button, Input } from '../components';
import { colors, typography, spacing, borderRadius } from '../theme';

const { height } = Dimensions.get('window');

export const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const passwordRef = useRef(null);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email è obbligatoria';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email non valida';
    if (!password) newErrors.password = 'Password è obbligatoria';
    else if (password.length < 6) newErrors.password = 'Minimo 6 caratteri';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Main');
    }, 1500);
  };

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
        {/* Header gradient */}
        <LinearGradient
          colors={colors.gradientDark}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="leaf" size={32} color={colors.white} />
            </View>
            <Text style={styles.logoText}>GreenApp</Text>
            <Text style={styles.logoSubtext}>Il tuo spazio personale</Text>
          </View>
        </LinearGradient>

        {/* Form card */}
        <View style={styles.formContainer}>
          <View style={styles.formCard}>
            <Text style={styles.title}>Bentornato</Text>
            <Text style={styles.subtitle}>Accedi al tuo account</Text>

            <View style={styles.form}>
              <Input
                label="Email"
                placeholder="nome@esempio.it"
                value={email}
                onChangeText={(t) => { setEmail(t); setErrors(e => ({ ...e, email: null })); }}
                keyboardType="email-address"
                icon="mail-outline"
                error={errors.email}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />

              <Input
                inputRef={passwordRef}
                label="Password"
                placeholder="La tua password"
                value={password}
                onChangeText={(t) => { setPassword(t); setErrors(e => ({ ...e, password: null })); }}
                secureTextEntry
                icon="lock-closed-outline"
                error={errors.password}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />

              <TouchableOpacity style={styles.forgotRow} activeOpacity={0.7}>
                <Text style={styles.forgotText}>Password dimenticata?</Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Accedi"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginBtn}
            />

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>oppure</Text>
              <View style={styles.divider} />
            </View>

            <Button
              title="Crea account"
              onPress={() => navigation.navigate('Register')}
              variant="outline"
            />
          </View>

          {/* Bottom hint */}
          <View style={styles.bottomHint}>
            <Ionicons name="shield-checkmark-outline" size={14} color={colors.textMuted} />
            <Text style={styles.hintText}>Accesso sicuro e protetto</Text>
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
    height: height * 0.32,
    justifyContent: 'flex-end',
    paddingBottom: spacing['2xl'],
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoText: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.white,
    letterSpacing: 0.5,
  },
  logoSubtext: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
    fontWeight: typography.fontWeight.regular,
  },

  formContainer: {
    flex: 1,
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

  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    fontWeight: typography.fontWeight.regular,
  },
  form: {
    marginBottom: spacing.sm,
  },
  forgotRow: {
    alignSelf: 'flex-end',
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },
  forgotText: {
    fontSize: typography.fontSize.sm,
    color: colors.primary,
    fontWeight: typography.fontWeight.semibold,
  },
  loginBtn: {
    marginBottom: spacing.lg,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginHorizontal: spacing.md,
    fontWeight: typography.fontWeight.medium,
  },

  bottomHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    gap: 6,
  },
  hintText: {
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    fontWeight: typography.fontWeight.medium,
  },
});
