import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Star, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Video, 
  User, 
  Activity,
  Book,
  Award,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Clock,
  X,
  Globe,
  AlertTriangle
} from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import { getDoctorById, bookAppointment } from '../services/doctorService';
import { useAuthStore } from '../store/authStore';

const DoctorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookingReason, setBookingReason] = useState('');
  const [isBookingMode, setIsBookingMode] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  
  // Check if booking mode is requested via URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('action') === 'book') {
      setIsBookingMode(true);
    }
  }, [location]);
  
  // Load doctor data
  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const doctorData = await getDoctorById(id);
        if (doctorData) {
          setDoctor(doctorData);
          // If doctor has available slots, select the first date by default
          if (doctorData.availableSlots && doctorData.availableSlots.length > 0) {
            setSelectedDate(doctorData.availableSlots[0].date);
          }
        }
      } catch (error) {
        console.error('Error fetching doctor details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctor();
  }, [id]);
  
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
  };
  
  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };
  
  const getAvailableTimesForSelectedDate = () => {
    if (!selectedDate || !doctor?.availableSlots) return [];
    
    const dateSlot = doctor.availableSlots.find((slot: any) => slot.date === selectedDate);
    return dateSlot ? dateSlot.slots : [];
  };
  
  const handleStartBooking = () => {
    setIsBookingMode(true);
    setBookingStep(1);
    setBookingSuccess(null);
    setBookingError(null);
  };
  
  const handleCancelBooking = () => {
    setIsBookingMode(false);
    setBookingStep(1);
    setSelectedTime('');
    setBookingReason('');
    setBookingSuccess(null);
    setBookingError(null);
  };
  
  const handleNextStep = () => {
    if (bookingStep === 1 && !selectedTime) {
      return; // Can't proceed without selecting a time
    }
    
    setBookingStep(bookingStep + 1);
  };
  
  const handlePrevStep = () => {
    setBookingStep(bookingStep - 1);
  };
  
  const handleSubmitBooking = async () => {
    if (!id || !selectedDate || !selectedTime || !bookingReason) {
      setBookingError('Please fill in all required fields');
      return;
    }
    
    setBookingLoading(true);
    setBookingError(null);
    
    try {
      const result = await bookAppointment({
        doctorId: id,
        date: selectedDate,
        time: selectedTime,
        patientName: user?.displayName || 'Patient',
        patientPhone: user?.phoneNumber || '',
        reason: bookingReason
      });
      
      setBookingSuccess(result);
      setBookingStep(3); // Move to confirmation step
    } catch (error: any) {
      setBookingError(error.message || 'Failed to book appointment. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="flex flex-col md:flex-row">
              <div className="flex-shrink-0 mr-6">
                <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
              </div>
              <div className="flex-grow mt-4 md:mt-0">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3 mt-4"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-sm p-6 text-center">
            <AlertTriangle size={48} className="mx-auto text-amber-500 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Doctor Not Found</h1>
            <p className="text-gray-600 mb-6">The doctor you're looking for doesn't exist or may have been removed.</p>
            <Button
              variant="primary"
              onClick={() => navigate('/doctors')}
            >
              Back to Doctors
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Booking Modal */}
          {isBookingMode && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {bookingStep === 3 ? 'Appointment Confirmed' : 'Book an Appointment'}
                    </h2>
                    <button
                      onClick={handleCancelBooking}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  {bookingStep !== 3 && (
                    <div className="flex items-center mb-6">
                      <div className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          bookingStep >= 1 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          1
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">Select Time</span>
                      </div>
                      <div className="flex-grow mx-4 h-0.5 bg-gray-200"></div>
                      <div className="flex items-center">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          bookingStep >= 2 ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          2
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700">Details</span>
                      </div>
                    </div>
                  )}
                  
                  {bookingError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex items-center text-red-600">
                        <AlertTriangle size={18} className="mr-2" />
                        <span>{bookingError}</span>
                      </div>
                    </div>
                  )}
                  
                  {bookingStep === 1 && (
                    <div>
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Select a Date</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {doctor.availableSlots.map((slot: any) => (
                            <button
                              key={slot.date}
                              onClick={() => handleDateSelect(slot.date)}
                              className={`p-3 text-center border rounded-md transition-colors ${
                                selectedDate === slot.date
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
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Select a Time</h3>
                        {selectedDate ? (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {getAvailableTimesForSelectedDate().map((time: string) => (
                              <button
                                key={time}
                                onClick={() => handleTimeSelect(time)}
                                className={`py-2 px-3 text-center border rounded-md transition-colors ${
                                  selectedTime === time
                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                    : 'border-gray-200 hover:border-primary-300'
                                }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">Please select a date first</p>
                        )}
                      </div>
                      
                      <div className="flex justify-end">
                        <Button
                          variant="primary"
                          onClick={handleNextStep}
                          disabled={!selectedTime}
                          rightIcon={<ChevronRight size={16} />}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {bookingStep === 2 && (
                    <div>
                      <div className="mb-6">
                        <div className="p-4 bg-gray-50 rounded-md mb-4">
                          <div className="flex items-center">
                            <img 
                              src={doctor.imageUrl}
                              alt={doctor.name}
                              className="w-12 h-12 rounded-full object-cover mr-4"
                            />
                            <div>
                              <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                              <p className="text-sm text-gray-500">{doctor.specialty}</p>
                            </div>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <Calendar size={16} className="mr-2" />
                              {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock size={16} className="mr-2" />
                              {selectedTime}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                            Reason for Visit*
                          </label>
                          <textarea
                            id="reason"
                            rows={3}
                            value={bookingReason}
                            onChange={(e) => setBookingReason(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            placeholder="Briefly describe your symptoms or reason for consultation"
                            required
                          ></textarea>
                        </div>
                        
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Appointment Type
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              className="flex items-center p-3 border border-primary-500 bg-primary-50 text-primary-700 rounded-md"
                            >
                              <Video size={18} className="mr-2" />
                              <span>Video Consultation</span>
                            </button>
                            <button
                              type="button"
                              className="flex items-center p-3 border border-gray-200 text-gray-500 rounded-md opacity-60 cursor-not-allowed"
                            >
                              <User size={18} className="mr-2" />
                              <span>In-person Visit</span>
                            </button>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-md mb-4 text-sm text-amber-700">
                          <div className="flex">
                            <AlertTriangle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
                            <p>
                              By scheduling this appointment, you agree to the cancellation policy. 
                              You can cancel or reschedule up to 4 hours before the appointment without any charges.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={handlePrevStep}
                          leftIcon={<ChevronLeft size={16} />}
                        >
                          Back
                        </Button>
                        
                        <Button
                          variant="primary"
                          onClick={handleSubmitBooking}
                          isLoading={bookingLoading}
                          disabled={!bookingReason}
                        >
                          Confirm Booking
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {bookingStep === 3 && bookingSuccess && (
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                        <CheckCircle size={32} className="text-green-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Appointment Confirmed!
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {bookingSuccess.message}
                      </p>
                      <div className="p-4 bg-gray-50 rounded-md mb-6 text-left">
                        <div className="grid grid-cols-2 gap-y-3 text-sm">
                          <div className="text-gray-500">Doctor:</div>
                          <div className="font-medium text-gray-900">{doctor.name}</div>
                          
                          <div className="text-gray-500">Date:</div>
                          <div className="font-medium text-gray-900">
                            {new Date(selectedDate).toLocaleDateString(undefined, { 
                              weekday: 'long', 
                              day: 'numeric', 
                              month: 'long',
                              year: 'numeric'
                            })}
                          </div>
                          
                          <div className="text-gray-500">Time:</div>
                          <div className="font-medium text-gray-900">{selectedTime}</div>
                          
                          <div className="text-gray-500">Appointment ID:</div>
                          <div className="font-medium text-gray-900">{bookingSuccess.appointmentId}</div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                          variant="outline"
                          onClick={handleCancelBooking}
                        >
                          Close
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => navigate('/appointments')}
                        >
                          View My Appointments
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
          
          {/* Doctor profile content */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row">
              <div className="flex-shrink-0 mr-6">
                <img
                  src={doctor.imageUrl}
                  alt={doctor.name}
                  className="w-32 h-32 object-cover rounded-full border-4 border-primary-50"
                />
              </div>
              
              <div className="flex-grow mt-6 md:mt-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{doctor.name}</h1>
                    <p className="text-primary-600 font-medium">{doctor.specialty}</p>
                    
                    <div className="flex flex-wrap items-center mt-2">
                      <div className="flex items-center text-amber-500 mr-4">
                        <Star size={18} className="fill-current" />
                        <span className="ml-1 text-gray-900">{doctor.rating}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-500 mr-4">
                        <MapPin size={16} className="mr-1" />
                        <span>{doctor.location}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-500">
                        <Activity size={16} className="mr-1" />
                        <span>{doctor.hospitalAffiliation}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                    <Button
                      variant="primary"
                      leftIcon={<Calendar size={18} />}
                      onClick={handleStartBooking}
                    >
                      Book Appointment
                    </Button>
                    
                    <Button
                      variant="outline"
                      leftIcon={<Video size={18} />}
                    >
                      Schedule Telemedicine
                    </Button>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-4">
                  <Button variant="ghost" leftIcon={<Phone size={18} />}>
                    Contact
                  </Button>
                  <Button variant="ghost" leftIcon={<MessageSquare size={18} />}>
                    Message
                  </Button>
                  <Button variant="ghost" leftIcon={<Globe size={18} />}>
                    View Website
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* About section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
                <p className="text-gray-700 mb-4">{doctor.description}</p>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Book size={16} className="mr-2 text-primary-500" />
                      Education
                    </h3>
                    <ul className="space-y-2">
                      {doctor.education.map((edu: string, index: number) => (
                        <li key={index} className="text-gray-600 text-sm flex items-start">
                          <CheckCircle size={14} className="text-primary-500 mr-2 mt-1 flex-shrink-0" />
                          <span>{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Award size={16} className="mr-2 text-primary-500" />
                      Specializations
                    </h3>
                    <ul className="space-y-2">
                      <li className="text-gray-600 text-sm flex items-start">
                        <CheckCircle size={14} className="text-primary-500 mr-2 mt-1 flex-shrink-0" />
                        <span>General {doctor.specialty}</span>
                      </li>
                      <li className="text-gray-600 text-sm flex items-start">
                        <CheckCircle size={14} className="text-primary-500 mr-2 mt-1 flex-shrink-0" />
                        <span>Advanced Diagnostics</span>
                      </li>
                      <li className="text-gray-600 text-sm flex items-start">
                        <CheckCircle size={14} className="text-primary-500 mr-2 mt-1 flex-shrink-0" />
                        <span>Minimally Invasive Procedures</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Globe size={16} className="mr-2 text-primary-500" />
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.languages.map((language: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {language}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Reviews section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Patient Reviews</h2>
                  <div className="flex items-center">
                    <Star size={20} className="text-amber-500 fill-current" />
                    <span className="ml-1 text-xl font-semibold text-gray-900">{doctor.rating}</span>
                    <span className="ml-1 text-gray-500">(124 reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Review 1 */}
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center mb-2">
                      <img
                        src="https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg"
                        alt="Patient"
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">Anjali Mehta</h3>
                        <div className="flex items-center text-amber-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={14} className="fill-current" />
                          ))}
                          <span className="ml-2 text-gray-500 text-sm">2 months ago</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Dr. {doctor.name.split(' ')[1]} is exceptionally knowledgeable and attentive. 
                      He took the time to explain my condition thoroughly and answer all my questions. 
                      The treatment plan has been very effective, and I've seen significant improvement.
                    </p>
                  </div>
                  
                  {/* Review 2 */}
                  <div className="border-b border-gray-200 pb-4">
                    <div className="flex items-center mb-2">
                      <img
                        src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg"
                        alt="Patient"
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">Rajiv Singh</h3>
                        <div className="flex items-center text-amber-500">
                          {[1, 2, 3, 4].map((star) => (
                            <Star key={star} size={14} className="fill-current" />
                          ))}
                          <Star key="half" size={14} className="text-gray-300 fill-current" />
                          <span className="ml-2 text-gray-500 text-sm">3 months ago</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Very professional and caring doctor. The clinic staff is also helpful and efficient. 
                      I had to wait a bit longer than my appointment time, but the quality of care was worth it.
                    </p>
                  </div>
                  
                  {/* Review 3 */}
                  <div>
                    <div className="flex items-center mb-2">
                      <img
                        src="https://images.pexels.com/photos/1832636/pexels-photo-1832636.jpeg"
                        alt="Patient"
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">Neha Kapoor</h3>
                        <div className="flex items-center text-amber-500">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} size={14} className="fill-current" />
                          ))}
                          <span className="ml-2 text-gray-500 text-sm">1 month ago</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      I had a video consultation with Dr. {doctor.name.split(' ')[1]} and was impressed by how thorough he was even in a remote setting.
                      He followed up with detailed recommendations and has been responsive to my messages since then.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View all 124 reviews
                  </button>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {/* Availability section */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Availability</h2>
                
                {doctor.availableSlots.length > 0 ? (
                  <div className="space-y-3">
                    {doctor.availableSlots.map((slot: any) => (
                      <div key={slot.date} className="p-3 border border-gray-200 rounded-md">
                        <div className="font-medium text-gray-900">
                          {new Date(slot.date).toLocaleDateString(undefined, { 
                            weekday: 'long', 
                            month: 'short', 
                            day: 'numeric'
                          })}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {slot.slots.map((time: string) => (
                            <span key={time} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      variant="primary"
                      fullWidth
                      leftIcon={<Calendar size={18} />}
                      onClick={handleStartBooking}
                    >
                      Book Appointment
                    </Button>
                  </div>
                ) : (
                  <p className="text-gray-500">No available slots at the moment.</p>
                )}
              </div>
              
              {/* Fee info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Consultation Fee</h2>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <span className="text-gray-700">Video Consultation</span>
                  <span className="font-semibold text-gray-900">₹{doctor.consultationFee}</span>
                </div>
                <div className="flex justify-between items-center p-3 mt-2 bg-gray-50 rounded-md">
                  <span className="text-gray-700">In-person Visit</span>
                  <span className="font-semibold text-gray-900">₹{doctor.consultationFee + 300}</span>
                </div>
                <p className="mt-3 text-xs text-gray-500">
                  *Fees shown are for consultation only. Additional charges may apply for procedures, tests, or follow-ups.
                </p>
              </div>
              
              {/* Contact info */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Location & Contact</h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin size={18} className="text-gray-500 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900 font-medium">{doctor.hospitalAffiliation}</p>
                      <p className="text-gray-600 text-sm">
                        123 Medical Center Road, {doctor.location}, India
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone size={18} className="text-gray-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">+91 98765 43210</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Globe size={18} className="text-gray-500 mr-3 flex-shrink-0" />
                    <a href="#" className="text-primary-600 hover:text-primary-700">
                      www.{doctor.hospitalAffiliation.toLowerCase().replace(/\s+/g, '')}.com/doctors
                    </a>
                  </div>
                </div>
                
                <div className="mt-4 h-40 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Map location</span>
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

export default DoctorProfilePage;