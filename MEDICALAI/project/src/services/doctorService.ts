// Mock service for doctors data

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  consultationFee: number;
  description: string;
  education: string[];
  languages: string[];
  location: string;
  hospitalAffiliation: string;
  imageUrl: string;
  availableSlots: {
    date: string;
    slots: string[];
  }[];
}

// Mock doctors data
const mockDoctors: Doctor[] = [
  {
    id: 'dr-1',
    name: 'Dr. Aditya Sharma',
    specialty: 'Cardiologist',
    experience: 15,
    rating: 4.8,
    consultationFee: 1500,
    description: 'Dr. Sharma is a renowned cardiologist specializing in interventional cardiology and heart failure management. With over 15 years of experience, he has treated thousands of patients with various heart conditions.',
    education: [
      'MBBS - All India Institute of Medical Sciences, Delhi',
      'MD (Cardiology) - Post Graduate Institute of Medical Education and Research, Chandigarh',
      'Fellowship in Interventional Cardiology - Cleveland Clinic, USA'
    ],
    languages: ['English', 'Hindi', 'Punjabi'],
    location: 'Delhi',
    hospitalAffiliation: 'Apollo Hospitals',
    imageUrl: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg',
    availableSlots: [
      {
        date: '2025-05-15',
        slots: ['10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM']
      },
      {
        date: '2025-05-16',
        slots: ['9:30 AM', '1:00 PM', '3:30 PM']
      }
    ]
  },
  {
    id: 'dr-2',
    name: 'Dr. Priya Patel',
    specialty: 'Neurologist',
    experience: 12,
    rating: 4.9,
    consultationFee: 1800,
    description: 'Dr. Patel is a specialist in clinical neurology with expertise in movement disorders, headaches, and neuromuscular conditions. She combines traditional approaches with cutting-edge treatments.',
    education: [
      'MBBS - Grant Medical College, Mumbai',
      'MD (Neurology) - AIIMS, Delhi',
      'Specialized Training in Movement Disorders - University College London'
    ],
    languages: ['English', 'Hindi', 'Gujarati'],
    location: 'Mumbai',
    hospitalAffiliation: 'Kokilaben Dhirubhai Ambani Hospital',
    imageUrl: 'https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg',
    availableSlots: [
      {
        date: '2025-05-15',
        slots: ['9:00 AM', '11:00 AM', '3:00 PM']
      },
      {
        date: '2025-05-17',
        slots: ['10:30 AM', '1:30 PM', '4:00 PM']
      }
    ]
  },
  {
    id: 'dr-3',
    name: 'Dr. Rajesh Kumar',
    specialty: 'Pulmonologist',
    experience: 10,
    rating: 4.7,
    consultationFee: 1200,
    description: 'Dr. Kumar specializes in respiratory medicine with focus on asthma, COPD, and sleep disorders. He is known for his patient-centered approach and comprehensive treatment plans.',
    education: [
      'MBBS - Kasturba Medical College, Manipal',
      'MD (Pulmonary Medicine) - Christian Medical College, Vellore',
      'Fellowship in Sleep Medicine - University of Sydney, Australia'
    ],
    languages: ['English', 'Hindi', 'Tamil'],
    location: 'Bangalore',
    hospitalAffiliation: 'Narayana Health',
    imageUrl: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg',
    availableSlots: [
      {
        date: '2025-05-16',
        slots: ['10:00 AM', '12:30 PM', '3:00 PM']
      },
      {
        date: '2025-05-18',
        slots: ['11:00 AM', '2:30 PM', '5:00 PM']
      }
    ]
  },
  {
    id: 'dr-4',
    name: 'Dr. Sunita Reddy',
    specialty: 'Dermatologist',
    experience: 8,
    rating: 4.6,
    consultationFee: 1000,
    description: 'Dr. Reddy is a skilled dermatologist with expertise in medical and cosmetic dermatology. She specializes in treating various skin conditions and is known for her empathetic approach.',
    education: [
      'MBBS - Osmania Medical College, Hyderabad',
      'MD (Dermatology) - Madras Medical College, Chennai',
      'Fellowship in Cosmetic Dermatology - National Skin Centre, Singapore'
    ],
    languages: ['English', 'Hindi', 'Telugu'],
    location: 'Hyderabad',
    hospitalAffiliation: 'KIMS Hospitals',
    imageUrl: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg',
    availableSlots: [
      {
        date: '2025-05-15',
        slots: ['10:30 AM', '2:00 PM', '4:30 PM']
      },
      {
        date: '2025-05-19',
        slots: ['9:30 AM', '12:00 PM', '3:30 PM']
      }
    ]
  }
];

// Get all doctors
export const getAllDoctors = async (): Promise<Doctor[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockDoctors;
};

// Get doctor by ID
export const getDoctorById = async (id: string): Promise<Doctor | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockDoctors.find(doctor => doctor.id === id) || null;
};

// Search doctors by name, specialty or location
export const searchDoctors = async (searchTerm: string): Promise<Doctor[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const term = searchTerm.toLowerCase();
  
  return mockDoctors.filter(doctor => 
    doctor.name.toLowerCase().includes(term) ||
    doctor.specialty.toLowerCase().includes(term) ||
    doctor.location.toLowerCase().includes(term)
  );
};

// Book an appointment with a doctor
export interface AppointmentRequest {
  doctorId: string;
  date: string;
  time: string;
  patientName: string;
  patientPhone: string;
  reason: string;
}

export const bookAppointment = async (appointment: AppointmentRequest): Promise<{
  appointmentId: string;
  status: 'confirmed' | 'pending';
  message: string;
}> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Validate that slot is available (in a real app)
  const doctor = await getDoctorById(appointment.doctorId);
  
  if (!doctor) {
    throw new Error('Doctor not found');
  }
  
  // Generate a random appointment ID
  const appointmentId = 'appt-' + Math.random().toString(36).substring(2, 10);
  
  return {
    appointmentId,
    status: 'confirmed',
    message: `Your appointment with ${doctor.name} on ${appointment.date} at ${appointment.time} has been confirmed.`
  };
};