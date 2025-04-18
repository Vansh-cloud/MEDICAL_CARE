import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Activity, 
  Users, 
  FileText, 
  Heart, 
  MessageSquare, 
  Video, 
  Clock, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import { useAuthStore } from '../store/authStore';
import { getUserAppointments } from '../services/appointmentService';
import { getVitalRecords } from '../services/healthTrackerService';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [vitalRecords, setVitalRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    appointments: true,
    vitals: true
  });
  
  // Get user data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch upcoming appointments
        const userAppointments = await getUserAppointments(user?.uid || '');
        setAppointments(userAppointments.filter(a => a.status === 'upcoming'));
        setLoading(prev => ({ ...prev, appointments: false }));
        
        // Fetch latest vital records
        const records = await getVitalRecords();
        setVitalRecords(records.slice(0, 3));
        setLoading(prev => ({ ...prev, vitals: false }));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading({
          appointments: false,
          vitals: false
        });
      }
    };
    
    fetchData();
  }, [user]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Hello, {user?.displayName || 'User'}
                </h1>
                <p className="text-gray-600 mt-1">
                  Welcome to your healthcare dashboard. Here's an overview of your health.
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                <Link to="/diagnosis">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Activity size={16} />}
                  >
                    Start AI Diagnosis
                  </Button>
                </Link>
                
                <Link to="/doctors">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Users size={16} />}
                  >
                    Find a Doctor
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
          
          {/* Quick action cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link to="/appointments">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">Appointments</h2>
                    <p className="text-gray-500">Manage your bookings</p>
                  </div>
                </div>
              </motion.div>
            </Link>
            
            <Link to="/health-tracker">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <Heart className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">Health Tracker</h2>
                    <p className="text-gray-500">Record your vitals</p>
                  </div>
                </div>
              </motion.div>
            </Link>
            
            <Link to="/documents">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100">
                    <FileText className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
                    <p className="text-gray-500">Access medical records</p>
                  </div>
                </div>
              </motion.div>
            </Link>
            
            <Link to="/diagnosis">
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-all"
              >
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-100">
                    <Activity className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-lg font-semibold text-gray-900">AI Diagnosis</h2>
                    <p className="text-gray-500">Check your symptoms</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
          
          {/* Content columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming appointments */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
                  <Link to="/appointments" className="text-primary-600 hover:text-primary-700 text-sm flex items-center">
                    View all <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
                
                {loading.appointments ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2].map((item) => (
                      <div key={item} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                          <div className="ml-4 flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center">
                          <img 
                            src={appointment.doctorImage}
                            alt={appointment.doctorName}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          <div className="ml-4">
                            <h3 className="font-medium text-gray-900">{appointment.doctorName}</h3>
                            <p className="text-sm text-gray-500">{appointment.doctorSpecialty}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex flex-wrap gap-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar size={16} className="mr-1" />
                            {appointment.date}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock size={16} className="mr-1" />
                            {appointment.time}
                          </div>
                        </div>
                        
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Link to={`/telemedicine/${appointment.id}`}>
                            <Button
                              variant="primary"
                              size="sm"
                              leftIcon={<Video size={16} />}
                            >
                              Join Call
                            </Button>
                          </Link>
                          
                          <Link to={`/appointments?id=${appointment.id}&action=reschedule`}>
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              Reschedule
                            </Button>
                          </Link>
                          
                          <Button variant="ghost" size="sm" leftIcon={<MessageSquare size={16} />}>
                            Message
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-full mb-4">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No upcoming appointments</h3>
                    <p className="text-gray-500 mb-4">Schedule a consultation with a doctor</p>
                    <Link to="/doctors">
                      <Button variant="primary" size="sm">
                        Find a Doctor
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
            
            {/* Health vitals summary */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Health Vitals</h2>
                  <Link to="/health-tracker" className="text-primary-600 hover:text-primary-700 text-sm flex items-center">
                    View all <ChevronRight size={16} className="ml-1" />
                  </Link>
                </div>
                
                {loading.vitals ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="p-3 border border-gray-200 rounded-lg">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : vitalRecords.length > 0 ? (
                  <div className="space-y-4">
                    {vitalRecords.map((vital) => (
                      <div key={vital.id} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-500">
                            {vital.type === 'bloodPressure' && 'Blood Pressure'}
                            {vital.type === 'bloodSugar' && 'Blood Sugar'}
                            {vital.type === 'heartRate' && 'Heart Rate'}
                            {vital.type === 'weight' && 'Weight'}
                            {vital.type === 'temperature' && 'Temperature'}
                            {vital.type === 'oxygenLevel' && 'Oxygen Level'}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(vital.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className="text-xl font-bold text-gray-900">
                            {vital.value}
                          </span>
                          <span className="ml-1 text-sm text-gray-500">{vital.unit}</span>
                        </div>
                        {vital.notes && (
                          <p className="text-xs text-gray-500 mt-1">{vital.notes}</p>
                        )}
                      </div>
                    ))}
                    
                    <Link to="/health-tracker">
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        leftIcon={<Heart size={16} />}
                      >
                        Add Measurement
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-4">
                      <Heart className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No health data yet</h3>
                    <p className="text-gray-500 mb-4">Start tracking your health metrics</p>
                    <Link to="/health-tracker">
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Heart size={16} />}
                      >
                        Track Health
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Health alert box */}
              <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Health Reminder</h3>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>It's been over 6 months since your last general check-up. Consider scheduling a wellness visit.</p>
                    </div>
                    <div className="mt-3">
                      <Link to="/doctors">
                        <Button variant="outline" size="sm">
                          Schedule Check-up
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DashboardPage;