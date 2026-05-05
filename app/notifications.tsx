import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import {
  getIncidents,
  getTrainingRecords,
  Incident,
  TrainingRecord,
} from '../services/incidentsStorage';

export default function Notifications() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [trainingRecords, setTrainingRecords] = useState<TrainingRecord[]>([]);

  const loadNotifications = useCallback(async () => {
    const [savedIncidents, savedTraining] = await Promise.all([
      getIncidents(),
      getTrainingRecords(),
    ]);

    setIncidents(savedIncidents);
    setTrainingRecords(savedTraining);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications])
  );

  const priorityIncidents = incidents.filter(
    (item) =>
      item.status !== 'Resolved' &&
      (item.severity === 'Critical' || item.severity === 'High')
  );
  const progressIncidents = incidents.filter(
    (item) => item.status === 'In Progress'
  );
  const trainingAlerts = trainingRecords.filter(
    (item) => item.status !== 'Compliant'
  );

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="chevron-back" size={26} color={colors.black} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifications</Text>

        <View style={styles.headerButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Safety Alerts</Text>
        <Text style={styles.subtitle}>
          Incident updates, priority escalations, and training reminders.
        </Text>

        {priorityIncidents.length > 0 && (
          <NotificationCard
            icon="alert-circle-outline"
            tone="red"
            title={`${priorityIncidents.length} priority incident${
              priorityIncidents.length > 1 ? 's' : ''
            }`}
            text="Critical and high severity reports need manager attention."
          />
        )}

        {progressIncidents.length > 0 && (
          <NotificationCard
            icon="sync-outline"
            tone="blue"
            title={`${progressIncidents.length} incident${
              progressIncidents.length > 1 ? 's are' : ' is'
            } in progress`}
            text="The responsible team is currently working on these issues."
          />
        )}

        {trainingAlerts.length > 0 && (
          <NotificationCard
            icon="school-outline"
            tone="gold"
            title={`${trainingAlerts.length} compliance reminder${
              trainingAlerts.length > 1 ? 's' : ''
            }`}
            text="Training certifications are expiring soon or overdue."
          />
        )}

        {incidents.slice(0, 5).map((incident) => (
          <TouchableOpacity
            key={incident.id}
            style={styles.incidentNotification}
            onPress={() =>
              router.push({
                pathname: '/incident-details',
                params: {
                  id: incident.id,
                },
              })
            }
          >
            <View style={styles.smallDot} />

            <View style={styles.notificationBody}>
              <Text style={styles.incidentTitle}>{incident.title}</Text>
              <Text style={styles.incidentText}>
                Status: {incident.status} | Severity: {incident.severity}
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={20} color={colors.muted} />
          </TouchableOpacity>
        ))}

        {incidents.length === 0 && trainingAlerts.length === 0 && (
          <View style={styles.emptyCard}>
            <Ionicons name="notifications-outline" size={34} color={colors.muted} />
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyText}>
              Incident updates and safety alerts will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function NotificationCard({
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

      <View style={styles.notificationBody}>
        <Text style={styles.notificationTitle}>{title}</Text>
        <Text style={styles.notificationText}>{text}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: colors.black,
  },
  content: {
    padding: 18,
    paddingBottom: 40,
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
  notificationBody: {
    flex: 1,
    minWidth: 0,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.text,
  },
  notificationText: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  incidentNotification: {
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
  smallDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primaryDark,
  },
  incidentTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.text,
  },
  incidentText: {
    marginTop: 2,
    fontSize: 12,
    color: colors.muted,
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
