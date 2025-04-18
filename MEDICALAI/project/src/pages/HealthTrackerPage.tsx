import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart,
  Activity, 
  Droplet, 
  Scale, 
  Thermometer, 
  Plus, 
  X, 
  ChevronRight, 
  Clock, 
  Calendar
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import { 
  getVitalRecords, 
  addVitalRecord, 
  getMedications, 
  addMedication, 
  updateMedicationStatus
} from '../services/healthTrackerService';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type VitalType = 'bloodPressure' | 'bloodSugar' | 'heartRate' | 'weight' | 'temperature' | 'oxygenLevel';
type FormMode = 'vital' | 'medication' | null;

const HealthTrackerPage: React.FC = () => {
  const [vitalRecords, setVitalRecords] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState({
    vitals: true,
    medications: true
  });
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>(null);
  
  // Vital record form state
  const [selectedVitalType, setSelectedVitalType] = useState<VitalType>('bloodPressure');
  const [vitalValue, setVitalValue] = useState('');
  const [vitalNotes, setVitalNotes] = useState('');
  
  // Medication form state
  const [medicationName, setMedicationName] = useState('');
  const [medicationDosage, setMedicationDosage] = useState('');
  const [medicationFrequency, setMedicationFrequency] = useState('');
  const [medicationStartDate, setMedicationStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [medicationEndDate, setMedicationEndDate] = useState('');
  const [medicationNotes, setMedicationNotes] = useState('');
  
  // Chart data
  const [chartData, setChartData] = useState<any>(null);
  const [activeChartType, setActiveChartType] = useState<VitalType>('bloodPressure');
  
  // Load health data
  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        // Fetch vital records
        const records = await getVitalRecords();
        setVitalRecords(records);
        setLoading(prev => ({ ...prev, vitals: false }));
        
        // Fetch medications
        const meds = await getMedications();
        setMedications(meds);
        setLoading(prev => ({ ...prev, medications: false }));
        
        // Prepare chart data
        prepareChartData('bloodPressure', records);
      } catch (error) {
        console.error('Error fetching health data:', error);
        setLoading({ vitals: false, medications: false });
      }
    };
    
    fetchHealthData();
  }, []);
  
  // Prepare chart data for selected vital type
  const prepareChartData = (vitalType: VitalType, records = vitalRecords) => {
    const filteredRecords = records.filter(record => record.type === vitalType)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    if (filteredRecords.length === 0) {
      setChartData(null);
      return;
    }
    
    let labels: string[] = [];
    let values: any[] = [];
    
    // Format data based on vital type
    if (vitalType === 'bloodPressure') {
      labels = filteredRecords.map(record => 
        new Date(record.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      );
      
      // For blood pressure, split into systolic and diastolic
      const systolic: number[] = [];
      const diastolic: number[] = [];
      
      filteredRecords.forEach(record => {
        const [sys, dia] = record.value.split('/').map(Number);
        systolic.push(sys);
        diastolic.push(dia);
      });
      
      values = [
        {
          label: 'Systolic',
          data: systolic,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          tension: 0.3,
        },
        {
          label: 'Diastolic',
          data: diastolic,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.3,
        }
      ];
    } else {
      // For other vitals, use single line
      labels = filteredRecords.map(record => 
        new Date(record.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      );
      
      values = [
        {
          label: getVitalLabel(vitalType),
          data: filteredRecords.map(record => typeof record.value === 'string' ? parseFloat(record.value) : record.value),
          borderColor: getChartColor(vitalType),
          backgroundColor: getChartBgColor(vitalType),
          tension: 0.3,
        }
      ];
    }
    
    setChartData({
      labels,
      datasets: values,
    });
  };
  
  const getVitalLabel = (type: VitalType): string => {
    const labels: Record<VitalType, string> = {
      bloodPressure: 'Blood Pressure',
      bloodSugar: 'Blood Sugar',
      heartRate: 'Heart Rate',
      weight: 'Weight',
      temperature: 'Temperature',
      oxygenLevel: 'Oxygen Level'
    };
    return labels[type];
  };
  
  const getVitalUnit = (type: VitalType): string => {
    const units: Record<VitalType, string> = {
      bloodPressure: 'mmHg',
      bloodSugar: 'mg/dL',
      heartRate: 'bpm',
      weight: 'kg',
      temperature: '°C',
      oxygenLevel: '%'
    };
    return units[type];
  };
  
  const getChartColor = (type: VitalType): string => {
    const colors: Record<VitalType, string> = {
      bloodPressure: 'rgb(239, 68, 68)',
      bloodSugar: 'rgb(249, 115, 22)',
      heartRate: 'rgb(236, 72, 153)',
      weight: 'rgb(79, 70, 229)',
      temperature: 'rgb(234, 88, 12)',
      oxygenLevel: 'rgb(16, 185, 129)'
    };
    return colors[type];
  };
  
  const getChartBgColor = (type: VitalType): string => {
    const colors: Record<VitalType, string> = {
      bloodPressure: 'rgba(239, 68, 68, 0.5)',
      bloodSugar: 'rgba(249, 115, 22, 0.5)',
      heartRate: 'rgba(236, 72, 153, 0.5)',
      weight: 'rgba(79, 70, 229, 0.5)',
      temperature: 'rgba(234, 88, 12, 0.5)',
      oxygenLevel: 'rgba(16, 185, 129, 0.5)'
    };
    return colors[type];
  };
  
  const getVitalIcon = (type: VitalType, size = 20): JSX.Element => {
    switch (type) {
      case 'bloodPressure':
        return <Activity size={size} className="text-red-500" />;
      case 'bloodSugar':
        return <Droplet size={size} className="text-orange-500" />;
      case 'heartRate':
        return <Heart size={size} className="text-pink-500" />;
      case 'weight':
        return <Scale size={size} className="text-indigo-500" />;
      case 'temperature':
        return <Thermometer size={size} className="text-orange-600" />;
      case 'oxygenLevel':
        return <Activity size={size} className="text-emerald-500" />;
      default:
        return <Activity size={size} />;
    }
  };
  
  const openVitalForm = () => {
    setFormMode('vital');
    setIsModalOpen(true);
    setSelectedVitalType('bloodPressure');
    setVitalValue('');
    setVitalNotes('');
  };
  
  const openMedicationForm = () => {
    setFormMode('medication');
    setIsModalOpen(true);
    resetMedicationForm();
  };
  
  const resetMedicationForm = () => {
    setMedicationName('');
    setMedicationDosage('');
    setMedicationFrequency('');
    setMedicationStartDate(new Date().toISOString().split('T')[0]);
    setMedicationEndDate('');
    setMedicationNotes('');
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setFormMode(null);
  };
  
  const handleVitalTypeChange = (type: VitalType) => {
    setSelectedVitalType(type);
    setVitalValue('');
  };
  
  const handleChartTypeChange = (type: VitalType) => {
    setActiveChartType(type);
    prepareChartData(type);
  };
  
  const handleSubmitVital = async () => {
    if (!vitalValue) return;
    
    try {
      // Format value based on type
      let formattedValue: string | number = vitalValue;
      
      // Add new vital record
      const newRecord = await addVitalRecord({
        type: selectedVitalType,
        value: formattedValue,
        unit: getVitalUnit(selectedVitalType),
        timestamp: new Date().toISOString(),
        notes: vitalNotes || undefined
      });
      
      // Update local state
      setVitalRecords(prev => [...prev, newRecord]);
      
      // Update chart if we're viewing this type
      if (activeChartType === selectedVitalType) {
        prepareChartData(selectedVitalType, [...vitalRecords, newRecord]);
      }
      
      // Close modal
      closeModal();
    } catch (error) {
      console.error('Error adding vital record:', error);
    }
  };
  
  const handleSubmitMedication = async () => {
    if (!medicationName || !medicationDosage || !medicationFrequency || !medicationStartDate) return;
    
    try {
      // Add new medication
      const newMedication = await addMedication({
        name: medicationName,
        dosage: medicationDosage,
        frequency: medicationFrequency,
        startDate: medicationStartDate,
        endDate: medicationEndDate || undefined,
        isActive: true,
        notes: medicationNotes || undefined
      });
      
      // Update local state
      setMedications(prev => [...prev, newMedication]);
      
      // Close modal
      closeModal();
    } catch (error) {
      console.error('Error adding medication:', error);
    }
  };
  
  const handleMedicationStatusChange = async (id: string, isActive: boolean) => {
    try {
      const success = await updateMedicationStatus(id, isActive);
      
      if (success) {
        // Update local state
        setMedications(prev => 
          prev.map(med => 
            med.id === id ? { ...med, isActive } : med
          )
        );
      }
    } catch (error) {
      console.error('Error updating medication status:', error);
    }
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value: any) => `${value}${activeChartType === 'oxygenLevel' ? '%' : ''}`
        }
      }
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: getVitalLabel(activeChartType),
      },
    },
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
                  Health Tracker
                </h1>
                <p className="text-gray-600 mt-1">
                  Monitor your vitals and medications
                </p>
              </div>
              
              <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  onClick={openVitalForm}
                  leftIcon={<Plus size={16} />}
                >
                  Add Measurement
                </Button>
                
                <Button
                  variant="outline"
                  onClick={openMedicationForm}
                  leftIcon={<Plus size={16} />}
                >
                  Add Medication
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* Health dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Vital records chart */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-wrap items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Health Trends</h2>
                  
                  <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                    <button
                      onClick={() => handleChartTypeChange('bloodPressure')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        activeChartType === 'bloodPressure'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Blood Pressure
                    </button>
                    <button
                      onClick={() => handleChartTypeChange('heartRate')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        activeChartType === 'heartRate'
                          ? 'bg-pink-100 text-pink-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Heart Rate
                    </button>
                    <button
                      onClick={() => handleChartTypeChange('bloodSugar')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        activeChartType === 'bloodSugar'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Blood Sugar
                    </button>
                    <button
                      onClick={() => handleChartTypeChange('weight')}
                      className={`px-3 py-1 rounded-full text-sm ${
                        activeChartType === 'weight'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Weight
                    </button>
                  </div>
                </div>
                
                {loading.vitals ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                  </div>
                ) : chartData ? (
                  <div className="h-64">
                    <Line options={chartOptions} data={chartData} />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 border border-gray-200 rounded-md">
                    <div className="text-center p-6">
                      <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-4">
                        {getVitalIcon(activeChartType, 24)}
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No data yet</h3>
                      <p className="text-gray-500 mb-4">
                        Add your first {getVitalLabel(activeChartType).toLowerCase()} measurement to start tracking
                      </p>
                      <Button variant="primary" size="sm" onClick={openVitalForm}>
                        Add Measurement
                      </Button>
                    </div>
                  </div>
                )}
                
                {!loading.vitals && vitalRecords.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center">
                        <Activity size={20} className="text-red-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Blood Pressure</span>
                      </div>
                      <div className="mt-2">
                        {vitalRecords.filter(r => r.type === 'bloodPressure').length > 0 ? (
                          <div className="flex items-baseline">
                            <span className="text-xl font-bold text-gray-900">
                              {vitalRecords.filter(r => r.type === 'bloodPressure').sort((a, b) => 
                                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                              )[0].value}
                            </span>
                            <span className="ml-1 text-sm text-gray-500">mmHg</span>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">No data</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-pink-50 rounded-lg">
                      <div className="flex items-center">
                        <Heart size={20} className="text-pink-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Heart Rate</span>
                      </div>
                      <div className="mt-2">
                        {vitalRecords.filter(r => r.type === 'heartRate').length > 0 ? (
                          <div className="flex items-baseline">
                            <span className="text-xl font-bold text-gray-900">
                              {vitalRecords.filter(r => r.type === 'heartRate').sort((a, b) => 
                                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                              )[0].value}
                            </span>
                            <span className="ml-1 text-sm text-gray-500">bpm</span>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">No data</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <div className="flex items-center">
                        <Droplet size={20} className="text-orange-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Blood Sugar</span>
                      </div>
                      <div className="mt-2">
                        {vitalRecords.filter(r => r.type === 'bloodSugar').length > 0 ? (
                          <div className="flex items-baseline">
                            <span className="text-xl font-bold text-gray-900">
                              {vitalRecords.filter(r => r.type === 'bloodSugar').sort((a, b) => 
                                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                              )[0].value}
                            </span>
                            <span className="ml-1 text-sm text-gray-500">mg/dL</span>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">No data</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 text-center">
                  <button
                    onClick={openVitalForm}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    Add New Measurement
                  </button>
                </div>
              </div>
              
              {/* Recent measurements */}
              <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Measurements</h2>
                </div>
                
                {loading.vitals ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((item) => (
                      <div key={item} className="p-4 border border-gray-200 rounded-md">
                        <div className="flex items-center">
                          <div className="rounded-full bg-gray-200 h-8 w-8"></div>
                          <div className="ml-3 flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                          </div>
                          <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : vitalRecords.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {vitalRecords
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .slice(0, 5)
                      .map((record) => (
                        <div key={record.id} className="py-3 flex items-center">
                          <div className="flex-shrink-0">
                            {getVitalIcon(record.type as VitalType)}
                          </div>
                          <div className="ml-3 flex-grow">
                            <p className="text-sm text-gray-500">{getVitalLabel(record.type as VitalType)}</p>
                            <div className="flex items-baseline">
                              <span className="text-lg font-semibold text-gray-900">{record.value}</span>
                              <span className="ml-1 text-gray-500 text-xs">{record.unit}</span>
                            </div>
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock size={14} className="mr-1" />
                              {new Date(record.timestamp).toLocaleDateString()} {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            {record.notes && (
                              <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                                {record.notes}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-4">
                      <Activity size={24} className="text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No measurements yet</h3>
                    <p className="text-gray-500 mb-4">Track your health by adding measurements</p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={openVitalForm}
                    >
                      Add First Measurement
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Medications */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Current Medications</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Plus size={16} />}
                    onClick={openMedicationForm}
                  >
                    Add
                  </Button>
                </div>
                
                {loading.medications ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2].map((item) => (
                      <div key={item} className="p-4 border border-gray-200 rounded-md">
                        <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    ))}
                  </div>
                ) : medications.filter(med => med.isActive).length > 0 ? (
                  <div className="space-y-4">
                    {medications
                      .filter(med => med.isActive)
                      .map((medication) => (
                        <div key={medication.id} className="p-4 border border-gray-200 rounded-md">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900">{medication.name}</h3>
                              <p className="text-sm text-gray-600">{medication.dosage} - {medication.frequency}</p>
                            </div>
                            <button 
                              onClick={() => handleMedicationStatusChange(medication.id, false)}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <Calendar size={14} className="mr-1" />
                            Started: {new Date(medication.startDate).toLocaleDateString()}
                            {medication.endDate && (
                              <span className="ml-2">
                                Until: {new Date(medication.endDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          
                          {medication.notes && (
                            <p className="mt-2 text-xs text-gray-500">{medication.notes}</p>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-4">
                      <Activity size={24} className="text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No active medications</h3>
                    <p className="text-gray-500 mb-4">Keep track of your current medications</p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={openMedicationForm}
                    >
                      Add Medication
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Previous medications */}
              {!loading.medications && medications.filter(med => !med.isActive).length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Past Medications</h2>
                  
                  <div className="space-y-3">
                    {medications
                      .filter(med => !med.isActive)
                      .map((medication) => (
                        <div key={medication.id} className="p-3 border border-gray-200 rounded-md bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900">{medication.name}</h3>
                              <p className="text-sm text-gray-600">{medication.dosage}</p>
                            </div>
                            <button 
                              onClick={() => handleMedicationStatusChange(medication.id, true)}
                              className="text-primary-600 hover:text-primary-700 text-sm"
                            >
                              Restore
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              
              {/* Health insights */}
              <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Health Insights</h2>
                
                <div className="space-y-4">
                  <button className="w-full p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-left flex justify-between items-center">
                    <div className="flex items-center">
                      <Heart size={20} className="text-pink-500 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Heart Health Report</h3>
                        <p className="text-sm text-gray-500">Analysis of blood pressure trends</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </button>
                  
                  <button className="w-full p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-left flex justify-between items-center">
                    <div className="flex items-center">
                      <Activity size={20} className="text-indigo-500 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Lifestyle Recommendations</h3>
                        <p className="text-sm text-gray-500">Personalized health tips</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </button>
                  
                  <button className="w-full p-4 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors text-left flex justify-between items-center">
                    <div className="flex items-center">
                      <Droplet size={20} className="text-orange-500 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-900">Glucose Patterns</h3>
                        <p className="text-sm text-gray-500">Blood sugar level analysis</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {formMode === 'vital' ? 'Add Health Measurement' : 'Add Medication'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              
              {formMode === 'vital' && (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Measurement Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleVitalTypeChange('bloodPressure')}
                        className={`flex items-center p-3 border rounded-md ${
                          selectedVitalType === 'bloodPressure'
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-red-300'
                        }`}
                      >
                        <Activity size={18} className="mr-2 text-red-500" />
                        <span>Blood Pressure</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleVitalTypeChange('heartRate')}
                        className={`flex items-center p-3 border rounded-md ${
                          selectedVitalType === 'heartRate'
                            ? 'border-pink-500 bg-pink-50 text-pink-700'
                            : 'border-gray-200 hover:border-pink-300'
                        }`}
                      >
                        <Heart size={18} className="mr-2 text-pink-500" />
                        <span>Heart Rate</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleVitalTypeChange('bloodSugar')}
                        className={`flex items-center p-3 border rounded-md ${
                          selectedVitalType === 'bloodSugar'
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <Droplet size={18} className="mr-2 text-orange-500" />
                        <span>Blood Sugar</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleVitalTypeChange('weight')}
                        className={`flex items-center p-3 border rounded-md ${
                          selectedVitalType === 'weight'
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        <Scale size={18} className="mr-2 text-indigo-500" />
                        <span>Weight</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleVitalTypeChange('temperature')}
                        className={`flex items-center p-3 border rounded-md ${
                          selectedVitalType === 'temperature'
                            ? 'border-orange-600 bg-orange-50 text-orange-700'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <Thermometer size={18} className="mr-2 text-orange-600" />
                        <span>Temperature</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleVitalTypeChange('oxygenLevel')}
                        className={`flex items-center p-3 border rounded-md ${
                          selectedVitalType === 'oxygenLevel'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        <Activity size={18} className="mr-2 text-emerald-500" />
                        <span>Oxygen Level</span>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="vitalValue" className="block text-sm font-medium text-gray-700 mb-1">
                      {selectedVitalType === 'bloodPressure' ? 'Systolic/Diastolic' : 'Value'} ({getVitalUnit(selectedVitalType)})
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="vitalValue"
                        value={vitalValue}
                        onChange={(e) => setVitalValue(e.target.value)}
                        className="block w-full rounded-md border-gray-300 pr-12 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        placeholder={selectedVitalType === 'bloodPressure' ? '120/80' : ''}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">{getVitalUnit(selectedVitalType)}</span>
                      </div>
                    </div>
                    {selectedVitalType === 'bloodPressure' && (
                      <p className="mt-1 text-xs text-gray-500">
                        Enter in format: systolic/diastolic (e.g., 120/80)
                      </p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="vitalNotes" className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (optional)
                    </label>
                    <textarea
                      id="vitalNotes"
                      rows={2}
                      value={vitalNotes}
                      onChange={(e) => setVitalNotes(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="Any additional information"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={closeModal}
                      className="mr-2"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSubmitVital}
                      disabled={!vitalValue}
                    >
                      Save Measurement
                    </Button>
                  </div>
                </div>
              )}
              
              {formMode === 'medication' && (
                <div>
                  <div className="mb-4">
                    <label htmlFor="medicationName" className="block text-sm font-medium text-gray-700 mb-1">
                      Medication Name*
                    </label>
                    <input
                      type="text"
                      id="medicationName"
                      value={medicationName}
                      onChange={(e) => setMedicationName(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="Enter medication name"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="medicationDosage" className="block text-sm font-medium text-gray-700 mb-1">
                        Dosage*
                      </label>
                      <input
                        type="text"
                        id="medicationDosage"
                        value={medicationDosage}
                        onChange={(e) => setMedicationDosage(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        placeholder="e.g. 500mg"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="medicationFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                        Frequency*
                      </label>
                      <input
                        type="text"
                        id="medicationFrequency"
                        value={medicationFrequency}
                        onChange={(e) => setMedicationFrequency(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        placeholder="e.g. Once daily"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="medicationStartDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date*
                      </label>
                      <input
                        type="date"
                        id="medicationStartDate"
                        value={medicationStartDate}
                        onChange={(e) => setMedicationStartDate(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="medicationEndDate" className="block text-sm font-medium text-gray-700 mb-1">
                        End Date (optional)
                      </label>
                      <input
                        type="date"
                        id="medicationEndDate"
                        value={medicationEndDate}
                        onChange={(e) => setMedicationEndDate(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="medicationNotes" className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (optional)
                    </label>
                    <textarea
                      id="medicationNotes"
                      rows={2}
                      value={medicationNotes}
                      onChange={(e) => setMedicationNotes(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="Additional instructions or information"
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={closeModal}
                      className="mr-2"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      onClick={handleSubmitMedication}
                      disabled={!medicationName || !medicationDosage || !medicationFrequency || !medicationStartDate}
                    >
                      Save Medication
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default HealthTrackerPage;