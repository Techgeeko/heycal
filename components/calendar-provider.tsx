"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getGoogleAuthUrl } from '@/lib/services/google-auth';
import { toast } from 'sonner';

interface CalendarContextType {
  accessToken: string | null;
  isConnected: boolean;
  loading: boolean;
  connect: () => void;
  disconnect: () => void;
  setAccessToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const storedToken = localStorage.getItem('google_access_token');
    if (storedToken) {
      setAccessToken(storedToken);
    }
    setLoading(false);
  }, []);

  const connect = async () => {
    setLoading(true);
    try {
        const authUrl = await getGoogleAuthUrl();
        if (authUrl) {
            window.location.href = authUrl;
        } else {
            toast.error("Configuration Error: Could not connect to Google Calendar. The application's API credentials are not set up correctly.");
            setLoading(false);
        }
    } catch (error) {
        console.error("Error getting auth URL", error);
        toast.error("Connection Error: An unexpected error occurred while trying to connect to Google Calendar.");
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
    disconnect,
    setAccessToken,
    setLoading, 
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