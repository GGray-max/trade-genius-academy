
import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get the session token
const getSessionToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data?.session?.access_token;
};

// Helper function to get user ID
const getUserId = async () => {
  const { data } = await supabase.auth.getSession();
  return data?.session?.user?.id;
};

// Generic fetch API function with authentication headers
export const fetchApi = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const sessionToken = await getSessionToken();
  const userId = await getUserId();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(sessionToken && { 'Authorization': `Bearer ${sessionToken}` }),
    ...(userId && { 'User-Id': userId }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }

  return data;
};

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    return fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  signup: async (email: string, password: string, username: string) => {
    return fetchApi('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    });
  },
  
  validateSession: async (sessionToken: string) => {
    return fetchApi('/auth/validate-session', {
      method: 'POST',
      body: JSON.stringify({ session_token: sessionToken }),
    });
  },
  
  logout: async (sessionToken: string) => {
    return fetchApi('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ session_token: sessionToken }),
    });
  },
};

// User API
export const userApi = {
  getProfile: async (userId: string) => {
    return fetchApi(`/users/${userId}`);
  },
  
  updateProfile: async (userId: string, data: { username?: string; avatar_url?: string }) => {
    return fetchApi(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  getAdmins: async () => {
    return fetchApi('/users/admins');
  },
};

// Bot API
export const botApi = {
  getAllBots: async (filters?: { strategy?: string; risk_level?: string; market?: string }) => {
    const queryParams = new URLSearchParams();
    
    if (filters?.strategy) queryParams.append('strategy', filters.strategy);
    if (filters?.risk_level) queryParams.append('risk_level', filters.risk_level);
    if (filters?.market) queryParams.append('market', filters.market);
    
    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchApi(`/bots${query}`);
  },
  
  getAdminBots: async () => {
    return fetchApi('/bots/admin');
  },
  
  getBotById: async (botId: string) => {
    return fetchApi(`/bots/${botId}`);
  },
  
  createBot: async (botData: {
    name: string;
    description: string;
    strategy: string;
    risk_level: string;
    market: string;
    price_monthly: number;
    price_yearly: number;
    currency: string;
    tags?: string[];
  }) => {
    return fetchApi('/bots', {
      method: 'POST',
      body: JSON.stringify(botData),
    });
  },
  
  updateBot: async (
    botId: string,
    botData: {
      name?: string;
      description?: string;
      strategy?: string;
      risk_level?: string;
      market?: string;
      price_monthly?: number;
      price_yearly?: number;
      currency?: string;
      tags?: string[];
      is_active?: boolean;
    }
  ) => {
    return fetchApi(`/bots/${botId}`, {
      method: 'PUT',
      body: JSON.stringify(botData),
    });
  },
  
  deleteBot: async (botId: string) => {
    return fetchApi(`/bots/${botId}`, {
      method: 'DELETE',
    });
  },
  
  toggleBotStatus: async (botId: string) => {
    return fetchApi(`/bots/${botId}/toggle-status`, {
      method: 'PATCH',
    });
  },
};

// Bot Requests API
export const botRequestsApi = {
  createRequest: async (requestData: {
    title: string;
    description: string;
    strategy: string;
    risk_level: string;
    market: string;
    budget?: string;
    admin_id?: string;
  }) => {
    return fetchApi('/bot-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },
  
  getUserRequests: async () => {
    return fetchApi('/bot-requests/user');
  },
  
  getAdminRequests: async () => {
    return fetchApi('/bot-requests/admin');
  },
  
  getAllRequests: async () => {
    return fetchApi('/bot-requests/all');
  },
  
  getRequestById: async (requestId: string) => {
    return fetchApi(`/bot-requests/${requestId}`);
  },
  
  updateRequestStatus: async (requestId: string, status: 'pending' | 'in_progress' | 'completed' | 'rejected') => {
    return fetchApi(`/bot-requests/${requestId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
  
  assignRequest: async (requestId: string) => {
    return fetchApi(`/bot-requests/${requestId}/assign`, {
      method: 'PATCH',
    });
  },
};
