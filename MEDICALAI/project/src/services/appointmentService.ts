// Mock appointment service

import { type AppointmentRequest } from './doctorService';

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'canceled' | 'rescheduled';
  reason: string;
  notes?: string;
  followUp?: string;
  meetingLink?: string;
}

// Mock upcoming appointments
const mockAppointments: Appointment[] = [
  {
    id: 'appt-1',
    doctorId: 'dr-1',
    doctorName: 'Dr. Aditya Sharma',
    doctorSpecialty: 'Cardiologist',
    doctorImage: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg',
    patientId: 'user-123',
    patientName: 'John Doe',
    date: '2025-05-15',
    time: '10:00 AM',
    status: 'upcoming',
    reason: 'Chest pain and shortness of breath',
    meetingLink: 'https://meet.google.com/abc-defg-hij'
  },
  {
    id: 'appt-2',
    doctorId: 'dr-2',
    doctorName: 'Dr. Priya Patel',
    doctorSpecialty: 'Neurologist',
    doctorImage: 'https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg',
    patientId: 'user-123',
    patientName: 'John Doe',
    date: '2025-05-23',
    time: '11:30 AM',
    status: 'upcoming',
    reason: 'Recurring headaches',
    meetingLink: 'https://meet.google.com/klm-nopq-rst'
  },
  {
    id: 'appt-3',
    doctorId: 'dr-4',
    doctorName: 'Dr. Sunita Reddy',
    doctorSpecialty: 'Dermatologist',
    doctorImage: 'https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg',
    patientId: 'user-123',
    patientName: 'John Doe',
    date: '2025-04-18',
    time: '2:00 PM',
    status: 'completed',
    reason: 'Skin rash and itching',
    notes: 'Prescribed antihistamines and topical cream. Follow up in 2 weeks if not improving.',
    followUp: '2025-05-02'
  }
];

// Get all appointments for current user
export const getUserAppointments = async (userId: string): Promise<Appointment[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return mockAppointments.filter(appointment => appointment.patientId === userId);
};

// Add new appointment
export const addAppointment = async (
  appointmentRequest: AppointmentRequest, 
  doctorDetails: {
    name: string;
    specialty: string;
    imageUrl: string;
  },
  userId: string,
  userName: string
): Promise<Appointment> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newAppointment: Appointment = {
    id: 'appt-' + Math.random().toString(36).substring(2, 10),
    doctorId: appointmentRequest.doctorId,
    doctorName: doctorDetails.name,
    doctorSpecialty: doctorDetails.specialty,
    doctorImage: doctorDetails.imageUrl,
    patientId: userId,
    patientName: userName,
    date: appointmentRequest.date,
    time: appointmentRequest.time,
    status: 'upcoming',
    reason: appointmentRequest.reason,
    meetingLink: 'https://meet.google.com/' + Math.random().toString(36).substring(2, 11)
  };
  
  // In a real app, this would save to the database
  mockAppointments.push(newAppointment);
  
  return newAppointment;
};

// Cancel appointment
export const cancelAppointment = async (appointmentId: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const index = mockAppointments.findIndex(appointment => appointment.id === appointmentId);
  
  if (index !== -1) {
    mockAppointments[index].status = 'canceled';
    return true;
  }
  
  return false;
};

// Reschedule appointment
export const rescheduleAppointment = async (
  appointmentId: string, 
  newDate: string, 
  newTime: string
): Promise<Appointment | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const index = mockAppointments.findIndex(appointment => appointment.id === appointmentId);
  
  if (index !== -1) {
    mockAppointments[index].date = newDate;
    mockAppointments[index].time = newTime;
    mockAppointments[index].status = 'rescheduled';
    
    return mockAppointments[index];
  }
  
  return null;
};