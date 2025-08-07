"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getGoogleAuthUrl } from '@/lib/services/google-auth';
import { toast } from 'sonner';
import type { Credentials } from 'google-auth-library';

interface CalendarContextType {
  tokens: Credentials | null;
  isConnected: boolean;
  loading: boolean;
  connect: () => void;
  disconnect: () => void;
  setTokens: (tokens: Credentials | null) => void;
  setLoading: (loading: boolean) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [tokens, setTokensState] = useState<Credentials | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const storedTokens = localStorage.getItem('google_tokens');
    if (storedTokens) {
      try {
        setTokensState(JSON.parse(storedTokens));
      } catch (e) {
        console.error("Failed to parse stored tokens", e);
        localStorage.removeItem('google_tokens');
      }
    }
    setLoading(false);
  }, []);

  const setTokens = (newTokens: Credentials | null) => {
    if (newTokens) {
        localStorage.setItem('google_tokens', JSON.stringify(newTokens));
    } else {
        localStorage.removeItem('google_tokens');
    }
    setTokensState(newTokens);
  }

  const connect = async () => {
    setLoading(true);
    try {
        const authUrl = await getGoogleAuthUrl();
         console.log("Generated auth URL:", authUrl);
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
    setTokens(null);
  };
  
  const value = { 
    tokens, 
    isConnected: !!tokens,
    loading,
    connect, 
    disconnect,
    setTokens,
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