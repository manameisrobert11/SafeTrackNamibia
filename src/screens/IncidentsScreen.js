import { ScrollView, StyleSheet, Text } from 'react-native';
import IncidentCard from '../components/IncidentCard';
import { incidents } from '../data/mockIncidents';
import { colors } from '../theme/colors';

export default function IncidentsScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>All Incidents</Text>
      <Text style={styles.subtitle}>Track submitted reports and resolution status.</Text>

      {incidents.map((incident) => (
        <IncidentCard
          key={incident.id}
          incident={incident}
          onPress={() => navigation.navigate('IncidentDetails', { incident })}
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
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 18,
    color: colors.muted,
  },
});