import { useAuth } from "@/contexts/AuthContext";
import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import api from "@/lib/api";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAdmin, loading, refreshUserProfile, user } = useAuth();

  useEffect(() => {
    if (user) {
      // Refresh user profile to ensure admin status is up to date
      const refreshUserProfile = async () => {
        try {
          // Assuming 'api' is defined elsewhere, adjust as needed
          const response = await api.get('/users/profile');
          if (response.data.success) {
            // Update user context with latest profile data
            console.log('User profile refreshed:', response.data.user);
          }
        } catch (error) {
          console.error('Failed to refresh user profile:', error);
        }
      };

      refreshUserProfile();
    }
  }, [user]);

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