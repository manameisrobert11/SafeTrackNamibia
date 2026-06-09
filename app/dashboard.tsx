import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import BottomNav from '../components/BottomNav';
import { AppUser, getCurrentUser } from '../services/authStorage';
import {
  getIncidents,
  getTrainingRecords,
  Incident,
  TrainingRecord,
} from '../services/incidentsStorage';

export default function Dashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = useCallback(async () => {
    const [user, savedIncidents, savedTraining] = await Promise.all([
      getCurrentUser(),
      getIncidents(),
      getTrainingRecords(),
    ]);

    if (user?.role === 'admin') {
      router.replace('/admin-dashboard');
      return;
    }

    setCurrentUser(user);
    setIncidents(savedIncidents);
    setTrainingRecords(savedTraining);
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

  const totalIncidents = incidents.length;
  const openIncidents = incidents.filter((item) => item.status === 'Open').length;
  const inProgressIncidents = incidents.filter(
    (item) => item.status === 'In Progress'
  ).length;
  const resolvedIncidents = incidents.filter(
    (item) => item.status === 'Resolved'
  ).length;
  const criticalHighIncidents = incidents.filter(
    (item) => item.severity === 'Critical' || item.severity === 'High'
  ).length;
  const compliantTraining = trainingRecords.filter(
    (item) => item.status === 'Compliant'
  ).length;
  const complianceScore =
    trainingRecords.length === 0
      ? 100
      : Math.round((compliantTraining / trainingRecords.length) * 100);

  const recentIncidents = incidents.slice(0, 3);

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <Text style={styles.headerSub}>SafeTrack Namibia</Text>
        </View>

        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={() => router.push('/notifications')}
        >
          <Ionicons name="notifications-outline" size={22} color={colors.black} />
          {criticalHighIncidents > 0 && <View style={styles.alertDot} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.welcome}>
          Welcome, {currentUser?.name.split(' ')[0] || 'Saara'}
        </Text>
        <Text style={styles.subtitle}>Stay safe today!</Text>

        <View style={styles.statsGrid}>
          <StatCard
            icon="warning-outline"
            value={totalIncidents}
            label="Incidents Reported"
            tone="gold"
          />
          <StatCard
            icon="radio-button-on-outline"
            value={openIncidents}
            label="Open Incidents"
            tone="orange"
          />
          <StatCard
            icon="sync-outline"
            value={inProgressIncidents}
            label="In Progress"
            tone="blue"
          />
          <StatCard
            icon="checkmark-circle-outline"
            value={resolvedIncidents}
            label="Resolved"
            tone="green"
          />
        </View>

        <View style={styles.complianceCard}>
          <View>
            <Text style={styles.complianceTitle}>Compliance Score</Text>
            <Text style={styles.complianceText}>
              Training records and statutory reminders
            </Text>
          </View>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>{complianceScore}%</Text>
          </View>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Recent Incidents</Text>

          <TouchableOpacity onPress={() => router.replace('/incidents')}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        {recentIncidents.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="clipboard-outline" size={34} color={colors.muted} />
            <Text style={styles.emptyTitle}>No reports yet</Text>
            <Text style={styles.emptyText}>
              Your submitted safety reports will appear here.
            </Text>
          </View>
        ) : (
          recentIncidents.map((incident) => (
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
              <View style={styles.incidentIcon}>
                {incident.photo ? (
                  <Image source={{ uri: incident.photo }} style={styles.thumb} />
                ) : (
                  <Ionicons name="warning-outline" size={20} color={colors.primaryDark} />
                )}
              </View>

              <View style={styles.incidentBody}>
                <Text style={styles.incidentTitle}>{incident.title}</Text>
                <Text style={styles.incidentMeta}>
                  {incident.type} | {incident.severity} | {incident.time}
                </Text>
                <Text style={styles.incidentLocation}>{incident.location}</Text>
              </View>

              <StatusBadge status={incident.status} />
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity
          style={styles.reportButton}
          onPress={() => router.replace('/report')}
        >
          <Ionicons name="add-circle-outline" size={20} color={colors.black} />
          <Text style={styles.reportButtonText}>Report New Incident</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav active="Dashboard" />
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
  tone: 'gold' | 'orange' | 'blue' | 'green';
}) {
  const toneColor = {
    gold: colors.primaryDark,
    orange: colors.orange,
    blue: colors.blue,
    green: colors.success,
  }[tone];

  return (
    <View style={styles.statCard}>
      <Text style={styles.statNumber}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Ionicons
        name={icon}
        size={20}
        color={toneColor}
        style={styles.statIcon}
      />
    </View>
  );
}

function StatusBadge({ status }: { status: Incident['status'] }) {
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
  orange: '#F97316',
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
  headerIconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertDot: {
    position: 'absolute',
    right: 8,
    top: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
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
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 96,
  },
  statNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.black,
  },
  statLabel: {
    marginTop: 4,
    fontSize: 12,
    color: colors.muted,
  },
  statIcon: {
    position: 'absolute',
    right: 14,
    top: 20,
  },
  complianceCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  complianceTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.text,
  },
  complianceText: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
  },
  scoreBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    color: colors.success,
    fontWeight: '900',
  },
  sectionRow: {
    marginTop: 4,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
  },
  viewAll: {
    color: colors.primaryDark,
    fontWeight: '900',
    fontSize: 13,
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
  incidentIcon: {
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
    marginTop: 2,
    color: colors.muted,
    fontSize: 11,
  },
  incidentLocation: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 11,
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
  reportButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 18,
  },
  reportButtonText: {
    color: colors.black,
    fontWeight: '900',
    fontSize: 15,
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
