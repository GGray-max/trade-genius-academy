import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { LogIn, Eye, EyeOff, Loader2 } from "lucide-react";

import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from '@/contexts/AuthContext';
import { getTokenKey } from '@/lib/supabase';

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, profile, signIn, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Reset loading state if auth context is not loading
  useEffect(() => {
    if (!authLoading) {
      setIsLoading(false);
    }
  }, [authLoading]);

  // IMPORTANT: Don't navigate here - let the AuthContext handle the navigation
  // This prevents navigation loops that cause browser throttling
  useEffect(() => {
    // Handle case where user is already logged in (with timeout protection)
    if (user && profile) {
      console.log('User already logged in, AuthContext will handle navigation');
      navigate('/dashboard');
    } else if (authLoading) {
      // Add timeout protection to prevent UI getting stuck in loading state
      const timer = setTimeout(() => {
        console.log('Auth loading timeout reached, resetting loading state');
        setIsLoading(false);
      }, 3000); // 3 second timeout

      return () => clearTimeout(timer);
    }
  }, [user, profile, navigate, authLoading]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Login form submitted with:', values.email);

    // Prevent multiple submissions
    if (isLoading) {
      console.log('Already submitting login form, ignoring duplicate submission');
      return; 
    }

    // Set a timeout to prevent the login getting stuck indefinitely
    const loginTimeout = setTimeout(() => {
      console.log('Login timeout reached - forcing reset of loading state');
      setIsLoading(false);
      toast.error('Login timed out. Please try again.');
    }, 10000); // 10 second timeout

    setIsLoading(true);
    try {
      console.log('Calling signIn function...');

      // Clear any existing session tokens with the correct token key
      const tokenKey = getTokenKey();
      console.log(`Clearing existing token (${tokenKey})`);
      localStorage.removeItem(tokenKey);

      // Wait a moment to ensure the token clear takes effect
      await new Promise(resolve => setTimeout(resolve, 100));

      // Now attempt to sign in
      await signIn(values.email, values.password);

      console.log('signIn function completed successfully');
      // Auth context will handle the navigation
    } catch (error) {
      console.error('Login error caught in form submit:', error);
      toast.error('Login failed. Please try again.');
      form.reset({ email: values.email, password: "" });
    } finally {
      // Always reset loading state and clear the timeout
      clearTimeout(loginTimeout);
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Don't block the entire login page while auth is initializing
  // This allows users to see and interact with the login form immediately

  return (
    <MainLayout hideFooter>
      <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your TradeWizard account
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
              <div className="space-y-4 rounded-md shadow-sm">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="you@example.com" 
                          type="email"
                          disabled={isLoading}
                          autoComplete="email"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="Your password" 
                            type={showPassword ? "text" : "password"}
                            disabled={isLoading}
                            autoComplete="current-password"
                            {...field} 
                          />
                          <button 
                            type="button"
                            onClick={toggleShowPassword}
                            disabled={isLoading}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-500" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link 
                    to="/forgot-password" 
                    className="font-medium text-tw-blue hover:text-tw-blue-dark"
                    tabIndex={isLoading ? -1 : 0}
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit" 
                className="w-full bg-tw-blue hover:bg-tw-blue-dark"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign in
                  </>
                )}
              </Button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link 
                    to="/signup" 
                    className="font-medium text-tw-blue hover:text-tw-blue-dark"
                    tabIndex={isLoading ? -1 : 0}
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </MainLayout>
  );
};

export default Login;