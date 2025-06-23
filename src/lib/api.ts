import axios, { AxiosError, AxiosResponse } from 'axios';
import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Export the api instance for direct use
export { api };

// Request interceptor for auth and request logging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('replit-auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add user ID for backend validation
    const userId = localStorage.getItem('user-id');
    if (userId) {
      config.headers['User-Id'] = userId;
    }

    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: 'An unexpected error occurred',
      statusCode: error.response?.status,
    };

    if (error.response?.data) {
      const errorData = error.response.data as any;
      apiError.message = errorData.message || errorData.error || apiError.message;
      apiError.code = errorData.code;
      apiError.details = errorData.details;
    } else if (error.request) {
      apiError.message = 'Network error - please check your connection';
    } else {
      apiError.message = error.message;
    }

    // Handle auth errors globally
    if (error.response?.status === 401) {
      localStorage.removeItem('replit-auth-token');
      localStorage.removeItem('user-id');
      window.location.href = '/login';
    }

    // Log errors
    console.error('API Error:', apiError);

    return Promise.reject(apiError);
  }
);

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

// Generic fetch API function using axios
export const fetchApi = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  try {
    const sessionToken = await getSessionToken();
    const userId = await getUserId();

    const headers = {
      'Content-Type': 'application/json',
      ...(sessionToken && { 'Authorization': `Bearer ${sessionToken}` }),
      ...(userId && { 'User-Id': userId }),
      ...options.headers,
    };

    const response = await api(`${endpoint}`, { // Use axios instance
      ...options,
      headers,
      ...(options.body ? { data: options.body } : {}), // Axios uses `data` for body
      method: options.method,
    });

    return response.data; // Axios wraps response in a `data` object

  } catch (error: any) {
    // Error is already handled by the interceptor, re-throw it
    throw error;
  }
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