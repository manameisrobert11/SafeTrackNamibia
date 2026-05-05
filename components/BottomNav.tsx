import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type BottomNavProps = {
  active: 'Dashboard' | 'Report' | 'Incidents' | 'Profile';
};

const items = [
  { label: 'Dashboard', route: '/dashboard', icon: 'home-outline' },
  { label: 'Report', route: '/report', icon: 'clipboard-outline' },
  { label: 'Incidents', route: '/incidents', icon: 'warning-outline' },
  { label: 'Profile', route: '/profile', icon: 'person-outline' },
] as const;

export default function BottomNav({ active }: BottomNavProps) {
  return (
    <View style={styles.bottomNav}>
      {items.map((item) => {
        const isActive = active === item.label;

        return (
          <TouchableOpacity
            key={item.label}
            style={styles.navButton}
            onPress={() => router.replace(item.route)}
          >
            <Ionicons
              name={item.icon}
              size={22}
              color={isActive ? colors.primaryDark : colors.muted}
            />
            <Text style={isActive ? styles.navTextActive : styles.navText}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
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
  navButton: {
    minWidth: 68,
    alignItems: 'center',
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
