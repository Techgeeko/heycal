import { listEvents } from './google-calendar';
import { format } from 'date-fns';
import type { Credentials } from 'google-auth-library';

export type CalendarEvent = {
  id: string;
  title: string;
  time: string;
  date: string;
};

export async function getUpcomingEvents(tokens: Credentials): Promise<CalendarEvent[]> {
  try {
    const googleEvents = await listEvents(tokens);

    if (!googleEvents) {
      return [];
    }

    return googleEvents
      .map((event) => {
        if (!event.id || !event.summary || !event.start) {
          return null;
        }

        const startDateTime = event.start.dateTime ? new Date(event.start.dateTime) : null;
        if (!startDateTime) return null;

        return {
          id: event.id,
          title: event.summary,
          date: format(startDateTime, 'MMMM do'),
          time: format(startDateTime, 'h:mm a'),
        };
      })
      .filter((event): event is CalendarEvent => event !== null);
  } catch (error) {
    console.error('Failed to get upcoming events:', error);
    return [];
  }
}