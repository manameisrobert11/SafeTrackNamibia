import { StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import { colors } from '../theme/colors';

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>S</Text>
      </View>

      <Text style={styles.name}>Saara Ekandjo</Text>
      <Text style={styles.email}>saaraekandjo999@gmail.com</Text>

      <View style={styles.infoCard}>
        <Text style={styles.label}>Company</Text>
        <Text style={styles.value}>SafeTrack Namibia</Text>

        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>Employee</Text>

        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>Active</Text>
      </View>

      <AppButton
        title="Logout"
        onPress={() => navigation.replace('Login')}
        style={{ marginTop: 24, width: '100%' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    paddingTop: 70,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 34,
    fontWeight: '900',
    color: colors.black,
  },
  name: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
  },
  email: {
    marginTop: 4,
    color: colors.muted,
  },
  infoCard: {
    width: '100%',
    marginTop: 28,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 12,
  },
  value: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
});