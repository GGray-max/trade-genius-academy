import { useAuth } from "@/contexts/AuthContext";
import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { api } from "@/lib/api";
import LoadingScreen from "../ui/LoadingScreen";

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAdmin, loading, refreshUserProfile, user } = useAuth();

  useEffect(() => {
    if (user && refreshUserProfile) {
      // Refresh user profile to ensure admin status is up to date
      refreshUserProfile().catch((error) => {
        console.error('Failed to refresh user profile:', error);
      });
    }
  }, [user, refreshUserProfile]);

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