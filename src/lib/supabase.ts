import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL or Anonymous Key not found in environment variables. ' +
    'Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

// Create Supabase client with GUARANTEED session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // CRITICAL: These settings MUST be correct for session persistence
    persistSession: true,
    
    // This MUST be the default Supabase key name
    // DO NOT change this value as it will break persistence
    storageKey: 'sb-' + supabaseUrl.split('//')[1].split('.')[0] + '-auth-token',
    
    // Always use browser localStorage - this is crucial
    storage: localStorage,
    
    // Essential for maintaining login state
    autoRefreshToken: true,
    
    // Disable URL detection which can cause issues
    detectSessionInUrl: false,
    
    flowType: 'implicit',
  },
});

// Calculate the correct Supabase token key name
export const getTokenKey = () => {
  try {
    return 'sb-' + supabaseUrl.split('//')[1].split('.')[0] + '-auth-token';
  } catch (e) {
    console.error('Error generating token key:', e);
    return 'sb-auth-token'; // Fallback
  }
};

// Debug session state with improved diagnostics
export const debugSession = async () => {
  try {
    const tokenKey = getTokenKey();
    console.group('🔍 Supabase Session Debug');
    
    // Check localStorage for the correct token
    const tokenValue = localStorage.getItem(tokenKey);
    console.log(`Token key: ${tokenKey}`);
    console.log(`Token exists in localStorage: ${!!tokenValue}`);
    
    if (tokenValue) {
      try {
        // Safely attempt to parse the token to see if it's valid JSON
        const parsedToken = JSON.parse(tokenValue);
        console.log('Token format valid:', !!parsedToken);
        console.log('Token contains access_token:', !!parsedToken?.access_token);
        console.log('Token contains refresh_token:', !!parsedToken?.refresh_token);
      } catch (e) {
        console.error('Token is not valid JSON:', e);
      }
    }
    
    // Get current session directly from Supabase
    const { data, error } = await supabase.auth.getSession();
    console.log('Supabase getSession() result:', data.session ? 'Valid Session' : 'No Session');
    
    if (error) {
      console.error('Session error:', error);
    }
    
    if (data.session) {
      console.log('User ID:', data.session.user.id);
      console.log('User email:', data.session.user.email);
      const expiresAt = new Date(data.session.expires_at * 1000);
      console.log('Session expires at:', expiresAt.toLocaleString());
      console.log('Time until expiry:', Math.round((expiresAt.getTime() - Date.now()) / 1000 / 60), 'minutes');
    }
    
    console.groupEnd();
    return data.session;
  } catch (error) {
    console.error('Debug session error:', error);
    console.groupEnd();
    return null;
  }
};

// Force refresh the user session
export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Session refresh error:', error.message);
      return null;
    }
    return data.session;
  } catch (error) {
    console.error('Session refresh exception:', error);
    return null;
  }
};
