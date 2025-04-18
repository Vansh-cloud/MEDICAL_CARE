import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Plus, X, AlertCircle, CheckCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import Button from '../components/common/Button';
import { analyzeSymptoms, getHealthRecommendations } from '../services/diagnosisService';

// List of common symptoms for the UI
const commonSymptoms = [
  'Headache', 'Fever', 'Cough', 'Sore Throat', 'Fatigue',
  'Chest Pain', 'Shortness of Breath', 'Nausea', 'Dizziness',
  'Abdominal Pain', 'Back Pain', 'Joint Pain', 'Rash', 'Blurred Vision'
];

const DiagnosisPage: React.FC = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [diagnosisResults, setDiagnosisResults] = useState<any | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  
  const handleSymptomSelect = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(prev => prev.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms(prev => [...prev, symptom]);
    }
  };
  
  const handleAddCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms(prev => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };
  
  const handleDiagnosis = async () => {
    if (selectedSymptoms.length === 0) return;
    
    setLoading(true);
    setDiagnosisResults(null);
    setRecommendations([]);
    setFeedback(null);
    
    try {
      // Call the diagnosis service
      const results = await analyzeSymptoms(selectedSymptoms);
      setDiagnosisResults(results);
      
      // Get health recommendations based on possible conditions
      const conditions = results.diagnosisResults.map((r: any) => r.condition);
      const healthRecommendations = await getHealthRecommendations(conditions);
      setRecommendations(healthRecommendations);
    } catch (error) {
      console.error('Error during diagnosis:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    setSelectedSymptoms([]);
    setDiagnosisResults(null);
    setRecommendations([]);
    setFeedback(null);
  };
  
  const submitFeedback = (type: 'positive' | 'negative') => {
    setFeedback(type);
    // In a real app, this would send feedback to the server
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <Activity size={24} className="text-primary-500 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">AI Symptom Checker</h1>
              </div>
              
              {selectedSymptoms.length > 0 && !diagnosisResults && (
                <div className="mt-4 md:mt-0">
                  <Button
                    variant="primary"
                    onClick={handleDiagnosis}
                    isLoading={loading}
                  >
                    Analyze Symptoms
                  </Button>
                </div>
              )}
              
              {diagnosisResults && (
                <div className="mt-4 md:mt-0">
                  <Button variant="outline" onClick={handleReset}>
                    Start New Analysis
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
          
          {!diagnosisResults ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Select Your Symptoms
              </h2>
              
              <div className="mb-6">
                <label htmlFor="customSymptom" className="block text-sm font-medium text-gray-700 mb-2">
                  Add a custom symptom
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="customSymptom"
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                    className="flex-grow rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Enter symptom"
                  />
                  <Button
                    variant="primary"
                    className="rounded-l-none"
                    onClick={handleAddCustomSymptom}
                    leftIcon={<Plus size={16} />}
                  >
                    Add
                  </Button>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Common symptoms</h3>
                <div className="flex flex-wrap gap-2">
                  {commonSymptoms.map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => handleSymptomSelect(symptom)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedSymptoms.includes(symptom)
                          ? 'bg-primary-100 text-primary-800 hover:bg-primary-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {symptom}
                      {selectedSymptoms.includes(symptom) && (
                        <CheckCircle size={14} className="ml-1 text-primary-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {selectedSymptoms.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Selected symptoms</h3>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map((symptom) => (
                        <span
                          key={symptom}
                          className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                        >
                          {symptom}
                          <button
                            onClick={() => handleSymptomSelect(symptom)}
                            className="ml-1 focus:outline-none"
                          >
                            <X size={14} className="text-primary-600 hover:text-primary-800" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={handleDiagnosis}
                      isLoading={loading}
                      leftIcon={<Activity size={18} />}
                    >
                      Analyze Symptoms
                    </Button>
                  </div>
                </div>
              )}
              
              {selectedSymptoms.length === 0 && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full mb-4">
                    <Activity size={24} className="text-primary-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select at least one symptom
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Choose from the common symptoms above or add your own to get an AI-powered analysis.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Diagnosis Results */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Diagnosis Results
                </h2>
                
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
                  <div className="flex">
                    <AlertCircle size={20} className="text-amber-500 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm text-amber-700">
                        {diagnosisResults.disclaimer}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {diagnosisResults.diagnosisResults.map((result: any, index: number) => (
                    <div 
                      key={index} 
                      className={`p-4 border rounded-md ${
                        index === 0 ? 'border-primary-300 bg-primary-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900">{result.condition}</h3>
                        <div className="ml-2 px-2 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
                          {result.confidence}% match
                        </div>
                      </div>
                      
                      <p className="mt-2 text-gray-600 text-sm">{result.description}</p>
                      
                      <div className="mt-3 flex items-center">
                        <div className="flex-shrink-0">
                          <AlertCircle size={16} className={result.confidence > 70 ? "text-amber-500" : "text-gray-400"} />
                        </div>
                        <p className="ml-2 text-sm text-gray-700">{result.recommendedAction}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {!feedback && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h3 className="text-sm font-medium text-gray-700">Was this diagnosis helpful?</h3>
                    <div className="mt-2 flex space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<ThumbsUp size={16} />}
                        onClick={() => submitFeedback('positive')}
                      >
                        Yes, it was helpful
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<ThumbsDown size={16} />}
                        onClick={() => submitFeedback('negative')}
                      >
                        No, not accurate
                      </Button>
                    </div>
                  </div>
                )}
                
                {feedback && (
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <div className="flex items-center text-green-600">
                      <CheckCircle size={18} className="mr-2" />
                      <span>Thank you for your feedback! We'll use it to improve our system.</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Health Recommendations
                  </h2>
                  <ul className="space-y-2">
                    {recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Next steps */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Next Steps
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-md p-4 hover:border-primary-300 hover:shadow-sm transition-all">
                    <h3 className="font-medium text-gray-900 mb-2">Consult a Doctor</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Speak with a healthcare professional for an accurate diagnosis and treatment plan.
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      as="a"
                      href="/doctors"
                    >
                      Find a Doctor
                    </Button>
                  </div>
                  
                  <div className="border border-gray-200 rounded-md p-4 hover:border-primary-300 hover:shadow-sm transition-all">
                    <h3 className="font-medium text-gray-900 mb-2">Track Your Health</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Monitor your symptoms and vital signs to share with your healthcare provider.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      as="a"
                      href="/health-tracker"
                    >
                      Go to Health Tracker
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DiagnosisPage;