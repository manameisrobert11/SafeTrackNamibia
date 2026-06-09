import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BottomNav from '../components/BottomNav';
import {
  AppUser,
  getCurrentUser,
  getLoginHistory,
  logoutUser,
} from '../services/authStorage';
import { getIncidents, Incident } from '../services/incidentsStorage';

export default function AdminProfile() {
  const [admin, setAdmin] = useState<AppUser | null>(null);
  const [loginHistory, setLoginHistory] = useState<AppUser[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function loadProfile() {
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
      }

      loadProfile();
    }, [])
  );

  const openReports = incidents.filter(
    (incident) => incident.status !== 'Resolved'
  ).length;
  const priorityReports = incidents.filter(
    (incident) =>
      incident.status !== 'Resolved' &&
      (incident.severity === 'Critical' || incident.severity === 'High')
  ).length;

  const logout = async () => {
    await logoutUser();
    router.replace('/');
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileTop}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>{admin?.name.charAt(0) || 'M'}</Text>
          </View>

          <Text style={styles.name}>{admin?.name || 'Safety Manager'}</Text>
          <Text style={styles.email}>{admin?.email || 'admin@safetrack.na'}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Manager Account</Text>

          <InfoRow label="Company" value="SafeTrack Namibia" />
          <InfoRow label="Role" value="Administrator" />
          <InfoRow label="Department" value={admin?.department || 'Safety Management'} />
          <InfoRow label="Last Login" value={admin?.lastLogin || 'Current session'} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Admin Summary</Text>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryNumber}>{incidents.length}</Text>
              <Text style={styles.summaryLabel}>Reports</Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryNumber}>{openReports}</Text>
              <Text style={styles.summaryLabel}>Open</Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryNumber}>{priorityReports}</Text>
              <Text style={styles.summaryLabel}>Priority</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() =>
            Alert.alert(
              'Admin Notifications',
              'Priority incident, compliance, and status-change alerts are enabled.'
            )
          }
        >
          <Text style={styles.settingsText}>Notification Settings</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() =>
            Alert.alert(
              'Admin Support',
              'Use the reports and alerts tabs to manage accidents and review system activity.'
            )
          }
        >
          <Text style={styles.settingsText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Recent Logins</Text>

        <View style={styles.usersCard}>
          {loginHistory.map((user) => (
            <View key={`${user.email}-${user.lastLogin}`} style={styles.userRow}>
              <View style={styles.avatarSmall}>
                <Text style={styles.avatarSmallText}>{user.name.charAt(0)}</Text>
              </View>

              <View style={styles.userBody}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userMeta}>
                  {user.email} | {user.role} | {user.lastLogin}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav active="Profile" mode="admin" />
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
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
  profileTop: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 22,
  },
  avatarLarge: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarLargeText: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.black,
  },
  name: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
  },
  email: {
    marginTop: 4,
    fontSize: 13,
    color: colors.muted,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
    marginBottom: 8,
  },
  infoRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  label: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '800',
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#FFF7DB',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.black,
  },
  summaryLabel: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 4,
    fontWeight: '700',
  },
  settingsButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsText: {
    color: colors.text,
    fontWeight: '800',
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 12,
    fontSize: 17,
    fontWeight: '900',
    color: colors.text,
  },
  usersCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 14,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatarSmall: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF7DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSmallText: {
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
  logoutButton: {
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 12,
  },
  logoutText: {
    color: colors.danger,
    fontWeight: '900',
    fontSize: 15,
  },
});
