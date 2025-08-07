'use server';

/**
 * @fileOverview A flow for scheduling events using natural language.
 *
 * - scheduleEvent - A function that handles the event scheduling process.
 * - ScheduleEventInput - The input type for the scheduleEvent function.
 * - ScheduleEventOutput - The return type for the scheduleEvent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { createEvent } from '@/lib/services/google-calendar';
import { fromZonedTime } from 'date-fns-tz';
import type { Credentials } from 'google-auth-library';

const ScheduleEventInputSchema = z.object({
  description: z.string().describe('The user\'s request to schedule an event.'),
  tokens: z.custom<Credentials>().describe('The user\'s Google Calendar credentials object.'),
  userTimezone: z.string().describe('The IANA timezone of the user (e.g., "America/New_York").'),
});
export type ScheduleEventInput = z.infer<typeof ScheduleEventInputSchema>;

const ScheduleEventOutputSchema = z.object({
  success: z.boolean().describe('Whether the event was successfully scheduled.'),
  message: z.string().describe('A confirmation message or an error message.'),
});
export type ScheduleEventOutput = z.infer<typeof ScheduleEventOutputSchema>;

export async function scheduleEvent(input: ScheduleEventInput): Promise<ScheduleEventOutput> {
  return scheduleEventFlow(input);
}

const EventDetailsSchema = z.object({
  title: z.string().describe("The title or summary of the event."),
  startTime: z.string().describe("The start time of the event in ISO 8601 format."),
  endTime: z.string().describe("The end time of the event in ISO 8601 format. If not specified, default to one hour after start time."),
});

const prompt = ai.definePrompt({
  name: 'extractEventDetailsPrompt',
  input: {schema: z.object({ description: z.string(), referenceTime: z.string() })},
  output: {schema: EventDetailsSchema},
  prompt: `You are an expert at extracting event details from a user's query.
The current date and time is {{referenceTime}}.
Extract the event details from the user's description.

Description: {{{description}}}

Infer the date and time based on the reference time.
The output times must be in full ISO 8601 format, including the timezone offset.`,
});

const scheduleEventFlow = ai.defineFlow(
  {
    name: 'scheduleEventFlow',
    inputSchema: ScheduleEventInputSchema,
    outputSchema: ScheduleEventOutputSchema,
  },
  async (input) => {
    try {
      const referenceTime = new Date().toISOString();
      const { output: eventDetails } = await prompt({ description: input.description, referenceTime });

      if (!eventDetails?.title || !eventDetails.startTime || !eventDetails.endTime) {
        return { success: false, message: "I'm sorry, I couldn't figure out the details for that event. Could you be a bit more specific about the title and time?" };
      }

      const createdEvent = await createEvent(input.tokens, {
        summary: eventDetails.title,
        start: { dateTime: eventDetails.startTime, timeZone: input.userTimezone },
        end: { dateTime: eventDetails.endTime, timeZone: input.userTimezone },
      });

      if (createdEvent) {
        const startTime = fromZonedTime(eventDetails.startTime, input.userTimezone);
        const formattedTime = new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(startTime);
        return { success: true, message: `OK, I've scheduled "${eventDetails.title}" for you on ${formattedTime}.` };
      } else {
        return { success: false, message: "Sorry, I wasn't able to schedule that event on your Google Calendar. Please try again." };
      }
    } catch(e) {
        console.error(e);
        return { success: false, message: "An unexpected error occurred while scheduling your event."};
    }
  }
);