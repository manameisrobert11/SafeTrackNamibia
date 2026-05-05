import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import AppButton from '../components/AppButton';
import { colors } from '../theme/colors';

export default function ReportIncidentScreen() {
  const [incidentType, setIncidentType] = useState('');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [gps, setGps] = useState(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo access.');
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

  const getLocation = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow location access.');
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    setGps(currentLocation.coords);
    Alert.alert('Location captured', 'GPS location has been added to the report.');
  };

  const submitReport = () => {
    if (!incidentType || !locationName || !description) {
      Alert.alert('Missing information', 'Please complete incident type, location, and description.');
      return;
    }

    Alert.alert(
      'Report Submitted',
      'Your incident report has been submitted successfully.'
    );

    setIncidentType('');
    setLocationName('');
    setDescription('');
    setPhoto(null);
    setGps(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Report Incident</Text>
      </View>

      <Text style={styles.label}>Incident Type</Text>
      <TextInput
        style={styles.input}
        placeholder="Accident, Near Miss, Hazard, Unsafe Condition..."
        value={incidentType}
        onChangeText={setIncidentType}
      />

      <Text style={styles.label}>Location</Text>
      <View style={styles.inputWithIcon}>
        <TextInput
          style={styles.inputFlex}
          placeholder="Select or type location"
          value={locationName}
          onChangeText={setLocationName}
        />
        <TouchableOpacity onPress={getLocation}>
          <Ionicons name="location-outline" size={22} color={colors.muted} />
        </TouchableOpacity>
      </View>

      {gps && (
        <Text style={styles.gpsText}>
          GPS: {gps.latitude.toFixed(4)}, {gps.longitude.toFixed(4)}
        </Text>
      )}

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.textarea}
        placeholder="Describe the incident..."
        value={description}
        onChangeText={setDescription}
        multiline
        maxLength={200}
      />

      <Text style={styles.counter}>{description.length}/200</Text>

      <Text style={styles.label}>Upload Photo optional</Text>

      <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.preview} />
        ) : (
          <Ionicons name="camera-outline" size={34} color={colors.black} />
        )}
      </TouchableOpacity>

      <AppButton title="Submit Report" onPress={submitReport} style={{ marginTop: 26 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  header: {
    backgroundColor: colors.primary,
    marginHorizontal: -18,
    marginTop: -18,
    paddingTop: 58,
    paddingBottom: 18,
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.black,
    fontWeight: '900',
    fontSize: 17,
  },
  label: {
    marginTop: 18,
    marginBottom: 8,
    fontWeight: '800',
    color: colors.text,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
  },
  inputWithIcon: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputFlex: {
    flex: 1,
  },
  gpsText: {
    marginTop: 8,
    color: colors.success,
    fontSize: 12,
    fontWeight: '700',
  },
  textarea: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    backgroundColor: colors.white,
    padding: 14,
    textAlignVertical: 'top',
  },
  counter: {
    textAlign: 'right',
    marginTop: 6,
    color: colors.muted,
    fontSize: 12,
  },
  uploadBox: {
    width: 90,
    height: 90,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
});