import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import IncidentCard from '../components/IncidentCard';
import StatCard from '../components/StatCard';
import { incidents } from '../data/mockIncidents';
import { colors } from '../theme/colors';

export default function DashboardScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Welcome, Saara</Text>
          <Text style={styles.subtitle}>Stay safe today!</Text>
        </View>
        <Ionicons name="notifications-outline" size={24} color={colors.black} />
      </View>

      <View style={styles.statsGrid}>
        <StatCard number="7" label="Incidents Reported" icon="⚠️" />
        <StatCard number="3" label="Open Incidents" icon="🔶" />
        <StatCard number="4" label="In Progress" icon="⚙️" />
        <StatCard number="12" label="Resolved" icon="✅" />
      </View>

      <Text style={styles.sectionTitle}>Recent Incidents</Text>

      {incidents.map((incident) => (
        <IncidentCard
          key={incident.id}
          incident={incident}
          onPress={() =>
            navigation.navigate('IncidentDetails', { incident })
          }
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 18,
    paddingTop: 60,
  },
  header: {
    backgroundColor: colors.primary,
    marginHorizontal: -18,
    marginTop: -60,
    paddingTop: 58,
    paddingHorizontal: 18,
    paddingBottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 19,
    fontWeight: '900',
    color: colors.black,
  },
  subtitle: {
    marginTop: 4,
    color: '#5A4A14',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
    marginTop: 8,
    marginBottom: 12,
  },
});