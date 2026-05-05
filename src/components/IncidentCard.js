import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';

function getStatusColor(status) {
  if (status === 'Resolved') return colors.success;
  if (status === 'In Progress') return colors.blue;
  return colors.warning;
}

export default function IncidentCard({ incident, onPress }) {
  const statusColor = getStatusColor(incident.status);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconBox}>
        <Ionicons name="warning-outline" size={22} color={statusColor} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{incident.title}</Text>
        <Text style={styles.meta}>{incident.time}</Text>
        <Text style={styles.location}>{incident.location}</Text>
      </View>

      <View style={[styles.badge, { backgroundColor: `${statusColor}22` }]}>
        <Text style={[styles.badgeText, { color: statusColor }]}>
          {incident.status}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
    color: colors.text,
    fontSize: 14,
  },
  meta: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 11,
  },
  location: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 11,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
});