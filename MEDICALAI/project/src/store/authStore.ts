import { create } from 'zustand';
import { 
  signInWithGoogle, 
  signInWithPhone, 
  verifyOtp, 
  signOut as firebaseSignOut,
  getCurrentUser,
  updateUserProfile
} from '../services/authService';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  
  // Auth actions
  signInWithGoogle: () => Promise<void>;
  signInWithPhone: (phoneNumber: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  signOut: () => Promise<void>;
  checkAuthStatus: () => void;
  
  // User profile actions
  updateProfile: (userData: {
    displayName?: string;
    photoURL?: string;
    email?: string;
    address?: string;
    phone?: string;
  }) => Promise<void>;
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  
  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      const user = await signInWithGoogle();
      set({ user, isAuthenticated: !!user, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  signInWithPhone: async (phoneNumber: string) => {
    try {
      set({ loading: true, error: null });
      await signInWithPhone(phoneNumber);
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  verifyOtp: async (otp: string) => {
    try {
      set({ loading: true, error: null });
      const user = await verifyOtp(otp);
      set({ user, isAuthenticated: !!user, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  signOut: async () => {
    try {
      set({ loading: true, error: null });
      await firebaseSignOut();
      set({ user: null, isAuthenticated: false, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  checkAuthStatus: () => {
    set({ loading: true });
    
    const unsubscribe = getCurrentUser((user) => {
      set({ 
        user, 
        isAuthenticated: !!user, 
        loading: false 
      });
    });
    
    return unsubscribe;
  },
  
  updateProfile: async (userData) => {
    try {
      set({ loading: true, error: null });
      
      const { user } = get();
      if (!user) throw new Error('User not authenticated');
      
      await updateUserProfile(user.uid, userData);
      
      set({ 
        user: { ...user, ...userData },
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
  
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
}));