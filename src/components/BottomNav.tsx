import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type BottomNavProps = {
  active: 'Dashboard' | 'Report' | 'Incidents' | 'Profile';
};

export default function BottomNav({ active }: BottomNavProps) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity onPress={() => router.replace('/dashboard')}>
        <Text style={active === 'Dashboard' ? styles.navActive : styles.navItem}>
          🏠
        </Text>
        <Text
          style={
            active === 'Dashboard' ? styles.navTextActive : styles.navText
          }
        >
          Dashboard
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/report')}>
        <Text style={active === 'Report' ? styles.navActive : styles.navItem}>
          📋
        </Text>
        <Text
          style={active === 'Report' ? styles.navTextActive : styles.navText}
        >
          Report
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/incidents')}>
        <Text
          style={active === 'Incidents' ? styles.navActive : styles.navItem}
        >
          ⚠️
        </Text>
        <Text
          style={
            active === 'Incidents' ? styles.navTextActive : styles.navText
          }
        >
          Incidents
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/profile')}>
        <Text style={active === 'Profile' ? styles.navActive : styles.navItem}>
          👤
        </Text>
        <Text
          style={active === 'Profile' ? styles.navTextActive : styles.navText}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const colors = {
  primaryDark: '#D9A90F',
  white: '#FFFFFF',
  muted: '#777777',
  border: '#E3E3E3',
};

const styles = StyleSheet.create({
  bottomNav: {
    height: 76,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderColor: colors.border,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 8,
  },
  navItem: {
    textAlign: 'center',
    fontSize: 21,
    opacity: 0.6,
  },
  navActive: {
    textAlign: 'center',
    fontSize: 21,
  },
  navText: {
    fontSize: 10,
    color: colors.muted,
    textAlign: 'center',
    marginTop: 2,
  },
  navTextActive: {
    fontSize: 10,
    color: colors.primaryDark,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 2,
  },
});