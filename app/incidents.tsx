import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import BottomNav from '../components/BottomNav';
import { getIncidents, Incident, IncidentStatus } from '../services/incidentsStorage';

type Filter = 'All' | IncidentStatus;

export default function Incidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadIncidents = useCallback(async () => {
    const savedIncidents = await getIncidents();
    setIncidents(savedIncidents);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadIncidents();
    }, [loadIncidents])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadIncidents();
    setRefreshing(false);
  };

  const normalizedQuery = query.trim().toLowerCase();
  const filteredIncidents = incidents.filter((incident) => {
    const matchesStatus =
      activeFilter === 'All' || incident.status === activeFilter;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [
        incident.title,
        incident.type,
        incident.severity,
        incident.location,
        incident.department,
        incident.id,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);

    return matchesStatus && matchesQuery;
  });

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Incidents</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>Incident History</Text>
        <Text style={styles.subtitle}>
          Track submitted reports, evidence, and resolution status.
        </Text>

        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18} color={colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by ID, location, type..."
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <View style={styles.filterRow}>
          {(['All', 'Open', 'In Progress', 'Resolved'] as const).map(
            (filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filter,
                  activeFilter === filter && styles.filterActive,
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === filter && styles.filterActiveText,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            )
          )}
        </View>

        {filteredIncidents.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="clipboard-outline" size={34} color={colors.muted} />
            <Text style={styles.emptyTitle}>No incidents found</Text>
            <Text style={styles.emptyText}>
              Submitted incident reports will appear here.
            </Text>
          </View>
        ) : (
          filteredIncidents.map((incident) => (
            <TouchableOpacity
              key={incident.id}
              style={styles.incidentCard}
              onPress={() =>
                router.push({
                  pathname: '/incident-details',
                  params: {
                    id: incident.id,
                  },
                })
              }
            >
              <View style={styles.iconBox}>
                {incident.photo ? (
                  <Image source={{ uri: incident.photo }} style={styles.thumb} />
                ) : (
                  <Ionicons name="warning-outline" size={19} color={colors.primaryDark} />
                )}
              </View>

              <View style={styles.incidentBody}>
                <Text style={styles.incidentTitle}>{incident.title}</Text>
                <Text style={styles.incidentMeta}>
                  #{incident.id} | {incident.type} | {incident.severity}
                </Text>
                <Text style={styles.incidentLocation}>
                  {incident.location} | {incident.department}
                </Text>
              </View>

              <StatusBadge status={incident.status} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <BottomNav active="Incidents" />
    </View>
  );
}

function StatusBadge({ status }: { status: IncidentStatus }) {
  return (
    <View
      style={[
        styles.statusBadge,
        status === 'Resolved' && styles.resolvedBadge,
        status === 'In Progress' && styles.progressBadge,
      ]}
    >
      <Text
        style={[
          styles.statusText,
          status === 'Resolved' && styles.resolvedText,
          status === 'In Progress' && styles.progressText,
        ]}
      >
        {status}
      </Text>
    </View>
  );
}

const colors = {
  primary: '#F6C22B',
  primaryDark: '#D9A90F',
  black: '#111111',
  white: '#FFFFFF',
  background: '#F7F7F7',
  text: '#161616',
  muted: '#777777',
  border: '#E3E3E3',
  success: '#22C55E',
  blue: '#3B82F6',
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 55,
    paddingBottom: 16,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.black,
  },
  content: {
    padding: 18,
    paddingBottom: 110,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
  },
  subtitle: {
    color: colors.muted,
    marginTop: 5,
    marginBottom: 16,
  },
  searchRow: {
    height: 48,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 13,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },
  filter: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: colors.muted,
    fontWeight: '800',
    fontSize: 12,
  },
  filterActiveText: {
    color: colors.black,
    fontWeight: '900',
  },
  incidentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFF7DB',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  incidentBody: {
    flex: 1,
    minWidth: 0,
  },
  incidentTitle: {
    fontWeight: '900',
    color: colors.text,
    fontSize: 14,
  },
  incidentMeta: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
  incidentLocation: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#FFF2CE',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  statusText: {
    fontSize: 10,
    color: colors.primaryDark,
    fontWeight: '900',
  },
  resolvedBadge: {
    backgroundColor: '#DCFCE7',
  },
  resolvedText: {
    color: colors.success,
  },
  progressBadge: {
    backgroundColor: '#DBEAFE',
  },
  progressText: {
    color: colors.blue,
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
    marginTop: 8,
  },
  emptyText: {
    marginTop: 4,
    color: colors.muted,
    textAlign: 'center',
    fontSize: 13,
  },
});
