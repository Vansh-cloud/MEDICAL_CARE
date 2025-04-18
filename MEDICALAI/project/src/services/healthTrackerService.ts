// Mock health tracker service

export interface VitalRecord {
  id: string;
  type: 'bloodPressure' | 'bloodSugar' | 'heartRate' | 'weight' | 'temperature' | 'oxygenLevel';
  value: string | number;
  unit: string;
  timestamp: string;
  notes?: string;
}

export interface MedicationRecord {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  notes?: string;
}

let mockVitalRecords: VitalRecord[] = [
  {
    id: 'vital-1',
    type: 'bloodPressure',
    value: '120/80',
    unit: 'mmHg',
    timestamp: '2025-04-10T09:30:00Z',
    notes: 'Morning reading, after breakfast'
  },
  {
    id: 'vital-2',
    type: 'bloodSugar',
    value: 110,
    unit: 'mg/dL',
    timestamp: '2025-04-12T08:15:00Z',
    notes: 'Fasting glucose'
  },
  {
    id: 'vital-3',
    type: 'heartRate',
    value: 72,
    unit: 'bpm',
    timestamp: '2025-04-15T16:45:00Z'
  },
  {
    id: 'vital-4',
    type: 'weight',
    value: 68.5,
    unit: 'kg',
    timestamp: '2025-04-18T07:00:00Z'
  },
  {
    id: 'vital-5',
    type: 'temperature',
    value: 98.6,
    unit: '°F',
    timestamp: '2025-04-20T10:30:00Z'
  }
];

let mockMedications: MedicationRecord[] = [
  {
    id: 'med-1',
    name: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Every 8 hours',
    startDate: '2025-04-15',
    endDate: '2025-04-22',
    isActive: true,
    notes: 'Take with food'
  },
  {
    id: 'med-2',
    name: 'Loratadine',
    dosage: '10mg',
    frequency: 'Once daily',
    startDate: '2025-04-10',
    isActive: true
  }
];

// Get all vital records
export const getVitalRecords = async (type?: string): Promise<VitalRecord[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  if (type) {
    return mockVitalRecords.filter(record => record.type === type);
  }
  
  return mockVitalRecords;
};

// Add new vital record
export const addVitalRecord = async (record: Omit<VitalRecord, 'id'>): Promise<VitalRecord> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const newRecord: VitalRecord = {
    ...record,
    id: 'vital-' + Math.random().toString(36).substring(2, 10),
  };
  
  mockVitalRecords.push(newRecord);
  return newRecord;
};

// Get all medications
export const getMedications = async (activeOnly = false): Promise<MedicationRecord[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (activeOnly) {
    return mockMedications.filter(med => med.isActive);
  }
  
  return mockMedications;
};

// Add new medication
export const addMedication = async (medication: Omit<MedicationRecord, 'id'>): Promise<MedicationRecord> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const newMedication: MedicationRecord = {
    ...medication,
    id: 'med-' + Math.random().toString(36).substring(2, 10),
  };
  
  mockMedications.push(newMedication);
  return newMedication;
};

// Update medication status (active/inactive)
export const updateMedicationStatus = async (id: string, isActive: boolean): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockMedications.findIndex(med => med.id === id);
  
  if (index !== -1) {
    mockMedications[index].isActive = isActive;
    return true;
  }
  
  return false;
};