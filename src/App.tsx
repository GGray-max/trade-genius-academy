import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Marketplace from "./pages/Marketplace";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CreateBot from "./pages/CreateBot";
import BotRequests from "./pages/BotRequests";
import RequestBot from "./pages/RequestBot";
import AdminBotManagement from "./pages/AdminBotManagement";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import Analytics from "./pages/Analytics";
import Backtest from "./pages/Backtest";
import BotAuditing from "./pages/BotAuditing";
import MyBots from "./pages/MyBots";
import BotDetails from "./pages/BotDetails";
import BotBuilder from "./pages/BotBuilder";
import AiLab from "./pages/AiLab";

// New page imports
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Docs from "./pages/Docs";
import TrendingBots from "./pages/marketplace/TrendingBots";
import Leaderboard from "./pages/marketplace/Leaderboard";
import NewReleases from "./pages/marketplace/NewReleases";
import Settings from "./pages/Settings";
import Builder from "./pages/Builder";
import Sandbox from "./pages/Sandbox";
import Signals from "./pages/Signals";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import TestSession from "./pages/TestSession";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { GlobalErrorBoundary } from "./components/ui/GlobalErrorBoundary";

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
    <GlobalErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* New routes */}
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/docs" element={<Docs />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/marketplace/trending" element={<TrendingBots />} />
              <Route path="/marketplace/leaderboard" element={<Leaderboard />} />
              <Route path="/marketplace/new" element={<NewReleases />} />
              <Route path="/bots/:botId" element={<BotDetails />} />

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
                path="/dashboard/my-bots"
                element={
                  <ProtectedRoute>
                    <MyBots />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/bot-builder"
                element={
                  <ProtectedRoute>
                    <BotBuilder />
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
              <Route
                path="/dashboard/backtest"
                element={
                  <ProtectedRoute>
                    <Backtest />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/users"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
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

              {/* AI Lab protected route */}
              <Route
                path="/ai-lab"
                element={
                  <ProtectedRoute>
                    <AiLab />
                  </ProtectedRoute>
                }
              />

              {/* New placeholder routes */}
              <Route path="/builder" element={<Builder />} />
              <Route path="/sandbox" element={<Sandbox />} />
              <Route path="/signals" element={<Signals />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />

              {/* Debug route for session testing */}
              <Route path="/test-session" element={<TestSession />} />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </GlobalErrorBoundary>
  );
};

export default App;