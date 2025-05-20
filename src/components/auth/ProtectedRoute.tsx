
import { ReactNode, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '../ui/LoadingScreen';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, profile, loading } = useAuth();
  const [showLoading, setShowLoading] = useState(true);
  
  // Set a maximum time to show the loading screen
  useEffect(() => {
    // Only show loading screen for a fixed period to prevent indefinite loading
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 800); // Shorter timeout for better UX
    
    return () => clearTimeout(timer);
  }, []);

  // If auth is still loading and within the time limit, show loading screen
  if (loading && showLoading) {
    return <LoadingScreen message="Preparing your dashboard..." />;
  }
  
  // If authentication has failed, redirect to login
  if (!user || !profile) {
    return <Navigate to="/login" replace />;
  }

  // Authentication succeeded, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
