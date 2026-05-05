import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export default function StatCard({ number, label, icon }) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.number}>{number}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.icon}>{icon}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  number: {
    fontSize: 25,
    fontWeight: '900',
    color: colors.text,
  },
  label: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
  },
  icon: {
    position: 'absolute',
    right: 14,
    top: 20,
    fontSize: 20,
  },
});