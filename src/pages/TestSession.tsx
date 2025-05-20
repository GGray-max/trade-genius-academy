import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase, debugSession, getTokenKey } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';

export default function TestSession() {
  const { user, profile, signOut } = useAuth();
  const [sessionData, setSessionData] = useState<any>(null);
  const [localStorageData, setLocalStorageData] = useState<string | null>(null);
  
  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);
  
  const checkSession = async () => {
    // Check Supabase session
    const { data } = await supabase.auth.getSession();
    setSessionData(data.session);
    
    // Check localStorage
    const tokenKey = getTokenKey();
    const token = localStorage.getItem(tokenKey);
    setLocalStorageData(token);
  };
  
  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  };
  
  const forceRefreshSession = async () => {
    const { data } = await supabase.auth.refreshSession();
    setSessionData(data.session);
    await debugSession();
  };
  
  const clearStorage = () => {
    const tokenKey = getTokenKey();
    localStorage.removeItem(tokenKey);
    setLocalStorageData(null);
    window.location.reload();
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-4">Session Test Page</h1>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-2">Current User:</h2>
          {user ? (
            <div>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>ID:</strong> {user.id}</p>
              {profile && (
                <p><strong>Username:</strong> {profile.username}</p>
              )}
            </div>
          ) : (
            <p className="text-red-500">No user is logged in</p>
          )}
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-2">Session Status:</h2>
          <p><strong>Token key:</strong> {getTokenKey()}</p>
          <p><strong>Has localStorage token:</strong> {localStorageData ? 'Yes' : 'No'}</p>
          <p><strong>Has valid session:</strong> {sessionData ? 'Yes' : 'No'}</p>
          {sessionData && (
            <p><strong>Expires at:</strong> {new Date(sessionData.expires_at * 1000).toLocaleString()}</p>
          )}
        </div>
        
        <div className="flex space-x-4 mt-4">
          <Button onClick={checkSession} className="bg-blue-500 hover:bg-blue-600">
            Check Session
          </Button>
          
          <Button onClick={forceRefreshSession} className="bg-green-500 hover:bg-green-600">
            Force Refresh Session
          </Button>
          
          <Button onClick={clearStorage} className="bg-yellow-500 hover:bg-yellow-600">
            Clear Storage
          </Button>
          
          <Button onClick={handleSignOut} className="bg-red-500 hover:bg-red-600">
            Sign Out
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
