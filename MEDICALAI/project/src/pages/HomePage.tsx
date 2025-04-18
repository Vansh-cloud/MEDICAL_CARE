import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Activity, Search, Users, Calendar, Video, FileText, ArrowRight } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                  AI-Powered Healthcare<br />At Your Fingertips
                </h1>
                <p className="text-lg sm:text-xl mb-8 text-primary-100">
                  Get instant medical advice, connect with top doctors, and monitor your health with our advanced AI platform.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/auth">
                    <Button
                      variant="secondary"
                      size="lg"
                      rightIcon={<ArrowRight size={18} />}
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/diagnosis">
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-transparent border-white text-white hover:bg-white hover:text-primary-700"
                    >
                      Try AI Diagnosis
                    </Button>
                  </Link>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden md:block"
              >
                <img 
                  src="https://images.pexels.com/photos/5722164/pexels-photo-5722164.jpeg" 
                  alt="Doctor with patient" 
                  className="w-full h-auto rounded-lg shadow-xl"
                />
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Comprehensive Healthcare Solutions</h2>
              <p className="mt-4 text-xl text-gray-600">Everything you need for better health, all in one platform</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-md p-6 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-md mb-4">
                  <Activity className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">AI Diagnosis</h3>
                <p className="text-gray-600">
                  Get instant assessment of your symptoms through our advanced AI system with high accuracy rates.
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-md p-6 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-md mb-4">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Expert Doctors</h3>
                <p className="text-gray-600">
                  Connect with verified, experienced doctors from top hospitals across India for consultations.
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-md p-6 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-md mb-4">
                  <Video className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Video Consultations</h3>
                <p className="text-gray-600">
                  Consult with doctors face-to-face through secure, high-quality video calls from the comfort of home.
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-md p-6 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-md mb-4">
                  <Calendar className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Easy Scheduling</h3>
                <p className="text-gray-600">
                  Book, reschedule, or cancel appointments with just a few clicks. No more waiting on phone lines.
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-md p-6 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-md mb-4">
                  <Activity className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Health Tracking</h3>
                <p className="text-gray-600">
                  Monitor your vital signs, medications, and health trends over time with our intuitive tracker.
                </p>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-lg shadow-md p-6 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-md mb-4">
                  <FileText className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Medical Records</h3>
                <p className="text-gray-600">
                  Store and access all your medical documents securely in one place, available whenever you need them.
                </p>
              </motion.div>
            </div>
            
            <div className="text-center mt-12">
              <Link to="/auth">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight size={18} />}>
                  Explore All Features
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
              <p className="mt-4 text-xl text-gray-600">Real stories from people who've transformed their healthcare experience</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-gray-50 rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg" 
                    alt="Testimonial" 
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Rahul Verma</h4>
                    <p className="text-gray-500">Delhi</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "The AI diagnosis accurately identified my condition which helped me consult the right specialist. Saved me a lot of time and worry."
                </p>
                <div className="flex mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-gray-50 rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg" 
                    alt="Testimonial" 
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Priya Sharma</h4>
                    <p className="text-gray-500">Mumbai</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "The video consultation feature is a lifesaver. I could speak with a specialist without traveling for hours, and the prescription was delivered to my door."
                </p>
                <div className="flex mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-gray-50 rounded-lg p-6 shadow-sm"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src="https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg" 
                    alt="Testimonial" 
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Ajay Patel</h4>
                    <p className="text-gray-500">Bangalore</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "The health tracker has completely changed how I manage my diabetes. I can see patterns in my readings and share them directly with my doctor."
                </p>
                <div className="flex mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-primary-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to transform your healthcare experience?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join thousands of users who are taking control of their health with MedCare's AI-powered platform.
            </p>
            <Link to="/auth">
              <Button
                variant="secondary"
                size="lg"
                rightIcon={<ArrowRight size={18} />}
              >
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;