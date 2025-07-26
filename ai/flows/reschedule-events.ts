
'use server';

/**
 * @fileOverview A flow for rescheduling events based on natural language input.
 *
 * - rescheduleEvent - A function that handles the rescheduling process.
 * - RescheduleEventInput - The input type for the rescheduleEvent function.
 * - RescheduleEventOutput - The return type for the rescheduleEvent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { listEvents, rescheduleEvent as rescheduleCalendarEvent } from '@/lib/services/google-calendar';
import { fromZonedTime } from 'date-fns-tz';

const RescheduleEventInputSchema = z.object({
  command: z.string().describe('The user\'s command to reschedule an event.'),
  accessToken: z.string().describe('The user\'s Google Calendar access token.'),
  userTimezone: z.string().describe('The IANA timezone of the user (e.g., "America/New_York").'),
});
export type RescheduleEventInput = z.infer<typeof RescheduleEventInputSchema>;

const RescheduleEventOutputSchema = z.object({
  success: z.boolean().describe('Whether the event was successfully rescheduled.'),
  message: z.string().describe('A message indicating the result of the rescheduling attempt.'),
});
export type RescheduleEventOutput = z.infer<typeof RescheduleEventOutputSchema>;

export async function rescheduleEvent(input: RescheduleEventInput): Promise<RescheduleEventOutput> {
  return rescheduleEventFlow(input);
}


const RescheduleDetailsSchema = z.object({
  eventName: z.string().describe("The name or title of the event to be rescheduled."),
  newStartTime: z.string().describe("The new start time for the event in ISO 8601 format."),
  newEndTime: z.string().describe("The new end time for the event in ISO 8601 format. If not specified, calculate it based on original event duration."),
});

const rescheduleEventPrompt = ai.definePrompt({
  name: 'rescheduleEventPrompt',
  input: {schema: z.object({ command: z.string(), referenceTime: z.string() })},
  output: {schema: RescheduleDetailsSchema},
  prompt: `You are an expert at extracting rescheduling details from a user's query.
The current date and time is {{referenceTime}}.
Extract the original event name and the new start and end times from the user's command.

Command: {{{command}}}

Infer the new date and time based on the reference time.
The output times must be in full ISO 8601 format, including the timezone offset.
If no end time is specified, you must calculate it by assuming the event has the same duration as before. For now, assume a default duration of 1 hour if the original duration is unknown.`,
});

const rescheduleEventFlow = ai.defineFlow(
  {
    name: 'rescheduleFlow',
    inputSchema: RescheduleEventInputSchema,
    outputSchema: RescheduleEventOutputSchema,
  },
  async (input) => {
    try {
        const referenceTime = new Date().toISOString();
        const { output: details } = await rescheduleEventPrompt({ command: input.command, referenceTime });

        if (!details?.eventName || !details.newStartTime || !details.newEndTime) {
            return { success: false, message: "I'm not sure which event you want to move or when to move it to. Could you be more specific?" };
        }

        const events = await listEvents(input.accessToken);
        const eventToReschedule = events.find(e => e.summary?.toLowerCase().includes(details.eventName.toLowerCase()));

        if (!eventToReschedule || !eventToReschedule.id) {
            return { success: false, message: `I couldn't find an event called "${details.eventName}" to reschedule.` };
        }

        const rescheduledEvent = await rescheduleCalendarEvent(input.accessToken, eventToReschedule.id, details.newStartTime, details.newEndTime);

        if (rescheduledEvent) {
            const startTime = fromZonedTime(details.newStartTime, input.userTimezone);
            const formattedTime = new Intl.DateTimeFormat('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
            }).format(startTime);
            return { success: true, message: `OK, I've rescheduled "${eventToReschedule.summary}" to ${formattedTime}.` };
        } else {
            return { success: false, message: "Sorry, I couldn't reschedule that event. Please try again." };
        }

    } catch (e) {
        console.error(e);
        return { success: false, message: "An unexpected error occurred while rescheduling your event." };
    }
  }
);