import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  Phone, 
  MessageSquare, 
  Paperclip,
  Settings,
  ChevronRight,
  Send,
  FileText,
  User,
  Camera,
  MonitorSmartphone,
  MoreVertical,
  X
} from 'lucide-react';
import Button from '../components/common/Button';
import { useAuthStore } from '../store/authStore';
import { getUserAppointments } from '../services/appointmentService';

const TelemedPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [appointment, setAppointment] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Video call state
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'info'>('info');
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const webcamRef = useRef<Webcam>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Load appointment data
  useEffect(() => {
    const fetchAppointment = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      try {
        setLoading(true);
        const userAppointments = await getUserAppointments(user.uid);
        
        if (id) {
          // Find specific appointment
          const foundAppointment = userAppointments.find(apt => apt.id === id);
          
          if (foundAppointment) {
            setAppointment(foundAppointment);
          } else {
            setError('Appointment not found');
          }
        } else {
          // Find the next upcoming appointment
          const nextAppointment = userAppointments
            .filter(apt => apt.status === 'upcoming')
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
          
          if (nextAppointment) {
            setAppointment(nextAppointment);
          } else {
            setError('No upcoming appointments found');
          }
        }
      } catch (err) {
        console.error('Error fetching appointment:', err);
        setError('Failed to load appointment information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointment();
  }, [id, user, navigate]);
  
  // Initialize mock chat messages
  useEffect(() => {
    if (appointment) {
      setMessages([
        {
          id: 1,
          sender: 'doctor',
          text: `Hello! I'm Dr. ${appointment.doctorName.split(' ')[1]}. How are you feeling today?`,
          time: new Date(Date.now() - 120000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [appointment]);
  
  const toggleMic = () => {
    setIsMicOn(!isMicOn);
  };
  
  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };
  
  const startCall = () => {
    setIsCallConnected(true);
    setIsCallStarted(true);
    
    // Simulate doctor joining after 2 seconds
    setTimeout(() => {
      addMessage({
        id: Date.now(),
        sender: 'system',
        text: `Dr. ${appointment?.doctorName.split(' ')[1]} has joined the call`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }, 2000);
  };
  
  const endCall = () => {
    setIsCallConnected(false);
    
    // Ask if the user wants to navigate away
    if (window.confirm('Do you want to end this consultation and return to your appointments?')) {
      navigate('/appointments');
    }
  };
  
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    addMessage({
      id: Date.now(),
      sender: 'user',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    
    setNewMessage('');
    
    // Simulate doctor response after 1-3 seconds
    setTimeout(() => {
      const responses = [
        "I understand. Could you tell me when these symptoms started?",
        "Thank you for sharing. Have you tried any medication for this?",
        "I see. Based on what you've described, I have a few recommendations.",
        "That's helpful information. Let me examine you more closely on the video."
      ];
      
      addMessage({
        id: Date.now(),
        sender: 'doctor',
        text: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }, 1000 + Math.random() * 2000);
  };
  
  const addMessage = (message: any) => {
    setMessages(prev => [...prev, message]);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Preparing Your Consultation</h2>
          <p className="text-gray-600">Setting up your secure video connection...</p>
        </div>
      </div>
    );
  }
  
  if (error || !appointment) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <X size={48} className="mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {error || 'Appointment not found'}
          </h2>
          <p className="text-gray-600 mb-6">
            {error
              ? 'We encountered an issue setting up your telemedicine appointment.'
              : 'The appointment you\'re looking for doesn\'t exist or may have been canceled.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate('/appointments')}
            >
              View Appointments
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/doctors')}
            >
              Find a Doctor
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/appointments')}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            <div className="flex items-center">
              <img
                src={appointment.doctorImage}
                alt={appointment.doctorName}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <h1 className="font-medium text-gray-900">{appointment.doctorName}</h1>
                <p className="text-sm text-gray-500">{appointment.doctorSpecialty}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)} 
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <Settings size={20} />
            </button>
            <div className="hidden md:block">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="ml-2 text-gray-500 hover:text-gray-700 p-2 md:hidden"
              >
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Settings dropdown */}
      {isSettingsOpen && (
        <div className="absolute top-14 right-4 z-10 bg-white rounded-md shadow-lg border border-gray-200 w-60">
          <div className="p-3 border-b border-gray-200">
            <h3 className="font-medium text-gray-900">Call Settings</h3>
          </div>
          <div className="p-2">
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 flex items-center">
              <MonitorSmartphone size={16} className="mr-2 text-gray-600" />
              <span>Switch Device</span>
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 flex items-center">
              <Camera size={16} className="mr-2 text-gray-600" />
              <span>Test Camera</span>
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 flex items-center">
              <Mic size={16} className="mr-2 text-gray-600" />
              <span>Test Microphone</span>
            </button>
            <button 
              onClick={() => navigate('/appointments')}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 flex items-center text-red-600"
            >
              <X size={16} className="mr-2" />
              <span>Exit Consultation</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="flex-grow flex flex-col md:flex-row">
        {/* Video area */}
        <div className="flex-grow flex flex-col">
          <div className="relative flex-grow bg-gray-800 flex items-center justify-center overflow-hidden">
            {!isCallConnected && !isCallStarted && (
              <div className="text-center text-white">
                <div className="mb-4 p-4 bg-gray-900 rounded-lg inline-block">
                  <VideoIcon size={48} className="mx-auto text-primary-500" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Ready to Start Your Consultation?</h2>
                <p className="text-gray-300 mb-6 max-w-md mx-auto">
                  You're about to meet with Dr. {appointment.doctorName.split(' ')[1]}. 
                  Make sure your camera and microphone are working.
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={startCall}
                  leftIcon={<VideoIcon size={18} />}
                >
                  Start Video Consultation
                </Button>
              </div>
            )}
            
            {isCallStarted && (
              <>
                {/* Doctor video (simulated) */}
                {isCallConnected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img 
                      src={appointment.doctorImage} 
                      alt="Doctor"
                      className="w-full h-full object-cover"
                    />
                    {!isVideoOn && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80">
                        <div className="text-center">
                          <VideoOff size={48} className="mx-auto text-white mb-2" />
                          <p className="text-white">Your video is off</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* User's video */}
                <div className={`absolute bottom-4 right-4 w-32 h-24 md:w-48 md:h-36 rounded-lg overflow-hidden border-2 ${isCallConnected ? 'border-white' : 'border-primary-500'}`}>
                  {isVideoOn ? (
                    <Webcam
                      ref={webcamRef}
                      audio={isMicOn}
                      video={true}
                      muted={true}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <User size={32} className="text-white" />
                    </div>
                  )}
                </div>
                
                {/* Call controls */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <div className="flex items-center space-x-2 bg-gray-900 bg-opacity-80 px-2 py-1 rounded-full">
                    <button
                      onClick={toggleMic}
                      className={`p-3 rounded-full ${isMicOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                      {isMicOn ? <Mic size={20} className="text-white" /> : <MicOff size={20} className="text-white" />}
                    </button>
                    
                    <button
                      onClick={toggleVideo}
                      className={`p-3 rounded-full ${isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                      {isVideoOn ? <VideoIcon size={20} className="text-white" /> : <VideoOff size={20} className="text-white" />}
                    </button>
                    
                    <button
                      onClick={endCall}
                      className="p-3 rounded-full bg-red-600 hover:bg-red-700"
                    >
                      <Phone size={20} className="text-white transform rotate-135" />
                    </button>
                  </div>
                </div>
                
                {/* Connecting indicator */}
                {!isCallConnected && (
                  <div className="absolute top-4 left-0 right-0 flex justify-center">
                    <div className="bg-black bg-opacity-70 text-white px-4 py-2 rounded-full flex items-center">
                      <div className="animate-pulse mr-2 h-2 w-2 rounded-full bg-primary-500"></div>
                      <span>Connecting to Dr. {appointment.doctorName.split(' ')[1]}...</span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="md:w-80 border-l border-gray-200 bg-white flex flex-col">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-grow py-3 px-4 text-center ${activeTab === 'info' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Appointment Info
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-grow py-3 px-4 text-center ${activeTab === 'chat' ? 'border-b-2 border-primary-500 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Chat
              </button>
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto">
            {activeTab === 'info' && (
              <div className="p-4">
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Date & Time</h3>
                  <p className="text-gray-900">{new Date(appointment.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  <p className="text-gray-900">{appointment.time}</p>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Reason for Visit</h3>
                  <p className="text-gray-900">{appointment.reason}</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Consultation Steps</h3>
                  
                  <div className="space-y-3">
                    <div className="flex">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600">
                        1
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-900 font-medium">Discuss Symptoms</p>
                        <p className="text-sm text-gray-500">Explain your symptoms and medical history</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600">
                        2
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-900 font-medium">Examination</p>
                        <p className="text-sm text-gray-500">Doctor will guide you through an examination</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600">
                        3
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-900 font-medium">Diagnosis & Treatment</p>
                        <p className="text-sm text-gray-500">Receive diagnosis and treatment plan</p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600">
                        4
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-900 font-medium">Prescription & Follow-up</p>
                        <p className="text-sm text-gray-500">Get prescription and follow-up instructions</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Medical Documents</h3>
                  <button className="flex items-center justify-between w-full p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                    <div className="flex items-center">
                      <FileText size={16} className="text-gray-500 mr-2" />
                      <span className="text-gray-900">Upload Medical Records</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'chat' && (
              <div className="flex flex-col h-full">
                <div className="flex-grow p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {message.sender === 'doctor' && (
                          <img
                            src={appointment.doctorImage}
                            alt="Doctor"
                            className="h-8 w-8 rounded-full mr-2 object-cover"
                          />
                        )}
                        
                        {message.sender === 'system' ? (
                          <div className="bg-gray-100 rounded-lg px-3 py-2 max-w-xs">
                            <p className="text-gray-700 text-sm">{message.text}</p>
                            <p className="text-gray-500 text-xs mt-1">{message.time}</p>
                          </div>
                        ) : (
                          <div className={`rounded-lg px-3 py-2 max-w-xs ${
                            message.sender === 'user' 
                              ? 'bg-primary-100 text-primary-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            <p className="text-sm">{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender === 'user' ? 'text-primary-600' : 'text-gray-500'
                            }`}>{message.time}</p>
                          </div>
                        )}
                        
                        {message.sender === 'user' && (
                          <img
                            src={user?.photoURL || "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg"}
                            alt="User"
                            className="h-8 w-8 rounded-full ml-2 object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-3 border-t border-gray-200">
                  <div className="flex items-center">
                    <button className="text-gray-500 hover:text-gray-700 p-2">
                      <Paperclip size={20} />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-grow border-0 focus:ring-0 focus:outline-none"
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button 
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className={`p-2 rounded-full ${newMessage.trim() ? 'text-primary-600 hover:bg-primary-50' : 'text-gray-400'}`}
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelemedPage;