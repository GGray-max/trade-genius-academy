import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
};

export type UserProfile = {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  avatar_url?: string;
  created_at: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileError) {
        console.error('Profile fetch error:', profileError);
        return null;
      }
      
      if (!profileData) {
        console.error('No profile data found for user:', userId);
        return null;
      }

      return profileData as UserProfile;
    } catch (error) {
      console.error('Profile fetch exception:', error);
      return null;
    }
  };

  const clearAuthState = async () => {
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
    // Clear any stored session data
    await supabase.auth.signOut();
    localStorage.removeItem('intendedUrl');
  };

  const refreshUserProfile = async () => {
    if (!user) {
      await clearAuthState();
      navigate('/login');
      return;
    }
    
    try {
      const profileData = await fetchProfile(user.id);
      if (profileData) {
        setProfile(profileData);
        setIsAdmin(profileData.role === 'admin');
      } else {
        await clearAuthState();
        toast.error('Failed to load profile. Please log in again.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Profile refresh error:', error);
      await clearAuthState();
      toast.error('Session expired. Please log in again.');
      navigate('/login');
    }
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const initAuth = async () => {
      try {
        // Check for existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session?.user) {
          if (mounted) {
            await clearAuthState();
            setLoading(false);
            
            const publicPages = ['/', '/signup', '/login', '/features', '/pricing', '/docs'];
            if (!publicPages.includes(location.pathname)) {
              navigate('/login');
            }
          }
          return;
        }

        // Valid session exists, set user
        if (mounted) {
          setUser(session.user);
        }

        // Fetch profile
        const profileData = await fetchProfile(session.user.id);
        
        if (!mounted) return;

        if (profileData) {
          setProfile(profileData);
          setIsAdmin(profileData.role === 'admin');
        } else {
          await clearAuthState();
          toast.error('Failed to load profile. Please log in again.');
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth init error:', error);
        if (mounted) {
          await clearAuthState();
          toast.error('Authentication error. Please log in again.');
          navigate('/login');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Initialize auth state
    initAuth();

    // Set up auth state change listener
    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT' || !session) {
        await clearAuthState();
        const publicPages = ['/', '/signup', '/login', '/features', '/pricing', '/docs'];
        if (!publicPages.includes(location.pathname)) {
          navigate('/login');
        }
        return;
      }

      if (session.user) {
        setUser(session.user);
        const profileData = await fetchProfile(session.user.id);
        
        if (!mounted) return;

        if (profileData) {
          setProfile(profileData);
          setIsAdmin(profileData.role === 'admin');
          
          if (location.pathname === '/login' || event === 'SIGNED_IN') {
            const intendedUrl = localStorage.getItem('intendedUrl') || '/dashboard';
            localStorage.removeItem('intendedUrl');
            navigate(intendedUrl);
          }
        } else {
          await clearAuthState();
          toast.error('Failed to load profile. Please log in again.');
          navigate('/login');
        }
      }
    });

    return () => {
      mounted = false;
      authListener.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      if (!data.user) {
        throw new Error('No user data received after login');
      }

      setUser(data.user);
      const profileData = await fetchProfile(data.user.id);
      
      if (!profileData) {
        throw new Error('Failed to fetch user profile');
      }

      setProfile(profileData);
      setIsAdmin(profileData.role === 'admin');
      toast.success('Logged in successfully');
      
      const intendedUrl = localStorage.getItem('intendedUrl') || '/dashboard';
      localStorage.removeItem('intendedUrl');
      navigate(intendedUrl);
    } catch (error: any) {
      console.error('Sign in error:', error);
      await clearAuthState();
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            username
          }
        }
      });
      if (error) throw error;
      if (data.user) {
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
        toast.success('Account created successfully! Please check your email for verification.');
        navigate('/login');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
      clearAuthState();
      navigate('/login');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await clearAuthState();
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
      // Force a clean state even if there's an error
      await clearAuthState();
      navigate('/login', { replace: true });
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
    refreshUserProfile
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
