import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Bell, 
  LogOut, 
  CheckCircle, 
  X, 
  Camera, 
  Clock
} from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import { useAuthStore } from '../store/authStore';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateProfile, signOut, isAuthenticated } = useAuthStore();
  
  // Basic user information
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phone: '',
    address: '',
    photoURL: '',
  });
  
  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setError] = useState<string | null>(null);
  
  // Notification preferences
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailReminders: true,
    smsReminders: true,
    appointmentUpdates: true,
    marketingEmails: false
  });
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);
  
  // Set form data from user
  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',
        address: user.address || '',
        photoURL: user.photoURL || '',
      });
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotificationPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleEditToggle = () => {
    if (isEditing) {
      // If we're canceling edits, reset form data
      if (user) {
        setFormData({
          displayName: user.displayName || '',
          email: user.email || '',
          phone: user.phoneNumber || '',
          address: user.address || '',
          photoURL: user.photoURL || '',
        });
      }
    }
    setIsEditing(!isEditing);
    setSaveSuccess(false);
    setError(null);
  };
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      setError(null);
      
      // Update profile in auth store
      await updateProfile({
        displayName: formData.displayName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        photoURL: formData.photoURL
      });
      
      // Show success message
      setSaveSuccess(true);
      setIsEditing(false);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError(error.message || 'An error occurred while saving your profile');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // If user is not authenticated or loading
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-4">
                  <User size={24} className="text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Not signed in</h3>
                <p className="text-gray-500 mb-4">Please sign in to view your profile</p>
                <Button
                  variant="primary"
                  as="a"
                  href="/auth"
                >
                  Sign In
                </Button>
              </div>
            </div>
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
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 relative">
                  <img
                    src={user.photoURL || "https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg"}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  {isEditing && (
                    <div className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow">
                      <button className="text-primary-600 hover:text-primary-700">
                        <Camera size={16} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.displayName || 'Your Profile'}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage your account settings and preferences
                  </p>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex">
                {isEditing ? (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={handleEditToggle}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSaveProfile}
                      isLoading={isSaving}
                    >
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleEditToggle}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
            
            {saveSuccess && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center text-green-700">
                  <CheckCircle size={18} className="mr-2" />
                  <span>Profile updated successfully</span>
                </div>
              </div>
            )}
            
            {saveError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center text-red-700">
                  <X size={18} className="mr-2" />
                  <span>{saveError}</span>
                </div>
              </div>
            )}
          </motion.div>
          
          {/* Profile information */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="displayName"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  ) : (
                    <div className="flex items-center text-gray-800">
                      <User size={16} className="text-gray-500 mr-2" />
                      <span>{formData.displayName || 'Not provided'}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  ) : (
                    <div className="flex items-center text-gray-800">
                      <Mail size={16} className="text-gray-500 mr-2" />
                      <span>{formData.email || 'Not provided'}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  ) : (
                    <div className="flex items-center text-gray-800">
                      <Phone size={16} className="text-gray-500 mr-2" />
                      <span>{formData.phone || 'Not provided'}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  ) : (
                    <div className="flex items-center text-gray-800">
                      <MapPin size={16} className="text-gray-500 mr-2" />
                      <span>{formData.address || 'Not provided'}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-medium text-gray-900">Login & Security</h3>
                  <Button variant="outline" size="sm">
                    Change Password
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Shield size={18} className="text-gray-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-800 font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      <div className="mt-2">
                        <Button variant="outline" size="sm">
                          Enable
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Clock size={18} className="text-gray-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-800 font-medium">Login History</p>
                      <p className="text-sm text-gray-500">See where you've logged in from</p>
                      <div className="mt-2">
                        <Button variant="outline" size="sm">
                          View History
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notification preferences */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              <Bell size={18} className="inline-block mr-2 text-gray-500" />
              Notification Preferences
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-800 font-medium">Email Appointment Reminders</p>
                  <p className="text-sm text-gray-500">Receive email reminders before your appointments</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    name="emailReminders"
                    id="emailReminders"
                    checked={notificationPreferences.emailReminders}
                    onChange={handleNotificationChange}
                    className="sr-only"
                  />
                  <label
                    htmlFor="emailReminders"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                      notificationPreferences.emailReminders ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 ml-1 mt-1 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                        notificationPreferences.emailReminders ? 'translate-x-4' : ''
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-800 font-medium">SMS Appointment Reminders</p>
                  <p className="text-sm text-gray-500">Receive text message reminders before your appointments</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    name="smsReminders"
                    id="smsReminders"
                    checked={notificationPreferences.smsReminders}
                    onChange={handleNotificationChange}
                    className="sr-only"
                  />
                  <label
                    htmlFor="smsReminders"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                      notificationPreferences.smsReminders ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 ml-1 mt-1 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                        notificationPreferences.smsReminders ? 'translate-x-4' : ''
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-800 font-medium">Appointment Updates</p>
                  <p className="text-sm text-gray-500">Receive notifications when appointments are rescheduled or canceled</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    name="appointmentUpdates"
                    id="appointmentUpdates"
                    checked={notificationPreferences.appointmentUpdates}
                    onChange={handleNotificationChange}
                    className="sr-only"
                  />
                  <label
                    htmlFor="appointmentUpdates"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                      notificationPreferences.appointmentUpdates ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 ml-1 mt-1 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                        notificationPreferences.appointmentUpdates ? 'translate-x-4' : ''
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-800 font-medium">Marketing Emails</p>
                  <p className="text-sm text-gray-500">Receive promotional offers and healthcare tips</p>
                </div>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input
                    type="checkbox"
                    name="marketingEmails"
                    id="marketingEmails"
                    checked={notificationPreferences.marketingEmails}
                    onChange={handleNotificationChange}
                    className="sr-only"
                  />
                  <label
                    htmlFor="marketingEmails"
                    className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                      notificationPreferences.marketingEmails ? 'bg-primary-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`block w-4 h-4 ml-1 mt-1 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${
                        notificationPreferences.marketingEmails ? 'translate-x-4' : ''
                      }`}
                    ></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Account actions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Account Actions</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <LogOut size={18} className="text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-gray-800 font-medium">Sign Out</p>
                  <p className="text-sm text-gray-500">Log out of your account on this device</p>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <X size={18} className="text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-gray-800 font-medium">Delete Account</p>
                  <p className="text-sm text-gray-500">Permanently delete your account and all associated data</p>
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400 hover:bg-red-50"
                    >
                      Delete Account
                    </Button>
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

export default ProfilePage;