import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  List, 
  Clock, 
  User, 
  Video, 
  X, 
  Calendar as CalendarIcon,
  AlertTriangle,
  MessageSquare,
  FileText,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Users
} from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import { useAuthStore } from '../store/authStore';
import { getUserAppointments, cancelAppointment, rescheduleAppointment } from '../services/appointmentService';
import { getDoctorById } from '../services/doctorService';

type AppointmentView = 'all' | 'upcoming' | 'past';
type AppointmentAction = 'view' | 'reschedule' | 'cancel';

const AppointmentsPage: React.FC = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<AppointmentView>('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [currentAction, setCurrentAction] = useState<AppointmentAction>('view');
  
  // Reschedule state
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<any>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  
  // Check for URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const appointmentId = searchParams.get('id');
    const action = searchParams.get('action');
    
    if (appointmentId) {
      // This will be set properly once appointments are loaded
      setCurrentAction(action === 'reschedule' ? 'reschedule' : 'view');
    }
  }, [location]);
  
  // Load appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userAppointments = await getUserAppointments(user.uid);
        setAppointments(userAppointments);
        
        // Check if we need to select an appointment from URL
        const searchParams = new URLSearchParams(location.search);
        const appointmentId = searchParams.get('id');
        if (appointmentId) {
          const appointment = userAppointments.find(a => a.id === appointmentId);
          if (appointment) {
            setSelectedAppointment(appointment);
            
            // If reschedule action, load doctor availability
            if (searchParams.get('action') === 'reschedule') {
              loadDoctorAvailability(appointment.doctorId);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [user, location]);
  
  const loadDoctorAvailability = async (doctorId: string) => {
    try {
      const doctorData = await getDoctorById(doctorId);
      if (doctorData && doctorData.availableSlots) {
        setAvailableSlots(doctorData.availableSlots);
        
        // Set default reschedule date to first available
        if (doctorData.availableSlots.length > 0) {
          setRescheduleDate(doctorData.availableSlots[0].date);
        }
      }
    } catch (error) {
      console.error('Error loading doctor availability:', error);
    }
  };
  
  const handleViewAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setCurrentAction('view');
    setActionSuccess(null);
    setActionError(null);
  };
  
  const handleStartReschedule = (appointment: any) => {
    setSelectedAppointment(appointment);
    setCurrentAction('reschedule');
    setActionSuccess(null);
    setActionError(null);
    loadDoctorAvailability(appointment.doctorId);
  };
  
  const handleStartCancel = (appointment: any) => {
    setSelectedAppointment(appointment);
    setCurrentAction('cancel');
    setActionSuccess(null);
    setActionError(null);
  };
  
  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;
    
    setActionLoading(true);
    setActionError(null);
    
    try {
      const success = await cancelAppointment(selectedAppointment.id);
      
      if (success) {
        // Update local state
        setAppointments(prevAppointments => 
          prevAppointments.map(apt => 
            apt.id === selectedAppointment.id 
              ? { ...apt, status: 'canceled' } 
              : apt
          )
        );
        
        setActionSuccess({
          message: 'Your appointment has been successfully canceled.',
        });
      } else {
        setActionError('Failed to cancel appointment. Please try again.');
      }
    } catch (error: any) {
      setActionError(error.message || 'An error occurred while canceling your appointment.');
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleRescheduleAppointment = async () => {
    if (!selectedAppointment || !rescheduleDate || !rescheduleTime) {
      setActionError('Please select a new date and time for your appointment.');
      return;
    }
    
    setActionLoading(true);
    setActionError(null);
    
    try {
      const updatedAppointment = await rescheduleAppointment(
        selectedAppointment.id,
        rescheduleDate,
        rescheduleTime
      );
      
      if (updatedAppointment) {
        // Update local state
        setAppointments(prevAppointments => 
          prevAppointments.map(apt => 
            apt.id === selectedAppointment.id 
              ? updatedAppointment
              : apt
          )
        );
        
        setActionSuccess({
          message: 'Your appointment has been successfully rescheduled.',
          date: rescheduleDate,
          time: rescheduleTime
        });
        
        // Update the selected appointment
        setSelectedAppointment(updatedAppointment);
      } else {
        setActionError('Failed to reschedule appointment. Please try again.');
      }
    } catch (error: any) {
      setActionError(error.message || 'An error occurred while rescheduling your appointment.');
    } finally {
      setActionLoading(false);
    }
  };
  
  const closeDetailView = () => {
    setSelectedAppointment(null);
    setCurrentAction('view');
    setActionSuccess(null);
    setActionError(null);
  };
  
  const getAvailableTimesForSelectedDate = () => {
    if (!rescheduleDate) return [];
    
    const dateSlot = availableSlots.find(slot => slot.date === rescheduleDate);
    return dateSlot ? dateSlot.slots : [];
  };
  
  // Filter appointments based on current view
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (currentView === 'upcoming') {
      return appointmentDate >= today && appointment.status !== 'canceled';
    } else if (currentView === 'past') {
      return appointmentDate < today || appointment.status === 'completed';
    }
    
    return true; // 'all' view
  });
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  My Appointments
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your upcoming and past appointments
                </p>
              </div>
              
              <div className="mt-4 md:mt-0">
                <div className="inline-flex rounded-md shadow-sm">
                  <button
                    onClick={() => setCurrentView('upcoming')}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-l-md ${
                      currentView === 'upcoming'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } border border-gray-300 focus:z-10 focus:outline-none`}
                  >
                    <Calendar size={16} className="mr-2" />
                    Upcoming
                  </button>
                  <button
                    onClick={() => setCurrentView('past')}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
                      currentView === 'past'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } border-t border-b border-r border-gray-300 focus:z-10 focus:outline-none`}
                  >
                    <Clock size={16} className="mr-2" />
                    Past
                  </button>
                  <button
                    onClick={() => setCurrentView('all')}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-r-md ${
                      currentView === 'all'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } border-t border-b border-r border-gray-300 focus:z-10 focus:outline-none`}
                  >
                    <List size={16} className="mr-2" />
                    All
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Appointments list */}
            <div className={`${selectedAppointment ? 'hidden lg:block' : ''} lg:col-span-1`}>
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {currentView === 'upcoming' && 'Upcoming Appointments'}
                    {currentView === 'past' && 'Past Appointments'}
                    {currentView === 'all' && 'All Appointments'}
                  </h2>
                </div>
                
                {loading ? (
                  <div className="p-4 space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="border border-gray-200 rounded-md p-4 animate-pulse">
                        <div className="flex items-center">
                          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                          <div className="ml-4 flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredAppointments.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filteredAppointments.map((appointment) => (
                      <motion.div
                        key={appointment.id}
                        whileHover={{ backgroundColor: '#f9fafb' }}
                        onClick={() => handleViewAppointment(appointment)}
                        className={`p-4 cursor-pointer transition-colors ${
                          selectedAppointment?.id === appointment.id ? 'bg-primary-50' : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <img
                            src={appointment.doctorImage}
                            alt={appointment.doctorName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="ml-4">
                            <h3 className="font-medium text-gray-900">{appointment.doctorName}</h3>
                            <p className="text-sm text-gray-500">{appointment.doctorSpecialty}</p>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex items-center text-sm">
                          <Calendar size={16} className="text-gray-500 mr-2" />
                          <span className="text-gray-700">{appointment.date}</span>
                          <span className="mx-2 text-gray-400">•</span>
                          <Clock size={16} className="text-gray-500 mr-2" />
                          <span className="text-gray-700">{appointment.time}</span>
                        </div>
                        
                        <div className="mt-2 flex justify-between items-center">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                            appointment.status === 'upcoming' 
                              ? 'bg-blue-100 text-blue-800'
                              : appointment.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : appointment.status === 'canceled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                          
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewAppointment(appointment);
                            }}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            Details
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-4">
                      <Calendar size={24} className="text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments found</h3>
                    <p className="text-gray-500 mb-4">
                      {currentView === 'upcoming' 
                        ? "You don't have any upcoming appointments."
                        : currentView === 'past'
                          ? "You don't have any past appointments."
                          : "You don't have any appointments yet."}
                    </p>
                    <Button
                      variant="primary"
                      as="a"
                      href="/doctors"
                    >
                      Find a Doctor
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Appointment details */}
            {selectedAppointment ? (
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {currentAction === 'view' && 'Appointment Details'}
                      {currentAction === 'reschedule' && 'Reschedule Appointment'}
                      {currentAction === 'cancel' && 'Cancel Appointment'}
                    </h2>
                    <button
                      onClick={closeDetailView}
                      className="text-gray-400 hover:text-gray-500 lg:hidden"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  {actionError && (
                    <div className="m-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center text-red-600">
                        <AlertTriangle size={18} className="mr-2" />
                        <span>{actionError}</span>
                      </div>
                    </div>
                  )}
                  
                  {actionSuccess && (
                    <div className="m-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-start">
                        <CheckCircle size={18} className="mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-green-700">{actionSuccess.message}</p>
                          {actionSuccess.date && actionSuccess.time && (
                            <p className="text-green-600 text-sm mt-1">
                              New appointment: {new Date(actionSuccess.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} at {actionSuccess.time}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {currentAction === 'view' && (
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start">
                        <img
                          src={selectedAppointment.doctorImage}
                          alt={selectedAppointment.doctorName}
                          className="w-24 h-24 rounded-full object-cover mb-4 md:mb-0 md:mr-6"
                        />
                        
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{selectedAppointment.doctorName}</h3>
                          <p className="text-primary-600">{selectedAppointment.doctorSpecialty}</p>
                          
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Date & Time</h4>
                              <div className="mt-1 flex items-center">
                                <Calendar size={16} className="text-gray-500 mr-2" />
                                <span className="text-gray-900">{new Date(selectedAppointment.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                              </div>
                              <div className="mt-1 flex items-center">
                                <Clock size={16} className="text-gray-500 mr-2" />
                                <span className="text-gray-900">{selectedAppointment.time}</span>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Status</h4>
                              <div className="mt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                                  selectedAppointment.status === 'upcoming' 
                                    ? 'bg-blue-100 text-blue-800'
                                    : selectedAppointment.status === 'completed'
                                      ? 'bg-green-100 text-green-800'
                                      : selectedAppointment.status === 'canceled'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-500">Reason for Visit</h4>
                            <p className="mt-1 text-gray-900">{selectedAppointment.reason}</p>
                          </div>
                          
                          {selectedAppointment.notes && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-500">Doctor's Notes</h4>
                              <p className="mt-1 text-gray-900">{selectedAppointment.notes}</p>
                            </div>
                          )}
                          
                          {selectedAppointment.followUp && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-500">Follow-up Recommended</h4>
                              <p className="mt-1 text-gray-900">
                                {new Date(selectedAppointment.followUp).toLocaleDateString(undefined, {
                                  weekday: 'long',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {selectedAppointment.status === 'upcoming' && (
                        <div className="mt-6 border-t border-gray-200 pt-6">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Appointment Options</h4>
                          <div className="flex flex-wrap gap-3">
                            {selectedAppointment.meetingLink && (
                              <a 
                                href={selectedAppointment.meetingLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                <Button
                                  variant="primary"
                                  leftIcon={<Video size={16} />}
                                >
                                  Join Video Call
                                </Button>
                              </a>
                            )}
                            
                            <Button
                              variant="outline"
                              leftIcon={<CalendarIcon size={16} />}
                              onClick={() => handleStartReschedule(selectedAppointment)}
                            >
                              Reschedule
                            </Button>
                            
                            <Button
                              variant="outline"
                              leftIcon={<MessageSquare size={16} />}
                            >
                              Message Doctor
                            </Button>
                            
                            <Button
                              variant="outline"
                              onClick={() => handleStartCancel(selectedAppointment)}
                              className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400 hover:bg-red-50"
                            >
                              Cancel Appointment
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {selectedAppointment.status === 'completed' && (
                        <div className="mt-6 border-t border-gray-200 pt-6">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">Post-Appointment Options</h4>
                          <div className="flex flex-wrap gap-3">
                            <Button
                              variant="outline"
                              leftIcon={<FileText size={16} />}
                            >
                              View Prescription
                            </Button>
                            
                            <Button
                              variant="outline"
                              leftIcon={<CalendarIcon size={16} />}
                            >
                              Book Follow-up
                            </Button>
                            
                            <Button
                              variant="outline"
                              leftIcon={<Users size={16} />}
                            >
                              Write Review
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {currentAction === 'reschedule' && (
                    <div className="p-6">
                      <div className="mb-6">
                        <div className="p-4 bg-gray-50 rounded-md mb-6">
                          <div className="flex items-center">
                            <img 
                              src={selectedAppointment.doctorImage}
                              alt={selectedAppointment.doctorName}
                              className="w-12 h-12 rounded-full object-cover mr-4"
                            />
                            <div>
                              <h3 className="font-medium text-gray-900">{selectedAppointment.doctorName}</h3>
                              <p className="text-sm text-gray-500">{selectedAppointment.doctorSpecialty}</p>
                            </div>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <Calendar size={16} className="mr-2" />
                              Current: {new Date(selectedAppointment.date).toLocaleDateString(undefined, {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock size={16} className="mr-2" />
                              {selectedAppointment.time}
                            </div>
                          </div>
                        </div>
                        
                        <h3 className="text-base font-medium text-gray-900 mb-4">Select a New Date & Time</h3>
                        
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Select a Date</h4>
                          {availableSlots.length > 0 ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                              {availableSlots.map((slot) => (
                                <button
                                  key={slot.date}
                                  onClick={() => {
                                    setRescheduleDate(slot.date);
                                    setRescheduleTime('');
                                  }}
                                  className={`p-3 text-center border rounded-md transition-colors ${
                                    rescheduleDate === slot.date
                                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                                      : 'border-gray-200 hover:border-primary-300'
                                  }`}
                                >
                                  <div className="text-sm font-medium">
                                    {new Date(slot.date).toLocaleDateString(undefined, { weekday: 'short' })}
                                  </div>
                                  <div className="mt-1 text-xs text-gray-500">
                                    {new Date(slot.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                  </div>
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className="text-amber-600 text-sm flex items-center">
                              <AlertTriangle size={16} className="mr-2" />
                              No available slots found for this doctor. Please try again later.
                            </p>
                          )}
                        </div>
                        
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Select a Time</h4>
                          {rescheduleDate ? (
                            getAvailableTimesForSelectedDate().length > 0 ? (
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {getAvailableTimesForSelectedDate().map((time: string) => (
                                  <button
                                    key={time}
                                    onClick={() => setRescheduleTime(time)}
                                    className={`py-2 px-3 text-center border rounded-md transition-colors ${
                                      rescheduleTime === time
                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                        : 'border-gray-200 hover:border-primary-300'
                                    }`}
                                  >
                                    {time}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <p className="text-amber-600 text-sm flex items-center">
                                <AlertTriangle size={16} className="mr-2" />
                                No available times for the selected date.
                              </p>
                            )
                          ) : (
                            <p className="text-gray-500 text-sm">Please select a date first</p>
                          )}
                        </div>
                        
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-700">
                          <div className="flex">
                            <AlertTriangle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
                            <p>
                              You can reschedule up to 4 hours before your appointment without any charges.
                              Please note that rescheduling is subject to doctor's availability.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setCurrentAction('view');
                            setActionSuccess(null);
                          }}
                        >
                          Cancel
                        </Button>
                        
                        <Button
                          variant="primary"
                          onClick={handleRescheduleAppointment}
                          isLoading={actionLoading}
                          disabled={!rescheduleDate || !rescheduleTime}
                        >
                          Confirm Reschedule
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {currentAction === 'cancel' && (
                    <div className="p-6">
                      <div className="mb-6">
                        <div className="p-4 bg-gray-50 rounded-md mb-6">
                          <div className="flex items-center">
                            <img 
                              src={selectedAppointment.doctorImage}
                              alt={selectedAppointment.doctorName}
                              className="w-12 h-12 rounded-full object-cover mr-4"
                            />
                            <div>
                              <h3 className="font-medium text-gray-900">{selectedAppointment.doctorName}</h3>
                              <p className="text-sm text-gray-500">{selectedAppointment.doctorSpecialty}</p>
                            </div>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <Calendar size={16} className="mr-2" />
                              {new Date(selectedAppointment.date).toLocaleDateString(undefined, {
                                weekday: 'long',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock size={16} className="mr-2" />
                              {selectedAppointment.time}
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                          <div className="flex">
                            <AlertTriangle size={20} className="text-red-600 flex-shrink-0" />
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-red-800">Are you sure you want to cancel this appointment?</h3>
                              <div className="mt-2 text-sm text-red-700">
                                <p>
                                  This action cannot be undone. If you need to see the doctor, you'll need to book a new appointment, 
                                  which will be subject to availability.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-700">
                          <div className="flex">
                            <AlertTriangle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
                            <p>
                              You can cancel up to 4 hours before your appointment without any charges.
                              Cancellations made less than 4 hours before the appointment may incur a cancellation fee.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setCurrentAction('view');
                            setActionSuccess(null);
                          }}
                        >
                          Back
                        </Button>
                        
                        <Button
                          variant="danger"
                          onClick={handleCancelAppointment}
                          isLoading={actionLoading}
                        >
                          Confirm Cancellation
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden lg:block lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-4">
                    <Calendar size={24} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Select an appointment</h3>
                  <p className="text-gray-500 mb-4">
                    Choose an appointment from the list to view details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AppointmentsPage;