import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  MapPin,
  Star,
  Filter,
  Calendar,
  ChevronRight,
  ArrowRight,
  X,
  Clock,
  Activity,
  Heart
} from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import { getAllDoctors, searchDoctors, type Doctor } from '../services/doctorService';

type FilterOptions = {
  specialty: string;
  location: string;
  rating: number | null;
};

const DoctorsListPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<FilterOptions>({
    specialty: '',
    location: '',
    rating: null
  });
  
  // Get all specialties for filter
  const specialties = [...new Set(doctors.map(doc => doc.specialty))];
  // Get all locations for filter
  const locations = [...new Set(doctors.map(doc => doc.location))];
  
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const data = await getAllDoctors();
        setDoctors(data);
        setFilteredDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctors();
  }, []);
  
  const handleSearch = async () => {
    try {
      setLoading(true);
      if (searchTerm.trim()) {
        const results = await searchDoctors(searchTerm);
        setFilteredDoctors(results);
      } else {
        setFilteredDoctors(doctors);
      }
    } catch (error) {
      console.error('Error searching doctors:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (key: keyof FilterOptions, value: string | number | null) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const applyFilters = () => {
    let results = [...doctors];
    
    if (filters.specialty) {
      results = results.filter(doc => doc.specialty === filters.specialty);
    }
    
    if (filters.location) {
      results = results.filter(doc => doc.location === filters.location);
    }
    
    if (filters.rating) {
      results = results.filter(doc => doc.rating >= filters.rating!);
    }
    
    setFilteredDoctors(results);
    setShowFilters(false);
  };
  
  const resetFilters = () => {
    setFilters({
      specialty: '',
      location: '',
      rating: null
    });
    setFilteredDoctors(doctors);
    setSearchTerm('');
  };
  
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
                  Find a Doctor
                </h1>
                <p className="text-gray-600 mt-1">
                  Connect with top specialists for consultations and appointments
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Search by doctor name, specialty, or location"
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm('');
                          setFilteredDoctors(doctors);
                        }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <X className="h-5 w-5 text-gray-400 hover:text-gray-500" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    onClick={handleSearch}
                    leftIcon={<Search size={18} />}
                  >
                    Search
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    leftIcon={<Filter size={18} />}
                  >
                    Filters
                  </Button>
                </div>
              </div>
              
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 p-4 border border-gray-200 rounded-md"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
                        Specialty
                      </label>
                      <select
                        id="specialty"
                        value={filters.specialty}
                        onChange={(e) => handleFilterChange('specialty', e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                      >
                        <option value="">All Specialties</option>
                        {specialties.map((specialty) => (
                          <option key={specialty} value={specialty}>
                            {specialty}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <select
                        id="location"
                        value={filters.location}
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                      >
                        <option value="">All Locations</option>
                        {locations.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Rating
                      </label>
                      <select
                        id="rating"
                        value={filters.rating || ''}
                        onChange={(e) => handleFilterChange('rating', e.target.value ? Number(e.target.value) : null)}
                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                      >
                        <option value="">Any Rating</option>
                        <option value="4.5">4.5+</option>
                        <option value="4">4+</option>
                        <option value="3.5">3.5+</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end gap-2">
                    <Button variant="ghost" onClick={resetFilters}>
                      Reset
                    </Button>
                    <Button variant="primary" onClick={applyFilters}>
                      Apply Filters
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
          
          {/* Doctors listing */}
          <div className="space-y-6">
            {loading ? (
              // Loading state
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-shrink-0 mr-6">
                        <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                      </div>
                      <div className="flex-grow mt-4 md:mt-0">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredDoctors.length > 0 ? (
              <div className="space-y-4">
                {filteredDoctors.map((doctor) => (
                  <motion.div
                    key={doctor.id}
                    whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                    className="bg-white rounded-lg shadow-sm p-6 transition-all"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="flex-shrink-0 mr-6">
                        <img
                          src={doctor.imageUrl}
                          alt={doctor.name}
                          className="w-24 h-24 object-cover rounded-full border-2 border-primary-50"
                        />
                      </div>
                      
                      <div className="flex-grow mt-4 md:mt-0">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h2 className="text-xl font-semibold text-gray-900">{doctor.name}</h2>
                            <p className="text-primary-600 font-medium">{doctor.specialty}</p>
                          </div>
                          
                          <div className="flex flex-wrap items-center mt-2 md:mt-0">
                            <div className="flex items-center text-amber-500 mr-4">
                              <Star size={18} className="fill-current" />
                              <span className="ml-1 text-gray-900 font-medium">{doctor.rating}</span>
                            </div>
                            
                            <div className="flex items-center text-gray-500">
                              <MapPin size={16} className="mr-1" />
                              <span>{doctor.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="mt-2 text-gray-600">{doctor.description}</p>
                        
                        <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-600">
                          <span className="px-2 py-1 bg-gray-100 rounded-full">
                            <Clock size={14} className="inline-block mr-1" /> {doctor.experience} years exp.
                          </span>
                          <span className="px-2 py-1 bg-gray-100 rounded-full">
                            <Activity size={14} className="inline-block mr-1" /> {doctor.hospitalAffiliation}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 rounded-full">
                            <Calendar size={14} className="inline-block mr-1" /> Available in 2 days
                          </span>
                        </div>
                        
                        <div className="mt-4 flex flex-wrap gap-3">
                          <Link to={`/doctors/${doctor.id}`}>
                            <Button
                              variant="primary"
                              rightIcon={<ArrowRight size={16} />}
                            >
                              View Profile
                            </Button>
                          </Link>
                          
                          <Link to={`/doctors/${doctor.id}?action=book`}>
                            <Button
                              variant="outline"
                              leftIcon={<Calendar size={16} />}
                            >
                              Book Appointment
                            </Button>
                          </Link>
                          
                          <Button
                            variant="ghost"
                            leftIcon={<Heart size={16} />}
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-4">
                  <Search className="h-6 w-6 text-gray-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No doctors found</h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button variant="primary" onClick={resetFilters}>
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
          
          {/* Specialty links */}
          {!loading && filteredDoctors.length > 0 && (
            <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Browse by Specialty
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {specialties.map((specialty) => (
                  <button
                    key={specialty}
                    onClick={() => {
                      handleFilterChange('specialty', specialty);
                      applyFilters();
                    }}
                    className="flex items-center justify-between p-3 text-left text-gray-700 hover:text-primary-600 border border-gray-200 rounded-md hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <span>{specialty}</span>
                    <ChevronRight size={16} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DoctorsListPage;