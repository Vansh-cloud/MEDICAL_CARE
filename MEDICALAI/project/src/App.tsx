import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoadingScreen from './components/common/LoadingScreen';

// Lazy load pages for better performance
const AuthPage = lazy(() => import('./pages/AuthPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const DoctorsListPage = lazy(() => import('./pages/DoctorsListPage'));
const DoctorProfilePage = lazy(() => import('./pages/DoctorProfilePage'));
const AppointmentsPage = lazy(() => import('./pages/AppointmentsPage'));
const DiagnosisPage = lazy(() => import('./pages/DiagnosisPage'));
const HealthTrackerPage = lazy(() => import('./pages/HealthTrackerPage'));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'));
const TelemedPage = lazy(() => import('./pages/TelemedPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// PrivateRoute component to handle authentication
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

function App() {
  const { checkAuthStatus } = useAuthStore();

  useEffect(() => {
    // Check if user is already logged in
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
        <Route path="/doctors" element={
          <PrivateRoute>
            <DoctorsListPage />
          </PrivateRoute>
        } />
        <Route path="/doctors/:id" element={
          <PrivateRoute>
            <DoctorProfilePage />
          </PrivateRoute>
        } />
        <Route path="/appointments" element={
          <PrivateRoute>
            <AppointmentsPage />
          </PrivateRoute>
        } />
        <Route path="/diagnosis" element={
          <PrivateRoute>
            <DiagnosisPage />
          </PrivateRoute>
        } />
        <Route path="/health-tracker" element={
          <PrivateRoute>
            <HealthTrackerPage />
          </PrivateRoute>
        } />
        <Route path="/documents" element={
          <PrivateRoute>
            <DocumentsPage />
          </PrivateRoute>
        } />
        <Route path="/telemedicine/:id?" element={
          <PrivateRoute>
            <TelemedPage />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        } />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
}

export default App;