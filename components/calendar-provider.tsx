"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getGoogleAuthUrl, getGoogleAccessToken } from '@/lib/services/google-auth';

interface CalendarContextType {
  accessToken: string | null;
  isConnected: boolean;
  loading: boolean;
  connect: () => void;
  disconnect: () => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCallback = useCallback(async () => {
    const code = searchParams.get('code');

    if (code) {
      setLoading(true);
      try {
        const token = await getGoogleAccessToken(code);
        if (token) {
          localStorage.setItem('google_access_token', token);
          setAccessToken(token);
        }
      } catch (error) {
        console.error('Error exchanging code for token', error);
      } finally {
        router.replace('/integrations');
        setLoading(false);
      }
    } else {
        setLoading(false);
    }
  }, [router, searchParams]);

  useEffect(() => {
    const storedToken = localStorage.getItem('google_access_token');
    if (storedToken) {
      setAccessToken(storedToken);
      setLoading(false);
    } else if(searchParams.has('code')) {
      handleCallback();
    } else {
      setLoading(false);
    }
  }, [handleCallback, searchParams]);

  const connect = async () => {
    setLoading(true);
    try {
        const authUrl = await getGoogleAuthUrl();
        window.location.href = authUrl;
    } catch (error) {
        console.error("Error getting auth URL", error);
        setLoading(false);
    }
  };

  const disconnect = () => {
    localStorage.removeItem('google_access_token');
    setAccessToken(null);
  };
  
  const value = { 
    accessToken, 
    isConnected: !!accessToken,
    loading,
    connect, 
    disconnect 
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
}
