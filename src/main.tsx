
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Log environment variables availability for debugging
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn(
    'Supabase environment variables are missing. The app will use placeholder values for development, but authentication and database features will not work correctly.'
  );
}

createRoot(document.getElementById('root')!).render(<App />);
