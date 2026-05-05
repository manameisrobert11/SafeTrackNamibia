import AsyncStorage from '@react-native-async-storage/async-storage';

export type IncidentStatus = 'Open' | 'In Progress' | 'Resolved';
export type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type AuditEntry = {
  label: string;
  time: string;
  note: string;
};

export type Incident = {
  id: string;
  title: string;
  type: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  time: string;
  dateTime: string;
  location: string;
  department: string;
  description: string;
  reporter: string;
  witnesses?: string;
  bodyPart?: string;
  factors?: string;
  photo?: string | null;
  gps?: {
    latitude: number;
    longitude: number;
  } | null;
  auditTrail: AuditEntry[];
};

export type TrainingRecord = {
  id: string;
  course: string;
  provider: string;
  owner: string;
  expiry: string;
  status: 'Compliant' | 'Expiring Soon' | 'Overdue';
};

const INCIDENTS_KEY = 'safetrack_incidents';
const TRAINING_KEY = 'safetrack_training_records';

const defaultIncidents: Incident[] = [
  {
    id: 'INC1025',
    title: 'Broken handrail at staircase',
    type: 'Hazard',
    severity: 'High',
    status: 'Open',
    time: 'Reported 5 hours ago',
    dateTime: '20 May 2026, 10:30 AM',
    location: 'Main Building - Staircase',
    department: 'Operations',
    description:
      'The handrail on the staircase near the main entrance is broken and needs immediate attention.',
    reporter: 'Saara Ekandjo',
    witnesses: 'First floor staff',
    factors: 'Damaged fixture, high foot traffic',
    photo: null,
    gps: null,
    auditTrail: [
      {
        label: 'Reported',
        time: '20 May 2026, 10:30 AM',
        note: 'Incident report submitted by Saara Ekandjo.',
      },
    ],
  },
  {
    id: 'INC1024',
    title: 'Wet floor in corridor',
    type: 'Unsafe Condition',
    severity: 'Medium',
    status: 'In Progress',
    time: 'Reported 2 hours ago',
    dateTime: '20 May 2026, 11:15 AM',
    location: 'Admin Block Corridor',
    department: 'Facilities',
    description:
      'Water was spilled in the corridor, creating a slipping hazard for staff members.',
    reporter: 'Saara Ekandjo',
    witnesses: 'Admin team',
    factors: 'Housekeeping response required',
    photo: null,
    gps: null,
    auditTrail: [
      {
        label: 'Reported',
        time: '20 May 2026, 11:15 AM',
        note: 'Incident report submitted by Saara Ekandjo.',
      },
      {
        label: 'In Progress',
        time: '20 May 2026, 11:30 AM',
        note: 'Assigned to facilities for cleanup and signage.',
      },
    ],
  },
  {
    id: 'INC1023',
    title: 'Fire extinguisher expired',
    type: 'Compliance',
    severity: 'Low',
    status: 'Resolved',
    time: 'Reported 1 day ago',
    dateTime: '19 May 2026, 08:45 AM',
    location: 'Warehouse Section B',
    department: 'Warehouse',
    description:
      'The fire extinguisher inspection tag has expired and needs replacement.',
    reporter: 'Saara Ekandjo',
    factors: 'Inspection schedule missed',
    photo: null,
    gps: null,
    auditTrail: [
      {
        label: 'Reported',
        time: '19 May 2026, 08:45 AM',
        note: 'Compliance issue logged.',
      },
      {
        label: 'Resolved',
        time: '19 May 2026, 02:10 PM',
        note: 'Inspection tag replaced and compliance record updated.',
      },
    ],
  },
];

const defaultTrainingRecords: TrainingRecord[] = [
  {
    id: 'TRN001',
    course: 'Fire Safety Awareness',
    provider: 'Namibia Safety Institute',
    owner: 'Operations Team',
    expiry: '30 June 2026',
    status: 'Compliant',
  },
  {
    id: 'TRN002',
    course: 'First Aid Level 1',
    provider: 'Red Cross Namibia',
    owner: 'Warehouse Team',
    expiry: '14 May 2026',
    status: 'Expiring Soon',
  },
  {
    id: 'TRN003',
    course: 'Forklift Safety Refresher',
    provider: 'Internal OHS',
    owner: 'Logistics Team',
    expiry: '20 April 2026',
    status: 'Overdue',
  },
];

function normalizeIncident(incident: Incident): Incident {
  return {
    ...incident,
    dateTime: incident.dateTime || incident.time,
    department: incident.department || 'Operations',
    auditTrail:
      incident.auditTrail && incident.auditTrail.length > 0
        ? incident.auditTrail
        : [
            {
              label: 'Reported',
              time: incident.dateTime || incident.time,
              note: `Incident report submitted by ${incident.reporter}.`,
            },
          ],
  };
}

export async function getIncidents(): Promise<Incident[]> {
  try {
    const saved = await AsyncStorage.getItem(INCIDENTS_KEY);

    if (!saved) {
      await AsyncStorage.setItem(INCIDENTS_KEY, JSON.stringify(defaultIncidents));
      return defaultIncidents;
    }

    return JSON.parse(saved).map(normalizeIncident);
  } catch (error) {
    console.log('Error loading incidents:', error);
    return defaultIncidents;
  }
}

export async function saveIncidents(incidents: Incident[]) {
  try {
    await AsyncStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
  } catch (error) {
    console.log('Error saving incidents:', error);
  }
}

export async function addIncident(incident: Incident) {
  try {
    const currentIncidents = await getIncidents();
    const updatedIncidents = [incident, ...currentIncidents];

    await saveIncidents(updatedIncidents);

    return updatedIncidents;
  } catch (error) {
    console.log('Error adding incident:', error);
    return [];
  }
}

export async function deleteIncident(incidentId: string) {
  try {
    const currentIncidents = await getIncidents();
    const updatedIncidents = currentIncidents.filter(
      (incident) => incident.id !== incidentId
    );

    await saveIncidents(updatedIncidents);

    return updatedIncidents;
  } catch (error) {
    console.log('Error deleting incident:', error);
    return [];
  }
}

export async function resetDemoIncidents() {
  try {
    await AsyncStorage.setItem(INCIDENTS_KEY, JSON.stringify(defaultIncidents));
    return defaultIncidents;
  } catch (error) {
    console.log('Error resetting demo incidents:', error);
    return defaultIncidents;
  }
}

export async function clearIncidents() {
  try {
    await AsyncStorage.removeItem(INCIDENTS_KEY);
  } catch (error) {
    console.log('Error clearing incidents:', error);
  }
}

export async function getTrainingRecords(): Promise<TrainingRecord[]> {
  try {
    const saved = await AsyncStorage.getItem(TRAINING_KEY);

    if (!saved) {
      await AsyncStorage.setItem(
        TRAINING_KEY,
        JSON.stringify(defaultTrainingRecords)
      );
      return defaultTrainingRecords;
    }

    return JSON.parse(saved);
  } catch (error) {
    console.log('Error loading training records:', error);
    return defaultTrainingRecords;
  }
}

export function createIncidentReference() {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `INC${randomNumber}`;
}

export function formatSubmittedTime() {
  return 'Reported just now';
}

export function formatSubmittedDateTime() {
  return new Intl.DateTimeFormat('en-NA', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}
