import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, debugSession, refreshSession, getTokenKey } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

// Define the auth context type
type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

// Define the user profile type
export type UserProfile = {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  avatar_url?: string;
  created_at: string;
};

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Public pages that don't require authentication
  const publicPages = ['/', '/login', '/signup', '/features', '/pricing', '/docs', '/marketplace'];

  // Fetch user profile from the database
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error.message);
        return null;
      }
      
      return data as UserProfile;
    } catch (error) {
      console.error('Exception fetching profile:', error);
      return null;
    }
  };

  // Reset auth state
  const resetAuthState = () => {
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
  };

  // Refresh the current session
  const refreshSession = async () => {
    try {
      setLoading(true);
      
      // Check for an existing session
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        resetAuthState();
        return;
      }
      
      // Update user state
      setUser(data.session.user);
      
      // Fetch and update profile
      const profile = await fetchUserProfile(data.session.user.id);
      if (profile) {
        setProfile(profile);
        setIsAdmin(profile.role === 'admin');
      } else {
        resetAuthState();
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      resetAuthState();
    } finally {
      setLoading(false);
    }
  };

  // Initialize auth state on component mount
  useEffect(() => {
    console.log('§§§§§§§§§§ AUTH PROVIDER MOUNTED §§§§§§§§§§');
    let isMounted = true;

    // CRITICAL: Function to load the user session with improved reliability
    const initializeAuth = async () => {
      try {
        console.log('========== INITIALIZING AUTH STATE ==========');
        setLoading(true);
        
        // First check if we have a token in localStorage
        const tokenKey = getTokenKey();
        const tokenData = localStorage.getItem(tokenKey);
        console.log(`Checking for token in localStorage (${tokenKey}):`, !!tokenData);
        
        if (!tokenData) {
          console.log('No token found in localStorage');
          resetAuthState();
          setLoading(false);
          return;
        }
        
        // We have a token, so let's debug the session
        await debugSession();
        
        // Force refresh the session first to ensure it's valid
        console.log('Force refreshing session...');
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        // Check for refresh errors
        if (refreshError) {
          console.error('Error refreshing session:', refreshError.message);
          resetAuthState();
          setLoading(false);
          return;
        }
        
        // If we got a session back from the refresh, use it
        if (refreshData.session) {
          console.log('Session successfully refreshed!');
          console.log('User:', refreshData.session.user.email);
          console.log('Session expires at:', new Date(refreshData.session.expires_at * 1000).toLocaleString());
          
          if (!isMounted) return;
          
          // Set the user state
          setUser(refreshData.session.user);
          
          // Get user profile data
          console.log('Fetching user profile after refresh...');
          const userProfile = await fetchUserProfile(refreshData.session.user.id);
          
          if (!isMounted) return;
          
          if (userProfile) {
            // Set profile data
            console.log('Profile found after refresh:', userProfile.username);
            setProfile(userProfile);
            setIsAdmin(userProfile.role === 'admin');
            
            // If the user is on the login page, redirect to dashboard
            if (location.pathname === '/login') {
              console.log('User already authenticated, redirecting to dashboard');
              navigate('/dashboard');
            }
            
            // Success! Session restored
            console.log('Session successfully restored');
          } else {
            console.error('No profile found for authenticated user after refresh');
            resetAuthState();
          }
          
          // Session is valid, exit early
          if (isMounted) setLoading(false);
          return;
        }
        
        // If refresh didn't work, try getSession as fallback
        console.log('Falling back to getSession...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
          console.error('Could not get session:', error?.message || 'No session found');
          resetAuthState();
          if (isMounted) setLoading(false);
          return;
        }
        
        // We have a valid session
        console.log('Valid session found with getSession:', data.session.user.email);
        
        if (isMounted) {
          setUser(data.session.user);
          
          // Get user profile
          console.log('Fetching user profile...');
          const userProfile = await fetchUserProfile(data.session.user.id);
          
          if (!isMounted) return;
          
          if (userProfile) {
            console.log('Profile found:', userProfile.username);
            setProfile(userProfile);
            setIsAdmin(userProfile.role === 'admin');
            
            // If user is on login page, redirect to dashboard
            if (location.pathname === '/login') {
              console.log('User already authenticated, redirecting to dashboard');
              navigate('/dashboard');
            }
          } else {
            console.error('No profile found for authenticated user');
            resetAuthState();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) resetAuthState();
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Initialize immediately
    initializeAuth();

    // Clean up on unmount
    return () => {
      console.log('Auth provider unmounting');
      isMounted = false;
    };
  }, [navigate, location.pathname]); // Only run on initial mount

  // Set up auth state change listener separately to avoid conflicts
  useEffect(() => {
    console.log('Setting up auth state change listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`Auth state changed: ${event}`, session ? `User: ${session.user.email}` : 'No session');
      
      if (event === 'SIGNED_IN' && session) {
        console.log('*** SIGN IN EVENT DETECTED ***');
        setUser(session.user);
        
        try {
          // Always fetch profile when signed in
          setLoading(true);
          const userProfile = await fetchUserProfile(session.user.id);
          
          if (userProfile) {
            console.log('Profile loaded in auth listener:', userProfile.username);
            setProfile(userProfile);
            setIsAdmin(userProfile.role === 'admin');
            
            // Only redirect if on login page
            if (location.pathname === '/login') {
              console.log('Redirecting to dashboard after successful sign in');
              navigate('/dashboard');
            }
          } else {
            console.error('No profile found after sign in event');
            resetAuthState();
            toast.error('Failed to load user profile');
          }
        } catch (error) {
          console.error('Error processing sign in event:', error);
          resetAuthState();
        } finally {
          setLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('*** SIGN OUT EVENT DETECTED ***');
        resetAuthState();
        
        // Only redirect if on a protected page
        if (!publicPages.includes(location.pathname)) {
          navigate('/login');
        }
      }
    });
    
    return () => {
      console.log('Unsubscribing from auth state changes');
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname, publicPages]);

  // Sign in user with guaranteed session persistence
  const signIn = async (email: string, password: string) => {
    try {
      console.log('⚡⚡⚡ SIGN IN ATTEMPT ⚡⚡⚡');
      console.log('Email:', email);
      setLoading(true);
      
      // Make sure we start with a clean state
      resetAuthState();
      
      // CRITICAL: First sign out completely to avoid conflicts
      // This is necessary to ensure we're starting with a clean slate
      console.log('Clearing any existing sessions...');
      await supabase.auth.signOut({ scope: 'global' });
      
      // Wait briefly to ensure signout completes
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Now attempt the sign in
      console.log('Making auth request to Supabase...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Supabase auth error:', error);
        throw error;
      }
      
      if (!data.user || !data.session) {
        console.error('Missing user or session data from Supabase');
        throw new Error('Login failed: missing user data');
      }
      
      console.log('Authentication successful!');
      console.log('User:', data.user.email);
      console.log('Session expires at:', new Date(data.session.expires_at * 1000).toLocaleString());
      
      // CRITICAL: Check if token was properly stored in localStorage
      // This is the key to fixing the session persistence issue
      const tokenKey = getTokenKey();
      const savedToken = localStorage.getItem(tokenKey);
      
      if (!savedToken) {
        // If token is missing, explicitly set it
        console.log('Token not found in localStorage, manually storing it');
        try {
          const tokenData = {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at
          };
          localStorage.setItem(tokenKey, JSON.stringify(tokenData));
        } catch (e) {
          console.error('Failed to manually set token:', e);
        }
      } else {
        console.log('Token verified in localStorage');
      }
      
      // Set user data in state
      setUser(data.user);
      
      // Fetch user profile data
      console.log('Fetching user profile...');
      const userProfile = await fetchUserProfile(data.user.id);
      
      if (!userProfile) {
        console.error('Could not find user profile after login');
        throw new Error('Could not find user profile');
      }
      
      // Set profile data
      console.log('Setting profile data:', userProfile.username);
      setProfile(userProfile);
      setIsAdmin(userProfile.role === 'admin');
      
      // Double-check session persistence
      const sessionCheck = await supabase.auth.getSession();
      console.log('Session verification:', sessionCheck.data.session ? 'Valid' : 'Missing');
      
      // Show success message and redirect
      toast.success('Logged in successfully');
      console.log('Navigating to dashboard...');
      navigate('/dashboard');
      console.log('⚡ LOGIN COMPLETE ⚡');
      
    } catch (error: any) {
      console.error('Login process failed:', error.message || 'Unknown error');
      resetAuthState();
      toast.error(error.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  // Sign up user
  const signUp = async (email: string, password: string, username: string) => {
    try {
      setLoading(true);
      
      // Create auth account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });
      
      if (error) throw error;
      
      if (!data.user) {
        throw new Error('No user returned from signup');
      }
      
      // Create profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            username,
            email,
            role: 'user',
            created_at: new Date().toISOString()
          }
        ]);
      
      if (profileError) throw profileError;
      
      toast.success('Account created successfully!');
      navigate('/login');
    } catch (error: any) {
      console.error('Signup error:', error.message);
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out user with improved reliability
  const signOut = async () => {
    try {
      console.log('Signing out user...');
      setLoading(true);
      
      // Execute the sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase sign out error:', error.message);
        throw error;
      }
      
      // Reset auth state regardless of response
      resetAuthState();
      
      // Clear any local storage items related to auth as a fallback
      localStorage.removeItem('sb-auth-token');
      localStorage.removeItem('supabase-auth-token');
      
      // Verify logout worked
      const sessionCheck = await supabase.auth.getSession();
      if (sessionCheck.data.session) {
        console.warn('Session still exists after logout!');
      } else {
        console.log('Session successfully cleared');
      }
      
      // Show success and redirect
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error: any) {
      console.error('Sign out process failed:', error.message || 'Unknown error');
      
      // Force reset auth state even on error
      resetAuthState();
      
      // Try harder to clear session
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (e) {
        console.error('Forced sign out also failed:', e);
      }
      
      toast.error('Error during sign out, but session has been cleared');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    profile,
    isAdmin,
    loading,
    signIn,
    signUp,
    signOut,
    refreshSession
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
