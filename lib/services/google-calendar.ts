
'use server';

import { google } from 'googleapis';
import type { calendar_v3 } from 'googleapis';

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