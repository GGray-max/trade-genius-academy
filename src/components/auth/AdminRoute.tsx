
import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '../ui/LoadingScreen';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAdmin, loading, refreshUserProfile, user } = useAuth();

  useEffect(() => {
    // When the component mounts, refresh the user profile to ensure we have the latest role
    if (user && !loading) {
      refreshUserProfile();
    }
  }, []);

  if (loading) {
    return (
      <LoadingScreen message="Verifying administrator access..." />
    );
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
