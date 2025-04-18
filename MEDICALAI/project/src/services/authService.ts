// This is a mock implementation of authentication
// In a real app, this would connect to Firebase or another auth service

let currentUser: any = null;
let verificationId: string = '';
let authObservers: Array<(user: any) => void> = [];

// Helper to notify all observers
const notifyObservers = (user: any) => {
  authObservers.forEach(observer => observer(user));
};

// Mock Google Sign In
export const signInWithGoogle = async (): Promise<any> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock user data
  currentUser = {
    uid: 'google-user-123',
    displayName: 'Test User',
    email: 'testuser@example.com',
    photoURL: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    phoneNumber: null,
    address: 'New Delhi, India'
  };
  
  notifyObservers(currentUser);
  return currentUser;
};

// Mock Phone Sign In (Step 1)
export const signInWithPhone = async (phoneNumber: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if it's a valid phone number format (simple check)
  if (!/^\+?[0-9]{10,12}$/.test(phoneNumber)) {
    throw new Error('Invalid phone number format');
  }
  
  // In a real app, this would call Firebase's verifyPhoneNumber
  verificationId = 'mock-verification-id-' + Math.random().toString(36).substring(2, 8);
  
  // For demo, we'll just return the verification ID
  return verificationId;
};

// Mock OTP Verification (Step 2)
export const verifyOtp = async (otp: string): Promise<any> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Validate OTP format
  if (!/^[0-9]{6}$/.test(otp)) {
    throw new Error('Invalid OTP format');
  }
  
  // For demo, we'll accept any 6-digit OTP
  currentUser = {
    uid: 'phone-user-' + Math.random().toString(36).substring(2, 8),
    displayName: 'Phone User',
    email: null,
    photoURL: null,
    phoneNumber: '+91xxxxxxxxxx',
    address: 'Mumbai, India'
  };
  
  notifyObservers(currentUser);
  return currentUser;
};

// Sign Out
export const signOut = async (): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  currentUser = null;
  notifyObservers(null);
};

// Get Current User (with observer)
export const getCurrentUser = (observer: (user: any) => void): (() => void) => {
  // Add the observer
  authObservers.push(observer);
  
  // Immediately notify with current state
  observer(currentUser);
  
  // Return function to unsubscribe
  return () => {
    authObservers = authObservers.filter(obs => obs !== observer);
  };
};

// Update User Profile
export const updateUserProfile = async (
  uid: string, 
  userData: {
    displayName?: string;
    photoURL?: string;
    email?: string;
    address?: string;
    phone?: string;
  }
): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (!currentUser || currentUser.uid !== uid) {
    throw new Error('User not authenticated');
  }
  
  // Update user data
  currentUser = { ...currentUser, ...userData };
  notifyObservers(currentUser);
};