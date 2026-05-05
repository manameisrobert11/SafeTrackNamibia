import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../theme/colors';

export default function IncidentDetailsScreen({ route, navigation }) {
  const { incident } = route.params;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Incident Details</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.title}>{incident.title}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{incident.status}</Text>
          </View>
        </View>

        <Text style={styles.meta}>ID: #{incident.id}</Text>
        <Text style={styles.meta}>Reported on {incident.time}</Text>
        <Text style={styles.meta}>by {incident.reporter}</Text>

        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1584974292709-5c46f23579d7?q=80&w=1200',
          }}
          style={styles.image}
        />

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.body}>{incident.description}</Text>

        <Text style={styles.sectionTitle}>Location</Text>
        <Text style={styles.body}>{incident.location}</Text>

        <Text style={styles.sectionTitle}>Status Updates</Text>

        <View style={styles.timelineItem}>
          <View style={styles.dot} />
          <View>
            <Text style={styles.timelineDate}>20 May 2024, 10:30 AM</Text>
            <Text style={styles.timelineText}>Reported</Text>
          </View>
        </View>

        <View style={styles.timelineItem}>
          <View style={[styles.dot, { backgroundColor: colors.blue }]} />
          <View>
            <Text style={styles.timelineDate}>20 May 2024, 11:15 AM</Text>
            <Text style={styles.timelineText}>In Progress</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 58,
    paddingBottom: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.black,
  },
  card: {
    backgroundColor: colors.white,
    margin: 18,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  badge: {
    backgroundColor: '#FFF2CE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: colors.warning,
    fontWeight: '900',
    fontSize: 11,
  },
  meta: {
    marginTop: 5,
    color: colors.muted,
    fontSize: 12,
  },
  image: {
    height: 180,
    borderRadius: 14,
    marginTop: 16,
    backgroundColor: colors.border,
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 6,
    fontWeight: '900',
    fontSize: 15,
    color: colors.text,
  },
  body: {
    color: colors.dark,
    lineHeight: 21,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  dot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: colors.warning,
    marginTop: 4,
  },
  timelineDate: {
    fontWeight: '800',
    color: colors.text,
    fontSize: 12,
  },
  timelineText: {
    color: colors.muted,
    fontSize: 12,
  },
});