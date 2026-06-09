import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  isValidDemoPassword,
  loginUser,
  resolveUserRole,
} from '../services/authStorage';

export default function Index() {
  const [companyCode, setCompanyCode] = useState('STNAM');
  const [email, setEmail] = useState('saaraekandjo999@gmail.com');
  const [password, setPassword] = useState('safetrack');

  const login = async () => {
    if (!companyCode.trim() || !email.trim() || !password.trim()) {
      Alert.alert(
        'Missing details',
        'Enter your company code, email, and password to continue.'
      );
      return;
    }

    const role = resolveUserRole(email, companyCode);

    if (!isValidDemoPassword(role, password)) {
      Alert.alert(
        'Invalid password',
        role === 'admin'
          ? 'Use admin123, manager123, or safetrack for the admin demo.'
          : 'Use safetrack for the employee demo.'
      );
      return;
    }

    const user = await loginUser({
      companyCode,
      email,
    });

    router.replace(user.role === 'admin' ? '/admin-dashboard' : '/dashboard');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.logoBox}>
        <Image
          source={require('../assets/images/safetrack-logo-transparent.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.form}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Digital Workplace Safety Solution</Text>

        <View style={styles.inputRow}>
          <Ionicons name="business-outline" size={18} color={colors.muted} />
          <TextInput
            placeholder="Company Code"
            placeholderTextColor={colors.muted}
            style={styles.input}
            value={companyCode}
            onChangeText={setCompanyCode}
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.inputRow}>
          <Ionicons name="mail-outline" size={18} color={colors.muted} />
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.muted}
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputRow}>
          <Ionicons name="lock-closed-outline" size={18} color={colors.muted} />
          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.muted}
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Ionicons name="finger-print-outline" size={18} color={colors.muted} />
        </View>

        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              'Password Reset',
              'Please contact your SafeTrack administrator to reset your password.'
            )
          }
        >
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              'Register',
              'Your company administrator can create your SafeTrack account.'
            )
          }
        >
          <Text style={styles.register}>
            Don&apos;t have an account? <Text style={styles.gold}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const colors = {
  primary: '#F6C22B',
  primaryDark: '#D9A90F',
  black: '#111111',
  white: '#FFFFFF',
  text: '#161616',
  muted: '#777777',
  border: '#E3E3E3',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  logoBox: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoImage: {
    width: 250,
    height: 210,
  },
  form: {
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    color: colors.muted,
    marginBottom: 18,
  },
  inputRow: {
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 18,
  },
  buttonText: {
    color: colors.black,
    fontWeight: '800',
    fontSize: 15,
  },
  forgot: {
    textAlign: 'center',
    marginTop: 18,
    color: colors.muted,
    fontSize: 13,
  },
  register: {
    textAlign: 'center',
    marginTop: 60,
    color: colors.muted,
    fontSize: 13,
  },
  gold: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
});
