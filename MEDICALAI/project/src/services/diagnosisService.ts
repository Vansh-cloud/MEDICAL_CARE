// Mock service for medical diagnosis using "AI"

// Mock symptom analysis function
export const analyzeSymptoms = async (symptoms: string[]): Promise<any> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Common symptom to condition mapping (very simplified)
  const conditionsMap: Record<string, string[]> = {
    'headache': ['Migraine', 'Tension Headache', 'Sinusitis'],
    'fever': ['Common Cold', 'Flu', 'COVID-19', 'Infection'],
    'cough': ['Common Cold', 'Bronchitis', 'COVID-19', 'Asthma'],
    'sore throat': ['Pharyngitis', 'Tonsillitis', 'Strep Throat'],
    'fatigue': ['Anemia', 'Sleep Disorder', 'Chronic Fatigue Syndrome', 'Depression'],
    'chest pain': ['Angina', 'Heart Attack', 'Gastroesophageal Reflux', 'Costochondritis'],
    'shortness of breath': ['Asthma', 'Anxiety', 'Heart Failure', 'Pulmonary Embolism'],
    'nausea': ['Food Poisoning', 'Gastritis', 'Migraine', 'Vertigo'],
    'dizziness': ['Vertigo', 'Low Blood Pressure', 'Anemia', 'Inner Ear Infection'],
    'abdominal pain': ['Gastritis', 'Appendicitis', 'Irritable Bowel Syndrome', 'Food Poisoning'],
    'back pain': ['Muscle Strain', 'Herniated Disc', 'Sciatica', 'Kidney Infection'],
    'joint pain': ['Arthritis', 'Gout', 'Lupus', 'Lyme Disease'],
    'rash': ['Eczema', 'Psoriasis', 'Allergic Reaction', 'Chicken Pox'],
    'blurred vision': ['Migraine', 'Cataracts', 'Glaucoma', 'Diabetic Retinopathy']
  };
  
  // Find potential conditions based on symptoms
  let potentialConditions: string[] = [];
  let matchConfidence: Record<string, number> = {};
  
  // For each symptom
  symptoms.forEach(symptom => {
    const matchingConditions = conditionsMap[symptom.toLowerCase()] || [];
    
    matchingConditions.forEach(condition => {
      if (!potentialConditions.includes(condition)) {
        potentialConditions.push(condition);
      }
      
      // Increase confidence for this condition
      matchConfidence[condition] = (matchConfidence[condition] || 0) + 1;
    });
  });
  
  // Sort by confidence
  potentialConditions.sort((a, b) => matchConfidence[b] - matchConfidence[a]);
  
  // Calculate percentage confidence
  const totalSymptoms = symptoms.length;
  
  const result = potentialConditions.map(condition => ({
    condition,
    confidence: Math.min(Math.round((matchConfidence[condition] / totalSymptoms) * 100), 95),
    description: getConditionDescription(condition),
    recommendedAction: getRecommendedAction(condition, matchConfidence[condition] / totalSymptoms)
  }));
  
  return {
    diagnosisResults: result,
    disclaimer: "This is an AI-generated suggestion and not a substitute for professional medical advice. Please consult a healthcare provider for accurate diagnosis and treatment."
  };
};

// Helper function to get condition descriptions
function getConditionDescription(condition: string): string {
  const descriptions: Record<string, string> = {
    'Migraine': 'A neurological condition characterized by severe, recurring headaches, often with nausea and sensitivity to light and sound.',
    'Tension Headache': 'A common type of headache characterized by mild to moderate pain, often described as feeling like a tight band around the head.',
    'Sinusitis': 'Inflammation of the sinus cavities, often caused by infection, resulting in headache, congestion, and facial pressure.',
    'Common Cold': 'A viral infection of the upper respiratory tract causing symptoms such as sore throat, congestion, cough, and mild fever.',
    'Flu': 'A viral infection causing fever, body aches, fatigue, and respiratory symptoms, generally more severe than a common cold.',
    'COVID-19': 'A respiratory illness caused by the SARS-CoV-2 virus, with symptoms ranging from mild to severe, including fever, cough, and shortness of breath.',
    'Bronchitis': 'Inflammation of the bronchial tubes that carry air to the lungs, causing cough, mucus production, and chest discomfort.',
    'Asthma': 'A chronic condition characterized by inflammation of the airways, causing episodes of wheezing, shortness of breath, chest tightness, and coughing.',
    // Add more as needed
  };
  
  return descriptions[condition] || 'A medical condition requiring professional assessment.';
}

// Helper function to get recommended actions
function getRecommendedAction(condition: string, confidenceRatio: number): string {
  // High confidence conditions requiring immediate attention
  const emergencyConditions = ['Heart Attack', 'Pulmonary Embolism', 'Stroke', 'Appendicitis'];
  
  if (emergencyConditions.includes(condition)) {
    return 'Seek emergency medical attention immediately.';
  }
  
  if (confidenceRatio > 0.7) {
    return 'Schedule an appointment with a doctor in the next few days.';
  } else if (confidenceRatio > 0.4) {
    return 'Consider consulting with a healthcare provider if symptoms persist or worsen.';
  } else {
    return 'Monitor symptoms and practice self-care. Consult a doctor if symptoms worsen.';
  }
}

// Get health recommendations based on diagnosis
export const getHealthRecommendations = async (conditions: string[]): Promise<string[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // General recommendations based on conditions
  const recommendations: string[] = [
    'Maintain a balanced diet rich in fruits, vegetables, and whole grains',
    'Stay hydrated by drinking plenty of water throughout the day',
    'Ensure adequate rest and sleep each night (7-9 hours for adults)',
    'Practice stress management techniques like meditation or deep breathing',
  ];
  
  // Add condition-specific recommendations
  if (conditions.some(c => ['Migraine', 'Tension Headache'].includes(c))) {
    recommendations.push('Identify and avoid personal headache triggers');
    recommendations.push('Practice relaxation techniques when feeling the onset of a headache');
  }
  
  if (conditions.some(c => ['Common Cold', 'Flu', 'COVID-19'].includes(c))) {
    recommendations.push('Rest and isolate yourself to prevent spreading infection');
    recommendations.push('Increase vitamin C intake and stay well-hydrated');
  }
  
  if (conditions.some(c => ['Asthma', 'Bronchitis'].includes(c))) {
    recommendations.push('Avoid known respiratory irritants like smoke and strong perfumes');
    recommendations.push('Use air purifiers in your home, especially in the bedroom');
  }
  
  return recommendations;
}