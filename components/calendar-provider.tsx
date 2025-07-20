
"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { google } from 'googleapis';
import { useRouter } from 'next/navigation';

// Note: In a real app, these should come from the server and be handled securely.
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}/integrations` : '';

interface CalendarContextType {
  accessToken: string | null;
  isConnected: boolean;
  loading: boolean;
  connect: () => void;
  disconnect: () => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

function getOAuth2Client() {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error("Google API credentials are not set in .env.local");
    return null;
  }
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );
}

export function CalendarProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleCallback = useCallback(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      setLoading(true);
      const oauth2Client = getOAuth2Client();
      if (oauth2Client) {
        try {
          const { tokens } = await oauth2Client.getToken(code);
          if (tokens.access_token) {
            localStorage.setItem('google_access_token', tokens.access_token);
            setAccessToken(tokens.access_token);
          }
        } catch (error) {
          console.error('Error exchanging code for token', error);
        } finally {
            router.replace('/integrations');
            setLoading(false);
        }
      }
    } else {
        setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const storedToken = localStorage.getItem('google_access_token');
    if (storedToken) {
      setAccessToken(storedToken);
      setLoading(false);
    } else {
      handleCallback();
    }
  }, [handleCallback]);

  const connect = () => {
    const oauth2Client = getOAuth2Client();
    if (oauth2Client) {
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/calendar'],
        });
        window.location.href = authUrl;
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