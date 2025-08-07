'use server';

import { google } from 'googleapis';
import type { Credentials } from 'google-auth-library';

function getOAuth2Client() {
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('Google API credentials are not set in .env');
    return null;
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  // const redirectUri = `${appUrl}/chat`;
  const redirectUri = 'https://heycal.vercel.app/integrations'

  return new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );
}

export async function getGoogleAuthUrl(): Promise<string> {
    const oauth2Client = getOAuth2Client();
    if (!oauth2Client) {
      console.error('Google API credentials are not set in .env. Cannot generate auth URL.');
      return '';
    }
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar'],
        prompt: 'consent',
    });
    return authUrl;
}

export async function getGoogleAccessToken(code: string): Promise<Credentials | null> {
    const oauth2Client = getOAuth2Client();
    if (!oauth2Client) {
      console.error('Google API credentials are not set in .env. Cannot get access token.');
      return null;
    }
    try {
        const { tokens } = await oauth2Client.getToken(code);
        return tokens;
    } catch (error) {
        console.error('Error getting access token', error);
        return null;
    }
}
