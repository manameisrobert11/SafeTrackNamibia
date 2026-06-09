import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import BottomNav from '../components/BottomNav';
import { AppUser, getCurrentUser } from '../services/authStorage';
import {
  getIncidents,
  Incident,
  IncidentStatus,
  updateIncidentStatus,
} from '../services/incidentsStorage';

type Filter = 'All' | IncidentStatus;
const workflow: IncidentStatus[] = ['Open', 'In Progress', 'Resolved'];

export default function AdminReports() {
  const [admin, setAdmin] = useState<AppUser | null>(null);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadReports = useCallback(async () => {
    const [currentUser, savedIncidents] = await Promise.all([
      getCurrentUser(),
      getIncidents(),
    ]);

    if (!currentUser || currentUser.role !== 'admin') {
      router.replace('/');
      return;
    }

    setAdmin(currentUser);
    setIncidents(savedIncidents);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [loadReports])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  const updateStatus = async (incidentId: string, status: IncidentStatus) => {
    if (!admin) return;

    const result = await updateIncidentStatus({
      incidentId,
      status,
      actor: admin.name,
    });

    setIncidents(result.incidents);
    Alert.alert('Status Updated', `Incident ${incidentId} is now ${status}.`);
  };

  const normalizedQuery = query.trim().toLowerCase();
  const filteredIncidents = incidents.filter((incident) => {
    const matchesStatus =
      activeFilter === 'All' || incident.status === activeFilter;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      [
        incident.id,
        incident.title,
        incident.type,
        incident.severity,
        incident.status,
        incident.reporter,
        incident.location,
        incident.department,
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);

    return matchesStatus && matchesQuery;
  });

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Reports</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>All Accident Reports</Text>
        <Text style={styles.subtitle}>
          Search reports, review creators, and update status.
        </Text>

        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18} color={colors.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by ID, reporter, department..."
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        <View style={styles.filterRow}>
          {(['All', 'Open', 'In Progress', 'Resolved'] as const).map((filter) => (
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
          ))}
        </View>

        {filteredIncidents.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="documents-outline" size={34} color={colors.muted} />
            <Text style={styles.emptyTitle}>No reports found</Text>
            <Text style={styles.emptyText}>Try another search or status filter.</Text>
          </View>
        ) : (
          filteredIncidents.map((incident) => (
            <View key={incident.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{incident.title}</Text>
                  <Text style={styles.meta}>
                    #{incident.id} | {incident.type} | {incident.severity}
                  </Text>
                  <Text style={styles.meta}>
                    Created by {incident.reporter} | {incident.dateTime}
                  </Text>
                  <Text style={styles.meta}>
                    {incident.location} | {incident.department}
                  </Text>
                </View>

                <StatusBadge status={incident.status} />
              </View>

              <View style={styles.actionsRow}>
                {workflow.map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusButton,
                      incident.status === status && styles.statusButtonActive,
                    ]}
                    onPress={() => updateStatus(incident.id, status)}
                  >
                    <Text
                      style={[
                        styles.statusButtonText,
                        incident.status === status && styles.statusButtonTextActive,
                      ]}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.detailsButton}
                onPress={() =>
                  router.push({
                    pathname: '/incident-details',
                    params: {
                      id: incident.id,
                    },
                  })
                }
              >
                <Text style={styles.detailsText}>Open details and audit trail</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.primaryDark} />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      <BottomNav active="Reports" mode="admin" />
    </View>
  );
}

function StatusBadge({ status }: { status: IncidentStatus }) {
  return (
    <View
      style={[
        styles.badge,
        status === 'Resolved' && styles.resolvedBadge,
        status === 'In Progress' && styles.progressBadge,
      ]}
    >
      <Text
        style={[
          styles.badgeText,
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
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  meta: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  statusButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  statusButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusButtonText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  statusButtonTextActive: {
    color: colors.black,
    fontWeight: '900',
  },
  detailsButton: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailsText: {
    color: colors.primaryDark,
    fontWeight: '900',
    fontSize: 13,
  },
  badge: {
    backgroundColor: '#FFF2CE',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  badgeText: {
    color: colors.primaryDark,
    fontWeight: '900',
    fontSize: 10,
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
