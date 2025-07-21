
'use server';

import { google } from 'googleapis';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

function getOAuth2Client() {
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error('Google API credentials are not set in .env');
  }
   // This is a hack to get the redirect URI, since window is not available on the server.
   // In a real app, this should be a fixed value from your config.
  const redirectUri = process.env.NODE_ENV === 'production' 
    ? 'https://your-production-url.com/integrations'
    : 'http://localhost:3000/integrations';


  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    redirectUri
  );
}

export async function getGoogleAuthUrl(): Promise<string> {
    const oauth2Client = getOAuth2Client();
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar'],
        // prompt: 'consent' // Use this to always force consent screen
    });
    return authUrl;
}

export async function getGoogleAccessToken(code: string): Promise<string | null> {
    const oauth2Client = getOAuth2Client();
    try {
        const { tokens } = await oauth2Client.getToken(code);
        return tokens.access_token || null;
    } catch (error) {
        console.error('Error getting access token', error);
        return null;
    }
}