import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Smartphone, AlertCircle, ArrowRight, ChevronLeft } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import { useAuthStore } from '../store/authStore';

type AuthMethod = 'select' | 'google' | 'phone' | 'otp';

const AuthPage: React.FC = () => {
  const { 
    signInWithGoogle, 
    signInWithPhone: signInWithPhoneService,
    verifyOtp,
    loading, 
    error,
    clearError,
    isAuthenticated
  } = useAuthStore();
  
  const navigate = useNavigate();
  const [authMethod, setAuthMethod] = useState<AuthMethod>('select');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      // Error is handled in the auth store
    }
  };
  
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await signInWithPhoneService(phoneNumber);
      setAuthMethod('otp');
    } catch (err) {
      // Error is handled in the auth store
    }
  };
  
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await verifyOtp(otp);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled in the auth store
    }
  };
  
  const goBack = () => {
    clearError();
    if (authMethod === 'otp') {
      setAuthMethod('phone');
    } else {
      setAuthMethod('select');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full mx-auto bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div className="px-6 py-8">
            {authMethod !== 'select' && (
              <button
                onClick={goBack}
                className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4"
              >
                <ChevronLeft size={16} className="mr-1" />
                Back
              </button>
            )}
            
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                {authMethod === 'select' && 'Sign in to MedCare'}
                {authMethod === 'google' && 'Continue with Google'}
                {authMethod === 'phone' && 'Enter your phone number'}
                {authMethod === 'otp' && 'Enter verification code'}
              </h1>
              <p className="mt-2 text-gray-600">
                {authMethod === 'select' && 'Access your health records, appointments, and more'}
                {authMethod === 'phone' && 'We\'ll send you a one-time verification code'}
                {authMethod === 'otp' && 'A 6-digit code has been sent to your phone'}
              </p>
            </div>
            
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-center text-red-600">
                  <AlertCircle size={18} className="mr-2" />
                  <span>{error}</span>
                </div>
              </div>
            )}
            
            {authMethod === 'select' && (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<Mail size={18} />}
                  onClick={() => handleGoogleSignIn()}
                  isLoading={loading}
                >
                  Continue with Google
                </Button>
                
                <Button
                  variant="outline"
                  fullWidth
                  leftIcon={<Smartphone size={18} />}
                  onClick={() => setAuthMethod('phone')}
                >
                  Continue with Phone
                </Button>
                
                <div className="mt-6 text-center text-sm text-gray-500">
                  By continuing, you agree to MedCare's <a href="#" className="text-primary-500 hover:text-primary-600">Terms of Service</a> and <a href="#" className="text-primary-500 hover:text-primary-600">Privacy Policy</a>.
                </div>
              </div>
            )}
            
            {authMethod === 'phone' && (
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">+91</span>
                    </div>
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-12 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-3 px-4 border"
                      placeholder="Enter 10-digit number"
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Only Indian phone numbers are supported at this time (+91).
                  </p>
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={loading}
                  rightIcon={<ArrowRight size={18} />}
                >
                  Send Verification Code
                </Button>
              </form>
            )}
            
            {authMethod === 'otp' && (
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm py-3 px-4 border text-center tracking-widest"
                    placeholder="6-digit code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Please enter the 6-digit code sent to {phoneNumber}.
                  </p>
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={loading}
                  rightIcon={<ArrowRight size={18} />}
                >
                  Verify Code
                </Button>
                
                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-primary-500 hover:text-primary-600"
                    onClick={() => {
                      clearError();
                      setAuthMethod('phone');
                    }}
                  >
                    Didn't receive the code? Try again
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AuthPage;