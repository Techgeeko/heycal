'use server';

import { google } from 'googleapis';
import type { calendar_v3 } from 'googleapis';
import { addMinutes, isBefore, parseISO } from 'date-fns';
import { toDate } from 'date-fns-tz';

function getOAuth2Client() {
  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error('Google API credentials are not set in .env');
    return null;
  }
  
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const redirectUri = `${appUrl}/integrations`;

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
    });
    return authUrl;
}

export async function getGoogleAccessToken(code: string): Promise<string | null> {
    const oauth2Client = getOAuth2Client();
    if (!oauth2Client) {
      console.error('Google API credentials are not set in .env. Cannot get access token.');
      return null;
    }
    try {
        const { tokens } = await oauth2Client.getToken(code);
        return tokens.access_token || null;
    } catch (error) {
        console.error('Error getting access token', error);
        return null;
    }
}

function createOAuth2Client(accessToken: string) {
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({ access_token: accessToken });
    return oAuth2Client;
}

export async function listEvents(accessToken: string): Promise<calendar_v3.Schema$Event[]> {
  if (!accessToken) {
    console.error('No access token provided for listEvents');
    return [];
  }
  try {
    const auth = createOAuth2Client(accessToken);
    const calendar = google.calendar({ version: 'v3', auth });
    
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error);
    return [];
  }
}

export async function createEvent(accessToken: string, event: calendar_v3.Schema$Event): Promise<calendar_v3.Schema$Event | null> {
    if (!accessToken) {
        console.error('No access token provided for createEvent');
        return null;
    }
    try {
        const auth = createOAuth2Client(accessToken);
        const calendar = google.calendar({ version: 'v3', auth });
        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
        });
        return response.data;
    } catch (error) {
        console.error('Error creating Google Calendar event:', error);
        return null;
    }
}

export async function deleteEvent(accessToken: string, eventId: string): Promise<boolean> {
    if (!accessToken) {
        console.error('No access token provided for deleteEvent');
        return false;
    }
    try {
        const auth = createOAuth2Client(accessToken);
        const calendar = google.calendar({ version: 'v3', auth });
        await calendar.events.delete({
            calendarId: 'primary',
            eventId: eventId,
        });
        return true;
    } catch (error) {
        console.error('Error deleting Google Calendar event:', error);
        return false;
    }
}

export async function rescheduleEvent(accessToken: string, eventId: string, start: string, end: string): Promise<calendar_v3.Schema$Event | null> {
    if (!accessToken) {
        console.error('No access token provided for rescheduleEvent');
        return null;
    }
    try {
        const auth = createOAuth2Client(accessToken);
        const calendar = google.calendar({ version: 'v3', auth });
        const response = await calendar.events.patch({
            calendarId: 'primary',
            eventId,
            requestBody: {
                start: { dateTime: start },
                end: { dateTime: end },
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error rescheduling Google Calendar event:', error);
        return null;
    }
}

export async function findFreeTimeSlots(accessToken: string, { timeMin, timeMax, durationMinutes, userTimezone }: { timeMin: string, timeMax: string, durationMinutes: number, userTimezone: string }): Promise<{start: string, end: string}[]> {
    if (!accessToken) {
        console.error('No access token provided for findFreeTimeSlots');
        return [];
    }
    try {
        const auth = createOAuth2Client(accessToken);
        const calendar = google.calendar({ version: 'v3', auth });
        
        const response = await calendar.freebusy.query({
            requestBody: {
                timeMin,
                timeMax,
                timeZone: userTimezone,
                items: [{ id: 'primary' }],
            },
        });

        const busySlots = response.data.calendars?.primary.busy || [];
        const freeSlots = [];

        let searchStart = toDate(timeMin, { timeZone: userTimezone });
        const searchEnd = toDate(timeMax, { timeZone: userTimezone });

        // Add current time to busy slots to avoid scheduling in the past
        const now = new Date();
        if (isBefore(searchStart, now)) {
            searchStart = now;
        }

        const allSlots = [...busySlots].map(s => ({
            start: toDate(s.start!, { timeZone: userTimezone }),
            end: toDate(s.end!, { timeZone: userTimezone })
        })).sort((a, b) => a.start.getTime() - b.start.getTime());
        
        let currentPointer = searchStart;

        for (const slot of allSlots) {
            if (isBefore(currentPointer, slot.start)) {
                const potentialEnd = addMinutes(currentPointer, durationMinutes);
                if (!isBefore(slot.start, potentialEnd)) {
                    // Not enough space
                } else {
                     freeSlots.push({ start: currentPointer.toISOString(), end: slot.start.toISOString() });
                }
            }
            currentPointer = slot.end > currentPointer ? slot.end : currentPointer;
        }

        // Check for free time after the last busy slot
        if (isBefore(currentPointer, searchEnd)) {
             freeSlots.push({ start: currentPointer.toISOString(), end: searchEnd.toISOString() });
        }
        
        // Filter slots to ensure they are long enough for the requested duration
        const result = freeSlots.map(slot => ({
            start: parseISO(slot.start),
            end: parseISO(slot.end)
        })).filter(slot => {
            const potentialEnd = addMinutes(slot.start, durationMinutes);
            return !isBefore(slot.end, potentialEnd);
        }).map(slot => ({
            start: slot.start.toISOString(),
            end: addMinutes(slot.start, durationMinutes).toISOString()
        }));

        return result;

    } catch (error) {
        console.error('Error finding free time slots:', error);
        return [];
    }
}