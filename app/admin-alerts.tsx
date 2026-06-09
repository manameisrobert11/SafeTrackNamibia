import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BottomNav from '../components/BottomNav';
import { AppUser, getCurrentUser, getLoginHistory } from '../services/authStorage';
import {
  getIncidents,
  getTrainingRecords,
  Incident,
  TrainingRecord,
} from '../services/incidentsStorage';

export default function AdminAlerts() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);
  const [loginHistory, setLoginHistory] = useState<AppUser[]>([]);

  const loadAlerts = useCallback(async () => {
    const [currentUser, savedIncidents, savedTraining, users] = await Promise.all([
      getCurrentUser(),
      getIncidents(),
      getTrainingRecords(),
      getLoginHistory(),
    ]);

    if (!currentUser || currentUser.role !== 'admin') {
      router.replace('/');
      return;
    }

    setIncidents(savedIncidents);
    setTrainingRecords(savedTraining);
    setLoginHistory(users);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAlerts();
    }, [loadAlerts])
  );

  const priorityIncidents = incidents.filter(
    (incident) =>
      incident.status !== 'Resolved' &&
      (incident.severity === 'Critical' || incident.severity === 'High')
  );
  const progressIncidents = incidents.filter(
    (incident) => incident.status === 'In Progress'
  );
  const trainingAlerts = trainingRecords.filter(
    (record) => record.status !== 'Compliant'
  );

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Alerts</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Safety Control Alerts</Text>
        <Text style={styles.subtitle}>
          Priority reports, active investigations, compliance reminders, and logins.
        </Text>

        <AlertCard
          icon="alert-circle-outline"
          tone="red"
          title={`${priorityIncidents.length} priority report${
            priorityIncidents.length === 1 ? '' : 's'
          }`}
          text="High and critical reports still need manager attention."
        />
        <AlertCard
          icon="sync-outline"
          tone="blue"
          title={`${progressIncidents.length} active investigation${
            progressIncidents.length === 1 ? '' : 's'
          }`}
          text="Reports currently marked as in progress."
        />
        <AlertCard
          icon="school-outline"
          tone="gold"
          title={`${trainingAlerts.length} compliance reminder${
            trainingAlerts.length === 1 ? '' : 's'
          }`}
          text="Training records are expiring soon or overdue."
        />

        <Text style={styles.sectionTitle}>Priority Reports</Text>

        {priorityIncidents.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="checkmark-circle-outline" size={34} color={colors.success} />
            <Text style={styles.emptyTitle}>No priority alerts</Text>
            <Text style={styles.emptyText}>High-risk reports are clear for now.</Text>
          </View>
        ) : (
          priorityIncidents.map((incident) => (
            <TouchableOpacity
              key={incident.id}
              style={styles.incidentRow}
              onPress={() =>
                router.push({
                  pathname: '/incident-details',
                  params: {
                    id: incident.id,
                  },
                })
              }
            >
              <View style={styles.dot} />
              <View style={styles.rowBody}>
                <Text style={styles.rowTitle}>{incident.title}</Text>
                <Text style={styles.rowMeta}>
                  #{incident.id} | {incident.severity} | {incident.reporter}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.muted} />
            </TouchableOpacity>
          ))
        )}

        <Text style={styles.sectionTitle}>System Logins</Text>

        <View style={styles.usersCard}>
          {loginHistory.map((user) => (
            <View key={`${user.email}-${user.lastLogin}`} style={styles.userRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
              </View>

              <View style={styles.rowBody}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.rowMeta}>
                  {user.email} | {user.role} | {user.lastLogin}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomNav active="Alerts" mode="admin" />
    </View>
  );
}

function AlertCard({
  icon,
  tone,
  title,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  tone: 'red' | 'blue' | 'gold';
  title: string;
  text: string;
}) {
  const toneStyles = {
    red: [styles.iconBoxRed, colors.danger],
    blue: [styles.iconBoxBlue, colors.blue],
    gold: [styles.iconBoxGold, colors.primaryDark],
  } as const;

  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, toneStyles[tone][0]]}>
        <Ionicons name={icon} size={22} color={toneStyles[tone][1]} />
      </View>

      <View style={styles.rowBody}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardText}>{text}</Text>
      </View>
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
    marginBottom: 18,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxRed: {
    backgroundColor: '#FEE2E2',
  },
  iconBoxBlue: {
    backgroundColor: '#DBEAFE',
  },
  iconBoxGold: {
    backgroundColor: '#FFF7DB',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.text,
  },
  cardText: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 12,
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
  },
  incidentRow: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.danger,
  },
  rowBody: {
    flex: 1,
    minWidth: 0,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.text,
  },
  rowMeta: {
    marginTop: 2,
    fontSize: 11,
    color: colors.muted,
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
  userName: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 13,
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
