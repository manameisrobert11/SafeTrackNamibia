import { router } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
} from 'react-native';
import BottomNav from '../components/BottomNav';
import { resetDemoIncidents, clearIncidents } from '../services/incidentsStorage';

export default function Profile() {
  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>S</Text>
          </View>

          <Text style={styles.name}>Saara Ekandjo</Text>
          <Text style={styles.email}>saaraekandjo999@gmail.com</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Company</Text>
            <Text style={styles.value}>SafeTrack Namibia</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Role</Text>
            <Text style={styles.value}>Employee</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Department</Text>
            <Text style={styles.value}>Operations</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.activeValue}>Active</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Safety Summary</Text>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryNumber}>7</Text>
              <Text style={styles.summaryLabel}>Reports</Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryNumber}>3</Text>
              <Text style={styles.summaryLabel}>Open</Text>
            </View>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryNumber}>12</Text>
              <Text style={styles.summaryLabel}>Resolved</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsText}>Notification Settings</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsText}>Help & Support</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav active="Profile" />
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
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarText: {
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
  activeValue: {
    fontSize: 15,
    color: colors.success,
    fontWeight: '900',
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
  arrow: {
    fontSize: 26,
    color: colors.muted,
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