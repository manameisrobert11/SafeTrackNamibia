import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import BottomNav from '../components/BottomNav';
import {
  AppUser,
  getCurrentUser,
  getLoginHistory,
  logoutUser,
} from '../services/authStorage';
import {
  getIncidents,
  Incident,
  IncidentStatus,
  updateIncidentStatus,
} from '../services/incidentsStorage';

const workflow: IncidentStatus[] = ['Open', 'In Progress', 'Resolved'];

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<AppUser | null>(null);
  const [loginHistory, setLoginHistory] = useState<AppUser[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = useCallback(async () => {
    const [currentUser, users, savedIncidents] = await Promise.all([
      getCurrentUser(),
      getLoginHistory(),
      getIncidents(),
    ]);

    if (!currentUser || currentUser.role !== 'admin') {
      router.replace('/');
      return;
    }

    setAdmin(currentUser);
    setLoginHistory(users);
    setIncidents(savedIncidents);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  const stats = useMemo(() => {
    const open = incidents.filter((incident) => incident.status === 'Open').length;
    const inProgress = incidents.filter(
      (incident) => incident.status === 'In Progress'
    ).length;
    const resolved = incidents.filter(
      (incident) => incident.status === 'Resolved'
    ).length;
    const priority = incidents.filter(
      (incident) =>
        incident.status !== 'Resolved' &&
        (incident.severity === 'Critical' || incident.severity === 'High')
    ).length;

    return {
      open,
      inProgress,
      resolved,
      priority,
      total: incidents.length,
    };
  }, [incidents]);

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

  const logout = async () => {
    await logoutUser();
    router.replace('/');
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Manager Dashboard</Text>
          <Text style={styles.headerSub}>Accident and incident control</Text>
        </View>

        <TouchableOpacity style={styles.logoutIcon} onPress={logout}>
          <Ionicons name="log-out-outline" size={22} color={colors.black} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.welcome}>Welcome, {admin?.name || 'Manager'}</Text>
        <Text style={styles.subtitle}>Review reports, assign progress, and close resolved cases.</Text>

        <View style={styles.statsGrid}>
          <StatCard icon="alert-circle-outline" value={stats.priority} label="Priority" tone="red" />
          <StatCard icon="radio-button-on-outline" value={stats.open} label="Open" tone="gold" />
          <StatCard icon="sync-outline" value={stats.inProgress} label="In Progress" tone="blue" />
          <StatCard icon="checkmark-circle-outline" value={stats.resolved} label="Resolved" tone="green" />
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Accident Reports</Text>
          <Text style={styles.sectionMeta}>{stats.total} total</Text>
        </View>

        {incidents.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="clipboard-outline" size={34} color={colors.muted} />
            <Text style={styles.emptyTitle}>No reports yet</Text>
            <Text style={styles.emptyText}>New employee reports will appear here.</Text>
          </View>
        ) : (
          incidents.map((incident) => (
            <View key={incident.id} style={styles.reportCard}>
              <View style={styles.reportTop}>
                <View style={styles.reportBody}>
                  <Text style={styles.reportTitle}>{incident.title}</Text>
                  <Text style={styles.reportMeta}>
                    #{incident.id} | {incident.type} | {incident.severity}
                  </Text>
                  <Text style={styles.reportMeta}>
                    Reported by {incident.reporter} | {incident.dateTime}
                  </Text>
                  <Text style={styles.reportMeta}>
                    {incident.location} | {incident.department}
                  </Text>
                </View>

                <StatusBadge status={incident.status} />
              </View>

              <Text style={styles.reportDescription}>{incident.description}</Text>

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
                <Text style={styles.detailsText}>Open full details</Text>
                <Ionicons name="chevron-forward" size={18} color={colors.primaryDark} />
              </TouchableOpacity>
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>System Logins</Text>

        <View style={styles.usersCard}>
          {loginHistory.length === 0 ? (
            <Text style={styles.emptyInline}>No login history yet.</Text>
          ) : (
            loginHistory.map((user) => (
              <View key={`${user.email}-${user.lastLogin}`} style={styles.userRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                </View>

                <View style={styles.userBody}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userMeta}>
                    {user.email} | {user.role} | {user.lastLogin}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <BottomNav active="Manager" mode="admin" />
    </View>
  );
}

function StatCard({
  icon,
  value,
  label,
  tone,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  label: string;
  tone: 'red' | 'gold' | 'blue' | 'green';
}) {
  const toneColor = {
    red: colors.danger,
    gold: colors.primaryDark,
    blue: colors.blue,
    green: colors.success,
  }[tone];

  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={20} color={toneColor} />
      <Text style={styles.statNumber}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
  danger: '#EF4444',
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 52,
    paddingBottom: 14,
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
  headerSub: {
    marginTop: 2,
    fontSize: 11,
    color: colors.black,
    opacity: 0.72,
    fontWeight: '700',
  },
  logoutIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 18,
    paddingBottom: 110,
  },
  welcome: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.text,
  },
  subtitle: {
    color: colors.muted,
    marginTop: 4,
    marginBottom: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    minHeight: 96,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 15,
    marginBottom: 12,
  },
  statNumber: {
    marginTop: 8,
    fontSize: 25,
    fontWeight: '900',
    color: colors.black,
  },
  statLabel: {
    marginTop: 2,
    fontSize: 12,
    color: colors.muted,
    fontWeight: '700',
  },
  sectionRow: {
    marginTop: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 12,
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
  },
  sectionMeta: {
    color: colors.muted,
    fontWeight: '800',
    fontSize: 12,
  },
  reportCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reportTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  reportBody: {
    flex: 1,
    minWidth: 0,
  },
  reportTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '900',
  },
  reportMeta: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  reportDescription: {
    marginTop: 10,
    color: colors.text,
    fontSize: 13,
    lineHeight: 19,
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
  usersCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF7DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.primaryDark,
    fontWeight: '900',
  },
  userBody: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 13,
  },
  userMeta: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 11,
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
  emptyInline: {
    color: colors.muted,
    fontWeight: '700',
  },
});
