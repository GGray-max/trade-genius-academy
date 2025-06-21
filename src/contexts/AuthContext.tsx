import { createContext, useContext, useEffect, useState, ReactNode, useRef, useCallback } from 'react';
import { supabase, debugSession, getTokenKey } from '@/lib/supabase';
import { User, Session, AuthError } from '@supabase/supabase-js';
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

// Debounce function to prevent rapid state changes
const debounce = <F extends (...args: any[]) => any>(func: F, wait: number): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<F>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

// Auth Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // State management
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use refs to track state and prevent race conditions
  const userRef = useRef<User | null>(null);
  const mountedRef = useRef(true);
  const initializingRef = useRef(false);
  const authListenerRef = useRef<{unsubscribe: () => void} | null>(null);

  // Public pages that don't require authentication
  const publicPages = ['/', '/login', '/signup', '/features', '/pricing', '/docs', '/marketplace'];

  // Fetch user profile from the database - memoized using useCallback to prevent recreating
  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    if (!userId) {
      console.error('Cannot fetch profile: userId is null or empty');
      return null;
    }
    
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
  }, []);

  // Reset auth state - memoized for consistent reference
  const resetAuthState = useCallback(() => {
    if (!mountedRef.current) return;
    
    console.log('Resetting auth state');
    userRef.current = null;
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
  }, []);

  // Refresh the current session - memoized for consistent reference
  const refreshSession = useCallback(async () => {
    if (initializingRef.current || !mountedRef.current) {
      console.log('Skipping session refresh - already initializing or unmounted');
      return;
    }
    
    try {
      console.log('Refreshing session...');
      setLoading(true);
      
      // Get current session state
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session refresh error:', error.message);
        resetAuthState();
        return;
      }
      
      if (!data.session) {
        console.log('No active session found during refresh');
        resetAuthState();
        return;
      }
      
      if (!mountedRef.current) return;
      
      // Update user state
      userRef.current = data.session.user;
      setUser(data.session.user);
      
      // Fetch and update profile
      const userProfile = await fetchUserProfile(data.session.user.id);
      
      if (!mountedRef.current) return;
      
      if (userProfile) {
        setProfile(userProfile);
        setIsAdmin(userProfile.role === 'admin');
      } else {
        console.error('No profile found for user during refresh');
        resetAuthState();
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      if (mountedRef.current) resetAuthState();
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [fetchUserProfile, resetAuthState]);

  // Initialize auth state once on component mount with improved stability
  useEffect(() => {
    console.log('Auth provider mounted');
    mountedRef.current = true;
    
    // Function to safely initialize auth state
    const initializeAuth = async () => {
      // Prevent multiple initializations
      if (initializingRef.current || !mountedRef.current) return;
      
      try {
        console.log('Initializing auth state');
        initializingRef.current = true;
        setLoading(true);
        
        // First check if we have a token in localStorage
        const tokenKey = getTokenKey();
        const tokenData = localStorage.getItem(tokenKey);
        console.log(`Token in localStorage (${tokenKey}):`, !!tokenData);
        
        // Always check session with Supabase regardless of localStorage
        // since the client may have auto-refreshed the token
        const { data, error } = await supabase.auth.getSession();
        
        // Handle early exit for unmounted component
        if (!mountedRef.current) return;
        
        // Error checking current session
        if (error) {
          console.error('Error getting session:', error.message);
          resetAuthState();
          setAuthInitialized(true);
          return;
        }
        
        // No active session from Supabase
        if (!data.session) {
          console.log('No active session found');
          resetAuthState();
          setAuthInitialized(true);
          return;
        }
        
        // We have a valid session, update state
        console.log('Valid session found:', data.session.user.email);
        userRef.current = data.session.user;
        setUser(data.session.user);
        
        // Fetch user profile
        const userProfile = await fetchUserProfile(data.session.user.id);
        
        if (!mountedRef.current) return;
        
        // Set user profile data if available
        if (userProfile) {
          console.log('Profile found:', userProfile.username);
          setProfile(userProfile);
          setIsAdmin(userProfile.role === 'admin');
          
          // Redirect from login page if already authenticated
          if (location.pathname === '/login') {
            navigate('/dashboard');
          }
        } else {
          console.error('No profile found for authenticated user');
          resetAuthState();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mountedRef.current) resetAuthState();
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          setAuthInitialized(true);
          initializingRef.current = false;
        }
      }
    };
    
    // Start auth initialization
    initializeAuth();
    
    // Set up auth state change listener to handle auth events
    const setupAuthListener = () => {
      console.log('Setting up auth state change listener');
      
      if (authListenerRef.current) {
        console.log('Cleaning up previous auth listener');
        authListenerRef.current.unsubscribe();
      }
      
      // Apply debounce to auth state changes to prevent rapid updates
      const debouncedStateChange = debounce(async (event: string, session: Session | null) => {
        if (!mountedRef.current) return;
        
        console.log(`Auth state changed: ${event}`, session ? `User: ${session.user.email}` : 'No session');
        
        if (event === 'SIGNED_IN' && session) {
          console.log('*** SIGN IN EVENT DETECTED ***');
          userRef.current = session.user;
          setUser(session.user);
          
          try {
            // Fetch profile for the signed-in user
            setLoading(true);
            const userProfile = await fetchUserProfile(session.user.id);
            
            if (!mountedRef.current) return;
            
            if (userProfile) {
              setProfile(userProfile);
              setIsAdmin(userProfile.role === 'admin');
              
              // Only redirect from login page
              if (location.pathname === '/login') {
                navigate('/dashboard');
              }
            } else {
              console.error('No profile found after sign in');
              resetAuthState();
              toast.error('Failed to load user profile');
            }
          } catch (error) {
            console.error('Error processing sign in event:', error);
            if (mountedRef.current) resetAuthState();
          } finally {
            if (mountedRef.current) setLoading(false);
          }
        } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
          console.log('*** SIGN OUT EVENT DETECTED ***');
          resetAuthState();
          
          // Redirect from protected pages only
          if (!publicPages.includes(location.pathname)) {
            navigate('/login');
          }
        }
      }, 100); // 100ms debounce for auth state changes
      
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        debouncedStateChange(event, session);
      });
      
      authListenerRef.current = data.subscription;
    };
    
    // Set up the auth listener
    setupAuthListener();
    
    // Clean up on unmount
    return () => {
      console.log('Auth provider unmounting');
      mountedRef.current = false;
      
      // Clean up auth listener
      if (authListenerRef.current) {
        console.log('Unsubscribing from auth state changes');
        authListenerRef.current.unsubscribe();
        authListenerRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this only runs once on mount

  // Sign in user with guaranteed session persistence
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('⚡ SIGN IN ATTEMPT');
      setLoading(true);
      
      // Don't allow sign in attempts during initialization
      if (initializingRef.current) {
        throw new Error('Authentication system is still initializing. Please try again.');
      }
      
      // Make sure we start with a clean state
      resetAuthState();
      
      // Clear any existing sessions to prevent conflicts
      console.log('Clearing any existing sessions...');
      await supabase.auth.signOut({ scope: 'global' });
      
      // Short delay to ensure clean slate
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Attempt to sign in
      console.log('Authenticating with Supabase...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
        // Supabase handles persistence automatically with browser localStorage
      });
      
      if (!mountedRef.current) return;
      
      // Handle authentication errors
      if (error) {
        console.error('Authentication error:', error.message);
        throw error;
      }
      
      if (!data.user || !data.session) {
        console.error('Missing user or session data');
        throw new Error('Login failed: missing user data');
      }
      
      // Verify successful authentication
      console.log('Authentication successful: ' + data.user.email);
      
      // Manually verify token storage for debugging
      const tokenKey = getTokenKey();
      const savedToken = localStorage.getItem(tokenKey);
      
      if (!savedToken) {
        console.warn('Token not found in localStorage after authentication');
        
        // Attempt manual token storage as fallback
        try {
          const tokenData = {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at
          };
          localStorage.setItem(tokenKey, JSON.stringify(tokenData));
          console.log('Manually stored authentication token');
        } catch (e) {
          console.error('Failed to manually set token:', e);
        }
      } else {
        console.log('Token successfully stored in localStorage');
      }
      
      // Update user state
      userRef.current = data.user;
      setUser(data.user);
      
      // Fetch user profile
      console.log('Fetching user profile...');
      const userProfile = await fetchUserProfile(data.user.id);
      
      if (!mountedRef.current) return;
      
      if (!userProfile) {
        console.error('Could not find user profile after login');
        throw new Error('Could not find user profile');
      }
      
      // Update profile state
      setProfile(userProfile);
      setIsAdmin(userProfile.role === 'admin');
      
      // Show success message and redirect
      toast.success('Logged in successfully');
      navigate('/dashboard');
      console.log('⚡ LOGIN COMPLETE ⚡');
      
    } catch (error: any) {
      console.error('Login failed:', error.message || 'Unknown error');
      if (mountedRef.current) {
        resetAuthState();
        toast.error(error.message || 'Failed to sign in');
      }
      throw error; // Rethrow so the login component can handle it
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [fetchUserProfile, resetAuthState, navigate]);

  // Sign up user with improved error handling
  const signUp = useCallback(async (email: string, password: string, username: string) => {
    if (initializingRef.current) {
      throw new Error('Authentication system is still initializing. Please try again.');
    }
    
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
      
      if (!mountedRef.current) return;
      
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
      
      if (!mountedRef.current) return;
      
      if (profileError) throw profileError;
      
      toast.success('Account created successfully!');
      navigate('/login');
    } catch (error: any) {
      console.error('Signup error:', error.message);
      if (mountedRef.current) {
        toast.error(error.message || 'Failed to create account');
      }
      throw error;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [navigate]);

  // Sign out user with improved reliability and cleanup
  const signOut = useCallback(async () => {
    try {
      console.log('Signing out user...');
      setLoading(true);
      
      // Execute the sign out with global scope to ensure complete logout
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (!mountedRef.current) return;
      
      if (error) {
        console.error('Supabase sign out error:', error.message);
        throw error;
      }
      
      // Reset auth state regardless of response
      resetAuthState();
      
      // Clear tokens from localStorage to ensure complete logout
      const tokenKey = getTokenKey();
      localStorage.removeItem(tokenKey);
      
      // Extra token cleanup for older versions of Supabase client
      try {
        localStorage.removeItem('sb-auth-token');
        localStorage.removeItem('supabase-auth-token');
      } catch (e) {
        console.error('Error clearing legacy tokens:', e);
      }
      
      // Show success and redirect
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error: any) {
      console.error('Sign out process failed:', error.message || 'Unknown error');
      
      if (mountedRef.current) {
        // Force reset auth state even on error
        resetAuthState();
        toast.error('Error during sign out, but session has been cleared');
        navigate('/');
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [navigate, resetAuthState]);

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
