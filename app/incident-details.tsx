import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  deleteIncident,
  getIncidents,
  Incident,
  IncidentStatus,
  saveIncidents,
} from '../services/incidentsStorage';

const workflow: IncidentStatus[] = ['Open', 'In Progress', 'Resolved'];

export default function IncidentDetails() {
  const params = useLocalSearchParams();
  const incidentId = String(params.id || '');

  const [incident, setIncident] = useState<Incident | null>(null);

  const loadIncident = useCallback(async () => {
    const incidents = await getIncidents();
    const selectedIncident = incidents.find((item) => item.id === incidentId);

    if (selectedIncident) {
      setIncident(selectedIncident);
    }
  }, [incidentId]);

  useFocusEffect(
    useCallback(() => {
      loadIncident();
    }, [loadIncident])
  );

  const updateStatus = async (newStatus: IncidentStatus) => {
    if (!incident) return;

    const updateTime = new Intl.DateTimeFormat('en-NA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());

    const updatedIncident: Incident = {
      ...incident,
      status: newStatus,
      auditTrail: [
        ...incident.auditTrail,
        {
          label: newStatus,
          time: updateTime,
          note: `Status changed to ${newStatus}.`,
        },
      ],
    };

    const incidents = await getIncidents();
    const updatedIncidents = incidents.map((item) =>
      item.id === incident.id ? updatedIncident : item
    );

    await saveIncidents(updatedIncidents);
    setIncident(updatedIncident);

    Alert.alert('Status Updated', `Incident status changed to ${newStatus}.`);
  };

  const handleDeleteIncident = () => {
    if (!incident) return;

    Alert.alert(
      'Delete Incident',
      'Are you sure you want to delete this incident report?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteIncident(incident.id);
            Alert.alert('Deleted', 'Incident report has been deleted.');
            router.replace('/incidents');
          },
        },
      ]
    );
  };

  if (!incident) {
    return (
      <View style={styles.page}>
        <Header />

        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>Loading incident...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.page}>
      <Header />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{incident.title}</Text>
            <StatusBadge status={incident.status} />
          </View>

          <Text style={styles.meta}>ID: #{incident.id}</Text>
          <Text style={styles.meta}>Type: {incident.type}</Text>
          <Text style={styles.meta}>Severity: {incident.severity}</Text>
          <Text style={styles.meta}>Reported: {incident.dateTime}</Text>
          <Text style={styles.meta}>Reported by {incident.reporter}</Text>

          {incident.photo ? (
            <Image source={{ uri: incident.photo }} style={styles.image} />
          ) : (
            <View style={styles.noImageBox}>
              <Ionicons name="camera-outline" size={30} color={colors.muted} />
              <Text style={styles.noImageText}>No photo attached</Text>
            </View>
          )}

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.body}>{incident.description}</Text>

          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.body}>{incident.location}</Text>
          <Text style={styles.bodyMuted}>Department: {incident.department}</Text>

          {incident.witnesses ? (
            <>
              <Text style={styles.sectionTitle}>Witnesses</Text>
              <Text style={styles.body}>{incident.witnesses}</Text>
            </>
          ) : null}

          {incident.factors ? (
            <>
              <Text style={styles.sectionTitle}>Contributing Factors</Text>
              <Text style={styles.body}>{incident.factors}</Text>
            </>
          ) : null}

          {incident.gps && (
            <>
              <Text style={styles.sectionTitle}>GPS Coordinates</Text>
              <Text style={styles.body}>
                Latitude: {incident.gps.latitude.toFixed(5)}
              </Text>
              <Text style={styles.body}>
                Longitude: {incident.gps.longitude.toFixed(5)}
              </Text>
            </>
          )}

          <Text style={styles.sectionTitle}>Status Workflow</Text>

          <View style={styles.statusButtons}>
            {workflow.map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.workflowButton,
                  incident.status === status && styles.workflowButtonActive,
                ]}
                onPress={() => updateStatus(status)}
              >
                <Text
                  style={[
                    styles.workflowText,
                    incident.status === status && styles.workflowTextActive,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Status Updates</Text>

          <View style={styles.timeline}>
            {incident.auditTrail.map((entry, index) => (
              <View key={`${entry.label}-${entry.time}-${index}`} style={styles.timelineItem}>
                <View
                  style={[
                    styles.dot,
                    entry.label === 'Resolved' && { backgroundColor: colors.success },
                    entry.label === 'In Progress' && { backgroundColor: colors.blue },
                  ]}
                />
                <View style={styles.timelineBody}>
                  <Text style={styles.timelineDate}>{entry.time}</Text>
                  <Text style={styles.timelineText}>{entry.note}</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteIncident}>
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
            <Text style={styles.deleteText}>Delete Incident</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function Header() {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
        <Ionicons name="chevron-back" size={26} color={colors.black} />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Incident Details</Text>

      <View style={styles.headerButton} />
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
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.muted,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  title: {
    flex: 1,
    fontSize: 19,
    fontWeight: '900',
    color: colors.text,
  },
  statusBadge: {
    backgroundColor: '#FFF2CE',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 11,
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
  meta: {
    marginTop: 5,
    fontSize: 12,
    color: colors.muted,
    fontWeight: '600',
  },
  image: {
    height: 200,
    borderRadius: 14,
    marginTop: 16,
    backgroundColor: colors.border,
  },
  noImageBox: {
    height: 150,
    borderRadius: 14,
    marginTop: 16,
    backgroundColor: '#F3F3F3',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  noImageText: {
    color: colors.muted,
    fontWeight: '700',
    marginTop: 6,
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 6,
    fontSize: 15,
    fontWeight: '900',
    color: colors.text,
  },
  body: {
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
  },
  bodyMuted: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 21,
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  workflowButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  workflowButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  workflowText: {
    color: colors.muted,
    fontWeight: '800',
    fontSize: 12,
  },
  workflowTextActive: {
    color: colors.black,
    fontWeight: '900',
  },
  timeline: {
    marginTop: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  timelineBody: {
    flex: 1,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primaryDark,
    marginTop: 4,
  },
  timelineDate: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '900',
  },
  timelineText: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  deleteButton: {
    marginTop: 22,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteText: {
    color: colors.danger,
    fontWeight: '900',
  },
});
