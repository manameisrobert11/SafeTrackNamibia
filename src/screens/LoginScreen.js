import { Ionicons } from '@expo/vector-icons';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import AppButton from '../components/AppButton';
import { colors } from '../theme/colors';

export default function LoginScreen({ navigation }) {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.logoBox}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>ST</Text>
        </View>

        <Text style={styles.brand}>SafeTrack</Text>
        <Text style={styles.country}>Namibia</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Login to your account</Text>

        <View style={styles.inputBox}>
          <Ionicons name="mail-outline" size={20} color={colors.muted} />
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.muted}
            style={styles.input}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.muted} />
          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.muted}
            style={styles.input}
            secureTextEntry
          />
          <Ionicons name="eye-outline" size={20} color={colors.muted} />
        </View>

        <AppButton
          title="Login"
          onPress={() => navigation.replace('MainTabs')}
          style={{ marginTop: 18 }}
        />

        <Text style={styles.forgot}>Forgot Password?</Text>

        <Text style={styles.register}>
          Don&apos;t have an account? <Text style={styles.registerGold}>Register</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  logoBox: {
    alignItems: 'center',
    marginBottom: 38,
  },
  logo: {
    width: 86,
    height: 86,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 30,
    fontWeight: '900',
    color: colors.black,
  },
  brand: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.black,
  },
  country: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.primaryDark,
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
  inputBox: {
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
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
  registerGold: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
});