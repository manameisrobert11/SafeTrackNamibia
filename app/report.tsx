import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
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
  addIncident,
  createIncidentReference,
  formatSubmittedDateTime,
  formatSubmittedTime,
  IncidentSeverity,
} from '../services/incidentsStorage';

const incidentTypes = [
  'Accident',
  'Near Miss',
  'Hazard',
  'Unsafe Condition',
  'Property Damage',
];

const severityLevels: IncidentSeverity[] = ['Low', 'Medium', 'High', 'Critical'];
const locations = [
  'Main Building - Staircase',
  'Admin Block Corridor',
  'Warehouse Section B',
  'Loading Bay',
  'Field Site',
];

export default function Report() {
  const [incidentType, setIncidentType] = useState('');
  const [severity, setSeverity] = useState<IncidentSeverity>('Medium');
  const [locationName, setLocationName] = useState('');
  const [department, setDepartment] = useState('Operations');
  const [description, setDescription] = useState('');
  const [witnesses, setWitnesses] = useState('');
  const [factors, setFactors] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [gps, setGps] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function loadUser() {
        const user = await getCurrentUser();

        if (user?.role === 'admin') {
          router.replace('/admin-dashboard');
          return;
        }

        setCurrentUser(user);
        setDepartment(user?.department || 'Operations');
      }

      loadUser();
    }, [])
  );

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission Required', 'Please allow photo access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission Required', 'Please allow camera access.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission Required', 'Please allow location access.');
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    setGps({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });

    Alert.alert('Location Captured', 'GPS location has been added.');
  };

  const submitReport = async () => {
    if (!incidentType.trim() || !locationName.trim() || !description.trim()) {
      Alert.alert(
        'Missing Information',
        'Please complete incident type, location, and description.'
      );
      return;
    }

    const reference = createIncidentReference();
    const submittedAt = formatSubmittedDateTime();
    const title =
      description.length > 42 ? `${description.slice(0, 42)}...` : description;

    const newIncident = {
      id: reference,
      title,
      type: incidentType,
      severity,
      status: 'Open' as const,
      time: formatSubmittedTime(),
      dateTime: submittedAt,
      location: locationName,
      department,
      description,
      reporter: currentUser?.name || 'Saara Ekandjo',
      witnesses,
      factors,
      photo,
      gps,
      auditTrail: [
        {
          label: 'Reported',
          time: submittedAt,
          note: `Incident ${reference} submitted from the mobile app.`,
        },
      ],
    };

    await addIncident(newIncident);

    Alert.alert(
      severity === 'Critical' || severity === 'High'
        ? 'Priority Report Submitted'
        : 'Report Submitted',
      severity === 'Critical' || severity === 'High'
        ? 'Your report has been saved and flagged for manager attention.'
        : 'Your incident report has been saved successfully.',
      [
        {
          text: 'View Incidents',
          onPress: () => router.replace('/incidents'),
        },
      ]
    );

    setIncidentType('');
    setSeverity('Medium');
    setLocationName('');
    setDepartment('Operations');
    setDescription('');
    setWitnesses('');
    setFactors('');
    setPhoto(null);
    setGps(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Report Incident</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Incident Type</Text>

        <View style={styles.chipWrap}>
          {incidentTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.chip, incidentType === type && styles.chipActive]}
              onPress={() => setIncidentType(type)}
            >
              <Text
                style={[
                  styles.chipText,
                  incidentType === type && styles.chipTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Severity</Text>

        <View style={styles.chipWrap}>
          {severityLevels.map((level) => (
            <TouchableOpacity
              key={level}
              style={[styles.chip, severity === level && styles.chipActive]}
              onPress={() => setSeverity(level)}
            >
              <Text
                style={[
                  styles.chipText,
                  severity === level && styles.chipTextActive,
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Location</Text>

        <View style={styles.locationSuggestions}>
          {locations.map((location) => (
            <TouchableOpacity
              key={location}
              style={[
                styles.locationChip,
                locationName === location && styles.locationChipActive,
              ]}
              onPress={() => setLocationName(location)}
            >
              <Text
                style={[
                  styles.locationChipText,
                  locationName === location && styles.locationChipTextActive,
                ]}
              >
                {location}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.inputFlex}
            placeholder="Select or type location"
            placeholderTextColor={colors.muted}
            value={locationName}
            onChangeText={setLocationName}
          />

          <TouchableOpacity style={styles.locationButton} onPress={getLocation}>
            <Ionicons name="location-outline" size={20} color={colors.primaryDark} />
          </TouchableOpacity>
        </View>

        {gps && (
          <Text style={styles.gpsText}>
            GPS: {gps.latitude.toFixed(4)}, {gps.longitude.toFixed(4)}
          </Text>
        )}

        <Text style={styles.label}>Department</Text>
        <TextInput
          style={styles.input}
          placeholder="Department"
          placeholderTextColor={colors.muted}
          value={department}
          onChangeText={setDepartment}
        />

        <Text style={styles.label}>Description</Text>

        <TextInput
          style={styles.textarea}
          placeholder="Describe the incident..."
          placeholderTextColor={colors.muted}
          value={description}
          onChangeText={setDescription}
          multiline
          maxLength={250}
        />

        <Text style={styles.counter}>{description.length}/250</Text>

        <Text style={styles.label}>Optional Investigation Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Witnesses"
          placeholderTextColor={colors.muted}
          value={witnesses}
          onChangeText={setWitnesses}
        />
        <TextInput
          style={styles.input}
          placeholder="Contributing factors"
          placeholderTextColor={colors.muted}
          value={factors}
          onChangeText={setFactors}
        />

        <Text style={styles.label}>Upload Photo Optional</Text>

        <View style={styles.photoActions}>
          <TouchableOpacity style={styles.uploadBox} onPress={takePhoto}>
            <Ionicons name="camera-outline" size={28} color={colors.text} />
            <Text style={styles.uploadText}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
            <Ionicons name="image-outline" size={28} color={colors.text} />
            <Text style={styles.uploadText}>Gallery</Text>
          </TouchableOpacity>
        </View>

        {photo && (
          <View style={styles.previewBox}>
            <Image source={{ uri: photo }} style={styles.previewImage} />

            <TouchableOpacity
              style={styles.removePhoto}
              onPress={() => setPhoto(null)}
            >
              <Text style={styles.removePhotoText}>Remove Photo</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.submitButton} onPress={submitReport}>
          <Text style={styles.submitText}>Submit Report</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav active="Report" />
    </KeyboardAvoidingView>
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
  label: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '900',
    color: colors.text,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  chipTextActive: {
    color: colors.black,
    fontWeight: '900',
  },
  locationSuggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  locationChip: {
    backgroundColor: '#FFF7DB',
    borderRadius: 18,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  locationChipActive: {
    backgroundColor: colors.primary,
  },
  locationChipText: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '800',
  },
  locationChipTextActive: {
    color: colors.black,
  },
  inputRow: {
    height: 54,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingLeft: 14,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    height: 54,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 14,
    marginBottom: 10,
  },
  inputFlex: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  locationButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF7DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsText: {
    marginTop: 8,
    fontSize: 12,
    color: colors.success,
    fontWeight: '800',
  },
  textarea: {
    minHeight: 130,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: colors.text,
    textAlignVertical: 'top',
  },
  counter: {
    textAlign: 'right',
    marginTop: 6,
    fontSize: 12,
    color: colors.muted,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadBox: {
    width: 106,
    height: 90,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '700',
    marginTop: 6,
  },
  previewBox: {
    marginTop: 18,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  previewImage: {
    width: '100%',
    height: 190,
    borderRadius: 12,
  },
  removePhoto: {
    marginTop: 10,
    alignItems: 'center',
  },
  removePhotoText: {
    color: colors.danger,
    fontWeight: '800',
    fontSize: 13,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  submitText: {
    color: colors.black,
    fontWeight: '900',
    fontSize: 15,
  },
});
