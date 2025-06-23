
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';

// Create a new QueryClient for each test
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({ children }: AllTheProvidersProps) => {
  const queryClient = createTestQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock data helpers
export const mockBot = {
  id: '1',
  name: 'Test Bot',
  description: 'A test trading bot',
  createdBy: {
    id: '1',
    name: 'Test User',
    email: 'test@example.com'
  },
  strategy: {
    type: 'trend_following',
    description: 'Follows market trends',
    market: 'forex',
    timeFrame: '1h'
  },
  riskLevel: 'medium' as const,
  performance: {
    roi: 25.5,
    winRate: 65.2,
    drawdown: 12.3,
    tradesPerDay: 3.5,
    totalTrades: 150,
    avgProfitPerTrade: 2.1,
    rating: 4.2
  },
  price: {
    monthly: 49.99,
    yearly: 499.99,
    currency: 'USD'
  },
  isActive: true
};

export const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'user' as const
};
