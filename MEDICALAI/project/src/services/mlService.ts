import * as tf from '@tensorflow/tfjs';

// Load the pre-trained model
let model: tf.LayersModel | null = null;

export const loadModel = async () => {
  try {
    // Replace with your model URL
    model = await tf.loadLayersModel('https://your-model-url/model.json');
    return true;
  } catch (error) {
    console.error('Error loading model:', error);
    return false;
  }
};

export const predictSymptoms = async (symptoms: number[]) => {
  if (!model) {
    throw new Error('Model not loaded');
  }

  try {
    // Preprocess input
    const inputTensor = tf.tensor2d([symptoms]);
    
    // Make prediction
    const prediction = await model.predict(inputTensor) as tf.Tensor;
    const results = Array.from(prediction.dataSync());
    
    // Cleanup
    inputTensor.dispose();
    prediction.dispose();
    
    return results;
  } catch (error) {
    console.error('Error making prediction:', error);
    throw error;
  }
};

// Convert symptoms to numerical format
export const preprocessSymptoms = (symptoms: string[]): number[] => {
  // This should match your model's input requirements
  const symptomMap: Record<string, number> = {
    'fever': 1,
    'cough': 2,
    'fatigue': 3,
    'difficulty_breathing': 4,
    'headache': 5,
    // Add more symptoms as needed
  };
  
  return symptoms.map(symptom => symptomMap[symptom] || 0);
};

// Convert prediction results to readable format
export const interpretResults = (results: number[]): string[] => {
  const conditions = [
    'Common Cold',
    'Flu',
    'COVID-19',
    'Allergies',
    'Bronchitis'
    // Add more conditions as needed
  ];
  
  // Get top 3 predictions
  const predictions = results
    .map((prob, idx) => ({ prob, condition: conditions[idx] }))
    .sort((a, b) => b.prob - a.prob)
    .slice(0, 3);
  
  return predictions.map(p => `${p.condition} (${(p.prob * 100).toFixed(1)}%)`);
};