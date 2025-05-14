
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateBot from "./pages/CreateBot";
import BotRequests from "./pages/BotRequests";
import RequestBot from "./pages/RequestBot";
import AdminBotManagement from "./pages/AdminBotManagement";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import Analytics from "./pages/Analytics";
import BotAuditing from "./pages/BotAuditing";

// New page imports
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Docs from "./pages/Docs";
import TrendingBots from "./pages/marketplace/TrendingBots";
import Leaderboard from "./pages/marketplace/Leaderboard";
import NewReleases from "./pages/marketplace/NewReleases";
import Settings from "./pages/Settings";

// Create a new QueryClient instance inside the component
const App = () => {
  // Create a new QueryClient instance inside the component to ensure React context is properly set up
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 30000,
      },
    },
  });
  
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* New routes */}
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/marketplace/trending" element={<TrendingBots />} />
              <Route path="/marketplace/leaderboard" element={<Leaderboard />} />
              <Route path="/marketplace/new" element={<NewReleases />} />
              
              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/bot-requests"
                element={
                  <ProtectedRoute>
                    <BotRequests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/request-bot"
                element={
                  <ProtectedRoute>
                    <RequestBot />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              
              {/* Admin routes */}
              <Route
                path="/dashboard/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/dashboard/bots/create"
                element={
                  <AdminRoute>
                    <CreateBot />
                  </AdminRoute>
                }
              />
              <Route
                path="/dashboard/admin/bot-management"
                element={
                  <AdminRoute>
                    <AdminBotManagement />
                  </AdminRoute>
                }
              />
              <Route
                path="/dashboard/audit"
                element={
                  <AdminRoute>
                    <BotAuditing />
                  </AdminRoute>
                }
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
