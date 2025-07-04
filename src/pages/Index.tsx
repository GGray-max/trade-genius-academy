
import MainLayout from "@/components/layout/MainLayout";
import LoggedInHome from "@/components/home/LoggedInHome";
import LoggedOutLanding from "@/components/home/LoggedOutLanding";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <MainLayout>
        {/* TODO: Replace with skeleton loader */}
        <div className="flex items-center justify-center py-32 text-gray-500">
          Loading...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout hideFooter={!!user}>
      {user ? <LoggedInHome user={user} /> : <LoggedOutLanding />}
    </MainLayout>
  );
};

export default Index;
